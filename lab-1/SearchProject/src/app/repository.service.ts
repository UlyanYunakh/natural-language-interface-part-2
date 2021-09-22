import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _DocsList = new Array<any>();
  private _allWordsMap = new Map<string, number>();
  private _allIdfMap = new Map<string, number>();
  private _wordsInDocMap = new Map<string, Map<string, number>>();
  private _docLenghtMap = new Map<string, number>();

  public get DocsLenghtMap() {
    return this._docLenghtMap;
  }

  constructor() { }

  public get Docs() {
    return this._DocsList;
  }

  public get AllWords() {
    return this._allWordsMap;
  }

  public get AllIdf() {
    return this._allIdfMap;
  }

  public get WordsInDoc() {
    return this._wordsInDocMap;
  }

  public GetWordsInDoc(docId: string): Map<string, number> {
    var words = this._wordsInDocMap.get(docId);

    if (words) {
      return words;
    }
    else {
      return new Map<string, number>();
    }
  }

  public AddDoc(file: any): void {
    if (!this._DocsList.includes(file)) {
      this._DocsList.push(file);
    }
  }

  public AddWord(word: string, frequency: number): void {
    var currFrequency = this._allWordsMap.get(word);

    this._allWordsMap.set(word, currFrequency ? currFrequency + frequency : frequency);
  }

  public AddDocWithWords(file: any, words: Map<string, number>): void {
    this._wordsInDocMap.set(file.id, words);
  }
}
