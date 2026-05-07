/**
 * Advanced Sentiment Analysis Engine
 * Real dynamic emotion detection with keyword analysis and weighted scoring
 */

// Emotion dictionaries with weighted scores
const EMOTION_KEYWORDS = {
  // Stress & Anxiety (increases stress)
  stress: {
    keywords: [
      'stressed', 'stress', 'anxious', 'anxiety', 'worried', 'worry',
      'overwhelmed', 'pressure', 'tense', 'nervous', 'panic', 'frantic',
      'exhausted', 'tired', 'drained', 'burnt out', 'burnout', 'overworked',
      'deadline', 'rush', 'hectic', 'chaos', 'chaotic', 'struggling'
    ],
    weight: 15,
  },

  // Sadness & Depression (decreases motivation)
  sadness: {
    keywords: [
      'sad', 'depressed', 'depression', 'down', 'low', 'unhappy',
      'miserable', 'hopeless', 'despair', 'lonely', 'alone', 'isolated',
      'empty', 'numb', 'crying', 'tears', 'heartbroken', 'grief',
      'disappointed', 'discouraged', 'defeated', 'worthless'
    ],
    weight: 12,
  },

  // Anger & Frustration (increases stress, decreases confidence)
  anger: {
    keywords: [
      'angry', 'anger', 'mad', 'furious', 'frustrated', 'frustration',
      'irritated', 'annoyed', 'rage', 'hate', 'bitter', 'resentful',
      'upset', 'pissed', 'agitated', 'hostile', 'aggressive'
    ],
    weight: 13,
  },

  // Happiness & Joy (increases motivation and confidence)
  happiness: {
    keywords: [
      'happy', 'joy', 'joyful', 'excited', 'excitement', 'great',
      'amazing', 'wonderful', 'fantastic', 'excellent', 'awesome',
      'love', 'loving', 'grateful', 'thankful', 'blessed', 'content',
      'satisfied', 'pleased', 'delighted', 'cheerful', 'optimistic'
    ],
    weight: 14,
  },

  // Confidence & Pride (increases confidence)
  confidence: {
    keywords: [
      'confident', 'confidence', 'proud', 'accomplished', 'achievement',
      'success', 'successful', 'capable', 'strong', 'powerful',
      'determined', 'motivated', 'inspired', 'empowered', 'winning',
      'achieved', 'completed', 'mastered', 'skilled'
    ],
    weight: 16,
  },

  // Motivation & Energy (increases motivation)
  motivation: {
    keywords: [
      'motivated', 'motivation', 'energized', 'energy', 'driven',
      'ambitious', 'focused', 'productive', 'efficient', 'active',
      'enthusiastic', 'passionate', 'eager', 'ready', 'pumped',
      'inspired', 'determined', 'goal', 'progress'
    ],
    weight: 15,
  },

  // Fear & Worry (increases stress, decreases confidence)
  fear: {
    keywords: [
      'scared', 'afraid', 'fear', 'fearful', 'terrified', 'frightened',
      'worried', 'concern', 'concerned', 'uncertain', 'doubt', 'doubtful',
      'insecure', 'vulnerable', 'threatened', 'danger', 'risk'
    ],
    weight: 13,
  },

  // Fatigue & Exhaustion (decreases motivation and confidence)
  fatigue: {
    keywords: [
      'tired', 'exhausted', 'fatigue', 'weary', 'drained', 'depleted',
      'worn out', 'sleepy', 'lethargic', 'sluggish', 'weak', 'fatigued',
      'burnout', 'burnt out', 'overworked', 'spent'
    ],
    weight: 12,
  },

  // Calm & Peace (decreases stress)
  calm: {
    keywords: [
      'calm', 'peaceful', 'peace', 'relaxed', 'serene', 'tranquil',
      'comfortable', 'ease', 'easy', 'chill', 'zen', 'balanced',
      'centered', 'grounded', 'stable', 'steady'
    ],
    weight: 14,
  },
};

// Intensity modifiers
const INTENSIFIERS = {
  high: ['very', 'extremely', 'incredibly', 'really', 'so', 'too', 'absolutely', 'completely', 'totally'],
  medium: ['quite', 'pretty', 'fairly', 'rather', 'somewhat'],
  low: ['a bit', 'a little', 'slightly', 'kind of', 'sort of'],
};

// Negation words
const NEGATIONS = ['not', 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere', 'hardly', 'barely', 'scarcely'];

class AdvancedSentimentEngine {
  /**
   * Analyze text and return comprehensive emotional analysis
   */
  analyze(text) {
    console.log('🧠 SENTIMENT ANALYSIS START');
    console.log('📝 Input text:', text);
    
    if (!text || text.trim().length === 0) {
      console.log('⚠️ Empty text, returning default analysis');
      return this.getDefaultAnalysis();
    }

    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);
    console.log('📊 Word count:', words.length);

    // Detect emotions with scores
    const emotionScores = this.detectEmotions(normalizedText, words);
    console.log('😊 Emotion scores:', emotionScores);

    // Calculate metrics
    const metrics = this.calculateMetrics(emotionScores);
    console.log('📈 Calculated metrics:', metrics);

    // Determine primary emotion
    const primaryEmotion = this.determinePrimaryEmotion(emotionScores);
    console.log('🎯 Primary emotion:', primaryEmotion);

    // Generate insights and suggestions
    const insights = this.generateInsights(emotionScores, metrics, primaryEmotion);
    const suggestions = this.generateSuggestions(emotionScores, metrics, primaryEmotion);

    // Determine emotional state
    const emotionalState = this.determineEmotionalState(metrics, primaryEmotion);
    console.log('💭 Emotional state:', emotionalState);

    const result = {
      metrics,
      primaryEmotion,
      emotionalState,
      emotionScores,
      insights,
      suggestions,
      timestamp: new Date().toISOString(),
      wordCount: words.length,
    };
    
    console.log('✅ SENTIMENT ANALYSIS COMPLETE');
    console.log('📊 Final result:', result);
    
    return result;
  }

  /**
   * Detect emotions in text with weighted scoring
   */
  detectEmotions(text, words) {
    const scores = {};

    Object.entries(EMOTION_KEYWORDS).forEach(([emotion, data]) => {
      let score = 0;
      let matchCount = 0;

      data.keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);

        if (matches) {
          let keywordScore = data.weight * matches.length;

          // Check for intensifiers
          matches.forEach(() => {
            const intensity = this.checkIntensity(text, keyword);
            keywordScore *= intensity;
          });

          // Check for negations
          if (this.isNegated(text, keyword)) {
            keywordScore *= 0.3; // Reduce score if negated
          }

          score += keywordScore;
          matchCount += matches.length;
        }
      });

      scores[emotion] = {
        score: Math.round(score),
        matchCount,
        normalized: 0, // Will be calculated later
      };
    });

    // Normalize scores to 0-100 range
    const maxScore = Math.max(...Object.values(scores).map(s => s.score), 1);
    Object.keys(scores).forEach(emotion => {
      scores[emotion].normalized = Math.min(100, Math.round((scores[emotion].score / maxScore) * 100));
    });

    return scores;
  }

  /**
   * Check for intensity modifiers near keyword
   */
  checkIntensity(text, keyword) {
    const words = text.split(/\s+/);
    const keywordIndex = words.findIndex(w => w.includes(keyword));

    if (keywordIndex === -1) return 1;

    // Check previous 2 words
    for (let i = Math.max(0, keywordIndex - 2); i < keywordIndex; i++) {
      const word = words[i];
      if (INTENSIFIERS.high.includes(word)) return 1.5;
      if (INTENSIFIERS.medium.includes(word)) return 1.2;
      if (INTENSIFIERS.low.includes(word)) return 0.8;
    }

    return 1;
  }

  /**
   * Check if keyword is negated
   */
  isNegated(text, keyword) {
    const words = text.split(/\s+/);
    const keywordIndex = words.findIndex(w => w.includes(keyword));

    if (keywordIndex === -1) return false;

    // Check previous 3 words for negation
    for (let i = Math.max(0, keywordIndex - 3); i < keywordIndex; i++) {
      if (NEGATIONS.includes(words[i])) return true;
    }

    return false;
  }

  /**
   * Calculate stress, motivation, and confidence metrics
   */
  calculateMetrics(emotionScores) {
    // Stress calculation (0-100)
    let stress = 0;
    stress += emotionScores.stress.normalized * 0.4;
    stress += emotionScores.anger.normalized * 0.3;
    stress += emotionScores.fear.normalized * 0.2;
    stress += emotionScores.fatigue.normalized * 0.1;
    stress -= emotionScores.calm.normalized * 0.3;
    stress = Math.max(0, Math.min(100, Math.round(stress)));

    // Motivation calculation (0-100)
    let motivation = 50; // Base level
    motivation += emotionScores.motivation.normalized * 0.4;
    motivation += emotionScores.happiness.normalized * 0.2;
    motivation += emotionScores.confidence.normalized * 0.2;
    motivation -= emotionScores.sadness.normalized * 0.3;
    motivation -= emotionScores.fatigue.normalized * 0.3;
    motivation = Math.max(0, Math.min(100, Math.round(motivation)));

    // Confidence calculation (0-100)
    let confidence = 50; // Base level
    confidence += emotionScores.confidence.normalized * 0.5;
    confidence += emotionScores.happiness.normalized * 0.2;
    confidence -= emotionScores.fear.normalized * 0.3;
    confidence -= emotionScores.sadness.normalized * 0.2;
    confidence -= emotionScores.anger.normalized * 0.1;
    confidence = Math.max(0, Math.min(100, Math.round(confidence)));

    // Emotional balance (0-100)
    const positiveEmotions = emotionScores.happiness.normalized + emotionScores.confidence.normalized + emotionScores.calm.normalized;
    const negativeEmotions = emotionScores.stress.normalized + emotionScores.sadness.normalized + emotionScores.anger.normalized + emotionScores.fear.normalized;
    const balance = Math.max(0, Math.min(100, Math.round(50 + (positiveEmotions - negativeEmotions) / 6)));

    return {
      stress,
      motivation,
      confidence,
      emotionalBalance: balance,
    };
  }

  /**
   * Determine primary emotion
   */
  determinePrimaryEmotion(emotionScores) {
    let maxEmotion = 'neutral';
    let maxScore = 0;

    Object.entries(emotionScores).forEach(([emotion, data]) => {
      if (data.normalized > maxScore) {
        maxScore = data.normalized;
        maxEmotion = emotion;
      }
    });

    // Map to user-friendly emotion names
    const emotionMap = {
      happiness: 'Happy',
      sadness: 'Sad',
      anger: 'Angry',
      fear: 'Anxious',
      stress: 'Stressed',
      confidence: 'Confident',
      motivation: 'Motivated',
      fatigue: 'Tired',
      calm: 'Calm',
    };

    return maxScore > 20 ? emotionMap[maxEmotion] || 'Neutral' : 'Neutral';
  }

  /**
   * Determine overall emotional state
   */
  determineEmotionalState(metrics, primaryEmotion) {
    const { stress, motivation, confidence, emotionalBalance } = metrics;

    if (stress > 70) return 'High Stress';
    if (stress > 50 && motivation < 40) return 'Burnout Risk';
    if (motivation < 30 && confidence < 30) return 'Low Energy';
    if (emotionalBalance < 30) return 'Emotional Distress';
    if (motivation > 70 && confidence > 70) return 'Thriving';
    if (emotionalBalance > 70) return 'Balanced';
    if (stress < 30 && emotionalBalance > 50) return 'Calm & Stable';

    return 'Moderate';
  }

  /**
   * Generate insights based on analysis
   */
  generateInsights(emotionScores, metrics, primaryEmotion) {
    const insights = [];

    if (metrics.stress > 70) {
      insights.push('Your stress levels are quite high. Consider taking breaks and practicing relaxation techniques.');
    } else if (metrics.stress > 50) {
      insights.push('You\'re experiencing moderate stress. Some stress management could be beneficial.');
    }

    if (metrics.motivation < 30) {
      insights.push('Your motivation seems low. This might be a good time to revisit your goals and find inspiration.');
    } else if (metrics.motivation > 70) {
      insights.push('You\'re feeling highly motivated! Great time to tackle challenging tasks.');
    }

    if (metrics.confidence < 30) {
      insights.push('Your confidence could use a boost. Remember your past achievements and strengths.');
    } else if (metrics.confidence > 70) {
      insights.push('You\'re feeling confident! This is an excellent mindset for taking on new challenges.');
    }

    if (emotionScores.fatigue.normalized > 60) {
      insights.push('You seem exhausted. Rest and self-care should be priorities right now.');
    }

    if (emotionScores.sadness.normalized > 60) {
      insights.push('You\'re experiencing sadness. It\'s okay to feel this way. Consider reaching out to someone you trust.');
    }

    if (metrics.emotionalBalance > 70) {
      insights.push('Your emotions are well-balanced. You\'re in a good mental space.');
    }

    if (insights.length === 0) {
      insights.push('Your emotional state seems stable. Keep maintaining your current wellness practices.');
    }

    return insights;
  }

  /**
   * Generate personalized suggestions
   */
  generateSuggestions(emotionScores, metrics, primaryEmotion) {
    const suggestions = [];

    // Stress management
    if (metrics.stress > 60) {
      suggestions.push({
        category: 'Stress Relief',
        title: 'Try Deep Breathing',
        description: 'Take 5 minutes for deep breathing exercises to calm your nervous system.',
        icon: '🧘',
      });
      suggestions.push({
        category: 'Stress Relief',
        title: 'Take a Break',
        description: 'Step away from stressful situations. A short walk can help reset your mind.',
        icon: '🚶',
      });
    }

    // Motivation boost
    if (metrics.motivation < 40) {
      suggestions.push({
        category: 'Motivation',
        title: 'Set Small Goals',
        description: 'Break tasks into smaller, achievable steps to build momentum.',
        icon: '🎯',
      });
      suggestions.push({
        category: 'Motivation',
        title: 'Listen to Uplifting Music',
        description: 'Music can boost your mood and energy levels.',
        icon: '🎵',
      });
    }

    // Confidence building
    if (metrics.confidence < 40) {
      suggestions.push({
        category: 'Confidence',
        title: 'Recall Your Wins',
        description: 'Write down 3 things you\'ve accomplished recently, no matter how small.',
        icon: '🏆',
      });
      suggestions.push({
        category: 'Confidence',
        title: 'Positive Affirmations',
        description: 'Practice positive self-talk. You\'re more capable than you think.',
        icon: '💪',
      });
    }

    // Fatigue management
    if (emotionScores.fatigue.normalized > 60) {
      suggestions.push({
        category: 'Energy',
        title: 'Prioritize Rest',
        description: 'Your body needs recovery. Aim for 7-9 hours of quality sleep tonight.',
        icon: '😴',
      });
      suggestions.push({
        category: 'Energy',
        title: 'Gentle Movement',
        description: 'Light stretching or yoga can help restore energy without exhausting you.',
        icon: '🧘‍♀️',
      });
    }

    // Sadness support
    if (emotionScores.sadness.normalized > 60) {
      suggestions.push({
        category: 'Emotional Support',
        title: 'Connect with Others',
        description: 'Reach out to a friend or loved one. Social connection can lift your spirits.',
        icon: '💬',
      });
      suggestions.push({
        category: 'Emotional Support',
        title: 'Practice Gratitude',
        description: 'List 3 things you\'re grateful for today, even small things.',
        icon: '🙏',
      });
    }

    // General wellness
    if (suggestions.length < 3) {
      suggestions.push({
        category: 'Wellness',
        title: 'Stay Hydrated',
        description: 'Drink water throughout the day to maintain energy and focus.',
        icon: '💧',
      });
      suggestions.push({
        category: 'Wellness',
        title: 'Mindful Moment',
        description: 'Take 2 minutes to focus on your breath and be present.',
        icon: '🌟',
      });
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  /**
   * Get default analysis for empty input
   */
  getDefaultAnalysis() {
    return {
      metrics: {
        stress: 0,
        motivation: 50,
        confidence: 50,
        emotionalBalance: 50,
      },
      primaryEmotion: 'Neutral',
      emotionalState: 'Awaiting Input',
      emotionScores: {},
      insights: ['Share how you\'re feeling to get personalized insights.'],
      suggestions: [],
      timestamp: new Date().toISOString(),
      wordCount: 0,
    };
  }
}

export default new AdvancedSentimentEngine();
