'use client'
import { useState, useRef } from 'react';
import axios from "axios";
import * as XLSX from 'xlsx';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  CreditCard,
  User,
  TrendingUp,
  Clock,
  Briefcase,
  Award,
  Brain,
  Shield,
  Battery,
  Zap,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Percent,
  Calculator
} from 'lucide-react';

// Type definitions remain the same
export interface LoanApplication {
  income: number;
  credit_score: number;
  employment_years: number;
  loan_amount: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  model_used?: string;
  loan_approved?: string;
  timestamp?: string;
  applicationData?: LoanApplication;
}

interface HistoryRecord {
  id: string;
  application: LoanApplication;
  prediction: PredictionResponse;
  timestamp: string;
}

const CREDIT_SCORE_RANGES = [
  { label: 'Poor', range: [300, 579], color: 'text-red-600' },
  { label: 'Fair', range: [580, 669], color: 'text-yellow-600' },
  { label: 'Good', range: [670, 739], color: 'text-blue-600' },
  { label: 'Very Good', range: [740, 799], color: 'text-green-600' },
  { label: 'Excellent', range: [800, 850], color: 'text-emerald-600' }
];

export default function Home() {
  const [application, setApplication] = useState<LoanApplication>({
    income: 50000,
    credit_score: 650,
    employment_years: 5,
    loan_amount: 30000
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [modelType, setModelType] = useState<'lr' | 'dt'>('lr');

  const resultRef = useRef<HTMLDivElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const predictLoan = async (applicationData: LoanApplication): Promise<PredictionResponse> => {
    try {
      const response = await axios.post<PredictionResponse>(
        `${BASE_URL}/predict?model_type=${modelType}`, 
        applicationData
      );
      return {
        ...response.data,
        timestamp: new Date().toISOString(),
        applicationData: applicationData
      };
    } catch (error: any) {
      console.error("Error predicting loan approval:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictLoan(application);
      setPrediction(result);
      
      const historyRecord: HistoryRecord = {
        id: Date.now().toString(),
        application: { ...application },
        prediction: result,
        timestamp: new Date().toISOString()
      };
      
      setHistory(prev => [historyRecord, ...prev.slice(0, 9)]);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to get prediction. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const getApprovalStatus = (prediction: number) => {
    return prediction === 1 ? 'Approved' : 'Not Approved';
  };

  const getApprovalColor = (prediction: number) => {
    return prediction === 1 
      ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
      : 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  const getApprovalTextColor = (prediction: number) => {
    return prediction === 1 ? 'text-emerald-700' : 'text-red-700';
  };

  const getApprovalIcon = (prediction: number) => {
    return prediction === 1 ? (
      <CheckCircle className="w-20 h-20 text-emerald-500" />
    ) : (
      <AlertCircle className="w-20 h-20 text-red-500" />
    );
  };

  const getCreditScoreCategory = (score: number) => {
    for (const range of CREDIT_SCORE_RANGES) {
      if (score >= range.range[0] && score <= range.range[1]) {
        return range;
      }
    }
    return CREDIT_SCORE_RANGES[0];
  };

  const calculateLoanToIncomeRatio = () => {
    return (application.loan_amount / application.income * 100).toFixed(1);
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const data = history.map(record => ({
        'Application ID': record.id,
        'Timestamp': new Date(record.timestamp).toLocaleString(),
        'Status': getApprovalStatus(record.prediction.prediction),
        'Probability': formatProbability(record.prediction.probability),
        'Income (Br)': record.application.income.toLocaleString(),
        'Credit Score': record.application.credit_score,
        'Employment Years': record.application.employment_years,
        'Loan Amount (Br)': record.application.loan_amount.toLocaleString(),
        'Loan-to-Income Ratio': `${(record.application.loan_amount / record.application.income * 100).toFixed(1)}%`
      }));

      if (prediction) {
        data.unshift({
          'Application ID': 'CURRENT',
          'Timestamp': new Date().toLocaleString(),
          'Status': getApprovalStatus(prediction.prediction),
          'Probability': formatProbability(prediction.probability),
          'Income (Br)': application.income.toLocaleString(),
          'Credit Score': application.credit_score,
          'Employment Years': application.employment_years,
          'Loan Amount (Br)': application.loan_amount.toLocaleString(),
          'Loan-to-Income Ratio': `${calculateLoanToIncomeRatio()}%`
        });
      }

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Loan Applications");
      
      XLSX.writeFile(wb, `loan_applications_${new Date().toISOString().split('T')[0]}.xlsx`);
      setShowExportMenu(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (!prediction) return;
      
      const text = `Loan Approval Prediction Result:
Status: ${getApprovalStatus(prediction.prediction)}
Probability: ${formatProbability(prediction.probability)}
Income: Br ${application.income.toLocaleString()}
Credit Score: ${application.credit_score}
Employment Years: ${application.employment_years}
Loan Amount: Br ${application.loan_amount.toLocaleString()}
Loan-to-Income Ratio: ${calculateLoanToIncomeRatio()}%
Timestamp: ${new Date().toLocaleString()}`;
      
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 p-6 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Loan Approval Predictor</h1>
              <p className="text-lg text-gray-600 mt-1">AI-Powered Credit Assessment System</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <Download className="w-6 h-6 text-teal-600" />
                <span className="font-semibold text-gray-800">Export Data</span>
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button onClick={exportToExcel} disabled={exportLoading} className="flex items-center w-full px-5 py-4 text-left hover:bg-gray-50 disabled:opacity-50">
                    <FileSpreadsheet className="w-5 h-5 mr-3 text-green-600" />
                    <span className="font-medium">Export to Excel</span>
                  </button>
                  <button onClick={copyToClipboard} className="flex items-center w-full px-5 py-4 text-left hover:bg-gray-50">
                    <Copy className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">Copy Result</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-md">
              <Zap className="w-6 h-6" />
              <span className="font-semibold">Real-time AI Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calculator className="w-8 h-8 mr-3 text-teal-600" />
                Loan Application Details
              </h2>
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-semibold text-sm">
                ML Model v2.0
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Model Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">Choose Prediction Model</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setModelType('lr')}
                    className={`py-5 rounded-2xl font-medium transition-all ${modelType === 'lr' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Logistic Regression
                  </button>
                  <button type="button" onClick={() => setModelType('dt')}
                    className={`py-5 rounded-2xl font-medium transition-all ${modelType === 'dt' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Decision Tree
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Income */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Annual Income (Br)</label>
                  <div className="relative">
                    <Calculator className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                    <input
                      type="number"
                      min="20000"
                      max="1000000"
                      step="1000"
                      value={application.income}
                      onChange={(e) => setApplication({...application, income: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-5 py-5 text-lg text-black border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-500"
                      placeholder="e.g. 120,000"
                      required
                    />
                  </div>
                </div>

                {/* Credit Score */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Credit Score</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                    <input
                      type="number"
                      min="300"
                      max="850"
                      value={application.credit_score}
                      onChange={(e) => setApplication({...application, credit_score: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-5 py-5 text-lg text-black border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-500"
                      placeholder="e.g. 720"
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Category: <span className={getCreditScoreCategory(application.credit_score).color}>
                      {getCreditScoreCategory(application.credit_score).label}
                    </span>
                  </p>
                </div>

                {/* Employment Years */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Years of Employment</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={application.employment_years}
                      onChange={(e) => setApplication({...application, employment_years: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-5 py-5 text-lg text-black border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-500"
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Requested Loan Amount (Br)</label>
                  <div className="relative">
                    <Calculator className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                    <input
                      type="number"
                      min="5000"
                      max="1000000"
                      step="1000"
                      value={application.loan_amount}
                      onChange={(e) => setApplication({...application, loan_amount: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-5 py-5 text-lg text-black border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-500"
                      placeholder="e.g. 50,000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border-2 border-teal-200">
                <h3 className="text-xl font-bold text-gray-800 mb-5">Key Risk Indicators</h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Loan-to-Income</p>
                    <p className={`text-2xl font-bold ${parseFloat(calculateLoanToIncomeRatio()) > 40 ? 'text-red-600' : parseFloat(calculateLoanToIncomeRatio()) > 30 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {calculateLoanToIncomeRatio()}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Credit Rating</p>
                    <p className={`text-2xl font-bold ${getCreditScoreCategory(application.credit_score).color}`}>
                      {getCreditScoreCategory(application.credit_score).label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Stability</p>
                    <p className={`text-2xl font-bold ${application.employment_years > 5 ? 'text-emerald-600' : application.employment_years > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {application.employment_years > 5 ? 'Stable' : application.employment_years > 2 ? 'Moderate' : 'Limited'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-60 shadow-xl hover:shadow-2xl flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-4"></div>
                    <span>Analyzing Application...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-7 h-7 mr-4" />
                    Predict Loan Approval
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results & History */}
        <div className="space-y-8">
          <div ref={resultRef}>
            {prediction ? (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Prediction Result</h2>
                  <div className={`inline-block px-8 py-3 rounded-full text-xl font-bold ${prediction.prediction === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {getApprovalStatus(prediction.prediction)}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-lg mb-3">
                      <span className="text-gray-700">Approval Confidence</span>
                      <span className="font-bold text-2xl text-gray-900">{formatProbability(prediction.probability)}</span>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 shadow-inner ${getApprovalColor(prediction.prediction)}`} style={{ width: `${prediction.probability * 100}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl text-center border">
                      <Award className="w-10 h-10 mx-auto mb-3 text-teal-600" />
                      <p className="text-sm text-gray-600">Credit Score</p>
                      <p className="text-3xl font-bold text-gray-900">{application.credit_score}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl text-center border">
                      <Percent className="w-10 h-10 mx-auto mb-3 text-teal-600" />
                      <p className="text-sm text-gray-600">LTI Ratio</p>
                      <p className="text-3xl font-bold text-gray-900">{calculateLoanToIncomeRatio()}%</p>
                    </div>
                  </div>

                  <div className="text-center py-10 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl">
                    {getApprovalIcon(prediction.prediction)}
                    <h3 className="text-4xl font-bold text-gray-900 mt-6">
                      {getApprovalStatus(prediction.prediction)}
                    </h3>
                    <p className="text-lg text-gray-700 mt-4">
                      {prediction.prediction === 1 
                        ? 'Congratulations! Your application is likely to be approved.'
                        : 'Further review recommended. Consider improving credit or reducing loan amount.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
                <CreditCard className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Ready for Prediction</h3>
                <p className="text-gray-500 text-lg">Fill in the details and click "Predict" to see results.</p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="w-7 h-7 mr-3 text-teal-600" />
                Recent Predictions
              </h3>
              <span className="text-sm font-medium text-gray-500">{history.length} entries</span>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No predictions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Br {record.application.loan_amount.toLocaleString()} • Score: {record.application.credit_score}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${record.prediction.prediction === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {record.prediction.prediction === 1 ? 'APPROVED' : 'REJECTED'}
                        </span>
                        <p className="text-sm font-medium mt-2">
                          {formatProbability(record.prediction.probability)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}