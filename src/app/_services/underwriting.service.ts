import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DummyInfo, UnderwritingCoverageInfo, UnderwritingOtherRatesInfo, PolicyCoInsurance, PARListing, AltPARListing, ExpiryListing, CreateParTable, RenewedPolicy, PolAttachmentInfo, PolicyPrinting, PrinterList, ALOPItemInformation, UnderwritingPolicyInquiryInfo, ItemInformation, UnderwritingPolicyDistList, DistributionByRiskInfo, PolicyEndorsement, PolItem_MLP, PolGoods_DOS, PolMachinery_DOS, PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges, PolItem_CEC, TotalPerSection, UnderwritingBatchPosting, UnderwritingBatchDistribution, MaintenanceDeductibles, MaintenanceRisks, CoverageDeductibles, CedingCompanyList, CedingCompany } from '@app/_models';



@Injectable({ providedIn: 'root' })
export class UnderwritingService {
    header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
     };

    dummyInfoData: DummyInfo[] = [];
    alterationFromQuotation: CreateParTable[] = [];
    uwCoverageDeductible : CoverageDeductibles[];
    uwcoverageInfoData: UnderwritingCoverageInfo[] = [];
    uwotherRatesInfoData: UnderwritingOtherRatesInfo[] = [];
    coInsuranceData: PolicyCoInsurance[] = [];
    parListingData: PARListing[] = [];
    altParListingData: AltPARListing[] = [];
    polAttachmentInfoData: PolAttachmentInfo[] = [];
    expiryListing: ExpiryListing[] = [];
    renewedPolicies: RenewedPolicy[] = [];
    policyPrinting: PolicyPrinting[] = [];
    printerList: PrinterList[] = [];
    aLOPItemInfos: ALOPItemInformation[] = [];
    policyInquiry: UnderwritingPolicyInquiryInfo[] = [];
    itemInfoData: ItemInformation[] = [];
    policyEndorsement: PolicyEndorsement[] = [];
    policyDistListData: UnderwritingPolicyDistList[] = [];
    distributionByRiskData: DistributionByRiskInfo[] = [];
    policyInwardPolicy: PolicyInwardPolBalance[] = [];
    polInwardBalOtherCharges: PolInwardPolBalanceOtherCharges[] = [];
    polItemMLP: PolItem_MLP[] = [];
    polGoodsDOS: PolGoods_DOS[] = [];
    polMachineryDOS: PolMachinery_DOS[] = [];
    polCEC: PolItem_CEC[] = [];
    totalPerSection: TotalPerSection[] = [];
    batchPosting: UnderwritingBatchPosting[]= [];
    batchDistribution: UnderwritingBatchDistribution[] = [];
    maintenanceDeductiblesData: MaintenanceDeductibles[] = [];
    maintenanceRiskListData: MaintenanceRisks[] = [];
    cedingCompanyList: CedingCompanyList[] = [];
    cedingComapny: CedingCompany[]=[];

    rowData: any[] = [];
    toPolInfo: any[] = [];
    fromCreateAlt: boolean = false;

    showPolicyNo:string = '';

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


    getAlterationFromQuotation() {
        this.alterationFromQuotation = [
            new CreateParTable("CAR-2015-0002832-01", "Direct", "CAR Wet Risks", "Issued", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", new Date(), new Date(), "Inigo Flores", "Cuaresma"),
            new CreateParTable("CAR-2015-0002832-02", "Branch 2", "CAR Wet Risks", "Issued", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE International Corp", new Date(), new Date(), "Inigo Flores", "Cuaresma"),
        ];

        return this.alterationFromQuotation;
    }

    getCoInsurance() {
        const params = new HttpParams()
             .set('policyId','')
             .set('policyNo','')
             
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolCoInsurance',{params});
    }

    /*getUWCoverageInfo() {
        this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("1", "I", "3", "1000000", "12.2", "69000", "70000"),
            new UnderwritingCoverageInfo("2", 'II', "2", "150000", "15.16", "123000", "456000")
        ];
        return this.uwcoverageInfoData;
    }*/

    getUWCoverageDeductibles(params?) {
        // this. uwCoverageDeductible = [
        //     new CoverageDeductibles("AOG30", "ACTS OF GOD 30", 0.50 ,null, "Acts of Nature - Php 1,800,000.00 each and every loss"),
        //     new CoverageDeductibles("AOC31", '39,000 - AOC',null,39000, "Any Other Cause = Php 39,000.00 for each and every loss"),
        //     new CoverageDeductibles("AOG32", "ACTS OF GOD 30", 0.30 ,null, "Acts of Nature - Php 1,800,000.00 each and every loss"),
        //     new CoverageDeductibles("AOC33", '39,000 - AOC',null,390000, "Any Other Cause = Php 390,000.00 for each and every loss"),
        //     new CoverageDeductibles("AOG34", "ACTS OF GOD 30", 0.20 ,null, "Acts of Nature - Php 1,800,000.00 each and every loss"),
        //     new CoverageDeductibles("AOC35", '39,000 - AOC',null,390000, "Any Other Cause = Php 390,000.00 for each and every loss")
        // ];
        // return this.uwCoverageDeductible ;
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyDeductibles', {params});
    }

    getUWCoverageInfos(policyNo:any , policyId: string) {
        /*this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("1", "I", "3", "1000000", "12.2", "69000", "70000"),
            new UnderwritingCoverageInfo("2", 'II', "2", "150000", "15.16", "123000", "456000")
        ];*/

         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        //return   this.http.get("http://localhost:8888/api/undewriting-service/retrievePolCoverage",{params});
        return  this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolCoverage",{params});
    }



    getUWOtherRatesInfo() {
        this.uwotherRatesInfoData = [
            new UnderwritingOtherRatesInfo("Sample 1", 123000, "Remarks 1"),
            new UnderwritingOtherRatesInfo("Sample 2", 321000, "Remarks 2"),
        ];
        return this.uwotherRatesInfoData;
    }

    extractExpiringPolicies(params?) {
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/extractExpiringPolicy',JSON.stringify(params),this.header);
        //console.log("extractExpiringPolicies :" + JSON.stringify(response));
        //return 100;
    }

    newGetParListing(params) {
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyListing',{params:params});
    }

    getParListing(searchParams: any []) {
        var params;
        if(searchParams.length < 1){
             params = new HttpParams()
                    .set('policyNo','')
                    .set('cessionDesc', '')
                    .set('cedingName', '')
                    .set('lineClassDesc','')
                    .set('insuredDesc','')
                    .set('riskName','')
                    .set('objectDesc','')
                    .set('site','')
                    .set('currencyCd','')
                    .set('totalSiLess','')
                    .set('totalSiGrt','')
                    .set('totalPrem','')
                    .set('issueDateFrom','')
                    .set('issueDateTo','')
                    .set('inceptDateFrom','')
                    .set('inceptDateTo','')
                    .set('expiryDateFrom','')
                    .set('expiryDateTo','')
                    .set('acctDateFrom','')
                    .set('acctDateTo','')
                    .set('statusDesc','');
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
         return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyListing',{params});
    }


    getAltParListing(searchParams: any []) {
       /* this.altParListingData = [
            new AltPARListing("CAR-2018-000002-021-0192-001", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-002", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-003", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-004", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-005", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-006", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-007", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-008", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
        ];

        return this.altParListingData;*/
        var params;
        if(searchParams.length < 1){
             params = new HttpParams()
                    .set('policyNo','')
                    .set('cessionDesc', '')
                    .set('cedingName', '')
                    .set('lineClassDesc','')
                    .set('insuredDesc','')
                    .set('riskName','')
                    .set('objectDesc','')
                    .set('site','')
                    .set('currencyCd','')
                    .set('totalSiLess','')
                    .set('totalSiGrt','')
                    .set('totalPrem','')
                    .set('issueDateFrom','')
                    .set('issueDateTo','')
                    .set('inceptDateFrom','')
                    .set('inceptDateTo','')
                    .set('expiryDateFrom','')
                    .set('expiryDateTo','')
                    .set('acctDateFrom','')
                    .set('acctDateTo','')
                    .set('statusDesc','');
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
         return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyListing',{params});
    }

    getPolAttachment(policyId: string, policyNo: string) {
        const params = new HttpParams()
             .set('policyId', (policyId === null || policyId === undefined ? '' : policyId) )
             .set('policyNo',(policyNo === null || policyNo === undefined ? '' : policyNo) )

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolAttachment',{params});
    }


    getExpiryListing() {
        this.expiryListing = [
            new ExpiryListing("POL-0050", "I", "San Juan", "CPI", "insured", "Sample Data", "II", "Paul", "Peso", "IV", "si", "pre"),
            new ExpiryListing("POL-0051", "II", "Muntinlupa", "The Company", "insured", "Sample Data", "II", "Christian", "Peso", "IV", "si", "pre"),
            new ExpiryListing("POL-0051", "II", "Muntinlupa", "The Company", "insured", "Sample Data", "II", "Christian", "Peso", "IV", "si", "pre")
        ];
        return this.expiryListing;
    }



    renewExpiredPolicies() {
        this.renewedPolicies = [
            new RenewedPolicy("POL-0050", "POL-2018"),
            new RenewedPolicy("POL-0051", "POL-2019")
        ];
        return this.renewedPolicies;
    }

    printingPolicy() {
        this.policyPrinting = [
            new PolicyPrinting(null, null, null, null)
        ];
        return this.policyPrinting;
    }

    getPrinterName() {
        this.printerList = [
            new PrinterList("\\\\printer-server\\HP LaserJet MFP M129-M134 PCLms"),
            new PrinterList("\\\\printer-server\\Canon Pixma MG4250"),
            new PrinterList("\\\\printer-server\\Epson Ecotank ET-2600"),
        ];
        return this.printerList;
    }

    getALOPItemInfos(car: string) {
        this.aLOPItemInfos = [
            new ALOPItemInformation(1, 5, "desc", "rel import", "min loss"),
            new ALOPItemInformation(2, 7, "description", "relative import", "min loss")
        ]
        if (car == "CAR") {
            this.aLOPItemInfos.forEach(function (itm) { delete itm.relativeImportance; });
        }
        return this.aLOPItemInfos;
    }

    getPolicyInquiry(params?) {
        // this.policyInquiry = [
        //   new UnderwritingPolicyInquiryInfo("CAR", "CAR-2018-000001-099-0001-000", "Direct", "Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 10000000, 131000,  new Date("02-09-2018"), new Date("02-09-2018"), new Date("02-09-2018"), new Date("02-28-2019"),"In Progress"),
        //   new UnderwritingPolicyInquiryInfo("CAR", "CAR-2018-000001-098-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 1080000, 131000,  new Date("03-09-2018"), new Date("03-09-2018"), new Date("03-09-2018"), new Date("03-30-2019"),"Issued"),
        //   new UnderwritingPolicyInquiryInfo("EAR", "EAR-2018-000001-097-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 8090000, 131000,  new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2019"),"In-Forced"),
        //   new UnderwritingPolicyInquiryInfo("EEI", "EEI-2018-000001-096-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 8090000, 131000,  new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2019"),"In-Forced"),
        //   new UnderwritingPolicyInquiryInfo("MBI", "MBI-2018-000001-095-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 8090000, 131000,  new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2019"),"Spolied"),
        //   new UnderwritingPolicyInquiryInfo("MLP", "MLP-2018-000001-094-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 8090000, 131000,  new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2019"),"Expired"),
        //   new UnderwritingPolicyInquiryInfo("DOS", "DOS-2018-000001-093-0001-000", "Direct", "FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna, Calamba", "PHP", 8090000, 131000,  new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2019"),"Cancelled"),
        //   new UnderwritingPolicyInquiryInfo("CAR","CAR-2018-000002-092-0003-000", "Direct","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",8090000,131000, new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2018"), "In-Force"),
        //   new UnderwritingPolicyInquiryInfo("CAR","CAR-2018-000002-091-0004-000", "Direct","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",9000000,131000, new Date("05-09-2018"), new Date("05-09-2018"), new Date("05-09-2018"), new Date("05-30-2018"), "In-Force"),
        //   new UnderwritingPolicyInquiryInfo("CAR","CAR-2018-000002-090-0005-000", "Direct","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date("06-09-2018"), new Date("06-09-2018"), new Date("06-09-2018"), new Date("06-30-2018"), "Spoiled"),
        //   new UnderwritingPolicyInquiryInfo("CAR","CAR-2018-000002-089-0006-000", "Direct","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date("07-09-2018"), new Date("07-09-2018"), new Date("07-09-2018"), new Date("07-30-2018"), "Cancelled"),
        //   new UnderwritingPolicyInquiryInfo("CAR","CAR-2018-000002-088-0007-000", "Direct","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",1080000,131000, new Date("08-09-2018"), new Date("08-09-2018"), new Date("08-09-2018"), new Date("08-30-2018"), "In-force"),

        // ];
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyListing');
    }

    getItemInfoData(policyNo?, policyId?) {
        /*this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];*/
         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolItem",{params});;
    }


    getPolicyEndorsement(policyId: string, policyNo: string) {
        const params = new HttpParams()
             .set('policyId', (policyId === null || policyId === undefined ? '' : policyId) )
             .set('policyNo',(policyNo === null || policyNo === undefined ? '' : policyNo) )
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolEndt",{params}) ;
    }

    getPolicyDistListInfo() {
        this.policyDistListData = [
            new UnderwritingPolicyDistList(10001, 10001, 'Distributed but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10002, 10002, 'Distributed but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10003, 10003, 'Distributed but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10004, 10004, 'Distributed but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10005, 10005, 'Distributed but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10006, 10006, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10007, 10007, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10008, 10008, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10009, 10009, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10010, 10010, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
            new UnderwritingPolicyDistList(10011, 10011, 'Distributed but not posted', 'EAR', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Php',1000000,new Date(), new Date(),),
        ];

        return this.policyDistListData;

    }

    getDistByRiskData() {
        this.distributionByRiskData = [
            new DistributionByRiskInfo("QS", "QS Pool", "38.000000", "570,000,000.00", "142,500.00", "30.000000"),
            new DistributionByRiskInfo("QS", "PhilNaRe", "2.000000", "30,000,000.00", "7,500.00", "30.000000"),
            new DistributionByRiskInfo("QS", "Munich Re", "60.000000", "627,800,000.00", "156,950.00", "30.000000"),
            new DistributionByRiskInfo("1Surp", "PhilNaRe", "95.000000", "258,590,000.00", "64,647.50", "64,647.50"),
            new DistributionByRiskInfo("1Surp", "Munich Re", "5.000000", "13,610,000.00", "3,420.50", "3420.50"),
            new DistributionByRiskInfo("2Surp", "PhilNaRe", "95.000000", "1,425,000,000.00", "356,250.00", "356,250.00"),
            new DistributionByRiskInfo("2Surp", "Munich Re", "5.000000", "75,000,000.00", "18,750.00", "18,750.00"),
            new DistributionByRiskInfo("Facul", "Munich Re", "100.000000", "1,000,000,000.00", "250,000.00", "250,000.00"),
        ];
        return this.distributionByRiskData;
    }



    getInwardPolBalance(policyId?,policyNo?) {
         let params:any = {
             policyId : policyId == null ? '' :policyId,
             policyNo: policyNo == null ? '' :policyNo
         }
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolInwardBal',{params});
    }

    // getInwardPolBalanceOtherCharges() {
    //     this.polInwardBalOtherCharges = [
    //         new PolInwardPolBalanceOtherCharges("101", "Description 101", "20000"),
    //         new PolInwardPolBalanceOtherCharges("102", "Description 102", "800000"),
    //     ];
    //     return this.polInwardBalOtherCharges;
    // }


    getPolItemMLPData() {
        this.polItemMLP = [
            new PolItem_MLP("Item 1", 5, "sample item", 4, 3, 2),
            new PolItem_MLP("Item 1", 5, "sample item", 4, 3, 2),
        ];
        return this.polItemMLP;
    }

    getPolGoodsDOSData() {
        this.polGoodsDOS = [
            new PolGoods_DOS("item 1", "chamber 1", "wet goods", "period", 15458),
            new PolGoods_DOS("item 2", "chamber 2", "dry goods", "period", 4542),
        ];
        return this.polGoodsDOS;
    }

    getPolMachineryDOSData() {
        this.polMachineryDOS = [
            new PolMachinery_DOS("item 1", 2, "description", 2, 7453),
            new PolMachinery_DOS("item 2", 5, "desc", 2, 12547),
        ];
        return this.polMachineryDOS;
    }

    getPolCECData() {
        this.polCEC = [
            new PolItem_CEC('item 1', 'Item and Location', 'dedctibles', 10000),
            new PolItem_CEC('item 2', 'Item and Location', 'dedctibles', 10000),
        ]
        return this.polCEC;
    }

    getTotalPerSection() {
        this.totalPerSection = [
            new TotalPerSection("SECTION I", "", ""),
            new TotalPerSection("SECTION II", "", ""),
            new TotalPerSection("SECTION III", "", ""),
        ]
    }
    
    // getMaintenanceDeductibles(){
    //     this.maintenanceDeductiblesData = [
    //         new MaintenanceDeductibles(true,'AOG30', 'ACTS OF GOD 30', 'L', 0.4, 10000000000),
    //         new MaintenanceDeductibles(true,'OC31', 'OTHER CAUSES 31', 'L', 0.5, 10000000),
    //         new MaintenanceDeductibles(false,'TPL5', 'THIRD PARTY LIABILITY 30', 'F', 0.4, 20000000000),
    //     ];
    //     // return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnDeductibles");
    //     return this.maintenanceDeductiblesData;
    // }
    getMaintenanceDeductibles(lineCd?:string,deductibleCd?:string,
                              coverCd?:string,endtCd?:string,
                              activeTag?:string,defaultTag?:string, filterObj?:any){
        // this.maintenanceDeductiblesData = [
        //     new MaintenanceDeductibles(true,'AOG30', 'ACTS OF GOD 30', 'L', 0.4, 10000000000),
        //     new MaintenanceDeductibles(true,'OC31', 'OTHER CAUSES 31', 'L', 0.5, 10000000),
        //     new MaintenanceDeductibles(false,'TPL5', 'THIRD PARTY LIABILITY 30', 'F', 0.4, 20000000000),
        // ];
        let params : any = {
                                'lineCd' : lineCd !== undefined ? lineCd:'' ,
                                'deductibleCd' : deductibleCd !== undefined ? deductibleCd:'' ,
                                'coverCd' : coverCd !== undefined ? coverCd:'' ,
                                'endtCd' : endtCd !== undefined ? endtCd:'' ,
                                'activeTag' : activeTag !== undefined ? activeTag:'' ,
                                'defaultTag' : defaultTag !== undefined ? defaultTag:'' 
                            }
        params = {...params , ...filterObj};
        return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnDeductibles",{params:params}) ;
    }
    
    getMaintenanceRisksListData(){
        this.maintenanceRiskListData = [
            new MaintenanceRisks(true, '00001', 'Filsyn - MBI', 'Filsyn', 'SOUTHERN TAGALOG', 'LAGUNA', 'SANTA ROSA', 'STA.ROSA/BEL-AIR', 'UNBLK', '', ''),
        ];
        return this.maintenanceRiskListData;

    }

    getPolicyBatchPosting() {
        this.batchPosting = [
            new UnderwritingBatchDistribution(10001, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000001-099-0001-000', 'Direct','Phil Guaranty', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',10000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10002, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Summa Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',1080000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10003, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Trust Assurance', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',8090000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10004, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Charter Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',90000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10005, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Capital Insurance', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',100000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10006, 10001, 'Dist. but not posted', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Afisco Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',100000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10007, 10002, 'Dist. but not posted', 'EAR', 'EAR-2018-000002-021-0192-090', 'Direct','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',1080000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10008, 10002, 'Dist. but not posted', 'EAR', 'EAR-2018-000002-021-0192-090', 'Direct','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',9000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10009, 10002, 'Dist. but not posted', 'EAR', 'EAR-2018-000002-021-0192-090', 'Retrocession','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',8090000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10010, 10002, 'Dist. but not posted', 'EAR', 'EAR-2018-000002-021-0192-090', 'Retrocession','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',8870000,131000,new Date(),new Date,new Date(), new Date(),null),
            
        ];
        return this.batchPosting;

    }


    getPolicyBatchDistribution() {
        this.batchDistribution = [
            new UnderwritingBatchDistribution(10001, 10001, 'Undistributed', 'CAR', 'CAR-2018-000001-099-0001-000', 'Direct','Phil Guaranty', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',10000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10002, 10001, 'Undistributed', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Summa Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',1080000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10003, 10001, 'Undistributed', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Trust Assurance', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',8090000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10004, 10001, 'Undistributed', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Charter Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',90000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10005, 10001, 'Undistributed', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Capital Insurance', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',100000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10006, 10001, 'Undistributed', 'CAR', 'CAR-2018-000002-021-0192-090', 'Direct','Afisco Ins.', 'Aboitiz Marketing / A. C. G.', 'Consoldt\'d Orix Leasing','Cooling Towers','Brgy Silang, Naic, Cavite','Php',100000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10007, 10002, 'Undistributed', 'EAR', 'EAR-2018-000002-021-0192-090', 'Direct','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',1080000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10008, 10002, 'Undistributed', 'EAR', 'EAR-2018-000002-021-0192-090', 'Direct','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',9000000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10009, 10002, 'Undistributed', 'EAR', 'EAR-2018-000002-021-0192-090', 'Retrocession','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',8090000,131000,new Date(),new Date,new Date(), new Date(),null),
            new UnderwritingBatchDistribution(10010, 10002, 'Undistributed', 'EAR', 'EAR-2018-000002-021-0192-090', 'Retrocession','Battad Insurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT','Cooling Towers','Brgy Silang, Naic Cavite','Php',8870000,131000,new Date(),new Date,new Date(), new Date(),null),
            
        ];

        return this.batchDistribution;

    }

    
    getRowData() {
        return this.rowData;
    }

    getCedingCompanyList(cedingId,cedingName,cedingAbbr,address,membershipDate,terminationDate,inactiveDate,activeTag,govtTag,membershipTag,filters?){
        /*this.cedingCompanyList = [
            new CedingCompanyList('y','y','',1,'AFP GENERAL INSURANCE CORP.','AFP', 'Col. Boni Serrano Road E. Delos Santos Ave.', new Date(2015,2,9),null,null),
        ]
        return this.cedingCompanyList; */
        let params = {
            'cedingId':cedingId,
            'cedingName':cedingName,
            'cedingAbbr':cedingAbbr,
            'address':address,
            'membershipDate':membershipDate,
            'terminationDate':terminationDate,
            'inactiveDate':inactiveDate,
            'activeTag':activeTag,
            'govtTag':govtTag,
            'membershipTag':membershipTag
        };

        params = {...params,...filters};

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompanyListing', {params:params});
    }

    getCedingCompany(){
        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompany');
    }

    getCedingCompanyLOV(cedingId: string){
         const params = new HttpParams()
            .set('cedingId',cedingId);
        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompany',{params});
    }

    savePolDeductibles(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolicyDeductibles',JSON.stringify(params),this.header);
    }

    savePolAttachment(policyId:number ,savePolAttachments: any[], deletePolAttachments: any[]){
        /*const params = new HttpParams()
             .set('quoteId',quoteId.toString())
             .set('attachmentsList',JSON.stringify(attachmentList))*/
             
        let params:any  = {
            policyId: policyId,
            savePolAttachments: savePolAttachments,
            deletePolAttachments: deletePolAttachments
        }
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAttachment', JSON.stringify(params), this.header);
    }

    savePolAttachmentOc(policyIdOc:number ,savePolAttachments: any[], deletePolAttachments: any[]){
        /*const params = new HttpParams()
             .set('quoteId',quoteId.toString())
             .set('attachmentsList',JSON.stringify(attachmentList))*/
             
        let params:any  = {
            policyId: policyIdOc,
            savePolAttachments: savePolAttachments,
            deletePolAttachments: deletePolAttachments
        }
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAttachmentOc', JSON.stringify(params), this.header);
    }

    savePolHoldCover(holdCoverParams: any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolHoldCover', JSON.stringify(holdCoverParams), this.header);
    }

    saveInwardPolBal(params){
         
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolInwardBal', JSON.stringify(params), this.header);
    }

    getCATPeril(policyNo:any , policyId: string) {
         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        return  this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolCATPeril",{params});
    }

    savePolCoverage(coverageData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolCoverage', JSON.stringify(coverageData), this.header);
    }

    savePolEndt(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolEndorsement', JSON.stringify(params), this.header);
    }

    saveCatPeril(catPeriLData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolCATPeril', JSON.stringify(catPeriLData), this.header);
    }

    getPolAlop(policyId:string, policyNo?:string) {
        const params = new HttpParams()
            .set('policyId', (policyId === null || policyId === undefined ? '' : policyId))
            .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo))

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolAlop',{params});
    }

    getPolAlopItem(car: string, policyId: string, policyNo: any) {
        if (car == "CAR") {
            this.aLOPItemInfos.forEach(function (itm) { delete itm.relativeImportance; });
        }
        const params = new HttpParams()
             .set('policyId', (policyId === null || policyId === undefined ? '' : policyId) )
             .set('policyNo',(policyNo === null || policyNo === undefined ? '' : policyNo) )
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolAlopItem',{params});
    }

    getPolCoInsurance(policyId: string, policyNo: string) {
        const params = new HttpParams()
            .set('policyId', (policyId === null || policyId === undefined ? '' : policyId))
            .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo))

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolCoInsurance',{params});
    }

    savePolAlop(polAlopData: any) {
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAlop', JSON.stringify(polAlopData), this.header);
    }

    getPolicyInformation(policyId,policyNo?){
        const params = new HttpParams()
            .set('policyId',policyId===undefined?'':policyId)
            .set('policyNo',policyNo===undefined?'':policyNo);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyInformation',{params})
    }

    retrievePolHoldCover(policyId: string, policyNo: string, holdCovId: string){
        const params = new HttpParams()
            .set('policyId',policyId === undefined || policyId === null || policyId === '' ? '' : policyId)
            .set('policyNo',policyNo === undefined || policyNo === null || policyNo === '' ? '' : policyNo)
            .set('holdCovId',holdCovId === undefined || holdCovId === null || holdCovId === '' ? '' : holdCovId);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolHoldCover',{params});
    }

    saveItem(itemData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolItem', JSON.stringify(itemData), this.header);
    }

    savePolAlopItem(polAlopItemData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAlopItem', JSON.stringify(polAlopItemData), this.header);
    }


    savePolicyDetails(savePolicyDetailsParam: any) {
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolicyDetails', JSON.stringify(savePolicyDetailsParam), this.header);
    }


    updatePolHoldCoverStatus(params: any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolHoldCoverStatus', JSON.stringify(params), this.header);
    }

    getSumInsOc(policyId){
        const params = new HttpParams()
            .set('policyId',policyId === undefined || policyId === null || policyId === '' ? '' : policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolCoverageOc',{params});
    }

    saveSumInsOC(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveSumInsOC', JSON.stringify(params), this.header);
    }

    saveOpenPolDetails(params: any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveOpenPolDetails', JSON.stringify(params), this.header);
    }


    getPolListingOc(searchParams: any []) {
        var params;
        if(searchParams.length < 1){
             params = new HttpParams()
                    .set('policyNo','')
                    .set('cessionDesc', '')
                    .set('cedingName', '')
                    .set('lineClassDesc','')
                    .set('insuredDesc','')
                    .set('riskName','')
                    .set('objectDesc','')
                    .set('site','')
                    .set('currencyCd','')
                    .set('totalSiLess','')
                    .set('totalSiGrt','')
                    .set('totalPrem','')
                    .set('issueDateFrom','')
                    .set('issueDateTo','')
                    .set('inceptDateFrom','')
                    .set('inceptDateTo','')
                    .set('expiryDateFrom','')
                    .set('expiryDateTo','')
                    .set('acctDateFrom','')
                    .set('acctDateTo','')
                    .set('statusDesc','');
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
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyOCListing',{params});
    }

    retrievePolicyApprover(policyId: string) {
        const params = new HttpParams()
             .set('policyId', (policyId === null || policyId === undefined ? '' : policyId) );
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyApprover',{params});
    }

    getPolGenInfo(policyId: any, policyNo?: any) {
        const params = new HttpParams()
            .set('policyId', (policyId === null || policyId === undefined ? '' : policyId))
            .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo));
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolGenInfo',{params});
    }

    savePolGenInfo(savePolGenInfoParam:any){
        

        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolGenInfo', JSON.stringify(savePolGenInfoParam), this.header);
    }  

    updatePolGenInfo(savePolGenInfoParam:any){
        

        return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolGenInfo', JSON.stringify(savePolGenInfoParam), this.header);
    }  

    getPolicyEndorsementOC(policyId: string, policyNo: string) {
        const params = new HttpParams()
             .set('policyIdOc', (policyId === null || policyId === undefined ? '' : policyId) )
             .set('openPolicyNo',(policyNo === null || policyNo === undefined ? '' : policyNo) )
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolEndtOc",{params}) ;
    }

    savePolEndtOc(params){
        

        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolEndtOc', JSON.stringify(params), this.header);
    }

    getPolAttachmentOc(policyIdOc: string, openPolicyNo: string) {
        const params = new HttpParams()
             .set('policyIdOc', (policyIdOc === null || policyIdOc === undefined ? '' : policyIdOc) )
             .set('openPolicyNo',(openPolicyNo === null || openPolicyNo === undefined ? '' : openPolicyNo) )

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolAttachmentOc',{params});
    }

    getPolHoldCoverList(searchParams: any[]) {
         var params;

          if(searchParams.length < 1){
            params = new HttpParams()
                .set('holdCovNo','')
                .set('status','')
                .set('cedingName','')
                .set('policyNo','')
                .set('riskName','')
                .set('insuredName','')
                .set('periodFrom','')
                .set('periodTo','')
                .set('compRefHoldCovNo','')
                .set('reqBy','')
                .set('reqDateFrom','')
                .set('reqDateTo','')
                .set('expiringInDays','')        }

         else{
             params = new HttpParams();
            for(var i of searchParams){
                params = params.append(i.key, i.search);
            }
        }
            return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolHoldCoverListing',{params});
    }

    getSelectedPolHc(holdcovNo){
        var params = new HttpParams()
                .set('holdCovNo',holdcovNo)
                .set('status','')
                .set('cedingName','')
                .set('policyNo','')
                .set('riskName','')
                .set('insuredName','')
                .set('periodFrom','')
                .set('periodTo','')
                .set('compRefHoldCovNo','')
                .set('reqBy','')
                .set('reqDateFrom','')
                .set('reqDateTo','')
                .set('expiringInDays','')
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolHoldCoverListing',{params});
    }

    getUWCoverageAlt(lineCd:any , polYear: any,seqNo: any,cedingId: any,coSeriesNo: any,altNo: any) {
        /*this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("1", "I", "3", "1000000", "12.2", "69000", "70000"),
            new UnderwritingCoverageInfo("2", 'II', "2", "150000", "15.16", "123000", "456000")
        ];*/

         const params = new HttpParams()
             .set('lineCd', (lineCd === null || lineCd === undefined ? '' : lineCd) )
             .set('polYear',(polYear === null || polYear === undefined ? '' : polYear))
             .set('seqNo',(seqNo === null || seqNo === undefined ? '' : seqNo))
             .set('cedingId',(cedingId === null || cedingId === undefined ? '' : cedingId))
             .set('coSeriesNo',(coSeriesNo === null || coSeriesNo === undefined ? '' : coSeriesNo))
             .set('altNo',(altNo === null || altNo === undefined ? '' : altNo));
        //return   this.http.get("http://localhost:8888/api/undewriting-service/retrievePolCoverage",{params});
        return  this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolCoverageAlt",{params});
    }

    getPolGenInfoOc(policyIdOc: string, openPolicyNo: string){
        const params = new HttpParams()
            .set('policyIdOc', policyIdOc)
            .set('openPolicyNo', openPolicyNo)
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolGenInfoOc",{params});
    }

     updatePolicyStatus(params){
        
         return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolicyStatus',params,this.header);
    }

    getAlterationsPerPolicy(policyId, checkingType) {
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('checkingType', checkingType);

        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrieveAlterationsPerPolicy",{params});
    }

    savePolGenInfoOc(params:any){
        

        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolGenInfoOc', params, this.header);
    }

    updatePolGenInfoSpoilage(params){
        
         return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolGenInfoSpoilage',params,this.header);
    }

    post(params){
        
         return this.http.post(environment.prodApiUrl + '/underwriting-service/postPolicy',JSON.stringify(params),this.header);
    }

    generateHundredValPolPrinting(params){
        
         return this.http.post(environment.prodApiUrl + '/underwriting-service/generateHundredValuePolPrinting',JSON.stringify(params),this.header);
    }

    getFullCoverage(policyNo:any , policyId: string){
         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        //return   this.http.get("http://localhost:8888/api/undewriting-service/retrievePolCoverage",{params});
        return  this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolFullCoverage",{params});
    }

    savePolFullCoverage(coverageData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolFullCoverage', JSON.stringify(coverageData), this.header);
    }

    getExpPolList(searchParams){
        // const params = new HttpParams()
        //     .set('policyId', searchParams.policyId == undefined ? '' : searchParams.policyId)
        //     .set('processTag', searchParams.processTag == undefined ? '' : searchParams.processTag)
        //     .set('renewalFlag', searchParams.renewalFlag == undefined ? '' : searchParams.renewalFlag)
        //     .set('renewable', searchParams.renewable == undefined ? '' : searchParams.renewable)
        //     .set('extractUser', searchParams.extractUser == undefined ? '' : searchParams.extractUser);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveExpPolList', {params:searchParams});
    }

    processRenewablePolicy(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/processRenewablePolicy',JSON.stringify(params),this.header);
    }

    getRiskDistribution(policyId, lineCd, lineClassCd){
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('lineCd', lineCd)
            .set('lineClassCd', lineClassCd)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveRiskDist', {params});
    }

    getPoolDistribution(riskDistId,altNo){
        const params = new HttpParams()
            .set('riskDistId', riskDistId)
            .set('altNo', altNo)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePoolDist', {params});
    }

    getDistCoIns(riskDistId,policyId){
        const params = new HttpParams()
            .set('riskDistId', riskDistId)
            .set('policyId', policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveDistCoIns', {params});
    }

    getPolDistribution(policyId, distId?){
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('distId', distId === undefined || distId === null || distId === '' ? '' : distId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDist', {params});
    }

    getPolDistributionCum(policyId, distId?){
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('distId', distId === undefined || distId === null || distId === '' ? '' : distId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDistCum', {params});
    }

    postDistribution(postData){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/postDistribution', JSON.stringify(postData), this.header);
    }

    getPolForPurging(policyId){
         const params = new HttpParams()
            .set('policyId', policyId === undefined || policyId === null || policyId === '' ? '' : policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolForPurging', {params});
    }

    savePolForPurging(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/purgeExpiringPol',JSON.stringify(params),this.header);
    }

    saveExpEdit(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveExpCoverage',JSON.stringify(params),this.header);
    }


    getPolPoolDistribution(riskDistId,policyId){
        const params = new HttpParams()
            .set('riskDistId', riskDistId)
            .set('policyId', policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolPoolDist', {params});
    }

    getPolPoolDistributionCum(riskDistId,policyId){
        const params = new HttpParams()
            .set('riskDistId', riskDistId)
            .set('policyId', policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolPoolDistCum', {params});
    }

    saveDistRisk(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveRiskDist',JSON.stringify(params),this.header);
    }

    distributeRisk(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/distributeRiskDist',JSON.stringify(params),this.header);
    }

     getPolDistList(searchParams: any []) {
         var params;
         if(searchParams.length < 1){
              params = new HttpParams()
                     .set('distId','')
                     .set('riskDistId', '')
                     .set('status', '')
                     .set('lineCd','')
                     .set('policyNo','')
                     .set('cedingName','')
                     .set('insuredDesc','')
                     .set('riskName','')
                     .set('currencyCd','')
                     .set('totalSi','')
                     .set('distDateFrom','')
                     .set('distDateTo','')
                     .set('acctDateFrom','')
                     .set('acctDateTo','')
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
          return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDistList',{params});
     }


     saveExpCat(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveExpCatPeril',JSON.stringify(params),this.header);
    }

    saveExpGenInfo(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveExpGenInfo',JSON.stringify(params),this.header);
    }

    negateDist(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/negateDistribution',JSON.stringify(params),this.header);
    }

    getPolDistWarning(riskDistId, altNo){
        const params = new HttpParams()
            .set('riskDistId', riskDistId)
            .set('altNo', altNo)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDistWarning', {params});
    }

    getPolDistInst(policyId){
        const params = new HttpParams()
            .set('policyId', policyId);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDistInst', {params});
    }

    getPolDistInstPool(policyId,distId,instNo){
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('distId',distId)
            .set('instNo', instNo);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolDistInstPool', {params});
    }

    getInstTagAcctEntDate(policyId){
        const params = new HttpParams()
            .set('policyId', policyId);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolInstTagAcctDate', {params});
    }

    getValidBookingDate(params){
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveValidBookingDate', {params:params});
    }

    updateOCStatus(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolOpenCoverStatus',JSON.stringify(params),this.header);
        
    }

    batchDist(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/batchDistribution',JSON.stringify(params),this.header);
    }

    batchPost(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/batchPosting',JSON.stringify(params),this.header);
    }

    getLastExtractInfo(){
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveLastExtractInfo');
    }

    getNegateList(params?){
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrieveNegateDistList',{params:params});
    }

    extGenRenExpPolicy(params){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/extGenRenExpPolicy',JSON.stringify(params),this.header);
    }

    getPolEndtDed(policyId, lineCd){
        const params = new HttpParams()
            .set('policyId', policyId)
            .set('lineCd', lineCd);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolEndtDed', {params});
    }

    getPolicyListingLength(params){
        return this.http.get(environment.prodApiUrl+'/underwriting-service/retrievePolicyListingLength',{params:params,responseType:'text'});
    }

    getPolOcListing(params){
        return this.http.get(environment.prodApiUrl+'/underwriting-service/retrieveOpenCoverPolList',{params:params});    
    }

    getEditableDistListing(params){
        return this.http.get(environment.prodApiUrl+'/underwriting-service/retrieveEditableDistList',{params:params});    
    }

    getCreateOcAltLov(params){
        return this.http.get(environment.prodApiUrl+'/underwriting-service/retrieveCreateOcAltLov',{params:params});       
    }

    createAltOc(params){
        return this.http.post(environment.prodApiUrl + '/underwriting-service/createOcAlt',JSON.stringify(params),this.header);
    }

    getPolOcInfo(params){
        return this.http.get(environment.prodApiUrl+'/underwriting-service/retrievePolOcInfo',{params:params});     
    }

    saveManualDistPol(params){
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveManualDistPol',JSON.stringify(params),this.header);
    }

    getFullItemInfoData(policyNo?, policyId?) {
        /*this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];*/
         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolFullItem",{params});
    }

     savePolFullItem(itemData:any){
        
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolFullItem', JSON.stringify(itemData), this.header);
    }

    getMoveBookingList(params:any){
        return this.http.get(environment.prodApiUrl + "/underwriting-service/retrieveMoveBookingMonthList",{params:params});
    }

    batchUpdateBookingDate(params){
        return this.http.post(environment.prodApiUrl + '/underwriting-service/batchUpdateBookingDate',JSON.stringify(params),this.header);
    }
}            

            