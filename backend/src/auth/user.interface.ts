export interface User {
  id: string;
  email: string;
  name: string; // This will be firstName + ' ' + lastName
  role: 'client' | 'performer' | 'admin';
  phone: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'performer' | 'admin';
  createdAt: string;
  updatedAt: string;
}
