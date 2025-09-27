
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "./add-product-dialog";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { useProductsWithFirstVariant } from "@/hooks/use-products-with-first-variant";
import { ProductRow } from "./product-row";

export default function AdminProductsPage() {
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, "products") : null, [firestore]);
  const { productsWithImages: products, loading: isLoading } = useProductsWithFirstVariant(productsCollection);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold">Products</h1>
        <AddProductDialog />
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                products?.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
