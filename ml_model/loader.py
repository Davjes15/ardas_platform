import pickle
import pandas as pd
import numpy as np
import re
import shap
from pathlib import Path
from typing import Dict, Optional
from sklearn.base import BaseEstimator
from collections import defaultdict

features_obj_path = Path(__file__).resolve().parents[1] / "static" / "hs_database" / "new_features_hs_.obj"
model_base_dir = Path(__file__).resolve().parents[1] / "ml_model"

MODEL_REGISTRY = {
    "logistic_regression": ("load_sklearn_model", "predict_sklearn", "linear"),
    "random_forest": ("load_sklearn_model", "predict_sklearn", "tree"),
    # Future placeholder for deep learning models like LSTM
    # "lstm": ("load_lstm_model", "predict_lstm", "deep")
}

# Label-to-class-index mapping based on your documentation
CLASS_VALUE_TO_INDEX = {
    "cooler": {3: 0, 20: 1, 100: 2},
    "valve": {73: 0, 80: 1, 90: 2, 100: 3},
    "pump": {2: 0, 1: 1, 0: 2},
    "acc": {90: 0, 100: 1, 115: 2, 130: 3}
}


def load_sklearn_model(path: Path) -> BaseEstimator:
    """
    Loads a scikit-learn model from a pickle file.
    Args:
        path (Path): Path to the model file.
    Returns:
        BaseEstimator: The loaded scikit-learn model.
    """
    with open(path, 'rb') as f:
        return pickle.load(f)


def predict_sklearn(model: BaseEstimator, features: pd.DataFrame) -> str:
    """
    Uses a scikit-learn model to make predictions and formats the result.
    Args:
        model (BaseEstimator): The loaded scikit-learn model.
        features (pd.DataFrame): The features for prediction.
    Returns:
        str: The formatted prediction result.
    """
    prediction = model.predict(features)
    return f"{float(prediction):.2f}"


def get_latest_model_dir() -> Path:
    """
    Finds the latest timestamped model directory (format: YYYYMMDD_HHMMSS).
    """
    version_dirs = [d for d in model_base_dir.iterdir() if d.is_dir() and re.match(r"\d{8}_\d{6}", d.name)]
    if not version_dirs:
        raise FileNotFoundError("No versioned model directories found in ml_model.")
    latest_dir = max(version_dirs, key=lambda d: d.name)
    return latest_dir


def select_features(cycle: int, features_data: pd.DataFrame) -> pd.DataFrame:
    """
    Selects the feature row corresponding to a specific cycle.
    Args:
        cycle (int): The cycle number to select features for.
        features_data (pd.DataFrame): The DataFrame containing all features.
    Returns:
        pd.DataFrame: A DataFrame containing the features for the specified cycle.
    """
    if cycle not in features_data.index:
        raise ValueError(f"Cycle {cycle} not found in features dataset.")
    return pd.DataFrame(features_data.loc[cycle]).T


def find_model_file(model_type: str, suffix: str) -> Optional[Path]:
    """
    Looks inside the latest model directory for a model file matching the naming pattern.
    Args:
        model_type (str): The type of model (e.g., 'random_forest').
        suffix (str): The suffix to match in the filename (e.g., 'cvpa').
    Returns:
        Optional[Path]: The path to the model file if found, otherwise None.
    """
    model_dir = get_latest_model_dir()
    pattern = re.compile(rf"{model_type}_{suffix}(_\d{{8}}_\d{{6}})?\.pkl")
    candidates = [f for f in model_dir.glob("*.pkl") if pattern.fullmatch(f.name)]

    if not candidates:
        return None

    candidates.sort(key=lambda f: f.name)
    selected = candidates[-1]
    print(f"📌 Selected model file: {selected.name}")
    return selected


def get_predictions(model_type: str, cycle: int) -> Dict[str, dict]:
    """
    Generates predictions for each component using the specified model type and cycle.
    Args:
        model_type (str): The type of model to use (e.g., 'random_forest').
        cycle (int): The cycle number to predict.
    Returns:
        Dict[str, str]: A dictionary containing predictions for each component.
    """
    if model_type not in MODEL_REGISTRY:
        raise ValueError(f"Model type '{model_type}' not supported.")

    load_func_name, predict_func_name, shap_type = MODEL_REGISTRY[model_type]
    load_func = globals()[load_func_name]
    predict_func = globals()[predict_func_name]

    # Load feature data
    print("📥 Loading feature data...")
    with open(features_obj_path, 'rb') as handle:
        features_data = pickle.load(handle)
    selected_features = select_features(cycle, features_data)
    print(f"📊 Selected features for cycle {cycle}:")

    predictions = {}
    for suffix, label in zip("cvpa", ["cooler", "valve", "pump", "acc"]):
        model_file = find_model_file(model_type, suffix)
        print(model_file)
        if not model_file:
            predictions[label] = {"error": "Model not found"}
            continue
        model = load_func(model_file)

        try:
            # Run prediction via registry func
            raw_prediction = predict_func(model, selected_features)
            y_pred_value = int(float(raw_prediction))
            print(f"🔍 Prediction for {label}: {y_pred_value}")

            # Confidence score
            if hasattr(model, "predict_proba"):
                y_proba = model.predict_proba(selected_features)[0]
                value_to_index = CLASS_VALUE_TO_INDEX[label]
                if y_pred_value not in value_to_index:
                    raise ValueError(f"Predicted value {y_pred_value} not valid for component {label}")
                y_pred = value_to_index[y_pred_value]
                confidence = round(float(y_proba[y_pred]), 3)
            else:
                confidence = None  # fallback if not available

            # Get SHAP explainer based on type
            if shap_type == "tree":
                explainer = shap.TreeExplainer(model)
                shap_vals = explainer.shap_values(selected_features)
                if isinstance(shap_vals, np.ndarray):
                    shap_vector = shap_vals[0, :, y_pred]  # (1, features, classes) → shap vector for pred class
                else:
                    raise ValueError("Unexpected SHAP output format for tree explainer.")
                print(f"✅ SHAP vector shape: {shap_vector.shape}")

            elif shap_type == "linear":
                """
                For linear models like logistic regression, SHAP values are computed by comparing the model’s prediction
                for a specific instance to the average prediction over the background dataset. 
                This comparison helps in attributing the difference in prediction to individual features. 
                Without a background dataset, SHAP cannot determine what constitutes a “typical” prediction, 
                making it impossible to assess the impact of each feature accurately.
                """
                background = shap.sample(features_data, 100, random_state=42) 
                masker = shap.maskers.Independent(background)
                explainer = shap.LinearExplainer(model, masker=masker)
                shap_vals = explainer.shap_values(selected_features)
               
                if y_pred_value not in model.classes_:
                    raise ValueError(f"Predicted value {y_pred_value} not in model.classes_: {model.classes_}")
                y_pred = list(model.classes_).index(y_pred_value)
                shap_vector = shap_vals[0, :, y_pred]
                print(f"✅ SHAP vector shape: {shap_vector.shape}")
                
            elif shap_type == "deep":
                # Placeholder for LSTM: load background + tensor input
                continue
            else:
                raise ValueError(f"Unsupported SHAP type: {shap_type}")
            
            # Assemble SHAP explanation payload
            shap_data = [
                {
                    "feature": fname, 
                    "value": round(float(fval), 3), 
                    "shap": round(float(sval), 4)
                }
                for fname, fval, sval in zip(
                    selected_features.columns,
                    selected_features.values[0],
                    shap_vector
                )
            ]

            predictions[label] = {
                "prediction": y_pred_value,
                "confidence": confidence,
                "shap_values": shap_data
            }

        except Exception as e:
            predictions[label] = {"error": f"Prediction failed: {str(e)}"}

    return predictions