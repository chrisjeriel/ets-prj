import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { QuotationService, MaintenanceService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';


@Component({
    selector: 'app-internal-competition',
    templateUrl: './internal-competition.component.html',
    styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit, OnDestroy {
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
            vals: ['option1', 'option2', 'option3', 'option4', 'option5'],
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

    currentCedingId: string = "";

    sub: any;
    params: any = {
        quoteId: '',
        quotationNo: ''
    }

    @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private maintenanceService: MaintenanceService, private route: ActivatedRoute) { }

    ngOnInit() {
        //var dateConvert: Date;
        this.titleService.setTitle("Quo | Internal Competition");
        //this.tableData = this.quotationService.getIntCompAdvInfo();

        //this.opts.push({ selector: "advOpt", vals: ["Pending", "On Going", "Done"] });

        let quoteNo:string = "";
        this.sub = this.route.params.subscribe(params => {
          this.quotationNo = params["quotationNo"];
          quoteNo = this.quotationNo.split(/[-]/g)[0]
          for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
           quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
         } 
        });
        this.params.quotationNo = quoteNo;
        if(this.params.quotationNo != ''){
            this.quotationService.getIntCompAdvInfo(this.params).subscribe((data: any) => {
                for(var j = 0; j < data.quotation.length; j++){
                  this.data = data.quotation[j].competitionsList;
                  this.quoteIds.push(data.quotation[j].quoteId);
                  this.cedingIds.push(data.quotation[j].competitionsList[0].cedingId.toString());
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
      this.maintenanceService.getAdviceWordings().subscribe((data: any) => {
        //console.log(data);
      });

    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    onClickPrint() {

    }

    onClickCancel() {
      console.log(this.quoteIds);
    }

    onClickSave() {
      //console.log(this.data);
      this.savedData = [];
      for (var i = 0 ; this.intCompData.tableData.length > i; i++) {
        if(this.intCompData.tableData[i].edited){
            this.savedData.push(this.intCompData.tableData[i]);
            this.savedData[this.savedData.length-1].quoteId = this.quoteIds[i];
            this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
            this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
          }

        // delete this.savedData[i].tableIndex;
      }
       this.quotationService.saveQuoteCompetition(this.savedData).subscribe((data: any) => {
            $('#successModalBtn').trigger('click');
       });
      /*let data : any = {
            adviceNo: 0,
            cedingId: 6, //hardcoded
            cedingRepId: 'cedingrepid6',
            createDate: new Date(),
            createUser: 'Trinidad',
            option: 'option1',
            quoteId: 6,
            updateDate: new Date(),
            updateUser: 'Trinidad',
            wordings: ''

        }
        this.quotationService.saveQuoteCompetition(data).subscribe((data: any) => {
            console.log(data);
        });*/
    }

    clickRow(event) {
        // var result = event.target.closest('tr').children[1].innerText;
        //  console.log(result);
        // for(var i = 0; i < event.target.closest("tr").children.length; i++) {
        //   console.log(event.target.closest("tr").children[i].ng-reflect-model.text);
    }

    clickAdviceLOV(data){
      this.currentCedingId = this.cedingIds[data.index];
      //console.log(this.currentCedingId);
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
        this.intCompData.tableData[this.adviceLOVRow].wordings = data.adviceText01;
        this.intCompData.tableData[this.adviceLOVRow].edited = true;
    }

    selectedAttentionLOV(data){
         this.intCompData.tableData[this.attentionLOVRow].cedingRepName = data.firstName +' '+ data.middleInitial + ' '+ data.lastName; 
         this.intCompData.tableData[this.attentionLOVRow].position = data.position; 
         this.intCompData.tableData[this.attentionLOVRow].cedingRepId = data.cedingRepId.toString();
         this.intCompData.tableData[this.attentionLOVRow].edited = true;
    }
}

