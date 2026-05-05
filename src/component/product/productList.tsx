import ProductCard from "./productCard";

export default function ProductList({ products }: any) {
  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-6
    ">
      {products.map((p: any) => (
        <ProductCard
          key={p._id}
          product={p}
        />
      ))}
    </div>
  );
}