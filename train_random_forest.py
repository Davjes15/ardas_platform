# hs_randomforest.py (Refactored to use shared utilities)

import sys
from sklearn.ensemble import RandomForestClassifier
from pathlib import Path
from datetime import datetime
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from ml_utils import load_data, train_and_save_all, save_feature_importances


def train_rf(X_train, y_train):
    rf = RandomForestClassifier(n_estimators=1000, random_state=42)
    model = rf.fit(X_train, y_train)
    return model


def main():
    MODEL_VERSION = datetime.now().strftime("%Y%m%d_%H%M%S")
    path_file = Path(sys.path[0])
    model_output_dir = path_file / "ml_model" / MODEL_VERSION
    model_output_dir.mkdir(parents=True, exist_ok=True)

    print("🚀 Starting Random Forest model training")
    print(f"📦 Model version: {MODEL_VERSION}")
    print(f"📂 Output directory created: {model_output_dir}")

    df_features, conditions = load_data(path_file)

    targets = {
        "c": ("cooler_condition", "cooler"),
        "v": ("valve_condition", "valve"),
        "p": ("pump_leakage", "pump"),
        "a": ("hydraulic_accumulator", "acc")
    }

    train_and_save_all(
        classifier_fn=train_rf,
        model_name="random_forest",
        version=MODEL_VERSION,
        output_dir=model_output_dir,
        df_features=df_features,
        conditions=conditions,
        save_fi_fn=save_feature_importances,
    )
    print("\n✅ All Random Forest models trained and saved successfully!")


if __name__ == "__main__":
    main()
