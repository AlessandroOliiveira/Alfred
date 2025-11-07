import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useFiverrStore } from '@/store/useFiverrStore';

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getContextData() {
    const user = useUserStore.getState().user;
    const routine = useRoutineStore.getState().routine;
    const financialSummary = useFinanceStore.getState().getSummary();
    const studyProgress = useStudyStore.getState().getProgress();
    const pendingTasks = useFiverrStore.getState().getPendingTasks();

    return {
      user: user?.name,
      routine: routine.length,
      completedTasks: routine.filter((r) => r.completed).length,
      financial: {
        balance: financialSummary.balance,
        totalIncome: financialSummary.totalIncome,
        totalExpenses: financialSummary.totalExpenses,
      },
      study: {
        englishHours: studyProgress.totalEnglishHours.toFixed(1),
        mpHours: studyProgress.totalMPHours.toFixed(1),
        weeklyProgress: studyProgress.currentWeekProgress.toFixed(1),
        weeklyGoal: studyProgress.weeklyGoal,
      },
      fiverr: {
        pendingTasks: pendingTasks.length,
      },
    };
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      const context = this.getContextData();

      const systemPrompt = `Você é minha secretária virtual especializada em organização pessoal e produtividade.

Contexto atual do usuário:
- Nome: ${context.user}
- Rotina: ${context.completedTasks}/${context.routine} atividades concluídas hoje
- Financeiro: Saldo atual R$ ${context.financial.balance.toFixed(2)}
- Estudos: ${context.study.englishHours}h inglês, ${context.study.mpHours}h concurso MP
- Progresso semanal: ${context.study.weeklyProgress}h/${context.study.weeklyGoal}h
- Fiverr: ${context.fiverr.pendingTasks} tarefas pendentes

Suas responsabilidades:
1. Fornecer recomendações personalizadas baseadas nos dados do usuário
2. Ajudar na organização da rotina e priorização de tarefas
3. Dar insights sobre gastos e sugestões financeiras
4. Motivar e acompanhar o progresso dos estudos
5. Alertar sobre prazos e compromissos importantes

Seja concisa, objetiva e sempre útil. Use português brasileiro.`;

      const messages: PerplexityMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ];

      const response = await axios.post<PerplexityResponse>(
        this.baseUrl,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao chamar Perplexity API:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Erro na API: ${error.response?.data?.message || error.message}`
        );
      }
      throw new Error('Erro desconhecido ao chamar a API');
    }
  }

  async generateWeeklyReport(): Promise<string> {
    const message =
      'Gere um relatório semanal completo do meu progresso, incluindo estudos, finanças, rotina e tarefas do Fiverr. Destaque pontos positivos e áreas que preciso melhorar.';
    return this.sendMessage(message);
  }

  async generateMonthlyReport(): Promise<string> {
    const message =
      'Gere um relatório mensal completo com análise profunda do meu desempenho em todas as áreas. Inclua metas alcançadas, gastos totais e recomendações para o próximo mês.';
    return this.sendMessage(message);
  }

  async getFinancialAdvice(): Promise<string> {
    const message =
      'Com base nos meus gastos atuais, me dê conselhos financeiros práticos para economizar e alcançar minhas metas.';
    return this.sendMessage(message);
  }

  async getStudyRecommendations(): Promise<string> {
    const message =
      'Analise meu progresso de estudos e me dê recomendações específicas para melhorar meu desempenho e atingir minhas metas.';
    return this.sendMessage(message);
  }
}

// Singleton instance
let perplexityService: PerplexityService | null = null;

export function getPerplexityService(): PerplexityService {
  if (!perplexityService) {
    const apiKey = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('Perplexity API key not configured');
    }
    perplexityService = new PerplexityService(apiKey);
  }
  return perplexityService;
}
