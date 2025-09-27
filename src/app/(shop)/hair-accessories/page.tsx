import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";

export default function HairAccessoriesPage() {
  // TODO: Filter products by category once data is available
  const accessoryProducts = products.slice(0, 4);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hair Accessories</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Complete your look with our stylish hair accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accessoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
