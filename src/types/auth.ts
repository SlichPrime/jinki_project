export interface AuthUser {
  id: string;
  role: "user" | "admin";
  isSeller: boolean;
}