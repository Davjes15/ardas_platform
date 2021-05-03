# Import libraries
import pandas as pd
import numpy as np
import pickle
import json
import os,sys
import csv
import requests
from pathlib import Path
from flask import Flask,jsonify, request, render_template
from flask_cors import CORS
from sklearn.metrics import log_loss


# Define directories for reading and saving files
# It is possible to add different models
file_name_rf = ["random_forest_c.obj","random_forest_v.obj","random_forest_p.obj","random_forest_a.obj"]
file_name_lr = ["logistic_regression_c.obj","logistic_regression_v.obj","logistic_regression_p.obj","logistic_regression_a.obj"]
# get the current directory
path = os.path.abspath(os.path.dirname(sys.argv[0]))
path_file= Path(path) # use path library so it can be used in MAC and Windows
print (path_file)

# # Define functions

# Extraction of 68 features from 17 NEW raw sensor data.
# Extraction of mean, variance, skewness, and kurtosis for each sensor by cylce
# Each cycle is constitued by 1 minute of raw data
def feature_extraction (dataset,axis,name):
    df=pd.DataFrame() # open and empty data frame
    mean = np.mean(dataset, axis = axis) # calculate mean
    df[str(name) +'_M']= mean # add mean values to dataframe
    variance = np.var(dataset, axis = axis)
    df[str(name) + '_V'] = variance
    skewness = dataset.skew(axis=axis)
    df[str(name) + '_S'] = skewness
    kurtosis = dataset.kurtosis(axis = axis)
    df[str(name) + '_K'] = kurtosis
    return df

# Save models
def save_model_object(model_object,model_name,model_params):
    file_name=model_name+"_"+str(model_params).replace('[',"").replace(']',"").replace(',',"_").replace(' ',"_")+".obj"
    with open(file_name,'wb') as handle:
        try:
            pickle.dump(model_object,handle)
        except:
            print("ERROR")
    print(file_name,"Saved Successfully")

# Random Foreste model
def rf(cycle):
    cond_dict={}
    file_names=file_name_rf
    #["random_forest_c.obj","random_forest_v.obj","random_forest_p.obj","random_forest_a.obj"] # select the file to be loaded
    cur_dir=path_file / "ml_model" # define path to read models
    for file_name in (file_names):
        file=os.path.join(cur_dir,file_name) # create name and path
        with open(file,'rb') as handle:
            model=pickle.load(handle) # load model
            if file_name == "random_forest_c.obj":
                key="cooler"
            elif file_name == "random_forest_v.obj":
                key="valve"
            elif file_name == "random_forest_p.obj":
                key="pump"
            elif file_name == "random_forest_a.obj":
                key="acc"
            cond_dict[key]=predict_condition(model,cycle)
    return cond_dict

# Logistic Regression model
def lr(cycle):
    cond_dict={}
    file_names=file_name_lr
    #["random_forest_c.obj","random_forest_v.obj","random_forest_p.obj","random_forest_a.obj"] # select the file to be loaded
    cur_dir=path_file / "ml_model" # define path to read models
    for file_name in (file_names):
        file=os.path.join(cur_dir,file_name) # create name and path
        with open(file,'rb') as handle:
            model=pickle.load(handle) # load model
            if file_name == "logistic_regression_c.obj":
                key="cooler"
            elif file_name == "logistic_regression_v.obj":
                key="valve"
            elif file_name == "logistic_regression_p.obj":
                key="pump"
            elif file_name == "logistic_regression_a.obj":
                key="acc"
            cond_dict[key]=predict_condition(model,cycle)
    return cond_dict
"""    loss_dict={}
    for file_name in (file_names):
        file=os.path.join(cur_dir,file_name) # create name and path
        with open(file,'rb') as handle:
            model=pickle.load(handle) # load model
            if file_name == "logistic_regression_c.obj":
                key="c_loss"
            elif file_name == "logistic_regression_v.obj":
                key="v_loss"
            elif file_name == "logistic_regression_p.obj":
                key="p_loss"
            elif file_name == "logistic_regression_a.obj":
                key="a_loss"
            
            loss_dict[key]=predict_condition(model,cycle)
"""
       
# Prediction of condition
def predict_condition(model,cycle):
    file_name="new_features_hs_.obj" # table with new data that contains the extracted features 
    cur_dir= path_file / 'static' / 'hs_database'
    file=os.path.join(cur_dir,file_name)
    with open(file,'rb') as handle: # rb means read in binary
        features_data=pickle.load(handle)
    features=select_features(cycle,features_data)# select the row of features to predic condition
    prediction=model.predict(features)# with the train model and the features predict condition
    return "{:.2f}".format(float(prediction))

# Calculate Log Loss of condition
"""def logistic_loss(model,cycle):
    file_name="new_features_hs_.obj" # table with new data that contains the extracted features 
    cur_dir= path_file / 'static' / 'hs_database'
    file=os.path.join(cur_dir,file_name)
    with open(file,'rb') as handle: # rb means read in binary
        features_data=pickle.load(handle)
    features=select_features(cycle,features_data)# select the row of features to predic condition
    prediction=model.predict(features)# with the train model and the features predict condition
    pred_prob=model.predict_proba(features)# with the train model and the features predict condition
    loss=log_loss()
    return "{:.2f}".format(float(prediction))
"""
# Select cycle - row
def select_features(cycle,features_data):
	features=pd.DataFrame(features_data.loc[cycle])
	features=features.transpose()
	return features

# FEATURE EXTRACTION FORM NEW RAW SENSOR DATA

# Import NEW DATA csv file
new_data_dir = path_file / 'static' / 'hs_database'
os.chdir(new_data_dir) #changes the directory so we can import the data from a different directory depending on the computer
print (os.getcwd())

# Read pressure data (100 Hz)
names = np.arange(0, 6000)
PS1 = pd.read_csv('ps1.csv',names = names)
PS2 = pd.read_csv('ps2.csv',names = names)
PS3 = pd.read_csv('ps3.csv',names = names)
PS4 = pd.read_csv('ps4.csv',names = names)
PS5 = pd.read_csv('ps5.csv',names = names)
PS6 = pd.read_csv('ps6.csv',names = names)
EPS1 = pd.read_csv('eps1.csv',names = names)
# Read temeprature, vibration, and virtual sensors (1 Hz)
names = np.arange(0, 60)
TS1 = pd.read_csv('ts1.csv',names = names)
TS2 = pd.read_csv('ts2.csv',names = names)
TS3 = pd.read_csv('ts3.csv',names = names)
TS4 = pd.read_csv('ts4.csv',names = names)
VS1 = pd.read_csv('vs1.csv',names = names)
CE = pd.read_csv('ce.csv',names = names)
CP = pd.read_csv('cp.csv',names = names)
SE = pd.read_csv('se.csv',names = names)

# Read flow sensors (10 Hz)
names = np.arange(0, 600)
FS1 = pd.read_csv('fs1.csv',names = names)
FS2 = pd.read_csv('fs2.csv',names = names)

print ("********** New Data files imported 100% **********")

# Extract Features from raw data.
PS1_nf = feature_extraction (PS1, 1, 'PS1')
PS2_nf = feature_extraction(PS2, 1, 'PS2')
PS3_nf = feature_extraction(PS3, 1, 'PS3')
PS4_nf = feature_extraction(PS4, 1, 'PS4')
PS5_nf = feature_extraction(PS5, 1, 'PS5')
PS6_nf = feature_extraction(PS6, 1, 'PS6')
TS1_nf = feature_extraction (TS1, 1, 'TS1')
TS2_nf = feature_extraction (TS2, 1, 'TS2')
TS3_nf = feature_extraction (TS3, 1, 'TS3')
TS4_nf = feature_extraction (TS4, 1, 'TS4')
EPS1_nf = feature_extraction (EPS1, 1, 'EPS1')
FS1_nf = feature_extraction (FS1, 1, 'FS1')
FS2_nf = feature_extraction (FS2, 1, 'FS2')
VS1_nf = feature_extraction (VS1, 1, 'VS1')
CE_nf = feature_extraction (CE, 1, 'CE')
CP_nf = feature_extraction (CP, 1, 'CP')
SE_nf = feature_extraction (SE, 1, 'SE')

print (" *********** New Features Extraction 100% ***************")
# Create a dataframe with final data
new_features = pd.concat([PS1_nf,PS2_nf,PS3_nf,PS4_nf,PS5_nf,PS6_nf, TS1_nf,TS2_nf,TS3_nf,TS4_nf,EPS1_nf, FS1_nf,FS2_nf,VS1_nf,CE_nf,CP_nf,SE_nf], axis=1, sort=False)
print ("************ New Features dataset 100% ********************* :")
print (new_features.head(10))
# Save file as csv for inspeccion purposes
save_path = path_file/"static"/'hs_database'/'new_feature_hs.csv'
new_features.to_csv (save_path, index = None, header=True)
print (" ************** New Features file saved 100% **************")
# Save file as object
save_model_object(new_features,"new_features_hs","")


# API for ML models
os.chdir(path_file) #changes the directory so we can import the data from a different directory depending on the computer
print (os.getcwd())

app = Flask(__name__)
CORS(app)
@app.route("/data/",methods=['GET'])

def return_condition():
    data=request.args.get('cycle')
    model=request.args.get('model')
    if(model=='rf'):
        cycle = int(data)
        return jsonify(rf(cycle)) # call the model rf and return the prediction as json file
    elif(model=='lr'):
        cycle = int(data)
        return jsonify(lr(cycle))
    else:
        return "Error - choose model and cycle"

@app.route("/hmi")
def hmi():
    return render_template("index.html")

@app.route("/storage")
def storage():
    return render_template("storage.html")

if __name__ == "__main__":
    app.run(debug=True)

