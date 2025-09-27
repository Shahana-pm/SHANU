
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ImageIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "./add-product-dialog";
import { Button } from "@/components/ui/button";
import { useProductsWithFirstVariant } from "@/hooks/use-products-with-first-variant";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, "products") : null, [firestore]);
  const { productsWithImages, loading: isLoading } = useProductsWithFirstVariant(productsCollection);

  const handleDelete = async (productId: string, productName: string) => {
    if (!firestore) return;
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    const docRef = doc(firestore, "products", productId);

    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Product Deleted",
          description: `"${productName}" has been removed.`,
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: `Could not delete "${productName}". Check permissions.`,
        });
      });
  }

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
                productsWithImages?.map((product) => {
                return (
                <TableRow key={product.id}>
                    <TableCell>
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary">
                        {product.firstVariantImageUrl ? (
                            <Image
                            src={product.firstVariantImageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                        {product.isNew && <Badge variant="outline">New</Badge>}
                        {product.isTrending && <Badge variant="secondary">Trending</Badge>}
                    </div>
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id, product.name)}>
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )
            }))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
