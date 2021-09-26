import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocInfo } from "./doc-info";

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

  GetDocsId(): Promise<Array<string>> {
    return new Promise(async resolve => {
      let ids = new Array<string>();
      resolve(await this.GetFirstPageWithDocs(ids));
    });
  }

  GetDocContentById(docId: string): Promise<string> {
    return new Promise(resolve => {
      gapi.client.drive.files.export({
        fileId: docId,
        mimeType: 'text/plain'
      }).then((response: any) => {
        resolve(response.body);
      });
    });
  }

  private GetFirstPageWithDocs(ids: Array<string>): Promise<Array<string>> {
    return new Promise(resolve => {
      gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
        pageSize: "100",
        fields: "nextPageToken, files(id)"
      }).then(async (response: any) => {
        resolve(this.HandleResponce(response, ids));
      });
    });
  }

  private GetNextPageWithDocs(token: any, ids: Array<string>): Promise<Array<string>> {
    return new Promise(async resolve => {
      gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
        pageSize: "100",
        fields: "nextPageToken, files(id)",
        pageToken: token
      }).then((response: any) => {
        resolve(this.HandleResponce(response, ids));
      });
    });
  }

  private HandleResponce(response: any, ids: Array<string>): Promise<Array<string>> {
    return new Promise(async resolve => {
      var docs = response.result.files;
      if (docs && docs.length > 0) {
        for (var i = 0; i < docs.length; i++) {
          ids.push(docs[i].id);
        }
        if (response.result.nextPageToken) {
          resolve(this.GetNextPageWithDocs(response.result.nextPageToken, ids));
        }
      }
      resolve(ids)
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
