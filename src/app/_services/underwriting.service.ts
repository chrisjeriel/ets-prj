import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DummyInfo, UnderwritingCoverageInfo, UnderwritingOtherRatesInfo, PolicyCoInsurance, PARListing, AltPARListing, ExpiryListing, CreateParTable, RenewedPolicy, PolAttachmentInfo, PolicyPrinting, PrinterList, ALOPItemInformation, UnderwritingPolicyInquiryInfo, ItemInformation, UnderwritingPolicyDistList, DistributionByRiskInfo, PolicyEndorsement, PolItem_MLP, PolGoods_DOS, PolMachinery_DOS, PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges, PolItem_CEC, TotalPerSection, UnderwritingBatchPosting, UnderwritingBatchDistribution, MaintenanceDeductibles, MaintenanceRisks, CoverageDeductibles, CedingCompanyList, CedingCompany } from '@app/_models';



@Injectable({ providedIn: 'root' })
export class UnderwritingService {

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

    getUWCoverageInfo() {
        this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("1", "I", "3", "1000000", "12.2", "69000", "70000"),
            new UnderwritingCoverageInfo("2", 'II', "2", "150000", "15.16", "123000", "456000")
        ];
        return this.uwcoverageInfoData;
    }

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

    extractExpiringPolicies() {
        return 100;
    }

    getParListing(searchParams: any []) {
  /*      this.parListingData = [
            new PARListing("CAR-2018-000002-099-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date("02-09-2018"), new Date("02-09-2018"), new Date("02-28-2018"), new Date(), "In Progress"),
            new PARListing("CAR-2018-000002-088-0001-000", "Retrocession","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",1080000,131000, new Date("03-09-2018"), new Date("03-09-2018"), new Date("03-09-2018"), new Date("03-30-2018"), "In Progress"),
            new PARListing("CAR-2018-000002-088-0002-000", "Retrocession","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",8090000,131000, new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-09-2018"), new Date("04-30-2018"), "In Progress"),
            new PARListing("CAR-2018-000002-088-0003-000", "Retrocession","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",9000000,131000, new Date("05-09-2018"), new Date("05-09-2018"), new Date("05-09-2018"), new Date("05-30-2018"), "In Progress"),
            new PARListing("CAR-2018-000002-088-0004-000", "Retrocession","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date("06-09-2018"), new Date("06-09-2018"), new Date("06-09-2018"), new Date("06-30-2018"), "In Progress"),
            new PARListing("CAR-2018-000002-088-0005-000", "Retrocession","FLT Prime", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date("07-09-2018"), new Date("07-09-2018"), new Date("07-09-2018"), new Date("07-30-2018"), "In Progress"),
            new PARListing("CEC-2018-000002-099-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Progress"),
            new PARListing("EAR-2018-000002-098-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Progress"),
            new PARListing("EEI-2018-000002-091-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Force"),
            new PARListing("MBI-2018-000002-092-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Force"),
            new PARListing("BVP-2018-000002-093-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Progress"),
            new PARListing("MLP-2018-000002-094-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Progress"),
            new PARListing("DOS-2018-000002-095-0001-000", "Direct","Malayan", "5K Builders/ABE International Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba","PHP",10000000,131000, new Date(), new Date(), new Date(), new Date(), "In Progress"),
        ];
        return this.parListingData;*/
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


    getAltParListing() {
        this.altParListingData = [
            new AltPARListing("CAR-2018-000002-021-0192-001", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-002", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-003", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-004", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-005", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-006", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-007", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
            new AltPARListing("CAR-2018-000002-021-0192-008", "Direct", "CAR Wet Risks", "In Progress", "Malayan", "5K Builders", "ABE International Corp", "5K Builders & ABE international Corp", "ABC Building", "Cooling Towers", "Region IV, Laguna Calamba", "CAR-2018-000001-00-99", "PHP", new Date(), new Date(), new Date(), "POLECOH"),
        ];

        return this.altParListingData;

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



    getInwardPolBalance(policyId?) {
         let params:any = {
             policyId : policyId
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
                              activeTag?:string,defaultTag?:string){
        // this.maintenanceDeductiblesData = [
        //     new MaintenanceDeductibles(true,'AOG30', 'ACTS OF GOD 30', 'L', 0.4, 10000000000),
        //     new MaintenanceDeductibles(true,'OC31', 'OTHER CAUSES 31', 'L', 0.5, 10000000),
        //     new MaintenanceDeductibles(false,'TPL5', 'THIRD PARTY LIABILITY 30', 'F', 0.4, 20000000000),
        // ];
        const params = new HttpParams()
            .set('lineCd', lineCd !== undefined ? lineCd:'')
            .set('deductibleCd', deductibleCd !== undefined ? deductibleCd:'')
            .set('coverCd', coverCd !== undefined ? coverCd:'')
            .set('endtCd', endtCd !== undefined ? endtCd:'')
            .set('activeTag', activeTag !== undefined ? activeTag:'')
            .set('defaultTag', defaultTag !== undefined ? defaultTag:'')
        return this.http.get(environment.prodApiUrl + "/maintenance-service/retrieveMtnDeductibles",{params}) ;
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

    getCedingCompanyList(cedingId,cedingName,cedingAbbr,address,membershipDate,terminationDate,inactiveDate,activeTag,govtTag,membershipTag){
        /*this.cedingCompanyList = [
            new CedingCompanyList('y','y','',1,'AFP GENERAL INSURANCE CORP.','AFP', 'Col. Boni Serrano Road E. Delos Santos Ave.', new Date(2015,2,9),null,null),
        ]
        return this.cedingCompanyList; */
        const params = new HttpParams()
            .set('cedingId',cedingId)
            .set('cedingName',cedingName)
            .set('cedingAbbr',cedingAbbr)
            .set('address',address)
            .set('membershipDate',membershipDate)
            .set('terminationDate',terminationDate)
            .set('inactiveDate',inactiveDate)
            .set('activeTag',activeTag)
            .set('govtTag',govtTag)
            .set('membershipTag',membershipTag);

        return this.http.get(environment.prodApiUrl + '/maintenance-service/retrieveMaintenanceCedingCompanyListing', {params});
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
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolicyDeductibles',JSON.stringify(params),header);
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
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAttachment', JSON.stringify(params), header);
    }

    savePolHoldCover(holdCoverParams: any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolHoldCover', JSON.stringify(holdCoverParams), header);
    }

    saveInwardPolBal(params){
         let header : any = {
             headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolInwardBal', JSON.stringify(params), header);
    }

    getCATPeril(policyNo:any , policyId: string) {
         const params = new HttpParams()
             .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo) )
             .set('policyId',(policyId === null || policyId === undefined ? '' : policyId) )
        return  this.http.get(environment.prodApiUrl + "/underwriting-service/retrievePolCATPeril",{params});
    }

    savePolCoverage(coverageData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolCoverage', JSON.stringify(coverageData), header);
    }

    savePolEndt(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolEndorsement', JSON.stringify(params), header);
    }

    saveCatPeril(catPeriLData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolCATPeril', JSON.stringify(catPeriLData), header);
    }

    getPolAlop(policyId:string, policyNo?:string) {
        const params = new HttpParams()
            .set('policyId', (policyId === null || policyId === undefined ? '' : policyId))
            .set('policyNo', (policyNo === null || policyNo === undefined ? '' : policyNo))

        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolAlop', {params});
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
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log(polAlopData);
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAlop', JSON.stringify(polAlopData), header);
    }

    getPolicyInformation(policyId,policyNo?){
        const params = new HttpParams()
            .set('policyId',policyId===undefined?'':policyId)
            .set('policyNo',policyNo===undefined?'':policyNo);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolicyInformation',{params})
    }

    retrievePolHoldCover(policyId: string, policyNo: string){
        const params = new HttpParams()
            .set('policyId',policyId === undefined || policyId === null || policyId === '' ? '' : policyId)
            .set('policyNo',policyNo === undefined || policyNo === null || policyNo === '' ? '' : policyNo);
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolHoldCover',{params});
    }

    saveItem(itemData:any){
        let header: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolItem', JSON.stringify(itemData), header);
    }

    savePolAlopItem(polAlopItemData:any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolAlopItem', JSON.stringify(polAlopItemData), header);
    }


    savePolicyDetails(savePolicyDetailsParam: any) {
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/savePolicyDetails', JSON.stringify(savePolicyDetailsParam), header);
    }


    updatePolHoldCoverStatus(params: any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/updatePolHoldCoverStatus', JSON.stringify(params), header);
    }

    getSumInsOc(policyId){
        const params = new HttpParams()
            .set('policyId',policyId === undefined || policyId === null || policyId === '' ? '' : policyId)
        return this.http.get(environment.prodApiUrl + '/underwriting-service/retrievePolCoverageOc',{params});
    }

    saveSumInsOC(params){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveSumInsOC', JSON.stringify(params), header);
    }

    saveOpenPolDetails(params: any){
        let header : any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(environment.prodApiUrl + '/underwriting-service/saveOpenPolDetails', JSON.stringify(params), header);
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

}            
