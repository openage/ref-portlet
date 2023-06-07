import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addresses: Address[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.http.get('assets/data/address/india.csv', { responseType: 'text' })
      .subscribe((data) => {
        const csvToRowArray = data.split('\n');
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          const row = csvToRowArray[index].split(',');
          this.addresses.push(new Address({ pinCode: row[0], city: row[1], state: row[2], country: 'India' }));
        }
      });
  }

  get(id: string | number): Observable<Address> {
    const subject = new Subject<Address>();

    setTimeout(() => {
      subject.next(this.addresses.find((i: any) => i.pinCode === id));
    });

    return subject.asObservable();
  }
}
