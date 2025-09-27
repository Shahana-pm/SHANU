

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, Users, Database } from "lucide-react";
import { seedDatabase } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast";


export default function AdminDashboardPage() {
  const { toast } = useToast();

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed the database? This will overwrite existing product data.")) {
        return;
    }

    try {
      await seedDatabase();
      toast({
        title: "Database Seeded!",
        description: "Your Firestore database has been populated with product data.",
      });
    } catch (error: any) {
      console.error("Error seeding database:", error);
      
      let description = "Could not seed the database. Check the console.";
      if (error.message.includes("Database is not empty")) {
        description = "Database already contains data. Seeding was skipped to prevent overwriting your products."
      }

      toast({
        variant: "destructive",
        title: "Seeding Skipped or Failed",
        description: description,
      });
    }
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+150</div>
            <p className="text-xs text-muted-foreground">+30.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">Total products available</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Database Tools</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Click the button below to populate your Firestore database with the initial set of products. You only need to do this once.</p>
                <Button onClick={handleSeed}>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Database
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
