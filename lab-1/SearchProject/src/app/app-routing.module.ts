import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CrawlerComponent } from './crawler/crawler.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'singIn', component: AuthComponent },
  { path: 'crawler', component: CrawlerComponent },

  { path: '**', redirectTo: 'singIn' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
