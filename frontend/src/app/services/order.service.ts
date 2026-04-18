import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(data: CreateOrderRequest): Observable<{ success: boolean; data: Order }> {
    return this.http.post<{ success: boolean; data: Order }>(this.apiUrl, data);
  }

  getMyOrders(): Observable<{ success: boolean; data: Order[] }> {
    return this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/mis-ordenes`);
  }

  getOrder(id: number): Observable<{ success: boolean; data: Order }> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/${id}`);
  }

  // Admin
  getAdminOrders(params?: { page?: number; limit?: number; estado?: string }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);

    return this.http.get(`${this.apiUrl}/admin/all`, { params: httpParams });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

  updateOrderStatus(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
