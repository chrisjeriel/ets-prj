import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { DummyInfo, QuotationOption, QuotationOtherRates } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {

    dummyInfoData : DummyInfo[] = [];

    quotataionOption: QuotationOption[]=[];
    quotataionOtherRates: QuotationOtherRates[]=[];

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


    getQuoteOptions(){
        this.quotataionOption = [
            new QuotationOption(1,5,"Condition",6,8,5),
            new QuotationOption(2,8,"Stable",7,4,3),
            new QuotationOption(3,9,"Good",6,43,2)
        ];
        return this.quotataionOption;
    }

    getQuotataionOtherRates(){
        this.quotataionOtherRates = [
            new QuotationOtherRates('Others1',50,'sample remark'),
            new QuotationOtherRates('Others1',60,'sample description')
        ]
        return this.quotataionOtherRates;
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

}