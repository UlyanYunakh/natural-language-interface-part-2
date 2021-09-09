import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  SingIn() {
    this.auth.SingIn().then(() => {
      this.router.navigate(["main"]);
    });
  }
}
