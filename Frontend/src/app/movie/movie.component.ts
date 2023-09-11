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
  userToken: string | null = null; 

  constructor(
    private movieService: MovieService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.userToken = localStorage.getItem('accessToken');
    console.log('tokenInMovie', this.userToken)

    if (!this.userToken) {
      console.error('User is not authenticated.');
      return;
    }

    this.movieService.getMovies(this.userToken).subscribe(
      (data) => {
        this.movies = data;
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized: Please log in again.');
        } else {
          console.error('An error occurred while fetching movies:', error);
        }
      }
    );
  }
}
