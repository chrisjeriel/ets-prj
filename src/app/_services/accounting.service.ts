import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccCVPayReqList, AccCvAttachement} from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  accCvPayReqList : AccCVPayReqList[] = [];	
  accCvAttachment : AccCvAttachement[] = [];

  constructor(private http: HttpClient) { }

  getAccCVPayReqList() {
  	this.accCvPayReqList = [
  		new AccCVPayReqList( "OPR-2018-01-0001","San Miguel Corporation","Others","Open",new Date("09-20-18"),"Payment for San Miguel","Rosalinda Mercedez","PHP",27513)
  	];
  	return this.accCvPayReqList;
  }

  getAccCVAttachment(){
  	this.accCvAttachment = [
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_01","Accounting Specifications Sample 1"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_02","Accounting Specifications Sample 2"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_03","Accounting Specifications Sample 3"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_04","Accounting Specifications Sample 4"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_05","Accounting Specifications Sample 5"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_06","Accounting Specifications Sample 6"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_07","Accounting Specifications Sample 7"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_08","Accounting Specifications Sample 8"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_09","Accounting Specifications Sample 9"),
  		new AccCvAttachement("C:\\Users\\CPI\\Desktop\\PMMSC_ETS\\SRS\\05-Accounting\\Sample_10","Accounting Specifications Sample 10"),
  	];
  	return this.accCvAttachment;
  }

}
