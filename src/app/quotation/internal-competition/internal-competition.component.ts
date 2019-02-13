import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';


@Component({
    selector: 'app-internal-competition',
    templateUrl: './internal-competition.component.html',
    styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit {

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
        //keys: ['advNo', 'company', 'attention', 'position', 'advOpt', 'advWord', 'createdBy', 'dateCreated', 'lastUpdateBy', 'lastUpdate'],
        keys: ['adviceNo', 'cedingName', 'cedingRepName', 'position', 'option', 'wordings', 'createUser', 'createDate', 'updateUser', 'updateDate'],

    }

    data: any;
    quoteIds: any[] = [];
    savedData: any[] = [];
    @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        //var dateConvert: Date;
        this.titleService.setTitle("Quo | Internal Competition");
        //this.tableData = this.quotationService.getIntCompAdvInfo();

        //this.opts.push({ selector: "advOpt", vals: ["Pending", "On Going", "Done"] });

        this.quotationService.getIntCompAdvInfo().subscribe((data: any) => {
            for(var j = 0; j < data.quotation.length; j++){
              this.data = data.quotation[j].competitionsList;
              this.quoteIds.push(data.quotation[j].quoteId);
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
      }
    );

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
            this.savedData[this.savedData.length-1].quoteId = this.quoteIds[this.savedData.length-1];
            this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
            this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
          }

        // delete this.savedData[i].tableIndex;
      }
      console.log(this.savedData);
       this.quotationService.saveQuoteCompetition(this.savedData).subscribe((data: any) => {
            console.log(data);
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
}

