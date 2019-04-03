import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { UnderwritingService, QuotationService, NotesService } from '../../../_services';

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

    quotationList: any[] = [];
    splitQuoteNo: string[] = [];

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
    
    constructor(private titleService: Title, private router: Router, private ns: NotesService, 
                private us: UnderwritingService, private qs: QuotationService, private modalService: NgbModal) { }

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
        this.quoteData.cedingName = this.selectedQuote.cedingName;
        this.quoteData.insuredDesc = this.selectedQuote.insuredDesc;
        this.quoteData.riskName = this.selectedQuote.project.riskName;
        this.splitQuoteNo = this.quoteData.quoteNo.split('-');
        this.getOptionLOV(this.quoteData.quoteId);
    }

    setOption(){
        this.optionData.optionId = this.selectedOpt.optionId;
        this.optionData.condition = this.selectedOpt.condition;
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
      this.qs.getQuoProcessingData([{key: 'status', search: '3'}]).subscribe(data => {
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
        this.passDataOptionLOV.tableData = data['quotation']['optionsList'];
        this.optListTable.refreshTable();
      });
    }

    prepareParams(){
        //check if required fields are filled
        if(this.splitQuoteNo.length === 5 && this.optionData.optionId !== '' && 
           this.inceptDate.date !== '' && this.inceptDate.time !== '' &&
           this.expiryDate.date !== '' && this.expiryDate.time !== ''){
            this.saveParams = {
                quotationNo: this.quoteData.quoteNo,
                optionId: this.optionData.optionId,
                inceptionDate: this.inceptDate.date + 'T' + this.inceptDate.time,
                expiryDate: this.expiryDate.date + 'T' + this.expiryDate.time,
                createUser: JSON.parse(window.localStorage.currentUser).username,
                createDate: this.ns.toDateTimeString(0),
                updateUser: JSON.parse(window.localStorage.currentUser).username,
                updateDate: this.ns.toDateTimeString(0)
            };
            console.log(this.saveParams);
        }else{
            //please fill required fields
            console.log('please fill required fields');
        }
    }
}
