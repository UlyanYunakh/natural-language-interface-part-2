import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { RepositoryService } from './repository.service';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  public FileReadIterator: AsyncGenerator<number, boolean, void> | undefined;

  constructor(
    private http: HttpClient,
    private repo: RepositoryService
  ) { }

  public GetFiles(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.GetFilesFirstPage();

      this.FileReadIterator = this.ReadGeneratorFunction();

      resolve(true);
    });
  }

  private async *ReadGeneratorFunction(): AsyncGenerator<number, boolean, void> {
    for (var i = 0; i < this.repo.FilesCount; i++) {
      await this.ReadFile(this.repo.GetFile(i));
      yield i;
    }

    return true;
  }

  public ReadFile(file: any): Promise<boolean> {
    return new Promise(resolve => {
      gapi.client.drive.files.export({
        fileId: file.id,
        mimeType: 'text/plain'
      }).then((response: any) => {
        return this.http.post<any>(environment.SERVER_URL, { Text: response.body }).toPromise();
      }).then((response: any) => {
        var words = new Map<string, number>();

        for (var item of response) {
          this.repo.AddWord(item.Word, item.Frequency);
          words.set(item.Word, item.Frequency);
        }

        this.repo.AddFileWithWords(file, words);

        resolve(true);
      });
    });
  }

  private GetFilesFirstPage(): Promise<boolean> {
    return new Promise(resolve => {
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
          this.repo.AddFile(files[i]);
        }
        if (response.result.nextPageToken) {
          resolve(this.GetFilesNextPage(response.result.nextPageToken));
        }
      }
      resolve(true)
    });
  }
}
