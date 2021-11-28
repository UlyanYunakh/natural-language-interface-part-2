import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(
    private http: HttpClient
  ) { }

  async File(files: FileList): Promise<any> {
    let filesNames = Array.from(files).map(file => {
      return file.name;
    })
    
    return new Promise(resolve => {
      this.http.post<any>(environment.SERVER_URL, {files: filesNames}).toPromise().then((responce: any) => {
        resolve(responce);
      });
    });
  }
}
