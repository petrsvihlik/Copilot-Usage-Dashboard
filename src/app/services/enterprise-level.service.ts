import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseLevelService {

  private dataUrl = 'assets/copilot_usage_data.json'; // URL to JSON data

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getData(): Observable<any> {
    // For enterprise level data, we could use this endpoint in the future:
    // https://api.github.com/enterprises/{enterprise}/copilot/metrics
    // But for now, using sample data
    return this.http.get<any>(this.dataUrl);
  }
}