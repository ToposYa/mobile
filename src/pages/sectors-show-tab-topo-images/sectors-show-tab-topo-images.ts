import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SectorProvider } from '../../providers/sector/sector';
import { TopoImagesShowPage  } from '../topo-images-show/topo-images-show';

@Component({
  selector: 'page-sectors-show-tab-topo-images',
  templateUrl: 'sectors-show-tab-topo-images.html',
})
export class SectorsShowTabTopoImagesPage {

  sector:any;
  topoImages:any;
  parentNav:any;
  topoImagesNumber:number = 0;

  constructor(
    public sectorProvider: SectorProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.sector = this.navParams.get('sector')
    this.parentNav = this.navParams.get('parentNav')
    this.topoImagesNumber = this.sector.topo_images.length
    this.topoImages = this.sector.topo_images
    for (let topoImage of this.topoImages) {
      topoImage.local_topo_image = topoImage.local_topo_image + this.sector.payload
    }
  }

  topoImageLoaded() {
    this.topoImagesNumber = this.topoImagesNumber - 1;
    if (this.topoImagesNumber == 0) {
      document.getElementById('sectors_show_tab_topo_images_loader').
        style.display = 'none'
    }
  }

  goToTopoImagesShowPage(topoImage) {
    let params = {topoImage: topoImage, topoImages: this.topoImages};
    this.parentNav.push(TopoImagesShowPage, params);
  }
}
