import { Component, OnInit } from '@angular/core';
import { СrawlerService } from '../crawler.service';

@Component({
  selector: 'app-loading',
  templateUrl: './crawler.component.html'
})
export class CrawlerComponent implements OnInit {

  constructor(private harvester: СrawlerService) { }

  ngOnInit(): void {
    this.harvester.GetFiles().then(async() => {
      var currFileNumber = await this.harvester.FileReadIterator?.next();
      while (!currFileNumber?.done) {
        console.log(currFileNumber?.value);
        currFileNumber = await this.harvester.FileReadIterator?.next();
      }
    });
  }
}
