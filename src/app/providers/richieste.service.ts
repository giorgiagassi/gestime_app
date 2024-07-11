import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RichiesteService {
  private apiURL: string = 'https://www.gestime.it/Leave/Autorizzazioni';
  private apiCaus: string = 'https://www.gestime.it/Leave/Causalizzazioni';

  constructor(private http: HttpClient) { }

  getStorico(UserId: string, year: number): Observable<any> {
    let params = new HttpParams()
      .set('UserId', UserId)
      .set('Year', year.toString());

    return this.http.get<any[]>(this.apiURL, { params })
      .pipe(
        map(response => {
          console.log('Storico:', response); // Log di debug
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



  getCausalizzazioni(): Observable<any> {
    return this.http.get<any[]>(this.apiCaus)
      .pipe(
        map(response => {
          console.log('Causalizzazioni:', response); // Log di debug
          return response;
        }),
        catchError(this.handleError)
      );
  }

  inviaRichiesta(userId: string, body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'User': userId });

    return this.http.post(this.apiURL, body, { headers, responseType: 'text' }) // Modificato per gestire la risposta come testo
      .pipe(
        map(response => {
          console.log('Response:', response); // Log di debug
          return response; // Lascia la risposta come testo
        }),
        catchError(this.handleError)
      );
  }

}
