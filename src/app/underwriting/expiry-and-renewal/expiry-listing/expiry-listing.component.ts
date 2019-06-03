import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {

  @ViewChild('contentEditPol') contentEditPol;
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  byDate: boolean = true;
  searchParams: any[] = [];
  fetchedData: any;

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
    dataTypes: ['text','text','text','currency',"percent", "currency", "checkbox",'checkbox'],
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
        pageLength:3,
        widths: [1,'auto','auto']
  };
  
  passDataRenewalPolicies: any = {
        tHeader: ["P", "RA", "RC", "NR", "Policy No", "Type of Cession", "Ceding Company", "Co Ref No","Ren TSI Amount","Ren Pre Amount","TSI Amount","Prem Amount","Co Ref No","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "checkbox", "checkbox", "checkbox", "text", "text","text","text","currency","currency","currency","currency","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
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
        keys:['processTag', 'renAsIsTag', 'renWithChange', 'nonRentag', 'policyNo', 'cessionDesc', 'cedingName', 'coRefNo', 'renTsiAmount', 'renPremAmount', 'tsiAmount', 'premAmount', 'coRefNo2', 'summarizedTag', 'withBalTag', 'withClaimTag', 'withReminderTag', 'regPolicyTag'],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true,
        uneditable: [false,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,false,false],
        tooltip:['Process Policy','Renewal As Is', 'Renewal With Change', 'Non-renewal',null,null,null,null,null,null,null,null,null,'Summarized','With Balance','With Claim','With Reminder','Reqular Policy']
   };

   passDataExtensionPolicies: any = {
        tHeader: ["P","Policy No", "Type of Cession", "Ceding Company", "Co Ref No","TSI Amount","Prem Amount","Co Ref No","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "text", "text","text","text","text","text","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tableData: [[false,"TEST","TEST","TEST","TEST","TEST","TEST","TEST",false,false,false,false,false]],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true,
        tooltip:['Process Policy',null,null,null,null,null,null,null,'Summarized','With Balance','With Claim','With Reminder','Reqular Policy']

   };

  selectedPolicyString :any; 
  selectedPolicy :any;
  showEdit :boolean = false;

  renTsiAmount = 0;
  renPremAmount = 0;
  tsiAmount = 0;
  premAmount = 0;
  sectionISi = 0;
  sectionIPrem = 0;
  sectionIISi = 0;
  sectionIIPrem = 0;
  sectionIIISi = 0;
  sectionIIIPrem = 0;

  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title, private ns: NotesService) { }

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

  retrieveExpPolList(){
       this.underWritingService.getExpPolList(this.searchParams).subscribe(data => {
          var records = data['expPolicyList'];
          console.log(data);
          this.fetchedData = records;
          this.passDataRenewalPolicies.tableData = [];
               for(let rec of records){


                   for(let cov of rec.coverageList) {
                     this.renTsiAmount = cov.totalSi;
                     this.renPremAmount = cov.totalPrem;
                     this.tsiAmount = cov.origTsi;
                     this.premAmount = cov.origTprem;
                     this.sectionISi = cov.sectionISi;
                     this.sectionIPrem = cov.sectionIPrem;
                     this.sectionIISi = cov.sectionIiSi;
                     this.sectionIIPrem = cov.sectionIiPrem;
                     this.sectionIIISi = cov.sectionIiiSi;
                     this.sectionIIIPrem = cov.sectionIiiPrem;
                   }

                    this.passDataTotalPerSection.tableData[0].section = 'SECTION I';
                    this.passDataTotalPerSection.tableData[0].sumInsured = this.sectionISi;
                    this.passDataTotalPerSection.tableData[0].premium = this.sectionIPrem;
                    this.passDataTotalPerSection.tableData[1].section = 'SECTION II';
                    this.passDataTotalPerSection.tableData[1].sumInsured = this.sectionIISi;
                    this.passDataTotalPerSection.tableData[1].premium = this.sectionIIPrem;
                    this.passDataTotalPerSection.tableData[2].section = 'SECTION III';
                    this.passDataTotalPerSection.tableData[2].sumInsured = this.sectionIIISi;
                    this.passDataTotalPerSection.tableData[2].premium = this.sectionIIIPrem;

                   console.log(JSON.stringify(rec.coverageList));

                   this.passDataRenewalPolicies.tableData.push(
                       {
                         processTag : false,
                         renAsIsTag : false,
                         renWithChange : false,
                         nonRentag : false,
                         policyNo : rec.policyNo,
                         cessionDesc : rec.cessionDesc,
                         cedingName : rec.cedingName,
                         coRefNo : '',
                         renTsiAmount : this.renTsiAmount,
                         renPremAmount : this.renPremAmount,
                         tsiAmount : this.tsiAmount,
                         premAmount : this.premAmount,
                         coRefNo2 : '',
                         summarizedTag : false,
                         withBalTag : false,
                         withClaimTag : false,
                         withReminderTag : false,
                         regPolicyTag : false
                       }
                   );
               }
          this.table.refreshTable();
       });
  }

  showEditModal(obj : boolean){
    /*if (!obj){
         this.modalService.open(this.contentEditPol, { centered: true, backdrop: 'static', windowClass: "modal-size" });     
    }*/

    this.showEdit = !this.showEdit;
  }

  onRowClick(e) {
    

    for(let rec of this.fetchedData){
        if (rec.policyNo === e.policyNo) {
           this.selectedPolicyString = JSON.stringify(rec);
           this.selectedPolicy = rec;
           this.prepareSectionCoverData(rec.sectionCoverList);
        }
    }
  }

  prepareSectionCoverData(data:any) {
    this.passDataSectionCover.tableData = [];

    for (let rec of data) {
      /*private String policyId;
      private String lineCd;
      private String projId;
      private String riskId;
      private String section;
      private String coverCd;
      private String coverName;
      private String bulletNo;
      private String sumInsured;
      private String premRt;
      private String premAmt;
      private String addSi;
      private String discountTag;
      private String origSi;
      private String origPremRt;
      private String origPrem;
      private String createUser;
      private DateTime createDate;
      private String updateUser;
      private DateTime updateDate;*/

        this.passDataSectionCover.tableData.push(
          {
              showMG: 1,
              addSi: rec.addSi,
              bulletNo: rec.bulletNo,
              coverCd: rec.coverCd,
              coverName: rec.coverName,
              createDateSec: this.ns.toDateTimeString(rec.createDate),
              createUserSec: JSON.parse(window.localStorage.currentUser).username,
              deductiblesSec:[],
              description: null,
              discountTag:'N',
              premRt: rec.premRt,
              premAmt: rec.premAmt,
              section: rec.section,
              sumInsured: rec.sumInsured,
              updateDateSec: this.ns.toDateTimeString(rec.updateUser),
              updateUserSec: JSON.parse(window.localStorage.currentUser).username
          }
        );
        this.table.refreshTable();
    };
  }

  onRowSecCovClick(data:any) {
    console.log(JSON.stringify(data));

    console.log("-----------------------------");

    console.log(this.deductiblesTable);

    this.passDataDeductibles.tableData = [];
    this.deductiblesTable.refreshTable();
    for (let rec of this.selectedPolicy.deductiblesList) {

      /*
      private String policyId; 
      private String coverCd; 
      private String endtCd; 
      private String deductibleCd; 
      private String deductibleRt; 
      private String deductibleAmt; 
      private String deductibleTxt; 
      private String createUser; 
      private DateTime createDate; 
      private String updateUser; 
      private DateTime updateDate;
      */
        if (rec.coverCd == data.coverCd) {
          console.log(JSON.stringify(rec));

          this.passDataDeductibles.tableData.push(
            {
                showMG : 1,
                coverCd: rec.coverCd,
                createDate: this.ns.toDateTimeString(rec.createDate),
                createUser: JSON.parse(window.localStorage.currentUser).username,
                deductibleAmt: rec.deductibleAmt,
                deductibleCd: rec.deductibleCd,
                deductibleRt: rec.deductibleRt,
                deductibleTxt: rec.deductibleTxt,
                endtCd: rec.endtCd,
                updateDate: this.ns.toDateTimeString(rec.updateDate),
                updateUser:JSON.parse(window.localStorage.currentUser).username
            }
          );
          
        }
        
    };
    this.deductiblesTable.refreshTable();
  }

  prepareDataTotalPerSection(data:any) {

  }
}
