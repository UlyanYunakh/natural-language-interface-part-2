import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _filesList = new Array<any>();
  private _allWordsMap = new Map<string, number>();
  private _wordsInFileMap = new Map<string, Map<string, number>>();

  constructor() { }

  public get FilesCount() {
    return this._filesList.length;
  }

  public AddFile(file: any): void {
    if (!this._filesList.includes(file)) {
      this._filesList.push(file);
    }
  }

  public GetFile(index: number): any {
    return this._filesList[index];
  }

  public AddWord(word: string, frequency: number): void {
    var currFrequency = this._allWordsMap.get(word);

    this._allWordsMap.set(word, currFrequency ? currFrequency + frequency : frequency);
  }

  public AddFileWithWords(file: any, words: Map<string, number>): void {
    this._wordsInFileMap.set(file.id, words);
  }
}
