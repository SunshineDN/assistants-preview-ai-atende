import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative z-10 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI Atende
              </h1>
              <p className="text-sm text-gray-300">Demonstração de IA Conversacional</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-300">Tecnologia & Soluções</p>
              <p className="text-xs text-gray-400">CRM + Inteligência Artificial</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;