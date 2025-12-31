"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, CreditCard, Brain, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 overflow-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <header className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 text-teal-700 font-semibold text-sm mb-8 shadow-md">
            <Zap className="w-5 h-5" />
            <span>AI-Powered Credit Intelligence</span>
            <ShieldCheck className="w-5 h-5" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
            Loan Approval<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Predictor
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            Instantly assess loan eligibility using advanced machine learning. 
            Analyze income, credit score, employment history, and loan amount with 
            <strong> Logistic Regression</strong> and <strong> Decision Tree</strong> models.
          </p>
        </header>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 max-w-5xl">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Brain className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart AI Models</h3>
            <p className="text-gray-600">Dual ML algorithms for accurate and reliable predictions</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Activity className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Analysis</h3>
            <p className="text-gray-600">Get instant results with probability scores and insights</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CreditCard className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ethiopian Context</h3>
            <p className="text-gray-600">Tailored for local financial data (Birr currency)</p>
          </div>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={() => router.push("/Home")}
          className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-4">
            Start Loan Assessment
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        </button>

        {/* Footer */}
        <footer className="mt-24 text-center text-gray-500 text-sm">
          <p>© 2025 Loan Approval Prediction System • Built for demonstration and educational purposes</p>
          <p className="mt-2">Powered by Machine Learning • All predictions are simulated</p>
        </footer>
      </div>
    </div>
  );
}