
"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export default function CheckoutPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
        title: "Order Submitted!",
        description: "Your order has been recorded. Please complete the payment. We will ship your items upon payment confirmation.",
    })
  }
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="font-headline text-4xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="font-headline text-2xl font-semibold border-b pb-2">Contact Information</h2>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-headline text-2xl font-semibold border-b pb-2">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="postalCode" render={({ field }) => (<FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>

                    <Button type="submit" size="lg" className="w-full">Submit Order</Button>
                </form>
            </Form>
        </div>
        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-semibold border-b pb-2">Payment Method</h2>
            <div className="p-6 bg-secondary rounded-lg text-center space-y-4">
                <p className="text-muted-foreground">Scan the QR code with your payment app to complete the purchase.</p>
                <div className="relative aspect-square w-full max-w-xs mx-auto">
                    <Image 
                        src="https://picsum.photos/seed/qrcode/400/400"
                        alt="Payment QR Code"
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint="QR code"
                    />
                </div>
                <p className="font-bold text-lg">Account: SHANU PM</p>
                <p className="text-sm text-muted-foreground">After payment, your order will be processed and shipped.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
