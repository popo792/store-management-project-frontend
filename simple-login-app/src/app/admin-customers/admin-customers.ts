import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.html',
  styleUrls: ['./admin-customers.css'] 
})
export class AdminCustomersComponent implements OnInit {
  
  staffMatrix: any[] = [];
  activeOperative: any = null;
  transactionLedger: any[] = [];

  products: any[] = [];
  editingProduct: any = null;
  showAddForm: boolean = false;
  newProduct: any = { name: '', price: null, stockQty: null };

  cashiers: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadStaffMatrix();
    this.loadProducts();
    this.loadCashiers();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  loadStaffMatrix() {
    this.http.get('http://localhost:8080/api/terminal/operators').subscribe({
      next: (data: any) => {
        this.staffMatrix = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  engageTarget(unit: any) {
    this.activeOperative = unit;
    this.loadTransactionLedger(unit.id);
  }

  loadTransactionLedger(unitId: number) {
    this.http.get(`http://localhost:8080/api/terminal/manifest/${unitId}`).subscribe({
      next: (data: any) => {
        this.transactionLedger = data;
        this.cdr.detectChanges();

        this.transactionLedger.forEach(order => {
          this.http.get(`http://localhost:8080/api/orders/total/${order.id}`).subscribe({
            next: (total: any) => {
              order.totalValue = total;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error(`Failed to fetch total for order ${order.id}`, err);
              order.totalValue = 0; 
              this.cdr.detectChanges();
            }
          });
        });
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

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newProduct = { name: '', price: null, stockQty: null }; 
    }
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price != null && this.newProduct.stockQty != null) {
      this.http.post('http://localhost:8080/api/customers/products/add', this.newProduct).subscribe({
        next: () => {
          this.loadProducts(); 
          this.toggleAddForm(); 
        },
        error: (err) => {
          console.error(err);
          alert('Failed to add product.');
        }
      });
    } else {
      alert('Please fill out all fields before saving.');
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      this.http.delete(`http://localhost:8080/api/customers/products/delete/${productId}`).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== productId);
          
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete product.');
        }
      });
    }
  }

  startEditing(product: any) {
    this.editingProduct = { ...product };
  }

  cancelEditing() {
    this.editingProduct = null;
  }

  saveProduct() {
    if (this.editingProduct) {
      const url = `http://localhost:8080/api/customers/products/${this.editingProduct.id}`;
      this.http.put(url, this.editingProduct).subscribe({
        next: () => {
          this.editingProduct = null; 
          this.loadProducts(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  loadCashiers() {
    this.http.get('http://localhost:8080/api/cashiers/profits').subscribe({
      next: (data: any) => {
        this.cashiers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}