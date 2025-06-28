import React from 'react';
import { X, MapPin, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: MapPin,
    title: 'Scan & Browse the Menu',
    description: 'Once you scan the QR code at your hole, you\'ll instantly see this digital menu. No app download needed.',
    emoji: '⛳'
  },
  {
    icon: ShoppingCart,
    title: 'Place Your Order',
    description: 'Add items to your cart and check out with your phone. We\'ll receive your order in the clubhouse right away.',
    emoji: '🛒'
  },
  {
    icon: Truck,
    title: 'Delivered Right to Your Hole',
    description: 'Our staff prepares your order and brings it directly to your location on the course.',
    emoji: '🧺'
  }
];

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

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
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">How FairwayMate Works</h2>
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
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center relative">
                      <span className="text-2xl">{step.emoji}</span>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Step {index + 1}: {step.title}
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
                    Privacy Notice
                  </h4>
                  <p className="text-sm text-blue-700">
                    We use your location only at the time of ordering to help us deliver to the correct hole. 
                    Your data is never stored or shared.
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  Ready to start ordering? It's that simple!
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
              <span>Got it – Back to Menu</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}