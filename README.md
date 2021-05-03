[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.7](https://img.shields.io/badge/python-3.7-blue.svg)](https://www.python.org/downloads/release/python-370/)
![alt text](https://img.shields.io/github/pipenv/locked/dependency-version/metabolize/rq-dashboard-on-heroku/flask)
[![PyPI version](https://badge.fury.io/py/requests.png)](https://badge.fury.io/py/requests)

# ARDAS Platform
ARDAS is a human-in-the-loop predictive reliability Machine Learning-based simulation platform.

## Getting Started

### Installing

The first step is to install python in your computer. The recommended version of Python is 3.7. The installation instructions can be found here.
```sh
https://www.python.org/downloads/
```
Once Python has been installed, the next step is to create a virtual environment using the virtualenv package. To create a virtual environment use the following commands.

Install package
```sh
pip install virtualenv 
```
Create a virtual environment named `ardas`

```sh
virtualenv ardas
```
Activate the `ardas` virtual environment

```sh
ardas\Scripts\activate
```
Install all the neccesary dependacies to deploy this platform

```sh
pip install -r requirements.txt
```
Clone this repository to obtain the source code

```sh
git clone https://github.com/google/pybadges.git
cd ardas_platform
```

## Usage
ARDAS platform can be used both in Windows and macOS from the command line. The development team is working on the creation of a Python library for ARDAS.

The command line interface is a great way to experiment with the platform before
writing Python code or modifying the base code.

### Command line usage
After installing Python, setting the virtual environment, installing all the requierements, and clone this repository user might follow these steps in the command line.

Go to the folder `ardas_platform`
```sh
cd ardas_platform
``` 
Run the `flask_ardas.py` application
```sh
python flask_ardas.py
``` 
Once the app is up and running you will see the following message
```sh
* Debugger is active!
 * Debugger PIN: 383-306-636
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```
Open a google crome tab and enter the following url to render the main page
```sh
http://127.0.0.1:5000/hmi
```
To naviagte to the storage page enter the following url
```sh
http://127.0.0.1:5000/storage
```
To close the application, in command line press `control + c` (Windows) and `command + c` (macOS)

## Development

```sh
git clone https://github.com/google/pybadges.git
cd ardas_platform
python -m virtualenv venv
source venv/bin/activate
# Open the source code in any IDE such as VSCode or PyCharm. Install development dependencies using requierements.txt make modifications to the source code.
python flask_ardas.py
```

If you'd like to contribute your changes back to ardas_paltform, please read the
[contributor guide.](CONTRIBUTING.md)

If you find a bug or want to propose an improvement please create an issue. 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


## Introduction to ARDAS
ARDAS is a micro-world platform that simulates a decision support system for condition-based
maintenance. The simulated process starts at the industrial plant where data is recorded. ARDAS
processes this raw data to extract and select important features that generalize the behaviour of
these signals. These features pass through a ML model that generates an estimation of the health
condition of 4 components within the hydraulic plant. The predicted value is sent to the graphical
user interface where information is displayed so the decision-maker can understand the final
recommendation and generate an optimal maintenance decision.

![blocks](/Resources/ardas_blocks.jpeg)

The operator will make a
decision regarding the maintenance action based on the predicted condition of the component,
the inner workings of the algorithm, and the contextual information about the industrial process.
The final goal of the operator is to produce the best maintenance actions (e.g. schedule a repair
or inspection action) that will keep the plant running while considering safety requirements,
resource constraints, and production levels.

## Hydraulic Process
The hydraulic process used for the development of ARDAS is constituted of two circuits. The
primary working circuit is responsible for controlling the pressure of the fluid. The secondary
cooling-filtration circuit controls the temperature and quality of the fluid. These two circuits are
connected via the oil tank creating two closed-loop circuits.


![hydraulic](/Resources/hydraulic_process.jpeg)

This hydraulic process has more than 14 physical sensors installed; however, only 14 physical
and 3 virtual sensors are part of the data set. The data set does not include the data from sensors
that measure the quality of the fluid.
These fourteen sensors measure variables including pressure (PS1 – PS6), temperature (TS1 –
TS4), flow (FS1, FS2), vibration (VS1), and power (EPS1) (Schütze et al., 2018). Additionally,
three virtual sensors for cooling efficiency (CE), cooling power (CP), and system efficiency (SE)
are calculated based on other sensors’ measurements.
The condition of four components pump MP1, accumulator A1-A4, cooler C1 and valve V10 are
analyzed by ARDAS. The condition of these four components describe typical system faults
including internal pump leakage, degradation of valve switching, pressure leakage in the
accumulator, and reduction of cooling efficiency [1].

## Experimental Platform
Researchers can modify the amount of information presented to users by disabling elements of
the user interface. ARDAS v1.0 incorporates different types of information including prediction
of the conditions of the components, a recommended maintenance action, and the logic that led
to an automated decision including. Finally, ARDAS v1.0 allows the researcher to select the
format of the feature importance and history of events information between graphs or tables with
textual and numerical information.

In the explainability context ARDAS is able to present the inner workings of a random forest
algorithm by revealing its feature importance. The feature importance is a vector that summaries
the contribution of each feature on the final output. ARDAS v1.0 also includes the confidence
rate of the prediction as a way to explain the suggestion made by the algorithm.
Regarding the dependent variables, these variables will measure the effects of the transparency
and explainable approaches on human performance. One or more of the following human
performance measurements (Borst et al., 2010) might be recorded: task performance (% correct,
response time, and score), situation awareness (SAGAT), workload (NASA TLX, HRV),
compliance and reliance (% acceptance rate), and trust (questionnaires).
## API Architecture
ARDAS uses Flask to create an API that request and push data to the user interface.

![microworld](/Resources/microworld_design_framework.png)

All the dependacies and datasets are locally hosted but the can easily be connected to a cloud database and be hosted on a remote server. 

![api](/Resources/api_desing.png)
Additionally, ARDAS incorporates tools to simulate failures by modifying the input
sensor data and manipulate the user interface by changing or adding elements on it and the way
that those elements are displayed.


## References
<a id="1">[1]</a> 
Nikolai Helwig, Eliseo Pignanelli, Andreas SchÃ¼tze, â€˜Condition Monitoring of a Complex Hydraulic System Using Multivariate Statisticsâ€™, in Proc. I2MTC-2015 - 2015 IEEE International Instrumentation and Measurement Technology Conference, paper PPS1-39, Pisa, Italy, May 11-14, 2015, doi: 10.1109/I2MTC.2015.7151267.

# Cite this repository
If you find this repository useful or use part of code please cite this work as.

```
D. A. Quispe G, F. Rajabiyazdi and G. A. Jamieson, "A Machine Learning-Based Micro-World Platform for Condition-Based Maintenance," 2020 IEEE International Conference on Systems, Man, and Cybernetics (SMC), 2020, pp. 288-295, doi: 10.1109/SMC42975.2020.9283448.
```





