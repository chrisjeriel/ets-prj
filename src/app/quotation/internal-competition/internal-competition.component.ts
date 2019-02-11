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
    @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        //var dateConvert: Date;
        this.titleService.setTitle("Quo | Internal Competition");
        //this.tableData = this.quotationService.getIntCompAdvInfo();

        //this.opts.push({ selector: "advOpt", vals: ["Pending", "On Going", "Done"] });

        this.quotationService.getIntCompAdvInfo().subscribe((data: any) => {
            console.log(data.quotation);
            this.data = data.quotation[0].competitionsList;
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
            this.custEditableNonDatatableComponent.refreshTable();
      }
    );

    }
    onClickPrint() {

    }

    onClickCancel() {

    }

    onClickSave() {

    }

    clickRow(event) {
        // var result = event.target.closest('tr').children[1].innerText;
        //  console.log(result);
        // for(var i = 0; i < event.target.closest("tr").children.length; i++) {
        //   console.log(event.target.closest("tr").children[i].ng-reflect-model.text);
    }
}

