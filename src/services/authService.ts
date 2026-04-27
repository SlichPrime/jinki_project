import { apiRequest } from "./api";

export const login = (data: any) =>
  apiRequest("/auth", {
    method: "POST",
    body: JSON.stringify(data),
  });