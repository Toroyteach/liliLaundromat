export type UserRole = "admin" | "manager" | "staff" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  gender?: "male" | "female";
}

