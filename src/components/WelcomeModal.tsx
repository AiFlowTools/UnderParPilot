import React from 'react';

interface WelcomeModalProps {
  onHowItWorks: () => void;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onHowItWorks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] border-2 border-gray-200 w-[340px] h-[340px] flex flex-col justify-center items-center text-center p-6 space-y-3">
        <h2 className="text-xl font-extrabold text-black leading-tight">
          👋 Welcome to FairwayMate!
        </h2>

        <p className="text-gray-700 text-sm font-medium px-4">
          We know your wife did her best...<br />but we’ll take it from here.
        </p>

        <p className="text-gray-500 text-xs leading-snug px-6">
          Drinks, snacks, and whatever your round is missing — delivered right to you on the course.
        </p>

        <div className="flex gap-3 pt-3">
          <button
            onClick={() => {
              onClose();
              onHowItWorks();
            }}
            className="bg-gray-100 text-gray-800 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-gray-200 transition"
          >
            How It Works
          </button>
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-green-700 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
