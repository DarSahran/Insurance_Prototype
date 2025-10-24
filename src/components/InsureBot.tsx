import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, RefreshCw, Minimize2, Maximize2, CheckCircle, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { insureBotService } from '../lib/insureBotService';
import { policyBrowsingService, PolicyType, Policy } from '../lib/policyBrowsingService';
import { formatINR, formatPremiumINR } from '../lib/insuranceCompanyLogos';
import { useHybridAuth } from '../hooks/useHybridAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface InsureBotProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const InsureBot: React.FC<InsureBotProps> = ({ isOpen, onClose, isMinimized = false, onToggleMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [view, setView] = useState<'chat' | 'policy-types' | 'policy-list'>('policy-types');
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>([]);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useHybridAuth();

  const suggestedQuestions = insureBotService.getSuggestedQuestions();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi there! I'm InsureBot, your personal AI insurance advisor.\n\nI can help you with:\n\n• Understanding insurance policies and coverage options\n• Exploring dashboard features and tools\n• Filing claims and tracking their status\n• Finding the best policies for your needs\n• Answering questions about premiums, benefits, and tax savings\n\nWhat would you like to know about today?`,
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPolicyTypes();
    }
  }, [isOpen]);

  const loadPolicyTypes = async () => {
    const types = await policyBrowsingService.getPolicyTypes();
    setPolicyTypes(types);
  };

  const handleSelectPolicyType = async (policyTypeId: string) => {
    setSelectedPolicyType(policyTypeId);
    setLoadingPolicies(true);
    setView('policy-list');

    const policiesData = await policyBrowsingService.getPoliciesByType(policyTypeId);
    setPolicies(policiesData);
    setLoadingPolicies(false);
  };

  const handleBackToPolicyTypes = () => {
    setView('policy-types');
    setSelectedPolicyType(null);
    setPolicies([]);
  };

  const handleSwitchToChat = () => {
    setView('chat');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await insureBotService.chat(textToSend, user?.id);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again or contact our support team.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  const handleReset = () => {
    insureBotService.resetConversation();
    setMessages([{
      role: 'assistant',
      content: `Hi there! I'm InsureBot, your personal AI insurance advisor.\n\nI can help you with:\n\n• Understanding insurance policies and coverage options\n• Exploring dashboard features and tools\n• Filing claims and tracking their status\n• Finding the best policies for your needs\n• Answering questions about premiums, benefits, and tax savings\n\nWhat would you like to know about today?`,
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col transition-all ${isMinimized ? 'w-96 h-20' : 'w-full max-w-4xl h-[80vh]'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">InsureBot</h3>
              <p className="text-xs text-blue-100">Your AI Insurance Advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isMinimized && view === 'policy-list' && (
              <button
                onClick={handleBackToPolicyTypes}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Back to policy types"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {!isMinimized && view === 'chat' && (
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
            {onToggleMinimize && (
              <button
                onClick={onToggleMinimize}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Policy Type Selection View */}
            {view === 'policy-types' && (
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Insurance Type</h2>
                    <p className="text-gray-600">Select a category to explore personalized policies with AI-powered recommendations</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {policyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSelectPolicyType(type.id)}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-left group border-2 border-transparent hover:border-blue-500"
                      >
                        <div className="text-5xl mb-3">{type.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {type.count} policies
                          </span>
                          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={handleSwitchToChat}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Or chat with InsureBot for personalized help
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Policy List View */}
            {view === 'policy-list' && (
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {loadingPolicies ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading policies...</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {policyTypes.find(t => t.id === selectedPolicyType)?.name || 'Policies'}
                      </h2>
                      <p className="text-gray-600">Found {policies.length} policies tailored for you</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {policies.map((policy) => (
                        <div
                          key={policy.id}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
                        >
                          {/* Provider Logo Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <img
                              src={policy.logo}
                              alt={policy.providerName}
                              className="h-10 object-contain"
                            />
                            {policy.isFeatured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Policy Details */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.policyName}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{policy.description}</p>

                            {/* Coverage & Premium */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Coverage</p>
                                <p className="text-lg font-bold text-blue-700">
                                  {formatINR(policy.coverageMin)} - {formatINR(policy.coverageMax)}
                                </p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Annual Premium</p>
                                <p className="text-lg font-bold text-green-700">
                                  {formatPremiumINR(policy.annualPremium)}
                                </p>
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Key Features:</p>
                              <ul className="space-y-1">
                                {policy.keyFeatures.slice(0, 3).map((feature, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* CTA */}
                            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                              Get Quote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat View */}
            {view === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                  <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 ml-1">
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">InsureBot</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-5 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-white shadow-md border border-gray-100'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <FormattedMessage content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
                      )}
                      <p className={`text-xs mt-3 pt-2 border-t ${message.role === 'user' ? 'text-blue-100 border-blue-400' : 'text-gray-400 border-gray-100'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">InsureBot</span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {showSuggestions && messages.length <= 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
                    <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Quick Questions to Get Started
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="text-left text-sm px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md border border-blue-100 group"
                        >
                          <span className="group-hover:translate-x-1 inline-block transition-transform">{question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything about insurance..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    InsureBot can make mistakes. Please verify important information.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Add animation styles
const animationStyles = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'insurebot-animations';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'bullet' | 'number' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'bullet') {
          elements.push(
            <ul key={`list-${elements.length}`} className="space-y-2 my-3 ml-4">
              {currentList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
        } else if (listType === 'number') {
          elements.push(
            <ol key={`list-${elements.length}`} className="space-y-2 my-3 ml-4">
              {currentList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Check for bullet points (*, -, •)
      const bulletMatch = trimmedLine.match(/^[*\-•]\s+(.+)/);
      if (bulletMatch) {
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        currentList.push(bulletMatch[1]);
        return;
      }

      // Check for numbered lists (1., 2., etc.)
      const numberMatch = trimmedLine.match(/^\d+\.\s+(.+)/);
      if (numberMatch) {
        if (listType !== 'number') {
          flushList();
          listType = 'number';
        }
        currentList.push(numberMatch[1]);
        return;
      }

      // Flush any pending list
      flushList();

      // Empty lines
      if (!trimmedLine) {
        elements.push(<div key={`space-${index}`} className="h-2" />);
        return;
      }

      // Check for headings (bold text followed by colon or just **text**)
      const headingMatch = trimmedLine.match(/^\*\*(.+?)\*\*:?$/);
      if (headingMatch) {
        elements.push(
          <h4 key={`heading-${index}`} className="font-bold text-gray-900 text-base mt-4 mb-2">
            {headingMatch[1]}
          </h4>
        );
        return;
      }

      // Regular text with inline formatting
      const formattedText = formatInlineText(trimmedLine);
      elements.push(
        <p key={`text-${index}`} className="text-sm text-gray-700 leading-relaxed my-2">
          {formattedText}
        </p>
      );
    });

    flushList();
    return elements;
  };

  const formatInlineText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match **bold** text
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    const processedText = text.replace(boldRegex, (_, p1) => `<BOLD>${p1}</BOLD>`);
    const segments = processedText.split(/(<BOLD>.*?<\/BOLD>)/);

    segments.forEach((segment, idx) => {
      if (segment.startsWith('<BOLD>')) {
        const boldText = segment.replace('<BOLD>', '').replace('</BOLD>', '');
        parts.push(
          <strong key={`bold-${idx}`} className="font-semibold text-gray-900">
            {boldText}
          </strong>
        );
      } else if (segment) {
        parts.push(segment);
      }
    });

    return parts.length > 0 ? parts : text;
  };

  return <div className="space-y-1">{formatContent(content)}</div>;
};

export default InsureBot;
