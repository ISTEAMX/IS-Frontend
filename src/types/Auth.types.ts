export interface User {
  id: number;
  professorId: number;
  firstName: string;
  lastName: string;
  role: string;
  passwordChanged: boolean;
}

export interface AuthResponse {
  token: string;
  userData: User;
}

export interface AuthState {
  userData: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export type UserRole = "ADMIN" | "PROFESSOR";

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  professor: {
    department: string;
  };
}
