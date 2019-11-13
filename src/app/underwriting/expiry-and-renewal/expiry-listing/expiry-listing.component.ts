import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService, NotesService, WorkFlowManagerService, PrintService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { DecimalPipe } from '@angular/common';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
import { Router } from '@angular/router';
import { MtnNonrenewReasonComponent } from '@app/maintenance/mtn-nonrenew-reason/mtn-nonrenew-reason.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnCatPerilModalComponent } from '@app/maintenance/mtn-cat-peril-modal/mtn-cat-peril-modal.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {
  @ViewChild(MtnCatPerilModalComponent) catPerils: MtnCatPerilModalComponent;
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild('policyLov') policyModal : ModalComponent;
  @ViewChild('lov') tableLov :CustEditableNonDatatableComponent;
  @ViewChild('mtnSectionCover') secCoversLov: MtnSectionCoversComponent;
  @ViewChild('totalPerSection') totalPerSection:CustEditableNonDatatableComponent;
  @ViewChild('contentEditPol') contentEditPol;
  @ViewChild('catPerils') catPerilsTable :CustEditableNonDatatableComponent;
  @ViewChild('sectionTable') sectionTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('table') table: CustEditableNonDatatableComponent;
  @ViewChild('nrTable') nrTable: CustEditableNonDatatableComponent;
  @ViewChild('mtnNonRenewReason') nrReasonLOV: MtnNonrenewReasonComponent;
  @ViewChild('editCov') successDiag: SucessDialogComponent;
  @ViewChild('editCatPeril') successDiagCat: SucessDialogComponent;
  @ViewChild('renewable') successDiagRN: SucessDialogComponent;
  @ViewChild('nonrenewable') successDiagNR: SucessDialogComponent;
  @ViewChild('mdl') modal : ModalComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('myForms') forms:any;
  @ViewChild('printModal') printModal: ModalComponent;
  @ViewChild("remindersTable") remindersTable: CustEditableNonDatatableComponent;

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  byDate: boolean = true;
  searchParams: any = {
    policyId: '',
    processTag: '',
    renewalFlag: '',
    extractUser: '',
    renewable: '',
  };
  fetchedData: any;
  disabledFlag: boolean = true;
  secCoverData: any;
  coverageData:any;
  deductibleData:any;
  catPerilData:any;
  secCoverCd: any;
  lineCd:any;
  secISi:number =0;
  secIISi:number =0;
  secIIISi:number =0;
  secIPrem:number =0;
  secIIPrem:number =0;
  secIIIPrem:number =0;
  totalSi:number =0;
  totalPrem: number =0;
  reasonFlag:boolean = false;
  changesFlag:boolean = false;
  hideSectionCoverArray:any;
  sectionCoverLOVRow:number;
  changes:string = "";
  remarks:string = "";
  purgeFlag: boolean = true;
  purgeFlagNR: boolean = true;
  returnCode: any;

  nrReasonCd:string = "";
  nrReasonDescription:string = "";
  nrRemarks:string = "";
  processRenewalPoliciesParams:any = {
    renAsIsPolicyList : [],
    renWithChangesPolicyList : [],
    nonRenPolicyList : []
  };

  itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Possible Loss Minimization"],
        dataTypes: ["number", "number", "text", "text"],
        uneditable: [true,false,false,false,false],
        nData: {
          createDate: new Date(),
          createUser: JSON.parse(window.localStorage.currentUser).username,
          description: null,
          itemNo: null,
          importance: null,
          lossMin: null,
          quantity: null,
          updateDate: new Date(),
          updateUser: JSON.parse(window.localStorage.currentUser).username,
        },
        pageID:'itemInfoData',
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
        keys:['itemNo','quantity','description','lossMin'],
        widths:[1,1,1,1,1],
        checkFlag:true
  }

  passDataLov :any ={
    tableData:[],
    tHeader: ['Policy No', 'Ceding Company', 'Insured'],
    dataTypes:['text','text','text'],
    tooltip:[null,null,null],
    keys:['policyNo','cedingName','insuredDesc'],
    uneditable:[true,true,true],
    widths:[180,200,230],
    paginateFlag:true,
    infoFlag:true,
    pageID:'LOV',
    searchFlag: true,
  }

  passDataSectionCover: any = {
    tHeader: [ "Section","Bullet No","Cover Name",  "Sum Insured", "Rate", "Premium", "D/S","Add SI"],
    tableData:[],
    dataTypes: ['text','text','lovInput','currency',"percent", "currency", "checkbox",'checkbox'],
    tabIndexes: [false,false,false,true,true,true,true,true],
    tooltip:[null,null,null,null,null,null,'Discount / Surcharge',null],
    nData: {
      showMG: 1,
      addSi:'N',
      bulletNo:null,
      coverCd:'',
      coverName:null,
      createDate: this.ns.toDateTimeString(0),
      createUser: JSON.parse(window.localStorage.currentUser).username,
      deductiblesSec:[],
      discountTag:'N',
      premRt: null,
      premAmt: null,
      section:null,
      sumInsured:null,
      policyId:null,
      lineCd: null,
      projId: null,
      riskId: null,
      origSi: 0,
      origPremRt: 0,
      origPrem: 0,
      updateDate: this.ns.toDateTimeString(0),
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'sectionCovers',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[0,0,210,125,100,125,0,0],
    magnifyingGlass: ['coverName'],
    uneditable:[true,false,false,false,false,false,false,false],
    keys:['section','bulletNo','coverName','sumInsured','premRt','premAmt','discountTag','addSi'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text", "percent", "currency"],
        pageLength:5,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        checkFlag: true,
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        magnifyingGlass: ['deductibleCd'],
        keys:['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        uneditable: [true,true,false,false,false],
        tableData:[],
        pageID:'deductibles',
        disableAdd: true, 
        nData: {
          showMG : 1,
          coverCd: null,
          createDate: this.ns.toDateTimeString(0),
          createUser: JSON.parse(window.localStorage.currentUser).username,
          deductibleAmt: 0,
          deductibleCd: null,
          deductibleRt: 0,
          deductibleTxt: '',
          endtCd: "0",
          updateDate: this.ns.toDateTimeString(0),
          updateUser:JSON.parse(window.localStorage.currentUser).username
        }
  };

  passDataTotalPerSection: any = {
        tHeader: ["Section", "Sum Insured", "Premium"],
        dataTypes: ["text", "currency", "currency"],
        tableData: [["SECTION I",null,null],["SECTION II",null,null],["SECTION III",null,null]],
        keys:['section','sumInsured','premium'],
        uneditable:[true,true,true],
        pageID:'TotalPerSection',
        pageLength:3,
        widths: [1,'auto','auto']
  };
  
  passDataRenewalPolicies: any = {
        tHeader: ["Print", "P", "RA", "RC", "NR", "Policy No", "Type of Cession","Ceding Company", "Co Ref No","Ren TSI Amount","Ren Pre Amount","TSI Amount","Prem Amount","S","B","C","R","SP"],
        dataTypes: [
                    /*"checkbox", "checkbox", "checkbox", "checkbox", "text", "text","text","text","currency","currency","currency","currency","text","checkbox","checkbox","checkbox","checkbox", "checkbox"*/
                    "checkbox", "checkbox", "radio", "radio", "radio", "text","text", "text","text","currency","currency","currency","currency","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tooltip:[null,'Process','Renewal As Is','Renewal With Changes','Non-Renewal',null,,null,null,null,null,null,null,'Summarized Policy','With Balance Flag','With Claim Flag','With Reminder','Special Policy'],
        nData: {
                 printTag : false,
                 processTag : false,
                 renAsIsTag : false,
                 renWithChange : false,
                 nonRenTag : false,
                 policyNo : '',
                 cessionDesc : '',
                 cedingName : '',
                 coRefNo : '',
                 renTsiAmount : null,
                 renPremAmount : null,
                 tsiAmount : null,
                 premAmount : null,
                 coRefNo2 : '',
                 summarizedTag : false,
                 withBalTag : false,
                 withClaimTag : false,
                 withReminderTag : false,
                 regPolicyTag : false
               },
        tableData: [],
        keys:['printTag', 'processTag', 'renAsIsTag', 'renWithChange', 'nonRenTag', 'policyNo', 'cessionDesc','cedingName', 'coRefNo', 'renTsiAmount', 'renPremAmount', 'totalSi', 'totalPrem', 'summaryTag', 'balanceTag', 'claimTag', 'reminderTag', 'specialPolicyTag'],
        pageLength: 10,
        pageID:'RenewalPolicies',
        paginateFlag:true,
        infoFlag:true,
        radioGroup: [ {
          radTitle : "nonRenFlag",
          radCols : ['renAsIsTag', 'renWithChange', 'nonRenTag']
        }],
        uneditable: [false, false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true],
        searchFlag: true,
   };

   passDataNonRenewalPolicies: any = {
        tHeader: ["Print", "P", "NR","Policy No", "Type of Cession", "Ceding Company", "Co Ref No","TSI Amount","Prem Amount","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "checkbox", "checkbox", "text","text","text","text","currency","currency","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tableData: [[false,false,"TEST","TEST","TEST","TEST","TEST","TEST","TEST",false,false,false,false,false]],
        pageLength: 10,
        paginateFlag:true,
        pageID:'NonRenewalPolicies',
        infoFlag:true,
        tooltip:[null, 'Process Policy',"Non-Renewal",null,null,null,null,null,null,'Summarized','With Balance','With Claim','With Reminder','Reqular Policy'],
        keys:['printTag','processTag', 'nonRenTag', 'policyNo', 'cessionDesc','cedingName', 'coRefNo', 'totalSi', 'totalPrem', 'summaryTag', 'balanceTag', 'claimTag', 'reminderTag', 'specialPolicyTag'],
        uneditable: [false,false,true,true,true,true,true,true,true,false,true,true,true,true],
        searchFlag: true,
   };

   passDataCATPerils: any = {
        tHeader: ["CAT Perils", "Percentage Share on Premium(%)"],
        dataTypes: ["text", "percent"],
        tableData: [],
        keys:['catPerilName','pctSharePrem'],
        pageLength:10,
   };


      

   remindersData: any = {
        tableData: [],
        dataTypes : ['fasymbol','text', 'text', 'date', 'time', 'text', 'date'],
        keys : ['type', 'title', 'reminder', 'reminderDate', 'alarmTime', 'assignedTo','createDate'],
        tHeader : ['Severity', 'Title', 'Reminder', 'Reminder Date', 'Alarm Time', 'Assigned To', 'Date Assigned'],
        uneditable : [false,true,true,true,true,true,true],

        //widths: [60,'auto',100,'auto'],
        nData:{
            type: null,
            title: null,
            assignedTo: null,
            createDate: 0,
        },
        pageLength: 5,
        deleteFlag: false,
        checkFlag: false,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
   }

   editModal: any = {
     currencyCd: null,
     currencyRt: null,
     totalSi: null,
     totalPrem: null,
     pctShare: null,
     pctPml: null,
     totalValue: null,
     remarks: null
   };

   ExpcoverageData: any = {
     expSecCovers: [],
     delexpSecCovers: []
   }

   ExpCatPerilsData: any = {
     expcatPeril: []
   }

   ExpGenInfo: any = {
     saveExpRenewable: []
   }

   purgeData: any = {
    deletePurge:[]
   }

  selectedPolicyString :any; 
  selectedPolicy :any;
  showEdit :boolean = false;
  validForRenewalProcessing:boolean = false;

  renewedPolicies:any = [];
  wcPolicies:any = [];
  nrPolicies:any = [];
  activeTable: any = 'R';
  rowPolicyId: any;
  rowProjId: any;
  rowRiskId:any;
  dialogIcon:string = '';
  dialogMessage:string;
  cancelFlag:boolean;
  printFlag:boolean = false;
  tblIndex: any;
  tblIndexNR: any;
  selectedData: any;
  radioVal: any = 'byPolNo';
  selected: any;
  renewableData: any;
  nonRenewableData: any;
  currentTab: string = 'renew';
  renAsIsTag: boolean;
  pctShareVal: any;
  totalVal:any;
  

  params:any = {
    cedingId : "",
    cedingName : "",
    line: "",
    typeOfCessionId : "",
    lineDescription :"",
    typeOfCession :"",
    byDateFrom: '',
    byDateTo: '',
    byMonthFrom:'',
    byMonthTo:'',
    byYearTo: '',
    byYearFrom: ''
  }

  dateParams:any = {
    byDateFrom: '',
    byDateTo: '',
    byMonthFrom:'',
    byMonthTo:'',
    byYearFrom:'',
    byYearTo:''
  }

  PolicyNo: any = {
    line: '',
    year: '',
    sequenceNo: '',
    companyNo: '',
    coSeriesNo: '',
    altNo: ''
  }

  
  

  constructor(private underWritingService: UnderwritingService, 
              public modalService: NgbModal, 
              private titleService: Title, 
              private ns: NotesService,  
              private decimal : DecimalPipe, 
              private router : Router,
              private workFlowManagerService : WorkFlowManagerService,
              private ps : PrintService) { }

  mode:string = 'reminder';

  ngOnInit() {
    this.titleService.setTitle("Pol | Expiry Listing");
    //this.tableData = this.underWritingService.getExpiryListing();
    //this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
    this.retrieveExpPolList();
    //this.retrieveExpPolListNR();
  }

  renewPolicies() {
    this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
    console.log(this.renewedPolicyList);
  }

  clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
    /*this.expiryParameters.fromMonth = null;
    this.expiryParameters.fromYear = null;
    this.expiryParameters.toMonth = null;
    this.expiryParameters.toYear = null;*/
  }

  onClickPrint() {
      $('#printPolicyModal > #modalBtn').trigger('click');
  }

  parameter() {
        $('#parameter #modalBtn').trigger('click');
  }

  onClickUpdate() {
      //this.passDataRenewalPolicies.uneditable = [false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true];
      if(this.currentTab == 'renew'){
        this.table.overlayLoader = true;
        this.retrieveExpPolList();
      }else if(this.currentTab == 'nonRenew'){
        this.nrTable.overlayLoader = true;
        this.retrieveExpPolListNR();
      }
  }

  checkFields() :boolean{
    for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
      if(this.passDataRenewalPolicies.tableData[i].processTag == 'Y' &&
         this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'N' &&
         this.passDataRenewalPolicies.tableData[i].renWithChange == 'N' &&
         this.passDataRenewalPolicies.tableData[i].nonRenTag == 'N'){
        return true;
      }
    }
  }

  onClickProcess() {
    if(this.checkFields()){
      this.dialogMessage = 'No Selected Renewal Option.'
      this.dialogIcon = 'error-message'
      this.successDiag.open();
    }else{
      var renAsIsPolicyList = [];
      var renWithChangesPolicyList = [];
      var nonRenPolicyList = [];

      for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].processTag == 'Y' && !this.passDataRenewalPolicies.tableData[i].processed) {
            var policyId = this.passDataRenewalPolicies.tableData[i].policyId;

            if (this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'Y') {
                var policy = {
                  policyId : policyId,
                  summaryTag : this.passDataRenewalPolicies.tableData[i].summaryTag,
                  procBy : JSON.parse(window.localStorage.currentUser).username,
                  remarks : this.passDataRenewalPolicies.tableData[i].remarks,
                  renewalFlag : "RA"
                };

                renAsIsPolicyList.push(policy);
            }

            if (this.passDataRenewalPolicies.tableData[i].renWithChange == 'Y') {
                var policyWC = {
                  policyId : policyId,
                  projectList : this.passDataRenewalPolicies.tableData[i].projectList,
                  secCovList : this.passDataRenewalPolicies.tableData[i].sectionCoverList,
                  deductiblesList : this.passDataRenewalPolicies.tableData[i].deductiblesList,
                  summaryTag : this.passDataRenewalPolicies.tableData[i].summaryTag,
                  procBy : JSON.parse(window.localStorage.currentUser).username,
                  remarks : this.passDataRenewalPolicies.tableData[i].remarks,
                  renewalFlag : "RC"
                };

                renWithChangesPolicyList.push(policyWC);
            }

            if (this.passDataRenewalPolicies.tableData[i].nonRenTag == 'Y') {
                var policyNR = {
                  policyId : policyId,
                  policyNo : this.passDataRenewalPolicies.tableData[i].policyNo,
                  nrReasonCd : this.passDataRenewalPolicies.tableData[i].nrReasonCd,
                  nrReasonDesc : this.passDataRenewalPolicies.tableData[i].nrReasonDesc,
                  procBy : JSON.parse(window.localStorage.currentUser).username,
                  renewalFlag : "NR"
                };
                nonRenPolicyList.push(policyNR);
            }
        }
      }

      console.log("processRenewalPolicies params : ");
      console.log(renAsIsPolicyList);
      console.log(renWithChangesPolicyList);
      console.log(nonRenPolicyList);
      console.log("--------------------------------");


      this.processRenewalPoliciesParams.renAsIsPolicyList = renAsIsPolicyList;
      this.processRenewalPoliciesParams.renWithChangesPolicyList = renWithChangesPolicyList;
      this.processRenewalPoliciesParams.nonRenPolicyList = nonRenPolicyList;

      if (this.processRenewalPoliciesParams.renAsIsPolicyList.length > 0 || 
          this.processRenewalPoliciesParams.renWithChangesPolicyList.length > 0 ||
          this.processRenewalPoliciesParams.nonRenPolicyList.length > 0) {

          this.validForRenewalProcessing = true;
      } else {
          this.validForRenewalProcessing = false;
      }

      $('#processRenewablePolicyModal > #modalBtn').trigger('click');
    }
  }


  onClickProcessNR() {
      var nonRenPolicyList = [];

      for(var i = 0; i < this.passDataNonRenewalPolicies.tableData.length;i++){
        if (this.passDataNonRenewalPolicies.tableData[i].processTag == 'Y') {
            var policyId = this.passDataNonRenewalPolicies.tableData[i].policyId;

            if (this.passDataNonRenewalPolicies.tableData[i].nonRenTag == 'Y') {
                var policyNR = {
                  policyId : policyId,
                  policyNo : this.passDataNonRenewalPolicies.tableData[i].policyNo,
                  nrReasonCd : this.passDataNonRenewalPolicies.tableData[i].nrReasonCd,
                  nrReasonDesc : this.passDataNonRenewalPolicies.tableData[i].nrReasonDesc,
                  procBy : JSON.parse(window.localStorage.currentUser).username,
                  renewalFlag : "NR"
                };
                nonRenPolicyList.push(policyNR);
            }
        }
      }

      console.log("processNonRenewalPolicies params : ");
      console.log(nonRenPolicyList);
      console.log("--------------------------------");

      this.processRenewalPoliciesParams.nonRenPolicyList = nonRenPolicyList;

      if (this.processRenewalPoliciesParams.nonRenPolicyList.length > 0) {
          this.validForRenewalProcessing = true;
      } else {
          this.validForRenewalProcessing = false;
      }

      $('#processRenewablePolicyModal > #modalBtn').trigger('click');
      
  }

  retrieveExpPolList(filter?){
       this.searchParams.renewalFlag = '';
       //this.searchParams.processTag = 'N';
       this.searchParams.processTag = '';
       this.searchParams.renewable = 'Y';
       if(filter !== undefined){
         this.table.overlayLoader = true;
       }
       this.underWritingService.getExpPolList(this.searchParams).subscribe(data => {
          console.log(data);
          var records = data['expPolicyList'];
          this.disabledFlag = true;
          this.renewableData = records;
          this.fetchedData = records;
          var counter = 0;
          this.passDataRenewalPolicies.tableData = [];
          for(var i = 0; i < records.length;i++){
            this.passDataRenewalPolicies.tableData.push(records[i]);
            //this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renAsIsTag = 'Y';
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].processed =  records[i].processTag == 'Y'
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renAsIsTag = records[i].renewalFlag == 'RA'? 'Y':'N'; 
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renWithChange = records[i].renewalFlag == 'RC'? 'Y':'N';
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].nonRenTag = records[i].renewalFlag == 'NR'? 'Y':'N';
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].index = counter++;
            if (records[i].coverageList.length > 0) {
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalSi = records[i].coverageList[0].origTsi;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalPrem = records[i].coverageList[0].origTprem;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renPremAmount = records[i].coverageList[0].totalPrem;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renTsiAmount = records[i].coverageList[0].totalSi;
            } else {
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalSi = 0;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalPrem = 0;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renPremAmount = 0;
                this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renTsiAmount = 0;
            }
            
            if(this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].processed){
              this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].uneditable = ['processTag', 'renAsIsTag', 'renWithChange', 'nonRenTag', 'policyNo', 'cessionDesc','cedingName', 'coRefNo', 'renTsiAmount', 'renPremAmount', 'totalSi', 'totalPrem', 'summaryTag', 'balanceTag', 'claimTag', 'reminderTag', 'specialPolicyTag'];
        
            }
          }
          //Added by Neco 10/09/2019
          if(filter !== undefined){
            switch(this.radioVal){
              case 'byPolNo':
                if(this.PolicyNo.line.length !== 0 || this.PolicyNo.year.length !== 0 || this.PolicyNo.sequenceNo.length !== 0 ||
                   this.PolicyNo.companyNo.length !== 0 || this.PolicyNo.coSeriesNo.length !== 0 || this.PolicyNo.altNo.length !== 0){
                  this.passDataRenewalPolicies.tableData = this.passDataRenewalPolicies.tableData.filter(a=>{
                      var polNo = this.PolicyNo.line + '.*-.*'+            //
                                  this.PolicyNo.year + '.*-.*'+            //
                                  this.PolicyNo.sequenceNo + '.*-.*'+      // Similar to SQL's "LIKE %%" comparison
                                  this.PolicyNo.companyNo + '.*-.*'+       // Neco 10/10/2019
                                  this.PolicyNo.coSeriesNo + '.*-.*'+      //
                                  this.PolicyNo.altNo;                     //
                      var pattern = new RegExp(polNo, 'i');                      
                      return pattern.test(a.policyNo); 
                  });
                }
                break;
              case 'byDate':
                console.log(this.dateParams);
                if(this.dateParams.byDateFrom.length !== 0 && this.dateParams.byDateFrom.length !== 0){
                  this.passDataRenewalPolicies.tableData = this.passDataRenewalPolicies.tableData.filter(a=>{
                      var from = this.dateParams.byDateFrom.length !== 0 ? new Date(this.dateParams.byDateFrom) : new Date();
                      var to = this.dateParams.byDateTo.length !== 0 ? new Date(this.dateParams.byDateTo) : new Date();
                      var expiryDate = new Date(this.ns.toDateTimeString(a.expiryDate));
                      return from <= expiryDate && expiryDate <= to && 
                             a.policyNo.split('-')[0] == (this.params.line.length !== 0 ? this.params.line : a.policyNo.split('-')[0]) &&
                             a.cessionId == (this.params.typeOfCessionId.length !== 0 ? this.params.typeOfCessionId : a.cessionId) &&
                             a.cedingId == (this.params.cedingId.length !== 0 ? this.params.cedingId : a.cedingId);
                  });
                }
                break;
              case 'byMonthYear':
                console.log(this.dateParams);
                if(this.dateParams.byMonthFrom.length !== 0 && this.dateParams.byYearFrom && this.dateParams.byMonthTo.length !== 0 && this.dateParams.byYearTo.length !== 0){
                  this.passDataRenewalPolicies.tableData = this.passDataRenewalPolicies.tableData.filter(a=>{
                      var from = new Date(parseInt(this.dateParams.byYearFrom), parseInt(this.dateParams.byMonthFrom)-1, 1);
                      var to = new Date(parseInt(this.dateParams.byYearTo), parseInt(this.dateParams.byMonthTo), 0);
                      var expiryDate = new Date(this.ns.toDateTimeString(a.expiryDate));
                      return from <= expiryDate && expiryDate <= to && 
                             a.policyNo.split('-')[0] == (this.params.line.length !== 0 ? this.params.line : a.policyNo.split('-')[0]) &&
                             a.cessionId == (this.params.typeOfCessionId.length !== 0 ? this.params.typeOfCessionId : a.cessionId) &&
                             a.cedingId == (this.params.cedingId.length !== 0 ? this.params.cedingId : a.cedingId);
                  });
                }
                break;
            }  
          }
          //END Neco 10/09/2019

          this.table.refreshTable();
          this.table.overlayLoader = false;
       });
  }

  retrieveExpPolListNR(filter?){
       this.passDataNonRenewalPolicies.tableData = [];
       this.searchParams.renewalFlag = '';
       //this.searchParams.processTag = 'N';
       this.searchParams.renewable = 'N';
       this.searchParams.processTag = '';
       if(filter !== undefined){
         this.nrTable.overlayLoader = true;
       }
       console.log(this.searchParams);
       this.underWritingService.getExpPolList(this.searchParams).subscribe(data => {
          console.log(data);
          var records = data['expPolicyList'];
          this.disabledFlag = true;
          this.nonRenewableData = records;
          this.fetchedData = records;
          var counter =0;
          for(var i = 0; i < records.length;i++){
            records[i].nonRenTag = 'Y';
            this.passDataNonRenewalPolicies.tableData.push(records[i]);
            this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].index = counter++;
            this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].edited = false;
            if (records[i].coverageList.length > 0) {
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].totalSi = records[i].coverageList[0].origTsi;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].totalPrem = records[i].coverageList[0].origTprem;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].renPremAmount = records[i].coverageList[0].totalPrem;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].renTsiAmount = records[i].coverageList[0].totalSi;
            } else {
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].totalSi = 0;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].totalPrem = 0;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].renPremAmount = 0;
                this.passDataNonRenewalPolicies.tableData[this.passDataNonRenewalPolicies.tableData.length - 1].renTsiAmount = 0;
            }
          }
          //Added by Neco 10/09/2019
          if(filter !== undefined){
            switch(this.radioVal){
              case 'byPolNo':
                console.log(this.PolicyNo);
                if(this.PolicyNo.line.length !== 0 || this.PolicyNo.year.length !== 0 || this.PolicyNo.sequenceNo.length !== 0 ||
                   this.PolicyNo.companyNo.length !== 0 || this.PolicyNo.coSeriesNo.length !== 0 || this.PolicyNo.altNo.length !== 0){
                  this.passDataNonRenewalPolicies.tableData = this.passDataNonRenewalPolicies.tableData.filter(a=>{
                      var polNo = this.PolicyNo.line + '.*-.*'+            //
                                  this.PolicyNo.year + '.*-.*'+            //
                                  this.PolicyNo.sequenceNo + '.*-.*'+      // Similar to SQL's "LIKE %%" comparison
                                  this.PolicyNo.companyNo + '.*-.*'+       // Neco 10/10/2019
                                  this.PolicyNo.coSeriesNo + '.*-.*'+      //
                                  this.PolicyNo.altNo;                     //
                      var pattern = new RegExp(polNo, 'i');                      
                      return pattern.test(a.policyNo); 
                  });
                console.log(this.passDataNonRenewalPolicies.tableData);
                }
                break;
              case 'byDate':
                console.log(this.dateParams);
                if(this.dateParams.byDateFrom.length !== 0 && this.dateParams.byDateFrom.length !== 0){
                  this.passDataNonRenewalPolicies.tableData = this.passDataNonRenewalPolicies.tableData.filter(a=>{
                      var from = this.dateParams.byDateFrom.length !== 0 ? new Date(this.dateParams.byDateFrom) : new Date();
                      var to = this.dateParams.byDateTo.length !== 0 ? new Date(this.dateParams.byDateTo) : new Date();
                      var expiryDate = new Date(this.ns.toDateTimeString(a.expiryDate));
                      return from <= expiryDate && expiryDate <= to && 
                             a.policyNo.split('-')[0] == (this.params.line.length !== 0 ? this.params.line : a.policyNo.split('-')[0]) &&
                             a.cessionId == (this.params.typeOfCessionId.length !== 0 ? this.params.typeOfCessionId : a.cessionId) &&
                             a.cedingId == (this.params.cedingId.length !== 0 ? this.params.cedingId : a.cedingId);
                  });
                }
                break;
              case 'byMonthYear':
                console.log(this.dateParams);
                if(this.dateParams.byMonthFrom.length !== 0 && this.dateParams.byYearFrom && this.dateParams.byMonthTo.length !== 0 && this.dateParams.byYearTo.length !== 0){
                  this.passDataNonRenewalPolicies.tableData = this.passDataNonRenewalPolicies.tableData.filter(a=>{
                      var from = new Date(parseInt(this.dateParams.byYearFrom), parseInt(this.dateParams.byMonthFrom)-1, 1);
                      var to = new Date(parseInt(this.dateParams.byYearTo), parseInt(this.dateParams.byMonthTo), 0);
                      var expiryDate = new Date(this.ns.toDateTimeString(a.expiryDate));
                      return from <= expiryDate && expiryDate <= to && 
                             a.policyNo.split('-')[0] == (this.params.line.length !== 0 ? this.params.line : a.policyNo.split('-')[0]) &&
                             a.cessionId == (this.params.typeOfCessionId.length !== 0 ? this.params.typeOfCessionId : a.cessionId) &&
                             a.cedingId == (this.params.cedingId.length !== 0 ? this.params.cedingId : a.cedingId);
                  });
                }
                break;
            }  
          }
          //END Neco 10/09/2019
          this.nrTable.refreshTable();
          this.nrTable.overlayLoader = false;
       });
  }

  updateRenewalPolicy(data){
    /*for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
          this.passDataRenewalPolicies.tableData[i].renWithChange = 'N';
          this.passDataRenewalPolicies.tableData[i].renAsIsTag = 'N';
          this.passDataRenewalPolicies.tableData[i].nonRenTag = 'N';
        }
    }*/
    console.log(data);
    this.renAsIsTag = this.table.indvSelect.renAsIsTag == 'Y';

    if(this.table.indvSelect.renWithChange === 'Y'){
       this.changesFlag = true;
    }else {
       this.changesFlag = false;
    }

    if(this.table.indvSelect.nonRenTag === 'Y'){
       this.reasonFlag = true;
    }else{
       this.reasonFlag = false;
    }

    this.printFlag = false;
    for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].printTag == 'Y') {
          this.printFlag = true;
        }
    }
  }

  updateNRPolicy(data){
    /*for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
          this.passDataRenewalPolicies.tableData[i].renWithChange = 'N';
          this.passDataRenewalPolicies.tableData[i].renAsIsTag = 'N';
          this.passDataRenewalPolicies.tableData[i].nonRenTag = 'N';
        }
    }*/

    if(this.nrTable.indvSelect.renWithChange === 'Y'){
       this.changesFlag = true;
    }else {
       this.changesFlag = false;
    }

    if(this.nrTable.indvSelect.nonRenTag === 'Y'){
       this.reasonFlag = true;
    }else{
       this.reasonFlag = false;
    }

    this.printFlag = false;
    for(var i = 0; i < this.passDataNonRenewalPolicies.tableData.length;i++){
        if (this.passDataNonRenewalPolicies.tableData[i].printTag == 'Y') {
          this.printFlag = true;
        }
    }
  }

  gotoInfo() {
      if (this.activeTable == "R") {
          this.router.navigate(['/policy-information', {policyId:this.table.indvSelect.policyId, policyNo:this.table.indvSelect.policyNo,exitLink:'/expiry-listing'}], { skipLocationChange: true });
      } else {
          this.router.navigate(['/policy-information', {policyId:this.nrTable.indvSelect.policyId, policyNo:this.nrTable.indvSelect.policyNo,exitLink:'/expiry-listing'}], { skipLocationChange: true });
      }
  }

  onClickPurge() {
      $('#purgeRenewablePolicyModal #modalBtn').trigger('click');
  }

  onClickPurgeNR() {
      $('#purgeRenewablePolicyModalNR #modalBtn').trigger('click');
  }

  switchScreen() {
    console.log("mode: " + this.mode);
    this.loadNRTable();
  }

  gotoPurgeExtractedPolicy() {
    //this.router.navigate(['/purge-extracted-policy', { }], { skipLocationChange: false });
    this.purgeData.deletePurge.push(this.selectedData);
    this.underWritingService.savePolForPurging(this.purgeData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('fail')
        this.returnCode = 0;
      } else{
        this.returnCode = -1;
        this.purgeFlag = true;
        this.retrieveExpPolList();
        $('#purgeMsgModal > #modalBtn').trigger('click');
      }
    });
  }

  gotoPurgeExtractedPolicyNR() {
    //this.router.navigate(['/purge-extracted-policy', { }], { skipLocationChange: false });
    this.purgeData.deletePurge.push(this.selectedData);
    this.underWritingService.savePolForPurging(this.purgeData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('fail')
        this.returnCode = 0;
      } else{
        this.returnCode = -1;
        this.purgeFlagNR = true;
        this.retrieveExpPolListNR();
        $('#purgeMsgModal > #modalBtn').trigger('click');
      }
    });
  }

  showNRReasonLOV() {
    this.nrReasonLOV.modal.openNoClose();
  }

  showEditModal(){
    if(this.secCoverData.length !== 0){
      this.prepareSectionCoverData(this.secCoverData);
    }else{
      this.prepareSectionCoverData([]);
    }
    $('#editModal #modalBtn').trigger('click');
  }

  onRowClick(data) {
    console.log(data)
    this.activeTable = "R";
    this.nrReasonCd = "";
    this.nrReasonDescription = "";
    this.changes = "";
    this.remarks = "";

    if(data !== null){
      this.disabledFlag = false;
      this.lineCd = data.policyNo.split('-')[0];
      this.secCoverData = data.sectionCoverList;
      this.coverageData = data.coverageList[0];
      this.deductibleData = data.deductiblesList;
      this.catPerilData = data.catPerilList;
      this.nrReasonCd = data.nrReasonCd;
      this.nrReasonDescription = data.nrReasonDesc;
      this.changes = data.changes;
      this.rowPolicyId = data.policyId;
      this.rowProjId  = data.projectList[0].projId;
      this.rowRiskId  = data.projectList[0].riskId;
      this.remarks = data.remarks;
      this.tblIndex = data.index;
      this.changesFlag = data.renWithChange == 'Y';
      this.purgeFlag = false;
      this.selectedData = data;
      
      if(data.nonRenTag === 'Y'){
         this.reasonFlag = true;
      }else{
         this.reasonFlag = false;
      }
      this.renAsIsTag = !(data.renWithChange == 'Y') ;

      this.loadNRTable();


    }else{
      this.disabledFlag = true;
      this.secCoverData = data;
      this.coverageData = data;
      this.tblIndex = null;
      this.lineCd = null;
      this.changesFlag = false;
      this.purgeFlag = true;
      this.selectedData = null;
      this.clearVar();
      this.remindersData.tableData = [];
      this.remindersTable.refreshTable();
    }
  }

  loadNRTable() {
    this.remindersData.tableData = [];
    this.remindersTable.overlayLoader = true;

    if (this.mode == 'reminder') {

      this.remindersData.dataTypes = ['fasymbol','text', 'text', 'date', 'time', 'text', 'date'];
      this.remindersData.keys = ['type', 'title', 'reminder', 'reminderDate', 'alarmTime', 'assignedTo','createDate'];
      this.remindersData.tHeader = ['Severity', 'Title', 'Reminder', 'Reminder Date', 'Alarm Time', 'Assigned To', 'Date Assigned'];
      this.remindersData.uneditable = [false,true,true,true,true,true,true];

      this.workFlowManagerService.retrieveWfmReminders('', '', '', 'Policy', this.rowPolicyId).subscribe((data: any)=>{
          if (data.reminderList != null) {          
            for(let rec of data.reminderList){
              if (rec.impTag == 'Y' && rec.urgTag == 'N') {
                rec.type = 'fa fa-warning span-div-flag-imp';
              } else if (rec.impTag == 'N' && rec.urgTag == 'Y') {
                rec.type = 'fa fa-warning span-div-flag-urg';
              } else if (rec.impTag == 'Y' && rec.urgTag == 'Y') {
                rec.type = 'fa fa-warning span-div-flag-imp-urg';
              }
              
              this.remindersData.tableData.push(rec);
            }

            this.remindersTable.refreshTable();
          } else {
            //alert("Saved successfully.");
          }
      });
    } else if (this.mode == 'note') {

      this.remindersData.dataTypes = ['fasymbol','text', 'text', 'text', 'date'];
      this.remindersData.keys = ['type', 'title', 'note', 'assignedTo','createDate'];
      this.remindersData.tHeader = ['Severity', 'Title', 'Note', 'Assigned To', 'Date Assigned'];
      this.remindersData.uneditable = [false,true,true,true,true];

      this.workFlowManagerService.retrieveWfmNotes('', '', '', 'Policy', this.rowPolicyId).subscribe((data: any)=>{
          if (data.noteList != null) {          
            for(let rec of data.noteList){
              if (rec.impTag == 'Y' && rec.urgTag == 'N') {
                rec.type = 'fa fa-bookmark span-div-flag-imp';
              } else if (rec.impTag == 'N' && rec.urgTag == 'Y') {
                rec.type = 'fa fa-bookmark span-div-flag-urg';
              } else if (rec.impTag == 'Y' && rec.urgTag == 'Y') {
                rec.type = 'fa fa-bookmark span-div-flag-imp-urg';
              }
              
              this.remindersData.tableData.push(rec);
            }

            this.remindersTable.refreshTable();
          } else {
            //alert("Saved successfully.");
          }
      });
    }

  }

  clearVar(){
    this.nrReasonCd = null;
    this.nrReasonDescription = null;
    this.remarks = null;
    this.changes = null;
    this.nrRemarks = null;
  }


  onRowClickNR(data) {
    this.activeTable = "NR";
    this.nrReasonCd = "";
    this.nrReasonDescription = "";
    this.remarks = "";
    this.selectedData = null;

    if(data !== null){
      this.disabledFlag = false;
      this.lineCd = data.policyNo.split('-')[0];
      this.secCoverData = data.sectionCoverList;
      this.coverageData = data.coverageList[0];
      this.deductibleData = data.deductiblesList;
      this.nrReasonCd = data.nrReasonCd;
      this.nrReasonDescription = data.nrReasonDesc;
      this.nrRemarks = data.remarks;
      this.tblIndexNR = data.index;
      this.changesFlag = true;
      this.purgeFlagNR = false;
      this.selectedData = data;
      

      if(data.nonRenTag === 'Y'){
         this.reasonFlag = true;
      }else{
         this.reasonFlag = false;
      }


    }else{
      this.disabledFlag = true;
      this.secCoverData = data;
      this.coverageData = data;
      this.tblIndexNR = data;
      this.lineCd = null;
      this.changesFlag = false;
      this.purgeFlagNR = true;
      this.selectedData = null;
      this.clearVar();
    }
    
  }

  nrRemarksChanged(data){
    this.passDataNonRenewalPolicies.tableData[this.tblIndexNR].remarks = this.nrRemarks;
    this.passDataNonRenewalPolicies.tableData[this.tblIndexNR].edited = true;
  }

  reasonCdChange(data){
    this.passDataNonRenewalPolicies.tableData[this.tblIndexNR].nrReasonCd = this.nrReasonCd;
    this.passDataNonRenewalPolicies.tableData[this.tblIndexNR].edited = true;
  }
  
  focusBlur() {
    setTimeout(() => {$('.req').focus();$('.req').blur()},0)
  }

  prepareSectionCoverData(data:any) {
    this.passDataSectionCover.tableData = [];
    this.editModal = this.coverageData;
    this.editModal.pctShare = this.editModal.pctShare;
    this.editModal.totalValue = this.editModal.totalValue;
    this.secISi = 0;
    this.secIISi = 0; 
    this.secIIISi = 0;
    this.secIPrem = 0;
    this.secIIPrem = 0;
    this.secIIIPrem = 0;
    this.totalPrem = 0;
    for(var i = 0 ; i < data.length;i++){
      this.passDataSectionCover.tableData.push(data[i]);
      this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].deleted = false;

      if(this.lineCd === 'CAR' || this.lineCd === 'EAR'){
        if(data[i].section == 'I'){
          if(data[i].addSi == 'Y'){
            this.secISi += data[i].sumInsured;
            this.totalSi += data[i].sumInsured;
          }
            this.secIPrem += data[i].premAmt;
            this.totalPrem += data[i].premAmt;
        }else if(data[i].section == 'II'){
          if(data[i].addSi == 'Y'){
            this.secIISi += data[i].sumInsured;
          }
            this.secIIPrem += data[i].premAmt;
            this.totalPrem += data[i].premAmt;
        }else if(data[i].section == 'III'){
          if(data[i].addSi == 'Y'){
            this.secIIISi += data[i].sumInsured;
            this.totalSi += data[i].sumInsured;
          }
            this.secIIIPrem += data[i].premAmt;
            this.totalPrem += data[i].premAmt;
        } 
      }else if(this.lineCd === 'EEI'){
         if(data[i].section == 'I'){
           if(data[i].addSi == 'Y'){
             this.secISi += data[i].sumInsured;
             this.totalSi += data[i].sumInsured;
           }
             this.secIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         }else if(data[i].section == 'II'){
           if(data[i].addSi == 'Y'){
             this.secIISi += data[i].sumInsured;
             this.totalSi += data[i].sumInsured;
           }
             this.secIIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         }else if(data[i].section == 'III'){
           if(data[i].addSi == 'Y'){
             this.secIIISi += data[i].sumInsured;
             this.totalSi += data[i].sumInsured;
           }
             this.secIIIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         } 
      }else {
         if(data[i].section == 'I'){
           if(data[i].addSi == 'Y'){
             this.secISi += data[i].sumInsured;
             this.totalSi += data[i].sumInsured;
           }
             this.secIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         }else if(data[i].section == 'II'){
           if(data[i].addSi == 'Y'){
             this.secIISi += data[i].sumInsured;
           }
             this.secIIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         }else if(data[i].section == 'III'){
           if(data[i].addSi == 'Y'){
             this.secIIISi += data[i].sumInsured;
           }
             this.secIIIPrem += data[i].premAmt;
             this.totalPrem += data[i].premAmt;
         }
      }
    }
    this.sectionTable.refreshTable();

    this.passDataTotalPerSection.tableData[0].section = 'SECTION I';
    this.passDataTotalPerSection.tableData[0].sumInsured = this.secISi;
    this.passDataTotalPerSection.tableData[0].premium = this.secIPrem;
    this.passDataTotalPerSection.tableData[1].section = 'SECTION II';
    this.passDataTotalPerSection.tableData[1].sumInsured = this.secIISi;
    this.passDataTotalPerSection.tableData[1].premium = this.secIIPrem;
    this.passDataTotalPerSection.tableData[2].section = 'SECTION III';
    this.passDataTotalPerSection.tableData[2].sumInsured = this.secIIISi;
    this.passDataTotalPerSection.tableData[2].premium = this.secIIIPrem;
    this.totalPerSection.refreshTable();
    this.getEditableCov();
    this.focusBlur();
    /*this.editModal.pctShare = this.decimal.transform(this.editModal.pctShare,'1.10-10');
    this.editModal.totalValue = this.decimal.transform(this.editModal.totalValue, '1.2-2');
    this.editModal.pctPml = this.decimal.transform(this.editModal.pctPml,'1.10-10');*/
  }

  onRowSecCovClick(data:any) {
    this.passDataDeductibles.tableData = [];
    if(data !== null){
        var dedtData;
        this.secCoverCd = this.sectionTable.indvSelect.coverCd;
        dedtData = this.deductibleData.filter((a) => a.coverCd === this.secCoverCd);

        for(var i=0; i<dedtData.length;i++){
          this.passDataDeductibles.tableData.push(dedtData[i]);
        }
        this.deductiblesTable.refreshTable();
    }
  }

  updateSectionCover(data){
    this.secISi     = 0;
    this.secIISi    = 0;
    this.secIIISi   = 0;
    this.secIPrem   = 0;
    this.secIIPrem  = 0;
    this.secIIIPrem = 0;
    this.totalSi    = 0;
    this.totalPrem  = 0;

    if(data.hasOwnProperty('lovInput')) {
      this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideSectionCoverArray;

      this.secCoversLov.checkCode(data.ev.target.value, data.ev);
    }  
      for(var i = 0 ; i < this.passDataSectionCover.tableData.length;i++){
        this.passDataSectionCover.tableData[i].premAmt = this.passDataSectionCover.tableData[i].discountTag == 'Y'? this.passDataSectionCover.tableData[i].premAmt:this.passDataSectionCover.tableData[i].sumInsured * (this.passDataSectionCover.tableData[i].premRt/100);
        if(this.lineCd === 'CAR' || this.lineCd === 'EAR'){
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                  this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                  this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            } 
        }else if(this.lineCd === 'EEI'){
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            } 
        }else {
            if(this.passDataSectionCover.tableData[i].section == 'I' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III' && !this.passDataSectionCover.tableData[i].deleted){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIIISi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }
        }
      }
      this.sectionTable.refreshTable();

      this.passDataTotalPerSection.tableData[0].section = 'SECTION I';
      this.passDataTotalPerSection.tableData[0].sumInsured = this.secISi;
      this.passDataTotalPerSection.tableData[0].premium = this.secIPrem;
      this.passDataTotalPerSection.tableData[1].section = 'SECTION II';
      this.passDataTotalPerSection.tableData[1].sumInsured = this.secIISi;
      this.passDataTotalPerSection.tableData[1].premium = this.secIIPrem;
      this.passDataTotalPerSection.tableData[2].section = 'SECTION III';
      this.passDataTotalPerSection.tableData[2].sumInsured = this.secIIISi;
      this.passDataTotalPerSection.tableData[2].premium = this.secIIIPrem;
      this.totalPerSection.refreshTable();

      this.editModal.totalSi = this.totalSi;
      this.editModal.totalPrem = this.totalPrem;

      for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
          if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
            this.passDataRenewalPolicies.tableData[i].renTsiAmount = this.totalSi;
            this.passDataRenewalPolicies.tableData[i].renPremAmount = this.totalPrem;
          }
      }
      this.table.refreshTable();
      this.getEditableCov();
  }

  pctShare(){
    this.coverageData.totalValue = this.coverageData.totalSi/this.coverageData.pctShare*100;
    this.coverageData.totalValue = this.decimal.transform(this.coverageData.totalValue, '1.2-2');
  }

  totalValue(){
    this.coverageData.pctShare = this.coverageData.totalSi/this.coverageData.totalValue*100;
    this.coverageData.pctShare = this.decimal.transform(this.coverageData.pctShare, '1.10-10');
  }

  getEditableCov(){
    for(let data of this.passDataSectionCover.tableData){
      data.uneditable = [];
      if(data.discountTag == 'Y'){
        data.uneditable.pop();
      }else if(data.discountTag == 'N' ) {
          data.uneditable.push('premAmt');
      }
    }
  }

  selectedSectionCoversLOV(data){
        if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
          this.sectionCoverLOVRow = data[0].ev.index;
          this.ns.lovLoader(data[0].ev, 0);
        }
        $('#cust-table-container').addClass('ng-dirty');

        if(data[0].coverCd != '' && data[0].coverCd != null && data[0].coverCd != undefined) {
          //HIDE THE POWERFUL MAGNIFYING GLASS
          this.passDataSectionCover.tableData[this.sectionCoverLOVRow].showMG = 1;
        }
        this.passDataSectionCover.tableData = this.passDataSectionCover.tableData.filter(a=>{return a.showMG !== 1});
        //this.validateSectionCover();
        for(var i = 0; i<data.length;i++){
          this.passDataSectionCover.tableData.push(JSON.parse(JSON.stringify(this.passDataSectionCover.nData)));
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].coverCd = data[i].coverCd;
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].coverName = data[i].coverName;
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].section = data[i].section;
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].bulletNo = data[i].bulletNo;
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].edited = true;
          this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].showMG = 0;
          if(data[i].coverName !== undefined && 'OTHERS' === data[i].coverName.substring(0,6).toUpperCase()){
               this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].others = true;
          }
        }
        this.sectionTable.refreshTable();
   }

   selectedNRLOV(data) {
       this.nrReasonCd = data.reasonCd;
       this.nrReasonDescription = data.description;

       if (this.activeTable == "R") {
         for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
              if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
                this.passDataRenewalPolicies.tableData[i].nrReasonCd = this.nrReasonCd;
                this.passDataRenewalPolicies.tableData[i].nrReasonDesc = this.nrReasonDescription;
              }
         }
       } else {
         for(var i = 0; i < this.passDataNonRenewalPolicies.tableData.length;i++){
              if (this.passDataNonRenewalPolicies.tableData[i].policyId == this.nrTable.indvSelect.policyId) {
                this.passDataNonRenewalPolicies.tableData[i].nrReasonCd = this.nrReasonCd;
                this.passDataNonRenewalPolicies.tableData[i].nrReasonDesc = this.nrReasonDescription;
              }
         }
       }

       

       this.ns.lovLoader(data.ev, 0);
   }

  checkCode(ev, field){
      this.ns.lovLoader(ev, 1);

      if(field === 'nrReason') {            
          this.nrReasonLOV.checkCode(this.nrReasonCd, ev);
      }
      else if(field === 'line') {            
            this.lineLov.checkCode(this.params.line, ev);
      } else if(field === 'typeOfCession'){
          this.typeOfCessionLov.checkCode(this.params.typeOfCessionId, ev);
      } else if(field === 'cedingCo') {         
          this.cedingCoLov.checkCode(this.params.cedingId, ev);
      }
  }

  sectionCoversLOV(data){
      this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
      this.secCoversLov.modal.openNoClose();
      //$('#sectionCoversLOV #modalBtn').trigger('click');
      this.sectionCoverLOVRow = data.index;
  } 

  savePolicyChanges() {
    this.prepareCoverage();
    this.underWritingService.saveExpEdit(this.ExpcoverageData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('failed')
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        console.log('success')
        //this.modalService.dismissAll();
        this.retrieveExpPolList();
      }
    });
  }

  onClickSave(){
    $('#coverageConfirm #confirm-save #modalBtn2').trigger('click');
  }

  tagProcess(mode) {
      if(this.currentTab == 'renew'){
        if (mode == 'tAll') {
          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            this.passDataRenewalPolicies.tableData[i].processTag = 'Y';
          }
        }

        if (mode == 'uAll') {
          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            this.passDataRenewalPolicies.tableData[i].processTag = 'N';
          }
        }

        if (mode == 'tagSel') {
          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            this.passDataRenewalPolicies.tableData[i].processTag = 'N';
          }

          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            if (this.passDataRenewalPolicies.tableData[i].renWithChange == 'Y' || this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'Y' || this.passDataRenewalPolicies.tableData[i].nonRenTag == 'Y') {
              this.passDataRenewalPolicies.tableData[i].processTag = 'Y';
            }
          }
        }
      }else if(this.currentTab == 'nonRenew'){
        if (mode == 'tAll') {
          for(var i = 0; i < this.passDataNonRenewalPolicies.tableData.length;i++){
            this.passDataNonRenewalPolicies.tableData[i].processTag = 'Y';
          }
        }

        if (mode == 'uAll' || mode == 'tagSel') {
          for(var i = 0; i < this.passDataNonRenewalPolicies.tableData.length;i++){
            this.passDataNonRenewalPolicies.tableData[i].processTag = 'N';
          }
        }

        /*if (mode == 'tagSel') {
          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            this.passDataRenewalPolicies.tableData[i].processTag = 'N';
          }

          for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            if (this.passDataRenewalPolicies.tableData[i].renWithChange == 'Y' || this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'Y' || this.passDataRenewalPolicies.tableData[i].nonRenTag == 'Y') {
              this.passDataRenewalPolicies.tableData[i].processTag = 'Y';
            }
          }
        }*/
      }
  }

  pad(ev,num) {
    var str = ev.target.value;    

    return str === '' ? '' : String(str).padStart(num, '0');
  }


  processRenewalPolicies() {
      this.underWritingService.processRenewablePolicy(this.processRenewalPoliciesParams).subscribe(data => {
        console.log(data)
          console.log("processRenewablePolicy: " + JSON.stringify(data));
          if (data['errorList'].length > 0) {

          } else {

              this.renewedPolicies = data['renAsIsPolicyList'];
              this.wcPolicies = data['renWithChangesPolicyList'];
              this.nrPolicies = data['nonRenPolicyList'];

              $('#renewableProcessSuccess > #modalBtn').trigger('click');

              
              this.retrieveExpPolList();
              this.retrieveExpPolListNR();
              
              this.nrReasonCd = "";
              this.nrReasonDescription = "";
              this.changes = "";
              this.disabledFlag = true;
              this.secCoverData = null;
              this.coverageData = null;
              this.lineCd = null;
          }
      });

  }

  onClickNRSave(){
    $('#extractedNRPolicies #confirm-save #modalBtn2').trigger('click');
  }

  onClickRenSave(){
    console.log("onClickRenSave");
    //Added by Neco 10/10/2019
    var reqFieldsCheck: boolean = false;
    for(var i of this.passDataRenewalPolicies.tableData){
      if(i.renWithChange == 'Y' && (i.changes == null || i.changes.length == 0)){
        reqFieldsCheck = true;
        break;
      }
    }
    if(reqFieldsCheck){
      this.dialogIcon = 'error';
      this.successDiag.open();
    }else{
      $('#extractedPolicies #confirm-save #modalBtn2').trigger('click');
    }
    //END Neco 10/10/2019
  }

  saveChangesToExtPolicyNR(){
    this.ExpGenInfo.saveExpRenewable = [];
    for(var i = 0 ; i < this.passDataNonRenewalPolicies.tableData.length; i++){
      if(this.passDataNonRenewalPolicies.tableData[i].edited){
        this.ExpGenInfo.saveExpRenewable.push(this.passDataNonRenewalPolicies.tableData[i]);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].renewalFlag =  this.passDataNonRenewalPolicies.tableData[i].renAsIsTag == 'Y' ? 'RA': 
                                                                                                     this.passDataNonRenewalPolicies.tableData[i].renWithChange == 'Y' ? 'RC': 
                                                                                                     this.passDataNonRenewalPolicies.tableData[i].nonRenTag == 'Y' ? 'NR':'N';
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].expiryDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].expiryDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].extractDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].extractDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].processedDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].processedDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].inceptDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].inceptDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].lapseFrom = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].lapseFrom);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].lapseTo = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].lapseTo);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].maintenanceFrom = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].maintenanceFrom);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].maintenanceTo = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].maintenanceTo);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].issueDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].issueDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].effDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].effDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].distDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].distDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].acctDate = this.ns.toDateTimeString(this.passDataNonRenewalPolicies.tableData[i].acctDate);
      }
    }

    this.underWritingService.saveExpGenInfo(this.ExpGenInfo).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('Failed')
        this.dialogIcon = 'error';
        this.dialogMessage = '';
        this.successDiagNR.open();
      } else{
        console.log('Success!!!!!!!')
        this.dialogIcon = 'success';
        this.dialogMessage = '';
        this.successDiagNR.open();
        this.retrieveExpPolListNR();
        this.clearVar();
        this.forms.control.markAsPristine();
      }
    });
  }

  saveChangesToExtPolicy() {
    this.ExpGenInfo.saveExpRenewable = [];
    for( var i =0 ; i < this.passDataRenewalPolicies.tableData.length; i++){
      if(this.passDataRenewalPolicies.tableData[i].edited){
        this.ExpGenInfo.saveExpRenewable.push(this.passDataRenewalPolicies.tableData[i]);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].renewalFlag =  this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'Y' ? 'RA': 
                                                                                                     this.passDataRenewalPolicies.tableData[i].renWithChange == 'Y' ? 'RC': 
                                                                                                     this.passDataRenewalPolicies.tableData[i].nonRenTag == 'Y' ? 'NR':'N';
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].expiryDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].expiryDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].extractDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].extractDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].processedDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].processedDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].inceptDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].inceptDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].lapseFrom = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].lapseFrom);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].lapseTo = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].lapseTo);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].maintenanceFrom = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].maintenanceFrom);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].maintenanceTo = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].maintenanceTo);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].issueDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].issueDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].effDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].effDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].distDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].distDate);
        this.ExpGenInfo.saveExpRenewable[this.ExpGenInfo.saveExpRenewable.length - 1].acctDate = this.ns.toDateTimeString(this.passDataRenewalPolicies.tableData[i].acctDate);
        
      }
    }

    this.underWritingService.saveExpGenInfo(this.ExpGenInfo).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('Failed')
        this.dialogIcon = 'error';
        this.dialogMessage = '';
        this.successDiagRN.open();
      } else{
        console.log('Success!!!!!!!')
        this.dialogIcon = 'success';
        this.dialogMessage = '';
        this.successDiagRN.open();
        this.retrieveExpPolList();
        this.clearVar();
        this.form.control.markAsPristine();
      }
    });
  }

  changesValueChanged(data) {
    this.passDataRenewalPolicies.tableData[this.tblIndex].changes = this.changes;
    this.passDataRenewalPolicies.tableData[this.tblIndex].edited  = true;
  }

  remarksValueChanged(data) {
    this.passDataRenewalPolicies.tableData[this.tblIndex].remarks = this.remarks;
    this.passDataRenewalPolicies.tableData[this.tblIndex].edited  = true;
  }

  nrReasonCdChange(data){
    this.passDataRenewalPolicies.tableData[this.tblIndex].nrReasonCd = this.nrReasonCd;
    this.passDataRenewalPolicies.tableData[this.tblIndex].edited  = true;
  }

  prepareCoverage(){
      this.ExpcoverageData.policyId         = this.coverageData.policyId;
      this.ExpcoverageData.projId           = this.coverageData.projId;
      this.ExpcoverageData.riskId           = this.coverageData.riskId;
      this.ExpcoverageData.sectionISi       = this.secISi;
      this.ExpcoverageData.sectionIiSi      = this.secIISi;
      this.ExpcoverageData.sectionIiiSi     = this.secIIISi;
      this.ExpcoverageData.totalSi          = this.coverageData.totalSi;
      this.ExpcoverageData.sectionIPrem     = this.secIPrem;
      this.ExpcoverageData.sectionIiPrem    = this.secIIPrem;
      this.ExpcoverageData.sectionIiiPrem   = this.secIIIPrem;
      this.ExpcoverageData.totalPrem        = this.coverageData.totalPrem;
      this.ExpcoverageData.currencyCd       = this.coverageData.currencyCd;
      this.ExpcoverageData.currencyRt       = this.coverageData.currencyRt;
      this.ExpcoverageData.pctShare         = parseFloat(this.coverageData.pctShare.toString().split(',').join(''));
      this.ExpcoverageData.pctPml           = this.coverageData.pctPml;
      this.ExpcoverageData.totalValue       = parseFloat(this.coverageData.totalValue.toString().split(',').join(''));
      this.ExpcoverageData.remarks          = this.coverageData.remarks;
      this.ExpcoverageData.origSeciSi       = this.coverageData.origSeciSi;
      this.ExpcoverageData.origSeciiSi      = this.coverageData.origSeciiSi;
      this.ExpcoverageData.origSeciiiSi     = this.coverageData.origSeciiiSi;
      this.ExpcoverageData.origTsi          = this.coverageData.origTsi;
      this.ExpcoverageData.origSeciPrem     = this.coverageData.origSeciPrem;
      this.ExpcoverageData.origSeciiPrem    = this.coverageData.origSeciiPrem;
      this.ExpcoverageData.origSeciiiPrem   = this.coverageData.origSeciiiPrem;
      this.ExpcoverageData.origTprem        = this.coverageData.origTprem;
      this.ExpcoverageData.createUser       = this.coverageData.createUser;
      this.ExpcoverageData.createDate       = this.ns.toDateTimeString(this.coverageData.createDate);
      this.ExpcoverageData.updateUser       = this.coverageData.updateUser;
      this.ExpcoverageData.updateDate       = this.ns.toDateTimeString(this.coverageData.updateDate);
      this.ExpcoverageData.expSecCovers     = [];
      for(var i = 0 ;i < this.passDataSectionCover.tableData.length; i++){
        if(this.passDataSectionCover.tableData[i].edited && !this.passDataSectionCover.tableData[i].deleted){
          this.ExpcoverageData.expSecCovers.push(this.passDataSectionCover.tableData[i]);
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].createDate = this.ns.toDateTimeString(this.passDataSectionCover.tableData[i].createDate);
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].updateDate = this.ns.toDateTimeString(this.passDataSectionCover.tableData[i].updateDate);
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].lineCd = this.lineCd;
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].policyId = this.rowPolicyId;
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].projId = this.rowProjId;
          this.ExpcoverageData.expSecCovers[this.ExpcoverageData.expSecCovers.length - 1].riskId = this.rowRiskId;
        }

        if(this.passDataSectionCover.tableData[i].deleted){
          this.ExpcoverageData.delexpSecCovers.push(this.passDataSectionCover.tableData[i]);
        }
      }
  }

  catPeril(){
    if(this.catPerilData.length !== 0){
      this.prepareCatPeril(this.catPerilData);
    }else{
      this.prepareCatPeril([]);
    }
    this.modal.openNoClose()
  }

  prepareCatPeril(data){
    console.log(data)
    this.passDataCATPerils.tableData = [];
    for(var i = 0 ; i < data.length; i ++){
      this.passDataCATPerils.tableData.push(data[i]);
    }
    console.log(this.passDataCATPerils.tableData)
    this.catPerilsTable.refreshTable();
  }

  prepareSaveCatPeril(){
    for(var i = 0 ; i < this.passDataCATPerils.tableData.length;i++){
      if(this.passDataCATPerils.tableData[i].edited){
        this.ExpCatPerilsData.expcatPeril.push(this.passDataCATPerils.tableData[i]);
        this.ExpCatPerilsData.expcatPeril[this.ExpCatPerilsData.expcatPeril.length - 1].createDate = this.ns.toDateTimeString(this.ExpCatPerilsData.expcatPeril[this.ExpCatPerilsData.expcatPeril.length - 1].createDate);
        this.ExpCatPerilsData.expcatPeril[this.ExpCatPerilsData.expcatPeril.length - 1].updateDate = this.ns.toDateTimeString(this.ExpCatPerilsData.expcatPeril[this.ExpCatPerilsData.expcatPeril.length - 1].updateDate);
      }
    }
  }

  saveCatPeril(){
    this.prepareSaveCatPeril();
    this.underWritingService.saveExpCat(this.ExpCatPerilsData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        console.log('failed')
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.modal.closeModal();
        this.successDiagCat.open();
      } else{
        console.log('success')
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.modal.closeModal();
        this.successDiagCat.open();
        this.retrieveExpPolList();
      }
    });
  }

  showTypeOfCessionLOV(){
    this.typeOfCessionLov.modal.openNoClose();
  }

  showLineLOV(){
    this.lineLov.modal.openNoClose();
  }

  showCedingCompanyLOV() {
    this.cedingCoLov.modal.openNoClose();
  }

  setLine(data){
    this.params.line = data.lineCd;
    this.params.lineDescription = data.description;
    this.ns.lovLoader(data.ev, 0);

    if(data.hasOwnProperty('fromLOV')){
        $('#parameter > #modalBtn').trigger('click');    
    }
  }

  setTypeOfCession(data) {        
        this.params.typeOfCessionId = data.cessionId;
        this.params.typeOfCession = data.description;
  }

  setCedingcompany(event){
    this.params.cedingId = event.cedingId;
    this.params.cedingName = event.cedingName;
    this.ns.lovLoader(event.ev, 0);
  }

  showPolicyLov(){
    this.passDataLov.tableData = [];
    for(var i = 0 ; i  < this.fetchedData.length; i++){
      this.passDataLov.tableData.push(this.fetchedData[i]);
    }
    this.tableLov.refreshTable();
    this.policyModal.openNoClose()
  }

  setLOV(){
    if(this.selected !== null){
      var polNo = this.selected.policyNo.split('-');
      var polId = this.selected.policyId;
      this.PolicyNo.line  = polNo[0];
      this.PolicyNo.year  = polNo[1];
      this.PolicyNo.sequenceNo  = polNo[2];
      this.PolicyNo.companyNo  = polNo[3];
      this.PolicyNo.coSeriesNo  = polNo[4];
      this.PolicyNo.altNo  = polNo[5];

      this.underWritingService.getPolGenInfo(polId,null).subscribe((data:any) => {
          console.log(data)
          this.params.line = data.policy.lineCd;
          this.params.lineDescription = data.policy.lineCdDesc;
          this.params.typeOfCessionId = data.policy.cessionId;
          this.params.typeOfCession = data.policy.cessionDesc;
          this.params.cedingId = data.policy.cedingId;
          this.params.cedingName = data.policy.cedingName;
      });
    }
  }

  onClick(data){
    console.log(data)
    this.selected = data;
  }

  clearData(){
    this.params.line = '';
    this.params.lineDescription = '';
    this.params.typeOfCession = '';
    this.params.typeOfCessionId = '';
    this.params.cedingId = '';
    this.params.cedingName = '';
    this.PolicyNo.line = '';
    this.PolicyNo.year = '';
    this.PolicyNo.companyNo = '';
    this.PolicyNo.sequenceNo = '';
    this.PolicyNo.coSeriesNo = '';
    this.PolicyNo.altNo = '';
    this.dateParams.byDateFrom = '';
    this.dateParams.byDateTo = '';
    this.dateParams.byMonthFrom = '';
    this.dateParams.byMonthTo = '';
    this.dateParams.byYearFrom = '';
    this.dateParams.byYearTo = '';
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.clearData();
    this.changes = '';
    this.nrReasonCd = '';
    this.nrReasonDescription = '';
    this.remarks = '';
    this.nrRemarks = '';
    this.currentTab = $event.nextId;
    if($event.nextId == 'renew'){
      this.retrieveExpPolList();
    }else if($event.nextId == 'nonRenew'){
      this.retrieveExpPolListNR();
    }
  }

  //Added by Neco 10/09/2019
  filterMainTable(){
    if(this.currentTab == 'renew'){
      this.retrieveExpPolList('filter');
    }else if(this.currentTab == 'nonRenew'){
      this.retrieveExpPolListNR('filter');
    }
    
  }
  //End Neco

  printDestination:string = 'screen';
  print(){
    let reportName = '';
    let params:any = {
      userId : this.ns.getCurrentUser()
    }
    if(this.currentTab == 'renew'){
      for(let data of this.passDataRenewalPolicies.tableData.filter(a=>a.printTag == 'Y')){
        
        if(data['renAsIsTag'] == 'Y'){
          reportName = 'POLR027C'
        }else
        if(data['renWithChange'] == 'Y'){
          reportName = 'POLR027D'
        }else
        if(data['nonRenTag'] == 'Y'){
          reportName = 'POLR027B'
        }else{
          reportName = 'POLR027A'
        }

        params.reportId = reportName;
        params.cedingId = data.cedingId;
        params.policyId = data.policyId;
        params.fileName = data.policyNo;
        this.ps.print(this.printDestination,reportName,params);

      }
    }

  }
}
