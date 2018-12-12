import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { QuotationList, HoldCoverMonitoringList, DummyInfo, QuoteEndorsement, QuotationOption, QuotationOtherRates, IntCompAdvInfo, AttachmentInfo, QuotationProcessing, QuotationCoverageInfo, ItemInformation } from '@app/_models';

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
    itemInfoData: ItemInformation[] = [];
    quoteOptionNos: number[] = [];

    rowData: any[] = [];
    toGenInfo: any[] = [];

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
            new QuotationCoverageInfo("data", "1", "I", "3", "69000", ""),
            new QuotationCoverageInfo("data", "2", 'II', "2", "123000", "")
        ];
        return this.coverageInfoData;
    }
    getQuotationListInfo() {
        this.quotationListData = [
           /* new QuotationList("CAR-2015-0002832-01", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma"),*/
            new QuotationList("CAR-2015-0002832-01", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP"),
        ];
        return this.quotationListData;
    }

    getQuotationHoldCoverInfo() {
        this.holdCoverMonitoringListData = [
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Malayan", "CAR-2015-0002832-01", "Risk 1", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "CPI", "CAR-2015-0002832-01", "Risk 2", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 1", "CAR-2015-0002832-01", "Risk 3", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 2", "CAR-2015-0002832-01", "Risk 4", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 3", "CAR-2015-0002832-01", "Risk 5", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 4", "CAR-2015-0002832-01", "Risk 6", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 5", "CAR-2015-0002832-01", "Risk 7", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 6", "CAR-2015-0002832-01", "Risk 8", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 7", "CAR-2015-0002832-01", "Risk 9", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 8", "CAR-2015-0002832-01", "Risk 10", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 9", "CAR-2015-0002832-01", "Risk 11", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("CAR-2015-01", "I - In-force", "Company 10", "CAR-2015-0002832-01", "Risk 12", "5K Builders & ABE International Corp", new Date(), new Date(), "CAR-2015-00", "Inigo Flores", new Date()),
        ];
        return this.holdCoverMonitoringListData;
    }


    getEndorsements(optionNo:number) {

        this.endorsementData = [
            new QuoteEndorsement(1,"111",'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(1,"112",'This is the title', 'sample Description', 'Sample Wording'),
            new QuoteEndorsement(2,"221",'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(2,"222",'This is the title', 'sample Description', 'Sample Wording'),
            new QuoteEndorsement(3,"331",'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(3,"332",'This is the title', 'sample Description', 'Sample Wording')
        ];

        var endorsmentData = this.endorsementData.filter(function(itm){
            return itm.optionNo == optionNo;
        });
        endorsmentData.forEach(function(itm){delete itm.optionNo;});
        return endorsmentData;
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
            new QuotationProcessing('CAR-2015-0000289-01', 'Direct', 'CAR Wet Risks', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('CAR-2015-0000289-02', 'Retrocession', 'CAR Wet Risks', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('EAR-2016-0000289-03', 'Retrocession', 'EAR', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('EEI-2017-0000289-04', 'Retrocession', 'EEI', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('MBI-2018-0000289-05', 'Direct', 'MBI', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('MLP-2018-0000289-06', 'Direct', 'MLP', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma'),
            new QuotationProcessing('DOS-2018-0000289-07', 'Direct', 'DOS', 'In Progress', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'Fairmont Hotel', 'Cooling Towers','Region IV, Laguna, Calamba, Pansol, Block 308', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Inigo Flores', 'cuaresma')
        ];

        return this.quoProcessingData;
    }


    getQuoteOptions() {
        this.quotataionOption = [
            new QuotationOption(1, 5.05, "Condition", 6, 8, 5),
            new QuotationOption(2, 8, "Stable", 7, 4, 3),
            new QuotationOption(3, 9, "Good", 6, 43, 2)
        ];
        return this.quotataionOption;
    }

    getQuotataionOtherRates(optionNo:number ) {
        this.quotataionOtherRates = [
            new QuotationOtherRates(1,'Others11', 50, 'sample deductibles'),
            new QuotationOtherRates(1,'Others12', 41, 'sample deductibles'),
            new QuotationOtherRates(1,'Others13', 75, 'deductibles'),
            new QuotationOtherRates(2,'Others21', 60, 'deductibles'),
            new QuotationOtherRates(2,'Others22', 50, 'sample deductible'),
            new QuotationOtherRates(2,'Others23', 65, 'demo'),
            new QuotationOtherRates(2,'Others24', 41, 'sample ony'),
            new QuotationOtherRates(3,'Others31', 4, 'for demo'),
            new QuotationOtherRates(3,'Others32', 3, 'sample data'),
            new QuotationOtherRates(3,'Others33', 5, 'sample'),
            new QuotationOtherRates(3,'Others34', 6, 'deductibles'),

        ];
        var quotataionOtherRates =  this.quotataionOtherRates.filter(function(itm){
            return itm.optionNo == optionNo;
        });
        quotataionOtherRates.forEach(function(itm){delete itm.optionNo;});
        return quotataionOtherRates;
    }



    getIntCompAdvInfo() {

        /*intCompAdvInfo Data Array*/
        this.intCompAdvInfo = [
            new IntCompAdvInfo(1, 'CPI', '  Qwerty 123', '  Developer', 'N', 'good', '  etc', new Date(), 'etc', new Date()),
            new IntCompAdvInfo(2, 'CPI', '  ABCDE 246', '  SA', 'Y', 'very good', '  etc', new Date(),'etc',new Date() )
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.intCompAdvInfo;
    }


    getRowData() {
        return this.rowData;
    }

    getQuoteOptionNos(){
        this.quoteOptionNos = [1,2,3];
        //,4,5,6,7,8,1,4,5,7,8,9,2,3,4,5,6,7,2,3,4,5,6,1,8,9
        return this.quoteOptionNos;
    }

    getItemInfoData() {
        this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];

        return this.itemInfoData;
    }
}