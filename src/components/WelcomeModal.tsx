import React from 'react';
import FairwayMateLogo from '../assets/file (1).svg'; // adjust path if needed

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-4 animate-fadeIn relative">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={FairwayMateLogo}
            alt="FairwayMate Logo"
            className="h-14 mb-2"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold">
          <span role="img" aria-label="wave">👋</span> Welcome to <span className="text-black">FairwayMate!</span>
        </h2>

        {/* Intro Text */}
        <p className="text-gray-700 text-base font-medium">
          We know your wife did her best... but we’ll take it from here.
        </p>

        {/* Bold Value Prop */}
        <p className="text-black text-sm leading-relaxed font-extrabold">
          Welcome to the app that fills in the blanks. <br />
          Drinks, snacks and whatever else your round is missing — <br />
          delivered right to you on the course.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={() => {
              onClose();
              onHowItWorks();
            }}
            className="bg-gray-100 text-gray-800 rounded-full px-5 py-2 font-semibold hover:bg-gray-200 transition"
          >
            How It Works
          </button>
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-green-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
