import Link from "next/link";

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            {children}
        </a>
    )
}

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-start gap-4">
                        <Link href="/" className="text-xl font-bold font-headline">
                           IQRAH SHANU
                        </Link>
                        <p className="text-sm text-muted-foreground">Smart & Stylish Shopping</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 col-span-3 gap-8 text-sm">
                        <div>
                            <h3 className="font-semibold mb-4">Shop</h3>
                            <ul className="space-y-3">
                                <li><Link href="/products" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
                                <li><Link href="/hair-accessories" className="text-muted-foreground hover:text-foreground">Hair Accessories</Link></li>
                                <li><Link href="/dresses" className="text-muted-foreground hover:text-foreground">Dresses</Link></li>
                                <li><Link href="/kids" className="text-muted-foreground hover:text-foreground">Kids</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">About</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Our Story</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t flex justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} IQRAH SHANU. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></SocialIcon>
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-1.4 1.2-3.3 2-5.3 2.3-.4-2.5-2.2-4.4-4.7-4.4-2.8 0-5 2.2-5 5s2.2 5 5 5c2.3 0 4.2-1.5 4.8-3.5-1.5.8-3.2 1.3-5 1.3-3.6 0-6.5-2.9-6.5-6.5S9.4 4.5 13 4.5c1.4 0 2.8.5 3.8 1.5.5-1.2 1.2-2.3 2.2-3 .5-.3 1.2-.5 1.8-.5.2 0 .5.1.7.1z"></path></svg></SocialIcon>
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
}
