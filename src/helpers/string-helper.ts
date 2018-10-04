import { Injectable } from '@angular/core';

@Injectable()
export class StringHelper {

  constructor() {
  }

  static Truncate(str:string, length:number = 100, ending:string = '...') {
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  }
}
