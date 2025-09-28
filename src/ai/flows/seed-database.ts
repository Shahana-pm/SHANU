
'use server';
/**
 * @fileOverview A Genkit flow for seeding the Firestore database with initial product data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import admin from 'firebase-admin';
import { getFirestore, collection, writeBatch, doc, getDocs, query, deleteDoc } from 'firebase/firestore';

// This is a placeholder. In a real deployed environment, you would use a secure method
// like Google Cloud Secret Manager to store and access your service account key.
// For local development, you would typically have a service-account.json file that is
// gitignored and loaded here. Since we cannot assume the file exists, we will
// attempt to use default application credentials, which works in many Google Cloud environments.
function getServiceAccount() {
  // In a real project, you would replace this with a secure way to get credentials
  // For local dev, you can use `gcloud auth application-default login`
  // and the SDK will pick up the credentials automatically.
  // We'll return undefined and let initializeApp handle it.
  return undefined;
}


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
        { id: 'aero-black', color: 'Midnight Black', colorHex: '#111827', imageUrl: '/Product-img/img_chair_1.jpeg' },
        { id: 'aero-white', color: 'Cloud White', colorHex: '#f9fafb', imageUrl: '/Product-img/img_chair_2.jpeg' },
        { id: 'aero-grey', color: 'Slate Grey', colorHex: '#4b5563', imageUrl: '/Product-img/img_chair_3.jpeg' },
      ],
      reviews: [
        { id: 'rev1', author: 'Jane D.', rating: 5, title: 'Best chair ever!', comment: 'So comfortable and stylish. I can sit for hours without any back pain.', date: '2023-05-15' },
        { id: 'rev2', author: 'John S.', rating: 4, title: 'Great value', comment: 'Good chair for the price. The adjustable armrests are a plus.', date: '2023-04-20' },
      ],
    },
    {
      id: 'velvet-accent-chair',
      name: 'Velvet Accent Chair',
      category: 'Chairs',
      price: 450,
      description: 'Add a touch of luxury to any room with this plush velvet accent chair. Its elegant design and comfortable cushioning make it the perfect statement piece.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'velvet-green', color: 'Emerald Green', colorHex: '#059669', imageUrl: '/Product-img/img_chair_2.jpeg' },
      ],
      reviews: [],
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
        { id: 'luna-black', color: 'Matte Black', colorHex: '#1f2937', imageUrl: '/Product-img/img_lamp_1.jpeg' },
        { id: 'luna-silver', color: 'Brushed Silver', colorHex: '#d1d5db', imageUrl: '/Product-img/img_lamp_2.jpeg' },
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
        { id: 'sofa-grey', color: 'Heather Grey', colorHex: '#6b7280', imageUrl: '/Product-img/img_sofa_1.jpeg' },
        { id: 'sofa-blue', color: 'Deep Ocean Blue', colorHex: '#3b82f6', imageUrl: '/Product-img/img_sofa_2.jpeg' },
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
        { id: 'table-oak', color: 'Natural Oak', colorHex: '#d97706', imageUrl: '/Product-img/img_table_1.jpeg' },
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
        { id: 'shelf-wood', color: 'Walnut Finish', colorHex: '#44403c', imageUrl: '/Product-img/img_shelf_1.jpeg' },
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
        { id: 'clock-black', color: 'Black & Gold', colorHex: '#111827', imageUrl: '/Product-img/img_clock_1.jpeg' },
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
        { id: 'vase-white', color: 'Matte White', colorHex: '#f9fafb', imageUrl: '/Product-img/img_vase_1.jpeg' },
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
        { id: 'plant-green', color: 'Lush Green', colorHex: '#166534', imageUrl: '/Product-img/img_plant_1.jpeg' },
      ],
      reviews: [
        { id: 'rev8', author: 'David L.', rating: 5, title: 'Looks real!', comment: 'I have a black thumb, so this is perfect for me. Adds a nice pop of color to my office.', date: '2023-09-01' },
      ],
    },
    {
      id: 'flora-maxi-dress',
      name: 'Flora Maxi Dress',
      category: 'Dresses',
      price: 120,
      description: 'A beautiful flowing maxi dress with a vibrant floral pattern. Perfect for summer days and special occasions.',
      isTrending: true,
      isNew: true,
      variants: [
        { id: 'flora-blue', color: 'Sky Blue', colorHex: '#87CEEB', imageUrl: '/Product-img/img_dress_1.jpeg' },
        { id: 'flora-pink', color: 'Blush Pink', colorHex: '#FFC0CB', imageUrl: '/Product-img/img_dress_2.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'city-chic-blazer-dress',
      name: 'City Chic Blazer Dress',
      category: 'Dresses',
      price: 150,
      description: 'A sophisticated blazer dress that combines power and style. Perfect for the modern woman on the go.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'blazer-black', color: 'Classic Black', colorHex: '#000000', imageUrl: '/Product-img/img_dress_3.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'sunset-slip-dress',
      name: 'Sunset Slip Dress',
      category: 'Dresses',
      price: 95,
      description: 'A simple yet elegant slip dress in a beautiful sunset orange hue. Made from luxurious satin.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'slip-orange', color: 'Sunset Orange', colorHex: '#FD5E53', imageUrl: '/Product-img/img_dress_4.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'denim-shirt-dress',
      name: 'Denim Shirt Dress',
      category: 'Dresses',
      price: 85,
      description: 'A casual and versatile denim shirt dress. Can be dressed up or down for any occasion.',
      isTrending: false,
      isNew: false,
      variants: [
        { id: 'denim-blue', color: 'Vintage Blue', colorHex: '#6082B6', imageUrl: '/Product-img/img_dress_5.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'lace-midi-dress',
      name: 'Lace Midi Dress',
      category: 'Dresses',
      price: 180,
      description: 'An exquisite lace midi dress, perfect for weddings and formal events. Features intricate detailing.',
      isTrending: false,
      isNew: false,
      variants: [
        { id: 'lace-white', color: 'Ivory White', colorHex: '#FFFFF0', imageUrl: '/Product-img/img_dress_1.jpeg' },
      ],
      reviews: [],
    },
    // Additional Dresses
    {
      id: 'summer-breeze-sundress',
      name: 'Summer Breeze Sundress',
      category: 'Dresses',
      price: 75,
      description: 'Lightweight cotton sundress with a breezy fit, perfect for casual summer outings. Features adjustable straps and a flattering A-line silhouette.',
      isTrending: true,
      isNew: true,
      variants: [
        { id: 'sundress-floral', color: 'Floral Print', colorHex: '#FFB6C1', imageUrl: '/Product-img/img_dress_2.jpeg' },
        { id: 'sundress-solid', color: 'Soft Blue', colorHex: '#87CEEB', imageUrl: '/Product-img/img_dress_1.jpeg' },
      ],
      reviews: [
        { id: 'rev9', author: 'Anna K.', rating: 5, title: 'Perfect for summer!', comment: 'So comfortable and cute. Got tons of compliments.', date: '2023-10-01' },
      ],
    },
    {
      id: 'elegant-evening-gown',
      name: 'Elegant Evening Gown',
      category: 'Dresses',
      price: 250,
      description: 'Sophisticated silk evening gown with a mermaid silhouette and subtle shimmer. Ideal for formal events and galas.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'gown-black', color: 'Midnight Black', colorHex: '#000000', imageUrl: '/Product-img/img_dress_3.jpeg' },
        { id: 'gown-red', color: 'Ruby Red', colorHex: '#DC143C', imageUrl: '/Product-img/img_dress_4.jpeg' },
      ],
      reviews: [],
    },
    // Hair Accessories
    {
      id: 'crystal-hair-clip-set',
      name: 'Crystal Hair Clip Set',
      category: 'Hair Accessories',
      price: 35,
      description: 'Set of 6 elegant crystal hair clips that add sparkle to any hairstyle. Perfect for everyday wear or special occasions.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'clips-silver', color: 'Silver Crystals', colorHex: '#C0C0C0', imageUrl: '/Product-img/2.png' },
        { id: 'clips-gold', color: 'Gold Crystals', colorHex: '#FFD700', imageUrl: '/Product-img/1.png' },
      ],
      reviews: [
        { id: 'rev10', author: 'Mia S.', rating: 4, title: 'Pretty and sturdy', comment: 'The clips hold hair well and look luxurious.', date: '2023-10-15' },
      ],
    },
    {
      id: 'silk-headband',
      name: 'Silk Headband',
      category: 'Hair Accessories',
      price: 25,
      description: 'Soft silk headband in various patterns, comfortable for all-day wear. Adds a chic touch to casual outfits.',
      isTrending: false,
      isNew: true,
      variants: [
        { id: 'headband-polka', color: 'Polka Dot', colorHex: '#FF69B4', imageUrl: '/Product-img/img_hair_1.jpeg' },
        { id: 'headband-solid', color: 'Navy Blue', colorHex: '#000080', imageUrl: '/Product-img/img_hair_2.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'floral-bobby-pins',
      name: 'Floral Bobby Pins',
      category: 'Hair Accessories',
      price: 15,
      description: 'Pack of 10 bobby pins adorned with delicate fabric flowers. Great for boho or romantic hairstyles.',
      isTrending: true,
      isNew: false,
      variants: [
        { id: 'pins-pink', color: 'Pink Flowers', colorHex: '#FFC0CB', imageUrl: '/Product-img/img_hair_3.jpeg' },
      ],
      reviews: [
        { id: 'rev11', author: 'Lily T.', rating: 5, title: 'Adorable!', comment: 'These make my updos so pretty. Highly recommend.', date: '2023-09-20' },
      ],
    },
    // Kids
    {
      id: 'colorful-building-blocks',
      name: 'Colorful Building Blocks Set',
      category: 'Kids',
      price: 45,
      description: 'Set of 100 colorful wooden building blocks for creative play. Develops fine motor skills and imagination in children ages 3+.',
      isTrending: true,
      isNew: true,
      variants: [
        { id: 'blocks-standard', color: 'Multi-Color', colorHex: '#FF4500', imageUrl: '/Product-img/img_kids_1.jpeg' },
      ],
      reviews: [
        { id: 'rev12', author: 'Parent J.', rating: 5, title: 'Hours of fun', comment: 'My kids love building towers and houses. Durable quality.', date: '2023-10-05' },
      ],
    },
    {
      id: 'cozy-kids-hoodie',
      name: 'Cozy Kids Hoodie',
      category: 'Kids',
      price: 30,
      description: 'Soft fleece hoodie for kids, available in fun colors. Keeps little ones warm and comfortable during cooler weather.',
      isTrending: false,
      isNew: false,
      variants: [
        { id: 'hoodie-blue', color: 'Bright Blue', colorHex: '#1E90FF', imageUrl: '/Product-img/img_kids_2.jpeg' },
        { id: 'hoodie-green', color: 'Lime Green', colorHex: '#32CD32', imageUrl: '/Product-img/img_kids_3.jpeg' },
      ],
      reviews: [],
    },
    {
      id: 'fun-animal-plush-toy',
      name: 'Fun Animal Plush Toy',
      category: 'Kids',
      price: 20,
      description: 'Adorable 12-inch plush toy of a friendly bear. Machine washable and perfect for cuddling or imaginative play.',
      isTrending: true,
      isNew: true,
      variants: [
        { id: 'plush-bear', color: 'Brown Bear', colorHex: '#8B4513', imageUrl: '/Product-img/img_kids_4.jpeg' },
      ],
      reviews: [
        { id: 'rev13', author: 'Mom R.', rating: 5, title: 'Super soft', comment: 'My toddler carries it everywhere. Great gift idea.', date: '2023-10-10' },
      ],
    },
  ];

  async function deleteCollection(db: any, collectionPath: string) {
    const q = query(collection(db, collectionPath));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

export const seedDatabaseFlow = ai.defineFlow(
  {
    name: 'seedDatabaseFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      error: z.string().optional(),
    }),
  },
  async () => {
    try {
      if (!admin.apps.length) {
        // Correctly initialize without a service account file
        // The SDK will use Application Default Credentials
        admin.initializeApp();
      }
      const db = getFirestore(admin.app());

      const productsCollectionRef = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollectionRef);

      if (!productsSnapshot.empty) {
        return {
          success: false,
          message: "Database already contains data. Seeding was skipped to prevent overwriting your products.",
        };
      }
      
      const batch = writeBatch(db);

      originalProducts.forEach(product => {
          const { id, variants, reviews, ...productData } = product;
          const productRef = doc(db, "products", id);
          batch.set(productRef, productData);

          variants.forEach(variant => {
              const { id: variantId, ...variantData } = variant;
              const variantRef = doc(db, `products/${id}/variants/${variantId}`);
              batch.set(variantRef, variantData);
          });

          reviews.forEach(review => {
              const { id: reviewId, ...reviewData } = review;
              const reviewRef = doc(db, `products/${id}/reviews/${reviewId}`);
              batch.set(reviewRef, reviewData);
          });
      });

      await batch.commit();
      return {
          success: true,
          message: `Successfully seeded ${originalProducts.length} products.`
      };

    } catch (e: any) {
      console.error("Error seeding database:", e);
      return {
        success: false,
        message: "Error seeding database.",
        error: e.message,
      };
    }
  }
);

    