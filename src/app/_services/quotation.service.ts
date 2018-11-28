import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { DummyInfo,QuoteEndorsment } from '@app/_models';
import { AttachmentInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {

    dummyInfoData : DummyInfo[] = [];
    endorsmentData: QuoteEndorsment[] = [];
    attachmentInfoData: AttachmentInfo[] = [];
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


    getEndorsments(){
        
        this.endorsmentData = [
            new QuoteEndorsment('Endt Title','Endt Description', 'Wording'),
            new QuoteEndorsment('This is the title', 'sample Description', 'Sample Wording')
        ];
        return this.endorsmentData;
    }

    getAttachment(){
        this.attachmentInfoData = [
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj","Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj","Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj","Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj","Project")
        ];

        return this.attachmentInfoData;
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