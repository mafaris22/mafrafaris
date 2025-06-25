import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function FeatureCard({ title, description, icon, onSeeDetailsClick }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect mobile/touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleCardClick = () => {
    if (isTouchDevice) {
      setIsFlipped(prev => !prev);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onSeeDetailsClick?.();
  };

  return (
    <div
      className="relative h-72 w-full max-w-sm rounded-xl overflow-hidden cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
      onMouseEnter={() => !isTouchDevice && setIsFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setIsFlipped(false)}
    >
      <div
        className="absolute inset-0 w-full h-full preserve-3d transition-transform duration-700"
        style={{
          transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white bg-opacity-10 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">{icon || "💼"}</div>
          <h3 className="text-2xl font-bold text-gray-100">{title}</h3>
          <p className="text-xs text-blue-300 mt-4">Tap or Hover for details</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-gray-800 bg-opacity-95 rounded-xl p-6 border border-gray-600 flex flex-col items-start justify-between text-left"
             style={{ transform: 'rotateY(180deg)' }}>
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-2">{title}</h4>
            <p className="text-gray-300 text-sm mb-4 whitespace-pre-line overflow-y-auto max-h-36 pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
              {description}
            </p>
          </div>
          <button
            onClick={handleDetailsClick}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 self-center flex items-center group"
          >
            See Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 #1f2937;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #6b7280;
          border-radius: 10px;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
}

export default FeatureCard;
