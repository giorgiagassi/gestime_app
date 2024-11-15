import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StoricoTimbratureService {
  private apiURL: string = 'https://www.gestime.it/Attendance/Storico';


  constructor(private http: HttpClient) { }

  getStorico(UserId: string, year: number, month:number): Observable<any> {
    let params = new HttpParams()
      .set('id', UserId)
      .set('month', month.toString())
      .set('year', year.toString())


    return this.http.get<any[]>(this.apiURL, { params })
      .pipe(
        map(response => {
          console.log('Storico Timbrature:', response); // Log di debug
          return response;
        }),
        catchError(this.handleError)
      );
  }
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
