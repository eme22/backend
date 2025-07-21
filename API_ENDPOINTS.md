# API Endpoints Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Authentication Endpoints

### POST /auth/login
Login with username and password.

**Request:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer"
}
```

**Response (201):**
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

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "User with username john_doe or email john@example.com already exists"
}
```

### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": 1,
  "username": "john_doe",
  "role": "customer"
}
```

## User Management Endpoints

### GET /users
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
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

### GET /users/:id
Get user by ID (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
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

### PUT /users/:id
Update user (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "user_id": 1,
  "username": "john_doe",
  "email": "jane@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "customer",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### DELETE /users/:id
Delete user (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

## Product Endpoints (To be implemented)

### GET /products
Get all products.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID
- `search` (optional): Search term

**Response (200):**
```json
{
  "products": [
    {
      "product_id": 1,
      "name": "iPhone 14",
      "description": "Latest iPhone model",
      "price": 999.99,
      "stock_quantity": 50,
      "sku": "IPHONE14-001",
      "offer": false,
      "category": {
        "category_id": 1,
        "name": "Electronics"
      },
      "brand": {
        "brand_id": 1,
        "name": "Apple"
      },
      "images": [
        {
          "image_id": 1,
          "image_url": "https://example.com/iphone14.jpg",
          "is_primary": true
        }
      ],
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET /products/:id
Get product by ID.

**Response (200):**
```json
{
  "product_id": 1,
  "name": "iPhone 14",
  "description": "Latest iPhone model",
  "price": 999.99,
  "stock_quantity": 50,
  "sku": "IPHONE14-001",
  "offer": false,
  "category": {
    "category_id": 1,
    "name": "Electronics"
  },
  "brand": {
    "brand_id": 1,
    "name": "Apple"
  },
  "images": [
    {
      "image_id": 1,
      "image_url": "https://example.com/iphone14.jpg",
      "is_primary": true
    }
  ],
  "reviews": [
    {
      "review_id": 1,
      "user": {
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe"
      },
      "rating": 5,
      "comment": "Great product!",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### GET /products/offers
Get products on offer with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category_id` (optional): Filter by category ID
- `brand_id` (optional): Filter by brand ID
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `search` (optional): Search in name and description

**Response (200):**
```json
{
  "products": [
    {
      "product_id": 1,
      "name": "iPhone 14",
      "description": "Latest iPhone model",
      "price": 999.99,
      "stock_quantity": 50,
      "sku": "IPHONE14-001",
      "offer": true,
      "category": {
        "category_id": 1,
        "name": "Electronics"
      },
      "brand": {
        "brand_id": 1,
        "name": "Apple"
      },
      "images": [
        {
          "image_id": 1,
          "image_url": "https://example.com/iphone14.jpg",
          "is_primary": true
        }
      ],
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### POST /products
Create new product (Admin/Vendor only).

**Headers:**
```
Authorization: Bearer <admin_or_vendor_token>
```

**Request:**
```json
{
  "name": "iPhone 14",
  "description": "Latest iPhone model",
  "price": 999.99,
  "stock_quantity": 50,
  "sku": "IPHONE14-001",
  "category_id": 1,
  "brand_id": 1
}
```

**Response (201):**
```json
{
  "product_id": 1,
  "name": "iPhone 14",
  "description": "Latest iPhone model",
  "price": 999.99,
  "stock_quantity": 50,
  "sku": "IPHONE14-001",
  "category_id": 1,
  "brand_id": 1,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

## Category Endpoints (To be implemented)

### GET /categories
Get all categories.

**Response (200):**
```json
[
  {
    "category_id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "parent_category_id": null,
    "subcategories": [
      {
        "category_id": 2,
        "name": "Smartphones",
        "description": "Mobile phones and accessories",
        "parent_category_id": 1
      }
    ],
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /categories
Create new category (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parent_category_id": null
}
```

**Response (201):**
```json
{
  "category_id": 1,
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parent_category_id": null,
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

## Order Endpoints (To be implemented)

### GET /orders
Get user's orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "order_id": 1,
    "user_id": 1,
    "order_status": "pending",
    "total_amount": 999.99,
    "order_date": "2025-01-01T00:00:00.000Z",
    "shipping_method": "standard",
    "payment_status": "pending",
    "address": {
      "address_line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "items": [
      {
        "order_item_id": 1,
        "product": {
          "product_id": 1,
          "name": "iPhone 14",
          "sku": "IPHONE14-001"
        },
        "quantity": 1,
        "unit_price": 999.99,
        "subtotal": 999.99
      }
    ]
  }
]
```

### POST /orders
Create new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "address_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 1
    }
  ],
  "shipping_method": "standard"
}
```

**Response (201):**
```json
{
  "order_id": 1,
  "user_id": 1,
  "order_status": "pending",
  "total_amount": 999.99,
  "order_date": "2025-01-01T00:00:00.000Z",
  "shipping_method": "standard",
  "payment_status": "pending",
  "address_id": 1
}
```

### GET /orders/:id
Get order by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "order_id": 1,
  "user_id": 1,
  "order_status": "pending",
  "total_amount": 999.99,
  "order_date": "2025-01-01T00:00:00.000Z",
  "shipping_method": "standard",
  "payment_status": "pending",
  "address": {
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "items": [
    {
      "order_item_id": 1,
      "product": {
        "product_id": 1,
        "name": "iPhone 14",
        "sku": "IPHONE14-001"
      },
      "quantity": 1,
      "unit_price": 999.99,
      "subtotal": 999.99
    }
  ],
  "payments": [
    {
      "payment_id": 1,
      "payment_method": "credit_card",
      "amount": 999.99,
      "payment_date": "2025-01-01T00:00:00.000Z",
      "transaction_id": "txn_123456"
    }
  ]
}
```

## Address Endpoints (To be implemented)

### GET /addresses
Get user's addresses.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "address_id": 1,
    "user_id": 1,
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001",
    "phone": "+1234567890",
    "is_default": true,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /addresses
Create new address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001",
  "phone": "+1234567890",
  "is_default": true
}
```

**Response (201):**
```json
{
  "address_id": 1,
  "user_id": 1,
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001",
  "phone": "+1234567890",
  "is_default": true,
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

## Review Endpoints (To be implemented)

### GET /products/:id/reviews
Get product reviews.

**Response (200):**
```json
[
  {
    "review_id": 1,
    "product_id": 1,
    "user": {
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe"
    },
    "rating": 5,
    "comment": "Great product!",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /products/:id/reviews
Create product review.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

**Response (201):**
```json
{
  "review_id": 1,
  "product_id": 1,
  "user_id": 1,
  "rating": 5,
  "comment": "Great product!",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "username must be a string",
    "email must be a valid email"
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID 1 not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with username john_doe already exists"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Product endpoints: 100 requests per minute
- Order endpoints: 10 requests per minute

## Pagination

Most list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Search and Filtering

### Products Search
```
GET /products?search=iphone&category=1&minPrice=100&maxPrice=1000&brand=1
```

### Orders Filter
```
GET /orders?status=pending&startDate=2025-01-01&endDate=2025-12-31
```

## File Upload

### Upload Product Images
```
POST /products/:id/images
Content-Type: multipart/form-data

{
  "image": <file>,
  "is_primary": true
}
```

**Response (201):**
```json
{
  "image_id": 1,
  "product_id": 1,
  "image_url": "https://example.com/uploads/product-image.jpg",
  "is_primary": true,
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

## WebSocket Events (Future Implementation)

### Order Status Updates
```javascript
socket.on('orderStatusChanged', (data) => {
  console.log('Order status updated:', data);
});
```

### Inventory Updates
```javascript
socket.on('inventoryUpdated', (data) => {
  console.log('Product inventory updated:', data);
});
```

## Testing Endpoints

You can test these endpoints using:

1. **Swagger UI**: `http://localhost:3000/api/docs`
2. **Postman**: Import the collection
3. **cURL**: Command line testing
4. **HTTP Client**: VS Code extension

### Example cURL Commands

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'

# Get user profile
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get all users (admin only)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```
