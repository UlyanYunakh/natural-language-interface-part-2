import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {DocInfo} from "./doc-info";

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  constructor() {
    this.InitClient();
  }

  GetDocInfoById(docId: string): Promise<DocInfo> {
    return new Promise<DocInfo>(resolve => {
      gapi.client.drive.files.get({
        fileId: docId,
        fields: 'name,webViewLink,modifiedTime,iconLink'
      }).then((response: any) => {
        resolve({
          webViewLink: response.result.webViewLink,
          name: response.result.name,
          iconLink: response.result.iconLink,
          modifiedTime: response.result.modifiedTime,
          cosSim: 0
        });
      });
    });
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
