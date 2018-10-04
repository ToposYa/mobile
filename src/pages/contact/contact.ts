import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  backendSafeUrl: any;

  constructor(
    public navCtrl: NavController, 
    public sanitizer: DomSanitizer,
    private network: Network,
  ) {
    this.backendSafeUrl = this.sanitizer.
      bypassSecurityTrustResourceUrl(AppConfigProvider.backendUrl + '/messages/contact?mobile=true');

    this.network.onDisconnect().subscribe(() => {
      this.setOffline();
    });

    this.network.onConnect().subscribe(() => {
      this.setOnline();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
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

}
