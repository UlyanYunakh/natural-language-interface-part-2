import { Injectable } from '@angular/core';
import { DocInfo } from './doc-info';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _words = new Map<string, number>();
  private _idfs = new Map<string, number>();
  private _docWords = new Map<string, Map<string, number>>();
  private _docLenghts = new Map<string, number>();
  private _docInfo = new Map<string, DocInfo>();

  constructor() { }

  ResetRepository(): void {
    this._words = new Map<string, number>();
    this._docWords = new Map<string, Map<string, number>>();
    this._idfs = new Map<string, number>();
    this._docLenghts = new Map<string, number>();
    this._docInfo = new Map<string, DocInfo>();
  }

  AddDocInfo(docId:string, docInfo: DocInfo): void {
    this._docInfo.set(docId, docInfo);
  }

  GetDocInfoById(docId: string): DocInfo | undefined {
    return this._docInfo.get(docId);
  }

  GetDocsCount(): number {
    return this._docWords.size;
  }

  GetDocsWordsIter(): Generator<[string, Map<string, number>], boolean, void> {
    return this.DocsWordsGenerator();
  }

  private *DocsWordsGenerator(): Generator<[string, Map<string, number>], boolean, void> {
    for (let doc of this._docWords) {
      yield doc;
    }
    return true;
  }

  GetWordFrequency(word: string): number | undefined {
    return this._words.get(word);
  }

  AddWord(word: string, frequency: number): void {
    var currFrequency = this._words.get(word);

    this._words.set(word, currFrequency ? currFrequency + frequency : frequency);
  }

  GetWordsIter(): Generator<[string, number], boolean, void> {
    return this.WordsGenerator();
  }

  private *WordsGenerator(): Generator<[string, number], boolean, void> {
    for (let word of this._words) {
      yield word;
    }
    return true;
  }


  GetIdf(word: string): number | undefined {
    return this._idfs.get(word);
  }

  SetIdf(word: string, idf: number): void {
    this._idfs.set(word, idf);
  }

  GetIdfsIter(): Generator<[string, number], boolean, void> {
    return this.IdfsGenerator();
  }

  private *IdfsGenerator(): Generator<[string, number], boolean, void> {
    for (let idf of this._idfs) {
      yield idf;
    }
    return true;
  }

  SetDocLenght(docId: string, lenght: number): void {
    this._docLenghts.set(docId, lenght);
  }

  GetDocLenght(docId: string): number | undefined {
    return this._docLenghts.get(docId);
  }

  GetDocWords(docId: string): Map<string, number> | undefined {
    return this._docWords.get(docId);
  }

  AddDocWithWords(docId: string, words: Map<string, number>): void {
    this._docWords.set(docId, words);
  }
}
