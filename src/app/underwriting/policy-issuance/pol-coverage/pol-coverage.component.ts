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
  @ViewChild('catPerils') catPerilstable: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
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
  catPerilData: any = {
    catPrlId: 0,
    pctShrPrm: 0,
    saveCATPerilList:[]
  };
  passDataSectionCover: any = {
        tableData: [],
        tHeader: [ "Section","Bullet No","Cover Name",  "Sum Insured", "Rate", "Premium", "Discount","Add Sl"],
        dataTypes: [
                    "text", "text", "text", "currency", "percent", "currency", "checkbox", "checkbox"
                   ],
        checkFlag:true,
        pageLength: 'unli',
        searchFlag:true,
        magnifyingGlass: ['coverCode'],
        widths:[1,1,228,200,75,1,1,1],
        uneditable:[true,true,true,true,true,false,false,true],
        keys:['section','bulletNo','description','sumInsured','premRt','premAmt','discountTag','addSi']
    };


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
        tableData:[],
        pageID:'deductibles',
        nData: {
          "coverCd": null,
          "createDate": this.ns.toDateTimeString(0),
          "createUser": JSON.parse(window.localStorage.currentUser).username,
          "deductibleAmt": 0,
          "deductibleCd": null,
          "deductibleRt": 0,
          "deductibleTxt": '',
          "endtCd": "0",
          "updateDate": this.ns.toDateTimeString(0),
          "updateUser":JSON.parse(window.localStorage.currentUser).username,
          showMG : 1
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


  passData: any = {
    tableData:[],
    tHeader:['Section','Bullet No','Cover Name','Sum Insured','Rate','Premium','Sum Insured','Rate','Premium','Discount Tag','Add SI','Sum Insured','Rate','Premium'],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:['text','text','text','currency','percent','currency','currency','percent','currency','checkbox','checkbox','currency','percent','currency'],
    opts:[],
    addFlag: true,
    deleteFlag: true,
    // paginateFlag: true,
    searchFlag: true,
    pageID: 'altCoverage',
    checkFlag: true,
    magnifyingGlass: ['description'],
    nData:{
      'section': null,
      'bulletNo': null,
      'description': null,
      'sumInsured': null,
      'premRt': null,
      'premAmt': null,
      'altSumInsured': null,
      'altRate': null,
      'altPremium': null,
      'discountTag': null,
      'addSi': null,
      'comSumInsured': null,
      'comRate': null,
      'comPremium': null,
      "createDate": this.ns.toDateTimeString(0),
      "createUser": JSON.parse(window.localStorage.currentUser).username,
      "updateDate": this.ns.toDateTimeString(0),
      "updateUser":JSON.parse(window.localStorage.currentUser).username,
      "showMG":1
    },
    keys:['section','bulletNo','description','comSumInsured','comRate','comPremium','sumInsured','premRt','premAmt','discountTag','addSi','comSumInsuredEdt','comRate','comPremium'],
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
            this.policyIdAlt = params['policyId'];

            this.parameters = params.policyNo.split(/[-]/g);
            console.log(this.parameters)

        });

    if (!this.alteration) {
      
      this.getPolCoverage();
    } else {
      this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
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

  }

  getPolCoverageAlt(){

    this.underwritingservice.getUWCoverageAlt(this.parameters[0],this.parameters[1],this.parameters[2],this.parameters[3],this.parameters[4],this.parameters[5]).subscribe((data: any) => {

      this.passData.tableData = [];  
      this.prevtotalSi = 0;
      this.prevtotalPrem = 0;
      this.projId = data.policy.project.projId;
      this.riskId = data.policy.project.riskId;
      this.altCoverageData = data.policy.project.coverage;


      var dataTable = data.policy.project.coverage.sectionCovers
        for (var i = 0; i< dataTable.length;i++){
          this.passData.tableData.push(dataTable[i])
          /*this.passData.tableData[i].sumInsured = dataTable[i].comSumInsured;
          this.passData.tableData[i].premRt = dataTable[i].comRate;
          this.passData.tableData[i].premAmt = dataTable [i].comPrem;*/
          if(dataTable[i].addSi == 'Y'){
            this.prevtotalSi += dataTable[i].sumInsured;
            this.prevtotalPrem += dataTable[i].premAmt;
          }
        }
          this.altCoverageData.prevtotalSi = this.prevtotalSi;
          this.altCoverageData.prevtotalPrem = this.prevtotalPrem;

        for(var j=0;j<this.passData.tableData.length;j++){
          if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIPrem += this.passData.tableData[j].premAmt;
            this.altsectionISi += this.passData.tableData[j].altSumInsured;
            this.altsectionIPrem += this.passData.tableData[j].altPremium;
          }

          if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIIPrem += this.passData.tableData[j].premAmt;
          }

          if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIIISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIIIPrem += this.passData.tableData[j].premAmt;
          }

          this.passData.tableData[j].comSumInsured = this.passData.tableData[j].sumInsured
          this.passData.tableData[j].comRate = this.passData.tableData[j].premRt
          this.passData.tableData[j].comPremium = isNaN(this.passData.tableData[j].altPremium) ? this.passData.tableData[j].premAmt : this.passData.tableData[j].premAmt + this.passData.tableData[j].altPremium;

          this.comtotalSi += this.passData.tableData[j].comSumInsured;
          this.comtotalPrem += this.passData.tableData[j].comPremium;
        }
        this.table.refreshTable();

        
        this.altCoverageData.comtotalSi = this.comtotalSi;
        this.altCoverageData.comtotalPrem = this.comtotalPrem;

        this.passData2.tableData[0].section = 'SECTION I';
        this.passData2.tableData[0].prevSi = this.prevsectionISi;
        this.passData2.tableData[0].prevAmt = this.prevsectionIPrem;
        this.passData2.tableData[0].altSi = 0;
        this.passData2.tableData[0].altAmt = 0;
        this.passData2.tableData[0].comSi = this.prevsectionISi;
        this.passData2.tableData[0].comAmt = this.prevsectionIPrem;
        this.passData2.tableData[1].section = 'SECTION II';
        this.passData2.tableData[1].prevSi = this.prevsectionIISi;
        this.passData2.tableData[1].prevAmt = this.prevsectionIIPrem;
        this.passData2.tableData[1].altSi = 0;
        this.passData2.tableData[1].altAmt = 0;
        this.passData2.tableData[1].comSi = this.prevsectionIISi;
        this.passData2.tableData[1].comAmt = this.prevsectionIIPrem;
        this.passData2.tableData[2].section = 'SECTION III';
        this.passData2.tableData[2].prevSi =  this.prevsectionIIISi;
        this.passData2.tableData[2].prevAmt = this.prevsectionIIIPrem;
        this.passData2.tableData[2].altSi = 0;
        this.passData2.tableData[2].altAmt = 0;
        this.passData2.tableData[2].comSi = this.prevsectionIIISi;
        this.passData2.tableData[2].comAmt = this.prevsectionIIIPrem;

        this.getEditable();
    });
    /*this.underwritingservice.getUWCoverageInfos(null,'41').subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];  
      this.prevtotalSi = 0;
      this.prevtotalPrem = 0;
      this.projId = data.policy.project.projId;
      this.riskId = data.policy.project.riskId;
      this.altCoverageData = data.policy.project.coverage;


      var dataTable = data.policy.project.coverage.sectionCovers
        for (var i = 0; i< dataTable.length;i++){
          this.passData.tableData.push(dataTable[i])

          if(dataTable[i].addSi == 'Y'){
            this.prevtotalSi += dataTable[i].sumInsured;
            this.prevtotalPrem += dataTable[i].premAmt;
          }
        }
          this.altCoverageData.prevtotalSi = this.prevtotalSi;
          this.altCoverageData.prevtotalPrem = this.prevtotalPrem;

        for(var j=0;j<this.passData.tableData.length;j++){
          if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIPrem += this.passData.tableData[j].premAmt;
            this.altsectionISi += this.passData.tableData[j].altSumInsured;
            this.altsectionIPrem += this.passData.tableData[j].altPremium;
          }

          if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIIPrem += this.passData.tableData[j].premAmt;
          }

          if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
            this.prevsectionIIISi += this.passData.tableData[j].sumInsured;
            this.prevsectionIIIPrem += this.passData.tableData[j].premAmt;
          }

          this.passData.tableData[j].comSumInsured = this.passData.tableData[j].sumInsured
          this.passData.tableData[j].comRate = this.passData.tableData[j].premRt
          this.passData.tableData[j].comPremium = isNaN(this.passData.tableData[j].altPremium) ? this.passData.tableData[j].premAmt : this.passData.tableData[j].premAmt + this.passData.tableData[j].altPremium;

          this.comtotalSi += this.passData.tableData[j].comSumInsured;
          this.comtotalPrem += this.passData.tableData[j].comPremium;
        }
        this.table.refreshTable();

        
        this.altCoverageData.comtotalSi = this.comtotalSi;
        this.altCoverageData.comtotalPrem = this.comtotalPrem;

        this.passData2.tableData[0].section = 'SECTION I';
        this.passData2.tableData[0].prevSi = this.prevsectionISi;
        this.passData2.tableData[0].prevAmt = this.prevsectionIPrem;
        this.passData2.tableData[0].altSi = 0;
        this.passData2.tableData[0].altAmt = 0;
        this.passData2.tableData[0].comSi = this.prevsectionISi;
        this.passData2.tableData[0].comAmt = this.prevsectionIPrem;
        this.passData2.tableData[1].section = 'SECTION II';
        this.passData2.tableData[1].prevSi = this.prevsectionIISi;
        this.passData2.tableData[1].prevAmt = this.prevsectionIIPrem;
        this.passData2.tableData[1].altSi = 0;
        this.passData2.tableData[1].altAmt = 0;
        this.passData2.tableData[1].comSi = this.prevsectionIISi;
        this.passData2.tableData[1].comAmt = this.prevsectionIIPrem;
        this.passData2.tableData[2].section = 'SECTION III';
        this.passData2.tableData[2].prevSi =  this.prevsectionIIISi;
        this.passData2.tableData[2].prevAmt = this.prevsectionIIIPrem;
        this.passData2.tableData[2].altSi = 0;
        this.passData2.tableData[2].altAmt = 0;
        this.passData2.tableData[2].comSi = this.prevsectionIIISi;
        this.passData2.tableData[2].comAmt = this.prevsectionIIIPrem;

        this.getEditable();
        //this.focusBlur();
    });*/
  }

  getPolCoverage(){
      this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      this.underwritingservice.getUWCoverageInfos(null,this.policyId).subscribe((data:any) => {
        console.log(data)
          this.passDataSectionCover.tableData = [];
          this.projId = data.policy.project.projId;
          this.riskId = data.policy.project.riskId;
          this.coverageData = data.policy.project.coverage;
          this.coverageData.remarks = this.coverageData.remarks == null ? '':this.coverageData.remarks;
          //this.coverageData.pctShare = this.coverageData.totalValue == 0 ? 0:(this.coverageData.totalSi/this.coverageData.totalValue*100);

          this.sectionISi = 0;
          this.sectionIPrem = 0;
          this.sectionIISi = 0;
          this.sectionIIPrem = 0;
          this.sectionIIISi = 0;
          this.sectionIIIPrem = 0;
          var infoData = data.policy.project.coverage.sectionCovers;
            for(var i = 0; i < infoData.length;i++){
              this.passDataSectionCover.tableData.push(infoData[i]);
                if(infoData[i].addSi == 'Y' && infoData[i].section == 'I'){
                    this.sectionISi += infoData[i].sumInsured;
                    this.sectionIPrem += infoData [i].premAmt;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'II'){
                    this.sectionIISi += infoData[i].sumInsured;
                    this.sectionIIPrem += infoData [i].premAmt;
                }else if(infoData[i].addSi == 'Y' && infoData[i].section == 'III'){
                    this.sectionIIISi += infoData[i].sumInsured;
                    this.sectionIIIPrem += infoData [i].premAmt;
                }
            }

           /*for( var j=0; j < this.passDataSectionCover.tableData.length;j++){
              this.passDataSectionCover.tableData[j].premAmt = this.passDataSectionCover.tableData[j].sumInsured * (this.passDataSectionCover.tableData[j].premRt /100 )
            }
*/

            for( var j=0; j < this.passDataSectionCover.tableData.length;j++){
             this.passDataSectionCover.tableData[j].premAmt = this.passDataSectionCover.tableData[j].addSi == 'Y' ? this.passDataSectionCover.tableData[j].premAmt:this.passDataSectionCover.tableData[j].sumInsured * (this.passDataSectionCover.tableData[j].premRt /100 )
           }

            this.table.refreshTable();
              this.passDataTotalPerSection.tableData[0].section = 'SECTION I'
              this.passDataTotalPerSection.tableData[0].sumInsured = this.sectionISi;
              this.passDataTotalPerSection.tableData[0].premium = this.sectionIPrem;
              this.passDataTotalPerSection.tableData[1].section = 'SECTION II'
              this.passDataTotalPerSection.tableData[1].sumInsured = this.sectionIISi;
              this.passDataTotalPerSection.tableData[1].premium = this.sectionIIPrem;
              this.passDataTotalPerSection.tableData[2].section = 'SECTION III'
              this.passDataTotalPerSection.tableData[2].sumInsured = this.sectionIIISi;
              this.passDataTotalPerSection.tableData[2].premium = this.sectionIIIPrem;

              if(this.line == 'CAR' || this.line == 'EAR'){
                this.coverageData.totalSi = this.sectionISi + this.sectionIIISi;
              } else if(this.line == 'EEI'){
                this.coverageData.totalSi = this.sectionISi + this.sectionIISi + this.sectionIIISi;
              }else {
                this.coverageData.totalSi = this.sectionISi ;
              }
              
              this.coverageData.totalPrem = this.sectionIPrem + this.sectionIIPrem + this.sectionIIIPrem;
              this.coverageData.sectionISi = this.sectionISi;
              this.coverageData.sectionIISi = this.sectionIISi;
              this.coverageData.sectionIIISi = this.sectionIIISi;
              this.coverageData.sectionIPrem = this.sectionIPrem;
              this.coverageData.sectionIIPrem = this.sectionIIPrem;
              this.coverageData.sectionIIIPrem = this.sectionIIIPrem;
           
             //this.focusBlur();
             this.getEditableCov();
      });
  }

  getEditableCov(){
    for(let data of this.passDataSectionCover.tableData){
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

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  showDeductiblesModal(deductibles){
    // setTimeout(()=>{this.getDeductibles();},0);
    // this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    console.log(deductibles)
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
        console.log(catPerilData)
        this.passDataCATPerils.tableData = [];
        for(var i = 0; i < catPerilData.length;i++){
          this.passDataCATPerils.tableData.push(catPerilData[i]);
        }
        this.catPerilstable.refreshTable();
      });
    }else{
      this.underwritingservice.getCATPeril(null,this.policyIdAlt).subscribe((data:any) => {
        var catPerilData = data.policy.catPeril;
        console.log(catPerilData)
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
    this.deductiblesTable.loadingFlag = true;
    this.passDataDeductibles.nData.coverCd = this.table.indvSelect.coverCd;
    let params : any = {
      policyId:this.policyId,
      policyNo:'',
      coverCd:this.table.indvSelect.coverCd,
      endtCd: 0
    }
    this.underwritingservice.getUWCoverageDeductibles(params).subscribe(data=>{
      console.log(data);
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
  }
  
  saveDeductibles(){
    let params:any = {
      policyId:this.policyId,
      saveDeductibleList: [],
      deleteDeductibleList:[]
    };
    params.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    params.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
    if(params.saveDeductibleList.length==0 && params.deleteDeductibleList.length==0){
      this.dialogMessage = 'Nothing to save.'
      this.dialogIcon = 'info'
      this.successDlg.open();
      return;
    }
    for(let ded of params.saveDeductibleList){
      if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
        this.dialogIcon = "error";
        setTimeout(a=>this.successDiag.open(),0);
        return null;
      }
    }
    this.deductiblesTable.loadingFlag = true;
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
      this.passLOVData.lineCd = 'CAR'//this.quotationNum.substring(0,3);
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
    }else if (data.selector == 'otherRates'){

    }
    this.deductiblesTable.refreshTable();
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  update(data){
    this.sectionISi = 0;
    this.sectionIPrem = 0;
    this.sectionIISi = 0;
    this.sectionIIPrem = 0;
    this.sectionIIISi = 0;
    this.sectionIIIPrem = 0;
    this.totalSi = 0;
    this.totalPrem =0;
    for(var i=0; i< this.passDataSectionCover.tableData.length;i++){
       if(this.passDataSectionCover.tableData[i].addSi == 'Y'){
         if(this.passDataSectionCover.tableData[i].section == 'I'){
               this.sectionISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIPrem += this.passDataSectionCover.tableData [i].premAmt;
           }else if(this.passDataSectionCover.tableData[i].section == 'II'){
               this.sectionIISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIIPrem += this.passDataSectionCover.tableData [i].premAmt;
           }else if(this.passDataSectionCover.tableData[i].section == 'III'){
               this.sectionIIISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
           }
           /*if(this.passDataSectionCover.tableData[i].section == 'I'){
               this.sectionISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIPrem += this.passDataSectionCover.tableData [i].premAmt;
           }else if(this.passDataSectionCover.tableData[i].section == 'II'){
               this.sectionIISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIIPrem += this.passDataSectionCover.tableData [i].premAmt;
           }else if(this.passDataSectionCover.tableData[i].section == 'III'){
               this.sectionIIISi += this.passDataSectionCover.tableData[i].sumInsured;
               this.sectionIIIPrem += this.passDataSectionCover.tableData[i].premAmt;
           }*/
       }
       this.totalPrem += this.passDataSectionCover.tableData [i].premAmt;
       this.totalSi += this.passDataSectionCover.tableData [i].sumInsured;
       this.passDataSectionCover.tableData[i].premAmt = this.passDataSectionCover.tableData[i].edited || this.passDataSectionCover.tableData[i].addSi == 'Y'?  this.passDataSectionCover.tableData[i].premAmt:this.passDataSectionCover.tableData[i].sumInsured * (this.passDataSectionCover.tableData[i].premRt /100 )
      
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

    this.coverageData.pctShare = (this.coverageData.totalSi/this.coverageData.totalValue*100);
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
/*    setTimeout(() => {
      this.focusBlur();
    }, 0)*/
  }

  onrowClick(data){
    if(data == null){
      this.disabledFlag = true;
    }else{
      this.disabledFlag = false;
    }
  }

  prepareData(){
    this.editedData = [];
    this.deletedData = [];
    this.coverageData.policyId = this.policyId;
    this.coverageData.projId = this.projId;
    this.coverageData.riskId = this.riskId;
    this.coverageData.createDate = this.ns.toDateTimeString(this.coverageData.createDate);
    this.coverageData.updateDate = this.ns.toDateTimeString(this.coverageData.updateDate);

    for(var i = 0; i < this.passDataSectionCover.tableData.length;i++){
      if(this.passDataSectionCover.tableData[i].edited && !this.passDataSectionCover.tableData[i].deleted){
        this.editedData.push(this.passDataSectionCover.tableData[i]);
        this.editedData[this.editedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
        this.editedData[this.editedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
        this.editedData[this.editedData.length - 1].lineCd = 'CAR'
      }
    }
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

  }

  saveCoverage(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    console.log(this.coverageData)
    this.underwritingservice.savePolCoverage(this.coverageData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
        console.log('Check error')
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        $('#successModalBtn').trigger('click');
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        $('app-sucess-dialog #modalBtn').trigger('click');
        console.log('Success')
        this.getPolCoverage();
        this.table.markAsPristine();
        this.editedData = [];
        //this.getCoverageInfo();
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
        console.log('Check error')
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        $('#successModalBtn').trigger('click');
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        $('#successModalBtn').trigger('click');
        console.log('Success')
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

  onClickSave(){
    for( var i= 0; i< this.passDataSectionCover.tableData.length;i++){
      if(this.passDataSectionCover.tableData[i].sumInsured == 0 && this.passDataSectionCover.tableData[i].addSi == 'Y'){
        this.errorFlag = true;
      }
    }

    /*if(this.passDataSectionCover.tableData[0].sumInsured > 0){
            for(var i = 1; i< this.passDataSectionCover.tableData.length;i++){
              if(this.passDataSectionCover.tableData[i].sumInsured < 0){
                this.errorFlag = true;
              }
            }

        }else if(this.passDataSectionCover.tableData[0].sumInsured < 0){
          console.log('pasok')
            for(var i = 1 ; i< this.passDataSectionCover.tableData[i].length;i++){
              if(this.passDataSectionCover.tableData[i].sumInsured > 0 ){
                console.log(this.errorFlag)
                this.errorFlag = true;
              }
            }
        }*/

    if(this.errorFlag){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check Sum Insured.';
      this.successDiag.open();
      this.errorFlag = false;
    }else {
      $('#confirm-save #modalBtn2').trigger('click');
    }
    
  }


  updateAlteration(data){
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

    this.getEditable();

    for(var j=0;j<this.passData.tableData.length;j++){
      if(!this.passData.tableData[j].edited){
        this.passData.tableData[j].comSumInsured       = this.passData.tableData[j].sumInsured
        this.passData.tableData[j].comRate             = this.passData.tableData[j].premRt
        this.passData.tableData[j].comPremium          = isNaN((this.passData.tableData[j].altSumInsured && this.passData.tableData[j].altRate)) ? this.passData.tableData[j].premAmt : this.passData.tableData[j].premAmt  + this.passData.tableData[j].altPremium;
      }else{
        this.passData.tableData[j].altPremium        = isNaN(this.passData.tableData[j].altRate) ? null:this.passData.tableData[j].altSumInsured * (this.passData.tableData[j].altRate / 100);
        
        if(this.passData.tableData[j].section == 'I' && this.passData.tableData[j].addSi == 'Y'){
          this.prevsectionISi                         += this.passData.tableData[j].sumInsured;
          this.prevsectionIPrem                       += this.passData.tableData[j].premAmt;
          this.altsectionISi                          += isNaN(this.passData.tableData[j].altSumInsured) ? 0: this.passData.tableData[j].altSumInsured;
          this.altsectionIPrem                        += isNaN(this.passData.tableData[j].altPremium) ? 0: this.passData.tableData[j].altPremium;
          
          this.passData.tableData[j].comSumInsured     = isNaN(this.altsectionISi) ? 0:this.prevsectionISi + this.altsectionISi;
          this.passData.tableData[j].comRate           = isNaN(this.passData.tableData[j].altRate) ? this.passData.tableData[j].premRt: this.passData.tableData[j].altRate;
          this.passData.tableData[j].comPremium        = isNaN((this.passData.tableData[j].altRate && this.passData.tableData[j].altPremium)) ? this.prevsectionIPrem :  this.prevsectionIPrem + this.altsectionIPrem;
          this.comsectionISi                          += this.passData.tableData[j].comSumInsured;
          this.comsectionIPrem                        += this.passData.tableData[j].comPremium;
        }

        if(this.passData.tableData[j].section == 'II' && this.passData.tableData[j].addSi == 'Y'){
          this.prevsectionIISi                       += this.passData.tableData[j].sumInsured;
          this.prevsectionIIPrem                     += this.passData.tableData[j].premAmt;
          this.altsectionIISi                        += isNaN(this.passData.tableData[j].altSumInsured) ? 0:this.passData.tableData[j].altSumInsured;
          this.passData.tableData[j].altPremium       =  isNaN(this.passData.tableData[j].altRate) ? 0:this.passData.tableData[j].altSumInsured * (this.passData.tableData[j].altRate / 100);
          this.altsectionIIPrem                      += isNaN(this.passData.tableData[j].altPremium) ? 0:this.passData.tableData[j].altPremium;

          this.passData.tableData[j].comSumInsured    = isNaN(this.altsectionIISi) ? 0:this.prevsectionIISi + this.altsectionIISi;
          this.passData.tableData[j].comRate          = isNaN(this.passData.tableData[j].altRate) ? this.passData.tableData[j].premRt: this.passData.tableData[j].altRate;
          this.passData.tableData[j].comPremium        = isNaN((this.passData.tableData[j].altRate && this.passData.tableData[j].altPremium)) ? this.prevsectionIIPrem :  this.prevsectionIIPrem + this.altsectionIIPrem;
          
          this.comsectionIISi                        += this.passData.tableData[j].comSumInsured;
          this.comsectionIIPrem                      += this.passData.tableData[j].comPremium;
        }

        if(this.passData.tableData[j].section == 'III' && this.passData.tableData[j].addSi == 'Y'){
          this.prevsectionIIISi                      += this.passData.tableData[j].sumInsured;
          this.prevsectionIIIPrem                    += this.passData.tableData[j].premAmt;
          this.altsectionIIISi                       += isNaN(this.passData.tableData[j].altSumInsured) ? 0: this.passData.tableData[j].altSumInsured;
          this.passData.tableData[j].altPremium       =  isNaN(this.passData.tableData[j].altRate) ? 0:this.passData.tableData[j].altSumInsured * (this.passData.tableData[j].altRate / 100);
          this.altsectionIIIPrem                     += isNaN(this.passData.tableData[j].altPremium) ? 0:this.passData.tableData[j].altPremium;

          this.passData.tableData[j].comSumInsured    = isNaN(this.altsectionIIISi) ? 0:this.prevsectionIIISi + this.altsectionIIISi;
          this.passData.tableData[j].comRate          = isNaN(this.passData.tableData[j].altRate) ? this.passData.tableData[j].premRt: this.passData.tableData[j].altRate;
          this.passData.tableData[j].comPremium        = isNaN((this.passData.tableData[j].altRate && this.passData.tableData[j].altPremium)) ? this.prevsectionIIIPrem :  this.prevsectionIIIPrem + this.altsectionIIIPrem;
          
          this.comsectionIIISi                       += this.passData.tableData[j].comSumInsured;
          this.comsectionIIIPrem                     += this.passData.tableData[j].comPremium;
        }
      }
    }
    /*keys:['section','bulletNo','description','sumInsured','premRt','premAmt','altSumInsured','altRate','altPrenium','altDiscountTag','addSi','comSumInsured','comRate','comPrenium'],*/
    this.alttotalSi         += (isNaN(this.altsectionISi)? 0: this.altsectionISi) +  (isNaN(this.altsectionIISi) ? 0:this.altsectionIISi) + (isNaN(this.altsectionIIISi) ? 0: this.altsectionIIISi);
    this.alttotalPrem       += (isNaN(this.altsectionIPrem)? 0: this.altsectionIPrem)  + (isNaN(this.altsectionIIPrem)? 0: this.altsectionIIPrem)  + (isNaN(this.altsectionIIIPrem)? 0: this.altsectionIIIPrem);
    this.comtotalSi         += (isNaN(this.comsectionISi)? 0: this.comsectionISi) + (isNaN(this.comsectionIISi)? 0: this.comsectionIISi)  + (isNaN(this.comsectionIIISi)? 0: this.comsectionIIISi) ;
    this.comtotalPrem       += (isNaN(this.comsectionIPrem)? 0: this.comsectionIPrem)  + (isNaN(this.comsectionIIPrem)? 0: this.comsectionIIPrem)  + (isNaN(this.comsectionIIIPrem)? 0: this.comsectionIIIPrem) ;

    this.passData2.tableData[0].section   = 'SECTION I';
    this.passData2.tableData[0].prevSi    = this.prevsectionISi;
    this.passData2.tableData[0].prevAmt   = this.prevsectionIPrem;
    this.passData2.tableData[0].altSi     = isNaN(this.altsectionISi) ? 0:this.altsectionISi;
    this.passData2.tableData[0].altRate   = isNaN(this.altsectionISi)
    this.passData2.tableData[0].altAmt    = isNaN(this.altsectionIPrem) ? 0:this.altsectionIPrem;
    this.passData2.tableData[0].comSi     = isNaN(this.comsectionISi) ? 0:this.comsectionISi;
    this.passData2.tableData[0].comAmt    = isNaN(this.comsectionIPrem) ? 0:this.comsectionIPrem;
    this.passData2.tableData[1].section   = 'SECTION II';
    this.passData2.tableData[1].prevSi    = this.prevsectionIISi;
    this.passData2.tableData[1].prevAmt   = this.prevsectionIIPrem;
    this.passData2.tableData[1].altSi     = isNaN(this.altsectionIISi) ? 0:this.altsectionIISi;
    this.passData2.tableData[1].altAmt    = isNaN(this.altsectionIIPrem) ? 0:this.altsectionIIPrem;
    this.passData2.tableData[1].comSi     = isNaN(this.comsectionIISi) ? 0:this.comsectionIISi;
    this.passData2.tableData[1].comAmt    = isNaN(this.comsectionIIPrem) ? 0:this.comsectionIIPrem;
    this.passData2.tableData[2].section   = 'SECTION III';
    this.passData2.tableData[2].prevSi    =  this.prevsectionIIISi;
    this.passData2.tableData[2].prevAmt   = this.prevsectionIIIPrem;
    this.passData2.tableData[2].altSi     = isNaN(this.altsectionIIISi) ? 0:this.altsectionIIISi;
    this.passData2.tableData[2].altAmt    = isNaN(this.altsectionIPrem) ? 0:this.altsectionIIIPrem;
    this.passData2.tableData[2].comSi     = isNaN(this.comsectionIIISi) ? 0:this.comsectionIIISi;
    this.passData2.tableData[2].comAmt    = isNaN(this.comsectionIIIPrem) ? 0:this.comsectionIIIPrem;

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
        this.editedData[this.editedData.length - 1].lineCd        = 'CAR';
        this.editedData[this.editedData.length - 1].sumInsured    = this.passData.tableData[i].altSumInsured;
        this.editedData[this.editedData.length - 1].premRt        = this.passData.tableData[i].altRate;
        this.editedData[this.editedData.length - 1].premAmt       = this.passData.tableData[i].altPremium;
        this.editedData[this.editedData.length - 1].discountTag   = this.passData.tableData[i].discountTag;
        this.editedData[this.editedData.length - 1].cumSi         = this.passData.tableData[i].comSumInsured;
        this.editedData[this.editedData.length - 1].cumPrem       = this.passData.tableData[i].comPremium;
        this.editedData[this.editedData.length - 1].createDateSec =  this.ns.toDateTimeString(0)
        this.editedData[this.editedData.length - 1].updateDateSec = this.ns.toDateTimeString(0); 
      }

      if(this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length - 1].lineCd = 'CAR';
      }
    }
    this.altCoverageData.saveSectionCovers = this.editedData;
    this.altCoverageData.deleteSectionCovers = this.deletedData;
  }

  alterationSave(){
    this.prepareAlterationSave();
    console.log(this.altCoverageData)
    this.underwritingservice.savePolCoverage(this.altCoverageData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          console.log('Check error')
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          console.log('Success')
          this.getPolCoverageAlt();
          this.table.markAsPristine();
          this.editedData = [];
          //this.getCoverageInfo();
        }
    });
  }

  getEditable(){
    for(let data of this.passData.tableData){
      if(data.uneditable === undefined){
        data.uneditable = [];
      }
      if(data.discountTag == 'Y'){
        data.uneditable.pop();
      }else if(data.discountTag == 'N' ) {
        if(data.uneditable.length ==0)
          data.uneditable.push('altPremium');
      }
    }
  }

   onClickSaveAlt(){
    /*if((this.passData.tableData[0].altSumInsured > 0 && !(this.passData.tableData[1].altSumInsured > 0)) || (this.passData.tableData[0].altSumInsured < 0 && !(this.passData.tableData[0].altSumInsured < 0))){
      this.errorFlag = true;
    }*/

    /*if(this.passData.tableData[0].altSumInsured > 0){
        for(var i = 1; i< this.passData.tableData.length;i++){
          if(this.passData.tableData[i].altSumInsured < 0){
            this.errorFlag = true;
          }
        }

    }else if(this.passData.tableData[0].altSumInsured < 0){
        for(var i = 1 ; i< this.passData.tableData[i].length;i++){
          if(this.passData.tableData[i].altSumInsured > 0 ){
            this.errorFlag = true;
          }
        }
    }

    

    if(this.errorFlag){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Please check Sum Insured.';
      this.successDiag.open();
      this.errorFlag = false;
    }else {
      $('#confirm-save #alterationSaving').trigger('click');
    }*/
    $('#confirm-save #alterationSaving').trigger('click');
  }

  sectionCoversLOV(data){
        this.hideSectionCoverArray = this.passData.tableData.filter((a)=>{return a.coverCd!== undefined && !a.deleted}).map((a)=>{return a.coverCd.toString()});
        $('#sectionCoversLOV #modalBtn').trigger('click');
        //data.tableData = this.passData.tableData;
        this.sectionCoverLOVRow = data.index;
  }

   selectedSectionCoversLOV(data){
    console.log(data)
      if(data[0].hasOwnProperty('singleSearchLov') && data[0].singleSearchLov) {
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
        this.passData.tableData[this.passData.tableData.length - 1].description = data[i].description;
        this.passData.tableData[this.passData.tableData.length - 1].section = data[i].section;
        this.passData.tableData[this.passData.tableData.length - 1].bulletNo = data[i].bulletNo;
        this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
        console.log(this.passData.tableData);
      }
      this.table.refreshTable();
    }
}
