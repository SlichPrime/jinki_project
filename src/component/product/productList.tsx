import ProductCard from "./productCard";

export default function ProductList({ products }: any) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((p: any) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}