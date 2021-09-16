import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  private filesList: Array<any> | undefined;

  constructor() { }

  public GetFiles() {
    this.GetFilesFirstPage().then(() => {
      this.filesList!.forEach(element => {
        console.log(element.name);
      });
    });
  }

  private GetFilesFirstPage(): Promise<any> {
    this.filesList = new Array();

    return gapi.client.drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
      pageSize: "100",
      fields: "nextPageToken, files(id, name)"
    }).then((response: any) => {
      return this.HandleResponce(response, "");
    });
  }

  private GetFilesNextPage(token: any): Promise<any> {
    return gapi.client.drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
      pageSize: "100",
      fields: "nextPageToken, files(id, name)",
      pageToken: token
    }).then((response: any) => {
      return this.HandleResponce(response, token);
    });
  }

  private HandleResponce(response: any, token: any): Promise<any> {
    var files = response.result.files;
    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        this.filesList!.push(files[i]);
      }
      if (response.result.nextPageToken) {
        return this.GetFilesNextPage(response.result.nextPageToken);
      }
    }
    return new Promise((resolve) => {
      resolve(true)
    });
  }
}
