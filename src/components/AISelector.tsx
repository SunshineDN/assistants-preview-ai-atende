import React from 'react';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AIModel } from '../types';

interface AISelectorProps {
  aiModels: AIModel[];
  selectedAIs: string[];
  onSelectAI: (aiId: string) => void;
  onStartConversation: (aiId: string) => void;
}

const AISelector: React.FC<AISelectorProps> = ({
  aiModels,
  selectedAIs,
  onSelectAI,
  onStartConversation,
}) => {
  const getStatusIcon = (status: AIModel['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'busy':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: AIModel['status']) => {
    switch (status) {
      case 'online':
        return 'border-green-400/30 bg-green-400/5';
      case 'busy':
        return 'border-yellow-400/30 bg-yellow-400/5';
      case 'offline':
        return 'border-red-400/30 bg-red-400/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
          Selecione suas IAs
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Escolha uma ou mais inteligências artificiais especializadas para demonstrar nossa tecnologia conversacional.
          Cada IA tem expertise em diferentes áreas do seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiModels.map((ai) => {
          const isSelected = selectedAIs.includes(ai.id);
          
          return (
            <div
              key={ai.id}
              className={`relative group transition-all duration-300 ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              {/* Neomorphic card */}
              <div className={`
                relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/50 shadow-xl shadow-blue-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
                ${getStatusColor(ai.status)}
              `}>
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Avatar */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 text-4xl flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                    {ai.avatar}
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {getStatusIcon(ai.status)}
                    <span className="text-xs text-gray-400 capitalize">{ai.status}</span>
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
                        className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => onSelectAI(ai.id)}
                    disabled={ai.status === 'offline'}
                    className={`
                      w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2
                      ${isSelected
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }
                      ${ai.status === 'offline' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    `}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Selecionada</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Selecionar</span>
                      </>
                    )}
                  </button>

                  {isSelected && (
                    <button
                      onClick={() => onStartConversation(ai.id)}
                      className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
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

      {selectedAIs.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white">
              {selectedAIs.length} IA{selectedAIs.length > 1 ? 's' : ''} selecionada{selectedAIs.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISelector;