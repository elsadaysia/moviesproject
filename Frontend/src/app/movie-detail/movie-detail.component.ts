// movie-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service'; 
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movieId: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  movieTitle: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');

    if (this.movieId) {
      this.movieService.getMovieTitle(this.movieId).subscribe(
        (title: string) => {
          this.movieTitle = title;
        },
        (error: any) => {
          console.error('Error fetching movie title:', error);
        }
      );
    }
  }

  bookmarkMovie() {
    const token = this.apiService.getToken();
  
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    if (this.movieId) {
      // Call the /bookmark/:movieId route to bookmark the movie
      this.apiService.bookmarkMovie(this.movieId, token).subscribe(
        (response: any) => {
          console.log('Movie bookmarked successfully!', response);
          this.successMessage = 'Movie bookmarked successfully!';
          // Optionally, you can clear the success message after a certain time.
          setTimeout(() => {
            this.successMessage = null;
          }, 5000); // Clear the message after 5 seconds (adjust the time as needed)
        },
        (error: any) => {
          console.error('Error bookmarking movie:', error);
          this.errorMessage = 'Error bookmarking movie. Please try again.';
        }
      );
    }
  }
}