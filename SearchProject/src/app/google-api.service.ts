import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  constructor() {
    gapi.load("client:auth2", this.InitClient());
  }

  private InitClient() {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: environment.GAPI_API_KEY,
        clientId: environment.GAPI_CLIENT_ID,
        discoveryDocs: environment.GAPI_DRIVE_DISCOVERY_DOCS,
        scope: environment.GAPI_DRIVE_SCOPES
      })
    });
  }
}
