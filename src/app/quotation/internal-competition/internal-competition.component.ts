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
    tableData: any[] = [];
    tHeader: any[] = ["Advice No.", "Company", "Attention", "Position", "Advice Option", "Advice Wordings", "Created By", "Date Created", "Last Update By", "Last Update"];
    dataTypes: any[] = ["text", "text", "text", "text", "select", "text", "text", "date", "text", "date"];
    magnifyingGlass: any[] = ["attention", "advWord"];
    nData: IntCompAdvInfo = new IntCompAdvInfo(null, null, null, null, null, null, null, new Date(), null, new Date());
    opts: any[] = [];

    intCompData: any = {
        tableData: [],
        tHeader: ["Advice No.", "Company", "Attention", "Position", "Advice Option", "Advice Wordings", "Created By", "Date Created", "Last Update By", "Last Update"],
        dataTypes: ["text", "text", "text", "text", "select", "text", "text", "date", "text", "date"],
        magnifyingGlass: ["attention", "advWord"],
        nData: new IntCompAdvInfo(null, null, null, null, null, null, null, new Date(), null, new Date()),
        opts: [{
            selector: 'advOpt',
            vals: ['option1', 'option2', 'option3', 'option4', 'option5'],
        }],
        searchFlag: true,
        paginateFlag: true,
        infoFlag: true,
        checkFlag: true,
        pageLength: 10,
        widths: [1,'auto','auto',1,'auto', 'auto', 1, 1, 1, 1],
        keys: ['advNo', 'company', 'attention', 'position', 'advOpt', 'advWord', 'createdBy', 'dateCreated', 'lastUpdateBy', 'lastUpdate'],
    }

    data: any;
    @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | Internal Competition");
        //this.tableData = this.quotationService.getIntCompAdvInfo();

        //this.opts.push({ selector: "advOpt", vals: ["Pending", "On Going", "Done"] });

        this.quotationService.getIntCompAdvInfo().subscribe((data: any) => {
            this.data = data;
            //console.log(this.data.quotation[0].competition[0].adviceNo);
            for(var i = 0; i < this.data.quotation.length; i++){
              this.intCompData.tableData.push(
                new IntCompAdvInfo(this.data.quotation[i].competitionsList[0].adviceNo, 
                                   this.data.quotation[i].competitionsList[0].cedingName, 
                                   this.data.quotation[i].competitionsList[0].cedingRepName,
                                   '', 
                                   this.data.quotation[i].competitionsList[0].option,
                                   this.data.quotation[i].competitionsList[0].wordings,
                                   this.data.quotation[i].competitionsList[0].createUser,
                                   new Date(
                                           this.data.quotation[i].competitionsList[0].createDate[0],
                                           this.data.quotation[i].competitionsList[0].createDate[1] - 1,
                                           this.data.quotation[i].competitionsList[0].createDate[2],
                                       ),
                                   this.data.quotation[i].competitionsList[0].updateUser,
                                   new Date(
                                           this.data.quotation[i].competitionsList[0].updateDate[0],
                                           this.data.quotation[i].competitionsList[0].updateDate[1] - 1,
                                           this.data.quotation[i].competitionsList[0].updateDate[2],
                                           
                                       ))
              );
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

