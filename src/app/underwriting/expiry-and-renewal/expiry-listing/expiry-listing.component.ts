import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { DecimalPipe } from '@angular/common';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
import { Router } from '@angular/router';
import { MtnNonrenewReasonComponent } from '@app/maintenance/mtn-nonrenew-reason/mtn-nonrenew-reason.component';


@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {
  @ViewChild('mtnSectionCover') secCoversLov: MtnSectionCoversComponent;
  @ViewChild('totalPerSection') totalPerSection:CustEditableNonDatatableComponent;
  @ViewChild('contentEditPol') contentEditPol;
  @ViewChild('sectionTable') sectionTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('table') table: CustEditableNonDatatableComponent;
  @ViewChild('mtnNonRenewReason') nrReasonLOV: MtnNonrenewReasonComponent;
  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  byDate: boolean = true;
  searchParams: any[] = [];
  fetchedData: any;
  disabledFlag: boolean = true;
  secCoverData: any;
  coverageData:any;
  deductibleData:any;
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

  nrReasonCd:string = "";
  nrReasonDescription:string = "";
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
      createDateSec: '',
      createUserSec: JSON.parse(window.localStorage.currentUser).username,
      deductiblesSec:[],
      description: null,
      discountTag:'N',
      premRt: null,
      premAmt: null,
      section:null,
      sumInsured:null,
      updateDateSec: '',
      updateUserSec: JSON.parse(window.localStorage.currentUser).username
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
        tHeader: ["P", "RA", "RC", "NR", "Policy No", "Type of Cession","Ceding Company", "Co Ref No","Ren TSI Amount","Ren Pre Amount","TSI Amount","Prem Amount","S","B","C","R","SP"],
        dataTypes: [
                    /*"checkbox", "checkbox", "checkbox", "checkbox", "text", "text","text","text","currency","currency","currency","currency","text","checkbox","checkbox","checkbox","checkbox", "checkbox"*/
                    "checkbox", "checkbox", "checkbox", "checkbox", "text","text", "text","text","currency","currency","currency","currency","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tooltip:['Process','Renewal As Is','Renewal With Changes','Non-Renewal',null,,null,null,null,null,null,null,'Summarized Policy','With Balance Flag','With Claim Flag','With Reminder','Special Policy'],
        nData: {
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
        keys:['processTag', 'renAsIsTag', 'renWithChange', 'nonRenTag', 'policyNo', 'cessionDesc','cedingName', 'coRefNo', 'renTsiAmount', 'renPremAmount', 'totalSi', 'totalPrem', 'summaryTag', 'balanceTag', 'claimTag', 'reminderTag', 'specialPolicyTag'],
        pageLength: 10,
        pageID:'RenewalPolicies',
        paginateFlag:true,
        infoFlag:true,
        uneditable: [false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true],
   };

   passDataExtensionPolicies: any = {
        tHeader: ["P","Policy No", "Type of Cession", "Ceding Company", "Co Ref No","TSI Amount","Prem Amount","Co Ref No","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "text", "text","text","text","text","text","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tableData: [[false,"TEST","TEST","TEST","TEST","TEST","TEST","TEST",false,false,false,false,false]],
        pageLength: 10,
        paginateFlag:true,
        pageID:'extensionPolicy',
        infoFlag:true,
        tooltip:['Process Policy',null,null,null,null,null,null,null,'Summarized','With Balance','With Claim','With Reminder','Reqular Policy']

   };

   editModal: any = {
     currencyCd: null,
     currencyRt: null,
     totalSi: null,
     totalPrem: null,
     pctShare: null,
     pctPml: null,
     totalValue: null,
     remarks: null
   }

  selectedPolicyString :any; 
  selectedPolicy :any;
  showEdit :boolean = false;
  validForRenewalProcessing:boolean = false;

  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title, private ns: NotesService,  private decimal : DecimalPipe, private router : Router) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Expiry Listing");
    //this.tableData = this.underWritingService.getExpiryListing();
    //this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
    this.retrieveExpPolList();
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

  onClickUpdate() {
      this.passDataRenewalPolicies.uneditable = [false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true];
  }

  onClickProcess() {
      var renAsIsPolicyList = [];
      var renWithChangesPolicyList = [];
      var nonRenPolicyList = [];

      for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].processTag == 'Y') {
          console.log(this.passDataRenewalPolicies.tableData)
            var policyId = this.passDataRenewalPolicies.tableData[i].policyId;

            if (this.passDataRenewalPolicies.tableData[i].renAsIsTag == 'Y') {
                var policy = {
                  policyId : policyId,
                  summaryTag : this.passDataRenewalPolicies.tableData[i].summaryTag
                };

                renAsIsPolicyList.push(policy);
            }

            if (this.passDataRenewalPolicies.tableData[i].renWithChange == 'Y') {
                var policyWC = {
                  policyId : policyId,
                  projectList : this.passDataRenewalPolicies.tableData[i].projectList,
                  secCovList : this.passDataRenewalPolicies.tableData[i].sectionCoverList,
                  deductiblesList : this.passDataRenewalPolicies.tableData[i].deductiblesList,
                  summaryTag : this.passDataRenewalPolicies.tableData[i].summaryTag
                };

                renWithChangesPolicyList.push(policyWC);
            }

            if (this.passDataRenewalPolicies.tableData[i].nonRenTag == 'Y') {
                var policyNR = {
                  policyId : policyId,
                  nrReasonCd : this.passDataRenewalPolicies.tableData[i].nrReasonCd
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

  retrieveExpPolList(){
       this.passDataRenewalPolicies.tableData = [];
       this.underWritingService.getExpPolList(this.searchParams).subscribe(data => {
          console.log(data);
          var records = data['expPolicyList'];
          this.disabledFlag = true;
          this.fetchedData = records;

          for(var i = 0; i < records.length;i++){
            this.passDataRenewalPolicies.tableData.push(records[i]);
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
            
          }
          this.table.refreshTable();
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
  }

  gotoInfo() {
       this.router.navigate(['/policy-information', {policyId:this.table.indvSelect.policyId, policyNo:this.table.indvSelect.policyNo}], { skipLocationChange: true });
  }

  onClickPurge() {
      $('#purgeRenewablePolicyModal #modalBtn').trigger('click');
  }

  gotoPurgeExtractedPolicy() {
    this.router.navigate(['/purge-extracted-policy', { }], { skipLocationChange: false });
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
    this.nrReasonCd = "";
    this.nrReasonDescription = "";
    this.changes = "";

    if(data !== null){
      this.disabledFlag = false;
      this.lineCd = data.policyNo.split('-')[0];
      this.secCoverData = data.sectionCoverList;
      this.coverageData = data.coverageList[0];
      this.deductibleData = data.deductiblesList;
      this.nrReasonCd = data.nrReasonCd;
      this.nrReasonDescription = data.nrReasonDescription;
      this.changes = data.changes;

      if(data.renWithChange === 'Y'){
         this.changesFlag = true;
      }else {
         this.changesFlag = false;
      }

      if(data.nonRenTag === 'Y'){
         this.reasonFlag = true;
      }else{
         this.reasonFlag = false;
      }


    }else{
      this.disabledFlag = true;
      this.secCoverData = data;
      this.coverageData = data;
      this.lineCd = null;
    }
    
  }

  prepareSectionCoverData(data:any) {
    this.passDataSectionCover.tableData = [];
    console.log(data)
    this.editModal = this.coverageData;
    for(var i = 0 ; i < data.length;i++){
      this.passDataSectionCover.tableData.push(data[i]);

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
    console.log(this.passDataSectionCover.tableData)
      for(var i = 0 ; i < this.passDataSectionCover.tableData.length;i++){
        this.passDataSectionCover.tableData[i].premAmt = this.passDataSectionCover.tableData[i].discountTag == 'Y'? this.passDataSectionCover.tableData[i].premAmt:this.passDataSectionCover.tableData[i].sumInsured * (this.passDataSectionCover.tableData[i].premRt/100);
        if(this.lineCd === 'CAR' || this.lineCd === 'EAR'){
            if(this.passDataSectionCover.tableData[i].section == 'I'){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                  this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
                  console.log(this.totalPrem)
            }else if(this.passDataSectionCover.tableData[i].section == 'II'){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
                  console.log(this.totalPrem)
            }else if(this.passDataSectionCover.tableData[i].section == 'III'){
                if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                  this.secIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                  this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
                }
                  this.secIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                  this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
                  console.log(this.totalPrem)
            } 
        }else if(this.lineCd === 'EEI'){
            if(this.passDataSectionCover.tableData[i].section == 'I'){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II'){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III'){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIIISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            } 
        }else {
            if(this.passDataSectionCover.tableData[i].section == 'I'){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secISi += this.passDataSectionCover.tableData[i].sumInsured;
                 this.totalSi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'II'){
               if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.secIISi += this.passDataSectionCover.tableData[i].sumInsured;
               }
                 this.secIIPrem += this.passDataSectionCover.tableData[i].premAmt;
                 this.totalPrem += this.passDataSectionCover.tableData[i].premAmt;
            }else if(this.passDataSectionCover.tableData[i].section == 'III'){
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

       for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
            if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
              this.passDataRenewalPolicies.tableData[i].nrReasonCd = this.nrReasonCd;
              this.passDataRenewalPolicies.tableData[i].nrReasonDescription = this.nrReasonDescription;
            }
       }

       this.ns.lovLoader(data.ev, 0);
   }

  checkCode(ev, field){
      this.ns.lovLoader(ev, 1);

      if(field === 'nrReason') {            
          this.nrReasonLOV.checkCode(this.nrReasonCd, ev);
      }
  }

  sectionCoversLOV(data){
      this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
      this.secCoversLov.modal.openNoClose();
      //$('#sectionCoversLOV #modalBtn').trigger('click');
      this.sectionCoverLOVRow = data.index;
  } 

  savePolicyChanges() {
      console.log("savePolicyChanges :" + JSON.stringify(this.passDataSectionCover.tableData));
  }

  tagProcess(mode) {
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
  }

  processRenewalPolicies() {
      this.underWritingService.processRenewablePolicy(this.processRenewalPoliciesParams).subscribe(data => {
        console.log(data)
          console.log("processRenewablePolicy: " + JSON.stringify(data));
          /*if (data['errorList'].length > 0) {

          } else {
            
          }*/
      });

  }

  onClickRenSave(){
    console.log("onClickRenSave");
    $('#extractedPolicies #confirm-save #modalBtn2').trigger('click');
  }

  saveChangesToExtPolicy() {
    console.log("saveChangesToExtPolicy : ");
    console.log(this.passDataRenewalPolicies.tableData);
  }

  changesValueChanged(data) {
    console.log("changesValueChanged : " + this.changes);
    console.log(data);
    for(var i = 0; i < this.passDataRenewalPolicies.tableData.length;i++){
        if (this.passDataRenewalPolicies.tableData[i].policyId == this.table.indvSelect.policyId) {
          this.passDataRenewalPolicies.tableData[i].changes = this.changes;
        }
    }
  }
}
