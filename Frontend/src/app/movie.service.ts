import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }
  getMovies(token: string): Observable<any> {

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin":"*",
      'Token': `${token}` ,
    });
    const options = { headers };
    console.log('tokenFromMovie', headers)
    return this.http.get(`${this.apiUrl}/movies`, options);
  }

  addMovie(movieData: any) {
    return this.http.post(`${this.apiUrl}/addmovie`, movieData);
  }

  getMovieTitle(movieId: string): Observable<string> {
    // Define the API endpoint for fetching the movie title by movieId
    const url = `${this.apiUrl}/movies/${movieId}/title`;

    // Send an HTTP GET request to the endpoint
    return this.http.get<string>(url);
  }
}
