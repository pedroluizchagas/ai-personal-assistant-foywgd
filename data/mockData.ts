
import { Task, Goal, Expense, Note, Appointment, WorkoutRoutine } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar relatório mensal',
    description: 'Analisar métricas de vendas do último mês',
    completed: false,
    dueDate: new Date(2024, 11, 25),
    priority: 'high',
    category: 'Trabalho',
    createdAt: new Date(2024, 11, 20),
  },
  {
    id: '2',
    title: 'Comprar ingredientes para jantar',
    completed: false,
    dueDate: new Date(2024, 11, 24),
    priority: 'medium',
    category: 'Pessoal',
    createdAt: new Date(2024, 11, 23),
  },
  {
    id: '3',
    title: 'Agendar consulta médica',
    completed: true,
    priority: 'medium',
    category: 'Saúde',
    createdAt: new Date(2024, 11, 22),
  },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Economizar para viagem',
    description: 'Juntar dinheiro para viagem de férias',
    targetValue: 5000,
    currentValue: 2800,
    unit: 'R$',
    deadline: new Date(2025, 5, 1),
    category: 'Financeiro',
    completed: false,
    createdAt: new Date(2024, 10, 1),
  },
  {
    id: '2',
    title: 'Ler 12 livros',
    description: 'Meta de leitura anual',
    targetValue: 12,
    currentValue: 8,
    unit: 'livros',
    deadline: new Date(2024, 11, 31),
    category: 'Educação',
    completed: false,
    createdAt: new Date(2024, 0, 1),
  },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 50.00,
    description: 'Almoço no restaurante',
    category: 'Alimentação',
    date: new Date(2024, 11, 23),
    type: 'expense',
  },
  {
    id: '2',
    amount: 3500.00,
    description: 'Salário',
    category: 'Trabalho',
    date: new Date(2024, 11, 1),
    type: 'income',
  },
  {
    id: '3',
    amount: 120.00,
    description: 'Conta de luz',
    category: 'Utilidades',
    date: new Date(2024, 11, 15),
    type: 'expense',
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Ideia: App de Delivery Sustentável',
    content: `# App de Delivery Sustentável

## Conceito Principal
Um aplicativo de delivery que prioriza restaurantes locais e práticas sustentáveis.

## Funcionalidades Principais
- Filtro por distância (prioriza estabelecimentos próximos)
- Sistema de pontuação de sustentabilidade
- Embalagens eco-friendly
- Programa de fidelidade verde

## Insights de Mercado
- Crescimento de 40% na demanda por produtos sustentáveis
- Consumidores dispostos a pagar 15% a mais por opções eco-friendly
- Oportunidade de parcerias com produtores locais

## Próximos Passos
1. Pesquisa de mercado detalhada
2. Desenvolvimento do MVP
3. Busca por investidores alinhados com ESG`,
    category: 'Negócios',
    tags: ['startup', 'sustentabilidade', 'delivery'],
    createdAt: new Date(2024, 11, 20),
    updatedAt: new Date(2024, 11, 23),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Reunião com cliente',
    description: 'Apresentação da proposta comercial',
    date: new Date(2024, 11, 25, 14, 30),
    duration: 60,
    location: 'Escritório Central',
    reminder: true,
  },
  {
    id: '2',
    title: 'Treino na academia',
    description: 'Treino de força - membros superiores',
    date: new Date(2024, 11, 24, 9, 0),
    duration: 90,
    location: 'Smart Fit',
    reminder: true,
  },
  {
    id: '3',
    title: 'Consulta médica',
    description: 'Check-up anual com cardiologista',
    date: new Date(2024, 11, 26, 15, 0),
    duration: 45,
    location: 'Hospital São Lucas',
    reminder: true,
  },
  {
    id: '4',
    title: 'Almoço de negócios',
    description: 'Reunião com investidores potenciais',
    date: new Date(2024, 11, 27, 12, 30),
    duration: 120,
    location: 'Restaurante Fasano',
    reminder: false,
  },
  {
    id: '5',
    title: 'Apresentação do projeto',
    description: 'Demo do MVP para stakeholders',
    date: new Date(2024, 11, 28, 10, 0),
    duration: 90,
    location: 'Sala de Conferências A',
    reminder: true,
  },
  {
    id: '6',
    title: 'Dentista',
    description: 'Limpeza e avaliação',
    date: new Date(2024, 11, 30, 16, 30),
    duration: 60,
    location: 'Clínica Odontológica',
    reminder: true,
  },
  {
    id: '7',
    title: 'Reunião de equipe',
    description: 'Sprint planning e retrospectiva',
    date: new Date(2025, 0, 2, 9, 30),
    duration: 120,
    location: 'Escritório - Sala de Reuniões',
    reminder: true,
  },
  {
    id: '8',
    title: 'Workshop de UX',
    description: 'Curso sobre design thinking',
    date: new Date(2025, 0, 5, 14, 0),
    duration: 240,
    location: 'Centro de Convenções',
    reminder: true,
  },
];

export const mockWorkoutRoutine: WorkoutRoutine = {
  id: '1',
  name: 'Treino Matinal',
  time: '09:00',
  days: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  exercises: ['Aquecimento', 'Musculação', 'Cardio'],
  duration: 90,
};
