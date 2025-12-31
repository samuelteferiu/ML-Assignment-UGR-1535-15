from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
import pandas as pd
import os
import json


BASE_DIR = Path(__file__).resolve().parent

# Try multiple possible paths for the model files
def find_model(model_name):
    possible_paths = [
        BASE_DIR / "model" / model_name,
        Path("model") / model_name,
        Path("Backend/model") / model_name,
        Path(os.path.join(os.getcwd(), "model", model_name)),
        Path(os.path.join(os.getcwd(), "Backend", "model", model_name)),
    ]
    
    for path in possible_paths:
        if path.exists():
            return path
    return None

# Load both models
lr_model_path = find_model("loan_approval_lr.pkl")
dt_model_path = find_model("loan_approval_dt.pkl")

if lr_model_path is None or dt_model_path is None:
    raise FileNotFoundError(
        f"Model files not found. "
        f"LR model: {lr_model_path}, DT model: {dt_model_path}. "
        f"Current working directory: {os.getcwd()}. "
        f"BASE_DIR: {BASE_DIR}"
    )

lr_model = joblib.load(lr_model_path)
dt_model = joblib.load(dt_model_path)

# Load model info
model_info_path = find_model("model_info.json")
if model_info_path:
    with open(model_info_path, 'r') as f:
        model_info = json.load(f)
else:
    model_info = {
        'feature_names': ['income', 'credit_score', 'employment_years', 'loan_amount', 
                         'loan_to_income_ratio', 'debt_service_ratio']
    }

app = FastAPI(title="Loan Approval Prediction API")


# origins = [
#     "http://localhost:3000", 
#     "http://127.0.0.1:3000", 
#     "https://diabetes-risk-prediction-eight.vercel.app/"
   
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],           
)




class LoanApplication(BaseModel):
    income: float
    credit_score: float
    employment_years: float
    loan_amount: float

@app.get("/")
def root():
    return {
        "message": "Loan Approval Prediction API",
        "models": ["Logistic Regression", "Decision Tree"],
        "features": model_info.get('feature_names', [])
    }

@app.post("/predict")
def predict_loan_approval(application: LoanApplication, model_type: str = "lr"):
    """
    Predict loan approval using either Logistic Regression (lr) or Decision Tree (dt)
    """
    # Calculate derived features
    loan_to_income_ratio = application.loan_amount / application.income
    
    # Calculate debt service ratio (monthly loan payment / monthly income)
    # Assuming 5% annual interest rate and 5-year term
    monthly_interest_rate = 0.05 / 12
    num_payments = 60  # 5 years
    monthly_loan_payment = application.loan_amount * (
        monthly_interest_rate * (1 + monthly_interest_rate)**num_payments
    ) / ((1 + monthly_interest_rate)**num_payments - 1)
    monthly_income = application.income / 12
    debt_service_ratio = monthly_loan_payment / monthly_income
    
    # Prepare input data
    input_data = {
        'income': application.income,
        'credit_score': application.credit_score,
        'employment_years': application.employment_years,
        'loan_amount': application.loan_amount,
        'loan_to_income_ratio': loan_to_income_ratio,
        'debt_service_ratio': debt_service_ratio
    }
    
    input_df = pd.DataFrame([input_data])
    
    # Select model
    if model_type.lower() == "dt":
        model = dt_model
        model_name = "Decision Tree"
    else:
        model = lr_model
        model_name = "Logistic Regression"
    
    # Ensure columns match model expectations
    feature_names = model_info.get('feature_names', input_df.columns.tolist())
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    
    input_df = input_df[feature_names]
    
    # Make prediction
    prob = model.predict_proba(input_df)[:, 1][0]
    pred_class = int(model.predict(input_df)[0])
    
    return {
        "prediction": pred_class,
        "probability": float(prob),
        "model_used": model_name,
        "loan_approved": "Yes" if pred_class == 1 else "No"
    }

@app.post("/predict/both")
def predict_both_models(application: LoanApplication):
    """
    Get predictions from both models
    """
    # Calculate derived features
    loan_to_income_ratio = application.loan_amount / application.income
    
    # Calculate debt service ratio
    monthly_interest_rate = 0.05 / 12
    num_payments = 60
    monthly_loan_payment = application.loan_amount * (
        monthly_interest_rate * (1 + monthly_interest_rate)**num_payments
    ) / ((1 + monthly_interest_rate)**num_payments - 1)
    monthly_income = application.income / 12
    debt_service_ratio = monthly_loan_payment / monthly_income
    
    # Prepare input data
    input_data = {
        'income': application.income,
        'credit_score': application.credit_score,
        'employment_years': application.employment_years,
        'loan_amount': application.loan_amount,
        'loan_to_income_ratio': loan_to_income_ratio,
        'debt_service_ratio': debt_service_ratio
    }
    
    input_df = pd.DataFrame([input_data])
    
    # Ensure columns match
    feature_names = model_info.get('feature_names', input_df.columns.tolist())
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    
    input_df = input_df[feature_names]
    
    # Get predictions from both models
    lr_prob = lr_model.predict_proba(input_df)[:, 1][0]
    lr_pred = int(lr_model.predict(input_df)[0])
    
    dt_prob = dt_model.predict_proba(input_df)[:, 1][0]
    dt_pred = int(dt_model.predict(input_df)[0])
    
    return {
        "logistic_regression": {
            "prediction": lr_pred,
            "probability": float(lr_prob),
            "loan_approved": "Yes" if lr_pred == 1 else "No"
        },
        "decision_tree": {
            "prediction": dt_pred,
            "probability": float(dt_prob),
            "loan_approved": "Yes" if dt_pred == 1 else "No"
        }
    }
