import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Header from './components/Header';
import AISelector from './components/AISelector';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';
import { AIModel, Conversation, Message, ChatState } from './types';
import { getAIModels } from './utils/api';

function App() {
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    activeConversations: [],
    conversationHistory: [],
    selectedAIs: [],
    isHistoryOpen: false,
  });
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load AI models on mount
  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const models = await getAIModels();
        setAiModels(models);
      } catch (error) {
        console.error('Error loading AI models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAIModels();
  }, []);

  const handleSelectAI = (aiId: string) => {
    setChatState(prev => ({
      ...prev,
      selectedAIs: prev.selectedAIs.includes(aiId)
        ? prev.selectedAIs.filter(id => id !== aiId)
        : [...prev.selectedAIs, aiId],
    }));
  };

  const handleStartConversation = (aiId: string) => {
    const ai = aiModels.find(model => model.id === aiId);
    if (!ai) return;

    // Check if conversation already exists
    const existingConversation = chatState.activeConversations.find(c => c.aiId === aiId);
    if (existingConversation) {
      setIsChatMinimized(false);
      return;
    }

    const newConversation: Conversation = {
      id: `${aiId}-${Date.now()}`,
      aiId,
      aiName: ai.name,
      messages: [{
        id: Date.now().toString(),
        content: `Olá! Sou ${ai.name}, ${ai.description}. Como posso ajudá-lo hoje?`,
        sender: 'ai',
        timestamp: new Date(),
        aiId,
      }],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
    };

    setChatState(prev => ({
      ...prev,
      activeConversations: [...prev.activeConversations, newConversation],
    }));

    setIsChatMinimized(false);
  };

  const handleUpdateConversation = (conversationId: string, messages: Message[]) => {
    setChatState(prev => ({
      ...prev,
      activeConversations: prev.activeConversations.map(conversation =>
        conversation.id === conversationId
          ? { ...conversation, messages, lastActivity: new Date() }
          : conversation
      ),
    }));
  };

  const handleCloseConversation = (conversationId: string) => {
    const conversationToClose = chatState.activeConversations.find(c => c.id === conversationId);
    
    if (conversationToClose && conversationToClose.messages.length > 1) {
      // Save to history if it has user messages
      setChatState(prev => ({
        ...prev,
        activeConversations: prev.activeConversations.filter(c => c.id !== conversationId),
        conversationHistory: [...prev.conversationHistory, { ...conversationToClose, isActive: false }],
      }));
    } else {
      // Just remove if no meaningful conversation
      setChatState(prev => ({
        ...prev,
        activeConversations: prev.activeConversations.filter(c => c.id !== conversationId),
      }));
    }
  };

  const handleMinimizeAll = () => {
    // Move all active conversations to history
    setChatState(prev => ({
      ...prev,
      activeConversations: [],
      conversationHistory: [
        ...prev.conversationHistory,
        ...prev.activeConversations.map(c => ({ ...c, isActive: false }))
      ],
    }));
  };

  const handleRestoreConversation = (conversation: Conversation) => {
    setChatState(prev => ({
      ...prev,
      activeConversations: [...prev.activeConversations, { ...conversation, isActive: true }],
      conversationHistory: prev.conversationHistory.filter(c => c.id !== conversation.id),
      isHistoryOpen: false,
    }));
    setIsChatMinimized(false);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setChatState(prev => ({
      ...prev,
      conversationHistory: prev.conversationHistory.filter(c => c.id !== conversationId),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center animate-pulse">
            <MessageCircle className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-white text-lg">Carregando IAs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-6 py-12">
        <AISelector
          aiModels={aiModels}
          selectedAIs={chatState.selectedAIs}
          onSelectAI={handleSelectAI}
          onStartConversation={handleStartConversation}
        />
      </main>

      {/* Chat Interface */}
      <ChatInterface
        conversations={chatState.activeConversations}
        onUpdateConversation={handleUpdateConversation}
        onCloseConversation={handleCloseConversation}
        onMinimizeAll={handleMinimizeAll}
        isMinimized={isChatMinimized}
        onToggleMinimized={() => setIsChatMinimized(!isChatMinimized)}
      />

      {/* History button */}
      {(chatState.conversationHistory.length > 0 || chatState.activeConversations.length === 0) && (
        <button
          onClick={() => setChatState(prev => ({ ...prev, isHistoryOpen: true }))}
          className="fixed bottom-6 left-6 p-4 bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 text-white group z-40"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {chatState.conversationHistory.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {chatState.conversationHistory.length}
            </div>
          )}
        </button>
      )}

      {/* Chat History */}
      <ChatHistory
        isOpen={chatState.isHistoryOpen}
        onClose={() => setChatState(prev => ({ ...prev, isHistoryOpen: false }))}
        conversationHistory={chatState.conversationHistory}
        onRestoreConversation={handleRestoreConversation}
        onDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
}

export default App;