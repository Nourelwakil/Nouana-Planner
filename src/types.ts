export type Priority = 'low' | 'medium' | 'high';
export type Status = 'not-started' | 'in-progress' | 'done';

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  color: string;
  completed: boolean;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  scheduledDate?: string; // ISO date string
  priority: Priority;
  status: Status;
  estimatedHours: number;
  completed: boolean;
  urgent: boolean;
  important: boolean;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  color: string;
  theme?: 'light' | 'dark';
}

export interface AppState {
  courses: Course[];
  tasks: Task[];
  pomodoroSettings?: PomodoroSettings;
}
