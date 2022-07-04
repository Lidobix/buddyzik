import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  // serverUrl: string = 'http://localhost:3100';
  serverUrl: string = '';
  constructor() {}

  ngOnInit(): void {
    console.log('redémarrage ServerService');
  }
}
