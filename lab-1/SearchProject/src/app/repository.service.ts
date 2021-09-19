import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _filesList = new Array<any>();
  private _allWordsMap = new Map<string, number>();
  private _wordsInFileMap = new Map<string, Map<string, number>>();
  private _filesLenghtMap = new Map<string, number>();

  public get FilesLenghtMap() {
    return this._filesLenghtMap;
  }

  constructor() { }

  public get Files() {
    return this._filesList;
  }

  public get AllWords() {
    return this._allWordsMap;
  }

  public get WordsInFile() {
    return this._wordsInFileMap;
  }

  public GetWordsInFile(fileId: string): Map<string, number> {
    var words = this._wordsInFileMap.get(fileId);

    if (words) {
      return words;
    }
    else {
      return new Map<string, number>();
    }
  }

  public AddFile(file: any): void {
    if (!this._filesList.includes(file)) {
      this._filesList.push(file);
    }
  }

  public AddWord(word: string, frequency: number): void {
    var currFrequency = this._allWordsMap.get(word);

    this._allWordsMap.set(word, currFrequency ? currFrequency + frequency : frequency);
  }

  public AddFileWithWords(file: any, words: Map<string, number>): void {
    this._wordsInFileMap.set(file.id, words);
  }
}
