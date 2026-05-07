import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import JournalInput from '../../features/analysis/JournalInput.jsx';
import AnalysisResults from '../../features/analysis/AnalysisResults.jsx';
import Card from '../components/Card.jsx';
import { Sparkles } from 'lucide-react';

export default function AnalysisPage() {
  const { analyze, isAnalyzing, result, error, getLatest } = useAnalysis();
  const [showResults, setShowResults] = useState(false);

  // Load latest analysis on mount
  useEffect(() => {
    const latest = getLatest();
    if (latest) {
      setShowResults(true);
    }
  }, [getLatest]);

  const handleAnalyze = async (text) => {
    try {
      await analyze(text, true);
      setShowResults(true);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-lavender-600" />
          <h1 className="text-4xl font-bold text-neutral-900">
            AI Mood Analysis
          </h1>
        </div>
        <p className="text-neutral-600">
          Share your thoughts and receive real-time emotional insights powered by advanced AI
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <JournalInput onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} />
          </Card>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card variant="elevated" className="mt-4 border-red-300 bg-red-50">
                <p className="text-red-600">❌ {error}</p>
              </Card>
            </motion.div>
          )}

          {/* Quick Tips */}
          <Card variant="elevated" className="mt-4 bg-lavender-50 border-lavender-200">
            <h3 className="font-semibold mb-3 text-lavender-700 flex items-center gap-2">
              💡 Tips for Better Analysis
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Be honest and specific about your feelings</li>
              <li>• Describe what's happening in your life</li>
              <li>• Mention your energy levels and motivation</li>
              <li>• Include any stressors or positive events</li>
            </ul>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {showResults && result ? (
            <AnalysisResults result={result} />
          ) : (
            <Card variant="elevated">
              <div className="text-center py-16 text-neutral-500">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-6xl mb-4"
                >
                  🤖
                </motion.div>
                <p className="text-lg font-medium mb-2 text-neutral-700">Ready to Analyze</p>
                <p className="text-sm text-neutral-500">Your emotional insights will appear here</p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
