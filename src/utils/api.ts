import axios from 'axios';
import { Message } from '../types';

// Mock API configuration - replace with your actual API endpoints
const API_BASE_URL = 'https://your-api-endpoint.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API functions - replace with actual API calls
export const sendMessageToAI = async (aiId: string, message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock responses based on AI type
  const responses: Record<string, string[]> = {
    'gpt-4': [
      'Como especialista em análise de dados, posso ajudá-lo com insights detalhados sobre seu CRM.',
      'Vou analisar os padrões de comportamento dos seus leads para otimizar a conversão.',
      'Com base nos dados, sugiro implementar automações específicas no seu funil de vendas.',
    ],
    'claude-3': [
      'Entendo sua necessidade. Vou criar uma estratégia personalizada para seu negócio.',
      'Posso ajudar a identificar gargalos no seu processo comercial usando IA.',
      'Vamos trabalhar juntos para melhorar seus indicadores de performance.',
    ],
    'gemini-pro': [
      'Analisando seu perfil, posso sugerir melhorias específicas no seu dashboard.',
      'Vou ajudar a estruturar campanhas de tráfego pago mais eficientes.',
      'Posso criar automações inteligentes para sua secretária virtual.',
    ],
    'assistant-pro': [
      'Como sua assistente especializada, vou organizar todas as informações do seu CRM.',
      'Posso gerar relatórios personalizados e alertas automáticos para sua equipe.',
      'Vou configurar workflows inteligentes para otimizar seu atendimento.',
    ],
  };

  const aiResponses = responses[aiId] || responses['gpt-4'];
  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  
  return randomResponse;
};

export const createCustomAI = async (niche: string): Promise<any> => {
  // This would be your actual API call
  try {
    const response = await api.post('/custom-ai', { niche });
    return response.data;
  } catch (error) {
    // Mock response for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: `custom-${Date.now()}`,
      name: `IA ${niche}`,
      description: `Especialista em ${niche} com conhecimento avançado do setor`,
      status: 'online',
      avatar: '🎯',
      specialties: [niche, 'Consultoria', 'Estratégia'],
      isCustom: true,
    };
  }
};

export const executeAIWithPhone = async (aiId: string, phoneNumber: string): Promise<any> => {
  // This would be your actual API call
  try {
    const response = await api.post('/execute-ai-phone', { aiId, phoneNumber });
    return response.data;
  } catch (error) {
    // Mock response for demonstration
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      success: true,
      message: 'IA executada com sucesso para o número fornecido',
      executionId: `exec-${Date.now()}`,
    };
  }
};

export const getAIModels = async () => {
  // Mock data - replace with actual API call
  return [
    {
      id: 'gpt-4',
      name: 'GPT-4 Analyst',
      description: 'Especialista em análise de dados e CRM',
      status: 'online' as const,
      avatar: '🧠',
      specialties: ['Análise de Dados', 'CRM', 'Automação'],
    },
    {
      id: 'claude-3',
      name: 'Claude Strategic',
      description: 'Consultor estratégico para negócios',
      status: 'online' as const,
      avatar: '🎯',
      specialties: ['Estratégia', 'Vendas', 'Processos'],
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Marketing',
      description: 'Especialista em tráfego pago e dashboards',
      status: 'online' as const,
      avatar: '📊',
      specialties: ['Tráfego Pago', 'Dashboards', 'Analytics'],
    },
    {
      id: 'assistant-pro',
      name: 'Assistant Pro',
      description: 'Secretária virtual inteligente',
      status: 'online' as const,
      avatar: '🤖',
      specialties: ['Atendimento', 'Organização', 'Relatórios'],
    },
  ];
};