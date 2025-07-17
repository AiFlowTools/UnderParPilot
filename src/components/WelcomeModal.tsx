import React from 'react';

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-fadeIn">
        <h2 className="text-xl font-bold mb-2">👋 Welcome to FairwayMate!</h2>
        <p className="text-gray-600 mb-6 text-sm">
          We know your wife did her best...but we'll take it from here.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              onClose();
              onHowItWorks();
            }}
            className="bg-gray-100 text-gray-800 rounded-full px-4 py-2 font-medium hover:bg-gray-200 transition"
          >
            How It Works
          </button>
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-full px-4 py-2 font-medium hover:bg-green-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
