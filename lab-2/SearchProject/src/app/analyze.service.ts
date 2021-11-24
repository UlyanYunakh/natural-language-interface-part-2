import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(
    private http: HttpClient
  ) { }

  async File(file: File): Promise<any> {
    console.log(file);
    
    // return new Promise(resolve => {
    //   let result = this.http.post(environment.SERVER_URL, file).toPromise();
    //   result.then(function (responce: any) {
    //     resolve("something");
    //   });
    // });
  }
}
