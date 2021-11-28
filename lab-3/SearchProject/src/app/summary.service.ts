import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
    private http: HttpClient
  ) { }

  async Files(files: FileList): Promise<any> {
    let filePromises: Promise<any>[] = [];
    let data: any[] = [];

    Array.from(files).forEach((file) => {
      let name = file.name;

      let lang = "";
      if (name.includes("eng")){
        lang = "english";
      }
      else if (name.includes("fr")) {
        lang = "french";
      }
      
      if (lang != "") {
        filePromises.push(new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            resolve({
              name: name,
              lang: lang,
              data: reader.result
            });
          }
        }));
      }
    });

    await Promise.all(filePromises).then(result => {
      console.log(result)
      data = result;
    });
    
    return new Promise(resolve => {
      console.log(data);
      this.http.post<any>(environment.SERVER_URL, {files: data}).toPromise().then((responce: any) => {
        resolve(responce);
      });
    });
  }
}
