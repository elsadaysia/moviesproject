import { Component, OnInit} from '@angular/core';
import { MovieService } from '../movie.service'
import { ApiService } from '../api.service'

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies: any[] = [];
  userToken: string | null = null; // Define the type explicitly

  constructor(
    private movieService: MovieService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Retrieve the token from localStorage
    this.userToken = localStorage.getItem('accessToken');
    
    console.log('tokenInMovie', this.userToken)

    if (!this.userToken) {
      // Handle the case where the token is not available (e.g., user is not logged in)
      console.error('User is not authenticated.');
      return;
    }

    // Use the retrieved token to fetch movies
    this.movieService.getMovies(this.userToken).subscribe(
      (data) => {
        this.movies = data;
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized: Please log in again.');
          // Handle unauthorized access here (e.g., redirect to login page)
        } else {
          console.error('An error occurred while fetching movies:', error);
          // Handle other errors here
        }
      }
    );
  }
}
