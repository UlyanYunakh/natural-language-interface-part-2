import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {

  constructor() { } 

  public GetFilesNames() {
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function (response: any) {
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file.name + ' (' + file.id + ')');
        }
      } else {
        console.log('No files found.');
      }
    });
  }
}
