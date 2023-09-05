import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
})
export class MovieFormComponent {
  title = '';
  synopsis=''; 
  trailerurl=''; 
  imgurl=''; 
  rating=''; 
  status =''; 

  constructor(private apiService: ApiService, private router: Router) {}

  addMovie() {
    const movieData = {
      title: this.title,
      synopsis: this.synopsis,
      trailerurl: this.trailerurl,
      imgurl: this.imgurl,
      rating: this.rating,
      status : this.status,
    };

    this.apiService.addMovie(movieData).subscribe(
      (response) => {
        console.log('Movie added successfully!', response);
        // Navigate to the /movies route
        this.router.navigate(['/movies']);
      },
      (error) => {
        console.error('Error adding movie:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
}
