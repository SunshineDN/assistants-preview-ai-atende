import React, { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { createCustomAI } from '../utils/api';
import { AIModel } from '../types';

interface CustomAICardProps {
  onAICreated: (ai: AIModel) => void;
}

const CustomAICard: React.FC<CustomAICardProps> = ({ onAICreated }) => {
  const [niche, setNiche] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAI = async () => {
    if (!niche.trim()) return;

    setIsCreating(true);
    try {
      const customAI = await createCustomAI(niche.trim());
      onAICreated(customAI);
      setNiche('');
    } catch (error) {
      console.error('Error creating custom AI:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateAI();
    }
  };

  return (
    <div className="relative group transition-all duration-300 hover:scale-102">
      <div className="relative p-6 rounded-2xl backdrop-blur-xl border border-dashed border-blue-400/50 bg-gradient-to-br from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-300">
        {/* Animated background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
              {isCreating ? (
                <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
              ) : (
                <Sparkles className="w-8 h-8 text-blue-300" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">IA Personalizada</h3>
            <p className="text-sm text-gray-400">
              Crie uma IA especializada para seu nicho específico
            </p>
          </div>

          {/* Input */}
          <div className="mb-4">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Imobiliário, Odontologia, E-commerce..."
              disabled={isCreating}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Create button */}
          <button
            onClick={handleCreateAI}
            disabled={!niche.trim() || isCreating}
            className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Criando IA...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Criar IA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAICard;