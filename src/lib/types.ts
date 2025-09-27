export type ProductVariant = {
  id: string;
  color: string;
  colorHex: string;
  imageIds: string[];
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  variants: ProductVariant[];
  reviews: ProductReview[];
  isTrending: boolean;
  isNew: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  color: string;
};
