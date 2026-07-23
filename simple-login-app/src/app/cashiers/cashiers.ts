import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashiers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cashiers.html',
  styleUrls: ['./cashiers.css'] 
})
export class CashiersComponent implements OnInit {
  customers: any[] = [];
  products: any[] = [];
  
  selectedCustomer: any = null;
  selectedProductId: number | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadProducts(); 
  }

  severConnection() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  loadCustomers() {
    this.http.get('http://localhost:8080/api/customers').subscribe({
      next: (data: any) => {
        this.customers = data;
        if (this.selectedCustomer) {
          const updated = this.customers.find(c => c.id === this.selectedCustomer.id);
          if (updated) this.selectedCustomer = updated;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadProducts() {
    this.http.get('http://localhost:8080/api/customers/products').subscribe({
      next: (data: any) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
  }

  addToCart() {
    if (this.selectedCustomer && this.selectedProductId) {
      const url = `http://localhost:8080/api/customers/${this.selectedCustomer.id}/cart/add/${this.selectedProductId}`;
      this.http.post(url, {}).subscribe((updatedCustomer: any) => {
        this.selectedCustomer = updatedCustomer;
        this.selectedProductId = null;
        this.updateCustomerInList(updatedCustomer);
        this.loadProducts(); 
      });
    }
  }

  removeFromCart(productId: number) {
    if (this.selectedCustomer) {
      const url = `http://localhost:8080/api/customers/${this.selectedCustomer.id}/cart/remove/${productId}`;
      this.http.delete(url).subscribe((updatedCustomer: any) => {
        this.selectedCustomer = updatedCustomer;
        this.updateCustomerInList(updatedCustomer);
        this.loadProducts(); 
      });
    }
  }

  private updateCustomerInList(updatedCustomer: any) {
    const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      this.customers[index] = updatedCustomer;
    }
  }
}