import React, { useState } from 'react';
import { 
  MessageSquare, Send, Search, Phone, Video, MoreVertical,
  Paperclip, Smile, CheckCircle2, User, Bot, Bell,
  Star, Plus, Users
} from 'lucide-react';

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      type: 'agent',
      name: 'Sarah Mitchell',
      title: 'Senior Claims Specialist',
      lastMessage: 'I\'ve reviewed your claim and everything looks good. We should have your reimbursement processed by Friday.',
      time: '2 min ago',
      unread: 2,
      online: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      type: 'ai',
      name: 'InsureBot Assistant',
      title: 'AI Insurance Helper',
      lastMessage: 'Based on your recent assessment, I recommend reviewing your life insurance coverage. Would you like me to calculate...',
      time: '1 hour ago',
      unread: 0,
      online: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      type: 'agent',
      name: 'Michael Chen',
      title: 'Policy Advisor',
      lastMessage: 'Thanks for uploading the documents. I\'ll review them and get back to you within 24 hours.',
      time: '3 hours ago',
      unread: 0,
      online: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      type: 'system',
      name: 'Policy Notifications',
      title: 'System Updates',
      lastMessage: 'Your auto insurance policy will renew automatically on October 15th. No action required.',
      time: '1 day ago',
      unread: 1,
      online: false,
      avatar: '/api/placeholder/40/40'
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: 'agent',
      senderName: 'Sarah Mitchell',
      content: 'Hi there! I\'ve received your claim for the emergency room visit. I\'m reviewing the documentation you submitted.',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'user',
      senderName: 'You',
      content: 'Thank you! I included all the medical reports and receipts. Is there anything else you need from me?',
      timestamp: '10:35 AM',
      status: 'read'
    },
    {
      id: 3,
      sender: 'agent',
      senderName: 'Sarah Mitchell',
      content: 'The documentation looks complete. I just need to verify a few details with the medical provider. This is standard procedure.',
      timestamp: '10:45 AM',
      status: 'read'
    },
    {
      id: 4,
      sender: 'user',
      senderName: 'You',
      content: 'Sounds good. How long does the verification process usually take?',
      timestamp: '10:50 AM',
      status: 'read'
    },
    {
      id: 5,
      sender: 'agent',
      senderName: 'Sarah Mitchell',
      content: 'Typically 3-5 business days. I\'ll keep you updated throughout the process. Is there a preferred way you\'d like me to contact you?',
      timestamp: '11:00 AM',
      status: 'read'
    },
    {
      id: 6,
      sender: 'user',
      senderName: 'You',
      content: 'Messages through this platform work great for me. Thanks for the quick response!',
      timestamp: '11:05 AM',
      status: 'read'
    },
    {
      id: 7,
      sender: 'agent',
      senderName: 'Sarah Mitchell',
      content: 'Perfect! I\'ve reviewed your claim and everything looks good. We should have your reimbursement processed by Friday.',
      timestamp: '2:28 PM',
      status: 'delivered'
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      setMessageText('');
    }
  };

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'ai': return Bot;
      case 'system': return Bell;
      default: return User;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg h-[800px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                All
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                Agents
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                AI Assistant
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                Unread
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => {
              const ConversationIcon = getConversationIcon(conversation.type);
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <ConversationIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conversation.title}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      
                      {conversation.unread > 0 && (
                        <div className="flex justify-end mt-1">
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {conversation.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {React.createElement(getConversationIcon(selectedConv.type), { className: "w-5 h-5 text-gray-600" })}
                      </div>
                      {selectedConv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedConv.name}</h2>
                      <p className="text-sm text-gray-600">{selectedConv.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Star className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`flex items-center mt-1 space-x-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {message.sender === 'user' && (
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
            <Bot className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-800">Ask AI Assistant</p>
              <p className="text-sm text-blue-700">Get instant answers to policy questions</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-800">Contact Agent</p>
              <p className="text-sm text-blue-700">Speak with a human representative</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
            <Phone className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-800">Emergency Support</p>
              <p className="text-sm text-blue-700">24/7 claims and roadside assistance</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
