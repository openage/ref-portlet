import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public monitor(): Observable<boolean> {
    const _connect = new Subject<boolean>();

    window.ononline = (event) => {
      _connect.next(true);
    };

    window.onoffline = (event) => {
      _connect.next(false);
    };

    return _connect.asObservable();
  }
}
