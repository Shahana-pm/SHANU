
"use client";

import Link from "next/link";
import Image from "next/image";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ImageIcon } from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Product } from "@/lib/types";

interface ProductRowProps {
  product: Product & { firstVariantImageUrl?: string };
}

export function ProductRow({ product }: ProductRowProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore) return;
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    const docRef = doc(firestore, "products", product.id);

    // Note: This doesn't delete subcollections. A more robust solution
    // would use a Cloud Function to handle cascading deletes.
    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Product Deleted",
          description: `"${product.name}" has been removed.`,
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
          description: `Could not delete "${product.name}". Check permissions.`,
        });
      });
  };

  return (
    <TableRow>
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
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
