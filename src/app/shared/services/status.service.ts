import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<Object> {
    let endpoint = `${this.apiUrl}status`;
    return this.http.get(endpoint);
  }
}
