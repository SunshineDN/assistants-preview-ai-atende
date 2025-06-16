import React from 'react';
import { History, X, MessageCircle, Calendar, Trash2 } from 'lucide-react';
import { Conversation } from '../types';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  conversationHistory: Conversation[];
  onRestoreConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  isOpen,
  onClose,
  conversationHistory,
  onRestoreConversation,
  onDeleteConversation,
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getLastMessage = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return 'Conversa sem mensagens';
    
    const preview = lastMessage.content.substring(0, 100);
    return preview.length < lastMessage.content.length ? `${preview}...` : preview;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Floating history panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] z-50">
        <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Histórico de Conversas</h2>
                <p className="text-sm text-gray-300">
                  {conversationHistory.length} conversa{conversationHistory.length !== 1 ? 's' : ''} salva{conversationHistory.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {conversationHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">Nenhuma conversa no histórico</p>
                <p className="text-gray-500 text-sm mt-2">
                  Suas conversas anteriores aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationHistory.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-xl">
                          🤖
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{conversation.aiName}</h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(conversation.lastActivity)}</span>
                            <span>•</span>
                            <span>{conversation.messages.length} mensagem{conversation.messages.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onRestoreConversation(conversation)}
                          className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                        >
                          Restaurar
                        </button>
                        <button
                          onClick={() => onDeleteConversation(conversation.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {getLastMessage(conversation)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;