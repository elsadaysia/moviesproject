import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service'; 
import { MovieService } from '../movie.service'
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movieId: string | null = null; // Initialize movieId as null or with a default value

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
  }

  bookmarkMovie() {
    const token = this.apiService.getToken(); // Assuming you have a method to get the JWT token
  
    if (!token) {
      // Handle unauthorized access, e.g., redirect to login
      this.router.navigate(['/login']);
      return;
    }
  
    // if (this.movieId) {
    //   this.movieService.bookmarkMovie(this.movieId, token).subscribe(
    //     (response: any) => { // Explicitly type the response as 'any'
    //       console.log('Movie bookmarked successfully!', response);
    //       // Handle success, e.g., show a success message
    //       this.router.navigate(['/movies']); // Redirect to /movies on success
    //     },
    //     (error: any) => { // Explicitly type the error as 'any'
    //       console.error('Error bookmarking movie:', error);
    //       // Handle error, e.g., show an error message
    //     }
    //   );
    // }
  }
}  