import pandas as pd
import numpy as np
import pickle
from pathlib import Path

path_file = Path(__file__).resolve().parents[1]
model_base_dir = path_file / "ml_model"

def feature_extraction(dataset: pd.DataFrame, axis: int, name: str) -> pd.DataFrame:
    df = pd.DataFrame()
    df[f"{name}_M"] = np.mean(dataset, axis=axis)
    df[f"{name}_V"] = np.var(dataset, axis=axis)
    df[f"{name}_S"] = dataset.skew(axis=axis)
    df[f"{name}_K"] = dataset.kurtosis(axis=axis)
    return df

def save_model_object(model_object: object, model_name: str, model_suffix: str) -> None:
    output_path = model_base_dir / f"{model_name}_{model_suffix}.pkl"
    with open(output_path, 'wb') as handle:
        pickle.dump(model_object, handle)
    print(f"✅ Saved: {output_path}")

def generate_features() -> None:
    print("📂 Reading raw sensor data...")
    new_data_dir = path_file / 'static' / 'hs_database'
    names_100hz = np.arange(0, 6000)
    names_10hz = np.arange(0, 600)
    names_1hz = np.arange(0, 60)

    sensors = {
        'PS1': pd.read_csv(new_data_dir / 'ps1.csv', names=names_100hz),
        'PS2': pd.read_csv(new_data_dir / 'ps2.csv', names=names_100hz),
        'PS3': pd.read_csv(new_data_dir / 'ps3.csv', names=names_100hz),
        'PS4': pd.read_csv(new_data_dir / 'ps4.csv', names=names_100hz),
        'PS5': pd.read_csv(new_data_dir / 'ps5.csv', names=names_100hz),
        'PS6': pd.read_csv(new_data_dir / 'ps6.csv', names=names_100hz),
        'EPS1': pd.read_csv(new_data_dir / 'eps1.csv', names=names_100hz),
        'FS1': pd.read_csv(new_data_dir / 'fs1.csv', names=names_10hz),
        'FS2': pd.read_csv(new_data_dir / 'fs2.csv', names=names_10hz),
        'TS1': pd.read_csv(new_data_dir / 'ts1.csv', names=names_1hz),
        'TS2': pd.read_csv(new_data_dir / 'ts2.csv', names=names_1hz),
        'TS3': pd.read_csv(new_data_dir / 'ts3.csv', names=names_1hz),
        'TS4': pd.read_csv(new_data_dir / 'ts4.csv', names=names_1hz),
        'VS1': pd.read_csv(new_data_dir / 'vs1.csv', names=names_1hz),
        'CE': pd.read_csv(new_data_dir / 'ce.csv', names=names_1hz),
        'CP': pd.read_csv(new_data_dir / 'cp.csv', names=names_1hz),
        'SE': pd.read_csv(new_data_dir / 'se.csv', names=names_1hz),
    }

    print("🔬 Extracting features...")
    features = pd.concat(
        [feature_extraction(df, 1, name) for name, df in sensors.items()],
        axis=1
    )

    print("💾 Saving features...")
    features.to_csv(new_data_dir / "new_feature_hs.csv", index=False)
    save_model_object(features, "new_features_hs", "")
    print("✅ Feature generation complete!")