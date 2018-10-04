import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { SectorsIndexPage } from '../pages/sectors-index/sectors-index';
import { SectorsShowPage } from '../pages/sectors-show/sectors-show';
import { SectorsShowTabInfoPage } from '../pages/sectors-show-tab-info/sectors-show-tab-info';
import { SectorsShowTabMapPage } from '../pages/sectors-show-tab-map/sectors-show-tab-map';
import { SectorsShowTabTopoImagesPage } from '../pages/sectors-show-tab-topo-images/sectors-show-tab-topo-images';
import { TopoImagesShowPage } from '../pages/topo-images-show/topo-images-show';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions/terms-and-conditions';
import { MisionVisionValuesPage } from '../pages/mision-vision-values/mision-vision-values';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SectorProvider } from '../providers/sector/sector';
import { StringHelper } from '../helpers/string-helper';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { HttpClientModule } from '@angular/common/http';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Network } from '@ionic-native/network';
import { GoogleMaps } from "@ionic-native/google-maps";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactPage,
    SectorsIndexPage,
    SectorsShowPage,
    SectorsShowTabInfoPage,
    SectorsShowTabMapPage,
    SectorsShowTabTopoImagesPage,
    TopoImagesShowPage,
    TermsAndConditionsPage,
    MisionVisionValuesPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    HttpClientModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactPage,
    SectorsIndexPage,
    SectorsShowPage,
    SectorsShowTabInfoPage,
    SectorsShowTabMapPage,
    SectorsShowTabTopoImagesPage,
    TopoImagesShowPage,
    TermsAndConditionsPage,
    MisionVisionValuesPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HTTP,
    SectorProvider,
    StringHelper,
    AppConfigProvider,
    File,
    FileTransfer,
    FileTransferObject,
    LaunchNavigator,
    Network,
    GoogleMaps,
  ]
})
export class AppModule {}
