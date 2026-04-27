import { apiRequest } from "./api";

export const createOrder = (data: any) =>
  apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });