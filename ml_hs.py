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

#*********************************************************************************************
# Install the following libraries:
#**************** Python Version : Python 3.7.3 ************
# Package         Version
# --------------- --------
# aniso8601       7.0.0
# certifi         2019.3.9
# chardet         3.0.4
# Click           7.0
# configparser    3.7.4
# cycler          0.10.0
# databricks-cli  0.8.7
# Flask           1.1.1
# Flask-Cors      3.0.8
# Flask-RESTful   0.3.7
# idna            2.8
# itsdangerous    1.1.0
# Jinja2          2.10.1
# joblib          0.13.2
# jsonify         0.5
# kiwisolver      1.1.0
# MarkupSafe      1.1.1
# matplotlib      3.1.1
# numpy           1.17.0
# pandas          0.25.1
# pathlib         1.0.1
# pip             19.2.3
# pyparsing       2.4.2
# python-dateutil 2.8.0
# pytz            2019.1
# requests        2.22.0
# scikit-learn    0.21.3
# scipy           1.3.1
# seaborn         0.9.0
# setuptools      40.8.0
# six             1.12.0
# sklearn         0.0
# tabulate        0.8.3
# urllib3         1.25.3
# virtualenv      16.6.1
# Werkzeug        0.15.4

#***********************************************************************************************
# Import libraries

import pandas as pd
import numpy as np
import os, sys
import pickle
import csv
import sklearn as sk
from pathlib import Path
from sklearn import preprocessing
from sklearn.metrics import confusion_matrix, recall_score, precision_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Define directories for reading and saving files
path = os.path.abspath(os.path.dirname(sys.argv[0])) # get the current directory
path_file= Path(path) # use path library so it can be used in MAC and Windows
print (path_file)


# Define functions

def feature_extraction (dataset,axis,name):
    df=pd.DataFrame()
    mean = np.mean(dataset, axis = axis)
    df[str(name) +'_M']= mean
    variance = np.var(dataset, axis = axis)
    df[str(name) + '_V'] = variance
    skewness = dataset.skew(axis=axis)
    df[str(name) + '_S'] = skewness
    kurtosis = dataset.kurtosis(axis = axis)
    df[str(name) + '_K'] = kurtosis
    return df

# Save feature importance as csv file
def save_fi (data, path):
    df = pd.DataFrame(data,
                      index = X_train.columns,
                      columns=['Importance']).sort_values('Importance',ascending=False)
    data=df.T
    data = data.iloc[:,0:68]
    export_fi = data.to_csv (path, index = None, header=True)
    return (export_fi)

# Trainnig a random forest algorithm    
def train_rf (X_train, X_test, y_train, y_test, element):
	# Initialize model 
	rf = RandomForestClassifier(n_estimators= 1000, random_state=42)
	# Train the model on training data
	model_rf= rf.fit(X_train, y_train);
	print (element + " Model Training Ready")
	# Use the forest's predict method on the test data
	predictions = rf.predict(X_test)
	print(element + ' Accuracy Condition: %.2f%%' % (accuracy_score(predictions,y_test)*100))
	return (model_rf)

# Save model as objects
def save_model_object(model_object,model_name,model_params):
    file_name=model_name+"_"+str(model_params).replace('[',"").replace(']',"").replace(',',"_").replace(' ',"_")+".obj"
    with open(file_name,'wb') as handle:
        try:
            pickle.dump(model_object,handle)
        except:
            print("ERROR")
    print(file_name," saved successfully")
# ---------------------------------------------------------------

# FEATURE EXTRACTION

# Import csv/txt file
file_dir = path_file / "sensor_data"
# os.chdir changes the directory so we can import the data from a different directory depending on the computer
os.chdir(file_dir)
print (os.getcwd())

names = np.arange(0, 6000)
PS1 = pd.read_csv('ps1.txt', names = names, sep="\t")
PS2 = pd.read_csv('ps2.txt',names = names, sep="\t")
PS3 = pd.read_csv('ps3.txt',names = names, sep="\t")
PS4 = pd.read_csv('ps4.txt',names = names, sep="\t")
PS5 = pd.read_csv('ps5.txt',names = names, sep="\t")
PS6 = pd.read_csv('ps6.txt',names = names, sep="\t")
EPS1 = pd.read_csv('eps1.txt',names = names, sep="\t")

names = np.arange(0, 60)
TS1 = pd.read_csv('ts1.txt',names = names, sep="\t")
TS2 = pd.read_csv('ts2.txt',names = names, sep="\t")
TS3 = pd.read_csv('ts3.txt',names = names, sep="\t")
TS4 = pd.read_csv('ts4.txt',names = names, sep="\t")
VS1 = pd.read_csv('vs1.txt',names = names, sep="\t")
CE = pd.read_csv('ce.txt',names = names, sep="\t")
CP = pd.read_csv('cp.txt',names = names, sep="\t")
SE = pd.read_csv('se.txt',names = names, sep="\t")

names = np.arange(0, 600)
FS1 = pd.read_csv('fs1.txt',names = names, sep="\t")
FS2 = pd.read_csv('fs2.txt',names = names, sep="\t")

print (PS1.head(10))
print ("Data files imported 100%")

# Extract Features from raw data.
PS1_df = feature_extraction (PS1, 1, 'PS1')
PS2_df = feature_extraction(PS2, 1, 'PS2')
PS3_df = feature_extraction(PS3, 1, 'PS3')
PS4_df = feature_extraction(PS4, 1, 'PS4')
PS5_df = feature_extraction(PS5, 1, 'PS5')
PS6_df = feature_extraction(PS6, 1, 'PS6')
TS1_df = feature_extraction (TS1, 1, 'TS1')
TS2_df = feature_extraction (TS2, 1, 'TS2')
TS3_df = feature_extraction (TS3, 1, 'TS3')
TS4_df = feature_extraction (TS4, 1, 'TS4')
EPS1_df = feature_extraction (EPS1, 1, 'EPS1')
FS1_df = feature_extraction (FS1, 1, 'FS1')
FS2_df = feature_extraction (FS2, 1, 'FS2')
VS1_df = feature_extraction (VS1, 1, 'VS1')
CE_df = feature_extraction (CE, 1, 'CE')
CP_df = feature_extraction (CP, 1, 'CP')
SE_df = feature_extraction (SE, 1, 'SE')
print (PS1_df.head(10))
print ("Features Extraction 100%")

# Create a dataframe
final_data = pd.concat([PS1_df,PS2_df,PS3_df,PS4_df,PS5_df,PS6_df, TS1_df,TS2_df,TS3_df,TS4_df,EPS1_df, FS1_df,FS2_df,VS1_df,CE_df,CP_df,SE_df], axis=1, sort=False)
print ("Features dataset 100%")
print (final_data.head(10))

# Save file
save_path = path_file / "ml_model"/ 'feature_hs.csv'
#'C:\\Users\\davje\\Documents\\test.csv'
final_data.to_csv(save_path, index = None, header=True)
print ("Features file saved 100%")

#***************************************************************************************
# MACHINE LEARNING ALGORITHM IMPLEMENTATION

ml_model_dir = path_file / "ml_model"
os.chdir(ml_model_dir) # os.chdir changes the directory so we can import the data from a different directory depending on the computer
print (os.getcwd())

# Import feature extracted

df_features = pd.read_csv('feature_hs.csv')
print (df_features.head(10))
print ("Features imported 100%")
# Import target conditions
names = ['cooler_condition', 'valve_condition', 'pump_leakage', 'hydraulic_accumulator', 'stable_flag']
conditions = pd.read_csv('profile.txt',names = names, sep="\t")
print (conditions.head(10))
print ("Target Conditions imported 100%")


# Define features
X = df_features  # features file

# Train model for cooler condition classification
Y = conditions["cooler_condition"] # define target value
# split the data into training and testing setssplit_data (X,Y)
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.3, random_state = 42)
rf_cooler = train_rf (X_train, X_test, y_train, y_test, "Cooler")
#Save machine learning model
save_model_object(rf_cooler,"random_forest","c")
# Create a dataframe with feature importance
fic_path = path_file / 'static' / 'hs_database'/ 'feature_cooler.csv'
fi_c=rf_cooler.feature_importances_
save_fi (fi_c, fic_path)
#-----------------------------------------------------------------

# Train model for valve condition classification
Yval = conditions["valve_condition"]
X_train, X_test, y_train, y_test = train_test_split(X, Yval, test_size = 0.3, random_state = 42)
rf_valve = train_rf (X_train, X_test, y_train, y_test, "Valve")
save_model_object(rf_valve,"random_forest","v")
fiv_path = path_file / 'static' / 'hs_database'/ 'feature_valve.csv'
fi_v=rf_valve.feature_importances_
save_fi (fi_v, fiv_path)
#-----------------------------------------------------------------

# Train model for pump condition classification
Ypum = conditions["pump_leakage"]
X_train, X_test, y_train, y_test = train_test_split(X, Ypum, test_size = 0.3, random_state = 42)
rf_pump = train_rf (X_train, X_test, y_train, y_test, "Pump")
save_model_object(rf_pump,"random_forest","p")
fip_path = path_file / 'static' / 'hs_database'/ 'feature_pump.csv'
fi_p=rf_pump.feature_importances_
save_fi (fi_p, fip_path)
#-----------------------------------------------------------------

# Train model for accumulator condition classification

Yacc = conditions["hydraulic_accumulator"]
X_train, X_test, y_train, y_test = train_test_split(X, Yacc, test_size = 0.3, random_state = 42)
rf_acc = train_rf (X_train, X_test, y_train, y_test, "Accumulator")
save_model_object(rf_acc ,"random_forest","a")
fia_path = path_file / 'static' / 'hs_database'/ 'feature_acc.csv'
fi_a=rf_acc.feature_importances_
save_fi (fi_a, fia_path)