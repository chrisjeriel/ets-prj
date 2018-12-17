import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DummyInfo, UnderwritingCoverageInfo, UnderwritingOtherRatesInfo, PolicyCoInsurance, PARListing, AltPARListing, ExpiryListing, CreateParTable, RenewedPolicy, PolAttachmentInfo, PolicyPrinting, PrinterList, ALOPItemInformation, UnderwritingPolicyInquiryInfo, ItemInformation, UnderwritingPolicyDistList, DistributionByRiskInfo } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UnderwritingService {

    dummyInfoData: DummyInfo[] = [];
    alterationFromQuotation: CreateParTable[] = [];
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
    policyDistListData: UnderwritingPolicyDistList[] = [];
    distributionByRiskData: DistributionByRiskInfo[] = [];

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
        this.coInsuranceData = [
            new PolicyCoInsurance("CAR-2018-000001-099-0001-000","EN-CAR-2018-0000001-00", "Malayan", 12.2, 10000, 500000),
            new PolicyCoInsurance("CAR-2018-000001-099-0001-000","EN-CAR-2018-0000001-00", "Company 1", 6.23, 20000, 600000),
            new PolicyCoInsurance("CAR-2018-000001-099-0001-000","EN-CAR-2018-0000001-00", "Company 2", 15.16, 30000, 700000),
        ];
        return this.coInsuranceData;
    }

    getUWCoverageInfo() {
        this.uwcoverageInfoData = [
            new UnderwritingCoverageInfo("data", "1", "I", "3", "1000000","12.2", "69000", "70000"),
            new UnderwritingCoverageInfo("data", "2", 'II', "2","150000","15.16", "123000", "456000")
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

    extractExpiringPolicies() {
        return 100;
    }


    getParListing() {
        this.parListingData = [
            new PARListing("CAR-2018-0001", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0002", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0003", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0004", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0005", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0006", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0007", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma"),
            new PARListing("CAR-2018-0008", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "cuaresma")
        ];

        return this.parListingData;
    }

    getAltParListing() {
        this.altParListingData = [
            new PARListing("CAR-2018-0001", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0002", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0003", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0004", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0005", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0006", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0007", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user"),
            new PARListing("CAR-2018-0008", "In Progress", "Direct", "CAR Wet Risks", "FLT Prime", "2nd Inn, Inc.", "2nd Inn, Inc.", "user")
        ];

        return this.altParListingData;

    }

    getPolAttachment() {
        this.polAttachmentInfoData = [
            new PolAttachmentInfo("Libraries\\Attachments", "NBI Form"),
            new PolAttachmentInfo("Libraries\\Attachments", "NSO Birth Certificate")
        ];

        return this.polAttachmentInfoData;
    }


    getExpiryListing() {
        this.expiryListing = [
            new ExpiryListing("POL-0050", "I", "San Juan", "CPI", "insured", "Sample Data", "II", "Paul", "Peso", "IV", "si", "pre"),
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
            new PolicyPrinting(null,null,null,null)
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

    getALOPItemInfos(car:string){
        this.aLOPItemInfos = [
            new ALOPItemInformation(1, 5, "desc", "rel import", "min loss"),
            new ALOPItemInformation(2, 7, "description", "relative import", "min loss")
        ]
        if(car =="CAR"){
            this.aLOPItemInfos.forEach(function(itm){delete itm.relativeImportance;});
        }
        return this.aLOPItemInfos;
    }

    getPolicyInquiry() {
        this.policyInquiry = [
            new UnderwritingPolicyInquiryInfo("data", "data", "data", "data", "data", "data", "data", "data", "data", "data", "data", "data"),
            new UnderwritingPolicyInquiryInfo("data2", "data2", "data2", "data2", "data2", "data2", "data2", "data2", "data2", "data2", "data2", "data2"),
        ];
        return this.policyInquiry;
    }

    getItemInfoData() {
        this.itemInfoData = [
            new ItemInformation(1001, "Description for item number 1"),
            new ItemInformation(1002, "Description for item number 2"),
            new ItemInformation(1003, "Description for item number 3")
        ];
        return this.itemInfoData;
    }

    getPolicyDistListInfo(){
        this.policyDistListData = [
            new UnderwritingPolicyDistList(10001, 10001, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10002, 10002, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10003, 10003, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10004, 10004, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10005, 10005, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10006, 10006, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10007, 10007, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10008, 10008, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10009, 10009, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10010, 10010, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
            new UnderwritingPolicyDistList(10011, 10011, 'Distributed but not posted', 'CAR-2018-000002-021-0192-090', 'Trust Assurance', 'ACM Builders / Adfran Corporation', 'C-Siemens/PLDT'),
        ];

        return this.policyDistListData;
    }

    getDistByRiskData() {
        this.distributionByRiskData = [
            new DistributionByRiskInfo("", "1Surp", "PhilNaRe", "5.000000", "27.522220", "CAR"),
            new DistributionByRiskInfo("", "1Surp", "Munich Re", "95.000000", "27.500000", "CAR"),
            new DistributionByRiskInfo("", "2Surp", "PhilNaRe", "5.000000", "27.500000", "CAR"),
            new DistributionByRiskInfo("", "2Surp", "Munich Re", "95.000000", "27.500000", "CAR"),
            new DistributionByRiskInfo("", "Facul", "Munich Re", "100.000000", "26.000000", "CAR"),
            new DistributionByRiskInfo("", "QS", "QS Pool", "60.000000", "30.000000", "CAR"),
            new DistributionByRiskInfo("", "QS", "PhilNaRe", "2.000000", "30.000000", "CAR"),
            new DistributionByRiskInfo("", "QS", "Munich Re", "38.000000", "30.000000", "CAR"),

        ];
        return this.distributionByRiskData;
    }
}            
