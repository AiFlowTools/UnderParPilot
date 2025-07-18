import React from 'react';

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="relative w-[320px] h-[320px]">
        
        {/* Golf Ball Background */}
        <img
          src="/golf-ball.svg"
          alt="Golf Ball"
          className="w-full h-full object-contain"
        />

        {/* Overlayed Content Inside the Ball */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-12 pb-6">
          
          {/* Logo at the Top */}
          <img
            src="/fairwaymate-logo.svg"
            alt="FairwayMate Logo"
            className="w-20 h-auto mb-2"
          />

          {/* Welcome Text */}
          <h2 className="text-[17px] font-extrabold text-black mb-1 leading-tight">
            👋 Welcome to FairwayMate!
          </h2>
          <p className="text-gray-700 text-sm font-medium mb-1">
            We know your wife did her best...<br />but we’ll take it from here.
          </p>
          <p className="text-gray-500 text-xs leading-snug">
            Drinks, snacks, and whatever your round is missing —<br />
            delivered right to you on the course.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                onClose();
                onHowItWorks();
              }}
              className="bg-gray-100 text-gray-800 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-gray-200 transition"
            >
              How It Works
            </button>
            <button
              onClick={onClose}
              className="bg-green-600 text-white rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-green-700 transition"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
