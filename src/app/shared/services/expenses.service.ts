import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExpenses(filter: any): Observable<Object> {
    let endpoint = `${this.apiUrl}expenses`;
    let params = new HttpParams();
    const { keyword, category, status, pageNumber, pageSize } = filter;

    if (keyword) params = params.append('name', keyword);
    if (category) params = params.append('category', category);
    if (status) params = params.append('status', status);
    if (pageNumber) params = params.append('pageNumber', pageNumber);
    if (pageSize) params = params.append('pageSize', pageSize);

    return this.http.get(endpoint, { params: params });
  }

  createExpense(payload: any): Observable<any> {
    let endpoint = `${this.apiUrl}expenses`;
    return this.http.post(endpoint, payload);
  }

  updateExpense(_id: string, payload: any): Observable<any> {
    let endpoint = `${this.apiUrl}expenses/${_id}`;
    return this.http.patch(endpoint, payload);
  }

  deleteExpense(_id: string): Observable<any> {
    let endpoint = `${this.apiUrl}expenses/${_id}`;
    return this.http.delete(endpoint);
  }
}
