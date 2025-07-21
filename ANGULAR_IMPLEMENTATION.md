# Angular Frontend Implementation Guide

## Overview

This guide provides specific implementation details for integrating the NestJS backend with an Angular frontend application.

## Setup

### 1. Create Angular Project
```bash
ng new ecommerce-frontend
cd ecommerce-frontend
npm install
```

### 2. Install Required Dependencies
```bash
npm install @angular/common @angular/http
npm install --save-dev @types/node
```

## Services

### 1. API Service

```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${error.error.message}`;
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again';
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          break;
        case 403:
          errorMessage = 'Forbidden: You don\'t have permission';
          break;
        case 404:
          errorMessage = 'Not Found: Resource not found';
          break;
        case 409:
          errorMessage = `Conflict: ${error.error.message}`;
          break;
        case 500:
          errorMessage = 'Internal Server Error';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error.message}`;
      }
    }
    
    return throwError(errorMessage);
  }
}
```

### 2. Authentication Service

```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Initialize user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.apiService.post<User>('/auth/register', userData);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getProfile(): Observable<any> {
    return this.apiService.get('/auth/profile');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }
}
```

### 3. User Service

```typescript
// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }
}
```

## Guards

### 1. Authentication Guard

```typescript
// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
```

### 2. Role Guard

```typescript
// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['requiredRole'];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}
```

## Components

### 1. Login Component

```typescript
// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }
}
```

### 2. Login Component Template

```html
<!-- src/app/components/login/login.component.html -->
<div class="login-container">
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
    <h2>Login</h2>
    
    <div class="alert alert-danger" *ngIf="error">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        formControlName="username"
        class="form-control"
        [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
      >
      <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
        Username is required
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        formControlName="password"
        class="form-control"
        [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
      >
      <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
        Password is required
      </div>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      [disabled]="loading || loginForm.invalid"
    >
      <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</div>
```

### 3. Dashboard Component

```typescript
// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
```

### 4. User Management Component (Admin)

```typescript
// src/app/components/user-management/user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }
}
```

## Interceptors

### HTTP Interceptor for Error Handling

```typescript
// src/app/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        
        return throwError(error);
      })
    );
  }
}
```

## Routing

### App Routing Module

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin/users', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'admin' }
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## App Module

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
```

## Usage Examples

### 1. Making API Calls in Components

```typescript
// In any component
export class ProductComponent implements OnInit {
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.get<any[]>('/products').subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}
```

### 2. Role-Based UI

```html
<!-- Show content based on user role -->
<div *ngIf="authService.hasRole('admin')">
  <h3>Admin Panel</h3>
  <button routerLink="/admin/users">Manage Users</button>
</div>

<div *ngIf="authService.hasRole('customer')">
  <h3>Customer Dashboard</h3>
  <button routerLink="/orders">My Orders</button>
</div>
```

## Testing

### Service Testing Example

```typescript
// src/app/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully', () => {
    const mockResponse = {
      access_token: 'mock-token',
      user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'customer' }
    };

    service.login({ username: 'testuser', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

This Angular implementation provides a complete foundation for integrating with your NestJS backend API.
