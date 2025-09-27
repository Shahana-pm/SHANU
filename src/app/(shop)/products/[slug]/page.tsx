import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
