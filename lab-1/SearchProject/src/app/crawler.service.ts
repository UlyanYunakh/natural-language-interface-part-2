import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  public FileIterator: Generator | undefined;
  private filesList: Array<any> | undefined;

  constructor() { }

  public GetFiles(): Promise<any> {
    return this.GetFilesFirstPage().then(() => {
      this.FileIterator = this.GeneratorFunction();
      return new Promise((resolve) => {
        resolve(true);
      });
    });
  }

  private *GeneratorFunction() {
    for (var i = 0; i < this.filesList!.length; i++) {
      yield i;
    }
  }

  // public H() {
  //   gapi.client.drive.files.export({
  //     fileId: "element.id",
  //     mimeType: 'text/plain'
  //   }).then((response: any) => {

  //   })
  // }

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
