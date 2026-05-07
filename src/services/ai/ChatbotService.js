/**
 * AI Chatbot Service
 * Provides mood-aware conversational responses
 */

class ChatbotService {
  constructor() {
    this.responses = {
      // Greetings
      greetings: [
        "Hello! I'm here to support your emotional wellness journey. How are you feeling today?",
        "Hi there! I'm your wellness companion. What's on your mind?",
        "Welcome! I'm here to listen and help. How can I support you today?",
      ],

      // High Stress Responses
      highStress: [
        "I can sense you're feeling stressed. Remember, it's okay to take a break. Have you tried some deep breathing exercises?",
        "Stress can be overwhelming. Let's work through this together. What's the main source of your stress right now?",
        "I hear that you're stressed. Taking even 5 minutes for yourself can make a difference. Would you like some stress-relief suggestions?",
      ],

      // Low Motivation Responses
      lowMotivation: [
        "Feeling unmotivated is completely normal. Sometimes starting small is the key. What's one tiny thing you could accomplish today?",
        "Low motivation happens to everyone. Let's break things down into smaller, manageable steps. What feels most achievable right now?",
        "I understand you're feeling low on energy. Remember, rest is productive too. What would help you feel more energized?",
      ],

      // Sadness Responses
      sadness: [
        "I'm sorry you're feeling sad. Your feelings are valid, and it's okay to not be okay. Would you like to talk about what's bothering you?",
        "Sadness is a natural emotion. Remember, this feeling is temporary. What usually helps lift your spirits?",
        "I hear your sadness. Sometimes just acknowledging our feelings is the first step. Is there anything specific that's weighing on you?",
      ],

      // Anxiety Responses
      anxiety: [
        "Anxiety can feel overwhelming. Let's focus on what you can control right now. What's one thing that would help you feel more grounded?",
        "I understand you're feeling anxious. Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
        "Anxiety is tough, but you're tougher. Remember to breathe. What's making you feel anxious right now?",
      ],

      // Happy/Positive Responses
      positive: [
        "That's wonderful! I'm so glad you're feeling good. What's contributing to your positive mood?",
        "Your positive energy is amazing! Keep riding this wave. What made today special?",
        "I love hearing that you're feeling great! Celebrate these moments. What are you grateful for today?",
      ],

      // Tired/Fatigue Responses
      fatigue: [
        "Feeling tired is your body's way of asking for rest. Have you been getting enough sleep?",
        "Exhaustion is real. Remember, rest isn't lazy—it's necessary. What would help you recharge?",
        "I hear that you're tired. Sometimes our bodies need a break. What's one thing you can do to rest today?",
      ],

      // Confident Responses
      confident: [
        "Your confidence is inspiring! What's fueling this positive mindset?",
        "I love your confidence! This is a great time to tackle challenges. What goals are you working toward?",
        "That's the spirit! Confidence looks good on you. What are you most proud of right now?",
      ],

      // General Support
      support: [
        "I'm here for you. Whatever you're going through, you don't have to face it alone.",
        "Remember, progress isn't always linear. Every step forward counts, no matter how small.",
        "You're doing better than you think. Be kind to yourself today.",
        "Your mental health matters. Taking time for self-care isn't selfish—it's essential.",
      ],

      // Encouragement
      encouragement: [
        "You've got this! Every challenge is an opportunity to grow.",
        "Believe in yourself. You're stronger than you realize.",
        "One day at a time. You're making progress, even when it doesn't feel like it.",
        "Keep going. Your future self will thank you for not giving up.",
      ],

      // Wellness Tips
      wellnessTips: [
        "💧 Hydration tip: Drink a glass of water. Your brain functions better when hydrated!",
        "🧘 Mindfulness moment: Take 3 deep breaths. Inhale for 4, hold for 4, exhale for 4.",
        "🚶 Movement matters: A 5-minute walk can boost your mood and energy.",
        "😴 Sleep hygiene: Try to maintain a consistent sleep schedule for better rest.",
        "🙏 Gratitude practice: Name 3 things you're grateful for today.",
        "📱 Digital detox: Take a 10-minute break from screens to rest your mind.",
      ],

      // Coping Strategies
      copingStrategies: [
        "Try the 5-4-3-2-1 technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
        "Progressive muscle relaxation: Tense and release each muscle group, starting from your toes.",
        "Journaling can help: Write down your thoughts without judgment. It's therapeutic!",
        "Connect with someone: Reach out to a friend or loved one. Social support matters.",
        "Practice self-compassion: Talk to yourself like you would to a good friend.",
      ],
    };
  }

  /**
   * Get response based on user's emotional state
   */
  getResponse(userMessage, emotionalState = null, metrics = null) {
    const message = userMessage.toLowerCase();

    // Check for greetings
    if (this.isGreeting(message)) {
      return this.getRandomResponse('greetings');
    }

    // Check for help requests
    if (this.isHelpRequest(message)) {
      return this.getHelpResponse();
    }

    // Check for wellness tips request
    if (this.isWellnessTipRequest(message)) {
      return this.getRandomResponse('wellnessTips');
    }

    // Check for coping strategies request
    if (this.isCopingStrategyRequest(message)) {
      return this.getRandomResponse('copingStrategies');
    }

    // Mood-aware responses based on emotional state
    if (emotionalState && metrics) {
      return this.getMoodAwareResponse(emotionalState, metrics);
    }

    // Default supportive response
    return this.getRandomResponse('support');
  }

  /**
   * Get mood-aware response based on metrics
   */
  getMoodAwareResponse(emotionalState, metrics) {
    const { stress, motivation, confidence } = metrics;

    // High stress
    if (stress > 70) {
      return this.getRandomResponse('highStress');
    }

    // Low motivation
    if (motivation < 30) {
      return this.getRandomResponse('lowMotivation');
    }

    // Anxiety (high stress + low confidence)
    if (stress > 60 && confidence < 40) {
      return this.getRandomResponse('anxiety');
    }

    // Sadness indicators
    if (motivation < 40 && confidence < 40) {
      return this.getRandomResponse('sadness');
    }

    // Fatigue
    if (motivation < 35 && stress < 50) {
      return this.getRandomResponse('fatigue');
    }

    // Positive states
    if (motivation > 70 && confidence > 70) {
      return this.getRandomResponse('confident');
    }

    if (stress < 30 && motivation > 60) {
      return this.getRandomResponse('positive');
    }

    // Default encouragement
    return this.getRandomResponse('encouragement');
  }

  /**
   * Check if message is a greeting
   */
  isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  /**
   * Check if message is a help request
   */
  isHelpRequest(message) {
    const helpKeywords = ['help', 'support', 'advice', 'what can you do', 'how can you help'];
    return helpKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Check if message requests wellness tips
   */
  isWellnessTipRequest(message) {
    const tipKeywords = ['tip', 'tips', 'suggestion', 'advice', 'wellness', 'health'];
    return tipKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Check if message requests coping strategies
   */
  isCopingStrategyRequest(message) {
    const copingKeywords = ['cope', 'coping', 'strategy', 'technique', 'manage', 'deal with'];
    return copingKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Get help response
   */
  getHelpResponse() {
    return `I'm your AI wellness companion! Here's how I can help:

• 💬 Chat with me about your feelings
• 🧠 Get mood-aware support and suggestions
• 💡 Ask for wellness tips and coping strategies
• 🎯 Receive personalized encouragement
• 📊 Discuss your emotional patterns

Just type what's on your mind, and I'll do my best to support you!`;
  }

  /**
   * Get random response from category
   */
  getRandomResponse(category) {
    const responses = this.responses[category];
    if (!responses || responses.length === 0) {
      return "I'm here to listen. Tell me more about how you're feeling.";
    }
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get quick action suggestions
   */
  getQuickActions() {
    return [
      { label: 'How are you?', icon: '👋' },
      { label: 'I need help', icon: '🆘' },
      { label: 'Give me a tip', icon: '💡' },
      { label: 'Coping strategies', icon: '🧘' },
      { label: 'I feel stressed', icon: '😫' },
      { label: 'I feel great!', icon: '😊' },
    ];
  }
}

export default new ChatbotService();
