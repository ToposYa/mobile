import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SectorsShowTabInfoPage } from '../sectors-show-tab-info/sectors-show-tab-info';
import { SectorsShowTabMapPage } from '../sectors-show-tab-map/sectors-show-tab-map';
import { SectorsShowTabTopoImagesPage } from '../sectors-show-tab-topo-images/sectors-show-tab-topo-images';
import { SectorProvider } from '../../providers/sector/sector';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-sectors-show',
  templateUrl: 'sectors-show.html',
})
export class SectorsShowPage {

  tabInfo: any;
  tabMap: any;
  tabTopoImages: any;
  tabParams: any;
  sector: any;
  name: string;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController, 
    public sectorProvider: SectorProvider,
  ) {
    this.tabInfo = SectorsShowTabInfoPage;
    this.tabMap = SectorsShowTabMapPage;
    this.tabTopoImages = SectorsShowTabTopoImagesPage;
    this.sector = this.navParams.get('sector')
    this.tabParams = {sector: this.sector, parentNav: this.navCtrl}
  }

  searchButton() {
    this.navCtrl.setRoot(HomePage)
  }
}
