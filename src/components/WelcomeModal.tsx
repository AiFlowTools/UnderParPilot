import React from 'react';

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="relative flex flex-col items-center space-y-4">
        
        {/* Golf Ball */}
        <div
          className="w-[320px] h-[320px] rounded-full border-2 border-gray-300 flex flex-col items-center justify-center text-center px-6 shadow-xl"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 10%, #e5e5e5 2px, transparent 2px),
              radial-gradient(circle at 30% 30%, #e5e5e5 2px, transparent 2px),
              radial-gradient(circle at 50% 50%, #e5e5e5 2px, transparent 2px),
              radial-gradient(circle at 70% 70%, #e5e5e5 2px, transparent 2px),
              radial-gradient(circle at 90% 90%, #e5e5e5 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px',
            backgroundColor: '#fff',
          }}
        >
          <h2 className="text-xl font-extrabold text-black mb-2 leading-tight">
            👋 Welcome to FairwayMate!
          </h2>
          <p className="text-gray-700 text-sm font-medium mb-1">
            We know your wife did her best...<br />but we’ll take it from here.
          </p>
          <p className="text-gray-500 text-xs leading-snug">
            Drinks, snacks, and whatever your round is missing —<br />
            delivered right to you on the course.
          </p>
        </div>

        {/* Tee */}
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-t-red-600"></div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2 justify-center">
          <button
            onClick={() => {
              onClose();
              onHowItWorks();
            }}
            className="bg-gray-100 text-gray-800 rounded-full px-5 py-2 text-sm font-semibold hover:bg-gray-200 transition"
          >
            How It Works
          </button>
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-green-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
