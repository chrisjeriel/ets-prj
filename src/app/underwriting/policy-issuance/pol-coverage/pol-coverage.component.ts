import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { UnderwritingCoverageInfo, CoverageDeductibles } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

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

  passDataSectionCover: any = {
        tHeader: ["Cover Code", "Section", "Bullet No", "Sum Insured", "Rate", "Premium", "Add Sl"],
        dataTypes: [
                    "text", "select", "select", "currency", "percent", "currency", "checkbox"
                   ],
        opts: [{ selector: "section", vals: ["I", "II", "III"] }, { selector: "bulletNo", vals: ["1", "1.2", "1.3"] }],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        magnifyingGlass: ['coverCode'],
        widths:[228,1,1,200,1,1,1]
    };


  passDataTotalPerSection: any = {
        tHeader: ["Section", "Sum Insured", "Premium"],
        dataTypes: [
                    "text", "text", "text"
                   ],
        tableData: [["SECTION I","",""],["SECTION II","",""],["SECTION III","",""]],
        pageLength:3,
    };

  passDataCATPerils: any = {
        tHeader: ["CAT Perils", "Percentage Share on Premium(%)"],
        dataTypes: [
                    "text", "percent"
                   ],
        tableData: [["Earthquake","15"],["Typhoon","10"],["Flood","10"],["Volcanic Eruption","1"]],
        pageLength:10,
    };

  passDataDeductibles: any = {
        tHeader: ["Cover Name","Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text","text", "percent", "currency"],
        pageLength:10,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        checkFlag: true,
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        magnifyingGlass: ['coverCdDesc','deductibleCd'],
        keys:['coverCdDesc','deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
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


  passData: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    opts:[],
    addFlag: true,
    deleteFlag: true,
    // paginateFlag: true,
    searchFlag: true,
    checkFlag: true,
    magnifyingGlass: ['coverCode'],
    pageLength:'unli'
  };

  passData2: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    pageLength: 3
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

  passLOVData: any = {};
  lovRowData:any;
  lovCheckBox:boolean = false;
  dialogIcon:string = '';
  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private modalService: NgbModal,
                private route: ActivatedRoute, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Coverage");
    if (!this.alteration) {
      this.passDataSectionCover.tableData = this.underwritingservice.getUWCoverageInfo();
      //this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      //this.passDataTotalPerSection.tableData = this.underwritingservice.getTotalPerSection();

    } else {
      this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      this.passData.tHeader.push("Cover Code");
      this.passData.tHeader.push("Section");
      this.passData.tHeader.push("Bullet No");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Add Sl");

      this.passData.dataTypes.push("text");
      this.passData.dataTypes.push("select");
      this.passData.dataTypes.push("select");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("checkbox");

      this.passData.opts.push({ selector: "section", vals: ["I", "II", "III"] });
      this.passData.opts.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
      this.passData.opts.push({ selector: "sortSe", vals: ["10", "20", "30"] });

      this.optionsData.push("USD", "PHP", "EUR");

      this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
        { header: "Previous", span: 3 }, { header: "This Alteration", span: 3 },
        { header: "Cumulative", span: 3 }, { header: "", span: 1 });

      this.passData.tableData = [
        {
          coverCode: "ABC",
          section: "I",
          bulletNo: 1.2,
          prevSumInsured: 20,
          prevRate: 5,
          prevPremium: 100,
          thisAltSumInsured: 60,
          thisAltRate: 5,
          thisAltPremium: 50,
          cumuSumInsured: 90,
          cumuRate: 5,
          cumuPremium: 800,
          addSl: ""
        }
      ];

      //

      this.passData2.tHeader.push("Section");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");

      this.passData2.dataTypes.push("text");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");

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
    }

    this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
        });
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
        $('#modalBtn').trigger('click');
        /*$('#CATPerils >#modalBtn').trigger('click');*/
  }

  deductibles() {
    $('#Deductibles >#modalBtn').trigger('click');
  }

  getDeductibles(){
    this.deductiblesTable.loadingFlag = true;
    let params : any = {
      policyId:8,
      policyNo:'',
      coverCd:'',
      endtCd: 0
    }
    this.underwritingservice.getUWCoverageDeductibles(params).subscribe(data=>{
      console.log(data);
      this.passDataDeductibles.tableData = data['policy']['deductibles'].filter(a=>{
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
        a.updateUser = JSON.parse(window.localStorage.currentUser).username;
        return true;
      });
      this.deductiblesTable.refreshTable();
    });
  }

  saveDeductibles(){
    this.deductiblesTable.loadingFlag = true;
    let params:any = {
      policyId:8,
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
      this.lovCheckBox = false;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = 'CAR'//this.quotationNum.substring(0,3);
      this.passLOVData.params = {
        coverCd : data.data.coverCd == null ? 0: data.data.coverCd,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
      this.lovRowData = data.data;
    }else if(data.key == 'coverCdDesc'){
      this.passLOVData.selector = 'otherRates';
      this.lovCheckBox = true;


    }
    this.lov.openLOV();
  }

  setSelected(data){
    if(data.selector == 'deductibles'){
      this.lovRowData.deductibleTitle = data.data.deductibleTitle;
      this.lovRowData.deductibleRt = data.data.deductibleRate;
      this.lovRowData.deductibleAmt = data.data.deductibleAmt;
      this.lovRowData.deductibleTxt = data.data.deductibleText;
      this.lovRowData.edited = true;
      this.lovRowData.deductibleCd = data.data.deductibleCd;
    }else if (data.selector == 'otherRates'){

    }
  }

}
