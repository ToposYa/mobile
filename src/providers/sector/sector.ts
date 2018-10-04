import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppConfigProvider } from '../app-config/app-config';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()
export class SectorProvider {
  public downloadUrl:string;
  public fileTransfer:FileTransferObject;

  constructor(
    public http: HTTP,
    public platform: Platform,
    private file: File,
    private storage: Storage,
    private transfer: FileTransfer,
  ){
    this.downloadUrl = AppConfigProvider.downloadSectorUrl;
    this.platform.ready().then(() => {
      this.fileTransfer = this.transfer.create();
    });
  }

  findById(id, fn) {
    this.storage.get('sectors@keys').then((keys) => {
      let sectorKey = 'sectors@' + id
      if (keys && keys.indexOf(sectorKey) == -1){
        fn(false);
      } else {
        this.storage.get(sectorKey).then((sector) => {
          if (fn != undefined)
            fn(sector);
        });
      }
    });
  }

  size() {
    return this.storage.get('sectors@keys').then((keys) => {
      if (keys != null) {
        return keys.length;
      } else {
        return 0;
      }
    })
  }

  all(fn) {
    this.storage.get('sectors@keys').then((keys) => {
      if (keys !== null) {
        for (let key of keys) {
          this.storage.get(key).then((sector) => {
            fn(sector)
          });
        }
      }
    });
  }

  fetchSectorData(id) {
    let sectorDownloadUrl = this.downloadUrl.replace('ID', id);
    return this.http.get(sectorDownloadUrl, {}, {}).then((response) => {
      return response.data;
    }).catch(error => {
      throw error;
    });
  }

  buildSector = (data) => {
    let sector = JSON.parse(data);
    let sectorFilePath = 'sectors/' + sector.id + '/';
    sector.payload = '?' + Math.random().toString(36).substr(2);
    sector.local_image = this.file.dataDirectory + sectorFilePath + 'image.jpg' + sector.payload;
    sector.conditions_when_to_climb = JSON.parse(sector.conditions_when_to_climb)

    for (let topo_image of sector.topo_images) {
      topo_image.local_topo_image = this.file.dataDirectory + 
        sectorFilePath + 
        'topo_image_' + 
        topo_image.id + 
        '.jpg';
    }
    return Promise.all([sector]).then(() => {return sector;});
  }

  saveSectorData = (sector) => {
    return this.storage.set('sectors@' + sector.id, sector).then((sector) => {
      return sector;
    })
  }

  saveSectorImages = (sector) => {
    let topoImages = []
    for (let topo_image of sector.topo_images) {
      let topoImageUrl = AppConfigProvider.backendUrl + topo_image.image;
      topoImages.push(this.fileTransfer.download(topoImageUrl, topo_image.local_topo_image));
    }

    return Promise.all([
      this.fileTransfer.download(AppConfigProvider.backendUrl + sector.image, sector.local_image),
    ].concat(topoImages)).then((values) => {
      return sector;
    }).catch(error => {
      throw error;
    });
  }

  saveSectorKeys = (sector) => {
    return this.storage.get('sectors@keys').then((sectorKeys) => {
      sectorKeys = sectorKeys || [];
      let sectorKey = 'sectors@' + sector.id;
      if ( sectorKeys && sectorKeys.indexOf(sectorKey) == -1 ) {
        sectorKeys.push(sectorKey);
      }
      this.storage.set('sectors@keys', sectorKeys)
    }).then(() => {
      return sector;
    });
  }

  download(id, fnProgress, fnFinished, fnError) {
    this.fetchSectorData(id).
      then((data) => {
        fnProgress(10);
        return this.buildSector(data);
      }).then((sector) => {
        fnProgress(20);
        return this.saveSectorImages(sector)
      }).then((sector) => {
        fnProgress(70);
        return this.saveSectorData(sector)
      }).then((sector) => {
        fnProgress(80);
        return this.saveSectorKeys(sector);
      }).then((sector) => {
        fnFinished(sector);
      }).catch((error) => {
        fnError("El sector que esta intentando descargar no se encuentra disponible en este momento. Ir a https://www.toposya.com para verificar que existe.Intentelo nuevamente mas tarde. De lo contrario pongase en contacto con nosotros si el error sigue persistiendo. Muchas gracias")
        console.log(error);
      });
  }

  restricted(sector) {
    if (sector.restriction_permanent == true) {
      return true;
    }

    if (
      sector.restriction_start_day == null ||
      sector.restriction_start_month == null ||
      sector.restriction_end_day == null ||
      sector.restriction_end_month == null
    ) {
      return false;
    }

    let startDate = new Date((new Date()).getFullYear(), 
      sector.restriction_start_month, sector.restriction_start_day);
    let endDate = new Date((new Date()).getFullYear(), 
      sector.restriction_end_month, sector.restriction_end_day);
    let now = new Date();

    if (startDate > endDate) {
      if (now < startDate) {
        now = new Date((new Date()).getFullYear() + 1);
      }
      endDate = new Date((new Date()).getFullYear() + 1, 
        sector.restriction_end_month, sector.restriction_end_day);
    }

    if ( now > startDate && now < endDate ) {
      return true
    }

    return false;
  }

  delete(id, fn = null) {
    this.findById(id, (sector) => {
      let sectorFilePath = 'sectors/' + sector.id
      this.storage.get('sectors@keys').then((sectorKeys) => {
        let sectorKey = 'sectors@' + sector.id;
        let index = sectorKeys.indexOf(sectorKey)
        sectorKeys.splice(index, 1);

        Promise.all([
          this.storage.set('sectors@keys', sectorKeys),
          this.storage.remove(sectorKey),
          this.file.removeRecursively(this.file.dataDirectory, sectorFilePath),
        ]).then(() => {
          fn(true)
        });
      })
    });
  }
}
