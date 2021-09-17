import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  public FileReadIterator: AsyncGenerator<number, boolean, void> | undefined;
  private filesList: Array<any> | undefined;
  private allWordsMap = new Map<string, number>();
  private wordsInFileMap = new Map<string, Map<string, number>>();

  constructor(private http: HttpClient) { }

  public GetFiles(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.GetFilesFirstPage();

      this.FileReadIterator = this.ReadGeneratorFunction();

      resolve(true);
    });
  }

  private async *ReadGeneratorFunction(): AsyncGenerator<number, boolean, void> {
    for (var i = 0; i < this.filesList!.length; i++) {
      await this.ReadFile(this.filesList![i].id);
      yield i;
    }
    console.log(this.allWordsMap);
    console.log(this.wordsInFileMap);
    return true;
  }

  public ReadFile(fileId: any): Promise<boolean> {
    return new Promise(resolve => {
      gapi.client.drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain'
      }).then((response: any) => {
        return this.http.post<any>(environment.SERVER_URL, { Text: response.body }).toPromise();
      }).then((response: any) => {
        var wordInFile = new Map<string, number>();

        for (var item of response) {
          var currNumber = this.allWordsMap.get(item.Word);

          this.allWordsMap.set(item.Word, currNumber ? currNumber + item.Frequency : item.Frequency);
          wordInFile.set(item.Word, item.Frequency);
        }

        this.wordsInFileMap.set(fileId, wordInFile);
        
        resolve(true);
      });
    });
  }

  private GetFilesFirstPage(): Promise<boolean> {
    return new Promise(resolve => {
      this.filesList = new Array();

      gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
        pageSize: "100",
        fields: "nextPageToken, files(id, name)"
      }).then(async (response: any) => {
        resolve(this.HandleResponce(response));
      });
    });
  }

  private GetFilesNextPage(token: any): Promise<boolean> {
    return new Promise(async resolve => {
      gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners",
        pageSize: "100",
        fields: "nextPageToken, files(id, name)",
        pageToken: token
      }).then((response: any) => {
        resolve(this.HandleResponce(response));
      });
    });
  }

  private HandleResponce(response: any): Promise<boolean> {
    return new Promise(async resolve => {
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          this.filesList!.push(files[i]);
        }
        if (response.result.nextPageToken) {
          resolve(this.GetFilesNextPage(response.result.nextPageToken));
        }
      }
      resolve(true)
    });
  }
}
