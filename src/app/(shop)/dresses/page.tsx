import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";

export default function DressesPage() {
  // TODO: Filter products by category once data is available
  const dressProducts = products.slice(0, 4);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Dresses</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover our beautiful collection of dresses for every occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dressProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
