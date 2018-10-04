import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SectorProvider } from '../../providers/sector/sector';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-sectors-show-tab-info',
  templateUrl: 'sectors-show-tab-info.html',
})
export class SectorsShowTabInfoPage {

  description:string;
  access:string;
  sector:any;

  constructor(
    public sectorProvider: SectorProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.sector = this.navParams.get('sector')
  }

  ionViewDidLoad() {
    this.sector_route_distribution_data(this.sector.route_distribution_data)
  }

  sector_route_distribution_data(data) {
    var canvas:any = document.getElementById("sector_route_distribution_data");
    var ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.colors,
          borderWidth: 1
        }]
      },
      options: {
        legend: { display: false },
        layout: {
          padding: {
            left: 40,
            right: 40,
            top: 30,
            bottom: 20,
          }
        },
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: [{
            display: false,
            gridLines: false,
            ticks: { beginAtZero: true }
          }]
        }
      }
    });
  }

  restricted(sector) {
    return this.sectorProvider.restricted(sector)
  }
}
