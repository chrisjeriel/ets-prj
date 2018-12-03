import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { QuotationList, HoldCoverMonitoringList, DummyInfo, QuoteEndorsement, QuotationOption, QuotationOtherRates, IntCompAdvInfo, AttachmentInfo, QuotationProcessing, QuotationCoverageInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {
    quotataionOption: QuotationOption[] = [];
    quotataionOtherRates: QuotationOtherRates[] = [];
    dummyInfoData: DummyInfo[] = [];
    endorsementData: QuoteEndorsement[] = [];
    quotationListData: QuotationList[] = [];
    holdCoverMonitoringListData: HoldCoverMonitoringList[] = [];
    intCompAdvInfo: IntCompAdvInfo[] = [];
    attachmentInfoData: AttachmentInfo[] = [];
    quoProcessingData: QuotationProcessing[] = [];
    coverageInfoData: QuotationCoverageInfo[] = [];

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

    getCoverageInfo() {
        this.coverageInfoData = [
            new QuotationCoverageInfo("data", "1", "Section I", "3", "69000", "Sort", "70000"),
            new QuotationCoverageInfo(null, "2", 'Section II', "4", "123000", 'Sort', "456000")
        ];
        return this.coverageInfoData;
    }
    getQuotationListInfo() {
        this.quotationListData = [
            new QuotationList("CAR-2015-2832-01", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-02", "Branch 2", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-03", "Branch 5", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-04", "Branch 3", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-05", "Branch 4", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-06", "Branch 8", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-07", "Branch 6", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-08", "Branch 9", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-09", "Branch 7", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-10", "Direct 1", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-11", "Direct 3", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-12", "Direct 5", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-2832-13", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "07-28-2018", "08-28-2018", "Inigo Flores", "Cuaresma"),
        ];
        return this.quotationListData;
    }

    getQuotationHoldCoverInfo() {
        this.holdCoverMonitoringListData = [
            new HoldCoverMonitoringList("Malayan", "CAR-2015-2832-01", "CAR-2015-01", "Risk 1", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Malayan", "CAR-2015-2832-02", "CAR-2015-02", "Risk 2", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 3", "CAR-2015-2832-03", "CAR-2015-03", "Risk 3", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 4", "CAR-2015-2832-04", "CAR-2015-04", "Risk 4", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 5", "CAR-2015-2832-05", "CAR-2015-05", "Risk 5", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 6", "CAR-2015-2832-06", "CAR-2015-06", "Risk 6", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 7", "CAR-2015-2832-07", "CAR-2015-07", "Risk 7", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 8", "CAR-2015-2832-08", "CAR-2015-08", "Risk 8", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 9", "CAR-2015-2832-09", "CAR-2015-09", "Risk 9", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 10", "CAR-2015-2832-10", "CAR-2015-10", "Risk 10", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 11", "CAR-2015-2832-11", "CAR-2015-11", "Risk 11", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 12", "CAR-2015-2832-12", "CAR-2015-12", "Risk 12", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
            new HoldCoverMonitoringList("Company 13", "CAR-2015-2832-13", "CAR-2015-13", "Risk 13", "5K Builders & ABE International Corp", "02-19-2015", "04-19-2015", "CAR-2015-00", "Inigo Flores", "02-19-2015", "I - In-force"),
        ];
        return this.holdCoverMonitoringListData;
    }


    getEndorsements() {

        this.endorsementData = [
            new QuoteEndorsement('Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement('This is the title', 'sample Description', 'Sample Wording')
        ];
        return this.endorsementData;
    }

    getAttachment() {
        this.attachmentInfoData = [
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project")
        ];

        return this.attachmentInfoData;
    }

    getDummyEditableInfo() {
        /*Dummy Data Array*/
        this.dummyInfoData = [
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.dummyInfoData;

    }

    getQuoProcessingData() {
        this.quoProcessingData = [
            new QuotationProcessing('CAR-2015-0289-01', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('CAR-2015-0289-02', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('CAR-2015-0289-03', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
        ];

        return this.quoProcessingData;
    }


    getQuoteOptions() {
        this.quotataionOption = [
            new QuotationOption("OPT-001", 5, "Condition", 6, 8, 5),
            new QuotationOption("OPT-002", 8, "Stable", 7, 4, 3),
            new QuotationOption("OPT-003", 9, "Good", 6, 43, 2)
        ];
        return this.quotataionOption;
    }

    getQuotataionOtherRates() {
        this.quotataionOtherRates = [
            new QuotationOtherRates('Others1', 50, 'sample remark'),
            new QuotationOtherRates('Others1', 60, 'sample description')
        ];
        return this.quotataionOtherRates;
    }



    getIntCompAdvInfo() {

        /*intCompAdvInfo Data Array*/
        this.intCompAdvInfo = [
            new IntCompAdvInfo(1, 'CPI', 'Carino Engelbert', 'IT', 'Y', 'excellent', 'etcarino', new Date(), 'etcarino', new Date()),
            new IntCompAdvInfo(2, 'CPI', 'Qwerty 123', 'Developer', 'N', 'good', 'etcarino', new Date(), 'etcarino', new Date()),
            new IntCompAdvInfo(3, 'CPI', 'ABCDE 246', 'SA', 'Y', 'very good', 'etcarino', new Date(), 'etcarino', new Date()),
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.intCompAdvInfo;
    }

}