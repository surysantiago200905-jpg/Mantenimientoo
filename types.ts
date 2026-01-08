
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  data: string; // Base64
  uploadDate: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  customsLocation: string;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  assignedTo: string;
  attachments: Attachment[];
  cost?: number;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Technician';
  avatar: string;
}

export interface CustomsLocation {
  id: string;
  name: string;
  city: string;
  code: string;
}
