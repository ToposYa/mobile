import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StringHelper } from '../../helpers/string-helper';
import { SectorProvider } from '../../providers/sector/sector';
import { SectorsShowPage } from '../sectors-show/sectors-show';
import { HomePage } from '../home/home';
import { NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'page-sectors-index',
  templateUrl: 'sectors-index.html',
})
export class SectorsIndexPage {

  sectors: Array<any> = [];
  images: number = 0;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public sectorProvider: SectorProvider,
    public ngProgress: NgProgress,
  ) {
    this.sectorProvider.size().then((size) => {
      this.images = size;
      if (this.images == 0) {
        document.getElementById('sectors_index_loader').style.display = 'none'
      } else {
        this.sectorProvider.all((sector) => {
          sector.description_short = StringHelper.Truncate(sector.description);
          this.sectors.push(sector);
          this.images = this.images - 1
        });
      }
    });
  }

  imageLoaded() {
    if (this.images == 0)
      document.getElementById('sectors_index_loader').style.display = 'none'
  }

  goToSectorPage(sector) {
    this.navCtrl.push(SectorsShowPage, {sector: sector});
  }

  searchButton() {
    this.navCtrl.setRoot(HomePage)
  }

  updateButton(id){
    let progressbarId = 'sector_update_progress_' + id
    this.ngProgress.start(progressbarId)
    this.sectorProvider.download(
      id, 
      (progress) => {
        this.ngProgress.set(progress, progressbarId)
      }, 
      (sector) => {
        this.ngProgress.complete(progressbarId);
        let alert = this.alertCtrl.create({
          title: 'Completado',
          subTitle: 'El sector ' + sector.name + ' ha sido actualizado',
          buttons: ['Aceptar']
        });
        alert.present();
        this.navCtrl.setRoot(SectorsIndexPage);
      },
      (message) => {
        this.ngProgress.complete(progressbarId);
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: message,
          buttons: ['Aceptar']
        });
        alert.present();
      },
    );
  }

  restricted(sector) {
    return this.sectorProvider.restricted(sector)
  }

  deleteButton(id){
    this.sectorProvider.delete(id, (retval) => {
      let alert = this.alertCtrl.create({
        title: 'Completado',
        subTitle: 'El sector ha sido eliminado',
        buttons: ['Aceptar']
      });
      alert.present();
      this.navCtrl.setRoot(SectorsIndexPage);
    });
  }
}
