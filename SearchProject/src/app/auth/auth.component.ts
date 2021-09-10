import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  SingIn() {
    this.auth.SingIn().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(["crawler"])
      });
    });
  }
}
