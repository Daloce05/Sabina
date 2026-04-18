import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ success: boolean; data: User[] }> {
    return this.http.get<{ success: boolean; data: User[] }>(this.apiUrl);
  }

  toggleUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle`, {});
  }

  changeRole(id: number, rol: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rol`, { rol });
  }
}
