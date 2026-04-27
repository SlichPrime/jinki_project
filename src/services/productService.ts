import { apiRequest } from "./api";

export const getProducts = () => apiRequest("/products");

export const createProduct = (data: any) =>
  apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });