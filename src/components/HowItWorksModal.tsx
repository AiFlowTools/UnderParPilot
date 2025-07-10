import React from 'react';
import { X, MapPin, ShoppingCart, Truck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from '../lib/translations';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  if (!isOpen) return null;

  const steps = [
    {
      icon: MapPin,
      title: t('howItWorksModal.step1.title'),
      description: t('howItWorksModal.step1.description'),
      emoji: '⛳'
    },
    {
      icon: ShoppingCart,
      title: t('howItWorksModal.step2.title'),
      description: t('howItWorksModal.step2.description'),
      emoji: '🛒'
    },
    {
      icon: Truck,
      title: t('howItWorksModal.step3.title'),
      description: t('howItWorksModal.step3.description'),
      emoji: '🧺'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">{t('howItWorksModal.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{step.emoji}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'fr' ? `Étape ${index + 1}` : `Step ${index + 1}`}: {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Location Disclaimer */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    {t('howItWorksModal.privacyNotice')}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {t('howItWorksModal.privacyText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  {t('howItWorksModal.readyMessage')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>{t('howItWorksModal.backToMenuButton')}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}