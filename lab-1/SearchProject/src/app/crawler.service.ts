import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { RepositoryService } from './repository.service';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  public FileReadIterator = this.ReadGeneratorFunction();
  public WordsIdfIterator = this.IdfGeneratorFunction();
  public FilesLenghtIterator = this.LenghtGeneratorFunction();

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

  private async *LenghtGeneratorFunction(): AsyncGenerator<number, boolean, void> {
    var number = 0;

    for (var file of this.repo.Files) {
      await this.CalculateLenght(file);

      yield number;

      number++;
    }

    return true;
  }

  private CalculateLenght(file: any): Promise<boolean> {
    return new Promise(resolve => {
      var words = this.repo.GetWordsInFile(file.id);
      var sum = 0;

      for (var word of words) {
        sum += Math.pow(this.repo.AllWords.get(word[0])!, 2);
      }

      var lenght = Math.sqrt(sum);
      this.repo.FilesLenghtMap.set(file.id, lenght);

      resolve(true);
    });
  }

  private async *IdfGeneratorFunction(): AsyncGenerator<number, boolean, void> {
    var number = 0;

    for (var word of this.repo.AllWords) {
      await this.CalculateIdf(word);

      yield number;

      number++;
    }

    return true;
  }

  private CalculateIdf(currWord: [string, number]): Promise<boolean> {
    return new Promise(resolve => {
      var wordFrequencyInAllFiles = 0;

      for (var file of this.repo.Files) {
        var fileWords = this.repo.GetWordsInFile(file.id);
        for (var word of fileWords) {
          if (word[0] == currWord[0]) {
            wordFrequencyInAllFiles++;
            break;
          }
        }
      }

      var idf = Math.log(this.repo.Files.length / wordFrequencyInAllFiles) / Math.log(2);
      this.repo.AllWords.set(currWord[0], idf);

      resolve(true);
    });
  }

  private async *ReadGeneratorFunction(): AsyncGenerator<number, boolean, void> {
    var number = 0;

    for (var file of this.repo.Files) {
      await this.ReadFile(file);

      yield number;

      number++;
    }

    return true;
  }

  private ReadFile(file: any): Promise<boolean> {
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
