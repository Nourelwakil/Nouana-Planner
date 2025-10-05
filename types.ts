export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum Status {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Done = 'done',
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  isCompleted: boolean;
}

export interface Assignment {
  id:string;
  title: string;
  courseId: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  estimatedHours: number;
}

export interface StudySession {
  id: string;
  assignmentId: string | null;
  startedAt: Date;
  minutes: number;
}