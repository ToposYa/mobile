import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, AlertController } from 'ionic-angular';
import { SectorProvider } from '../../providers/sector/sector';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { DomSanitizer } from '@angular/platform-browser';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  backendSafeUrl: any;
  navTitle: string;
  homePage: boolean;
  isSyncable: boolean;
  isDownloadable: boolean;
  data: any;
  deregisterBackButton: any;

  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public sectorProvider: SectorProvider,
    public sanitizer: DomSanitizer,
    private alertCtrl: AlertController,
    private zone: NgZone,
    private network: Network,
  ) {
    this.backendSafeUrl = this.sanitizer.
      bypassSecurityTrustResourceUrl(AppConfigProvider.backendUrl + '/?mobile=true');
    this.homePage = true;
    this.isDownloadable = false;
    this.isSyncable = false;

    window.addEventListener('message', (event) => {
      this.zone.run(() => {
        this.data = event.data
        this.updateTitle();
        this.updateDownloadButton();
      });
    }, false);

    this.network.onDisconnect().subscribe(() => {
      this.setOffline();
    });

    this.network.onConnect().subscribe(() => {
      this.setOnline();
    });

  }

  ionViewWillEnter() {
    this.deregisterBackButton = this.platform.registerBackButtonAction(() => {
      if (this.homePage == false)
        this.goBack();
    });
  }

  ionViewWillLeave() {
    this.deregisterBackButton();
  }

  goBack() {
    window.history.back();
  }

  setOffline() {
    let iframe = (<HTMLIFrameElement>document.getElementById('toposya_online_view'))
    let message = (<HTMLDivElement>document.getElementById('offline_message'))
    if (iframe != null) {
      iframe.style.display = "none";
      message.style.display = "block";
    }
  }

  setOnline() {
    let iframe = (<HTMLIFrameElement>document.getElementById('toposya_online_view'))
    let message = (<HTMLDivElement>document.getElementById('offline_message'))
    if (iframe != null) {
      iframe.style.display = "block";
      iframe.src = AppConfigProvider.backendUrl;
      message.style.display = "none";
    }
  }

  updateTitle() {
    if (this.data.navBarTitle == "Inicio") {
      this.homePage = true;
    } else {
      this.homePage = false;
      this.navTitle = this.data.navBarTitle; 
    }
  }

  updateDownloadButton(){
    if ( this.data.download == true ) {
      this.sectorProvider.findById(this.data.id, (sector) => {
        if ( sector ) {
          this.isDownloadable = false;
          this.isSyncable = true;
        } else {
          this.isDownloadable = true;
          this.isSyncable = false;
        }
      })
    } else {
      this.isDownloadable = false
    }
  }

  downloadButton() {
    let alert = this.alertCtrl.create({
      title: 'Descargando...',
      subTitle: '0%',
    });
    alert.present();
    this.sectorProvider.download(
      this.data.id, 
      (progress) => {
        alert.setSubTitle(progress + '%')
      }, 
      (sector) => {
        alert.setTitle('Completado')
        alert.setSubTitle('El sector ' + sector.name + ' se ha descargado satisfactoriamente')
        alert.addButton({text: 'Aceptar'})
      },
      (message) => {
        alert.setTitle('Error')
        alert.setSubTitle(message)
        alert.addButton({text: 'Aceptar'})
      },
    );
  }

  syncButton() {
    let alert = this.alertCtrl.create({
      title: 'Descargando...',
      subTitle: '0%',
    });
    alert.present();
    this.sectorProvider.download(
      this.data.id, 
      (progress) => {
        alert.setSubTitle(progress + '%')
      }, 
      (sector) => {
        alert.setTitle('Completado')
        alert.setSubTitle('El sector ' + sector.name + ' se ha sincronizado satisfactoriamente')
        alert.addButton({text: 'Aceptar'})
      },
      (message) => {
        alert.setTitle('Error')
        alert.setSubTitle(message)
        alert.addButton({text: 'Aceptar'})
      },
    );
  }

  searchButton() {
    this.isSyncable = false;
    this.isDownloadable = false;
    this.homePage = true;
    (<HTMLIFrameElement>document.getElementById('toposya_online_view')).
      src = AppConfigProvider.backendUrl;
  }
}
