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
  user_id: number;
  working_hour_id: number;
  district_id: number;
  direction_id: number;
  status: 'booked' | 'canceled' | 'completed';
  comments?: string;
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
  user_id: number;
  district_id: number;
  direction_id: number;
  working_hour_id: number;
  status: 'booked' | 'canceled' | 'completed';
  comments?: string;
  created_at: string;
  updated_at: string;
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
  employee_id: number;
  day_of_week?: string;
  specific_date?: string;
  start_time: string;
  end_time: string;
  status?: string; // Добавляем поле status (например, 'available' или 'booked')
}
export interface WorkingHourSlot {
  workingHourId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateWorkingHourPayload {
  employee_id?: number;
  day_of_week?: string;
  specific_date?: string;
  start_time: string;
  end_time: string;
}

export interface UpdateWorkingHourPayload {
  day_of_week?: string;
  specific_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface WizardForm {
  districtId: number | null;
  categoryId: number | null;
  directionId: number | null;
  employeeId: number | null;
  date: string | null;
  time: string | null;
  workingHourId: number | null;
  comments?: string;
}
