
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  category: string;
  completed: boolean;
  createdAt: Date;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  reminder?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  actionType?: 'task' | 'expense' | 'goal' | 'note' | 'appointment';
  actionData?: any;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  time: string; // "09:00"
  days: number[]; // 0-6, where 0 is Sunday
  exercises?: string[];
  duration?: number;
}
