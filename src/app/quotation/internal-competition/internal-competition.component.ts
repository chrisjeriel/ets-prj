import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { QuotationService, MaintenanceService } from '../../_services';
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
        dataTypes: ["text", "text", "text", "text", "select", "text", "text", "date", "text", "date"],
        magnifyingGlass: ["cedingRepName", "wordings"],
        nData: new IntCompAdvInfo(null, null, null, null, null, null, null, new Date(), null, new Date()),
        opts: [{
            selector: 'option',
            vals: ['Email', 'Phone', 'Fax'],
        }],
        searchFlag: true,
        paginateFlag: true,
        infoFlag: true,
        checkFlag: true,
        pageLength: 10,
        widths: [1,'auto','auto',1,'auto', 'auto', 1, 1, 1, 1],
        uneditable: [true,true,false,true,false,false,true,true,true,true],
        //keys: ['advNo', 'company', 'attention', 'position', 'advOpt', 'advWord', 'createdBy', 'dateCreated', 'lastUpdateBy', 'lastUpdate'],
        keys: ['adviceNo', 'cedingName', 'cedingRepName', 'position', 'option', 'wordings', 'createUser', 'createDate', 'updateUser', 'updateDate'],

    }

    data: any;
    quoteIds: any[] = [];
    quotationNo: any;
    cedingIds: any[] = [];
    cedingRepIds: any[] = [];
    savedData: any[] = [];
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
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private maintenanceService: MaintenanceService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | Internal Competition");

        //neco
        if(this.inquiryFlag){
          this.intCompData.opts = [];
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
      if(this.params.quoteId != ''){
          this.quotationService.getIntCompAdvInfo(this.params).subscribe((data: any) => {
              for(var j = 0; j < data.quotation.length; j++){
                this.data = data.quotation[j].competitionsList;
                this.quoteIds.push(data.quotation[j].quoteId);
                this.cedingIds.push(data.quotation[j].competitionsList[0].cedingId.toString());
                //this.cedingRepIds.push(data.quotation[j].competitionsList[0].cedingRepId.toString());
                for(var i = 0; i < this.data.length; i++){
                  this.data[i].createDate = new Date(
                      this.data[i].createDate[0],
                      this.data[i].createDate[1] - 1,
                      this.data[i].createDate[2]
                  );
                  this.data[i].updateDate = new Date(
                      this.data[i].updateDate[0],
                      this.data[i].updateDate[1] - 1,
                      this.data[i].updateDate[2]
                  );
                  this.intCompData.tableData.push(this.data[i]);
                }
              }
              //console.log(this.intCompData.tableData);
              this.custEditableNonDatatableComponent.refreshTable();
        });
      }
    }

    onRowClick(data){
      this.selectedPrintData = data;

      if (data.quoteId == null) {
        this.printClickable = false;
      } else {
        this.printClickable = true;
      }

      console.log (data.quoteId + " - " + "Print = " + this.printClickable);
      console.log(this.cedingRepIds)
    }

    onClickPrint() {
      console.log("onClickPrint");
      if (this.printClickable) {
        window.open('http://localhost:8888/api/util-service/generateReport?reportName=QUOTER007' + '&quoteId=' + this.selectedPrintData.quoteId + '&adviceNo=' + this.selectedPrintData.adviceNo, '_blank');
      }
    }

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
            this.intCompData.tableData[i].option = this.intCompData.tableData[i].option === null ? '' : this.intCompData.tableData[i].option;
            this.intCompData.tableData[i].wordings = this.intCompData.tableData[i].wordings === null ? '' : this.intCompData.tableData[i].wordings;
            this.savedData.push(this.intCompData.tableData[i]);
            this.savedData[this.savedData.length-1].quoteId = this.quoteIds[i];
            this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
            this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
          }
      }
      if(this.savedData.length < 1){
        //modal about no changes were made
        this.resultMessage = "No changes were made.";
        this.messageIcon = "info";
        $('#incomp #successModalBtn').trigger('click');
      }
      else{
        this.quotationService.saveQuoteCompetition(this.savedData).subscribe((data: any) => {
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
         this.intCompData.tableData[this.attentionLOVRow].cedingRepName = data.firstName +' '+ data.middleInitial + ' '+ data.lastName; 
         this.intCompData.tableData[this.attentionLOVRow].position = data.position; 
         this.intCompData.tableData[this.attentionLOVRow].cedingRepId = data.cedingRepId.toString();
         this.intCompData.tableData[this.attentionLOVRow].edited = true;
         $('#cust-table-container').addClass('ng-dirty');
    }

    onClickSave(){
      $('#confirm-save #modalBtn2').trigger('click');
    }
}

