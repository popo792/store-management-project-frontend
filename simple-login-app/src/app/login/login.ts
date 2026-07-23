import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  attemptAlias: string = '';
  shadowKey: string = '';

  constructor(private pulseLink: HttpClient, private navigatorNode: Router) {}

  executeBreach() {
    const dataEnvelope = { 
        username: this.attemptAlias,
        password: this.shadowKey
    };

    console.log("Sending payload:", dataEnvelope);

    this.pulseLink.post('http://localhost:8080/api/gate/knock', dataEnvelope).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.role);
        
        if (response.role === 'ADMIN') {
          this.navigatorNode.navigate(['/admin-customers']);
        } else if (response.role === 'CASHIER') {
          this.navigatorNode.navigate(['/cashiers']);
        }
      },
      error: (fault) => {
        console.error(fault);
      }
    });
  }
}