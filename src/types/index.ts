// Mirrors the springboot-ecommerce backend DTOs. Every endpoint wraps payloads in ApiResponse.

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductSku {
  skuId: string;
  name: string;
  variantAttributes?: Record<string, string>;
  price: number;
  stock: number;
  imageUrl?: string | null;
  weight?: number | null;
}

export interface ProductImage {
  url: string;
  alt?: string | null;
}

export interface Product {
  id: string;
  storeId: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  images?: ProductImage[] | null;
  skus: ProductSku[];
  attributes?: Record<string, unknown> | null;
  status: string;
  rating: number;
  reviewCount: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  children?: Category[];
}

export interface CartItem {
  productId: string;
  skuId: string;
  productName: string;
  skuName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
  storeId: string;
  storeName: string;
  addedAt?: string;
  selected: boolean;
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  skuId: string;
  skuName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string | null;
}

export type SubOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "DONE"
  | "CANCELLED";

export interface SubOrder {
  id: string;
  storeId: string;
  subtotal: number;
  commissionAmount: number;
  sellerAmount: number;
  status: SubOrderStatus;
  trackingNumber?: string | null;
  courierName?: string | null;
  courierService?: string | null;
  shippingCost: number;
  items: OrderItem[];
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED";

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string | null;
  shippingPostalCode: string;
  notes?: string | null;
  subOrders: SubOrder[];
  createdAt?: string;
}

export type Role = "ROLE_CUSTOMER" | "ROLE_SELLER" | "ROLE_ADMIN";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
