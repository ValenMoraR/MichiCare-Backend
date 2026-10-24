
export type UserRole = "admin" | "user";

export interface User {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
