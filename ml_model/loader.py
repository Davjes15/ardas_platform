import pickle
import pandas as pd
import re
from pathlib import Path
from typing import Dict, Optional
from sklearn.base import BaseEstimator

features_obj_path = Path(__file__).resolve().parents[1] / "static" / "hs_database" / "new_features_hs_.obj"
model_base_dir = Path(__file__).resolve().parents[1] / "ml_model"

MODEL_REGISTRY = {
    "random_forest": ("load_sklearn_model", "predict_sklearn"),
    "logistic_regression": ("load_sklearn_model", "predict_sklearn"),
    # Future placeholder for deep learning models like LSTM
    # "lstm": ("load_lstm_model", "predict_lstm"),
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


def get_predictions(model_type: str, cycle: int) -> Dict[str, str]:
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

    load_func_name, predict_func_name = MODEL_REGISTRY[model_type]
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
        if not model_file:
            predictions[label] = "Model not found"
            continue
        model = load_func(model_file)
        predictions[label] = predict_func(model, selected_features)

    return predictions