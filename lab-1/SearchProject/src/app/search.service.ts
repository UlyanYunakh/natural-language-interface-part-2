import {Injectable} from '@angular/core';
import {RepositoryService} from "./repository.service";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GoogleApiService} from "./google-api.service";
import {DocInfo} from "./doc-info";

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
    let cosSimArray = new Array<[string, number]>();

    for (let doc of this.repo.Docs) {
      let docWords = this.repo.WordsInDoc.get(doc.id);
      let docLength = this.repo.DocsLenghtMap.get(doc.id);

      if (docWords && docLength) {
        let cosSim = SearchService.CosineSimilarity(words, length, docWords, docLength);
        if (cosSim != 0) {
          cosSimArray.push([doc.id, cosSim]);
        }
      }
    }
    cosSimArray.sort((a, b) => b[1] - a[1]);

    let docs = new Array<DocInfo>();

    for (let item of cosSimArray) {
      let docInfo = await this.gapi.GetDocInfoById(item[0]);
      docInfo.cosSim = item[1];
      docs.push(docInfo);
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
      this.http.post<any>(environment.SERVER_URL, {Text: query}).toPromise()
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
      let wordInAllWords = this.repo.AllWords.get(word[0]);
      let wordIdf = this.repo.AllIdf.get(word[0]);
      if (wordInAllWords && wordIdf) {
        wordIdf = wordIdf * (word[1] / wordInAllWords);
        sum += Math.pow(wordIdf, 2);
      }
    }

    return Math.sqrt(sum);
  }
}
