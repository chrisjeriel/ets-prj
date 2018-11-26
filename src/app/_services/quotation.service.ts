import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { DummyInfo } from '@app/_models';
import { QuotationProcessing } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {

    dummyInfoData : DummyInfo[] = [];
    quoProcessingData : QuotationProcessing[] = [];

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

    getQuoProcessingData() {
        this.quoProcessingData = [
            new QuotationProcessing('CAR-2015-0289-01', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan',
                '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', '02-09-2015',
                '03-09-2015', 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('CAR-2015-0289-02', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan',
                '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', '02-09-2015',
                '03-09-2015', 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('CAR-2015-0289-03', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan',
                '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', '02-09-2015',
                '03-09-2015', 'Inigo Flores', 'cuaresma'),
        ];

        return this.quoProcessingData;
    }
}