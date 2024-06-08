import json
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import joblib
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/uploadExcelFile": {"origins": "http://localhost:3000"},
                     r"/predict": {"origins": "http://localhost:3000"}})
def train_model(file_path,idIs):
    df = pd.read_excel(file_path)
    df.fillna(df.median(), inplace=True)
    Q1 = df['Number_of_Vehicles'].quantile(0.25)
    Q3 = df['Number_of_Vehicles'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    df = df[(df['Number_of_Vehicles'] >= lower_bound) & (df['Number_of_Vehicles'] <= upper_bound)]
    df['Day_of_Week'] = df['Day_of_Week'].astype('category')
    X = df[['Day_of_Week', 'Is_Special_Event']]
    y = df['Number_of_Vehicles']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    uploads_folder = 'uploads'
    if not os.path.exists(uploads_folder):
        os.makedirs(uploads_folder)

    model_file_path = os.path.join(uploads_folder, f"{idIs}_model.pkl")
    scaler_file_path = os.path.join(uploads_folder, f"{idIs}_scaler.pkl")

    joblib.dump(model, model_file_path)
    joblib.dump(scaler, scaler_file_path)
    return {'mse': mean_squared_error(y_test, y_pred), 'mae': mean_absolute_error(y_test, y_pred)}

@app.route('/uploadExcelFile', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'idIs' not in request.form:
        return jsonify({'error': 'File or idIs missing', 'success':False}), 400

    file = request.files['file']
    idIs = request.form['idIs']

    if file.filename == '':
        return jsonify({'error': 'No selected file', 'success':False}), 400

    if file and idIs:
        # Get the file extension
        file_extension = os.path.splitext(file.filename)[1]
        # Construct the file path
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        file_path = os.path.join(uploads_dir, f'{idIs}{file_extension}')
        file.save(file_path)
        training_result = train_model(file_path,idIs)
        return jsonify({'result': training_result, 'success': True})

@app.route('/predict', methods=['GET'])
def predict():
    
    idIs = request.args.get('id');
    
    if not idIs:
        return jsonify({'error': 'Id is missing', 'success': False}), 400


    model_path = f'uploads/{idIs}_model.pkl'
    scaler_path = f'uploads/{idIs}_scaler.pkl'

    try:
        if not (os.path.exists(model_path) and os.path.exists(scaler_path)):
            return jsonify({'error': 'Model files do not exist', 'success': False}), 400

        scaler = joblib.load(scaler_path)
        model = joblib.load(model_path)
        data = {'Day_of_Week': [1], 'Is_Special_Event': [0]}
        input_data = pd.DataFrame(data)
        input_data['Day_of_Week'] = input_data['Day_of_Week'].astype('category')
        input_data_scaled = scaler.transform(input_data)
        predicted_traffic = model.predict(input_data_scaled)
        print("Predicted Traffic for Coming Monday:", predicted_traffic[0])
        days_of_week = [1, 2, 3, 4, 5]
        is_special_event = [0, 1]
        combinations = {}
        for day in days_of_week:
            for event in is_special_event:
                combination_data = pd.DataFrame({'Day_of_Week': [day], 'Is_Special_Event': [event]})
                combination_data['Day_of_Week'] = combination_data['Day_of_Week'].astype('category')
                combination_data_scaled = scaler.transform(combination_data)
                predicted_traffic = model.predict(combination_data_scaled)
                key = f'Day_{day}_Event_{event}'
                combinations[key] = predicted_traffic[0]
        combinations_json = json.dumps(combinations, indent=4)
        print("hehehe");
        print(combinations_json)
        return jsonify({'predictions': json.loads(combinations_json),'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=4000)
