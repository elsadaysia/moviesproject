import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies'; 

  constructor(private http: HttpClient) { }

  getMovies(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('token', headers)
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addMovie(movieData: any) {
    return this.http.post(`${this.apiUrl}/addmovie`, movieData);
  }
}
