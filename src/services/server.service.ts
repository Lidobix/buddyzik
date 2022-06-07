import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  serverUrl: string = 'http://localhost:3100';
  constructor() {}
}
