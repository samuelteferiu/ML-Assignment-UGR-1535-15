# 🔹 Loan Approval Prediction System ⭐⭐⭐⭐⭐

A complete end-to-end machine learning application for predicting loan approval status using Logistic Regression and Decision Tree models.

## 📋 Features

- **Binary Classification**: Predicts loan approval (Yes/No)
- **Two ML Models**: 
  - Logistic Regression
  - Decision Tree
- **Complete Pipeline**: Data cleaning, EDA, feature engineering, model training, and evaluation
- **RESTful API**: FastAPI backend with multiple endpoints
- **Modern Frontend**: Next.js with TypeScript and Tailwind CSS
- **Model Export**: Models exported using joblib for production deployment

## 🎯 Dataset Features

- **income**: Applicant's annual income
- **credit_score**: Credit score of the applicant (300-850)
- **employment_years**: Years of employment
- **loan_amount**: Requested loan amount

## 🏗️ Project Structure

```
ml-assignment/
├── loan_approval_prediction.ipynb    # Jupyter notebook with complete ML pipeline
├── Backend/
│   ├── main.py                       # FastAPI backend application
│   ├── requirements.txt              # Python dependencies
│   ├── model/                        # Exported models (created after running notebook)
│   │   ├── loan_approval_lr.pkl     # Logistic Regression model
│   │   ├── loan_approval_dt.pkl      # Decision Tree model
│   │   └── model_info.json           # Model metadata
│   ├── Procfile                      # For deployment platforms
│   └── runtime.txt                   # Python version
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   └── Home/
│   │       └── page.tsx              # Main prediction interface
│   ├── package.json                  # Node.js dependencies
│   └── vercel.json                   # Vercel deployment config
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Jupyter Notebook (for running the ML pipeline)

### Step 1: Train the Models

1. Open `loan_approval_prediction.ipynb` in Jupyter Notebook or Google Colab
2. Run all cells to:
   - Generate/load the dataset
   - Perform data cleaning and EDA
   - Train both models
   - Export models to `Backend/model/` directory

### Step 2: Set Up Backend

```bash
cd Backend
pip install -r requirements.txt
```

The models should be in `Backend/model/` directory after running the notebook.

### Step 3: Run Backend Locally

```bash
cd Backend
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Step 4: Set Up Frontend

```bash
cd frontend
npm install
```

### Step 5: Run Frontend Locally

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Base URL
- Local: `http://localhost:8000`
- Production: Update in `frontend/app/Home/page.tsx`

### Endpoints

1. **GET /** - API information
   ```bash
   curl http://localhost:8000/
   ```

2. **POST /predict** - Predict loan approval
   ```bash
   curl -X POST "http://localhost:8000/predict?model_type=lr" \
     -H "Content-Type: application/json" \
     -d '{
       "income": 50000,
       "credit_score": 650,
       "employment_years": 5,
       "loan_amount": 30000
     }'
   ```
   
   Query Parameters:
   - `model_type`: `lr` (Logistic Regression) or `dt` (Decision Tree)

3. **POST /predict/both** - Get predictions from both models
   ```bash
   curl -X POST "http://localhost:8000/predict/both" \
     -H "Content-Type: application/json" \
     -d '{
       "income": 50000,
       "credit_score": 650,
       "employment_years": 5,
       "loan_amount": 30000
     }'
   ```

### Response Format

```json
{
  "prediction": 1,
  "probability": 0.85,
  "model_used": "Logistic Regression",
  "loan_approved": "Yes"
}
```

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment:**
   - Ensure `Procfile` exists in `Backend/` directory
   - Ensure `requirements.txt` is up to date
   - Upload model files to the platform or use a cloud storage service

2. **Deploy to Render:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `pip install -r Backend/requirements.txt`
   - Set start command: `uvicorn Backend.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables if needed

3. **Deploy to Railway:**
   - Connect GitHub repository
   - Railway will auto-detect Python
   - Set start command in `Procfile`

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```

2. **Or use Vercel Dashboard:**
   - Import GitHub repository
   - Set root directory to `frontend`
   - Vercel will auto-detect Next.js

3. **Update API URL:**
   - Update `BASE_URL` in `frontend/app/Home/page.tsx` with your backend URL
   - Or set `NEXT_PUBLIC_API_URL` environment variable in Vercel

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**Backend:**
- No environment variables required for basic setup
- Add if using cloud storage for models

## 📊 Model Performance

The models are evaluated using:
- **Accuracy**: Overall prediction accuracy
- **ROC-AUC Score**: Area under the ROC curve
- **Classification Report**: Precision, Recall, F1-Score

Run the notebook to see detailed performance metrics.

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **joblib**: Model serialization
- **uvicorn**: ASGI server

### Frontend
- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Lucide React**: Icons

### ML Pipeline
- **Jupyter Notebook**: Interactive development
- **scikit-learn**: ML models and preprocessing
- **matplotlib/seaborn**: Data visualization

## 📝 Notes

- The notebook generates synthetic data for demonstration
- In production, replace with real loan application data
- Models are trained on synthetic data - retrain with real data for production use
- Ensure model files are included in deployment or stored in cloud storage

## 🔗 Links

### GitHub Repositories
1. **Main Repository**: [Your GitHub Repo Link]
2. **Backend Repository**: [Your Backend Repo Link] (if separate)

### Deployed Applications
1. **Frontend**: [Your Vercel Deployment Link]
2. **Backend API**: [Your Backend Deployment Link]

## 📄 License

This project is for educational purposes.

## 👤 Author

Created as part of ML Assignment - Loan Approval Prediction System

---

**Note**: Remember to update the GitHub repository links and deployment URLs in this README after deployment!

