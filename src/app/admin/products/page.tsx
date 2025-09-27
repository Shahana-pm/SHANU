"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const fetchProducts = async () => {
      const productsCollection = collection(firestore, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
    };

    fetchProducts();
  }, [firestore]);


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold">Products</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
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
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
