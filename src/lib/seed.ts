// This is a script to seed your Firestore database with initial product data.
// To run this script, you would typically use a command like `ts-node src/lib/seed.ts`
// in a real project setup. For this environment, we will trigger it manually.

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase/config';

const originalProducts = [
    {
      id: 'aero-chair',
      name: 'AeroFlex Chair',
      category: 'Chairs',
      price: 350,
      description: 'The AeroFlex Chair combines ergonomic design with a sleek, modern aesthetic. Its breathable mesh back and adjustable features provide unparalleled comfort for long hours of work or relaxation.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'aero-black', color: 'Midnight Black', colorHex: '#111827', imageIds: ['img_chair_1'] },
        { id: 'aero-white', color: 'Cloud White', colorHex: '#f9fafb', imageIds: ['img_chair_2'] },
        { id: 'aero-grey', color: 'Slate Grey', colorHex: '#4b5563', imageIds: ['img_chair_3'] },
      ],
      reviews: [
        { id: 'rev1', author: 'Jane D.', rating: 5, title: 'Best chair ever!', comment: 'So comfortable and stylish. I can sit for hours without any back pain.', date: '2023-05-15' },
        { id: 'rev2', author: 'John S.', rating: 4, title: 'Great value', comment: 'Good chair for the price. The adjustable armrests are a plus.', date: '2023-04-20' },
      ],
    },
    {
      id: 'luna-lamp',
      name: 'Luna Desk Lamp',
      category: 'Lighting',
      price: 120,
      description: 'Illuminate your workspace with the Luna Desk Lamp. Featuring a minimalist design, adjustable brightness, and a warm, eye-friendly LED light, it\'s the perfect companion for late-night work sessions.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'luna-black', color: 'Matte Black', colorHex: '#1f2937', imageIds: ['img_lamp_1'] },
        { id: 'luna-silver', color: 'Brushed Silver', colorHex: '#d1d5db', imageIds: ['img_lamp_2'] },
      ],
      reviews: [
        { id: 'rev3', author: 'Emily R.', rating: 5, title: 'Sleek and functional', comment: 'Love the design and the different light settings. It looks great on my desk.', date: '2023-06-01' },
      ],
    },
    {
      id: 'comfy-sofa',
      name: 'Nimbus Sofa',
      category: 'Sofas',
      price: 1200,
      description: 'Sink into the cloud-like comfort of the Nimbus Sofa. With its deep seats, plush cushions, and durable fabric, it\'s the ideal centerpiece for any modern living room.',
      isTrending: true,
      isNew: true,
      variants: [
        { id: 'sofa-grey', color: 'Heather Grey', colorHex: '#6b7280', imageIds: ['img_sofa_1'] },
        { id: 'sofa-blue', color: 'Deep Ocean Blue', colorHex: '#3b82f6', imageIds: ['img_sofa_2'] },
      ],
      reviews: [
        { id: 'rev4', author: 'Michael B.', rating: 5, title: 'Incredibly comfortable', comment: 'This sofa is a game-changer. My family and I love it.', date: '2023-07-10' },
        { id: 'rev5', author: 'Sarah L.', rating: 5, title: 'Worth every penny', comment: 'High-quality and so comfortable. It completes my living room.', date: '2023-07-12' },
      ],
    },
    {
      id: 'terra-table',
      name: 'Terra Dining Table',
      category: 'Tables',
      price: 850,
      description: 'Gather your loved ones around the Terra Dining Table. Made from solid oak, its robust construction and timeless design make it a durable and elegant addition to any dining space.',
      isTrending: false,
      isNew: false,
      variants: [
        { id: 'table-oak', color: 'Natural Oak', colorHex: '#d97706', imageIds: ['img_table_1'] },
      ],
      reviews: [],
    },
    {
      id: 'zenith-bookshelf',
      name: 'Zenith Bookshelf',
      category: 'Storage',
      price: 450,
      description: 'Display your favorite books and decor on the Zenith Bookshelf. Its minimalist metal frame and wooden shelves offer a modern, industrial look that fits any room.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'shelf-wood', color: 'Walnut Finish', colorHex: '#44403c', imageIds: ['img_shelf_1'] },
      ],
      reviews: [
        { id: 'rev6', author: 'Chris P.', rating: 4, title: 'Sturdy and stylish', comment: 'Easy to assemble and looks great. Holds a lot of books.', date: '2023-08-01' },
      ],
    },
    {
      id: 'orbit-clock',
      name: 'Orbit Wall Clock',
      category: 'Decor',
      price: 80,
      description: 'Keep track of time in style with the Orbit Wall Clock. Its silent sweep movement and simple, elegant design make it a subtle yet striking addition to your wall.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'clock-black', color: 'Black & Gold', colorHex: '#111827', imageIds: ['img_clock_1'] },
      ],
      reviews: [],
    },
      {
      id: 'aura-vase',
      name: 'Aura Ceramic Vase',
      category: 'Decor',
      price: 65,
      description: 'A beautifully crafted ceramic vase with a unique texture. Perfect for holding fresh flowers or as a standalone decorative piece. Adds a touch of elegance to any space.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'vase-white', color: 'Matte White', colorHex: '#f9fafb', imageIds: ['img_vase_1'] },
      ],
      reviews: [
        { id: 'rev7', author: 'Olivia M.', rating: 5, title: 'Absolutely stunning', comment: 'The texture and shape are so unique. It looks much more expensive than it is.', date: '2023-09-05' },
      ],
    },
    {
      id: 'evergreen-plant',
      name: 'Evergreen Potted Plant',
      category: 'Decor',
      price: 95,
      description: 'Bring a touch of nature indoors with the Evergreen Potted Plant. This low-maintenance faux plant looks incredibly realistic and comes in a stylish ceramic pot.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'plant-green', color: 'Lush Green', colorHex: '#166534', imageIds: ['img_plant_1'] },
      ],
      reviews: [
        { id: 'rev8', author: 'David L.', rating: 5, title: 'Looks real!', comment: 'I have a black thumb, so this is perfect for me. Adds a nice pop of color to my office.', date: '2023-09-01' },
      ],
    },
  ];

export async function seedDatabase() {
    // Initialize Firebase
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase Initialized and Firestore instance created.");

    const productsCollection = collection(db, 'products');
    const batch = writeBatch(db);

    originalProducts.forEach(product => {
        const { id, ...productData } = product;
        const docRef = doc(db, "products", id);
        batch.set(docRef, productData);
    });

    try {
        await batch.commit();
        console.log(`Successfully seeded ${originalProducts.length} products.`);
    } catch (error) {
        console.error("Error seeding database:", error);
        throw new Error("Error seeding database");
    }
}
