import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent, ModalComponent, CancelButtonComponent } from '@app/_components/common';
import { UnderwritingService, QuotationService, NotesService, MaintenanceService } from '../../../_services';
import { FormsModule }   from '@angular/forms';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';

@Component({
    selector: 'app-pol-create-open-cover',
    templateUrl: './pol-create-open-cover.component.html',
    styleUrls: ['./pol-create-open-cover.component.css']
})
export class PolCreateOpenCoverComponent implements OnInit {
    @ViewChild('polLovMdl') polLovMdl:ModalComponent;
    quoteLine: any;

    passDataLOV: any = {
      tableData: [],
      tHeader:["Quotation No", "Ceding Company", "Insured", "Risk"],  
      sortKeys : ['QUOTATION_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
      dataTypes: ["text","text","text","text"],
      pageLength: 10,
      resizable: [false,false,false,false],
      tableOnly: false,
      keys: ['quotationNo','cedingName','insuredDesc','riskName'],
      pageStatus: true,
      pagination: true,
      filters: [
      {key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
      {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
      {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
      {key: 'riskName',title: 'Risk',dataType: 'text'}],
      pageID: 'lov1'
    }

    searchParams: any = {
        statusArr:['3'],
        'paginationRequest.count':10,
        'paginationRequest.position':1,
        openCoverTag  : 'Y'
    };


    passDataOptionLOV: any = {
      tableData: [],
      tHeader:["Option Id", "Rate"],  
      dataTypes: ["text","percent"],
      pageLength: 10,
      //resizable: [false,false],
      tableOnly: false,
      keys: ['optionId','optionRt'],
      pageStatus: true,
      pagination: true,
      // filters: [
      // {key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
      // {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
      // {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
      // {key: 'riskName',title: 'Risk',dataType: 'text'}],
      pageID: 'optionLov'
    }

    @ViewChild('polLov') quListTable : LoadingTableComponent;
    @ViewChild('optLov') optListTable : CustNonDatatableComponent;
    @ViewChild('myForm') form:any;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

    quotationList: any[] = [];
    splitQuoteNo: string[] = [];
    tempQuoteNo: string[] = ['', '', '', '', ''];
    
    openPolicyInfo: any = {
        policyIdOc: 0,
        openPolNo: ''
    }

    selectedQuote: any = {};
    selectedOpt: any = {};

    quoteData: any = {
        quoteId: 0,
        quoteNo: '',
        cedingName: '',
        insuredDesc: '',
        riskName: ''
    };

    optionData: any = {
        optionId: '',
        condition: ''
    };

    inceptDate: any = {
        date: '',
        time: ''
    }

    expiryDate: any = {
        date: '',
        time: ''
    }

    saveParams: any = {};
    dialogMessage: string = '';
    dialogIcon: string = '';
    cancelFlag: boolean = false;

    currentLineCd: string = '';

    isType: boolean = false;
    isIncomplete: boolean = true;
    noDataFound: boolean = false;
    loading: boolean = false;
    btnDisabled: boolean = false;
    
    constructor(private titleService: Title, private router: Router, private ns: NotesService, 
                private us: UnderwritingService, private qs: QuotationService, public modalService: NgbModal,
                private ms: MaintenanceService) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Create Open Cover");
    }

    //rowclick for quote listing LOV
    onRowClick(data){
      console.log(data);
        if(data !== null){
            if(Object.keys(data).length !== 0){
                this.selectedQuote = data;
                this.btnDisabled = false;
            }else{
                this.selectedQuote = {};
                this.btnDisabled = true;
            }
        }else{
            this.selectedQuote = {};
            this.btnDisabled = true;
        }
    }

    //rowclick for option LOV
    onRowClickOption(data){
        if(data !== null){
            if(Object.keys(data).length !== 0){
                this.selectedOpt = data;
                this.btnDisabled = false;
            }else{
                this.selectedOpt = {};
                this.btnDisabled = true;
            }
        }else{
            this.selectedOpt = {};
            this.btnDisabled = true;
        }
    }

    setDetails(){
      this.loading = true;
        this.noDataFound = false;
        this.isIncomplete = false;
        this.quoteData.quoteId = this.selectedQuote.quoteId;
        this.quoteData.quoteNo = this.selectedQuote.quotationNo;
        this.tempQuoteNo = this.quoteData.quoteNo.split('-');
        this.currentLineCd = this.selectedQuote.quotationNo.split('-')[0];
        this.quoteData.cedingName = this.selectedQuote.cedingName;
        this.quoteData.insuredDesc = this.selectedQuote.insuredDesc;
        this.quoteData.riskName = this.selectedQuote.project.riskName;
        this.splitQuoteNo = this.quoteData.quoteNo.split('-');
        this.optionData.optionId = '';
        this.optionData.condition = '';
        this.selectedOpt.optionId = '';
        this.selectedOpt.condition = '';
        this.inceptDate.date = this.ns.toDateTimeString(0).split('T')[0];
        //this.inceptDate.time = new Date();
        this.expiryDate.date = this.ns.toDateTimeString(new Date().setFullYear(new Date().getFullYear() + 1)).split('T')[0];
        //this.expiryDate.time = new Date();
        this.getCutOffTime(this.currentLineCd);
        this.getOptionLOV(this.quoteData.quoteId);
        this.form.control.markAsDirty();
    }

    getCutOffTime(lineCd) {
      if(lineCd != '') {
        this.ms.getLineLOV(lineCd).subscribe(data => {
          var res = data['line'];

          if(res.length != 0) {
            this.inceptDate.time = res[0].cutOffTime;
            this.expiryDate.time = res[0].cutOffTime;
          } else {
            this.inceptDate.time = '';
            this.expiryDate.time = '';
          }
        });
      } else {
        this.inceptDate.time = '';
        this.expiryDate.time = '';
      }
    }

    setOption(){
        this.optionData.optionId = this.selectedOpt.optionId;
        this.optionData.condition = this.selectedOpt.optionRt;
        this.form.control.markAsDirty();
    }

    showLOV() {
      this.isType = false;
      this.selectedQuote = null;
      this.getQuoteListing();
      $('#polLovMdl > #modalBtn').trigger('click');
    }

    showOptionLOV() {
      $('#optionLovMdl > #modalBtn').trigger('click');
    }

    getQuoteListing() {
      if(!this.noDataFound){
          this.passDataLOV.filters[0].search = this.tempQuoteNo.join('%-%');
          this.passDataLOV.filters[0].enabled =true;
          this.searchParams.quotationNo = this.tempQuoteNo.join('%-%');
        }else{
          this.passDataLOV.filters[0].search = '';
          this.passDataLOV.filters[0].enabled =false;
          this.searchParams.quotationNo = '';
        }
      if(this.quListTable != undefined){
        this.quListTable.overlayLoader = true;
      }
      this.qs.newGetQuoProcessingData(this.searchParams).subscribe(data => {
        this.quotationList = data['quotationList'];
        this.passDataLOV.count = data['length'];
        this.quListTable.placeData(data['quotationList'].map(q => { q.riskName = q.project != null ? q.project.riskName : null; return q; }));
        if(this.quotationList.length !== 0){
          this.noDataFound = false;
          //this.passDataLOV.tableData = this.quotationList.filter(a=>{return a.openCoverTag === 'Y';}).map(q => { q.riskName = q.project.riskName; return q; });
          if(this.isType && !this.isIncomplete){
            this.isIncomplete = false;
            this.quoteData                     = this.quotationList[0];
            this.quoteData.quoteNo             = this.quoteData.quotationNo;
            this.currentLineCd                 = this.quoteData.quoteNo.split('-')[0];
            this.tempQuoteNo                   = this.quoteData.quoteNo.split('-');
            this.splitQuoteNo                  = this.quoteData.quoteNo.split('-');
            this.optionData.optionId           = '';
            this.optionData.condition          = '';
            this.selectedOpt.optionId          = '';
            this.selectedOpt.condition         = '';
            this.inceptDate.date               = this.ns.toDateTimeString(0).split('T')[0];
            //this.inceptDate.time = new Date();
            this.expiryDate.date               = this.ns.toDateTimeString(new Date().setFullYear(new Date().getFullYear() + 1)).split('T')[0];
            //this.expiryDate.time = new Date();
            this.getCutOffTime(this.currentLineCd);
            this.getOptionLOV(this.quoteData.quoteId);
            this.form.control.markAsDirty();
          }
          setTimeout(()=>{
              this.quListTable.refreshTable();
              this.quListTable.loadingFlag = false;
              this.loading = false;
          }, 0)
        }
        else{
          this.noDataFound = true;
          this.quListTable.addFiller();
          if(this.isType){
            this.clearFields();
            this.selectedOpt.optionId = '';
            this.selectedOpt.condition = '';
            this.passDataOptionLOV.tableData = [];
            this.optListTable.refreshTable();
            //this.tempPolNoContainer = ['','','','','',''];
          }
          if(this.polLovMdl.modalRef == undefined || this.polLovMdl.modalRef == null)
            setTimeout(()=>{
              this.loading = false;
              this.showLOV();
            }, 100);
        }
      },
      (error)=>{
        this.loading = false;
      });
    }

    getOptionLOV(quoteId) {
      this.qs.getQuoteOptions(quoteId).subscribe(data => {
        let fetchedOptData: any[] = data['quotation']['optionsList'];
        if(fetchedOptData.length === 1){
          this.selectedOpt.optionId = fetchedOptData[0].optionId;
          this.selectedOpt.optionRt = fetchedOptData[0].optionRt;
          this.setOption();
        }
        this.passDataOptionLOV.tableData = data['quotation']['optionsList'];
        this.optListTable.refreshTable();
        this.loading = false;
      });
    }

    checkCode(event){
      if(this.optionData.optionId == ''){
        this.optionData.condition = '';
      }else{
        this.ns.lovLoader(event, 1);
        this.qs.getQuoteOptions(this.quoteData.quoteId).subscribe(data =>{
          var options = data['quotation']['optionsList'];
          
          options = options.filter(opt => opt.optionId == this.optionData.optionId);

          if(options.length == 1) {
            this.optionData.optionId = options[0].optionId;
            this.optionData.condition = options[0].optionRt;
          } else {
            this.optionData.optionId = '';
            this.optionData.condition = '';

            this.showOptionLOV();
          }
          this.ns.lovLoader(event, 0);
        });
      }
    }

    prepareParams(){
        //check if required fields are filled
        if(this.splitQuoteNo.length === 5 && this.optionData.optionId !== '' && 
           this.inceptDate.date !== '' && this.inceptDate.time !== '' &&
           this.expiryDate.date !== '' && this.expiryDate.time !== ''){
            //$('#confirm-save #modalBtn2').trigger('click');
            this.convertion();
        }else{
            //please fill required fields
            this.dialogIcon = 'info';
            this.dialogMessage = 'Please fill all the required fields.';
            $('#dialogPopup > #successModalBtn').trigger('click');
            //return false;
        }
    }

    convertion(cancelFlag?){
        $('.globalLoading').css('display','block');
        this.cancelFlag = cancelFlag !== undefined;  
        /*let parsedQuotationNo: string = this.splitQuoteNo[0] + this.splitQuoteNo[1] +
                                        parseInt(this.splitQuoteNo[2]).toString() + parseInt(this.splitQuoteNo[3]).toString() +
                                        this.splitQuoteNo[4];*/
        this.saveParams = {
            //quotationNo: parsedQuotationNo,
            quotationNo: this.quoteData.quoteNo,
            optionId: this.optionData.optionId,
            inceptDate: this.inceptDate.date + 'T' + this.inceptDate.time,
            expiryDate: this.expiryDate.date + 'T' + this.expiryDate.time,
            createUser: JSON.parse(window.localStorage.currentUser).username,
            createDate: this.ns.toDateTimeString(0),
            updateUser: JSON.parse(window.localStorage.currentUser).username,
            updateDate: this.ns.toDateTimeString(0)
        };
        //save to DB
        this.us.saveOpenPolDetails(this.saveParams).subscribe((data: any)=>{
            if(data.returnCode === 0){
              this.dialogIcon = "info";
              this.dialogMessage = "Conversion error. Invalid Quotation data.";
              $('#dialogPopup > #successModalBtn').trigger('click');
            }else{
              this.openPolicyInfo.openPolNo = data.openPolNo;
              this.openPolicyInfo.policyIdOc = data.policyIdOc;
              $('#convertPopup > #modalBtn').trigger('click');
              this.form.control.markAsPristine();
            }
        });
    }

    onClickCancel(){
        this.cancelBtn.clickCancel();
    }

    toOpenCoverPolGenInfo(){
        this.router.navigate(['/create-open-cover-letter', { 
                                                                line: this.splitQuoteNo[0],
                                                                policyIdOc: this.openPolicyInfo.policyIdOc,
                                                                policyNo: this.openPolicyInfo.openPolNo,
                                                                inquiryFlag: false,
                                                                insured: this.quoteData.insuredDesc,
                                                                riskName: this.quoteData.riskName,
                                                                fromBtn: 'create'
                                                           }
                             ], { skipLocationChange: true });
    }

    searchQuoteNoFields(event: any, key: string){
      this.isType = true;
      if(event.target.value.length === 0){
          this.isIncomplete = true;
          this.clearFields();
          this.selectedOpt.optionId = '';
          this.selectedOpt.optionRt = '';
          this.optionData.optionId = '';
          this.optionData.condition = '';
          this.passDataOptionLOV.tableData = [];
          this.optListTable.refreshTable();
      }else{
          if(key === 'seqNo'){
              this.tempQuoteNo[2] = String(this.tempQuoteNo[2]).padStart(5, '0');
          }else if(key === 'revNo'){
              this.tempQuoteNo[3] = String(this.tempQuoteNo[3]).padStart(2, '0');
          }else if(key ==='cedingId'){
              this.tempQuoteNo[4] = String(this.tempQuoteNo[4]).padStart(3, '0');
          }
          for(var i of this.tempQuoteNo){
              if(i.length === 0){
                  this.isIncomplete = true;
                  break;
              }else{
                  this.isIncomplete = false;
              }
          }
      }

      if(!this.isIncomplete){
          this.getQuoteListing();
      }
    }

    clearFields(){
        this.quoteData.quoteId = 0;
        this.quoteData.quoteNo = '';
        this.quoteData.cedingName = '';
        this.quoteData.insuredDesc = '';
        this.quoteData.riskName = '';
        this.inceptDate.date = '';
        this.inceptDate.time = '';
        this.expiryDate.date = '';
        this.expiryDate.time = '';
    }

    searchQuery(searchParams){
      for(let key of Object.keys(searchParams)){
          this.searchParams[key] = searchParams[key]
      }
      this.getQuoteListing();
    }
}
