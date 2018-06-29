import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { KnowledgeProvider } from '../providers/knowledge/knowledge';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { FullDescription } from '../pages/fulldescription/fulldescription';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FullDescription
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FullDescription
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KnowledgeProvider,
    NativePageTransitions
  ]
})
export class AppModule {}
