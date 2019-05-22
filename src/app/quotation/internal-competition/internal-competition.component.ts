import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { QuotationService, MaintenanceService, NotesService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';

import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';


@Component({
    selector: 'app-internal-competition',
    templateUrl: './internal-competition.component.html',
    styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit {
    @Input() quotationInfo: {
        quoteId: '',
        quotationNo: '',
        riskName: '',
        insuredDesc: ''
    }
    @Input() inquiryFlag: boolean = false;
    resultMessage: string = "";
    Description: string = "";
    adviceLOVRow : number;
    attentionLOVRow: number;
    intCompData: any = {
        tableData: [],
        tHeader: ["Advice No.", "Company", "Attention", "Position", "Advice Option", "Advice Wordings", "Created By", "Date Created", "Last Update By", "Last Update"],
        dataTypes: ["text", "text", "text", "text", "select", "text-editor", "text", "date", "text", "date"],
        magnifyingGlass: ["cedingRepName", "wordings"],
        nData: new IntCompAdvInfo(null, null, null, null, null, null, null, new Date(), null, new Date()),
        opts: [{
            selector: 'advOption',
            prev: [],
            vals: [],
        }],
        searchFlag: true,
        paginateFlag: true,
        infoFlag: true,
        checkFlag: true,
        pageLength: 10,
        widths: [1,'auto','auto',1,'auto', 'auto', 1, 1, 1, 1],
        uneditable: [true,true,true,true,false,false,true,true,true,true],
        //keys: ['advNo', 'company', 'attention', 'position', 'advOpt', 'advWord', 'createdBy', 'dateCreated', 'lastUpdateBy', 'lastUpdate'],
        keys: ['adviceNo', 'cedingName', 'cedingRepName', 'position', 'advOption', 'wordings', 'advWordCreateUser', 'advWordCreateDate', 'advWordUpdateUser', 'advWordUpdateDate'],

    }

    data: any;
    quoteIds: any[] = [];
    quotationNo: any;
    cedingIds: any[] = [];
    cedingRepIds: any[] = [];
    savedData: any[] = [];
    savedDataComp: any[] = [];
    printClickable: boolean = false;

    selectedPrintData: any;

    currentCedingId: string = "";

    sub: any;
    params: any = {
        quoteId: '',
        quotationNo: ''
    }

    @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, 
                private titleService: Title, private maintenanceService: MaintenanceService, 
                private route: ActivatedRoute, private notes: NotesService) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | Internal Competition");

        //neco
        if(this.inquiryFlag){
          //this.intCompData.opts = [];
          this.intCompData.uneditable = [];
          this.intCompData.magnifyingGlass = [];
          this.intCompData.addFlag = false;
          this.intCompData.deleteFlag = false;
          for(var count = 0; count < this.intCompData.tHeader.length; count++){
            this.intCompData.uneditable.push(true);
          }
        }
        //neco end

        /*let quoteNo:string = "";
        this.sub = this.route.params.subscribe(params => {
          this.quotationNo = params["quotationNo"];
          quoteNo = this.quotationNo.split(/[-]/g)[0]
          for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
           quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
         }
        });
        console.log(quoteNo);*/
        this.params.quoteId = this.quotationInfo.quoteId;
        this.params.quotationNo = this.quotationInfo.quotationNo;

        this.retrieveInternalCompetition();
        
      /*this.maintenanceService.getAdviceWordings().subscribe((data: any) => {
        //console.log(data);
      });*/

    }

    retrieveInternalCompetition(){
      this.intCompData.tableData = [];
      this.quoteIds = [];
      this.cedingIds = [];
      if(this.params.quoteId != ''){
          this.quotationService.getIntCompAdvInfo(this.params).subscribe((data: any) => {
            console.log(data);
              for(var j = 0; j < data.quotation.length; j++){
                this.data = data.quotation[j].competitionsList;
                this.quoteIds.push(data.quotation[j].quoteId);
                this.cedingIds.push(data.quotation[j].competitionsList[0].cedingId.toString());
                //this.cedingRepIds.push(data.quotation[j].competitionsList[0].cedingRepId.toString());
                for(var i = 0; i < this.data.length; i++){
                  this.data[i].showMG = 1;
                  this.data[i].advWordCreateUser = this.data[i].advWordCreateUser === null ? this.data[i].createUser : this.data[i].advWordCreateUser;
                  this.data[i].advWordUpdateUser = this.data[i].advWordUpdateUser === null ? this.data[i].updateUser : this.data[i].advWordUpdateUser;
                  this.data[i].advWordCreateDate = this.data[i].advWordCreateDate === null ? this.data[i].createDate : this.notes.toDateTimeString(this.data[i].advWordCreateDate);
                  this.data[i].advWordUpdateDate = this.data[i].advWordUpdateDate === null ? this.data[i].updateDate : this.notes.toDateTimeString(this.data[i].advWordUpdateDate);
                  this.intCompData.tableData.push(this.data[i]);
                }
              }
              //console.log(this.intCompData.tableData);
              this.custEditableNonDatatableComponent.refreshTable();
          });
          if(this.intCompData.opts[0].vals.length === 0 && this.intCompData.opts[0].prev.length === 0){
            this.maintenanceService.getRefCode('QUOTE_ADVICE_WORDINGS.ADV_OPTION').subscribe((data: any) =>{
                for(var ref of data.refCodeList){
                  this.intCompData.opts[0].vals.push(ref.code);
                  this.intCompData.opts[0].prev.push(ref.description);
                }
                this.custEditableNonDatatableComponent.refreshTable();
            });
          }
      }
    }

    onRowClick(data){
      console.log(data);
      this.selectedPrintData = data;
      if (data == null) {
        this.printClickable = false;
      } else {
        this.printClickable = true;
      }
    }

    destination: string = '';
    printerName: string = '';
    printNoCopies: number = 0;
    onClickPrint() {
      console.log(this.custEditableNonDatatableComponent.selected);
      /*if (this.printClickable) {*/
     /* if (this.custEditableNonDatatableComponent.selected.length !== 0) {
        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=QUOTER007' + '&quoteId=' + this.selectedPrintData.quoteId + '&adviceNo=' + this.selectedPrintData.adviceNo, '_blank');
      }*/
      let validate: boolean = true;
      for(var i of this.custEditableNonDatatableComponent.selected){
        if(i.wordings === null || (i.wordings !== null && i.wordings.trim().length === 0)){
          this.messageIcon = "error";
          $('#incomp #successModalBtn').trigger('click');
          validate = false;
          break;
        }
      }
      if(validate){
        $('#showPrintMenu2 > #modalBtn').trigger('click');
      }
    }

    printMethod(){
      if(this.destination === 'SCREEN'){
        for(var i = 0; i < this.custEditableNonDatatableComponent.selected.length; i++){
          console.log(this.custEditableNonDatatableComponent.selected[i].adviceNo);
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=QUOTER007' + '&quoteId=' + 
                      this.quotationInfo.quoteId + '&adviceNo=' + this.custEditableNonDatatableComponent.selected[i].adviceNo, '_blank');
        }
      }else if(this.destination === 'PDF'){
        for(var i = 0; i < this.custEditableNonDatatableComponent.selected.length; i++){
            this.quotationService.downloadPDFIntComp(this.custEditableNonDatatableComponent.selected[i].adviceNo,this.quotationInfo.quoteId).subscribe( data => {
                 var newBlob = new Blob([data], { type: "application/pdf" });
                 var downloadURL = window.URL.createObjectURL(data);
                 var link = document.createElement('a');
                 link.href = downloadURL;
                 link.download = this.quotationInfo.quotationNo + '-' + i;
                 link.click();
                
            },
             error => {
                 /*if (this.isEmptyObject(error)) {
                 } else {
                    this.dialogIcon = "error-message";
                    this.dialogMessage = "Error printing file";
                    $('#listQuotation #successModalBtn').trigger('click');
                    setTimeout(()=>{$('.globalLoading').css('display','none');},0);
                 }     */     
            });
        }
      }else if(this.destination === 'PRINTER'){
         if(this.printerName === '' || this.printNoCopies === 0){

         }else{
           for(var i = 0; i < this.custEditableNonDatatableComponent.selected.length; i++){
               this.quotationService.downloadPDFIntComp(this.custEditableNonDatatableComponent.selected[i].adviceNo,this.quotationInfo.quoteId).subscribe( data => {
                    var newBlob = new Blob([data], { type: "application/pdf" });
                    var downloadURL = window.URL.createObjectURL(data);
                    console.log(downloadURL);
                    window.open(downloadURL, '_blank').print();
                   
             },
              error => {
                  /*if (this.isEmptyObject(error)) {
                  } else {
                     this.dialogIcon = "error-message";
                     this.dialogMessage = "Error printing file";
                     $('#listQuotation #successModalBtn').trigger('click');
                     setTimeout(()=>{$('.globalLoading').css('display','none');},0);
                  }   */       
             });
           }
         }
      }

      this.custEditableNonDatatableComponent.refreshTable();
    }

    /*validate(){
      console.log(this.printerName);
      if(this.destination === ''){
        return true;
      }else{
        if(this.destination === 'PRINT' && this.printerName !== '' && this.printNoCopies !== 0){
          console.log(1);
          return false;
        }else if(this.destination !== '' && this.destination !== 'PRINT'){
          console.log(2);
          return false;
        }else{
          return true;
        }
      }
    }*/

    onClickCancel() {
      this.cancelBtn.clickCancel();
    }

    cancelFlag:boolean = false;
    messageIcon: string = "";
    saveData(cancelFlag?) {
      this.cancelFlag = cancelFlag !== undefined;
      //console.log(this.data);
      this.savedData = [];
      for (var i = 0 ; this.intCompData.tableData.length > i; i++) {
        if(this.intCompData.tableData[i].edited){
            this.savedData.push(
              {
                advOption: this.intCompData.tableData[i].advOption === null ? '' : this.intCompData.tableData[i].advOption,
                adviceNo: this.intCompData.tableData[i].adviceNo,
                cedingId: this.intCompData.tableData[i].cedingId,
                createDate: this.notes.toDateTimeString(0),
                createUser: JSON.parse(window.localStorage.currentUser).username,
                quoteId: this.quotationInfo.quoteId,
                updateDate: this.notes.toDateTimeString(0),
                updateUser: JSON.parse(window.localStorage.currentUser).username,
                wordings: this.intCompData.tableData[i].wordings === null ? '' : this.intCompData.tableData[i].wordings 
              }
            );
            this.savedDataComp.push(
              {
                adviceNo: this.intCompData.tableData[i].adviceNo,
                cedingId: this.intCompData.tableData[i].cedingId,
                cedingRepId: this.intCompData.tableData[i].cedingRepId,
                createDate: this.notes.toDateTimeString(0),
                createUser: JSON.parse(window.localStorage.currentUser).username,
                quoteId: this.intCompData.tableData[i].quoteId,
                updateDate: this.notes.toDateTimeString(0),
                updateUser: JSON.parse(window.localStorage.currentUser).username
              }
            );
          }
      }
      console.log(this.savedData);
      if(this.savedData.length < 1){
        //modal about no changes were made
        /*this.resultMessage = "No changes were made.";
        this.messageIcon = "info";
        $('#incomp #successModalBtn').trigger('click');*/
      }
      else{
        this.quotationService.saveQuoteCompetition(this.savedDataComp).subscribe((data: any)=>{
          if(data.returnCode === 0){
            console.log("ERROR!");
            this.messageIcon = "error";
             $('#incomp #successModalBtn').trigger('click');
           }else{
             this.quotationService.saveQuoteAdviceWordings(this.savedData).subscribe((data: any) => {
                 if(data.returnCode === 0){
                   console.log("ERROR!");
                   this.messageIcon = "error";
                    $('#incomp #successModalBtn').trigger('click');
                 }
                 else{
                   this.messageIcon = "";
                    $('#incomp #successModalBtn').trigger('click');
                    this.retrieveInternalCompetition();
                    $('.ng-dirty').removeClass('ng-dirty');
                 }
             });
           }
        });
       
      }
       
    }

    clickAdviceLOV(data){
      this.currentCedingId = this.cedingIds[data.index];
      if(data.key=='wordings'){
        $('#adviceWordingsLOV #modalBtn').trigger('click');
        data.tableData = this.intCompData.tableData;
        this.adviceLOVRow = data.index;
      }
      else if(data.key=='cedingRepName'){
        $('#attentionLOV #modalBtn').trigger('click');
        data.tableData = this.intCompData.tableData;
        this.attentionLOVRow = data.index;
      }
    }

    selectedAdviceLOV(data){
        this.intCompData.tableData[this.adviceLOVRow].wordings = data.wordings;
        this.intCompData.tableData[this.adviceLOVRow].edited = true;
        $('#cust-table-container').addClass('ng-dirty');
    }

    selectedAttentionLOV(data){
         this.intCompData.tableData[this.attentionLOVRow].cedingRepName = data.designation +' '+ data.firstName +' '+ data.middleInitial + ' '+ data.lastName; 
         this.intCompData.tableData[this.attentionLOVRow].position = data.position; 
         this.intCompData.tableData[this.attentionLOVRow].cedingRepId = data.cedingRepId.toString();
         this.intCompData.tableData[this.attentionLOVRow].edited = true;
         $('#cust-table-container').addClass('ng-dirty');
    }

    onClickSave(){
      $('#confirm-save #modalBtn2').trigger('click');
    }
}

