import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A list of all orders will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
