# ml_utils.py
import pandas as pd
import numpy as np
import os
import sys
import pickle
from pathlib import Path
from typing import Tuple, Dict, Callable, Any
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.base import ClassifierMixin
from sklearn.inspection import permutation_importance


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


def save_feature_importances(
    model: Any,
    feature_path: Path,
    feature_names: pd.Index,
    X_test: pd.DataFrame = None,
    y_test: pd.Series = None,
    scoring: str = "accuracy"
) -> None:
    """
    Compute and save permutation-based feature importances for any model.

    Parameters:
    - model: a trained model or pipeline with a predict or predict_proba method
    - feature_path: where to save the output CSV
    - feature_names: names of the features (columns)
    - X_test: test features for permutation importance
    - y_test: test labels
    - scoring: performance metric to evaluate impact (default: accuracy)
    """
    if X_test is None or y_test is None:
        print("❌ X_test and y_test must be provided for permutation importance.")
        return

    try:
        result = permutation_importance(
            model, X_test, y_test, scoring=scoring, n_repeats=10, random_state=42, n_jobs=-1
        )
    except Exception as e:
        print(f"❌ Failed to compute permutation importance: {e}")
        return

    importance_df = pd.DataFrame({
        "feature": feature_names,
        "importance_mean": result.importances_mean,
        "importance_std": result.importances_std
    }).sort_values("importance_mean", ascending=False)

    if hasattr(model, "named_steps"):
        model_type = type(list(model.named_steps.values())[-1]).__name__
    else:
        model_type = type(model).__name__
    filename = feature_path.stem + f"_{model_type}.csv"
    file_path = feature_path.with_name(filename)

    file_path.parent.mkdir(parents=True, exist_ok=True)
    importance_df.to_csv(file_path, index=False)
    print(f"📄 Permutation feature importances saved to {file_path}")


def train_and_save_all(
    classifier_fn: Callable[[pd.DataFrame, pd.Series], ClassifierMixin],
    model_name: str,
    version: str,
    output_dir: Path,
    df_features: pd.DataFrame,
    conditions: pd.DataFrame,
    save_fi_fn: Callable[[ClassifierMixin, Path, pd.Index, pd.DataFrame, pd.Series], None] = save_feature_importances
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

        if save_fi_fn:
            feature_path = output_dir.parent.parent / "static" / "hs_database" / f"feature_{output_name}.csv"
            save_fi_fn(model, feature_path, df_features.columns, X_test, y_test)
