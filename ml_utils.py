# ml_utils.py
import pandas as pd
import numpy as np
import os
import sys
import pickle
from pathlib import Path
from typing import Tuple, Dict, Callable
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.base import ClassifierMixin


def load_data(path_file: Path) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load features and conditions data from the given path.
    """
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
    return df_features, conditions


def save_model_object(
    model: ClassifierMixin,
    model_name: str,
    model_param: str,
    version: str,
    output_dir: Path
) -> None:
    """
    Save a trained model object using pickle.
    """
    filename = f"{model_name}_{model_param}_{version}.pkl"
    filepath = output_dir / filename
    with open(filepath, "wb") as f:
        pickle.dump(model, f)
    print(f"💾 Model saved to: {filepath}")


def save_fi(
    feature_importances: np.ndarray,
    feature_path: Path,
    X_columns: pd.Index
) -> None:
    """
    Save the top 6 most important features to a CSV file.
    """
    df = pd.DataFrame(feature_importances, index=X_columns, columns=["Importance"])
    df = df.sort_values("Importance", ascending=False).T.iloc[:, :6]
    df.to_csv(feature_path, index=False)
    print(f"📉 Feature importances saved to: {feature_path}")


def train_and_save_all(
    classifier_fn: Callable[[pd.DataFrame, pd.Series], ClassifierMixin],
    model_name: str,
    version: str,
    output_dir: Path,
    df_features: pd.DataFrame,
    conditions: pd.DataFrame,
    save_fi_fn: Callable[[ClassifierMixin, Path, pd.Index], None] = None
) -> None:
    """
    Generic training loop to train and save models.
    """
    targets: Dict[str, Tuple[str, str]] = {
        "c": ("cooler_condition", "cooler"),
        "v": ("valve_condition", "valve"),
        "p": ("pump_leakage", "pump"),
        "a": ("hydraulic_accumulator", "acc")
    }

    for suffix, (target_column, output_name) in targets.items():
        print(f"\n🔧 Processing: {target_column}")
        Y = conditions[target_column]
        X_train, X_test, y_train, y_test = train_test_split(
            df_features, Y, test_size=0.3, random_state=42
        )

        model = classifier_fn(X_train, y_train)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"✅ {target_column} model trained with accuracy: {acc:.2%}")

        save_model_object(model, model_name, suffix, version, output_dir)

        if save_fi_fn and hasattr(model, "feature_importances_"):
            feature_path = output_dir.parent.parent / "static" / "hs_database" / f"feature_{output_name}.csv"
            save_fi_fn(model.feature_importances_, feature_path, df_features.columns)
