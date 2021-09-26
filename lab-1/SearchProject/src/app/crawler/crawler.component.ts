import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { СrawlerService } from '../crawler.service';

@Component({
  selector: 'app-loading',
  templateUrl: './crawler.component.html'
})
export class CrawlerComponent implements OnInit {
  public message = "";
  public loading = 0;

  constructor(
    private crawler: СrawlerService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    var iter = this.crawler.GetCrawlerIterator();

    var currMessage = await iter.next();
    while (!currMessage.done) {
      this.message = currMessage.value[0];
      this.loading = currMessage.value[1];

      currMessage = await iter.next();
    }
    
    setTimeout(() => {
      this.router.navigate(["main"]);
    }, 1000);
  }
}
