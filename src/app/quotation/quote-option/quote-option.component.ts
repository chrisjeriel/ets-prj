import { Component, OnInit, ViewChildren, QueryList, Input, ViewChild} from '@angular/core';
import { QuotationInfo, QuotationOption, QuotationOtherRates, QuotationDeductibles } from '../../_models';
import { QuotationService } from '../../_services';
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
    @ViewChild("deductibleTable") deductibleTable: CustEditableNonDatatableComponent;
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
        pageLength: 3,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 1,
        keys: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac'],
        uneditable: [true,false,false,false,false,false],
        genericBtn: 'Deductibles'
    }

    deductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code','Deductible Title', 'Deductible Text', 'Deductible Rate(%)', 'Deductible Amount', 'Sum Insured'],
        dataTypes: ['text','text', 'text', 'percent', 'currency','currency'],
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
            endtCd: 0
        },
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
        keys: ['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt','sumInsured'],
        widths: [60,'auto',100,120,'auto'],
        uneditable: [true,true,true,true],
        magnifyingGlass: ['deductibleCd']
    }

    otherRatesData: any = {
        tableData: [],
        tHeader: ['Section','Bullet No','Cover Code Name', 'Sum Insured','Change Tag', 'Rate(%)'],
        dataTypes: ['text', 'text', 'text', 'currency','checkbox','percent'],
        genericBtn: 'Deductibles',
        pageLength: 'unli-1',
        pageID: 3,
        keys: ['section','bulletNo','coverCdDesc','amount','changeTag','rate'],
        widths: [1,1,'auto',140,1,140],
        uneditable: [true,true,true,true]
    }

    deductiblesLOVRow : number;

    record: any[];
    dialogMessage: string = "Successfuly saved changes to ";
    dialogIcon:string;
    cancelFlag:boolean;
    showModal: boolean = false;
    defaultSectionCvrs:any[] = [];
    selectedOption : any = {};
    selectedCover : any ={};
    fromCovers: boolean = false;

    constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal) { }

    ngOnInit() {
      //neco
         if(this.inquiryFlag){
           this.optionsData.opts = [];
           this.optionsData.uneditable = [];
           this.optionsData.magnifyingGlass = [];
           this.optionsData.addFlag = false;
           this.optionsData.deleteFlag = false;

           this.deductiblesData.opts = [];
           this.deductiblesData.uneditable = [];
           this.deductiblesData.magnifyingGlass = [];
           this.deductiblesData.addFlag = false;
           this.deductiblesData.deleteFlag = false;

           this.otherRatesData.opts = [];
           this.otherRatesData.uneditable = [];
           this.otherRatesData.magnifyingGlass = [];
           this.otherRatesData.addFlag = false;
           this.otherRatesData.deleteFlag = false;

           for(var count = 0; count < this.optionsData.tHeader.length; count++){
             this.optionsData.uneditable.push(true);
           }

           for(var count = 0; count < this.deductiblesData.tHeader.length; count++){
             this.deductiblesData.uneditable.push(true);
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
        this.quotationService.getCoverageInfo(this.plainQuotationNo(this.quotationNum),this.quoteId).subscribe((data: any) => {
          if(data.quotation.project!==null)
            this.defaultSectionCvrs = data.quotation.project.coverage.sectionCovers;
        })

    }

    getQuoteOptions(){
        this.quotationService.getQuoteOptions(this.quoteId,this.plainQuotationNo(this.quotationNum)).subscribe(data => {
           if (data['quotation'] == null || data['quotation'] == undefined ){ 
           } else {
               var optionRecords = data['quotation'].optionsList;
                this.optionsData.tableData = data['quotation'].optionsList.sort(function(a,b){return a.optionId-b.optionId})
                this.deductiblesData.tableData = [];
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

saveQuoteDeductibles(){
  let params: any = {
       quoteId:this.quoteId,
       optionId: this.selectedOption.optionId,
       saveDeductibleList:[],
       deleteDeductibleList:[]
       
   }
    for (var i = 0 ; this.deductiblesData.tableData.length > i; i++) {
        if(this.deductiblesData.tableData[i].edited && !this.deductiblesData.tableData[i].deleted ) {
            params.saveDeductibleList.push(this.deductiblesData.tableData[i]);
            params.saveDeductibleList[params.saveDeductibleList.length-1].createDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].createDate[2]).toISOString();
            params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate = new Date(params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[0],params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[1]-1,params.saveDeductibleList[params.saveDeductibleList.length-1].updateDate[2]).toISOString();
        } else if(this.deductiblesData.tableData[i].edited && this.deductiblesData.tableData[i].deleted){
          params.deleteDeductibleList.push(this.deductiblesData.tableData[i]);
          params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].createDate[2]).toISOString();
          params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate = new Date(params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[0],params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[1]-1,params.deleteDeductibleList[params.deleteDeductibleList.length-1].updateDate[2]).toISOString();
        }
      }
     this.quotationService.saveQuoteDeductibles(JSON.stringify(params)).subscribe((data: any) => {
        if(data['returnCode'] == 0) {  
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#quote-option #successModalBtn').trigger('click');
        }else if(data['returnCode'] == -1){
            this.dialogMessage="";
            this.dialogIcon = "";
            $('#quote-option #successModalBtn').trigger('click');
            this.deductibleTable.markAsPristine();
            this.showDeductiblesOptions(this.fromCovers ? this.selectedCover :this.selectedOption);
       }
     });
     console.log(params);
   }


clickDeductiblesLOV(data){
    this.passLOVData.selector = 'deductibles';
    this.passLOVData.lineCd = this.quotationNum.substring(0,3);
    this.passLOVData.hide = this.deductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
    $('#lov #modalBtn2').trigger('click');
    this.deductiblesLOVRow = data.index;
}

setSelected(data){
  this.deductibleTable.markAsDirty();
  if(data.selector == "deductibles"){
        this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleCd = data.data.deductibleCd;
        this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleTitle = data.data.deductibleTitle;
        this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleRt = data.data.deductibleRate;
        this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleAmt = data.data.deductibleAmt;
        this.deductiblesData.tableData[this.deductiblesLOVRow].deductibleTxt = data.data.deductibleText;
        this.deductiblesData.tableData[this.deductiblesLOVRow].edited = true;
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
       // saveDeductibleList:[],
       // deleteDeductibleList:[],
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
       }
   }
   console.log(params)
   this.quotationService.saveQuoteOptionAll(params).subscribe((data)=>{
     if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#quote-option #successModalBtn').trigger('click');
          } else{
            this.dialogMessage="";
            this.dialogIcon = "";
            $('#quote-option #successModalBtn').trigger('click');
            this.getQuoteOptions();
            this.table.forEach(table => { table.markAsPristine() });
          }
   })

  }

  updateSectionCvrs(data){
      if(data == null){
        this.otherRatesData.tableData = [];
        this.otherRatesTable.refreshTable();
      }else if(data.otherRatesList==null || data.otherRatesList===undefined || data.otherRatesList.length == 0){
        data.otherRatesList = JSON.parse(JSON.stringify(this.defaultSectionCvrs));
        this.selectedOption = data;
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
        this.selectedOption = data;
        this.otherRatesData.tableData = data.deleted? []:data.otherRatesList;
        this.updateCovers();
        this.otherRatesTable.refreshTable();
    }
  }

  updateCovers(){
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
    }
  }

  showDeductiblesOptions(data){
    if(this.deductibleTable!==undefined){
      this.deductibleTable.loadingFlag = true;
    }else{
      setTimeout(()=>{
        this.deductiblesModal.openNoClose();
      },0)
    }
    this.showModal = true;
    this.fromCovers = data.coverCd !== undefined;
    if(!this.fromCovers){
      this.deductiblesData.nData.coverCd = 0;
    }else{
      this.deductiblesData.nData.coverCd = data.coverCd;
    }
    let params:any ={
      quoteId:this.quoteId,
      optionId:this.selectedOption.optionId,
      coverCd: data.coverCd === undefined ? 0 : data.coverCd,
      quotationNo: ''
    };
    this.quotationService.getDeductibles(params).subscribe((data)=>{
      console.log(data);
      if(data['quotation'].optionsList != null)
        this.deductiblesData.tableData = data['quotation'].optionsList[0].deductiblesList;
      else
        this.deductiblesData.tableData = [];
      this.deductibleTable.refreshTable();
    });
    
  }

  onClickSaveDeductibles(){
    $('#deductibles #confirm-save #modalBtn2').trigger('click');
}

}
