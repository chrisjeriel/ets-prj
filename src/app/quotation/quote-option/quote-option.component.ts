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
    riskId:string;
    projId:string;

    @Output() enblEndtTab = new EventEmitter<any>();

    optionsData: any = {
        tableData: [],
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        //tabIndexes: [false,true,false,true,true,true],
        dataTypes: ['number', 'percent', 'text', 'percent', 'percent', 'percent'],
        magnifyingGlass: ['conditions'],
        nData: {
            commRtFac: 0,
            commRtQuota: 0,
            commRtSurplus: 0,
            condition: '',
            createDate: [2019, 2, 21, 0, 0, 0, 0],
            createUser: JSON.parse(window.localStorage.currentUser).username,
            deductibles: null,
            // deductiblesList: [],
            endorsments: null,
            optionId: null,
            optionRt: 0,
            updateDate: [2019, 2, 22, 0, 0, 0, 0],
            updateUser: JSON.parse(window.localStorage.currentUser).username,
            edited: true
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
            createUser: JSON.parse(window.localStorage.currentUser).username,
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: JSON.parse(window.localStorage.currentUser).username,
            sumInsured: 0,
            endtCd: 0,
            coverCd:0,
            showMG: 1,
        },
        pageLength: 5,
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
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
            createUser: JSON.parse(window.localStorage.currentUser).username,
            deductibleAmt: null,
            deductibleCd: null,
            deductibleRt: null,
            deductibleTitle: null,
            deductibleTxt: null,
            optionId: null,
            updateDate: [2019, 2, 21, 0, 0, 0, 0],
            updateUser: JSON.parse(window.localStorage.currentUser).username,
            sumInsured: 0,
            endtCd: 0,
            showMG: 1,
        },
        pageLength: 10,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
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
           delete this.optionsData.genericBtn;
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
              a.coverCdDesc = a.coverName;
              a.changeTag = 'N';
              a.rate = data.optionRt;
              a.edited = true;
              a.createDate = new Date().toISOString();
              a.updateDate = new Date().toISOString();
              a.rate = 0;
              a.updateUser = JSON.parse(window.localStorage.currentUser).username;
              a.createUser = JSON.parse(window.localStorage.currentUser).username;
              this.uwService.getMaintenanceDeductibles(this.quotationNum.substring(0,3),'',
                a.coverCd ,'0','Y','Y').subscribe((data)=>{
                  a.deductiblesList = data['deductibles'].filter((b)=>{
                    b.coverCd = a.coverCd;
                    b.deductibleTxt = b.deductibleText;
                    b.deductibleRt = b.deductibleRate;
                    b.endtCd = 0;
                    b.edited = true;
                    b.createDate = [0,0,0,0];
                    b.updateDate = [0,0,0,0];
                    b.createUser = JSON.parse(window.localStorage.currentUser).username;
                    b.updateUser = JSON.parse(window.localStorage.currentUser).username;
                    b.add = true;
                    return true;
                  })
                })
              return true;
            });;
            this.optionsData.nData.otherRatesList = data.quotation.project.coverage.sectionCovers;
          }
        })

        this.uwService.getMaintenanceDeductibles(this.quotationNum.substring(0,3),'',
          '0' ,'0','Y','Y').subscribe((data)=>{
            this.optionsData.nData.deductiblesList = data['deductibles'].filter((a)=>{
              a.sumInsured = this.fromCovers ? this.selectedCover.amount : null;
              a.coverCd = '0';
              a.deductibleTxt = a.deductibleText;
              a.deductibleRt = a.deductibleRate;
              a.endtCd = 0;
              a.edited = true;
              a.createDate = [0,0,0,0];
              a.updateDate = [0,0,0,0];
              a.createUser = JSON.parse(window.localStorage.currentUser).username;
              a.updateUser = JSON.parse(window.localStorage.currentUser).username;
              a.add = true;
              return true;
            })
        })


        this.getRates();

    }

    getQuoteOptions(){
        this.quotationService.getQuoteOptions(this.quoteId,'').subscribe(data => {
          this.riskId = data['quotation'].project.riskId;
          this.projId = data['quotation'].project.projId;
           if (data['quotation'].optionsList.length == 0 ){ 
             
           } else {

                this.riskId = data['quotation'].project.riskId;
                this.projId = data['quotation'].project.projId;
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
    setTimeout(() => {
      $('#lov #modalBtn2').trigger('click');
    });
    this.deductiblesLOVRow = data.index;
}

setSelected(data){
  if(data.from == 'cover'){
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
    this.optionsDeductiblesData.tableData = this.optionsDeductiblesData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i<data.data.length;i++){
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
   if(this.optionsData.tableData.filter(a=>(a.optionRt == 0 ||
        a.commRtQuota == 0 ||
        a.commRtSurplus == 0 ||
        a.commRtFac == 0) && !a.deleted
      ).length != 0){
     this.dialogIcon = "error";
     setTimeout(a=>$('#quote-option #successModalBtn').trigger('click'),0);
     return;
   }
   let params: any = {
       quoteId:this.quoteId,
       projId:this.projId,
       riskId:this.riskId,
       user: JSON.parse(window.localStorage.currentUser).username,
       saveQuoteOptionsList:[],
       deleteQuoteOptionsList:[],
       saveDeductibleList:[],
       deleteDeductibleList:[],
       otherRates:[],
       // deleteOtherRates:[]
       newQuoteOptionsList:[]
   }

   

   for(let rec of this.optionsData.tableData){
     if(rec.optionId !== null && !rec.deleted)
       for (var i = 0 ; rec.otherRatesList.length > i; i++){
            rec.otherRatesList[i].updateUser = JSON.parse(window.localStorage.currentUser).username;
            rec.otherRatesList[i].createDate = new Date(rec.otherRatesList[i].createDate[0],rec.otherRatesList[i].createDate[1]-1,rec.otherRatesList[i].createDate[2]).toISOString();
            rec.otherRatesList[i].updateDate = new Date(rec.otherRatesList[i].updateDate[0],rec.otherRatesList[i].updateDate[1]-1,rec.otherRatesList[i].updateDate[2]).toISOString();
         if(rec.otherRatesList[i].edited && !rec.otherRatesList[i].deleted ) {          
            params.otherRates.push(rec.otherRatesList[i]);
            params.otherRates[params.otherRates.length-1].optionId = rec.optionId;
        }
        for(let ded of rec.otherRatesList[i].deductiblesList){
          ded.updateUser = JSON.parse(window.localStorage.currentUser).username;
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
          ded.updateUser = JSON.parse(window.localStorage.currentUser).username;
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

   for (var i = 0 ; this.optionsData.tableData.length > i; i++) {
      if(this.optionsData.tableData[i].edited && !this.optionsData.tableData[i].deleted && this.optionsData.tableData[i].optionId !== null) {
        params.saveQuoteOptionsList.push(this.optionsData.tableData[i]);
        params.saveQuoteOptionsList[params.saveQuoteOptionsList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username
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
        for(let oth of  params.newQuoteOptionsList[params.newQuoteOptionsList.length-1].otherRatesList){
          if(oth.deductiblesList !== undefined){
            for(let ded of oth.deductiblesList){
              ded.createDate = new Date().toISOString();
              ded.updateDate = new Date().toISOString();
            }
          }else{
            oth.deductiblesList = [];
          }
        }
      }
    }
    if(
        params.saveQuoteOptionsList.length == 0 &&
        params.deleteQuoteOptionsList.length == 0 &&
        params.saveDeductibleList.length == 0 &&
        params.deleteDeductibleList.length == 0 &&
        params.otherRates.length == 0 &&
        params.newQuoteOptionsList.length == 0
      ){
      this.dialogIcon = "info";
      this.dialogMessage = "Nothing to save."
      setTimeout(a=>$('#quote-option #successModalBtn').trigger('click'),0);
      return null;
    }


    for(let ded of params.saveDeductibleList){
      if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
        this.dialogIcon = "error";
        setTimeout(a=>$('#quote-option #successModalBtn').trigger('click'),0);
        return null;
      }
    }

    for(let opt of params.newQuoteOptionsList){
      for(let ded of opt.deductiblesList){
        if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
          this.dialogIcon = "error";
          setTimeout(a=>$('#quote-option #successModalBtn').trigger('click'),0);
          return null;
        }
      }
      for(let oth of opt.otherRatesList){
        for(let ded of oth.deductiblesList){
          if((isNaN(ded.deductibleRt) || ded.deductibleRt=="" || ded.deductibleRt==null) && (isNaN(ded.deductibleAmt) || ded.deductibleAmt=="" || ded.deductibleAmt==null)){
            this.dialogIcon = "error";
            setTimeout(a=>$('#quote-option #successModalBtn').trigger('click'),0);
            return null;
          }
        }
      }

    }
    

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
    let lc = this.quotationNum.substring(0,3);
    for(let data of this.otherRatesData.tableData){

      if(data.uneditable === undefined){
        data.uneditable = [];
      }
      if(data.changeTag == 'Y'){
        data.uneditable.pop();
      }else if(data.changeTag == 'N' && data.amount !== 0 
        && ((['CAR','EAR'].some(a=>lc==a) && data.section != 'II') 
          || lc == 'EEI' 
          || (['CAR','EAR','EEI'].every(a=>a!=lc) && data.section == 'I' ) 
          )) {
        if(data.rate != this.selectedOption.optionRt)
          data.edited = true;
        data.rate = this.selectedOption.optionRt;
        if(data.uneditable.length ==0)
          data.uneditable.push('rate');
      }else if(data.changeTag == 'N' && data.amount !== 0 && data.section == 'II'){
        if(data.rate != this.selectedOption.optionRt)
          data.edited = true;
        data.rate = 0;
        if(data.uneditable.length ==0)
          data.uneditable.push('rate');
      }else if(data.amount == 0){
        data.rate = 0;
      }
    }
    if(this.quotationInfo.cessionId == 2 && this.optionsData.tableData.filter(a=>!a.deleted).length==1)
      this.optionsData.disableAdd = true;
    else{
      this.optionsData.disableAdd = false;
    }
    this.otherRatesTable.onRowClick(null,null);
  }

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
            a.createUser = JSON.parse(window.localStorage.currentUser).username;
            a.updateUser = JSON.parse(window.localStorage.currentUser).username;
            a.add = true;
            return true;
          })
          tableData.tableData = list.deductiblesList;
          table.refreshTable();
          table.markAsDirty();
        })
  }

  getRates(){
    this.mtnService.getMtnTreatyCommission(parseInt(this.quoteNoData.split('-')[1])).subscribe((data)=>{
      console.log(data);
      this.optionsData.nData.commRtQuota = data['treatyList'].filter(a=>a.treatyType=='Q')[0].commRate;
      this.optionsData.nData.commRtFac = data['treatyList'].filter(a=>a.treatyType=='F')[0].commRate;
      this.optionsData.nData.commRtSurplus = 0;
      for(let treaty of data['treatyList'].filter(a=>a.treatyType=='S')){
        this.optionsData.nData.commRtSurplus+=parseFloat(treaty.commRate)
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
      this.coversDeductiblesData.disableAdd = true;

    //NECO 05/23/2019  --Purpose: to disabled add button to covers deductible when there is no highlighted section cover
    if(data !== null && data === ''){
      console.log('yeet');
      this.coversDeductiblesData.disableAdd = true;
    }
    //END NECO 05/23/2019

    if(data == null || data ==  '')
      this.coversDeductiblesData.tableData  = [];
    else if( data.deductiblesList == undefined){
      this.getDefaultDeductibles(this.coversDeductiblesData,this.covDeductibleTable,data);
    }else
      this.coversDeductiblesData.tableData  = data.deductiblesList;
    this.covDeductibleTable.refreshTable();
  }

  updateOptDed(data){
    if(data == null)
      this.optionsDeductiblesData.tableData  = [];
    else if(data.deductiblesList == undefined){
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
