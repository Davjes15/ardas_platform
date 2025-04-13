# Implementation of Random Forest model to classify failures in a hydraulic process
# Hydraulic system can be found : https://archive.ics.uci.edu/ml/datasets/Condition+monitoring+of+hydraulic+systems
# The data set contains raw process sensor data (i.e. without feature extraction) which are structured as matrices (tab-delimited) 
# with rows representing the cycles and the columns the data points within a cycle. 
# The sensors involved are: 

# Sensor Physical quantity Unit Sampling rate
# PS1    Pressure    bar    100 Hz 
# PS2    Pressure    bar    100 Hz 
# PS3    Pressure    bar    100 Hz 
# PS4    Pressure    bar    100 Hz 
# PS5    Pressure    bar    100 Hz 
# PS6    Pressure    bar    100 Hz 
# EPS1   Motor power    W    100 Hz 
# FS1    Volume flow    l/min    10 Hz 
# FS2    Volume flow    l/min    10 Hz 
# TS1    Temperature    Â°C    1 Hz 
# TS2    Temperature    Â°C    1 Hz 
# TS3    Temperature    Â°C    1 Hz 
# TS4    Temperature    Â°C    1 Hz 
# VS1    Vibration    mm/s    1 Hz 
# CE    Cooling efficiency (virtual)    %    1 Hz 
# CP    Cooling power (virtual)    kW    1 Hz 
# SE    Efficiency factor    %    1 Hz 

import pandas as pd
import numpy as np
import os
import sys
import pickle
from pathlib import Path
from datetime import datetime
from typing import Tuple, Dict
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.base import ClassifierMixin
from tqdm import tqdm


def save_fi(
    feature_importances: np.ndarray,
    feature_path: Path,
    X_columns: pd.Index
) -> None:
    """
    Save the top 6 most important features to a CSV file.

    Parameters:
        feature_importances (np.ndarray): Importance scores for each feature.
        feature_path (Path): Destination path to save the CSV.
        X_columns (pd.Index): Column names of the feature DataFrame.
    """
    df = pd.DataFrame(feature_importances, index=X_columns, columns=["Importance"])
    df = df.sort_values("Importance", ascending=False).T.iloc[:, :6]
    df.to_csv(feature_path, index=False)
    print(f"📉 Feature importances saved to: {feature_path}")


def train_rf(
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.Series,
    y_test: pd.Series,
    label: str
) -> Tuple[ClassifierMixin, float]:
    """
    Train a Random Forest classifier and return the model and its accuracy.

    Parameters:
        X_train (pd.DataFrame): Training features.
        X_test (pd.DataFrame): Testing features.
        y_train (pd.Series): Training labels.
        y_test (pd.Series): Testing labels.
        label (str): Human-readable name of the target.

    Returns:
        Tuple[ClassifierMixin, float]: Trained model and its accuracy score.
    """
    rf = RandomForestClassifier(n_estimators=1000, random_state=42)
    model = rf.fit(X_train, y_train)
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"✅ {label} model trained with accuracy: {acc:.2%}")
    return model, acc


def save_model_object(
    model: ClassifierMixin,
    model_name: str,
    model_param: str,
    version: str,
    output_dir: Path
) -> None:
    """
    Save a trained model object using pickle.

    Parameters:
        model (ClassifierMixin): Trained scikit-learn model.
        model_name (str): Name of the model.
        model_param (str): Suffix to distinguish the model.
        version (str): Version string for versioning.
        output_dir (Path): Directory to save the model.
    """
    filename = f"{model_name}_{model_param}_{version}.pkl"
    filepath = output_dir / filename
    with open(filepath, "wb") as f:
        pickle.dump(model, f)
    print(f"💾 Model saved to: {filepath}")


def main() -> None:
    """
    Main function to load data, train models for each target condition,
    save the trained models and their feature importances.
    """
    MODEL_VERSION = datetime.now().strftime("%Y%m%d_%H%M%S")
    path_file = Path(os.path.abspath(os.path.dirname(sys.argv[0])))
    model_output_dir = path_file / "ml_model" / MODEL_VERSION
    model_output_dir.mkdir(parents=True, exist_ok=True)

    print("🚀 Starting model training and export")
    print(f"📦 Model version: {MODEL_VERSION}")
    print(f"📂 Output directory created: {model_output_dir}")

    # Load datasets
    print("📄 Loading features and target conditions...")
    df_features = pd.read_csv(path_file / "ml_model" / "feature_hs.csv")
    target_names = [
        'cooler_condition',
        'valve_condition',
        'pump_leakage',
        'hydraulic_accumulator',
        'stable_flag'
    ]
    conditions = pd.read_csv(
        path_file / "ml_model" / "profile.txt", names=target_names, sep="\t"
    )
    print("✅ Data loaded successfully!")

   # Set up model suffixes and desired file name suffixes in one place
    targets = {
        "c": ("cooler_condition", "cooler"),
        "v": ("valve_condition", "valve"),
        "p": ("pump_leakage", "pump"),
        "a": ("hydraulic_accumulator", "acc")
    }

    print("\n📊 Beginning training loop...\n")
    for suffix, (target_column, output_name) in tqdm(targets.items(), desc="Training models"):
        print(f"\n🔧 Processing: {target_column}")
        Y = conditions[target_column]
        X_train, X_test, y_train, y_test = train_test_split(
            df_features, Y, test_size=0.3, random_state=42
        )

        model, acc = train_rf(X_train, X_test, y_train, y_test, target_column.capitalize())
        save_model_object(model, "random_forest", suffix, MODEL_VERSION, model_output_dir)

        feature_path = path_file / "static" / "hs_database" / f"feature_{output_name}.csv"
        save_fi(model.feature_importances_, feature_path, df_features.columns)

    print("\n✅ All models trained, evaluated, and saved successfully!")


if __name__ == "__main__":
    main()