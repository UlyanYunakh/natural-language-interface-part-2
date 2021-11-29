import { Component } from '@angular/core';
import { SummaryService } from '../summary.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  processing: boolean = false;
  result: string = "";

  constructor(
    private summary: SummaryService
  ) { }

  async SummarizeFiles(): Promise<void> {
    this.processing = true;

    let fileInput = <HTMLInputElement>document.querySelector("#files");
    let fileList = fileInput.files;

    if (!fileList) {
      this.processing = false;
      return;
    }

    await this.summary.Files(fileList).then((result) => {
      this.result += "\n" + result;
      this.processing = false;
    });
  }

  ClearLog(): void {
    this.result = "";
  }
}
