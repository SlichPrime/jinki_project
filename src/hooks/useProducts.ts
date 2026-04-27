import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return products;
}