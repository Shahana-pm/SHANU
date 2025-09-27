'use server'; // This is now a Server Component
import { notFound } from "next/navigation";
import { getFirestore } from "firebase-admin/firestore";
import { Product } from "@/lib/types";
import EditProductForm from "./edit-product-form";
import { adminApp } from "@/firebase/admin";

// Helper function to get data from Firestore on the server
async function getProduct(id: string): Promise<Product | null> {
  const db = getFirestore(adminApp);
  const productDoc = await db.collection("products").doc(id).get();

  if (!productDoc.exists) {
    return null;
  }
  
  // We manually add the id to the data object
  return { id: productDoc.id, ...productDoc.data() } as Product;
}

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <EditProductForm product={product} />
    </div>
  );
}
