# E-Commerce Backend API Documentation

## Overview

This is a NestJS-based REST API for an e-commerce application with JWT authentication, role-based access control, and comprehensive product management features.

## Base URL
```
http://localhost:3000
```

## Frontend Static Files

The backend is configured to serve static frontend files from the `/static` directory. 

### Frontend Deployment
1. Build your Angular frontend application
2. Copy the built files (typically from `dist/` folder) to the `/static` directory in the backend
3. The backend will serve your frontend at the root URL (`/`)
4. API endpoints remain available under `/api/*`

### Static File Serving Configuration
- **Frontend files**: Served from `/static` directory at root path (`/`)
- **Uploaded images**: Served from `/uploads` directory at `/uploads/*`
- **API endpoints**: Available under `/api/*`

## API Documentation (Swagger)
```
http://localhost:3000/api/docs
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST /auth/logout
Logout and revoke refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "role": "customer" // Optional, defaults to "customer"
}
```

**Response:**
```json
{
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "userId": 1,
  "username": "john_doe",
  "role": "customer"
}
```

### User Management Endpoints

#### GET /users
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
  {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

#### GET /users/:id
Get user by ID (Admin only).

#### PUT /users/:id
Update user (Admin only).

#### DELETE /users/:id
Delete user (Admin only).

### Categories Endpoints

#### GET /categories
Get all categories with subcategories.

**Response:**
```json
[
  {
    "category_id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "parent_category_id": null,
    "subcategories": [
      {
        "category_id": 2,
        "name": "Smartphones",
        "description": "Mobile phones and accessories",
        "parent_category_id": 1
      }
    ]
  }
]
```

#### GET /categories/:id
Get category by ID.

#### POST /categories
Create new category (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "parent_category_id": 1 // Optional, null for root category
}
```

#### PUT /categories/:id
Update category (Admin only).

#### DELETE /categories/:id
Delete category (Admin only).

#### GET /categories/root
Get root categories (categories without parent).

#### GET /categories/:id/subcategories
Get subcategories of a specific category.

### Products Endpoints

#### GET /products
Get all products with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category_id`: Filter by category ID
- `brand_id`: Filter by brand ID
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `search`: Search in name and description

**Response:**
```json
{
  "products": [
    {
      "product_id": 1,
      "name": "iPhone 15",
      "description": "Latest iPhone model",
      "price": 999.99,
      "stock_quantity": 50,
      "sku": "IPHONE15-001",
      "is_active": true,
      "offer": false,
      "category": {
        "category_id": 2,
        "name": "Smartphones"
      },
      "brand": {
        "brand_id": 1,
        "name": "Apple"
      },
      "images": [
        {
          "image_id": 1,
          "image_url": "https://example.com/image1.jpg",
          "alt_text": "iPhone 15 front view"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### GET /products/:id
Get product by ID.

#### GET /products/offers
Get products on offer with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category_id`: Filter by category ID
- `brand_id`: Filter by brand ID
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `search`: Search in name and description

**Response:**
```json
{
  "products": [
    {
      "product_id": 1,
      "name": "iPhone 15",
      "description": "Latest iPhone model",
      "price": 999.99,
      "stock_quantity": 50,
      "sku": "IPHONE15-001",
      "is_active": true,
      "offer": true,
      "category": {
        "category_id": 2,
        "name": "Smartphones"
      },
      "brand": {
        "brand_id": 1,
        "name": "Apple"
      },
      "images": [
        {
          "image_id": 1,
          "image_url": "https://example.com/image1.jpg",
          "alt_text": "iPhone 15 front view"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

#### POST /products
Create new product (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category_id": 1,
  "brand_id": 1,
  "price": 999.99,
  "stock_quantity": 50,
  "sku": "UNIQUE-SKU-001"
}
```

#### PUT /products/:id
Update product (Admin only).

#### DELETE /products/:id
Delete product - soft delete (Admin only).

#### GET /products/category/:categoryId
Get products by category.

#### GET /products/brand/:brandId
Get products by brand.

#### POST /products/:id/images
Add image to product (Admin only).

**Request Body:**
```json
{
  "image_url": "string",
  "alt_text": "string"
}
```

#### DELETE /products/images/:imageId
Remove image from product (Admin only).

#### PATCH /products/:id/stock
Update product stock (Admin only).

### Upload Endpoints

#### POST /upload
Upload a file. The file will be stored on the server and a relative URL will be returned.

**Request Body (multipart/form-data):**
- `file`: The image file to upload.

**Response:**
```json
{
  "url": "/upload/your-generated-filename.jpg"
}
```

### Cart Endpoints

#### GET /cart
Get cart contents for authenticated user or anonymous session.

**Headers:**
```
Authorization: Bearer <token> // Optional for authenticated users
x-session-id: <session_id> // Required for anonymous users
```

**Response:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 999.99,
      "product": {
        "product_id": 1,
        "name": "iPhone 15",
        "description": "Latest iPhone model",
        "price": 999.99,
        "stock_quantity": 50,
        "images": [...]
      }
    }
  ],
  "total": 1999.98,
  "itemCount": 2,
  "user_id": 1, // if authenticated
  "session_id": "uuid" // if anonymous
}
```

#### GET /cart/summary
Get cart summary (item count and total).

**Response:**
```json
{
  "itemCount": 2,
  "total": 1999.98
}
```

#### POST /cart/add
Add item to cart.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### PATCH /cart/item/:productId
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

#### DELETE /cart/item/:productId
Remove item from cart.

#### DELETE /cart/clear
Clear entire cart.

#### POST /cart/merge
Merge anonymous cart with user cart after login (Authenticated users only).

**Headers:**
```
Authorization: Bearer <token>
x-session-id: <anonymous_session_id>
```

### Orders Endpoints

#### GET /orders
Get all orders (Admin only).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `userId`: Filter by user ID

#### GET /orders/my-orders
Get current user's orders (Authenticated users only).

#### GET /orders/:id
Get order by ID.

#### POST /orders
Create new order (Authenticated users only).

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": "123 Main St, City, State",
  "payment_method": "credit_card"
}
```

#### PATCH /orders/:id/status
Update order status (Admin only).

**Request Body:**
```json
{
  "status": "processing" // pending, processing, shipped, delivered, cancelled
}
```

#### PATCH /orders/:id/payment-status
Update payment status (Admin only).

**Request Body:**
```json
{
  "paymentStatus": "completed" // pending, completed, failed, refunded, cancelled
}
```

#### DELETE /orders/:id
Cancel order.

#### GET /orders/stats
Get order statistics (Admin only).

## Frontend Implementation Guide

### 1. Setting up HTTP Client

#### Using Axios (Recommended)

```bash
npm install axios
```

Create an API service:

```typescript
// src/services/api.service.ts
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and auto-refresh tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', {
            refresh_token: refreshToken
          });
          
          // Update stored tokens
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Authentication Service

```typescript
// src/services/auth.service.ts
import apiClient from './api.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: 'customer' | 'admin' | 'vendor';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens and user data
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken
    });

    // Update stored tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', {
          refresh_token: refreshToken
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export default new AuthService();
```

### 3. User Service

```typescript
// src/services/user.service.ts
import apiClient from './api.service';
import { User } from './auth.service';

class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

export default new UserService();
```

### 4. Categories Service

```typescript
// src/services/categories.service.ts
import apiClient from './api.service';

export interface Category {
  category_id: number;
  name: string;
  description: string;
  parent_category_id: number | null;
  subcategories?: Category[];
}

class CategoriesService {
  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData: Omit<Category, 'category_id' | 'subcategories'>): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', categoryData);
    return response.data;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }

  async getRootCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories/root');
    return response.data;
  }

  async getSubcategories(parentId: number): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(`/categories/${parentId}/subcategories`);
    return response.data;
  }
}

export default new CategoriesService();
```

### 5. Products Service

```typescript
// src/services/products.service.ts
import apiClient from './api.service';

export interface Product {
  product_id: number;
  name: string;
  description: string;
  category_id: number;
  brand_id: number;
  price: number;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  offer: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    category_id: number;
    name: string;
  };
  brand?: {
    brand_id: number;
    name: string;
  };
  images?: ProductImage[];
  reviews?: Review[];
}

export interface ProductImage {
  image_id: number;
  image_url: string;
  alt_text: string;
}

export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  user: {
    username: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
}

class ProductsService {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<ProductsResponse>(`/products?${params}`);
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: Omit<Product, 'product_id' | 'created_at' | 'updated_at' | 'category' | 'brand' | 'images' | 'reviews'>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  }

  async getProductsByBrand(brandId: number): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products/brand/${brandId}`);
    return response.data;
  }

  async getProductsOnOffer(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<ProductsResponse>(`/products/offers?${params}`);
    return response.data;
  }

  async addProductImage(productId: number, imageData: Omit<ProductImage, 'image_id'>): Promise<ProductImage> {
    const response = await apiClient.post<ProductImage>(`/products/${productId}/images`, imageData);
    return response.data;
  }

  async removeProductImage(imageId: number): Promise<void> {
    await apiClient.delete(`/products/images/${imageId}`);
  }

  async updateProductStock(productId: number, quantity: number): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${productId}/stock`, { quantity });
    return response.data;
  }
}

export default new ProductsService();
```

### 6. Cart Service

```typescript
// src/services/cart.service.ts
import apiClient from './api.service';
import { Product } from './products.service';

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  user_id?: number;
  session_id?: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  total: number;
}

class CartService {
  private sessionId: string | null = null;

  private getSessionId(): string {
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem('cart_session_id');
      if (!this.sessionId) {
        this.sessionId = this.generateSessionId();
        localStorage.setItem('cart_session_id', this.sessionId);
      }
    }
    return this.sessionId;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    
    // Add session ID for anonymous users
    if (!this.isAuthenticated()) {
      headers['x-session-id'] = this.getSessionId();
    }
    
    return headers;
  }

  private isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>('/cart', {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getCartSummary(): Promise<CartSummary> {
    const response = await apiClient.get<CartSummary>('/cart/summary', {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async addToCart(item: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>('/cart/add', item, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateCartItem(productId: number, update: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.patch<Cart>(`/cart/item/${productId}`, update, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async removeFromCart(productId: number): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`/cart/item/${productId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<Cart>('/cart/clear', {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async mergeCart(): Promise<Cart> {
    const sessionId = this.getSessionId();
    const response = await apiClient.post<Cart>('/cart/merge', {}, {
      headers: {
        'x-session-id': sessionId
      }
    });
    
    // Clear session after merge
    this.sessionId = null;
    localStorage.removeItem('cart_session_id');
    
    return response.data;
  }
}

export default new CartService();
```

### 7. Orders Service

```typescript
// src/services/orders.service.ts
import apiClient from './api.service';
import { Product } from './products.service';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  order_id: number;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  order_items: OrderItem[];
  payment_status: string;
}

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
  shipping_address: string;
  payment_method: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

class OrdersService {
  async getAllOrders(page: number = 1, limit: number = 10, userId?: number): Promise<OrdersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (userId) {
      params.append('userId', userId.toString());
    }

    const response = await apiClient.get<OrdersResponse>(`/orders?${params}`);
    return response.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders/my-orders');
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  }

  async cancelOrder(id: number): Promise<Order> {
    const response = await apiClient.delete<Order>(`/orders/${id}`);
    return response.data;
  }

  async getOrderStats(): Promise<OrderStats> {
    const response = await apiClient.get<OrderStats>('/orders/stats');
    return response.data;
  }
}

export default new OrdersService();
```

### 8. React Hook Examples

#### Authentication Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useContext, createContext, useEffect } from 'react';
import authService, { AuthResponse, LoginRequest, RegisterRequest } from '../services/auth.service';

interface AuthContextType {
  user: any;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Cart Hook

```typescript
// src/hooks/useCart.ts
import { useState, useEffect, useContext, createContext } from 'react';
import cartService, { Cart, CartItem, AddToCartRequest } from '../services/cart.service';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (item: AddToCartRequest) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: AddToCartRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateCartItem(productId, { quantity });
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

#### Products Hook

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import productsService, { Product, ProductsResponse, ProductFilters } from '../services/products.service';

export const useProducts = (filters: ProductFilters = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchProducts = async (newFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const appliedFilters = { ...filters, ...newFilters };
      const response = await productsService.getProducts(appliedFilters);
      setProducts(response.products);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    refetch: () => fetchProducts(),
  };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productsService.getProductById(id);
      setProduct(productData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};
```
```

### 5. Component Examples

#### Login Component

```typescript
// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
```

#### Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

#### Cart Component

```typescript
// src/components/Cart.tsx
import React from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Cart: React.FC = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (productId: number, quantity: number) => {
    try {
      await updateCartItem(productId, quantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cart || cart.items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.product_id} className="cart-item">
            <div className="product-info">
              <h4>{item.product?.name}</h4>
              <p>${item.price}</p>
            </div>
            
            <div className="quantity-controls">
              <button
                onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button
              onClick={() => handleRemoveItem(item.product_id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <strong>Total: ${cart.total.toFixed(2)}</strong>
        </div>
        
        <div className="cart-actions">
          <button onClick={handleClearCart} className="clear-btn">
            Clear Cart
          </button>
          
          {isAuthenticated ? (
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          ) : (
            <div>
              <p>Please login to checkout</p>
              <button>Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

#### Product Card Component

```typescript
// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Product } from '../services/products.service';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart({
        product_id: product.product_id,
        quantity,
      });
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 && (
          <img 
            src={product.images[0].image_url} 
            alt={product.images[0].alt_text}
          />
        )}
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">${product.price}</p>
        <p className="stock">
          {product.stock_quantity > 0 
            ? `${product.stock_quantity} in stock` 
            : 'Out of stock'
          }
        </p>
        
        {product.stock_quantity > 0 && (
          <div className="add-to-cart">
            <div className="quantity-selector">
              <label htmlFor={`quantity-${product.product_id}`}>Quantity:</label>
              <select
                id={`quantity-${product.product_id}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="add-to-cart-btn"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
```

#### Cart Summary Component

```typescript
// src/components/CartSummary.tsx
import React, { useEffect, useState } from 'react';
import cartService, { CartSummary } from '../services/cart.service';

const CartSummaryComponent: React.FC = () => {
  const [summary, setSummary] = useState<CartSummary>({ itemCount: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCartSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch cart summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    
    // Update summary when cart changes (you can use a global state or context)
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cart-summary">
      <span className="cart-icon">🛒</span>
      <span className="item-count">{summary.itemCount}</span>
      <span className="total">${summary.total.toFixed(2)}</span>
    </div>
  );
};

export default CartSummaryComponent;
```
```

### 6. Error Handling

```typescript
// src/utils/errorHandler.ts
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

export const handleApiError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    const { data, status } = error.response;
    
    switch (status) {
      case 400:
        return `Bad Request: ${data.message}`;
      case 401:
        return 'Unauthorized: Please log in again';
      case 403:
        return 'Forbidden: You don\'t have permission to access this resource';
      case 404:
        return 'Not Found: The requested resource was not found';
      case 409:
        return `Conflict: ${data.message}`;
      case 500:
        return 'Internal Server Error: Something went wrong on our end';
      default:
        return data.message || 'An unexpected error occurred';
    }
  } else if (error.request) {
    return 'Network Error: Unable to connect to the server';
  } else {
    return 'Error: Something went wrong';
  }
};
```

### 7. Usage in App.tsx

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import Products from './components/Products';
import CartSummary from './components/CartSummary';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <header>
              <nav>
                <Link to="/products">Products</Link>
                <Link to="/cart">
                  <CartSummary />
                </Link>
              </nav>
            </header>
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

## Environment Variables

Create a `.env` file in your frontend project:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=10000
```

## Additional Features to Implement

1. **Product Management**: ✅ Implemented - Create services for products, categories, and inventory
2. **Cart Management**: ✅ Implemented - Cart functionality for both anonymous and authenticated users
3. **Order Management**: ✅ Implemented - Order processing with status tracking
4. **User Authentication**: ✅ Implemented - JWT-based authentication with role-based access
5. **Category Management**: ✅ Implemented - Hierarchical category structure
6. **File Upload**: Handle product image uploads
7. **Real-time Updates**: Consider WebSocket integration for real-time notifications
8. **Caching**: Implement caching strategies for better performance
9. **Pagination**: ✅ Implemented - Handle large datasets with pagination
10. **Search and Filtering**: ✅ Implemented - Search functionality for products
11. **Payment Integration**: Integrate payment gateways (Stripe, PayPal, etc.)
12. **Inventory Management**: Stock tracking and low-stock alerts
13. **Reviews and Ratings**: Customer reviews and ratings system
14. **Wishlist**: Save products for later
15. **Recommendations**: Product recommendation system

## Cart Features

### Anonymous Cart
- Cart persists using session ID stored in localStorage
- Automatically generates unique session ID for each visitor
- Cart data stored in memory on the server
- Session-based cart management

### Authenticated Cart
- Cart tied to user account
- Persistent across devices and sessions
- Cart merging when user logs in with existing anonymous cart
- Enhanced security and data persistence

### Cart Operations
- Add items to cart
- Update item quantities
- Remove items from cart
- Clear entire cart
- Get cart summary (item count and total)
- Merge anonymous cart with user cart after login

## API Headers

### For Anonymous Users
```
Content-Type: application/json
x-session-id: <generated_session_id>
```

### For Authenticated Users
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### For Cart Merging
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
x-session-id: <anonymous_session_id>
```

## Testing

```typescript
// src/services/__tests__/auth.service.test.ts
import authService from '../auth.service';
import apiClient from '../api.service';

// Mock axios
jest.mock('../api.service');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'customer'
        }
      }
    };

    mockedApiClient.post.mockResolvedValueOnce(mockResponse);

    const result = await authService.login({
      username: 'testuser',
      password: 'password123'
    });

    expect(result).toEqual(mockResponse.data);
    expect(localStorage.getItem('access_token')).toBe('mock-token');
  });
});
```

This documentation provides a comprehensive guide for implementing the API in your frontend application. The examples use React with TypeScript, but the concepts can be adapted to any frontend framework.
