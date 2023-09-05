import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  address: string = '';
  phonenumber: string = '';

  constructor(private apiService: ApiService, private router: Router,private toastr: ToastrService) {}

  onSubmit() {
    const userData = {
      name: this.name,
      username: this.username,
      email: this.email,
      role: this.role,
      address: this.address,
      phonenumber: this.phonenumber,
      password: this.password
    };
  
    this.apiService.registerUser(userData).subscribe(
      response => {
       
        alert('Registration successful!l');
        this.router.navigate(['/login']); // Redirect to dashboard or desired route
      },
      error => {
        // Handle error
        console.error('Registration error:', error);
  
        if (error.status === 400) {
          this.toastr.error('Email or username is already in use.');
        } else {
          this.toastr.error('An error occurred during registration.');
        }
      }
    );
  }
}

