import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Customers</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A list of all customers will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
