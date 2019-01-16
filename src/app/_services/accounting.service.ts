import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccCVPayReqList } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  accCvPayReqList : AccCVPayReqList[] = [];	

  constructor(private http: HttpClient) { }

  getAccCVPayReqList() {
  	this.accCvPayReqList = [
  		new AccCVPayReqList( "2018","00000034","San Miguel Corporation","Others","Open",new Date("09-20-18"),"Payment for San Miguel","Rosalinda Mercedez","PHP",27513)
  	];
  	return this.accCvPayReqList;
  }

}
