import sys
import numpy as np
from pathlib import Path
from datetime import datetime
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from ml_utils import load_data, train_and_save_all, save_feature_importances


def train_lr(X_train, y_train):
    # Optional: check for data integrity
    assert not X_train.isnull().any().any(), "❌ NaN values in X_train"
    assert np.isfinite(X_train.to_numpy()).all(), "❌ Non-finite values in X_train"
    # lr = OneVsRestClassifier(
    #     LogisticRegression(solver="liblinear", max_iter=2000, random_state=42)
    #     )
    lr = LogisticRegression(multi_class = 'ovr', solver = 'liblinear')
    model= lr.fit(X_train, y_train)
    return model


def main():
    MODEL_VERSION = datetime.now().strftime("%Y%m%d_%H%M%S")
    path_file = Path(sys.path[0])
    model_output_dir = path_file / "ml_model" / MODEL_VERSION
    model_output_dir.mkdir(parents=True, exist_ok=True)

    print("🚀 Starting Logistic Regression model training")
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
        classifier_fn=train_lr,
        model_name="logistic_regression",
        version=MODEL_VERSION,
        output_dir=model_output_dir,
        df_features=df_features,
        conditions=conditions,
        save_fi_fn=save_feature_importances,
    )

    print("\n✅ All Logistic Regression models trained and saved successfully!")


if __name__ == "__main__":
    main()
