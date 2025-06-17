import { MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import AISelector from './components/AISelector';
import ChatHistory from './components/ChatHistory';
import ChatInterface from './components/ChatInterface';
import CustomAICard from './components/CustomAICard';
import Header from './components/Header';
import PhoneExecution from './components/PhoneExecution';
import { AIModel, ChatState, Conversation, Message } from './types';
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
  const [currentView, setCurrentView] = useState<'chat' | 'phone'>('chat');

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

  const handleAICreated = (newAI: AIModel) => {
    setAiModels(prev => [...prev, newAI]);
  };

  // Separate custom and regular AIs
  const regularAIs = aiModels.filter(ai => !ai.isCustom);
  const customAIs = aiModels.filter(ai => ai.isCustom);

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

      {/* Navigation */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
                  ${currentView === 'chat'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat com IAs</span>
              </button>
              <button
                onClick={() => setCurrentView('phone')}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
                  ${currentView === 'phone'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Phone className="w-4 h-4" />
                <span>Execução por Telefone</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-6 pb-12">
        {currentView === 'chat' ? (
          <div className="space-y-12">
            {/* Regular AIs */}
            <AISelector
              aiModels={regularAIs}
              selectedAIs={chatState.selectedAIs}
              onSelectAI={handleSelectAI}
              onStartConversation={handleStartConversation}
            />
            
            {/* Custom AI Creation Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <CustomAICard onAICreated={handleAICreated} />
              </div>
            </div>

            {/* Custom AIs Section */}
            {customAIs.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                    IAs Personalizadas
                  </h3>
                  <p className="text-gray-400">
                    Suas IAs criadas especificamente para diferentes nichos de negócio
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {customAIs.map((ai) => {
                    const isSelected = chatState.selectedAIs.includes(ai.id);
                    
                    return (
                      <div
                        key={ai.id}
                        className={`relative group transition-all duration-300 ${
                          isSelected ? 'scale-105' : 'hover:scale-102'
                        }`}
                      >
                        {/* Custom AI Card */}
                        <div className={`
                          relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/50 shadow-xl shadow-blue-500/20' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }
                        `}>
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                          )}

                          {/* Avatar */}
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 mx-auto mb-3 text-4xl flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                              {ai.avatar}
                            </div>
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs text-gray-400">Personalizada</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-white mb-2">{ai.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{ai.description}</p>
                            
                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1 justify-center mb-4">
                              {ai.specialties.map((specialty, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <button
                              onClick={() => handleSelectAI(ai.id)}
                              className={`
                                w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2
                                ${isSelected
                                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                }
                                hover:scale-105
                              `}
                            >
                              {isSelected ? (
                                <>
                                  <MessageCircle className="w-4 h-4" />
                                  <span>Selecionada</span>
                                </>
                              ) : (
                                <>
                                  <MessageCircle className="w-4 h-4" />
                                  <span>Selecionar</span>
                                </>
                              )}
                            </button>

                            {isSelected && (
                              <button
                                onClick={() => handleStartConversation(ai.id)}
                                className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg"
                              >
                                Iniciar Conversa
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <PhoneExecution aiModels={aiModels} />
        )}
      </main>

      {/* Chat Interface - only show in chat view */}
      {currentView === 'chat' && (
        <ChatInterface
          conversations={chatState.activeConversations}
          onUpdateConversation={handleUpdateConversation}
          onCloseConversation={handleCloseConversation}
          onMinimizeAll={handleMinimizeAll}
          isMinimized={isChatMinimized}
          onToggleMinimized={() => setIsChatMinimized(!isChatMinimized)}
        />
      )}

      {/* History button - only show in chat view */}
      {currentView === 'chat' && (chatState.conversationHistory.length > 0 || chatState.activeConversations.length === 0) && (
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

      {/* Chat History - only show in chat view */}
      {currentView === 'chat' && (
        <ChatHistory
          isOpen={chatState.isHistoryOpen}
          onClose={() => setChatState(prev => ({ ...prev, isHistoryOpen: false }))}
          conversationHistory={chatState.conversationHistory}
          onRestoreConversation={handleRestoreConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      )}
    </div>
  );
}

export default App;