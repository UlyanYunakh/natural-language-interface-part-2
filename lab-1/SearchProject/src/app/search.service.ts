import { Injectable } from '@angular/core';
import { RepositoryService } from "./repository.service";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GoogleApiService } from "./google-api.service";
import { DocInfo } from "./doc-info";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient,
    private repo: RepositoryService,
    private gapi: GoogleApiService
  ) {
  }

  async FindDocs(query: string): Promise<Array<DocInfo>> {
    let words = await this.GetWordsFromQuery(query);
    let length = this.CalculateLength(words);

    if (length == 0) {
      return new Promise(resolve => {
        resolve(new Array<DocInfo>());
      });
    }

    let cosSimArray = new Array<[string, number]>();

    let iter = this.repo.GetDocsWordsIter();
    let iterResult = iter.next();
    while (!iterResult.done) {
      let doc = iterResult.value;
      let docWords = this.repo.GetDocWords(doc[0]);
      let docLength = this.repo.GetDocLenght(doc[0]);

      if (docWords && docLength) {
        let cosSim = SearchService.CosineSimilarity(words, length, docWords, docLength);
        if (cosSim != 0) {
          cosSimArray.push([doc[0], cosSim]);
        }
      }
      iterResult = iter.next();
    }

    cosSimArray.sort((a, b) => b[1] - a[1]);

    let docs = new Array<DocInfo>();

    for (let item of cosSimArray) {
      let docInfo = await this.repo.GetDocInfoById(item[0]);
      if (docInfo) {
        docInfo.cosSim = item[1];
        docs.push(docInfo);
      }
    }

    return new Promise(resolve => {
      resolve(docs);
    });
  }

  private static CosineSimilarity(
    words: Map<string, number>,
    lenght: number,
    docWords: Map<string, number>,
    docLenght: number
  ): number {
    let sum = 0;

    for (let word of words) {
      let wordInDoc = docWords.get(word[0]);
      if (wordInDoc) {
        sum += word[1] * wordInDoc;
      }
    }

    return sum / (lenght * docLenght);
  }

  private GetWordsFromQuery(query: string): Promise<Map<string, number>> {
    return new Promise<Map<string, number>>(resolve => {
      this.http.post<any>(environment.SERVER_URL, { Text: query }).toPromise()
        .then((response: any) => {
          var words = new Map<string, number>();

          for (var item of response) {
            words.set(item.Word, item.Frequency);
          }

          resolve(words);
        });
    });
  }

  private CalculateLength(words: Map<string, number>): number {
    let sum = 0;

    for (let word of words) {
      let wordFrequency = this.repo.GetWordFrequency(word[0]);
      let wordIdf = this.repo.GetIdf(word[0]);
      if (wordFrequency && wordIdf) {
        wordIdf = wordIdf * (word[1] / wordFrequency);
        sum += Math.pow(wordIdf, 2);
      }
    }

    return Math.sqrt(sum);
  }
}
