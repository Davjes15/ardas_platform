# === app.py ===
import os
import traceback
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from ml_model.loader import get_predictions, MODEL_REGISTRY
from ml_model.feature_engineering import generate_features
from pathlib import Path

app = Flask(__name__)
CORS(app)
path_file = Path(__file__).resolve().parent

@app.route("/data/", methods=["GET"])
def return_condition():
    try:
        cycle = int(request.args.get("cycle"))
        model_type = request.args.get("model")

        if model_type not in MODEL_REGISTRY:
            return f"❌ Error: Unsupported model type '{model_type}'", 400

        results = get_predictions(model_type, cycle)
        return jsonify(results)

    except Exception as e:
        traceback.print_exc()
        return f"❌ Server error: {type(e).__name__} - {str(e)}", 500

@app.route("/hmi")
def hmi():
    return render_template("index.html")

@app.route("/storage")
def storage():
    return render_template("storage.html")

if __name__ == "__main__":
    generate_features()
    os.chdir(path_file)
    app.run(debug=True)