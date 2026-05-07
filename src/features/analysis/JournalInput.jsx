import { useState, useEffect } from 'react';
import { validateCharacterCount } from '../../utils/validation.js';
import Button from '../../shared/components/Button.jsx';

export default function JournalInput({ onSubmit, isAnalyzing }) {
  const [text, setText] = useState('');
  const [charInfo, setCharInfo] = useState(null);

  useEffect(() => {
    const info = validateCharacterCount(text);
    setCharInfo(info);
  }, [text]);

  const handleSubmit = () => {
    if (charInfo?.isValid && !isAnalyzing) {
      onSubmit(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="journal-input" className="block text-lg font-semibold mb-2 gradient-text">
          How are you feeling today?
        </label>
        <textarea
          id="journal-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts, feelings, work updates, or daily experiences..."
          className="w-full h-64 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 resize-none custom-scrollbar"
          disabled={isAnalyzing}
        />
      </div>

      {charInfo && (
        <div className="flex items-center justify-between text-sm">
          <span className={`
            ${charInfo.isNearLimit ? 'text-yellow-400' : 'text-gray-400'}
            ${charInfo.isAtLimit ? 'text-red-400' : ''}
          `}>
            {charInfo.length} / {10000} characters
            {!charInfo.isValid && charInfo.length < 10 && (
              <span className="ml-2 text-red-400">
                (Minimum 10 characters required)
              </span>
            )}
          </span>
          <span className="text-gray-500">
            Press Ctrl+Enter to analyze
          </span>
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={!charInfo?.isValid || isAnalyzing}
        loading={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze My Mood'}
      </Button>
    </div>
  );
}
