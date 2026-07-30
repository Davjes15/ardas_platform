# Sensor data EDA notebook

`sensor_data_eda.ipynb` is a fully executed, raw-data-only exploration of the 17 hydraulic sensor matrices, target profile. It uses the repository data at `/home/ubuntu/repos/ardas_platform`.

To rerun locally from the repository root:

```bash
jupyter nbconvert --to notebook --execute notebooks/sensor_data_eda.ipynb --output notebooks/sensor_data_eda.ipynb --ExecutePreprocessor.timeout=900
```

The notebook uses the existing Python environment (numpy, pandas, scipy, matplotlib, seaborn, scikit-learn, and Jupyter). It does not modify source data or source files. Raw waveform overlays intentionally subsample cycles for readability; integrity checks and cycle-level statistics use all cycles.
