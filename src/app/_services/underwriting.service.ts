import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DummyInfo, UnderwritingCoverageInfo, UnderwritingOtherRatesInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UnderwritingService {

    dummyInfoData: DummyInfo[] = [];
    uwcoverageInfoData: UnderwritingCoverageInfo[] = [];
    uwotherRatesInfoData: UnderwritingOtherRatesInfo[] = [];

    constructor(private http: HttpClient) {

    }


    getDummyInfo() {
        /*Dummy Data Array*/
        this.dummyInfoData = [
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(4, 'Nadine', 'Lustre', 'R', 'Female', 25, "January 21, 2018"),
            new DummyInfo(5, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(6, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(7, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(8, 'Nadine', 'Lustre', 'R', 'Female', 25, "January 21, 2018"),
            new DummyInfo(9, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(10, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(11, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(12, 'Nadine', 'Lustre', 'R', 'Female', 25, "January 21, 2018"),
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.dummyInfoData;
    }

    getUWCoverageInfo() {
        this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("data", "1", "I", "3", "69000", "Sort C", "70000"),
            new UnderwritingCoverageInfo("data", "2", 'II', "2", "123000", 'Sort B', "456000")
        ];
        return this.uwcoverageInfoData;
    }
    getUWOtherRatesInfo() {
        this.uwotherRatesInfoData = [
            new UnderwritingOtherRatesInfo("data", "Sample 1", 123000, "Remarks 1"),
            new UnderwritingOtherRatesInfo("data", "Sample 2", 321000, "Remarks 2"),
        ];
        return this.uwotherRatesInfoData;
    }
}
