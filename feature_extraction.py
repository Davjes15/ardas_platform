# Extraction of 68 features from 17 raw sensor data.
# Extraction of mean, variance, skewness, and kurtosis for each sensor by cycle
# Each cycle is constitued by 1 minune of raw data
# This method was found in the paper Condition Monitoring of Hydraulic Systems by Classifying Sensor Data Streams
# https://ieeexplore.ieee.org/document/8666564

# Import libraries
import pandas as pd
import numpy as np
import os,sys
import csv
from pathlib import Path

# Feature Extraction Function
# The time series (for each of the 17 sensors) in each instance (each row represents 1 minute of data) is replaced by four standard statistics:
# mean
# variance
# skewness
# kurtosis

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


# Import csv/txt file
# os.chdir changes the directory so we can import the data from a different directory depending on the computer
# https://realpython.com/read-write-files-python/
# https://thispointer.com/how-to-change-current-working-directory-in-python/
path = os.path.abspath(os.path.dirname(sys.argv[0]))
path_file= Path(path)
file_dir = path_file / "sensor_data"
#('C:\\Users\\davje\\Documents\\GitRepository\\hs_api_local\\sensor_data')
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
print ("Feature Extraction 100%")

# Create a dataframe
final_data = pd.concat([PS1_df,PS2_df,PS3_df,PS4_df,PS5_df,PS6_df, TS1_df,TS2_df,TS3_df,TS4_df,EPS1_df, FS1_df,FS2_df,VS1_df,CE_df,CP_df,SE_df], axis=1, sort=False)
print ("Final data set :")
print (final_data.head(10))

# Save file
save_path = path_file / "ml_model"/ 'feature_hs.csv'
#'C:\\Users\\davje\\Documents\\test.csv'
final_data.to_csv(save_path, index = None, header=True)
print ("Final Data saved 100%")