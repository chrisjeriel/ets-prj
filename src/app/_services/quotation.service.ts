import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DummyInfo } from '@app/_models';
import { IntCompAdvInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {

    dummyInfoData : DummyInfo[] = [];
    intCompAdvInfo : IntCompAdvInfo[] = [];
  
    constructor(private http: HttpClient) {

    }


    getDummyInfo() {
        /*Dummy Data Array*/
        this.dummyInfoData = [ 
            new DummyInfo(1,'Christopher Jeriel','Sarsonas','Alcala', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(2,'Veronica','Raymundo','C', 'Female', 25, "January 21, 2018"), 
            new DummyInfo(3,'Elmon','Hagacer','H', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(4,'Nadine','Lustre','R', 'Female', 25, "January 21, 2018"),
            new DummyInfo(5,'Christopher Jeriel','Sarsonas','Alcala', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(6,'Veronica','Raymundo','C', 'Female', 25, "January 21, 2018"), 
            new DummyInfo(7,'Elmon','Hagacer','H', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(8,'Nadine','Lustre','R', 'Female', 25, "January 21, 2018"),
            new DummyInfo(9,'Christopher Jeriel','Sarsonas','Alcala', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(10,'Veronica','Raymundo','C', 'Female', 25, "January 21, 2018"), 
            new DummyInfo(11,'Elmon','Hagacer','H', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(12,'Nadine','Lustre','R', 'Female', 25, "January 21, 2018"),
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.dummyInfoData;
    }

    getDummyEditableInfo() {
        /*Dummy Data Array*/
        this.dummyInfoData = [ 
            new DummyInfo(1,'Christopher Jeriel','Sarsonas','Alcala', 'Male', 25, "January 21, 2018"), 
            new DummyInfo(2,'Veronica','Raymundo','C', 'Female', 25, "January 21, 2018"), 
            new DummyInfo(3,'Elmon','Hagacer','H', 'Male', 25, "January 21, 2018"), 
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.dummyInfoData;
    }

    getIntCompAdvInfo() {
       
        /*intCompAdvInfo Data Array*/
        this.intCompAdvInfo = [ 
            new IntCompAdvInfo(1,'CPI','Carino Engelbert','IT','Y', 'excellent','etcarino',"11/27/2018",'etcarino', "11/27/2018"), 
            new IntCompAdvInfo(2,'CPI','Qwerty 123','Developer','N', 'good','etcarino',"11/27/2018",'etcarino', "11/27/2018"), 
            new IntCompAdvInfo(3,'CPI','ABCDE 246','SA','Y', 'very good','etcarino',"11/27/2018",'etcarino', "11/27/2018"), 
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.intCompAdvInfo;
    }

}
