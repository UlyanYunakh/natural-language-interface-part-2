import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public SingIn(): Promise<any> {
    return gapi.auth2.getAuthInstance().signIn();
  }

  public SingOut(): Promise<any> {
    return gapi.auth2.getAuthInstance().signOut();
  }
}
