export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'employee' | 'local_admin' | 'super_admin';
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  districtId?: number; // Для привязки к отделу
}

export interface Direction {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  categoryId?: number; // Для привязки к категории
  districtId?: number; // Для привязки к отделу
}
export interface CreateCategoryPayload {
  name: string;
  description?: string;
  isActive?: boolean;
}
export interface CreateSessionPayload {
  userId: number;
  workingHourId: number;
  districtId: number;
  categoryId?: number; // Добавляем, если требуется
  directionId?: number; // Добавляем, если требуется
  status: string;
  comments: string;
}
export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateDirectionPayload {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDirectionPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface District {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean; // Сделано необязательным, так как API не возвращает
  address?: string;
  phone?: string;
  email?: string;
}
export interface CreateDistrictPayload {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDistrictPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface EmployeeDetails {
  id: number;
  fullName: string;
  position: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface CreateEmployeeDetailsPayload {
  fullName: string;
  position: string;
  email: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateEmployeeDetailsPayload {
  fullName?: string;
  position?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationPayload {
  userId: number;
  title: string;
  message: string;
}

export interface Session {
  id: number;
  userId?: number; // Поле необязательное, если не всегда приходит
  status: 'booked' | 'completed' | 'canceled' | 'in_progress' | string;
  workingHourId?: number;
  districtId?: number;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
  specific_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  direction_name: string;
}
export interface CreateSessionPayload {
  userId: number;
  workingHourId: number;
  districtId: number;
  status: string;
  comments?: string;
}

export interface UpdateSessionPayload {
  status?: string;
  comments?: string;
}

export interface Statistics {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalRecords: number;
  date: string; // или Date, если используешь объекты
}

export interface WorkingHour {
  id: number;
  employeeId: number;
  startTime: string;
  endTime: string;
  weekday: number; // 1-7, если нужен день недели
  isActive: boolean;
}

export interface CreateWorkingHourPayload {
  employeeId: number;
  startTime: string;
  endTime: string;
  weekday: number;
  isActive?: boolean;
}

export interface UpdateWorkingHourPayload {
  startTime?: string;
  endTime?: string;
  weekday?: number;
  isActive?: boolean;
}
