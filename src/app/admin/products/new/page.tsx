
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductForm } from "./add-product-form";


export default function AddProductPage() {
    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-8">Add New Product</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddProductForm />
                </CardContent>
            </Card>
        </div>
    )
}
