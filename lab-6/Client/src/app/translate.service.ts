import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(
    private http: HttpClient
  ) { }

  async text(text: string, langTo: string, lengFrom: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post<any>(environment.SERVER_URL, {
        "endpoint": 1,
        "data": {
          "langTo": langTo,
          "langFrom": lengFrom,
          "text": text
        }
      }).toPromise().then((responce: any) => {
        resolve(responce);
      });
    });
  }

  async words(text: string, langTo: string, lengFrom: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post<any>(environment.SERVER_URL, {
        "endpoint": 2,
        "data": {
          "langTo": langTo,
          "langFrom": lengFrom,
          "text": text
        }
      }).toPromise().then((responce: any) => {
        resolve(responce);
      });
    });
  }

  async trees(text: string, langTo: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post<any>(environment.SERVER_URL, {
        "endpoint": 3,
        "data": {
          "langTo": langTo,
          "text": text
        }
      }).toPromise().then((responce: any) => {
        resolve(responce);
      });
    });
  }
}
