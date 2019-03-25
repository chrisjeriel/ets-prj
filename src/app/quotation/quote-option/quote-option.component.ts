import { Component, OnInit, ViewChildren, QueryList, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates, QuotationDeductibles } from '../../_models';
import { QuotationService, UnderwritingService, MaintenanceService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
    selector: 'app-quote-option',
    templateUrl: './quote-option.component.html',
    styleUrls: ['./quote-option.component.css']
})
export class QuoteOptionComponent implements OnInit {
    @ViewChildren(CustEditableNonDatatableComponent) table: QueryList<CustEditableNonDatatableComponent>;
    @ViewChild("optDeductibleTable") optDeductibleTable: CustEditableNonDatatableComponent;
    @ViewChild("covDeductibleTable") covDeductibleTable: CustEditableNonDatatableComponent;
    @ViewChild("otherRatesTable") otherRatesTable: CustEditableNonDatatableComponent;
    @ViewChild("optionsTable") optionsTable: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(ModalComponent) deductiblesModal : ModalComponent;
/*    private quotationInfo: QuotationInfo;*/
    private quotationOption: QuotationOption;
    private quotationOtherRates: QuotationOtherRates;
    private sub: any;
   @Input() quotationInfo: any = {};
   @Input() inquiryFlag: boolean = false;
   @Output() showAlop = new EventEmitter<any>();
    coverCodeLOVRow : number;
    quoteNoData: string;
    quotationNum: string;
    insured: any;
    riskName: any;
    quoteId: any;
    from: string;
    passLOVData: any = {
      selector:'',
      data:{}
    }

    @Output() enblEndtTab = new EventEmitter<any>();

    optionsData: any = {
        tableData: [],
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['number', 'percent', 'text', 'percent', 'percent', 'percent'],
        magnifyingGlass: ['conditions'],
        nData: {
            commRtFac: 0,
            commRtQuota: 0,
            commRtSurplus: 0,
            condition: '',
            createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: "ETC",
            deductibles: null,
            deductiblesList: [],
            endorsments: null,
            optionId: null,
            optionRt: 0,
            updateDate: [2019, 2, 22, 0, 0, 0, 0],
            updateUser: "ETC",
        },
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 1,
        keys: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac'],
        uneditable: [true,false,false,false,false,false],
        genericBtn:"Renumber"
    }

    optionsDeductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount'],
        dataTypes: ['text','text', 'text', 'percent','currency'],
        keys: ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        //widths: [60,'auto',100,'auto'],
        nData:{
            createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: "ETC",
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: "ETC",
            sumInsured: 0,
            endtCd: 0,
            coverCd:0,
            showMG: 1
        },
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        // paginateFlag: true,
        // infoFlag: true,
        searchFlag: true,
        pageID: 2,
        uneditable: [true,true],
        magnifyingGlass: ['deductibleCd'],
        disableAdd : true
    }

    coversDeductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount'],
        dataTypes: ['text','text', 'text', 'percent','currency'],
        keys: ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        //widths: [60,'auto',100,'auto'],
        nData:{
            createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: "ETC",
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: "ETC",
            sumInsured: 0,
            endtCd: 0,
            showMG: 1
        },
        pageLength: 5,
        checkFlag: true,
        // paginateFlag: true,
        // infoFlag: true,
        searchFlag: true,
        pageID: 6,
        uneditable: [true,true],
        magnifyingGlass: ['deductibleCd'],
        addFlag: true,
        deleteFlag: true,
        disableAdd : true,
        showMG: 1
    }

    otherRatesData: any = {
        tableData: [],
        tHeader: ['Section','Bullet No','Cover Code Name', 'Sum Insured','Change Tag', 'Rate(%)'],
        dataTypes: ['text', 'text', 'text', 'currency','checkbox','percent'],
        pageLength: 'unli-5',  
        pageID: 3,
        keys: ['section','bulletNo','coverCdDesc','amount','changeTag','rate'],
        //widths: [1,1,'auto',140,1,140],
        uneditable: [true,true,true,true],
        searchFlag: true,
    }

    deductiblesLOVRow : number;

    record: any[];
    dialogMessage: string = "Successfuly saved changes to ";
    dialogIcon:string;
    cancelFlag:boolean;
    showModal: boolean = false;
    defaultSectionCvrs:any[] = [];
    selectedOption : any = null;
    selectedCover : any =null;
    fromCovers: boolean = false;

    constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,
                private modalService: NgbModal, private uwService: UnderwritingService, private mtnService: MaintenanceService) { }

    ngOnInit() {
      //neco
         if(this.inquiryFlag){
           this.optionsData.opts = [];
           this.optionsData.uneditable = [];
           this.optionsData.magnifyingGlass = [];
           this.optionsData.addFlag = false;
           this.optionsData.deleteFlag = false;

           this.optionsDeductiblesData.opts = [];
           this.optionsDeductiblesData.uneditable = [];
           this.optionsDeductiblesData.magnifyingGlass = [];
           this.optionsDeductiblesData.addFlag = false;
           this.optionsDeductiblesData.deleteFlag = false;

           this.coversDeductiblesData.opts = [];
           this.coversDeductiblesData.uneditable = [];
           this.coversDeductiblesData.magnifyingGlass = [];
           this.coversDeductiblesData.addFlag = false;
           this.coversDeductiblesData.deleteFlag = false;

           this.otherRatesData.opts = [];
           this.otherRatesData.uneditable = [];
           this.otherRatesData.magnifyingGlass = [];
           this.otherRatesData.addFlag = false;
           this.otherRatesData.deleteFlag = false;

           for(var count = 0; count < this.optionsData.tHeader.length; count++){
             this.optionsData.uneditable.push(true);
           }

           for(var count = 0; count < this.coversDeductiblesData.tHeader.length; count++){
             this.coversDeductiblesData.uneditable.push(true);
           }

           for(var count = 0; count < this.optionsDeductiblesData.tHeader.length; count++){
             this.optionsDeductiblesData.uneditable.push(true);
           }

           for(var count = 0; count < this.otherRatesData.tHeader.length; count++){
             this.otherRatesData.uneditable.push(true);
           }

         }
         //neco end

      // setTimeout(() => {
      //   $('#deductibleTable button').attr("disabled","disabled");
      //         }, 0);
        this.titleService.setTitle("Quo | Quote Option");
        this.quotationNum = this.quotationInfo.quotationNo;
        this.riskName = this.quotationInfo.riskName;
        this.insured = this.quotationInfo.insuredDesc;
        this.quoteId = this.quotationInfo.quoteId;
        this.quoteNoData = this.quotationInfo.quotationNo;
        this.getQuoteOptions();
        this.quotationService.getCoverageInfo('',this.quoteId).subscribe((data: any) => {
          if(data.quotation.project!==null){
            this.defaultSectionCvrs = data.quotation.project.coverage.sectionCovers.filter((a)=>{
              a.amount = a.sumInsured;
              a.coverCdDesc = a.coverCdAbbr;
              a.changeTag = 'N';
              a.rate = data.optionRt;
              a.edited = true;
              a.createDate = new Date().toISOString();
              a.updateDate = new Date().toISOString();
              a.rate = 0;
              a.deductiblesList = [];
              return true;
            });;
            this.optionsData.nData.otherRatesList = data.quotation.project.coverage.sectionCovers;
          }
        })
        this.getRates();

    }

    getQuoteOptions(){
        this.quotationService.getQuoteOptions(this.quoteId,'').subscribe(data => {
           if (data['quotation'] == null || data['quotation'] == undefined ){ 
           } else {
               var optionRecords = data['quotation'].optionsList;
                this.optionsData.tableData = data['quotation'].optionsList.sort(function(a,b){return a.optionId-b.optionId})
                this.coversDeductiblesData.tableData = [];
                this.optionsDeductiblesData.tableData = [];
                // this.optionsTable.indvSelect = this.optionsData.tableData[0];
                this.optionsTable.onRowClick(null,this.optionsData.tableData[0]);
                for(let rec of optionRecords){
                    for(let r of rec.deductiblesList){
                        r.optionId = rec.optionId;
                    }     
                }
                this.updateCovers();
           }
           this.table.forEach(table => { table.refreshTable() });
           let alopFlag = false;
           if(data['quotation'] !== null)
           first:for(let option of data['quotation'].optionsList){
             for(let otherRate of option.otherRatesList){
               if(otherRate.section == 'III'){
                 alopFlag = true;
                 break first;
               }
             }
           }
           this.showAlop.emit(alopFlag);
        });

    } 

    plainQuotationNo(data: string) {
        var arr = data.split('-');
        return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
    }

    // updateDeductibles(data) {
    //     if(data==null || data.optionId==null){
    //       this.deductiblesData.tableData = [];
    //       this.deductibleTable.refreshTable();
    //     }else if (data.deductiblesList != null || data.deductiblesList != undefined ){
    //       this.deductiblesData.nData.optionId = data.optionId;
    //       this.deductiblesData.tableData = data.deleted? []:data.deductiblesList;
    //       this.deductibleTable.refreshTable();
    //     }
    // }

// saveQuoteDeductibles(){
//   let params: any = {
//        quoteId:this.quoteId,
//        optionId: this.selectedOption.optionId,
//        saveDeductibleList:[],
//        deleteDeductibleList:[]
       
//    }
//     for (var i = 0 ; this.deductiblesData.tableData.length > i; i++) {
//         if(this.deductiblesData.tableData[i].edited && !this.deductiblesData.tableData[i].deleted ) {
//             params.saveDeductibleList.push(this.deductiblesData.tableData[i]);
//             params.saveDeductibleList[params.saveDeductibleList.length-1].createDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[2]).toISOString();
//             params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[2]).toISOString();
//         } else if(this.deductiblesData.tableData[i].edited && this.deductiblesData.tableData[i].deleted){
//           params.deleteDeductibleList.push(this.deductiblesData.tableData[i]);
//           params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[2]).toISOString();
//           params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[2]).toISOString();
//         }
//       }
//      this.quotationService.saveQuoteDeductibles(JSON.stringify(params)).subscribe((data: any) => {
//         if(data['returnCode'] == 0) {  
//             this.dialogMessage = data['errorList'][0].errorMessage;
//             this.dialogIcon = "error";
//             $('#quote-option #successModalBtn').trigger('click');
//         }else if(data['returnCode'] == -1){
//             this.dialogMessage="";
//             this.dialogIcon = "";
//             $('#quote-option #successModalBtn').trigger('click');
//             this.deductibleTable.markAsPristine();
//             this.showDeductiblesOptions(this.fromCovers ? this.selectedCover :this.selectedOption, this.fromCovers ? '':undefined);
//        }
//      });
//    }


clickDeductiblesLOV(data,from){
    this.passLOVData.from = from
    this.passLOVData.selector = 'deductibles';
    this.passLOVData.lineCd = this.quotationNum.substring(0,3);
    this.passLOVData.hide = from == 'cover' ?
      this.coversDeductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd):
      this.optionsDeductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
    this.passLOVData.params = {
      coverCd : from == 'cover' ? this.selectedCover.coverCd:'0',
      endtCd: '0',
      activeTag:'Y'
    }
    $('#lov #modalBtn2').trigger('click');
    this.deductiblesLOVRow = data.index;
}

setSelected(data){

  console.log(data)
  if(data.from == 'cover'){
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].deductibleTitle = data.data[0].deductibleTitle;
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].deductibleRt = data.data[0].deductibleRate;
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].deductibleAmt = data.data[0].deductibleAmt;
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].deductibleTxt = data.data[0].deductibleText;
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].edited = true;
    // this.coversDeductiblesData.tableData.push(JSON.parse(JSON.stringify(this.coversDeductiblesData.tableData[this.deductiblesLOVRow])));
    // this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length - 1].deductibleCd = data.data[0].deductibleCd;
    // this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length - 1].showMG = 0;
    // this.coversDeductiblesData.tableData[this.deductiblesLOVRow].deleted = true;
    this.coversDeductiblesData.tableData = this.coversDeductiblesData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i<data.data.length;i++){
      this.coversDeductiblesData.tableData.push(JSON.parse(JSON.stringify(this.coversDeductiblesData.nData)));
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].edited = true;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
      this.coversDeductiblesData.tableData[this.coversDeductiblesData.tableData.length - 1].showMG = 0;
    }
    this.selectedCover.deductiblesList = this.coversDeductiblesData.tableData;
    this.covDeductibleTable.refreshTable();
    this.covDeductibleTable.markAsDirty();
  }
  else if(data.from == 'option'){
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].deductibleTitle = data.data[0].deductibleTitle;
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].deductibleRt = data.data[0].deductibleRate;
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].deductibleAmt = data.data[0].deductibleAmt;
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].deductibleTxt = data.data[0].deductibleText;
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].edited = true;
    // this.optionsDeductiblesData.tableData.push(JSON.parse(JSON.stringify(this.optionsDeductiblesData.tableData[this.deductiblesLOVRow])));
    // this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length - 1].deductibleCd = data.data[0].deductibleCd;
    // this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length - 1].showMG = 0;
    // this.optionsDeductiblesData.tableData[this.deductiblesLOVRow].deleted = true;
    this.optionsDeductiblesData.tableData = this.optionsDeductiblesData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i<data.data.length;i++){
      console.log(data.data[i])
      this.optionsDeductiblesData.tableData.push(JSON.parse(JSON.stringify(this.optionsDeductiblesData.nData)));
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].edited = true;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
      this.optionsDeductiblesData.tableData[this.optionsDeductiblesData.tableData.length - 1].showMG = 0;
    }
    this.selectedOption.deductiblesList = this.optionsDeductiblesData.tableData;
    this.optDeductibleTable.refreshTable();
    this.optDeductibleTable.markAsDirty();
  }
 
}

selectedCoverCodeLOV(data){
    this.otherRatesData.tableData[this.coverCodeLOVRow].coverCd = data.coverCode; 
    this.otherRatesData.tableData[this.coverCodeLOVRow].coverCdDesc = data.description; 
}

onClickSave(){
  $('#options #confirm-save #modalBtn2').trigger('click');
}

cancel(){
    this.cancelBtn.clickCancel();
}

saveQuoteOptionAll(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
   let params: any = {
       quoteId:this.quoteId,
       saveQuoteOptionsList:[],
       deleteQuoteOptionsList:[],
       saveDeductibleList:[],
       deleteDeductibleList:[],
       otherRates:[],
       // deleteOtherRates:[]
       newQuoteOptionsList:[]
   }

   for (var i = 0 ; this.optionsData.tableData.length > i; i++) {
      if(this.optionsData.tableData[i].edited && !this.optionsData.tableData[i].deleted && this.optionsData.tableData[i].optionId !== null) {
        params.saveQuoteOptionsList.push(this.optionsData.tableData[i]);
        params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].createDate = new Date(params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].createDate[0],params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].createDate[1]-1,params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].createDate[2]).toISOString();
        params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].updateDate = new Date(params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].updateDate[0],params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].updateDate[1]-1,params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].updateDate[2]).toISOString();
      } else if(this.optionsData.tableData[i].edited && this.optionsData.tableData[i].deleted && this.optionsData.tableData[i].optionId !== null){
        params.deleteQuoteOptionsList.push(this.optionsData.tableData[i]);
        params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].otherRatesList = [];
        params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].createDate = new Date(params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].createDate[0],params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].createDate[1]-1,params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].createDate[2]).toISOString();
        params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].updateDate = new Date(params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].updateDate[0],params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].updateDate[1]-1,params.deleteQuoteOptionsList[params.deleteQuoteOptionsList.length-1].updateDate[2]).toISOString();
      }else if(this.optionsData.tableData[i].edited && !this.optionsData.tableData[i].deleted && this.optionsData.tableData[i].optionId == null){
        params.newQuoteOptionsList.push(this.optionsData.tableData[i]);
        params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].createDate = new Date(params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].createDate[0],params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].createDate[1]-1,params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].createDate[2]).toISOString();
        params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].updateDate = new Date(params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].updateDate[0],params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].updateDate[1]-1,params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].updateDate[2]).toISOString();
      }
    }

   for(let rec of this.optionsData.tableData){
     if(rec.optionId !== null && !rec.deleted)
       for (var i = 0 ; rec.otherRatesList.length > i; i++){
            rec.otherRatesList[i].createDate = new Date(rec.otherRatesList[i].createDate[0],rec.otherRatesList[i].createDate[1]-1,rec.otherRatesList[i].createDate[2]).toISOString();
            rec.otherRatesList[i].updateDate = new Date(rec.otherRatesList[i].updateDate[0],rec.otherRatesList[i].updateDate[1]-1,rec.otherRatesList[i].updateDate[2]).toISOString();
         if(rec.otherRatesList[i].edited && !rec.otherRatesList[i].deleted ) {          
            params.otherRates.push(rec.otherRatesList[i]);
            params.otherRates[params.otherRates.length-1].optionId = rec.optionId;
        }
        for(let ded of rec.otherRatesList[i].deductiblesList){
          ded.createDate = new Date(ded.createDate[0],ded.createDate[1]-1,ded.createDate[2]).toISOString();
          ded.updateDate = new Date(ded.updateDate[0],ded.updateDate[1]-1,ded.updateDate[2]).toISOString();
          ded.optionId = rec.optionId;
          if(ded.edited && !ded.deleted){
            params.saveDeductibleList.push(ded);
          }else if(ded.deleted){
            params.deleteDeductibleList.push(ded);
          }
        }
      } 
      for(let ded of rec.deductiblesList){
          ded.createDate = new Date(ded.createDate[0],ded.createDate[1]-1,ded.createDate[2]).toISOString();
          ded.updateDate = new Date(ded.updateDate[0],ded.updateDate[1]-1,ded.updateDate[2]).toISOString();
          ded.optionId = rec.optionId;
          if(ded.edited && !ded.deleted && rec.optionId !== null && !rec.deleted && ded.deductibleCd !== null){
            params.saveDeductibleList.push(ded);
          }else if(ded.deleted && rec.optionId !== null && !rec.deleted){
            params.deleteDeductibleList.push(ded);
          }
        }
   }
   console.log(this.optionsData.tableData)
   this.quotationService.saveQuoteOptionAll(params).subscribe((data)=>{
     if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#quote-option #successModalBtn').trigger('click');
          } else{
            this.dialogMessage="";
            this.dialogIcon = "";
            $('#quote-option #successModalBtn').trigger('click');
            this.enblEndtTab.emit(true);
            this.getQuoteOptions();
            this.table.forEach(table => { table.markAsPristine() });
          }
   })

  }

  updateSectionCvrs(data){
      this.selectedOption = data;
      if(data == null){
        this.otherRatesData.tableData = [];
        this.optionsDeductiblesData.disableAdd = true;
        this.otherRatesTable.refreshTable();
      }else if(data.otherRatesList==null || data.otherRatesList===undefined || data.otherRatesList.length == 0){
        this.optionsDeductiblesData.disableAdd = false;
        data.otherRatesList = JSON.parse(JSON.stringify(this.defaultSectionCvrs));
        this.otherRatesData.tableData = data.otherRatesList.filter((a)=>{
          a.amount = a.sumInsured;
          a.coverCdDesc = a.coverCdAbbr;
          a.changeTag = 'N';
          a.rate = data.optionRt;
          a.edited = true;
          a.createDate = new Date().toISOString();
          a.updateDate = new Date().toISOString();
          return true;
        });
        this.updateCovers();
        this.otherRatesTable.refreshTable();
      }else if (data.otherRatesList != null || data.otherRatesList != undefined ){
        this.optionsDeductiblesData.disableAdd = false;
        this.selectedOption = data;
        this.otherRatesData.tableData = data.deleted? []:data.otherRatesList;
        this.updateCovers();
        this.otherRatesTable.refreshTable();
    }
  }


  updateCovers(){
    if(this.quotationInfo.cessionId == 2 && this.optionsData.tableData.filter(a=>!a.deleted).length > 1){
      this.optionsData.tableData.pop();
      this.optionsTable.refreshTable();
    }
    for(let data of this.otherRatesData.tableData){

      if(data.uneditable === undefined){
        data.uneditable = [];
      }
      if(data.changeTag == 'Y'){
        data.uneditable.pop();
      }else if(data.changeTag == 'N' ) {
        data.rate = this.selectedOption.optionRt;
        if(data.uneditable.length ==0)
          data.uneditable.push('rate');
      }
      if(data.amount == 0){
        data.rate = 0;
      }
    }
    if(this.quotationInfo.cessionId == 2 && this.optionsData.tableData.filter(a=>!a.deleted).length==1)
      this.optionsData.disableAdd = true;
    else{
      this.optionsData.disableAdd = false;
    }
  }

  // showDeductiblesOptions(data,fromCovers?){
    
    
  //   this.fromCovers = fromCovers !== undefined;

  //   if(this.fromCovers){
  //       this.deductiblesData.tHeader = ['Deductible Code','Deductible Title', 'Sum Insured', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount'];
  //       this.deductiblesData.dataTypes = ['text','text', 'currency', 'text', 'percent','currency'];
  //       this.deductiblesData.keys = ['deductibleCd','deductibleTitle','sumInsured','deductibleTxt','deductibleRt','deductibleAmt'];
  //       this.deductiblesData.uneditable = [true,true,true];
  //       this.deductiblesData.widths = [60,'auto',120,'auto',120,120];
  //   }else{
  //       this.deductiblesData.tHeader = ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount'];
  //       this.deductiblesData.dataTypes = ['text','text', 'text', 'percent','currency'];
  //       this.deductiblesData.keys = ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'];
  //       this.deductiblesData.widths = [60,'auto','auto',120,120];
  //       this.deductiblesData.uneditable = [true,true,false];
  //   }
    
    
  //   if(this.deductibleTable!==undefined){
  //     this.deductibleTable.loadingFlag = true;
  //     let params:any ={
  //         quoteId:this.quoteId,
  //         optionId:this.selectedOption.optionId,
  //         coverCd: data.coverCd === undefined ? 0 : data.coverCd,
  //         quotationNo: '',
  //         endtCd: 0
  //       };
  //     this.quotationService.getDeductibles(params).subscribe((data)=>{
  //         if(data['quotation'].optionsList != null){
  //           this.deductiblesData.tableData = data['quotation'].optionsList[0].deductiblesList.filter((a)=>{
  //               a.sumInsured = this.fromCovers ? this.selectedCover.amount : null;
  //               return true;
  //             });
  //           this.deductibleTable.refreshTable();
  //         }
  //         else
  //           this.getDefaultDeductibles();
  //       });
  //   }else{
  //     if((this.fromCovers && this.selectedCover!==null) || (!this.fromCovers && this.selectedOption!==null)){
  //       this.showModal = true;
  //       setTimeout(()=>{
  //         this.deductiblesModal.openNoClose();
  //       },0)

  //       if(!this.fromCovers){
  //         this.deductiblesData.nData.coverCd = 0;
  //       }else{
  //         this.deductiblesData.nData.coverCd = data.coverCd;
  //       }
  //       let params:any ={
  //         quoteId:this.quoteId,
  //         optionId:this.selectedOption.optionId,
  //         coverCd: data.coverCd === undefined ? 0 : data.coverCd,
  //         quotationNo: '',
  //         endtCd: 0
  //       };
  //       this.quotationService.getDeductibles(params).subscribe((data)=>{
  //         if(data['quotation'].optionsList != null){
  //           this.deductiblesData.tableData = data['quotation'].optionsList[0].deductiblesList.filter((a)=>{
  //               a.sumInsured = this.fromCovers ? this.selectedCover.amount : null;
  //               return true;
  //             });
  //           this.deductibleTable.refreshTable();
  //         }
  //         else
  //           this.getDefaultDeductibles();
  //       });
  //   }
  //   }
    
  // }

  onClickSaveDeductibles(){
    $('#deductibles #confirm-save #modalBtn2').trigger('click');
  }

  getDefaultDeductibles(tableData,table,list){
    this.uwService.getMaintenanceDeductibles(this.quotationNum.substring(0,3),'',
        tableData.nData.coverCd == undefined ? '0' : tableData.nData.coverCd,'0','Y','Y').subscribe((data)=>{
          list.deductiblesList = data['deductibles'].filter((a)=>{
            a.sumInsured = this.fromCovers ? this.selectedCover.amount : null;
            a.coverCd = tableData.nData.coverCd;
            a.deductibleTxt = a.deductibleText;
            a.deductibleRt = a.deductibleRate;
            a.endtCd = 0;
            a.edited = true;
            return true;
          })
          tableData.tableData = list.deductiblesList;
          table.refreshTable();
          table.markAsDirty();
        })
  }

  getRates(){
    this.mtnService.getMtnTreaty().subscribe((data)=>{
      this.optionsData.nData.commRtQuota = data['treatyList'].filter(a=>a.treatyType=='Q')[0].comRate;
      this.optionsData.nData.commRtFac = data['treatyList'].filter(a=>a.treatyType=='F')[0].comRate;
      this.optionsData.nData.commRtSurplus = 0;
      for(let treaty of data['treatyList'].filter(a=>a.treatyType=='S')){
        this.optionsData.nData.commRtSurplus+=parseFloat(treaty.comRate)
      }
      this.optionsData.nData.commRtSurplus =this.optionsData.nData.commRtSurplus/ data['treatyList'].filter(a=>a.treatyType=='S').length
    })
  }

  updateCovDed(data){
    if(data != null){
      this.coversDeductiblesData.nData.coverCd = data.coverCd;
      this.coversDeductiblesData.disableAdd = false
    }
    else
      this.coversDeductiblesData.disableAdd = true

    if(data == null)
      this.coversDeductiblesData.tableData  = [];
    else if( data.deductiblesList.length ==0){
      this.getDefaultDeductibles(this.coversDeductiblesData,this.covDeductibleTable,data);
    }else
      this.coversDeductiblesData.tableData  = data.deductiblesList;
    this.covDeductibleTable.refreshTable();
  }

  updateOptDed(data){
    if(data == null)
      this.optionsDeductiblesData.tableData  = [];
    else if(data.deductiblesList.length ==0){
      this.getDefaultDeductibles(this.optionsDeductiblesData,this.optDeductibleTable,data);
    }else
      this.optionsDeductiblesData.tableData  = data.deductiblesList;
    this.optDeductibleTable.refreshTable();
  }

  renumber(){
    this.optionsTable.loadingFlag = true;
    this.quotationService.renumber(this.quoteId).subscribe((data)=>{
      this.getQuoteOptions();
    })
  }

}
