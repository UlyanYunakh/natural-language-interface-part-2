import { Component } from '@angular/core';
import { AnalyzeService } from '../analyze.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  processing: boolean = false;

  constructor(
    private analyze: AnalyzeService
  ) { }

  AnalyzeFiles(): void {
    this.processing = true;

    let fileInput = <HTMLInputElement>document.querySelector("#files");
    let fileList = fileInput.files;

    if (!fileList) {
      this.processing = false;
      return;
    }

    Promise.all(Array.from(fileList).map((file): Promise<any> => {
      return this.analyze.File(file);
    })).then((results) => {
      // something with result
      this.processing = false;
    });
  }
}
