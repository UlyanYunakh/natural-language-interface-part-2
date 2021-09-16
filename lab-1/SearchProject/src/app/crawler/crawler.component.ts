import { Component, OnInit } from '@angular/core';
import { СrawlerService } from '../crawler.service';

@Component({
  selector: 'app-loading',
  templateUrl: './crawler.component.html'
})
export class CrawlerComponent implements OnInit {

  constructor(private harvester: СrawlerService) { }

  ngOnInit(): void {
    this.harvester.GetFiles().then(() => {
      var currFileNumber = this.harvester.FileIterator?.next();
      while (!currFileNumber?.done) {
        console.log(currFileNumber?.value);
        currFileNumber = this.harvester.FileIterator?.next();
      }
    });
  }

}
