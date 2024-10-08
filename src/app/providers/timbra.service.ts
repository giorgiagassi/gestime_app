import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TimbraService {
  private apiEntrata = 'https://www.gestime.it/Account/Entrata';
  private apiUscita = 'https://www.gestime.it/Account/Uscita';
  private apiPermessoInizio = 'https://www.gestime.it/Leave/Inizio';
  private apiPermessoFine = 'https://www.gestime.it/Leave/Fine';

  private _user = signal<any>(null);

  constructor(private http: HttpClient) { }

  get user() {
    return this._user.asReadonly();
  }

  setUser(userData: any) {
    this._user.set(userData);
  }

  entrata(userId: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json', 'User': userId };

      const httpOptions = {
        headers: new HttpHeaders(headers)
      };
      return this.http.get(this.apiEntrata, httpOptions)
        .pipe(
          map(response => {
            console.log('Entrata response:', response); // Log di debug
            return response;
          }),
          catchError(this.handleError)
        );

  }

  uscita(userId: string, tipoUscita: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json', 'User': userId , 'TipoUscita': tipoUscita};

      const httpOptions = {
        headers: new HttpHeaders(headers)
      };
      return this.http.get(this.apiUscita, httpOptions)
        .pipe(
          map(response => {
            console.log('Uscita response:', response); // Log di debug
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

  permessoInizio(userId: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json', 'User': userId };

    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.get(this.apiPermessoInizio, httpOptions)
      .pipe(
        map(response => {
          console.log('permesso inizio response:', response); // Log di debug
          return response;
        }),
        catchError(this.handleError)
      );

  }
  permessoFine(userId: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json', 'User': userId };

    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.get(this.apiPermessoFine, httpOptions)
      .pipe(
        map(response => {
          console.log('permesso fine response:', response); // Log di debug
          return response;
        }),
        catchError(this.handleError)
      );

  }


}
