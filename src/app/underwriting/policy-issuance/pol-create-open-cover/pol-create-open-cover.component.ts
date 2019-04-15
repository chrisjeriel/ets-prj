import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { UnderwritingService, QuotationService, NotesService, MaintenanceService } from '../../../_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { FormsModule }   from '@angular/forms';

@Component({
    selector: 'app-pol-create-open-cover',
    templateUrl: './pol-create-open-cover.component.html',
    styleUrls: ['./pol-create-open-cover.component.css']
})
export class PolCreateOpenCoverComponent implements OnInit {

    quoteLine: any;

    passDataLOV: any = {
      tableData: [],
      tHeader:["Quotation No", "Ceding Company", "Insured", "Risk"],  
      dataTypes: ["text","text","text","text"],
      pageLength: 10,
      resizable: [false,false,false,false],
      tableOnly: false,
      keys: ['quotationNo','cedingName','insuredDesc','riskName'],
      pageStatus: true,
      pagination: true,
      filters: [
      /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
      {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
      {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
      {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
      pageID: 'lov1'
    }

    passDataOptionLOV: any = {
      tableData: [],
      tHeader:["Option Id", "Condition"],  
      dataTypes: ["text","text"],
      pageLength: 10,
      //resizable: [false,false],
      tableOnly: false,
      keys: ['optionId','condition'],
      pageStatus: true,
      pagination: true,
      filters: [
      /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
      {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
      {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
      {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
      pageID: 'optionLov'
    }

    @ViewChild('polLov') quListTable : CustNonDatatableComponent;
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
    
    constructor(private titleService: Title, private router: Router, private ns: NotesService, 
                private us: UnderwritingService, private qs: QuotationService, private modalService: NgbModal,
                private ms: MaintenanceService) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Create Open Cover");
    }

    //rowclick for quote listing LOV
    onRowClick(data){
        if(data !== null){
            if(Object.keys(data).length !== 0){
                this.selectedQuote = data;
            }else{
                this.selectedQuote = {};
            }
        }else{
            this.selectedQuote = {};
        }
    }

    //rowclick for option LOV
    onRowClickOption(data){
        if(data !== null){
            if(Object.keys(data).length !== 0){
                this.selectedOpt = data;
            }else{
                this.selectedOpt = {};
            }
        }else{
            this.selectedOpt = {};
        }
    }

    setDetails(){
        this.quoteData.quoteId = this.selectedQuote.quoteId;
        this.quoteData.quoteNo = this.selectedQuote.quotationNo;
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
        this.optionData.condition = this.selectedOpt.condition;
        this.form.control.markAsDirty();
    }

    showLOV() {
      this.getQuoteListing();
      $('#polLovMdl > #modalBtn').trigger('click');
    }

    showOptionLOV() {
      $('#optionLovMdl > #modalBtn').trigger('click');
    }

    getQuoteListing() {
      this.quListTable.loadingFlag = true;
      this.qs.getQuoProcessingData([{key: 'status', search: 'RELEASED'}]).subscribe(data => {
        this.quotationList = data['quotationList'];
        this.passDataLOV.tableData = this.quotationList.filter(a=>{return a.openCoverTag === 'Y';}).map(q => { q.riskName = q.project.riskName; return q; });
        setTimeout(()=>{
            this.quListTable.refreshTable();
            this.quListTable.loadingFlag = false;
        }, 0)
      });
    }

    getOptionLOV(quoteId) {
      this.qs.getQuoteOptions(quoteId).subscribe(data => {
        console.log(data['quotation']['optionsList']);
        let fetchedOptData: any[] = data['quotation']['optionsList'];
        if(fetchedOptData.length === 1){
          console.log('here');
          this.selectedOpt.optionId = fetchedOptData[0].optionId;
          this.selectedOpt.condition = fetchedOptData[0].condition;
          this.setOption();
        }
        this.passDataOptionLOV.tableData = data['quotation']['optionsList'];
        this.optListTable.refreshTable();
      });
    }

    prepareParams(){
        //check if required fields are filled
        if(this.splitQuoteNo.length === 5 && this.optionData.optionId !== '' && 
           this.inceptDate.date !== '' && this.inceptDate.time !== '' &&
           this.expiryDate.date !== '' && this.expiryDate.time !== ''){
            $('#confirm-save #modalBtn2').trigger('click');
        }else{
            //please fill required fields
            console.log(this.splitQuoteNo.length);
            console.log(this.optionData.optionId);
            console.log(this.inceptDate.date);
            console.log(this.inceptDate.time);
            console.log(this.expiryDate.date);
            console.log(this.expiryDate.time);
            this.dialogIcon = 'info';
            this.dialogMessage = 'Please fill all the required fields.';
            $('#dialogPopup > #successModalBtn').trigger('click');
            //return false;
        }
    }

    convertion(cancelFlag?){
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
            console.log(data);
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
                                                                fromBtn: 'create'
                                                           }
                             ], { skipLocationChange: true });
    }

    searchQuoteNoFields(data: string, key: string){
      if(key === 'lineCd'){
        this.tempQuoteNo[0] = data.toUpperCase();
      }else if(key === 'year'){
        this.tempQuoteNo[1] = data;
      }else if(key === 'seqNo'){
        this.tempQuoteNo[2] = data;
      }else if(key === 'revNo'){
        this.tempQuoteNo[3] = data;
      }else if(key === 'cedingId'){
        this.tempQuoteNo[4] = data;
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

    checkQuoteNoParams(){
      console.log(this.tempQuoteNo);
      if(this.tempQuoteNo[0].length !== 0 &&
         this.tempQuoteNo[1].length !== 0 &&
         this.tempQuoteNo[2].length !== 0 &&
         this.tempQuoteNo[3].length !== 0 &&
         this.tempQuoteNo[4].length !== 0){

      }else{
        this.clearFields();
      }
    }
}
