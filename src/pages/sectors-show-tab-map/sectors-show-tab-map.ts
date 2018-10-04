import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SectorProvider } from '../../providers/sector/sector';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  ILatLng,
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-sectors-show-tab-map',
  templateUrl: 'sectors-show-tab-map.html',
})
export class SectorsShowTabMapPage {

  map: GoogleMap;
  sector:any;

  constructor(
    public sectorProvider: SectorProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.sector = this.navParams.get('sector')
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    console.log(this.sector);
    let mapOptions: GoogleMapOptions = {
      mapType: 'MAP_TYPE_HYBRID',
      timeout: 10000,
      enableHighAccuracy: true,
      controls: {
        compass: true,
        myLocation: true,
        indoorPicker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      },
      camera: {
         target: {
           lat: this.sector.center.lat,
           lng: this.sector.center.lng,
         },
         zoom: 16,
         tilt: 30
       }
    }

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    for (let parking of this.sector.parkings) {
      this.map.addMarkerSync({
        icon: 'assets/icon/parking.png',
        position: {
          lat: parking.lat,
          lng: parking.lng,
        }
      });
    }

    for (let map_path of this.sector.map_paths) {
      let points: ILatLng[] = [];

      for (let coord of map_path.coords) {
        let point: ILatLng = {lat: coord.lat, lng: coord.lng};
        points.push(point);
      }
      
      this.map.addPolyline({
        points: points,
        color: '#0011FF',
        width: 3,
      });
    }

    let points: ILatLng[] = [];
    for (let coord of this.sector.map_area) {
      let point: ILatLng = {lat: coord.lat, lng: coord.lng};
      points.push(point);
    }
    this.map.addPolygon({
      points: points,
      strokeColor : '#9FDE92',
      fillColor : '#9FDE92',
      opacity : 0.1,
      strokeWidth: 1
    });
  }
}
