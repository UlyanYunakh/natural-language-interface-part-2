import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from './google-api.service';
import { filter } from 'rxjs/operators'
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private api: GoogleApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          this.router.navigate(["singIn"])
        }
      })
  }
}
