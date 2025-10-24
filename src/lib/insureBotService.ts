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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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
   * Search knowledge base for relevant content
   */
  private async searchKnowledgeBase(query: string): Promise<KnowledgeItem[]> {
    try {
      // Simple keyword-based search
      const keywords = query.toLowerCase().split(' ')
        .filter(word => word.length > 3);

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Score each knowledge item based on relevance
      const scoredItems = (data || []).map(item => {
        let score = 0;
        const itemText = `${item.title} ${item.content} ${item.category}`.toLowerCase();

        keywords.forEach(keyword => {
          if (itemText.includes(keyword)) {
            score += 1;
          }
        });

        return { ...item, score };
      });

      // Return top 3 most relevant items
      return scoredItems
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
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
      const systemPrompt = `You are InsureBot, an intelligent insurance advisor AI assistant for SmartCover AI. Your role is to help users understand insurance policies, answer questions, and guide them through their insurance journey.

Key Guidelines:
- Be friendly, professional, and empathetic
- Provide accurate, concise answers based on the context provided
- If you don't have information, be honest and suggest contacting support
- Always prioritize user's best interests
- Use simple language, avoid jargon when possible
- Be proactive in asking clarifying questions
- Mention specific coverage amounts, benefits, and features when relevant
- Guide users to take action (get quotes, file claims, etc.)

Context from Knowledge Base:
${contextText}

Important Information:
- SmartCover AI achieves 78% accuracy (11x better than traditional methods)
- Applications processed 90% faster (weeks to minutes)
- 5000+ network hospitals for cashless treatment
- Claims settled within 24-48 hours
- Customer support: +91 9797974779, darsahran12@gmail.com
- 24/7 support available`;

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
      "How do I file a claim?",
      "What's covered in health insurance?",
      "How are premiums calculated?",
      "Do you offer family floater plans?",
      "What is cashless treatment?",
      "What documents do I need?",
      "How long does claim settlement take?"
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
