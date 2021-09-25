import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DocInfo } from '../doc-info';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  queryControl = new FormControl('');
  docs = new Array<DocInfo>();
  isSearching = false;

  time: number = 0;
  private interval: any;

  constructor(
    private search: SearchService
  ) { }

  async FindDocs(): Promise<void> {
    this.isSearching = true;

    this.startTimer();
    let query = this.queryControl.value;
    this.docs = await this.search.FindDocs(query);
    this.pauseTimer();

    this.isSearching = false;
  }

  private startTimer() {
    this.time = 0;
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time += 0.1;
      } else {
        this.time += 0.1;
      }
    }, 100);
  }

  private pauseTimer() {
    clearInterval(this.interval);
  }

}
