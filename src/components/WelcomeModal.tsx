import React from 'react';

// Replace with your actual image path (ensure it's in the public folder or use import if using assets)
const fairwayMateLogo = '/fairwaymate-logo.svg'; // Make sure this is the correct path to your logo

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        
        {/* Header with gradient and logo */}
        <div className="relative w-full">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-green-100 to-transparent"></div>
          
          {/* White fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white"></div>

          {/* Logo container */}
          <div className="relative py-8 flex justify-center items-center">
            <img 
              src={fairwayMateLogo} 
              alt="FairwayMate Logo"
              className="w-full h-20 w-auto object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-2 text-center space-y-5">
          <h2 className="text-2xl font-extrabold text-black">
            👋 Welcome to <span className="block">FairwayMate!</span>
          </h2>

          <p className="text-black text-sm leading-relaxed font-extrabold">
            Welcome to the app that fills in the blanks.
            <br />
            Drinks, snacks and whatever else your round is missing —<br />
            <span className="text-green-700">delivered right to you on the course.</span>
          </p>

          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={() => {
                onClose();
                onHowItWorks();
              }}
              className="bg-gray-100 text-gray-600 rounded-full px-5 py-2 font-semibold hover:bg-gray-200 transition"
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
    </div>
  );
};

export default WelcomeModal;
