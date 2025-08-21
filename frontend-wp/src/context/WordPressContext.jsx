// src/context/WordPressContext.jsx

import { createContext, useContext } from "react";
import { useWordPressData } from "../hooks/useWordPressData";

const WordPressContext = createContext();

// Composants de chargement
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Initialisation...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-500 text-6xl mb-4">!</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Erreur de connexion
      </h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  </div>
);

// Provider Component
export const WordPressProvider = ({ children }) => {
  const wordpressData = useWordPressData();

  if (wordpressData.loading.initial) {
    return <LoadingScreen />;
  }

  if (wordpressData.error) {
    return (
      <ErrorScreen
        error={wordpressData.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <WordPressContext.Provider value={wordpressData}>
      {children}
    </WordPressContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useWordPress = () => {
  const context = useContext(WordPressContext);
  if (!context) {
    throw new Error("useWordPress must be used within a WordPressProvider");
  }
  return context;
};
