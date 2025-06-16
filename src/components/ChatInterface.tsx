import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Conversation, Message } from '../types';
import { sendMessageToAI } from '../utils/api';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
  conversations: Conversation[];
  onUpdateConversation: (conversationId: string, messages: Message[]) => void;
  onCloseConversation: (conversationId: string) => void;
  onMinimizeAll: () => void;
  isMinimized: boolean;
  onToggleMinimized: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversations,
  onUpdateConversation,
  onCloseConversation,
  onMinimizeAll,
  isMinimized,
  onToggleMinimized,
}) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set active tab to first conversation when conversations change
  useEffect(() => {
    if (conversations.length > 0 && !activeTab) {
      setActiveTab(conversations[0].id);
    } else if (conversations.length === 0) {
      setActiveTab('');
    } else if (!conversations.find(c => c.id === activeTab)) {
      setActiveTab(conversations[0]?.id || '');
    }
  }, [conversations, activeTab]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeTab]);

  const handleSendMessage = async (conversationId: string) => {
    const inputValue = inputValues[conversationId]?.trim();
    if (!inputValue) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      aiId: conversation.aiId,
    };

    // Update conversation with user message
    const updatedMessages = [...conversation.messages, userMessage];
    onUpdateConversation(conversationId, updatedMessages);

    // Clear input
    setInputValues(prev => ({ ...prev, [conversationId]: '' }));

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [conversationId]: true }));

    try {
      // Send to AI
      const aiResponse = await sendMessageToAI(conversation.aiId, inputValue);

      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        aiId: conversation.aiId,
      };

      // Update conversation with AI response
      onUpdateConversation(conversationId, [...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'ai',
        timestamp: new Date(),
        aiId: conversation.aiId,
      };

      onUpdateConversation(conversationId, [...updatedMessages, errorMessage]);
    } finally {
      setLoadingStates(prev => ({ ...prev, [conversationId]: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(conversationId);
    }
  };

  if (conversations.length === 0) return null;

  return (
    <div className={`
      fixed bottom-6 right-6 transition-all duration-300 ease-in-out z-50
      ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}
    `}>
      {/* Glassmorphic container */}
      <div className="h-full bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">
              {isMinimized ? `${conversations.length} conversa${conversations.length > 1 ? 's' : ''}` : 'Conversas Ativas'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleMinimized}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onMinimizeAll}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            {conversations.length > 1 && (
              <div className="flex border-b border-white/10 bg-black/20">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveTab(conversation.id)}
                    className={`
                      flex-1 px-3 py-2 text-sm font-medium transition-colors relative
                      ${activeTab === conversation.id
                        ? 'text-white bg-gradient-to-r from-blue-600/30 to-purple-600/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="truncate">{conversation.aiName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseConversation(conversation.id);
                      }}
                      className="ml-2 p-0.5 rounded hover:bg-white/20 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {activeTab === conversation.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Chat area */}
            {activeTab && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
                  {conversations
                    .find(c => c.id === activeTab)
                    ?.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        aiName={conversations.find(c => c.id === activeTab)?.aiName}
                      />
                    ))}
                  
                  {loadingStates[activeTab] && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">IA está digitando...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputValues[activeTab] || ''}
                        onChange={(e) => setInputValues(prev => ({ ...prev, [activeTab]: e.target.value }))}
                        onKeyPress={(e) => handleKeyPress(e, activeTab)}
                        placeholder="Digite sua mensagem..."
                        rows={1}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 resize-none"
                        style={{ minHeight: '40px', maxHeight: '100px' }}
                      />
                    </div>
                    <button
                      onClick={() => handleSendMessage(activeTab)}
                      disabled={!inputValues[activeTab]?.trim() || loadingStates[activeTab]}
                      className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;