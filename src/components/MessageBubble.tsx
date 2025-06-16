import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  aiName?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, aiName }) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-gray-600 to-gray-800'
        }
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* AI name for AI messages */}
        {!isUser && aiName && (
          <div className="text-xs text-gray-400 mb-1 ml-1">{aiName}</div>
        )}
        
        {/* Message bubble */}
        <div className={`
          px-4 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-200 hover:scale-[1.01]
          ${isUser
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/30 text-white ml-auto'
            : 'bg-white/5 border-white/10 text-gray-100'
          }
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;