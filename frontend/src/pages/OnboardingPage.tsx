import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { sendJSON } from '../utils/api';

interface ProviderConfig {
  name: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
  isActive: boolean;
  logo: string;
  bgColor: string;
  textColor: string;
}

const deliveryProviders: ProviderConfig[] = [
  {
    name: 'Zomato',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'Z',
    bgColor: 'bg-red-500',
    textColor: 'text-white'
  },
  {
    name: 'Swiggy',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'S',
    bgColor: 'bg-orange-500',
    textColor: 'text-white'
  },
  {
    name: 'UberEats',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'U',
    bgColor: 'bg-black',
    textColor: 'text-white'
  },
  {
    name: 'Dunzo',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'D',
    bgColor: 'bg-purple-500',
    textColor: 'text-white'
  },
  {
    name: 'Zepto',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'Z',
    bgColor: 'bg-blue-500',
    textColor: 'text-white'
  },
  {
    name: 'Blinkit',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    isActive: false,
    logo: 'B',
    bgColor: 'bg-green-500',
    textColor: 'text-white'
  }
];

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [providers, setProviders] = useState<ProviderConfig[]>(deliveryProviders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const totalSteps = 3;

  const updateProvider = (index: number, field: keyof ProviderConfig, value: any) => {
    const updatedProviders = [...providers];
    updatedProviders[index] = { ...updatedProviders[index], [field]: value };
    setProviders(updatedProviders);
  };

  const toggleSecretVisibility = (providerName: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [providerName]: !prev[providerName]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return providers.some(p => p.isActive);
      case 2:
        return providers.filter(p => p.isActive).every(p => p.apiKey && p.apiSecret);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError(null);
    } else {
      setError('Please complete the current step before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const activeProviders = providers.filter(p => p.isActive);
      
      for (const provider of activeProviders) {
        await sendJSON('/api/platforms', 'POST', {
          platform: provider.name,
          api_key: provider.apiKey,
          api_secret: provider.apiSecret,
          webhook_url: provider.webhookUrl,
          is_active: provider.isActive
        });
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save provider configurations');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 < currentStep ? 'bg-emerald-500 text-white' :
            i + 1 === currentStep ? 'bg-blue-500 text-white' :
            'bg-slate-200 text-slate-600'
          }`}>
            {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              i + 1 < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Delivery Partners</h2>
        <p className="text-slate-600">Choose which delivery platforms you want to integrate with</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider, index) => (
          <div
            key={provider.name}
            className={`card-minimal cursor-pointer transition-all duration-200 ${
              provider.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'
            }`}
            onClick={() => updateProvider(index, 'isActive', !provider.isActive)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${provider.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                <span className={`text-lg font-bold ${provider.textColor}`}>
                  {provider.logo}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                <p className="text-sm text-slate-500">Delivery Partner</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                provider.isActive ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
              } flex items-center justify-center`}>
                {provider.isActive && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Configure API Credentials</h2>
        <p className="text-slate-600">Enter your API keys and secrets for the selected platforms</p>
      </div>
      
      <div className="space-y-6">
        {providers.filter(p => p.isActive).map((provider, index) => {
          const originalIndex = providers.findIndex(p => p.name === provider.name);
          return (
            <div key={provider.name} className="card-minimal">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${provider.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${provider.textColor}`}>
                    {provider.logo}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                  <div className="relative">
                    <input
                      type={showSecrets[provider.name] ? 'text' : 'password'}
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(originalIndex, 'apiKey', e.target.value)}
                      className="input-clean pr-10 w-full"
                      placeholder="Enter API Key"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(provider.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets[provider.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">API Secret</label>
                  <div className="relative">
                    <input
                      type={showSecrets[provider.name] ? 'text' : 'password'}
                      value={provider.apiSecret}
                      onChange={(e) => updateProvider(originalIndex, 'apiSecret', e.target.value)}
                      className="input-clean pr-10 w-full"
                      placeholder="Enter API Secret"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(provider.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets[provider.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL (Optional)</label>
                <input
                  type="url"
                  value={provider.webhookUrl}
                  onChange={(e) => updateProvider(originalIndex, 'webhookUrl', e.target.value)}
                  className="input-clean w-full"
                  placeholder="https://your-domain.com/webhooks/zomato"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Complete</h2>
        <p className="text-slate-600">Review your configuration before completing the setup</p>
      </div>
      
      <div className="card-minimal">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Selected Platforms</h3>
        <div className="space-y-3">
          {providers.filter(p => p.isActive).map(provider => (
            <div key={provider.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-8 h-8 ${provider.bgColor} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${provider.textColor}`}>
                  {provider.logo}
                </span>
              </div>
              <span className="font-medium text-slate-900">{provider.name}</span>
              <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Important Notes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your API credentials will be securely encrypted and stored</li>
              <li>• You can update these settings later in the Settings page</li>
              <li>• Webhook URLs are optional but recommended for real-time updates</li>
              <li>• You can add more platforms after completing the setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Setup Complete!</h2>
          <p className="text-slate-600 mb-4">Your delivery partner integrations have been configured successfully.</p>
          <div className="loading-spinner mx-auto"></div>
          <p className="text-sm text-slate-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card-minimal">
          {renderStepIndicator()}
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span className="text-rose-700">{error}</span>
              </div>
            </div>
          )}
          
          {renderCurrentStep()}
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="text-sm text-slate-500">
              Step {currentStep} of {totalSteps}
            </div>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;