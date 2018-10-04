import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import Split from 'split.js';
import PinchZoomCanvas from 'pinch-zoom-canvas';

@Component({
  selector: 'page-topo-images-show',
  templateUrl: 'topo-images-show.html',
})
export class TopoImagesShowPage {

  topoImages:any;
  topoImage:any;
  topoImageId:string;
  scrollTopId:string;
  scrollBottomId:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.topoImage = this.navParams.get('topoImage');
    this.topoImages = this.navParams.get('topoImages');
    this.topoImageId = 'topo_image_' + this.topoImage.id;
    this.scrollTopId = 'scroll_top_' + this.topoImage.id;
    this.scrollBottomId = 'scroll_bottom_' + this.topoImage.id;
  }

  ionViewDidLoad() {
    let canvas = document.getElementById(this.topoImageId);

    new PinchZoomCanvas({
      canvas: canvas,
      path: this.topoImage.local_topo_image,
      momentum: true,
      zoomMax: 2,
      doubletap: true,
    });

    if (this.topoImage.shape == 'landscape') {
      canvas.setAttribute("style", "width: 130%; height: 100%");
    }

    Split(['#' + this.scrollTopId, '#' + this.scrollBottomId], {
      sizes: [30, 70],
      direction: 'vertical'
    })
  }

  getIndex(topoImage) {
    return this.topoImages.indexOf(topoImage)
  }

  getNext(topoImage) {
    let index = this.getIndex(topoImage)

    return this.topoImages[index + 1] == undefined ? 
      this.topoImages[0] : this.topoImages[index + 1]
  }

  getPrev(topoImage) {
    let index = this.getIndex(topoImage)

    return this.topoImages[index - 1] == undefined ? 
      this.topoImages[this.topoImages.length - 1] : this.topoImages[index - 1]
  }

  getParams(topoImage) {
    return {
      topoImage: topoImage, 
      topoImages: this.topoImages,
      topoImagePrev: this.getPrev(topoImage), 
      topoImageNext: this.getNext(topoImage),
    }
  }

  goToNext() {
    let topoImage = this.getNext(this.topoImage);
    let params = this.getParams(topoImage)

    this.navCtrl
      .push(TopoImagesShowPage, params)
      .then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
  }

  goToPrev() {
    let topoImage = this.getPrev(this.topoImage);
    let params = this.getParams(topoImage)

    this.navCtrl
      .push(TopoImagesShowPage, params)
      .then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
  }
}
