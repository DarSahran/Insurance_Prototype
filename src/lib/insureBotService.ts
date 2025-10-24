import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
}

class InsureBotService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationId: string | null = null;
  private sessionId: string;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('chatbot_session_id');
    if (!sessionId) {
      sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Search knowledge base for relevant content with enhanced scoring
   */
  private async searchKnowledgeBase(query: string): Promise<KnowledgeItem[]> {
    try {
      const queryLower = query.toLowerCase();

      // Extract keywords (ignore common words)
      const stopWords = ['what', 'how', 'when', 'where', 'which', 'who', 'can', 'does', 'do', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
      const keywords = queryLower.split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word));

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*');

      if (error) throw error;

      // Enhanced scoring with multiple factors
      const scoredItems = (data || []).map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        const categoryLower = item.category.toLowerCase();
        const fullText = `${titleLower} ${contentLower} ${categoryLower}`;

        // Exact phrase match in title (highest weight)
        if (titleLower.includes(queryLower)) {
          score += 100;
        }

        // Exact phrase match in content
        if (contentLower.includes(queryLower)) {
          score += 50;
        }

        // Category match
        if (categoryLower.includes(queryLower.replace(/\s+/g, '_'))) {
          score += 30;
        }

        // Keyword matching with position weighting
        keywords.forEach(keyword => {
          // Title matches (higher weight)
          if (titleLower.includes(keyword)) {
            score += 20;
          }

          // Content matches
          const contentMatches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
          score += contentMatches * 3;

          // Category matches
          if (categoryLower.includes(keyword)) {
            score += 10;
          }
        });

        // Boost for dashboard-related queries
        if (queryLower.includes('dashboard') || queryLower.includes('feature')) {
          if (categoryLower.includes('dashboard')) {
            score += 25;
          }
        }

        // Boost for policy-specific queries
        const policyTypes = ['health', 'life', 'term', 'motor', 'car', 'bike', 'travel', 'home', 'family'];
        policyTypes.forEach(type => {
          if (queryLower.includes(type) && (categoryLower.includes(type) || titleLower.includes(type))) {
            score += 15;
          }
        });

        return { ...item, score };
      });

      // Return top 5 most relevant items (increased from 3 for better context)
      return scoredItems
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  /**
   * Create or get conversation
   */
  private async getOrCreateConversation(userId?: string): Promise<string> {
    if (this.conversationId) {
      return this.conversationId;
    }

    try {
      // Try to find existing conversation
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${this.sessionId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv) {
        this.conversationId = existingConv.id;
        return existingConv.id;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId || null,
          session_id: !userId ? this.sessionId : null,
          title: 'New Conversation'
        })
        .select()
        .single();

      if (error) throw error;

      this.conversationId = newConv.id;
      return newConv.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Save message to database
   */
  private async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
          metadata: metadata || {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        metadata: msg.metadata
      }));
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  /**
   * Generate response using RAG
   */
  async chat(userMessage: string, userId?: string): Promise<string> {
    try {
      // Get or create conversation
      const conversationId = await this.getOrCreateConversation(userId);

      // Save user message
      await this.saveMessage(conversationId, 'user', userMessage);

      // Search knowledge base for relevant context
      const relevantContext = await this.searchKnowledgeBase(userMessage);

      // Build context from knowledge base
      const contextText = relevantContext
        .map(item => `${item.title}: ${item.content}`)
        .join('\n\n');

      // Get recent conversation history
      const history = await this.getConversationHistory(conversationId);
      const recentHistory = history.slice(-6); // Last 3 exchanges

      // Build prompt with context and history
      const systemPrompt = `You are InsureBot, an intelligent insurance advisor AI assistant for SmartCover AI. Your role is to help users understand insurance policies, answer questions about our platform features, and guide them through their insurance journey.

Core Capabilities:
- Explain all insurance types: Health, Life, Motor (Car/Bike), Travel, Home, Investment, Retirement
- Guide users through dashboard features and how to use them
- Help with policy selection, claims filing, renewals, and payments
- Provide details about coverage, premiums, benefits, and exclusions
- Assist with understanding tax benefits and documentation requirements

Key Guidelines:
- Be friendly, professional, and empathetic - you're a trusted advisor
- Provide accurate, detailed answers based on the context provided below
- Reference specific policy names, coverage amounts, and premium ranges when available
- If you don't have exact information, be honest and suggest contacting support
- Use simple language but be comprehensive - users want detailed information
- Structure complex information with bullet points or numbered lists
- Always mention relevant dashboard features that can help the user
- Proactively suggest next steps (e.g., "You can view all health policies in the dashboard under Browse Policies")
- For policy questions, mention 2-3 specific options with premiums and key features
- For dashboard questions, explain the feature clearly with step-by-step instructions

Platform Highlights:
- 78% AI prediction accuracy (11x better than traditional methods)
- 90% faster application processing (weeks to minutes)
- 59 insurance providers with 1000+ policies across all categories
- 5000+ network hospitals for cashless treatment
- Average claim settlement: 36 hours
- 24/7 customer support via chat, email, phone

Dashboard Features Available:
- Policy Management: View, compare, and manage all policies
- AI Risk Assessment: Get personalized recommendations in 15 minutes
- Claims Management: File and track claims with real-time status
- Health Tracking: Monitor health metrics and get wellness tips
- Financial Planning: Analyze coverage gaps and optimize premiums
- Document Center: Secure cloud storage for all documents
- Family Management: Manage insurance for entire family
- Provider Network: Find 5000+ hospitals and healthcare providers
- Payment Management: Auto-pay, reminders, and history

Contact Information:
- Phone: +91 9797974779 (Mon-Fri 9 AM-6 PM IST)
- Email: darsahran12@gmail.com
- WhatsApp: +91 9797974779
- Office: Pune, Maharashtra, India

RELEVANT CONTEXT FOR THIS QUERY:
${contextText}

Remember: Use the context above to provide detailed, accurate answers. If the user asks about policies, mention specific options with premiums. If they ask about dashboard features, explain step-by-step how to use them.`;

      const conversationContext = recentHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}

Previous conversation:
${conversationContext}

User: ${userMessage}

InsureBot:`;

      // Generate response
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const botResponse = response.text();

      // Save assistant response
      await this.saveMessage(conversationId, 'assistant', botResponse, {
        sources: relevantContext.map(item => item.title)
      });

      return botResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at +91 9797974779.";
    }
  }

  /**
   * Get suggested questions
   */
  getSuggestedQuestions(): string[] {
    return [
      "What types of insurance do you offer?",
      "Show me health insurance options with premiums",
      "How does the AI Risk Assessment work?",
      "What dashboard features are available?",
      "How do I file a claim online?",
      "Tell me about family floater health plans",
      "What's the cashless treatment process?",
      "How can I track my health in the dashboard?",
      "What are the tax benefits on insurance?",
      "Show me term life insurance policies",
      "How do I renew my policy?",
      "What documents do I need for health insurance?"
    ];
  }

  /**
   * Reset conversation
   */
  resetConversation(): void {
    this.conversationId = null;
  }
}

export const insureBotService = new InsureBotService();
