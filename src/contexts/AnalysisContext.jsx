import { createContext, useContext, useState, useMemo } from 'react';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const clearAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  const retryAnalysis = () => {
    setError(null);
    // Retry logic would be handled by the component
  };

  const value = useMemo(
    () => ({
      currentAnalysis,
      setCurrentAnalysis,
      isAnalyzing,
      setIsAnalyzing,
      error,
      setError,
      clearAnalysis,
      retryAnalysis,
    }),
    [currentAnalysis, isAnalyzing, error]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return context;
}
