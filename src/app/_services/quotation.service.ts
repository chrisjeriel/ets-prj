import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { QuotationList, HoldCoverMonitoringList, DummyInfo, QuoteEndorsement, QuotationOption, QuotationOtherRates, IntCompAdvInfo, AttachmentInfo, QuotationProcessing, QuotationCoverageInfo, QuotationHoldCover, ItemInformation, ReadyForPrint, Risks } from '@app/_models';


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
    quotationToHoldCover: QuotationHoldCover[] = [];
    readyForPrinting: ReadyForPrint[] = [];
    risksData: Risks[] = [];
    
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
            new QuotationCoverageInfo("1", "I", "3", "69000", ""),
            new QuotationCoverageInfo("2", 'II', "2", "123000", "")
        ];
        return this.coverageInfoData;
    }
    getQuotationListInfo() {
        this.quotationListData = [
            new QuotationList("CAR-2015-00028-32-01", "Direct", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date("12-20-2018"), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz" ),
            new QuotationList("DOS-2015-00028-32-02", "Retrocession", "Calamity", "Concluded", "La Salle", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CEC-2015-00028-32-03", "Direct", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-04", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CEC-2015-00028-32-01", "Direct", "Flood", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("EAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("EAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("EAR-2015-00028-32-03", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("EEI-2015-00028-32-02", "Retrocession", "Fire", "Concluded", "PUP", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-04", "Retrocession", "Calamity", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "University of the Philippines", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("DOS-2015-00028-32-11", "Direct", "Flood", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Del Monte", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CEC-2015-00028-32-01", "Direct", "Calamity", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("EEI-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Ateneo", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CEC-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Mapua", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("DOS-2015-00028-32-02", "Retrocession", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-01", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
            new QuotationList("CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02", "PHP", new Date(), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
        ];
        return this.quotationListData;
    }












    getQuotationHoldCoverInfo() {
        this.holdCoverMonitoringListData = [
            new HoldCoverMonitoringList("HC-CAR-2015-00001-00", "Open", "Phil. Guaranty", "CAR-2015-00028-32-01", "Malayan", "5K Builders & ABE International Corp", new Date(), new Date(), "P8M001KJ", "Inigo Flores", new Date()),
            new HoldCoverMonitoringList("HC-EEI-2015-00001-01", "Expired", "Tan-Gatue Adjustment", "EEI-2015-00128-56-21", "FLT Prime", "5K Builders & ABE International Corp", new Date(), new Date(), "MC-MPC-HO-0001", "Rose Lim", new Date()),
        ];
        return this.holdCoverMonitoringListData;
    }


    getEndorsements(optionNo: number) {

        this.endorsementData = [
            new QuoteEndorsement(1, "111", 'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(1, "112", 'This is the title', 'sample Description', 'Sample Wording'),
            new QuoteEndorsement(2, "221", 'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(2, "222", 'This is the title', 'sample Description', 'Sample Wording'),
            new QuoteEndorsement(3, "331", 'Endt Title', 'Endt Description', 'Wording'),
            new QuoteEndorsement(3, "332", 'This is the title', 'sample Description', 'Sample Wording')
        ];

        var endorsmentData = this.endorsementData.filter(function (itm) {
            return itm.optionNo == optionNo;
        });
        endorsmentData.forEach(function (itm) { delete itm.optionNo; });
        return endorsmentData;
    }

    getAttachment() {
        this.attachmentInfoData = [
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
            new AttachmentInfo("C:/Users/CPI/Desktop/Proj/ets-prj", "Project"),
        ];

        return this.attachmentInfoData;
    }

    getDummyEditableInfo() {
        /*Dummy Data Array*/
        this.dummyInfoData = [
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"), new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"), new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"), new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
            new DummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, "January 21, 2018"),
            new DummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, "January 21, 2018"),
            new DummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, "January 21, 2018"),
        ];


        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.dummyInfoData;

    }

    getQuoProcessingData() {
        this.quoProcessingData = [
            new QuotationProcessing('CAR-2015-00088-00-99', 'Direct', 'CAR Wet Risks', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CAR-2015-00088-00-78', 'Retrocession', 'CAR Wet Risks', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('EEI-2015-00088-00-77', 'Direct', 'EEI', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'EEI-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('EAR-2015-00088-00-55', 'Direct', 'EAR', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'EAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CEC-2015-00088-00-60', 'Direct', 'CEC', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CEC-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('MBI-2015-00088-00-21', 'Direct', 'MBI', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'MBI-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('MLP-2015-00088-00-33', 'Retrocession', 'MLP', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'MLP-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CAR-2015-00088-00-28', 'Direct', 'CAR Wet Risks', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('DOS-2015-00088-00-75', 'Direct', 'DOS', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'DOS-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CAR-2015-00088-00-99', 'Direct', 'CAR Wet Risks', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CAR-2015-00088-00-78', 'Retrocession', 'CAR Wet Risks', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('EEI-2015-00088-00-77', 'Direct', 'EEI', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'EEI-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('EAR-2015-00088-00-55', 'Direct', 'EAR', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'EAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CEC-2015-00088-00-60', 'Direct', 'CEC', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CEC-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('MBI-2015-00088-00-21', 'Direct', 'MBI', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'MBI-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('MLP-2015-00088-00-33', 'Retrocession', 'MLP', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'MLP-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('CAR-2015-00088-00-28', 'Direct', 'CAR Wet Risks', 'Concluded', 'Malayan', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'CAR-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH'),
            new QuotationProcessing('DOS-2015-00088-00-75', 'Direct', 'DOS', 'Concluded', 'FLT Prime', '5K Builders', 'ABE International Corp', '5K Builders & ABE International Corp', 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', 'DOS-2018-00001-023-0002-00', 'PHP', new Date('2015-02-09'),
                new Date('2015-03-09'), 'Rose Lim', 'QUECOH')
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

    getQuotataionOtherRates(optionNo: number) {
        this.quotataionOtherRates = [
            new QuotationOtherRates(1, 'Others11', 50, 'sample deductibles'),
            new QuotationOtherRates(1, 'Others12', 41, 'sample deductibles'),
            new QuotationOtherRates(1, 'Others13', 75, 'deductibles'),
            new QuotationOtherRates(2, 'Others21', 60, 'deductibles'),
            new QuotationOtherRates(2, 'Others22', 50, 'sample deductible'),
            new QuotationOtherRates(2, 'Others23', 65, 'demo'),
            new QuotationOtherRates(2, 'Others24', 41, 'sample ony'),
            new QuotationOtherRates(3, 'Others31', 4, 'for demo'),
            new QuotationOtherRates(3, 'Others32', 3, 'sample data'),
            new QuotationOtherRates(3, 'Others33', 5, 'sample'),
            new QuotationOtherRates(3, 'Others34', 6, 'deductibles'),

        ];
        var quotataionOtherRates = this.quotataionOtherRates.filter(function (itm) {
            return itm.optionNo == optionNo;
        });
        quotataionOtherRates.forEach(function (itm) { delete itm.optionNo; });
        return quotataionOtherRates;
    }



    getIntCompAdvInfo() {

        /*intCompAdvInfo Data Array*/
        this.intCompAdvInfo = [
            new IntCompAdvInfo(1, 'CPI', '  Qwerty 123', '  Developer', 'N', 'good', '  etc', new Date(), 'etc', new Date()),
            new IntCompAdvInfo(2, 'CPI', '  ABCDE 246', '  SA', 'Y', 'very good', '  etc', new Date(), 'etc', new Date())
        ];

        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.intCompAdvInfo;
    }


    getRowData() {
        return this.rowData;
    }

    getQuoteOptionNos() {
        this.quoteOptionNos = [1, 2, 3];
        //,4,5,6,7,8,1,4,5,7,8,9,2,3,4,5,6,7,2,3,4,5,6,1,8,9
        return this.quoteOptionNos;
    }


    getListOfValuesHoldCover() {
        this.quotationToHoldCover = [
            new QuotationHoldCover("EEI-2018-00088-00-67", "Phil. Guaranty", "A.B Industries. Inc", "BPI- EEI"),
            new QuotationHoldCover("CAR-2018-00066-00-31", "PIONEER ASIA INSURANCE CORP", "ACK Construction, Inc.", "Equitable Tower"),
            new QuotationHoldCover("EAR-2018-02344-00-47", "Tan-Galute Adjustment Co., Inc", "A. C. Mojares Construction", "Metromart Cmplx"),
            new QuotationHoldCover("EAR-2018-00075-00-66", "Sentinel ", "ACM Builders", "Tariff Comm Bld"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
            new QuotationHoldCover("CAR-2018-00090-00-69", "Trust Assurance ", "A. Consteel Construction", "JG Summit/Gourm"),
        ];

        return this.quotationToHoldCover;


    }
    getItemInfoData() {
        this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];

        return this.itemInfoData;

    }

    getReadyForPrinting(){
        this.readyForPrinting = [
            new ReadyForPrint("TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST"),
            new ReadyForPrint("TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST"),
            new ReadyForPrint("TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST"),
            new ReadyForPrint("TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST"),
            new ReadyForPrint("TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST"),
        ];
        return this.readyForPrinting;

    }
    
    getRisksLOV(){
        this.risksData = [
          new Risks('10001','Earthquake','Region IV','Calamba','Laguna','District I','Block IV'),
        ];
        return this.risksData;
    }
}