import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { DecimalPipe } from '@angular/common';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
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
  reasonFlag:boolean = true;
  changesFlag:boolean = true;
  hideSectionCoverArray:any;
  sectionCoverLOVRow:number;

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
    uneditable:[true,true,false,false,false,false,false,false],
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
                    "checkbox", "checkbox", "checkbox", "checkbox", "text","text", "text","text","text","text","text","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tooltip:['Process','Renewal As Is','Renewal With Changes','Non-Renewal',null,,null,null,null,null,null,null,'Summarized Policy','With Balance Flag','With Claim Flag','With Reminder','Special Policy'],
        nData: {
                 processTag : false,
                 renAsIsTag : false,
                 renWithChange : false,
                 nonRentag : false,
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
        keys:['processTag', 'renewalFlag', 'renWithChange', 'nonRentag', 'policyNo', 'cessionDesc','cedingName', 'coRefNo', 'renTsiAmount', 'renPremAmount', 'totalSi', 'totalPrem', 'summaryTag', 'balanceTag', 'claimTag', 'reminderTag', 'specialPolicyTag'],
        pageLength: 10,
        pageID:'RenewalPolicies',
        paginateFlag:true,
        infoFlag:true,
        uneditable: [false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false],
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

  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title, private ns: NotesService,  private decimal : DecimalPipe) { }

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
    this.expiryParameters.fromMonth = null;
    this.expiryParameters.fromYear = null;
    this.expiryParameters.toMonth = null;
    this.expiryParameters.toYear = null;
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
            /*this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalSi = records[i].coverageList[0].totalSi;
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].totalPrem = records[i].coverageList[0].totalPrem;
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renPremAmount = records[i].coverageList[0].totalPrem;
            this.passDataRenewalPolicies.tableData[this.passDataRenewalPolicies.tableData.length - 1].renTsiAmount = records[i].coverageList[0].totalSi;*/
          }
          this.table.refreshTable();
       });
  }

  updateRenewalPolicy(data){
    console.log(data)
    console.log(data.renWithChange === 'Y')
    if(this.table.indvSelect.renWithChange === 'Y'){
      console.log('not disable')
       this.changesFlag = false;
    }else {
      console.log('disable')
      this.changesFlag = true;
    }

    if(this.table.indvSelect.nonRentag === 'Y'){
      this.reasonFlag = false;
    }else{
      this.reasonFlag = true;
    }
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
    if(data !== null){
      this.disabledFlag = false;
      this.lineCd = data.policyNo.split('-')[0];
      this.secCoverData = data.sectionCoverList;
      this.coverageData = data.coverageList[0];
      this.deductibleData = data.deductiblesList;
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

  sectionCoversLOV(data){
      this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
      this.secCoversLov.modal.openNoClose();
      //$('#sectionCoversLOV #modalBtn').trigger('click');
      this.sectionCoverLOVRow = data.index;
  } 
}
