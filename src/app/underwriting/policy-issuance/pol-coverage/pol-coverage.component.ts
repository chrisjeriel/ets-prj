import { Component, OnInit, Input,  ViewChild} from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { UnderwritingCoverageInfo, CoverageDeductibles } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnSectionCoversComponent } from '@app/maintenance/mtn-section-covers/mtn-section-covers.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component'
@Component({
  selector: 'app-pol-coverage',
  templateUrl: './pol-coverage.component.html',
  styleUrls: ['./pol-coverage.component.css']
})
export class PolCoverageComponent implements OnInit {
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesModal') deductiblesModal :ModalComponent;
  @ViewChild(LovComponent) lov :LovComponent;
  @ViewChild(SucessDialogComponent) successDlg: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild("sectionTable") sectionTable: CustEditableNonDatatableComponent;
  @ViewChild('catPerils') catPerilstable: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('confirmSave') confirmSave: ConfirmSaveComponent;
  @ViewChild(MtnSectionCoversComponent) secCoversLov: MtnSectionCoversComponent;
  private underwritingCoverageInfo: UnderwritingCoverageInfo;
  tableData: any[] = [];
  tableData2: any[] = [];
  tHeader: any[] = [];
  tHeader2: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  optionsData: any[] = [];
  headerWithColspan: any[] = [];
  pageLength = 3 ;
  searchFlag;
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  sectionISi:number = 0;
  sectionIPrem:number = 0;
  sectionIISi:number = 0;
  sectionIIPrem:number = 0;
  sectionIIISi:number = 0;
  sectionIIIPrem:number = 0;
  totalPrem:number = 0;
  totalSi: number = 0;
  editedData: any[] = [];
  deletedData: any[] = [];
  editedDedt:any = [];
  deletedDedt:any = [];
  catPerilData: any = {
    catPrlId: 0,
    pctShrPrm: 0,
    saveCATPerilList:[]
  };

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
    widths:[50,58,220,125,100,125,35],
    magnifyingGlass: ['coverName'],
    uneditable:[true,true,false,false,false,false,false,false],
    keys:['section','bulletNo','coverName','cumSi','premRt','cumPrem','discountTag','addSi'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  /*passDataSectionCover: any = {
        tableData: [],
        tHeader: [ "Section","Bullet No","Cover Name",  "Sum Insured", "Rate", "Premium", "D/S","Add SI"],
        dataTypes: [
                    "text", "text", "lovInput", "currency", "percent", "currency", "checkbox", "checkbox"
                   ],
        tooltip:[null,null,null,null,null,null,'Discount / Surcharge',null],
        pageLength: 'unli',
        addFlag: true,
        deleteFlag: true,
        searchFlag:true,
        checkFlag: true,
        magnifyingGlass: ['coverName'],
        pageID: 'sectionCovers',
        nData:{
          coverName:'',
          coverCd:'',
          discountTag:'N',
          deductiblesSec:[],
          addSi:'N',
          section: null,
          bulletNo: null,
          description: null,
          sumInsured: null,
          premRt: null,
          premAmt: null,
          createDateSec: this.ns.toDateTimeString(0),
          createUserSec: JSON.parse(window.localStorage.currentUser).username,
          updateDateSec: this.ns.toDateTimeString(0),
          updateUserSec:JSON.parse(window.localStorage.currentUser).username,
          showMG:1
        },
        //widths:[1,1,228,200,75,1,1,1],
        uneditable:[true,true,false,false,false,false,false,false],
        keys:['section','bulletNo','coverName','cumSi','premRt','cumPrem','discountTag','addSi'],
        widths:[50,58,220,125,100,125,35]
    };*/


  passDataTotalPerSection: any = {
        tHeader: ["Section", "Sum Insured", "Premium"],
        dataTypes: ["text", "currency", "currency"],
        tableData: [["SECTION I",null,null],["SECTION II",null,null],["SECTION III",null,null]],
        keys:['section','sumInsured','premium'],
        uneditable:[true,true,true],
        pageLength:3
    };

  passDataCATPerils: any = {
        tHeader: ["CAT Perils", "Percentage Share on Premium(%)"],
        dataTypes: [
                    "text", "percent"
                   ],
        tableData: [],
        keys:['catPerilName','pctShrPrm'],
        pageLength:10,
    };

  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text", "percent", "currency"],
        pageLength:10,
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

  textArea: any = null;


  /*passDataDeductibles: any = {
        tHeader: ["Deductible title","Rate (%)", "Amount Deductible Text"],
        dataTypes: [
                    "text", "percent", "text"
                   ],
        tableData: [["TEST",1,"TEST"],["TEST",1,"TEST"],["TEST",10,"TEST"],["TEST",1,"TEST"]],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 5,
        searchFlag:true,
        paginateFlag:true,
        infoFlag:true,
    };*/
    
  @Input() alteration: boolean;
  line: string;
  sub: any;

  nData2: CoverageDeductibles = new CoverageDeductibles(null,null,null,null,null);
  nData: UnderwritingCoverageInfo = new UnderwritingCoverageInfo(null, null, null, null, null, null, null);


  coverageData : any = {
      currencyCd: null,
      currencyRt: null,
      sectionISi:null,
      sectionIISi: null,
      sectionIIISi: null,
      sectionIPrem: null,
      sectionIIPrem: null,
      sectionIIIPrem: null,
      totalSi: null,
      totalPrem: null,
      pctShare:0,
      pctPml:0,
      totalValue: 0,  
      remarks: '' 
  }

  passLOVData: any = {};
  lovRowData:any;
  lovCheckBox:boolean = false;
  dialogIcon:string = '';
  policyId: any;
  projId: any;
  riskId:any;
  dialogMessage:string;
  cancelFlag:boolean;
  currentCoverCd:'';


  passData: any = {
    tableData:[],
    tHeader:['Section','Bullet No','Cover Name','Sum Insured','Rate','Premium','Sum Insured','Rate','Premium','Discount Tag','Add SI','Sum Insured','Rate','Premium'],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:['text','text','lovInput','currency','percent','currency','currency','percent','currency','checkbox','checkbox','currency','percent','currency'],
    opts:[],
    addFlag: true,
    deleteFlag: true,
    // paginateFlag: true,
    searchFlag: true,
    pageID: 'altCoverage',
    checkFlag: true,
    magnifyingGlass: ['coverName'],
    nData: {
      section: null,
      bulletNo: null,
      description: null,
      sumInsured: null,
      premRt: null,
      premAmt: null,
      altSumInsured: null,
      altRate: null,
      altPremium: null,
      discountTag: 'N',
      addSi: 'N',
      comSumInsured: null,
      comRate: null,
      comPremium: null,
      createDateSec: this.ns.toDateTimeString(0),
      createUserSec: JSON.parse(window.localStorage.currentUser).username,
      updateDateSec: this.ns.toDateTimeString(0),
      updateUserSec:JSON.parse(window.localStorage.currentUser).username,
      showMG:1
    },
    keys:['section','bulletNo','coverName','prevSumInsured','prevPremRt','prevPremAmt','sumInsured','premRt','premAmt','discountTag','addSi','cumSi','cumPremRt','cumPrem'],
    uneditable:[true,true,false,true,true,true,false,false,false,false,false,true,true,true],
    widths:[55,65,140,90,90,90,90,90,90,80,50,90,90,90],
    pageLength:'unli'
  };

  passData2: any = {
    tableData:[],
    tHeader:['Section','Sum Insured','Premium','Sum Insured','Premium','Sum Insured','Premium'],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:['text','currency','currency','currency','currency','currency','currency'],
    keys:['section','prevSi','prevAmt','altSi','altAmt','comSi','comAmt'],
    uneditable:[true,true,true,true,true,true,true],
    pageLength: 3
  };

  altCoverageData : any = {
      currencyCd: null,
      currencyRt: null,
      prevtotalSi: 0,
      prevtotalPrem: 0,
      alttotalSi: 0,
      alttotalPrem: 0,
      comtotalSi: 0,
      comtotalPrem: 0,
      pctShare:0,
      pctPml:0,
      totalValue: 0,  
      remarks: '' 
  }

  prevsectionISi:number = 0;
  prevsectionIPrem:number = 0;
  prevsectionIISi:number = 0;
  prevsectionIIPrem:number = 0;
  prevsectionIIISi:number = 0;
  prevsectionIIIPrem:number = 0;
  altsectionISi:number = 0;
  altsectionIPrem:number = 0;
  altsectionIISi:number = 0;
  altsectionIIPrem:number = 0;
  altsectionIIISi:number = 0;
  altsectionIIIPrem:number = 0;
  comsectionISi:number = 0;
  comsectionIPrem:number = 0;
  comsectionIISi:number = 0;
  comsectionIIPrem:number = 0;
  comsectionIIISi:number = 0;
  comsectionIIIPrem:number = 0;
  prevtotalSi:number = 0;
  prevtotalPrem:number = 0;
  alttotalSi:number = 0;
  alttotalPrem:number = 0;
  comtotalSi:number = 0;
  comtotalPrem:number = 0;
  policyIdAlt:any;
  integerFlag:boolean = false;
  @Input() policyInfo:any = {};
  disabledFlag: boolean = true;
  errorFlag: boolean = false;
  parameters : any =[];
  hideSectionCoverArray: any[] = [];
  sectionCoverLOVRow: number;

  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private modalService: NgbModal,
                private route: ActivatedRoute, private ns: NotesService,  private router: Router) { }


  ngOnInit() {
    this.titleService.setTitle("Pol | Coverage");
    this.policyId = this.policyInfo.policyId;

    this.sub = this.route.params.subscribe(params => {
      console.log(params)
            this.line = params['line'];
            if(this.alteration)
              this.policyIdAlt = params['policyId'];
            this.parameters = params.policyNo.split(/[-]/g);

    });

    if (!this.alteration) {
      this.getPolCoverage();
    } else {
      this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
        { header: "Previous", span: 3 }, { header: "This Alteration", span: 5 },
        { header: "Cumulative", span: 3 });

      
      this.passData2.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "Previous", span: 2 }, 
        { header: "This Alteration", span: 2 }, { header: "Cumulative", span: 2 });

      this.passData2.tableData = [
        {
          section: 'Section I',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        },
        {
          section: 'Section II',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        },
        {
          section: 'Section III',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        }
      ];
      this.getPolCoverageAlt();
    }

    //paul
    if(this.policyInfo.fromInq =='true'){
      console.log(this.policyInfo.fromInq)
      this.passDataSectionCover.uneditable = [];
      for(let i:number=0;i<this.passDataSectionCover.keys.length;i++){
        this.passDataSectionCover.uneditable.push('true');
      }
      this.passData.uneditable = [];
      for(let i:number=0;i<this.passData.keys.length;i++){
        this.passData.uneditable.push('true');
      }
      this.passData.checkFlag = false;
      this.passData.addFlag = false;
      this.passData.editFlag = false;
      this.passData.deleteFlag = false;
      this.passDataSectionCover.deleteFlag = false;
      this.passDataSectionCover.checkFlag = false;
      this.passDataSectionCover.addFlag = false;
      this.passDataSectionCover.editFlag = false;
      this.passDataDeductibles.addFlag = false;
      this.passDataDeductibles.deleteFlag= false;
      this.passDataDeductibles.checkFlag = false;
      this.passDataDeductibles.uneditable = [true,true,true,true,true,true]
      this.passDataCATPerils.uneditable = [true,true,true]
    }

  }

  getPolCoverageAlt(){
    console.log(this.parameters)
    this.underwritingservice.getUWCoverageAlt(this.parameters[0],this.parameters[1],this.parameters[2],this.parameters[3],this.parameters[4],this.parameters[5]).subscribe((data: any) => {
      console.log(data)
      this.passData.tableData = [];  
      this.prevtotalSi = 0;
      this.prevtotalPrem = 0;
      this.prevsectionISi = 0;
      this.prevsectionIPrem = 0;
      this.prevsectionIISi = 0;
      this.prevsectionIIPrem = 0;
      this.prevsectionIIISi = 0;
      this.prevsectionIIIPrem = 0;
      this.comsectionISi = 0;
      this.comsectionIPrem = 0;
      this.comsectionIISi = 0;
      this.comsectionIIPrem = 0;
      this.comsectionIIISi = 0;
      this.comsectionIIIPrem = 0;
      this.projId = data.policy.project.projId;
      this.riskId = data.policy.project.riskId;
      this.altCoverageData = data.policy.project.coverage;
      this.altCoverageData.pctShare = this.altCoverageData.pctShare == null || this.altCoverageData.pctShare == 0 ? 100:this.altCoverageData.pctShare;

      var dataTable = data.policy.project.coverage.sectionCovers;
        for (var i = 0; i< dataTable.length;i++){
          this.passData.tableData.push(dataTable[i])
        }
          
        for(var j=0;j<this.passData.tableData.length;j++){ 

          this.passData.tableData[j].cumSi       = isNaN(this.passData.tableData[j].sumInsured) ? this.passData.tableData[j].prevSumInsured:this.passData.tableData[j].prevSumInsured + this.passData.tableData[j].sumInsured
          this.passData.tableData[j].cumPremRt   = isNaN(this.passData.tableData[j].prevPremRt) ? this.passData.tableData[j].premRt:this.passData.tableData[j].premRt
          this.passData.tableData[j].cumPrem     = isNaN(this.passData.tableData[j].premAmt) ? this.passData.tableData[j].prevPremAmt : this.passData.tableData[j].prevPremAmt + this.passData.tableData[j].premAmt;
            
          if(this.line == 'EAR' || this.line == 'CAR'){  
            if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionISi      += this.passData.tableData[j].cumSi;
              this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionIISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionIISi      += this.passData.tableData[j].cumSi;
              this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
              this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
              this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
              this.comsectionIIISi    += this.passData.tableData[j].cumSi;
              this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }
          }else if(this.line == 'EEI'){
            if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionISi      += this.passData.tableData[j].cumSi;
              this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionIISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionIISi      += this.passData.tableData[j].cumSi;
              this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
              this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
              this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
              this.comsectionIIISi    += this.passData.tableData[j].cumSi;
              this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }
          }else {
            if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionISi      += this.passData.tableData[j].cumSi;
              this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalSi  += this.passData.tableData[j].prevSumInsured
              this.comtotalSi   += this.passData.tableData[j].cumSi;
              this.alttotalSi   += this.passData.tableData[j].sumInsured;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIISi     += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIPrem   += this.passData.tableData[j].prevPremAmt;
              this.altsectionIISi      += this.passData.tableData[j].sumInsured;
              this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
              this.comsectionIISi      += this.passData.tableData[j].cumSi;
              this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }

            if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
              this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
              this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
              this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
              this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
              this.comsectionIIISi    += this.passData.tableData[j].cumSi;
              this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;

              this.prevtotalPrem     += this.passData.tableData[j].prevPremAmt;
              this.alttotalPrem      += this.passData.tableData[j].premAmt;
              this.comtotalPrem      += this.passData.tableData[j].cumPrem;
            }
          }
        }

        this.table.refreshTable();

        this.altCoverageData.prevtotalSi     = this.prevtotalSi;
        this.altCoverageData.prevtotalPrem   = this.prevtotalPrem;
        this.altCoverageData.alttotalSi     = this.alttotalSi;
        this.altCoverageData.alttotalPrem   = this.alttotalPrem;
        this.altCoverageData.comtotalSi      = this.comtotalSi;
        this.altCoverageData.comtotalPrem    = this.comtotalPrem;
        this.altCoverageData.pctShare        = this.altCoverageData.totalValue == 0 || isNaN(this.altCoverageData.totalValue)? 0:(this.altCoverageData.comtotalSi/this.altCoverageData.totalValue)*100; 

        this.passData2.tableData[0].section  = 'SECTION I'; 
        this.passData2.tableData[0].prevSi   = this.prevsectionISi;
        this.passData2.tableData[0].prevAmt  = this.prevsectionIPrem;
        this.passData2.tableData[0].altSi    = this.altsectionISi;
        this.passData2.tableData[0].altAmt   = this.altsectionIPrem;
        this.passData2.tableData[0].comSi    = this.comsectionISi;
        this.passData2.tableData[0].comAmt   = this.comsectionIPrem;
        this.passData2.tableData[1].section  = 'SECTION II';
        this.passData2.tableData[1].prevSi   = this.prevsectionIISi;
        this.passData2.tableData[1].prevAmt  = this.prevsectionIIPrem;
        this.passData2.tableData[1].altSi    = this.altsectionIISi;
        this.passData2.tableData[1].altAmt   = this.altsectionIIPrem;
        this.passData2.tableData[1].comSi    = this.comsectionIISi;
        this.passData2.tableData[1].comAmt   = this.comsectionIIPrem;
        this.passData2.tableData[2].section  = 'SECTION III';
        this.passData2.tableData[2].prevSi   = this.prevsectionIIISi;
        this.passData2.tableData[2].prevAmt  = this.prevsectionIIIPrem;
        this.passData2.tableData[2].altSi    = this.altsectionIIISi;
        this.passData2.tableData[2].altAmt   = this.altsectionIIIPrem;
        this.passData2.tableData[2].comSi    = this.comsectionIIISi;
        this.passData2.tableData[2].comAmt   = this.comsectionIIIPrem;

        this.getEditableAlt();
        this.focusCalc();
        this.focusBlur();
    });
  }

  getPolCoverage(){
     // this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      this.underwritingservice.getUWCoverageInfos(null,this.policyId).subscribe((data:any) => {
        console.log(data)
          this.passDataSectionCover.tableData = [];
          this.projId = data.policy.project.projId;
          this.riskId = data.policy.project.riskId;
          this.coverageData = data.policy.project.coverage;
          this.coverageData.remarks = this.coverageData.remarks == null ? '':this.coverageData.remarks;
          this.coverageData.pctPml = this.coverageData.pctPml == null? 100:this.coverageData.pctPml;
          //this.coverageData.pctShare = this.coverageData.totalValue == 0 ? 0:(this.coverageData.totalSi/this.coverageData.totalValue*100);

          this.sectionISi = 0;
          this.sectionIPrem = 0;
          this.sectionIISi = 0;
          this.sectionIIPrem = 0;
          this.sectionIIISi = 0;
          this.sectionIIIPrem = 0;
          this.totalSi = 0;
          this.totalPrem = 0;
          var infoData = data.policy.project.coverage.sectionCovers;
            for(var i = 0; i < infoData.length;i++){
              this.passDataSectionCover.tableData.push(infoData[i]);
              this.passDataSectionCover.tableData[i].cumPrem = this.passDataSectionCover.tableData[i].discountTag == 'Y' ? this.passDataSectionCover.tableData[i].cumPrem:this.passDataSectionCover.tableData[i].cumSi * (this.passDataSectionCover.tableData[i].premRt /100 )
              
              if(this.line == 'CAR' || this.line == 'EAR'){
                if(infoData[i].addSi == 'Y' && infoData[i].section == 'I'){
                    this.sectionISi += infoData[i].sumInsured;
                    this.sectionIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'II'){
                    this.sectionIISi += infoData[i].sumInsured;
                    this.sectionIIPrem += infoData [i].premAmt;

                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'III'){
                    this.sectionIIISi += infoData[i].sumInsured;
                    this.sectionIIIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }
              }else if(this.line == 'EEI'){
                if(infoData[i].addSi == 'Y' && infoData[i].section == 'I'){
                    this.sectionISi += infoData[i].sumInsured;
                    this.sectionIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'II'){
                    this.sectionIISi += infoData[i].sumInsured;
                    this.sectionIIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'III'){
                    this.sectionIIISi += infoData[i].sumInsured;
                    this.sectionIIIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }
              }else {
                if(infoData[i].addSi == 'Y' && infoData[i].section == 'I'){
                    this.sectionISi += infoData[i].sumInsured;
                    this.sectionIPrem += infoData [i].premAmt;

                    this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'II'){
                    this.sectionIISi += infoData[i].sumInsured;
                    this.sectionIIPrem += infoData [i].premAmt;

                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'III'){
                    this.sectionIIISi += infoData[i].sumInsured;
                    this.sectionIIIPrem += infoData [i].premAmt;

                    this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
                }
              }
            }
            this.sectionTable.refreshTable();
             this.sectionTable.onRowClick(null,this.passDataSectionCover.tableData[0]);
              this.passDataTotalPerSection.tableData[0].section = 'SECTION I'
              this.passDataTotalPerSection.tableData[0].sumInsured = this.sectionISi;
              this.passDataTotalPerSection.tableData[0].premium = this.sectionIPrem;
              this.passDataTotalPerSection.tableData[1].section = 'SECTION II'
              this.passDataTotalPerSection.tableData[1].sumInsured = this.sectionIISi;
              this.passDataTotalPerSection.tableData[1].premium = this.sectionIIPrem;
              this.passDataTotalPerSection.tableData[2].section = 'SECTION III'
              this.passDataTotalPerSection.tableData[2].sumInsured = this.sectionIIISi;
              this.passDataTotalPerSection.tableData[2].premium = this.sectionIIIPrem;

              
              this.coverageData.totalSi = this.totalSi;
              this.coverageData.totalPrem = this.totalPrem;
              this.coverageData.sectionISi = this.sectionISi;
              this.coverageData.sectionIISi = this.sectionIISi;
              this.coverageData.sectionIIISi = this.sectionIIISi;
              this.coverageData.sectionIPrem = this.sectionIPrem;
              this.coverageData.sectionIIPrem = this.sectionIIPrem;
              this.coverageData.sectionIIIPrem = this.sectionIIIPrem;
           
             /*this.focusCalc();
             this.focusBlur();*/
             this.getEditableCov();
      });
  }

  getEditableCov(){
    for(let data of this.passDataSectionCover.tableData){
      data.uneditable = [];
      if(data.discountTag == 'Y'){
        data.uneditable.pop();
        console.log(data.uneditable)
      }else if(data.discountTag == 'N' ) {
          data.uneditable.push('cumPrem');
          console.log(data.uneditable)
      }
    }
  }

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  showDeductiblesModal(deductibles){
    // setTimeout(()=>{this.getDeductibles();},0);
    // this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    this.getDeductibles();
    this.deductiblesModal.openNoClose();
  }

  CATPerils() {
        //$('#modalBtn').trigger('click');
        $('#CATPerils > #modalBtn').trigger('click');
        this.getCATPerils();
  }

  getCATPerils(){
    if(!this.alteration){
      this.underwritingservice.getCATPeril(null,this.policyId).subscribe((data:any) => {
        
        var catPerilData = data.policy.catPeril;
        this.passDataCATPerils.tableData = [];
        for(var i = 0; i < catPerilData.length;i++){
          this.passDataCATPerils.tableData.push(catPerilData[i]);
        }
        this.catPerilstable.refreshTable();
      });
    }else{
      this.underwritingservice.getCATPeril(null,this.policyIdAlt).subscribe((data:any) => {
        var catPerilData = data.policy.catPeril;
        this.passDataCATPerils.tableData = [];
        for(var i = 0; i < catPerilData.length;i++){
          this.passDataCATPerils.tableData.push(catPerilData[i]);
        }
        this.catPerilstable.refreshTable();
      });
    }
    
  }

  deductibles() {
    $('#Deductibles >#modalBtn').trigger('click');
  }

  getDeductibles(){

    this.passDataDeductibles.nData.coverCd = this.table.indvSelect.coverCd;
    let params : any = {
      policyId:this.policyId,
      policyNo:'',
      coverCd:this.table.indvSelect.coverCd,
      endtCd: 0
    }
    this.underwritingservice.getUWCoverageDeductibles(params).subscribe(data=>{
      if(data['policy']!==null){
        this.passDataDeductibles.tableData = data['policy']['deductibles'].filter(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.updateUser = JSON.parse(window.localStorage.currentUser).username;
          return true;
        });
      }
      else
        this.passDataDeductibles.tableData = [];
      this.deductiblesTable.refreshTable();
    });
    //this.deductiblesTable.markAsDirty();
  }

  saveDeductibles(){
    this.deductiblesTable.loadingFlag = true;
    let params:any = {
      policyId:this.policyId,
      saveDeductibleList: [],
      deleteDeductibleList:[]
    };
    params.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    params.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
    this.underwritingservice.savePolDeductibles(params).subscribe(data=>{
        if(data['returnCode'] == -1){
          this.dialogIcon = '';
          this.successDlg.open();
          this.getDeductibles();
        }else{
          this.deductiblesTable.loadingFlag = false;
          this.dialogIcon = 'error';
          this.successDlg.open();
        }
      });
  }

  clickDeductiblesLOV(data){
    if(data.key=="deductibleCd"){
      this.lovCheckBox = true;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = this.line;
      this.passLOVData.params = {
        coverCd : data.data.coverCd == null ? 0: data.data.coverCd,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
      this.lovRowData = data.data;
    }
    this.lov.openLOV();
  }

  setSelected(data){
    if(data.selector == 'deductibles'){
      // this.lovRowData.deductibleTitle = data.data.deductibleTitle;
      // this.lovRowData.deductibleRt = data.data.deductibleRate;
      // this.lovRowData.deductibleAmt = data.data.deductibleAmt;
      // this.lovRowData.deductibleTxt = data.data.deductibleText;
      // this.lovRowData.edited = true;
      // this.lovRowData.deductibleCd = data.data.deductibleCd;
      this.passDataDeductibles.tableData = this.passDataDeductibles.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i<data.data.length;i++){
        this.passDataDeductibles.tableData.push(JSON.parse(JSON.stringify(this.passDataDeductibles.nData)));
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].edited = true;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length - 1].showMG = 0;
      }
      this.sectionTable.indvSelect.deductiblesSec = this.passDataDeductibles.tableData;
      this.deductiblesTable.tableDataChange.emit(this.deductiblesTable.passData.tableData);
      this.deductiblesTable.refreshTable();
    }
    this.deductiblesTable.markAsDirty();
  }

  cancel(){
    //this.cancelBtn.clickCancel();
    console.log(this.passDataSectionCover.tableData);
  }

  update(data){
    if(data.hasOwnProperty('lovInput')) {
      this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideSectionCoverArray;

      this.secCoversLov.checkCode(data.ev.target.value, data.ev);
    }   

    this.sectionISi = 0;
    this.sectionIPrem = 0;
    this.sectionIISi = 0;
    this.sectionIIPrem = 0;
    this.sectionIIISi = 0;
    this.sectionIIIPrem = 0;
    this.totalSi = 0;
    this.totalPrem =0;
    for(var i=0; i< this.passDataSectionCover.tableData.length;i++){
      if(this.line == 'CAR' || this.line == 'EAR'){
          if(this.passDataSectionCover.tableData[i].section == 'I' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.sectionISi += this.passDataSectionCover.tableData[i].cumSi;
                 this.sectionIPrem += this.passDataSectionCover.tableData[i].cumPrem;

                 this.totalSi += this.passDataSectionCover.tableData [i].cumSi;
                 this.totalPrem += this.passDataSectionCover.tableData [i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'II' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.sectionIISi += this.passDataSectionCover.tableData[i].cumSi;
                 this.sectionIIPrem += this.passDataSectionCover.tableData[i].cumPrem;

                 this.totalPrem += this.passDataSectionCover.tableData [i].premAmt;
             }else if(this.passDataSectionCover.tableData[i].section == 'III' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.sectionIIISi += this.passDataSectionCover.tableData[i].cumSi;
                 this.sectionIIIPrem += this.passDataSectionCover.tableData[i].cumPrem;

                 this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                 this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
             }
      }else if(this.line == 'EEI'){
          if(this.passDataSectionCover.tableData[i].section == 'I' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.sectionISi += this.passDataSectionCover.tableData[i].cumSi;
                 this.sectionIPrem += this.passDataSectionCover.tableData[i].cumPrem;

                 this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                 this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
           }else if(this.passDataSectionCover.tableData[i].section == 'II' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
               this.sectionIISi += this.passDataSectionCover.tableData[i].cumSi;
               this.sectionIIPrem += this.passDataSectionCover.tableData [i].premAmt;

               this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
               this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
           }else if(this.passDataSectionCover.tableData[i].section == 'III' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
               this.sectionIIISi += this.passDataSectionCover.tableData[i].cumSi;
               this.sectionIIIPrem += this.passDataSectionCover.tableData[i].cumPrem;

               this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
               this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
           }
      }else {
          if(this.passDataSectionCover.tableData[i].section == 'I' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
                 this.sectionISi += this.passDataSectionCover.tableData[i].cumSi;
                 this.sectionIPrem += this.passDataSectionCover.tableData[i].cumPrem;

                 this.totalSi += this.passDataSectionCover.tableData[i].cumSi;
                 this.totalPrem += this.passDataSectionCover.tableData[i].cumPrem;
           }else if(this.passDataSectionCover.tableData[i].section == 'II' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
               this.sectionIISi += this.passDataSectionCover.tableData[i].cumSi;
               this.sectionIIPrem += this.passDataSectionCover.tableData[i].cumPrem;

               this.totalPrem += this.passDataSectionCover.tableData [i].premAmt;
           }else if(this.passDataSectionCover.tableData[i].section == 'III' && this.passDataSectionCover.tableData[i].addSi == 'Y'){
               this.sectionIIISi += this.passDataSectionCover.tableData[i].cumSi;
               this.sectionIIIPrem += this.passDataSectionCover.tableData[i].cumPrem;

               this.totalPrem += this.passDataSectionCover.tableData [i].premAmt;
           }
      }
      if(this.passDataSectionCover.tableData[i].cumSi < 0 || this.passDataSectionCover.tableData[i].cumPrem < 0){
        console.log('true')
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'Invalid amount. Premium amount must be positive';
        this.successDiag.open();
        this.passDataSectionCover.tableData[i].cumSi = 0;
      }
       this.passDataSectionCover.tableData[i].cumPrem = this.passDataSectionCover.tableData[i].discountTag == 'Y'?  this.passDataSectionCover.tableData[i].cumPrem:this.passDataSectionCover.tableData[i].cumSi * (this.passDataSectionCover.tableData[i].premRt /100 )
    }

    this.passDataTotalPerSection.tableData[0].section = 'SECTION I'
    this.passDataTotalPerSection.tableData[0].sumInsured = this.sectionISi;
    this.passDataTotalPerSection.tableData[0].premium = this.sectionIPrem;
    this.passDataTotalPerSection.tableData[1].section = 'SECTION II'
    this.passDataTotalPerSection.tableData[1].sumInsured = this.sectionIISi;
    this.passDataTotalPerSection.tableData[1].premium = this.sectionIIPrem;
    this.passDataTotalPerSection.tableData[2].section = 'SECTION III'
    this.passDataTotalPerSection.tableData[2].sumInsured = this.sectionIIISi;
    this.passDataTotalPerSection.tableData[2].premium = this.sectionIIIPrem;

    this.coverageData.pctShare = (this.totalSi/this.coverageData.totalValue*100);
    /*this.coverageData.totalSi = this.sectionISi + this.sectionIISi + this.sectionIIISi;
    this.coverageData.totalPrem = this.sectionIPrem + this.sectionIIPrem + this.sectionIIIPrem;*/
    this.coverageData.totalSi = this.totalSi;
    this.coverageData.totalPrem = this.totalPrem;
    this.coverageData.sectionISi = this.sectionISi;
    this.coverageData.sectionIISi = this.sectionIISi;
    this.coverageData.sectionIIISi = this.sectionIIISi;
    this.coverageData.sectionIPrem = this.sectionIPrem;
    this.coverageData.sectionIIPrem = this.sectionIIPrem;
    this.coverageData.sectionIIIPrem = this.sectionIIIPrem;

    this.getEditableCov();
    /*this.focusCalc()
    this.focusBlur();*/
/*    setTimeout(() => {
      this.focusBlur();
    }, 0)*/
  }

  onrowClick(data){
    console.log(data)
    if(data == null){
      this.passDataDeductibles.disableAdd = true;
      this.passDataDeductibles.tableData = [];
      this.deductiblesTable.refreshTable();
    }else{
      this.passDataDeductibles.disableAdd = false;
      this.currentCoverCd = data.coverCd;
      /*this.passDataDeductibles.nData.coverCd = this.table.indvSelect.coverCd;
      this.passDataDeductibles.tableData = data.deductiblesSec;
      this.deductiblesTable.refreshTable();*/
      this.deductibleData(data);
    }
  }

  deductibleData(data){
    if(data !== null && data.deductiblesSec !== undefined){
      this.passDataDeductibles.nData.coverCd = this.currentCoverCd
      this.passDataDeductibles.tableData = data.deductiblesSec;
    }else {
      this.passDataDeductibles.tableData = [];
    }
    this.deductiblesTable.refreshTable();
  }

  prepareData(){
    this.editedData = [];
    this.deletedData = [];
    this.editedDedt = [];
    this.deletedData = [];
    this.coverageData.policyId = this.policyId;
    this.coverageData.projId = this.projId;
    this.coverageData.riskId = this.riskId;
    this.coverageData.createDate = this.ns.toDateTimeString(this.coverageData.createDate);
    this.coverageData.updateDate = this.ns.toDateTimeString(this.coverageData.updateDate);

    for(var i = 0; i < this.passDataSectionCover.tableData.length;i++){
      if(this.passDataSectionCover.tableData[i].edited && !this.passDataSectionCover.tableData[i].deleted){
        this.editedData.push(this.passDataSectionCover.tableData[i]);
        if(this.passDataSectionCover.tableData[i].discountTag != 'Y'){
          this.editedData[this.editedData.length - 1].cumPrem =  this.editedData[this.editedData.length - 1].cumSi /this.editedData[this.editedData.length - 1].premRt;
        }else{
          this.editedData[this.editedData.length - 1].cumPrem =  this.passDataSectionCover.tableData[i].cumPrem;
        }
        this.editedData[this.editedData.length - 1].sumInsured = this.passDataSectionCover.tableData[i].cumSi;
        this.editedData[this.editedData.length - 1].premAmt = this.passDataSectionCover.tableData[i].cumPrem;
        this.editedData[this.editedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
        this.editedData[this.editedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
        this.editedData[this.editedData.length - 1].lineCd = this.line;
      }else if(this.passDataSectionCover.tableData[i].deleted){
        this.deletedData.push(this.passDataSectionCover.tableData[i]);
        this.deletedData[this.deletedData.length - 1].sumInsured = this.passDataSectionCover.tableData[i].cumSi;
        this.deletedData[this.deletedData.length - 1].premAmt = this.passDataSectionCover.tableData[i].cumPrem;
        this.deletedData[this.deletedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
        this.deletedData[this.deletedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
        this.deletedData[this.deletedData.length - 1].lineCd = this.line;
      }

      for(var j = 0 ; j < this.passDataSectionCover.tableData[i].deductiblesSec.length;j++){
          if(this.passDataSectionCover.tableData[i].deductiblesSec[j].edited && !this.passDataSectionCover.tableData[i].deductiblesSec[j].deleted){
            this.editedDedt.push(this.passDataSectionCover.tableData[i].deductiblesSec[j]);
          }else if(this.passDataSectionCover.tableData[i].deductiblesSec[j].deleted){
            this.deletedDedt.push(this.passDataSectionCover.tableData[i].deductiblesSec[j]);
          }
      }
    }

    console.log(this.editedData)
    this.coverageData.changeTag = 'N';
    this.coverageData.cumSecISi = this.coverageData.sectionISi;
    this.coverageData.cumSecIISi = this.coverageData.sectionIISi;
    this.coverageData.cumSecIIISi = this.coverageData.sectionIIISi;
    this.coverageData.cumSecIIISi = this.coverageData.sectionIIISi;
    this.coverageData.cumTSi = this.coverageData.totalSi;
    this.coverageData.cumSecIPrem =  this.coverageData.sectionIPrem;
    this.coverageData.cumSecIIPrem = this.coverageData.sectionIIPrem;
    this.coverageData.cumSecIIIPrem = this.coverageData.sectionIIIPrem;
    this.coverageData.cumTPrem = this.coverageData.totalPrem;
    this.coverageData.saveSectionCovers = this.editedData;
    this.coverageData.deleteSectionCovers = this.deletedData;
    this.coverageData.saveDeductibleList = this.editedDedt;
    this.coverageData.deleteDeductibleList = this.deletedDedt;
    
    /*this.coverageData.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    this.coverageData.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
*/
  }

  saveCoverage(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.underwritingservice.savePolCoverage(this.coverageData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        $('#successModalBtn').trigger('click');
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        $('app-sucess-dialog #modalBtn').trigger('click');
        this.sectionTable.markAsPristine();
        this.deductiblesTable.markAsPristine();
        this.getPolCoverage();
        this.deductiblesTable.refreshTable();
      }
    });
  }

  saveCatPeril(){
    if(!this.alteration){
      this.catPerilData.policyId = this.policyId;
    }else{
      this.catPerilData.policyId = this.policyIdAlt;
    }
    
    for( var i = 0; i < this.passDataCATPerils.tableData.length; i++){
      if(this.passDataCATPerils.tableData[i].edited){
        this.catPerilData.saveCATPerilList.push(this.passDataCATPerils.tableData[i]);
        this.catPerilData.saveCATPerilList[this.catPerilData.saveCATPerilList.length - 1].createDate = this.ns.toDateTimeString(0);
        this.catPerilData.saveCATPerilList[this.catPerilData.saveCATPerilList.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }  
    this.underwritingservice.saveCatPeril(this.catPerilData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        $('#successModalBtn').trigger('click');
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        $('#successModalBtn').trigger('click');
        this.getPolCoverage();
        this.table.markAsPristine();
        this.editedData = [];
        //this.getCoverageInfo();
      }
    });
  }

  focusBlur(){
    setTimeout(() => {$('.req').focus();$('.req').blur()},0)
  }

  focusCalc(){
    setTimeout(() => {$('.calc').focus();$('.calc').blur()},0)
  }

  onClickSave(){
    for( var i= 0; i< this.passDataSectionCover.tableData.length;i++){
      if(this.passDataSectionCover.tableData[i].cumSi == 0 && this.passDataSectionCover.tableData[i].addSi == 'Y'){
        this.errorFlag = true;
      }
    }

    if(this.errorFlag){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check Sum Insured.';
      this.successDiag.open();
      this.errorFlag = false;
    }else if(this.coverageData.pctShare == 0 || this.coverageData.totalValue == 0){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check field values.';
      this.successDiag.open();
    }else {
      $('#confirm-save #modalBtn2').trigger('click');
    }
    
  }


  updateAlteration(data){
    console.log('eeeeyyyyy')
    this.prevsectionISi = 0;
    this.prevsectionIPrem = 0;
    this.altsectionIPrem = 0;
    this.altsectionISi = 0;
    this.prevsectionIISi = 0;
    this.prevsectionIIPrem = 0;
    this.altsectionIISi = 0;
    this.altsectionIIPrem = 0;
    this.prevsectionIIISi = 0;
    this.prevsectionIIIPrem = 0;
    this.altsectionIIISi = 0;
    this.altsectionIIIPrem = 0;
    this.comsectionISi = 0;
    this.comsectionIPrem = 0;
    this.comsectionIISi = 0;
    this.comsectionIIPrem = 0;
    this.comsectionIIISi = 0;
    this.comsectionIIIPrem = 0;
    this.prevtotalSi = 0;
    this.prevtotalPrem = 0;  
    this.alttotalSi = 0;
    this.alttotalPrem = 0;
    this.comtotalSi = 0;
    this.comtotalPrem = 0;

    if(data.hasOwnProperty('lovInput')) {
      this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});

      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideSectionCoverArray;

      this.secCoversLov.checkCode(data.ev.target.value, data.ev);
    }   

    this.getEditableAlt();

    for(var j=0;j<this.passData.tableData.length;j++){
      if(!this.passData.tableData[j].edited){
        this.passData.tableData[j].cumSi       = isNaN(this.passData.tableData[j].sumInsured) ? this.passData.tableData[j].prevSumInsured:this.passData.tableData[j].prevSumInsured + this.passData.tableData[j].sumInsured
        this.passData.tableData[j].cumPremRt   = isNaN(this.passData.tableData[j].premRt) ? this.passData.tableData[j].prevPremRt:this.passData.tableData[j].prevPremRt
        this.passData.tableData[j].cumPrem     = isNaN(this.passData.tableData[j].premAmt) ? this.passData.tableData[j].prevPremAmt : this.passData.tableData[j].prevPremAmt + this.passData.tableData[j].premAmt;
        
      }

        this.passData.tableData[j].premAmt     = this.passData.tableData[j].discountTag == 'Y' ? this.passData.tableData[j].premAmt:this.passData.tableData[j].sumInsured * (this.passData.tableData[j].premRt / 100);
        
        this.passData.tableData[j].cumSi       = isNaN(this.passData.tableData[j].prevSumInsured) ? this.passData.tableData[j].sumInsured+0:this.passData.tableData[j].prevSumInsured + this.passData.tableData[j].sumInsured
        this.passData.tableData[j].cumPremRt   = isNaN(this.passData.tableData[j].prevPremRt) || this.passData.tableData[j].prevPremRt == null ? this.passData.tableData[j].premRt :this.passData.tableData[j].premRt 
        this.passData.tableData[j].cumPrem     = isNaN(this.passData.tableData[j].prevPremAmt) ? this.passData.tableData[j].premAmt+0 : this.passData.tableData[j].prevPremAmt + this.passData.tableData[j].premAmt;
        
        if(this.line == 'EAR' || this.line == 'CAR'){
          if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
            this.altsectionISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionISi      += this.passData.tableData[j].cumSi;
            this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIISi     += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIPrem   += isNaN(this.passData.tableData[j].prevPremAmt) ? 0:this.passData.tableData[j].prevPremAmt;
            this.altsectionIISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionIISi      += this.passData.tableData[j].cumSi;
            this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
            this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
            this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
            this.comsectionIIISi    += this.passData.tableData[j].cumSi;
            this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }
        }else if(this.line == 'EEI'){
          if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
            this.altsectionISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionISi      += this.passData.tableData[j].cumSi;
            this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIISi     += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIPrem   += this.passData.tableData[j].prevPremAmt;
            this.altsectionIISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionIISi      += this.passData.tableData[j].cumSi;
            this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
            this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
            this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
            this.comsectionIIISi    += this.passData.tableData[j].cumSi;
            this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }
        }else{
          if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionISi     += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIPrem   += this.passData.tableData[j].prevPremAmt;
            this.altsectionISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionISi      += this.passData.tableData[j].cumSi;
            this.comsectionIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalSi  += isNaN(this.passData.tableData[j].prevSumInsured) ? 0:this.passData.tableData[j].prevSumInsured
            this.comtotalSi   += this.passData.tableData[j].cumSi;
            this.alttotalSi   += this.passData.tableData[j].sumInsured;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIISi     += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIPrem   += this.passData.tableData[j].prevPremAmt;
            this.altsectionIISi      += this.passData.tableData[j].sumInsured;
            this.altsectionIIPrem    += this.passData.tableData[j].premAmt;
            this.comsectionIISi      += this.passData.tableData[j].cumSi;
            this.comsectionIIPrem    += this.passData.tableData[j].cumPrem;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }

          if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIIISi   += this.passData.tableData[j].prevSumInsured;
            this.prevsectionIIIPrem += this.passData.tableData[j].prevPremAmt;
            this.altsectionIIISi    += this.passData.tableData[j].sumInsured;
            this.altsectionIIIPrem  += this.passData.tableData[j].premAmt;
            this.comsectionIIISi    += this.passData.tableData[j].cumSi;
            this.comsectionIIIPrem  += this.passData.tableData[j].cumPrem;

            this.prevtotalPrem     += isNaN(this.passData.tableData[j].prevPremAmt)? 0: this.passData.tableData[j].prevPremAmt;
            this.alttotalPrem      += this.passData.tableData[j].premAmt;
            this.comtotalPrem      += this.passData.tableData[j].cumPrem;
          }
        }
    }
    
    this.altCoverageData.pctShare        = this.altCoverageData.totalValue == 0 || isNaN(this.altCoverageData.totalValue)? 1:(this.altCoverageData.comtotalSi/this.altCoverageData.totalValue)*100; 

    this.passData2.tableData[0].section  = 'SECTION I'; 
    this.passData2.tableData[0].prevSi   = isNaN(this.prevsectionISi) ? 0:this.prevsectionISi;
    this.passData2.tableData[0].prevAmt  = isNaN(this.prevsectionIPrem)? 0:this.prevsectionIPrem;
    this.passData2.tableData[0].altSi    = this.altsectionISi;
    this.passData2.tableData[0].altAmt   = this.altsectionIPrem;
    this.passData2.tableData[0].comSi    = this.comsectionISi;
    this.passData2.tableData[0].comAmt   = this.comsectionIPrem;
    this.passData2.tableData[1].section  = 'SECTION II';
    this.passData2.tableData[1].prevSi   = this.prevsectionIISi;
    this.passData2.tableData[1].prevAmt  = this.prevsectionIIPrem;
    this.passData2.tableData[1].altSi    = this.altsectionIISi;
    this.passData2.tableData[1].altAmt   = this.altsectionIIPrem;
    this.passData2.tableData[1].comSi    = this.comsectionIISi;
    this.passData2.tableData[1].comAmt   = this.comsectionIIPrem;
    this.passData2.tableData[2].section  = 'SECTION III';
    this.passData2.tableData[2].prevSi   = this.prevsectionIIISi;
    this.passData2.tableData[2].prevAmt  = this.prevsectionIIIPrem;
    this.passData2.tableData[2].altSi    = this.altsectionIIISi;
    this.passData2.tableData[2].altAmt   = this.altsectionIIIPrem;
    this.passData2.tableData[2].comSi    = this.comsectionIIISi;
    this.passData2.tableData[2].comAmt   = this.comsectionIIIPrem;

    this.altCoverageData.prevtotalSi      = this.prevtotalSi;
    this.altCoverageData.prevtotalPrem    = this.prevtotalPrem;
    this.altCoverageData.alttotalSi       = this.alttotalSi;
    this.altCoverageData.alttotalSi       = this.alttotalSi;
    this.altCoverageData.alttotalPrem     = this.alttotalPrem;
    this.altCoverageData.comtotalSi       = this.comtotalSi;
    this.altCoverageData.comtotalPrem     = this.comtotalPrem;

    //setTimeout(() => this.focusBlur(),0);
  }

  prepareAlterationSave(){
    this.editedData = [];
    this.deletedData = [];
    this.altCoverageData.policyId       = this.policyIdAlt;
    this.altCoverageData.projId         = this.projId;
    this.altCoverageData.riskId         = this.riskId;
    this.altCoverageData.sectionISi     = this.altsectionISi;
    this.altCoverageData.sectionIISi    = this.altsectionIISi;
    this.altCoverageData.sectionIIISi   = this.altsectionIIISi;
    this.altCoverageData.totalSi        = this.alttotalSi;
    this.altCoverageData.sectionIPrem   = this.altsectionIPrem;
    this.altCoverageData.sectionIIPrem  = this.altsectionIIPrem;
    this.altCoverageData.sectionIIIPrem = this.altsectionIIIPrem;
    this.altCoverageData.totalPrem      = this.alttotalPrem;

    this.altCoverageData.cumSecISi      = this.comsectionISi;
    this.altCoverageData.cumSecIISi     = this.comsectionIISi;
    this.altCoverageData.cumSecIIISi    = this.comsectionIIISi;
    this.altCoverageData.cumTSi         = this.comtotalSi;
    this.altCoverageData.cumSecIPrem    = this.comsectionIPrem;
    this.altCoverageData.cumSecIIPrem   = this.comsectionIIPrem;
    this.altCoverageData.cumSecIIIPrem  = this.comsectionIIIPrem;
    this.altCoverageData.cumTPrem       = this.comtotalPrem;

    this.altCoverageData.createDate     = this.ns.toDateTimeString(this.altCoverageData.createDate);
    this.altCoverageData.updateDate     = this.ns.toDateTimeString(0);

    for(var i=0; i < this.passData.tableData.length;i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.editedData.push(this.passData.tableData[i]);
        this.editedData[this.editedData.length - 1].lineCd        = this.line;
        this.editedData[this.editedData.length - 1].sumInsured    = this.passData.tableData[i].sumInsured;
        this.editedData[this.editedData.length - 1].premRt        = this.passData.tableData[i].premRt;
        this.editedData[this.editedData.length - 1].premAmt       = this.passData.tableData[i].premAmt;
        this.editedData[this.editedData.length - 1].discountTag   = this.passData.tableData[i].discountTag;
        this.editedData[this.editedData.length - 1].cumSi         = this.passData.tableData[i].cumSi;
        this.editedData[this.editedData.length - 1].cumPrem       = this.passData.tableData[i].cumPrem;
        this.editedData[this.editedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
        this.editedData[this.editedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
      }

      if(this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length - 1].lineCd = this.line;
      }
    }
    this.altCoverageData.saveSectionCovers = this.editedData;
    this.altCoverageData.deleteSectionCovers = this.deletedData;
    this.altCoverageData.deleteDeductibleList = [];
    this.altCoverageData.saveDeductibleList = [];
  }

  alterationSave(){
    this.prepareAlterationSave();
    console.log(this.altCoverageData)
    this.underwritingservice.savePolCoverage(this.altCoverageData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          this.emptyVar();
          this.getPolCoverageAlt();
          this.table.markAsPristine();
          this.editedData = [];
          //this.getCoverageInfo();
        }
    });
  }

  emptyVar(){
    this.prevsectionISi = 0;
    this.prevsectionIPrem = 0;
    this.altsectionIPrem = 0;
    this.altsectionISi = 0;
    this.prevsectionIISi = 0;
    this.prevsectionIIPrem = 0;
    this.altsectionIISi = 0;
    this.altsectionIIPrem = 0;
    this.prevsectionIIISi = 0;
    this.prevsectionIIIPrem = 0;
    this.altsectionIIISi = 0;
    this.altsectionIIIPrem = 0;
    this.comsectionISi = 0;
    this.comsectionIPrem = 0;
    this.comsectionIISi = 0;
    this.comsectionIIPrem = 0;
    this.comsectionIIISi = 0;
    this.comsectionIIIPrem = 0;
    this.alttotalSi = 0;
    this.alttotalPrem = 0;
    this.comtotalSi = 0;
    this.comtotalPrem = 0;
  }

  getEditableAlt(){
    for(let data of this.passData.tableData){
      if(data.uneditable === undefined){
        data.uneditable = [];
      }
      if(data.discountTag == 'Y'){
        data.uneditable.pop();
      }else if(data.discountTag == 'N' ) {
        if(data.uneditable.length ==0)
          data.uneditable.push('premAmt');
      }
    }
  }

   onClickSaveAlt(){
     console.log('save')
     this.confirmSave.confirmModal();
    //$('#confirm-save #confirmSave ').trigger('click');
  }

  sectionCoversLOV(data){
      if(!this.alteration){
          this.hideSectionCoverArray = this.passDataSectionCover.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
          $('#sectionCoversLOV #modalBtn').trigger('click');
          this.sectionCoverLOVRow = data.index;
      }else{
          this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
          $('#sectionCoversLOV #modalBtn').trigger('click');
          this.sectionCoverLOVRow = data.index;
      }
        
  } 

   selectedSectionCoversLOV(data){
     if(!this.alteration){
         /*if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
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
           this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].uneditable = [];
           this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].uneditable.push('coverName');
           if(data[i].coverName !== undefined && 'OTHERS' === data[i].coverName.substring(0,6).toUpperCase()){
                this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].others = true;
                this.passDataSectionCover.tableData[this.passDataSectionCover.tableData.length - 1].uneditable = [];
           }
         }
         this.sectionTable.refreshTable();*/
         console.log(data)
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
     }else {
         if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
           console.log('true')
           this.sectionCoverLOVRow = data[0].ev.index;
           this.ns.lovLoader(data[0].ev, 0);
         }

         $('#cust-table-container').addClass('ng-dirty');
         // this.passData.tableData[this.sectionCoverLOVRow].coverCd = data[0].coverCd; 
         // this.passData.tableData[this.sectionCoverLOVRow].coverCdAbbr = data[0].coverCdAbbr;
         // this.passData.tableData[this.sectionCoverLOVRow].section = data[0].section;
         // this.passData.tableData[this.sectionCoverLOVRow].bulletNo = data[0].bulletNo;
         // this.passData.tableData[this.sectionCoverLOVRow].sumInsured = 0;
         // this.passData.tableData[this.sectionCoverLOVRow].edited = true;

         if(data[0].coverCd != '' && data[0].coverCd != null && data[0].coverCd != undefined) {
           //HIDE THE POWERFUL MAGNIFYING GLASS
           this.passData.tableData[this.sectionCoverLOVRow].showMG = 1;
         }
         this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
         //this.validateSectionCover();
         for(var i = 0; i<data.length;i++){
           this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
           this.passData.tableData[this.passData.tableData.length - 1].coverCd = data[i].coverCd;
           this.passData.tableData[this.passData.tableData.length - 1].coverName = data[i].coverName;
           this.passData.tableData[this.passData.tableData.length - 1].section = data[i].section;
           this.passData.tableData[this.passData.tableData.length - 1].bulletNo = data[i].bulletNo;
           this.passData.tableData[this.passData.tableData.length - 1].edited = true;
           this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;

           if(data[i].coverName !== undefined && data[i].coverName.substring(0,6).toUpperCase()){
                this.passData.tableData[this.passData.tableData.length - 1].others = true;
           }
         }
         this.sectionTable.refreshTable();
     }
      
    }

    onrowClickAlt(data){
      if(data != null){
        this.disabledFlag = false
        this.passDataDeductibles.disableAdd = false;
      }else {
        this.disabledFlag = true;
      }
    }
}
