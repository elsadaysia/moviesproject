import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; //  backend API URL

  constructor(private http: HttpClient,) {}

  getToken(): string | null {
    // Implement the logic to retrieve the JWT token here.
    // This could involve accessing a stored token in local storage, a cookie, or wherever your token is stored.
    // Return the token if available, or null if not authenticated.
    // For example, if your token is stored in localStorage:
    return localStorage.getItem('jwtToken');
    // console.log(localStorage)
  }

  getPosts() {
    return this.http.get(`${this.apiUrl}/movies`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle 401 Unauthorized error
            console.error('Unauthorized:', error);
            // You can redirect to the login page or show a message to the user
          } else {
            // Handle other errors
            console.error('An error occurred:', error);
          }
          return throwError(error);
        })
      );
  }
  
  registerUser(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Observable error:', error);
        throw error;
      })
    )
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, credentials);
  }


  addMovie(movieData: any) {
    return this.http.post(`${this.apiUrl}/addmovie`, movieData);
  }

  bookmarkMovie(movieId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.post<any>(
      `${this.apiUrl}/bookmark/${movieId}`,
      {},
      { headers }
    );
  }
}
