import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { RepositoryService } from './repository.service';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {
  constructor(
    private http: HttpClient,
    private repo: RepositoryService
  ) { }

  public GetCrawlerIterator(): AsyncGenerator<[string, number], boolean, void> {
    return this.Start();
  }

  private async *Start(): AsyncGenerator<[string, number], boolean, void> {
    var loadingPoints = 0;

    yield ["Getting docs from Google Drive...", loadingPoints];
    await this.GetDocs();
    var docsCount = this.repo.Docs.length;


    yield [`Preparing docs (0/${docsCount})`, loadingPoints];
    var number = 1;
    var point = 100 / docsCount;
    for (var doc of this.repo.Docs) {
      await this.ReadDoc(doc);
      yield [`Preparing docs (${number}/${docsCount})`, loadingPoints += point];
      number++;
    }

    for (var word of this.repo.AllWords) {
      await this.CalculateWordIdf(word);
    }

    for (var doc of this.repo.Docs) {
      await this.CalculateDocLenght(doc);
    }

    return true;
  }

  private GetDocs(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.GetFirstPageWithDocs();
      resolve(true);
    });
  }

  private CalculateDocLenght(doc: any): Promise<boolean> {
    return new Promise(resolve => {
      var words = this.repo.GetWordsInDoc(doc.id);
      var sum = 0;

      for (var word of words) {
        sum += Math.pow(this.repo.AllWords.get(word[0])!, 2);
      }

      var lenght = Math.sqrt(sum);
      this.repo.DocsLenghtMap.set(doc.id, lenght);

      resolve(true);
    });
  }

  private CalculateWordIdf(currWord: [string, number]): Promise<boolean> {
    return new Promise(resolve => {
      var wordFrequencyInAllDocs = 0;

      for (var doc of this.repo.Docs) {
        var fileWords = this.repo.GetWordsInDoc(doc.id);
        for (var word of fileWords) {
          if (word[0] == currWord[0]) {
            wordFrequencyInAllDocs++;
            break;
          }
        }
      }

      var idf = Math.log(this.repo.Docs.length / wordFrequencyInAllDocs) / Math.log(2);
      this.repo.AllWords.set(currWord[0], idf);

      resolve(true);
    });
  }

  private ReadDoc(doc: any): Promise<boolean> {
    return new Promise(resolve => {
      gapi.client.drive.files.export({
        fileId: doc.id,
        mimeType: 'text/plain'
      }).then((response: any) => {
        return this.http.post<any>(environment.SERVER_URL, { Text: response.body }).toPromise();
      }).then((response: any) => {
        var words = new Map<string, number>();

        for (var item of response) {
          this.repo.AddWord(item.Word, item.Frequency);
          words.set(item.Word, item.Frequency);
        }

        this.repo.AddDocWithWords(doc, words);

        resolve(true);
      });
    });
  }

  private GetFirstPageWithDocs(): Promise<boolean> {
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

  private GetNextPageWithDocs(token: any): Promise<boolean> {
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
      var docs = response.result.files;
      if (docs && docs.length > 0) {
        for (var i = 0; i < docs.length; i++) {
          this.repo.AddDoc(docs[i]);
        }
        if (response.result.nextPageToken) {
          resolve(this.GetNextPageWithDocs(response.result.nextPageToken));
        }
      }
      resolve(true)
    });
  }
}
