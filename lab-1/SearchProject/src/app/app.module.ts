import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleApiService } from './google-api.service';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { CrawlerComponent } from './crawler/crawler.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    CrawlerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [GoogleApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
