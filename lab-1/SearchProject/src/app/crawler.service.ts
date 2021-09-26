import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { RepositoryService } from './repository.service';
import { GoogleApiService } from './google-api.service';

@Injectable({
  providedIn: 'root'
})
export class СrawlerService {

  constructor(
    private http: HttpClient,
    private repo: RepositoryService,
    private gapi: GoogleApiService
  ) { }

  GetCrawlerIterator(): AsyncGenerator<[string, number], void, void> {
    return this.Start();
  }

  private async *Start(): AsyncGenerator<[string, number], void, void> {
    var loadingPoints = 0;
    this.repo.ResetRepository();

    yield ["Getting docs from Google Drive...", loadingPoints];
    await this.GetDocsId();
    var docsCount = this.repo.GetDocsCount();

    yield [`Preparing docs (0/${docsCount})`, loadingPoints];
    var number = 1;
    var point = 100 / docsCount;

    let iter = this.repo.GetDocsWordsIter();
    let iterResult = iter.next();
    while (!iterResult.done) {
      let doc = iterResult.value;
      await this.ReadDoc(doc[0]);
      yield [`Preparing docs (${number}/${docsCount})`, loadingPoints += point];
      number++;
      iterResult = iter.next();
    }

    yield ['Finishing', 100]
    await this.CalculateAllIdfs();
    await this.CalculateAllLenghts();
    await this.GetDocsInfo();
  }

  private async GetDocsId(): Promise<void> {
    let ids = await this.gapi.GetDocsId();
    for (let id of ids) {
      this.repo.AddDocWithWords(id, new Map<string, number>());
    }
  }

  private CalculateAllIdfs(): Promise<void> {
    let iter = this.repo.GetWordsIter();
    let iterResult = iter.next();
    while (!iterResult.done) {
      let word = iterResult.value;
      this.CalculateWordIdf(word);
      iterResult = iter.next();
    }

    return new Promise(resolve => {
      resolve();
    })
  }

  private CalculateWordIdf(word: [string, number]): void {
    var wordFrequencyInAllDocs = 0;

    let iter = this.repo.GetDocsWordsIter();
    let iterResult = iter.next();
    while (!iterResult.done) {
      let doc = iterResult.value;
      for (var docWord of doc[1]) {
        if (docWord[0] == word[0]) {
          wordFrequencyInAllDocs++;
          break;
        }
      }
      iterResult = iter.next();
    }

    let docsCount = this.repo.GetDocsCount();
    var idf = Math.log(docsCount / wordFrequencyInAllDocs) / Math.log(2);
    this.repo.SetIdf(word[0], idf);
  }

  private CalculateAllLenghts(): Promise<void> {
    let iter = this.repo.GetDocsWordsIter();
    let iterResult = iter.next();
    while (!iterResult.done) {
      let doc = iterResult.value;
      this.CalculateDocLenght(doc);
      iterResult = iter.next();
    }

    return new Promise(resolve => {
      resolve();
    })
  }

  private CalculateDocLenght(doc: [string, Map<string, number>]): void {
    var sum = 0;
    for (var docWord of doc[1]) {
      let frequency = this.repo.GetWordFrequency(docWord[0]);
      if (frequency) {
        sum += Math.pow(frequency, 2);
      }
    }
    var lenght = Math.sqrt(sum);
    this.repo.SetDocLenght(doc[0], lenght);
  }

  private ReadDoc(docId: string): Promise<boolean> {
    return new Promise(async resolve => {
      let content = await this.gapi.GetDocContentById(docId);

      this.http.post<any>(environment.SERVER_URL, { Text: content }).toPromise().then((response: any) => {
        var words = new Map<string, number>();

        for (var item of response) {
          this.repo.AddWord(item.Word, item.Frequency);
          words.set(item.Word, item.Frequency);
        }

        this.repo.AddDocWithWords(docId, words);

        resolve(true);
      });
    });
  }

  private GetDocsInfo(): Promise<void> {
    return new Promise(async resolve => {
      let iter = this.repo.GetDocsWordsIter();
      let iterResult = iter.next();
      while (!iterResult.done) {
        let doc = iterResult.value;
        let docInfo = await this.gapi.GetDocInfoById(doc[0]);
        this.repo.AddDocInfo(doc[0], docInfo);
        iterResult = iter.next();
      }
      resolve();
    });
  }
}
