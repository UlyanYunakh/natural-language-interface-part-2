import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleApiService } from './google-api.service';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { CrawlerComponent } from './crawler/crawler.component';
import { HttpClientModule } from '@angular/common/http';
import { AppInfoComponent } from './app-info/app-info.component';
import { DocInfoComponent } from './doc-info/doc-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    CrawlerComponent,
    AppInfoComponent,
    DocInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [GoogleApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
