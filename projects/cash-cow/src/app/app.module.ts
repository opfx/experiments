import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RuntimeModule } from '@webkinz/runtime';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, RuntimeModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
