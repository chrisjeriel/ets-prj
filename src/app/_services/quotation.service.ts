import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { QuotationList, HoldCoverMonitoringList, DummyInfo, QuoteEndorsement, QuotationOption, QuotationOtherRates, IntCompAdvInfo, AttachmentInfo, QuotationProcessing, QuotationCoverageInfo, QuotationHoldCover, ItemInformation, ReadyForPrint, OpenCoverProcessing, Risks, QuotationDeductibles, EditableDummyInfo, OpenCoverList, ALOPItemInformation, OcGenInfoInfo, HoldCoverInfo } from '@app/_models';
import { isNull, nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { NULL_INJECTOR } from '@angular/core/src/render3/component';
import { isNullOrUndefined } from 'util';
import { NullTemplateVisitor } from '@angular/compiler';
import { map,catchError } from 'rxjs/operators';
import { Alert2Service } from '@app/_services/alert2.service';


@Injectable({ providedIn: 'root' })
export class QuotationService {
    quotationOption: QuotationOption[] = [];
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
    openCoverProcessing: OpenCoverProcessing[] = [];
    risksData: Risks[] = [];
    quoteDeductiblesData: QuotationDeductibles[] = [];
    editableDummyInfoData: EditableDummyInfo[] = [];
    openCoverList: OpenCoverList[]=[];
    aLOPItemInfos: ALOPItemInformation[]=[];
    ocGenInfoData: OcGenInfoInfo[]=[];
    holdCoverInfo: HoldCoverInfo[]=[];

    rowData: any[] = [];
    toGenInfo: any[] = [];
    /*newRec = {
        new: false,
        line: '',
        quotationNo: '',
        typeOfCession: '',
        savingType: 'normal'
    }*/

    savingType: string = 'normal';
    currentUserId: string = JSON.parse(window.localStorage.currentUser).username;

    constructor(private http: HttpClient, private alertService: Alert2Service) {

    }

    showMsgs(response):any{
        for(let msg of response['messageList']){
            this.alertService.success(msg.message);
        }
        for(let msg of response['errorList']){
            this.alertService.error(msg.errorMessage);
        }
        return response;
    }

    conError(){
        this.alertService.error('Cannot connect to server.');
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

    getCoverageInfo(quotationNo?:any , quotationId?: string) {




        const params = new HttpParams()
             .set('quotationNo', (quotationNo === null || quotationNo === undefined ? '' : quotationNo) )
             .set('quoteId',(quotationId === null || quotationId === undefined ? '' : quotationId) )
        return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteCoverage",{params});
    }

    getQuotationListInfo() {
        this.quotationListData = [
            new QuotationList("CAR-2015-00028-32-01", "Direct", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP", new Date("12-20-2018"), new Date(), "Inigo Flores", "Cuaresma", "Juan Cruz"),
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


    getQuotationHoldCoverInfo(searchParams: any[]) {
        this.holdCoverMonitoringListData = [
            new HoldCoverMonitoringList("HC-CAR-2018-00001-00", "Open", "Phil. Guaranty", "CAR-2018-00066-00-31", "Malayan", "5K Builders", new Date('2018-12-01'), new Date('2018-12-31'), "P8M001KJ", "Juan Cruz", new Date('2018-12-01')),
            new HoldCoverMonitoringList("HC-EEI-2018-00001-01", "Expired", "Tan-Gatue Adjustment", "EEI-2018-00088-00-67", "FLT Prime", "5K Builders", new Date('2018-11-01'), new Date('2018-11-31'), "MC-MPC-HO-0001", "Rose Lim", new Date('2019-09-09')),
        ];
        //return this.holdCoverMonitoringListData;
        
        var params;

        if(searchParams.length < 1){
            params = new HttpParams()
             .set('quotationNo','')
             .set('status','I')
             .set('cedingName','')
             .set('holdCoverNo','')
             .set('riskName','')
             .set('insuredDesc','')
             .set('periodFrom','')
             .set('periodTo','')
             .set('compRefHoldCovNo','')
             .set('reqBy','')
             .set('reqDate','')
             .set('expiringInDays','')
        }
         else{
             params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }
            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteHoldCoverListing',{params});
    }


    getQuotationHoldCoverList(searchParams: any[]) {
         var params;

          if(searchParams.length < 1){
            params = new HttpParams()
             .set('holdCoverNo','')
             .set('status','')
             .set('cedingName','')
             .set('quotationNo','')
             .set('riskName','')
             .set('insuredDesc','')
             .set('periodFrom','')
             .set('periodTo','')
             .set('compRefHoldCovNo','')
             .set('reqBy','')
             .set('reqDate','')
             .set('expiringInDays','')
             .set('reqDateFrom','')
             .set('reqDateTo','')
        }
         else{
             params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }
            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteHoldCoverListing',{params});
    }




    getSelectedQuotationHoldCoverInfo(quotationNo) {
        const params = new HttpParams()
             .set('quotationNo',quotationNo)
             .set('status','')
             .set('cedingName','')
             .set('holdCoverNo','')
             .set('riskName','')
             .set('insuredDesc','')
             .set('periodFrom','')
             .set('periodTo','')
             .set('compRefHoldCovNo','')
             .set('reqBy','')
             .set('reqDate','')
             .set('expiringInDays','')
             
            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteHoldCoverListing',{params});
    }


    getEndorsements(quoteId: string, quotationNo: string, optionNo: string) {

         if (quoteId == '' || quoteId == null ) {
         const params = new HttpParams()
                .set('quoteId','')
                .set('quotationNo',quotationNo)
                .set('optionId',optionNo);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteEndorsements', {params});
          } else {
          const params = new HttpParams()
                .set('quoteId',quoteId)
                .set('quotationNo',quotationNo)
                .set('optionId',optionNo);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteEndorsements', {params});
         }





/*         if (quoteId == '' || quoteId == null ) {
               return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteEndorsements?quotationNo="+quotationNo+"&optionId="+optionNo);
         } else if (quotationNo == '' || quotationNo == null ) {
               return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteEndorsements?quoteId="+quoteId+"&optionId="+optionNo);
         } else {
               return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteEndorsements?quoteId="+quoteId+"&quotationNo="+quotationNo+"&optionId="+optionNo);
         }*/
           


     /*   this.endorsementData = [
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
        return endorsmentData;*/
    }


    getEndorsementsOc(quoteIdOc: string, quotationNo: string) {

         if (quoteIdOc == '' || quoteIdOc == null ) {
         const params = new HttpParams()
                .set('quoteId','')
                .set('quotationNo',quotationNo);
          console.log(params);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteEndorsementsOc?quotationNo=' + quotationNo);
          } else if (quotationNo == '' || quotationNo == null ) {
          const params = new HttpParams()
                .set('quoteId',quoteIdOc)
                .set('quotationNo','');
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteEndorsementsOc?quoteId=' + quoteIdOc);
         } else {
           const params = new HttpParams()
                .set('quoteId',quoteIdOc)
                .set('quotationNo',quotationNo);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteEndorsementsOc?quoteId=' + quoteIdOc + '&quotationNo=' + quotationNo  );   
         }

    }

    getAttachment(quoteId:string,quotationNo?:string) {
        // this.attachmentInfoData = [
        //     new AttachmentInfo("NSO_Birth_Certificate_001", "Policyholder’s details such as name, date of birth, address, gender, occupation"),
        //     new AttachmentInfo("Registration_Number_001", "Vehicle registration number and registration certificate (RC) number"),
        //     new AttachmentInfo("Driving_License_001", "Policyholder’s driving licence information"),
        //     new AttachmentInfo("Passport_Photo_001", "Recent passport sized photograph"),
        //     new AttachmentInfo("Post_Office_Passbook_001", "Proof of address documents "),
        // ];

        const params = new HttpParams()
             .set('quotationNo', (quotationNo === null || quotationNo === undefined ? '' : quotationNo) )
             .set('quoteId',(quoteId === null || quoteId === undefined ? '' : quoteId) )

        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteAttachment',{params});
        // return this.attachmentInfoData;
    }

    getAttachmentOc(quoteIdOc: string, openQuotationNo: string){
        const params = new HttpParams()
                        .set('quoteIdOc', quoteIdOc)
                        .set('openQuotationNo', openQuotationNo);
        return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteAttachmentOc", {params});
    }

    getDummyEditableInfo() {
        /*Dummy Data Array*/
        this.editableDummyInfoData = [
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
            new EditableDummyInfo(1, 'Christopher Jeriel', 'Sarsonas', 'Alcala', 'Male', 25, new Date()),
            new EditableDummyInfo(2, 'Veronica', 'Raymundo', 'C', 'Female', 25, new Date()),
            new EditableDummyInfo(3, 'Elmon', 'Hagacer', 'H', 'Male', 25, new Date()),
        ];


        /*return this.http.get<User[]>(`${environment.apiUrl}/quotation`);*/
        return this.editableDummyInfoData;

    }

    getQuoProcessingData(searchParams: any[]) {        
        var params;
        if(searchParams.length < 1){
             params = new HttpParams()
                    .set('quotationNo','')
                    .set('cessionDesc', '')
                    .set('lineClassCdDesc', '')
                    .set('status','')
                    .set('cedingName','')
                    .set('principalName','')
                    .set('contractorName','')
                    .set('insuredDesc','')
                    .set('riskName','')
                    .set('objectDesc','')
                    .set('site','')
                    .set('currencyCd','')
                    .set('issueDate','')
                    .set('expiryDate','')
                    .set('reqBy','')
                    .set('createUser','');
                    // .set('paginationRequest.position',null)
                    // .set('paginationRequest.count',null)
                    // .set('sortRequest.sortKey',null)
                    // .set('sortRequest.order',null);
        }
        else{
             params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }
        
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteListing', {params})
            .pipe(
                map(a=>this.showMsgs(a)),catchError(e=>{
                    this.conError();
                    throw e;
                })
            );
       
    }

    getSelectedQuote(quoteNo:string){
        // const params = new HttpParams()
        //     .set('quotationNo',quoteNo)
        //     .set('cessionDesc', '')
        //     .set('lineClassCdDesc', '')
        //     .set('status','')
        //     .set('cedingName','')
        //     .set('principalName','')
        //     .set('contractorName','')
        //     .set('insuredDesc','')
        //     .set('riskName','')
        //     .set('objectDesc','')
        //     .set('site','')
        //     .set('currencyCd','')
        //     .set('issueDate','')
        //     .set('expiryDate','')
        //     .set('reqBy','')
        //     .set('createUser','');

            let header : any = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }),
                params : new HttpParams()
                    .set('quotationNo',quoteNo)
                    .set('cessionDesc', '')
                    .set('lineClassCdDesc', '')
                    .set('status','')
                    .set('cedingName','')
                    .set('principalName','')
                    .set('contractorName','')
                    .set('insuredDesc','')
                    .set('riskName','')
                    .set('objectDesc','')
                    .set('site','')
                    .set('currencyCd','')
                    .set('issueDate','')
                    .set('expiryDate','')
                    .set('reqBy','')
                    .set('createUser','')
            };

        // return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteListing', {params});
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteListing', header);
    }

    getQuoteOptions(quoteId?:string,quotationNo?:string) {
        /*this.quotationOption = [
            new QuotationOption(1, 5.05, "Condition", 6, 8, 5),
            new QuotationOption(2, 8, "Stable", 7, 4, 3),
            new QuotationOption(3, 9, "Good", 6, 43, 2)
        ];
        return this.quotationOption;*/

        const params = new HttpParams()
                .set('quoteId',(quoteId === null || quoteId === undefined ? '' : quoteId))
                .set('quotationNo',(quotationNo === null || quotationNo === undefined ? '' : quotationNo));
                console.log(params)
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteOption', {params});
    }

    getQuotataionOtherRates(optionNo: number) {
        /*this.quotataionOtherRates = [
            new QuotationOtherRates(1, 'Others11', 50, 25000),
            new QuotationOtherRates(1, 'Others12', 41, 25000),
            new QuotationOtherRates(1, 'Others13', 75, 750000),
            new QuotationOtherRates(2, 'Others21', 60, 750000),
            new QuotationOtherRates(2, 'Others22', 50, 250000),
            new QuotationOtherRates(2, 'Others23', 65, 13000),
            new QuotationOtherRates(2, 'Others24', 41, 29000),
            new QuotationOtherRates(3, 'Others31', 4, 50000),
            new QuotationOtherRates(3, 'Others32', 3, 83000),
            new QuotationOtherRates(3, 'Others33', 5, 131000),
            new QuotationOtherRates(3, 'Others34', 6, 123400),

        ];
        var quotataionOtherRates = this.quotataionOtherRates.filter(function (itm) {
            return itm.optionNo == optionNo;
        });
        quotataionOtherRates.forEach(function (itm) { delete itm.optionNo; });
        return quotataionOtherRates;*/
    }



    getIntCompAdvInfo(intCompParams: any) {
        const params = new HttpParams()
                .set('quoteId', intCompParams.quoteId)
                .set('quotationNo', intCompParams.quotationNo);
         console.log(params);
        return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuoteCompetition", {params});
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

    getQuoteGenInfo(quoteId : any, quotationNo: string ){
     
     if (quoteId == '' || quoteId == null ) {
         const params = new HttpParams()
                .set('quoteId','')
                .set('quotationNo',quotationNo);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteGeneralInfo', {params});
      } else {
          const params = new HttpParams()
                .set('quoteId',quoteId)
                .set('quotationNo',quotationNo);
          return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteGeneralInfo', {params});
     }
     
    }

    getReadyForPrinting() {
        this.readyForPrinting = [
            new ReadyForPrint("CAR-2018-00088-00-99", "Rose Lim", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', "PHP", new Date(), new Date(), "Rose Lim"),
            new ReadyForPrint("CAR-2018-00088-00-99", "Henry Tui", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', "PHP", new Date(), new Date(), "Rose Lim"),
            new ReadyForPrint("CAR-2018-00088-00-99", "Rose Lim", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', "PHP", new Date(), new Date(), "Rose Lim"),
            new ReadyForPrint("CAR-2018-00088-00-99", "Rose Lim", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", 'ABC Building', 'Cooling Towers', 'Region IV, Laguna, Calamba', "PHP", new Date(), new Date(), "Rose Lim"),
        ];
        return this.readyForPrinting;
    }

    getOpenCoverProcessingData(searchParams: any[]) {
        var params;

        if(searchParams.length < 1){
            params = new HttpParams()
                .set('quotationNo','')
                .set('cessionDesc','')
                .set('lineClassCdDesc','')
                .set('status','')
                .set('cedingName','')
                .set('principalName','')
                .set('contractorName','')
                .set('insuredDesc','')
                .set('riskName','')
                .set('objectDesc','')
                .set('site','')
                .set('currencyCd','')
                .set('issueDate','')
                .set('expiryDate','')
                .set('reqBy','')
                .set('createUser','');
        }
         else{
             params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteListingOc', {params});
    }


    getRisksLOV() {
        this.risksData = [
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
            new Risks('10001', 'Earthquake', 'Region IV', 'Calamba', 'Laguna', 'District I', 'Block IV'),
        ];
        return this.risksData;
    }

    getDeductibles(params:any) {
        // this.quoteDeductiblesData = [
        //     new QuotationDeductibles('Deductible Code', 'Deductible Title', 12, 23000, 'Deductible Text'),
        // ];
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteDeductibles', {params});
    }

    getOpenCoverListInfo() {
        this.openCoverList = [
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01", "PHP"),
            new OpenCoverList("OC-DOS-2015-00028-32-02", "Retrocession", "Calamity", "Concluded", "La Salle", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CEC-2015-00028-32-03", "Direct", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-04", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CEC-2015-00028-32-01", "Direct", "Flood", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-EAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-EAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-EAR-2015-00028-32-03", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-EEI-2015-00028-32-02", "Retrocession", "Fire", "Concluded", "PUP", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-04", "Retrocession", "Calamity", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "University of the Philippines", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-DOS-2015-00028-32-11", "Direct", "Flood", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Del Monte", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CEC-2015-00028-32-01", "Direct", "Calamity", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-EEI-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Ateneo", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CEC-2015-00028-32-02", "Retrocession", "CAR Wet Risks", "Concluded", "Mapua", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-00028-32-01", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-DOS-2015-00028-32-02", "Retrocession", "Fire", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-01", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-01","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
            new OpenCoverList("OC-CAR-2015-0002832-02", "Retrocession", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", "Fairmont Hotel", "Cooling Towers", "Region IV, Laguna, Calamba", "CAR-2018-00001-023-0002-02","PHP"),
        ];
        return this.openCoverList;
    }


    getALOPItemInfos(car: string, quoteId: string, optionId: any, quotationNo?: any) {
        if (car == "CAR") {
            this.aLOPItemInfos.forEach(function (itm) { delete itm.relativeImportance; });
        }
        const params = new HttpParams()
             .set('quotationNo', (quotationNo === null || quotationNo === undefined ? '' : quotationNo) )
             .set('quoteId',(quoteId === null || quoteId === undefined ? '' : quoteId) )
             .set('optionId',(optionId === null || optionId === undefined ? '' : optionId) )
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteAlopItem',{params});
    }

    getALop(quoteId:string,quotationNo?:string){
          const params = new HttpParams()
             .set('quotationNo', (quotationNo === null || quotationNo === undefined ? '' : quotationNo) )
             .set('quoteId',(quoteId === null || quoteId === undefined ? '' : quoteId) )

            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteAlop',{params});
            //+('&quotationNo='+ quotationNo)
        
    }

    getOcGenInfoData(ocQuoteId: string, ocQuoteNo:string){
            const params = new HttpParams()
             .set('quoteIdOc',ocQuoteId)
             .set('openQuotationNo', ocQuoteNo)
             
            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteGeneralInfoOc',{params});
    }

    getHoldCoverInfo(holdCoverId,holdCoverNo){
        this.holdCoverInfo = [];
        const params = new HttpParams()
             .set('holdCoverId','')
             .set('holdCoverNo',holdCoverNo)
             
            return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteHoldCover',{params});
    }

    // saveQuoteAttachment(quoteId:string ,saveAttachmentsList:any[], deleteAttachmentsList:any[]){
    //     let params:any  = {
    //         quoteId: quoteId,
    //         saveAttachmentsList: saveAttachmentsList,
    //         deleteAttachmentsList: deleteAttachmentsList
    //     };
    //     let header : any = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     };
    //     return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAttachment', JSON.stringify(params), header);
    // }

    saveQuoteAttachment(params){
         let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };
         return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAttachment',params,header);
 
    }


    saveQuoteCoverage(quoteId:number,projId: number ,coverageData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteCoverage', JSON.stringify(coverageData), header);
    }

    saveQuoteOtherRates(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log(params);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteOtherRates',params,header);
    }

    saveQuoteAlop(alopData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        
        console.log(alopData);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAlop', JSON.stringify(alopData), header);
    }

    saveQuoteAlopItem(alopItemData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAlopItem', JSON.stringify(alopItemData), header);
              
    }


    saveQuoteAttachmentOc(quoteIdOc:number ,saveAttachmentsOcList: any[], deleteAttachmentsOcList: any[]){
        /*const params = new HttpParams()
             .set('quoteId',quoteId.toString())
             .set('attachmentsList',JSON.stringify(attachmentList))*/
             
        let params:any  = {
            quoteIdOc: quoteIdOc,
            saveAttachmentsOcList: saveAttachmentsOcList,
            deleteAttachmentsOcList: deleteAttachmentsOcList
        }
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAttachmentOc', JSON.stringify(params), header);
    }

      
    saveQuoteCoverageOc(coverageOcData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteCoverageOc', JSON.stringify(coverageOcData), header);
    }
    

     
    saveQuoteCompetition(saveQuoteCompetitionParams: any[]){
        //let params: any = JSON.stringify(saveQuoteCompetitionParams);
        let params: any = {
            saveQuoteCompetition: saveQuoteCompetitionParams
        }
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        //console.log(saveQuoteCompetitionParams.join(","));
        //console.log(params.substring(1,params.length-1));
        //console.log(JSON.stringify(params));
        //return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteCompetition', params.substring(1,params.length-1), header);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteCompetition', JSON.stringify(params), header);
    }

    saveQuoteAdviceWordings(saveQuoteAdviceWordingsParams: any[]){
        let params: any = {
            saveAdviceWordings: saveQuoteAdviceWordingsParams
        }
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        //console.log(saveQuoteCompetitionParams.join(","));
        //console.log(params.substring(1,params.length-1));
        //console.log(JSON.stringify(params));
        //return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteCompetition', params.substring(1,params.length-1), header);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteAdviceWordings', JSON.stringify(params), header);
    }


    saveQuoteGeneralInfo(saveQuoteGeneralInfoParam) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }

        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteGeneralInfo', saveQuoteGeneralInfoParam, header);
    }

     saveQuoteGeneralInfoOc(saveQuoteGeneralInfoParam) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }

        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteGeneralInfoOc', saveQuoteGeneralInfoParam, header);
    }


 
    saveQuoteHoldCover(params){
         let header : any = {
             headers: new HttpHeaders({
                 'Content-Type': 'application/json'
             })
         };
         return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteHoldCover',params,header);
 
    }

    saveQuoteEndorsements(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteEndorsements',params,header);

    }

    getCoverageOc(quoteIdOc:string,openQuotationNo:string){
        const params = new HttpParams()
             .set('quoteIdOc', quoteIdOc)
             .set('openQuotationNo', openQuotationNo);
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteCoverageOc',{params});
    }

    saveQuoteOption(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
         console.log(params);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteOption',params,header);
    }


    saveQuoteEndorsementsOc(params){
          let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteEndorsementsOc',params,header);
    }

    saveQuoteDeductibles(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log(params);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteDeductibles',params,header);
    }


    saveQuoteOptionAll(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log(params);
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteOptionAll',params,header);
    }

    saveChangeQuoteStatus(changeQuoteData:any){

        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuoteChangeQuoteStatus',JSON.stringify(changeQuoteData),header);
    }


    copyEndorsement(params: any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/quote-service/copyEndorsement', params, header);
    }

    saveQuotationCopy(saveQuotationCopyParam) {
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }

        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuotationCopy', saveQuotationCopyParam, header);
    }

    batchPrint(params) {  
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          });

          return this.http.post(environment.prodApiUrl + '/util-service/mergePDF', params, {headers: headers, responseType: 'blob' as 'json' });
    }

    downloadPDF(reportName : string, quoteId : string){
         const params = new HttpParams()
             .set('reportName', reportName)
             .set('quoteId', quoteId)
             .set('userId', this.currentUserId);
        return this.http.get(environment.prodApiUrl + '/util-service/generateReport',{ params,'responseType': 'blob'});
    }

    downloadPDFIntComp(adviceNo : string, quoteId : string){
         const params = new HttpParams()
             .set('reportName', 'QUOTER007')
             .set('adviceNo', adviceNo)
             .set('quoteId', quoteId)
             .set('userId', this.currentUserId);
        return this.http.get(environment.prodApiUrl + '/util-service/generateReport',{ params,'responseType': 'blob'});
    }

    downloadPDFHC(reportName : string, quoteId : string,  holdCoverId : string){
         const params = new HttpParams()
             .set('reportName', reportName)
             .set('quoteId', quoteId)
             .set('holdCovId', holdCoverId)
             .set('userId', this.currentUserId);
        return this.http.get(environment.prodApiUrl + '/util-service/generateReport',{ params,'responseType': 'blob'});
    }

    getSearchQuoteInfo(lineCd,quoteYear,quoteSeqNo,quoteRevNo,quoteCedingId){
        const params = new HttpParams()
             .set('lineCd',lineCd)
             .set('quoteYear',quoteYear)
             .set('quoteSeqNo',quoteSeqNo)
             .set('quoteRevNo',quoteRevNo)
             .set('quoteCedingId',quoteCedingId)
        return this.http.get(environment.prodApiUrl + '/quote-service/searchQuoteInfo',{params});
    }

    updateHoldCoverStatus(params){
        let header : any = {
            headers: new HttpHeaders({
                 'Content-Type': 'application/json'
            })
        };
       return this.http.post(environment.prodApiUrl + '/quote-service/updateHoldCoverStatus', params, header);
    }
  
    renumber(quoteId:string ){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        let params: any = {
            quoteId: quoteId
        }
        return this.http.post(environment.prodApiUrl + '/quote-service/renumberQuoteOptions',JSON.stringify(params),header);
    }

    retrieveQuoteApprover(quoteId: string) {
        const params = new HttpParams()
             .set('quoteId', (quoteId === null || quoteId === undefined ? '' : quoteId) );
        return this.http.get(environment.prodApiUrl + '/quote-service/retrieveQuoteApprover',{params});
    }

    updateQuoteStatus(quoteId:string, status:string, approvedBy?:string){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        let params: any = {
            quoteId : quoteId,
            status : status,
            approvedBy : approvedBy
        }
        return this.http.post(environment.prodApiUrl + '/quote-service/updateQuoteStatus',JSON.stringify(params),header);
    }

    getItemInfoData(quoteId) {
        /*this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];*/
         const params = new HttpParams()
             .set('quoteId', (quoteId === null || quoteId === undefined ? '' : quoteId) )
        return this.http.get(environment.prodApiUrl + "/quote-service/retrieveQuItem",{params});;
    }

    saveItem(params){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/quote-service/saveQuItem',JSON.stringify(params),header);
    }

}