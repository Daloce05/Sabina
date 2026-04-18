import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Setting, SettingsMap } from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  getPublicSettings(): Observable<{ success: boolean; data: SettingsMap }> {
    return this.http.get<{ success: boolean; data: SettingsMap }>(`${this.apiUrl}/public`);
  }

  getAllSettings(): Observable<{ success: boolean; data: Setting[] }> {
    return this.http.get<{ success: boolean; data: Setting[] }>(this.apiUrl);
  }

  updateSettings(settings: { clave: string; valor: string }[]): Observable<{ success: boolean; message: string; data: Setting[] }> {
    return this.http.put<{ success: boolean; message: string; data: Setting[] }>(this.apiUrl, { settings });
  }
}
