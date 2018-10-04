import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigProvider {
  static backendUrl:string = 'BACKEND_URL';
  static downloadSectorUrl:string = AppConfigProvider.backendUrl + '/sectors/ID/download.json';

  constructor() {
  }
}
