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


# Import libraries

import pandas as pd
import numpy as np
import os, sys
import pickle
import sklearn as sk
from pathlib import Path
from sklearn import preprocessing
from sklearn.metrics import confusion_matrix, recall_score, precision_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Define directories for reading and saving files
path = os.path.abspath(os.path.dirname(sys.argv[0]))
path_file= Path(path)
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


# Save feature importance as csv file
def save_fi (data, path):
    df = pd.DataFrame(data,
                      index = X_train.columns,
                      columns=['Importance']).sort_values('Importance',ascending=False)
    data=df.T
    data = data.iloc[:,0:6]
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

def save_model_object(model_object,model_name,model_params):
    file_name=model_name+"_"+str(model_params).replace('[',"").replace(']',"").replace(',',"_").replace(' ',"_")+".obj"
    with open(file_name,'wb') as handle:
        try:
            pickle.dump(model_object,handle)
        except:
            print("ERROR")
    print(file_name," saved successfully")
# ---------------------------------------------------------------

# Train model for cooler condition classification
Y = conditions["cooler_condition"] # define target value
# split the data into training and testing setssplit_data (X,Y)
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.3, random_state = 42)
rf_cooler = train_rf (X_train, X_test, y_train, y_test, "Cooler")
# X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.30,random_state = 42)
# rf = RandomForestClassifier(n_estimators= 1000, random_state=42)
# rf.fit(X_train, y_train);
# print ('Model training 100%')
# predictions = rf.predict(X_test)
# print('Accuracy Cooler Condition: %.2f%%' % (accuracy_score(predictions,y_test)*100))

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
