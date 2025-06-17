import React, { useState, useEffect } from 'react';
import { Phone, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AIModel, PhoneExecution as PhoneExecutionType } from '../types';
import { executeAIWithPhone } from '../utils/api';

interface PhoneExecutionProps {
  aiModels: AIModel[];
}

const PhoneExecution: React.FC<PhoneExecutionProps> = ({ aiModels }) => {
  const [selectedAI, setSelectedAI] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState<PhoneExecutionType | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTime]);

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhoneNumber(formatted);
    }
  };

  const handleExecute = async () => {
    if (!selectedAI || !phoneNumber || cooldownTime > 0) return;

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) return;

    setIsExecuting(true);
    
    try {
      const result = await executeAIWithPhone(selectedAI, cleanPhone);
      
      const execution: PhoneExecutionType = {
        aiId: selectedAI,
        phoneNumber: cleanPhone,
        timestamp: new Date(),
        status: result.success ? 'completed' : 'failed',
      };
      
      setLastExecution(execution);
      setCooldownTime(300); // 5 minutes cooldown
      setPhoneNumber('');
      setSelectedAI('');
      
    } catch (error) {
      console.error('Error executing AI:', error);
      const execution: PhoneExecutionType = {
        aiId: selectedAI,
        phoneNumber: cleanPhone,
        timestamp: new Date(),
        status: 'failed',
      };
      setLastExecution(execution);
    } finally {
      setIsExecuting(false);
    }
  };

  const formatCooldownTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const canExecute = selectedAI && phoneNumber.replace(/\D/g, '').length >= 10 && cooldownTime === 0 && !isExecuting;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
          Execução por Telefone
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Execute uma IA específica fornecendo um número de telefone. Apenas uma execução é permitida por vez.
        </p>
      </div>

      {/* Cooldown warning */}
      {cooldownTime > 0 && (
        <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-200 font-medium">Sistema em cooldown</p>
              <p className="text-yellow-300 text-sm">
                Próxima execução em: {formatCooldownTime(cooldownTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Execution form */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {/* AI Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecione a IA
            </label>
            <div className="space-y-2">
              {aiModels.map((ai) => (
                <button
                  key={ai.id}
                  onClick={() => setSelectedAI(ai.id)}
                  disabled={cooldownTime > 0 || isExecuting}
                  className={`
                    w-full p-3 rounded-xl border transition-all duration-200 text-left
                    ${selectedAI === ai.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }
                    ${(cooldownTime > 0 || isExecuting) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{ai.avatar}</span>
                    <div>
                      <p className="font-medium">{ai.name}</p>
                      <p className="text-xs opacity-75">{ai.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                disabled={cooldownTime > 0 || isExecuting}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Execute button */}
          <button
            onClick={handleExecute}
            disabled={!canExecute}
            className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executando...</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Executar IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Last execution status */}
      {lastExecution && (
        <div className="max-w-md mx-auto">
          <div className={`
            p-4 rounded-xl backdrop-blur-sm border
            ${lastExecution.status === 'completed'
              ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30'
              : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30'
            }
          `}>
            <div className="flex items-center space-x-3">
              {lastExecution.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className={`font-medium ${
                  lastExecution.status === 'completed' ? 'text-green-200' : 'text-red-200'
                }`}>
                  {lastExecution.status === 'completed' ? 'Execução realizada com sucesso' : 'Falha na execução'}
                </p>
                <p className="text-sm text-gray-300">
                  {lastExecution.timestamp.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneExecution;