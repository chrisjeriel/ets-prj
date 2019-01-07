import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { IntCompAdvInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


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
        tableData: this.quotationService.getIntCompAdvInfo(),
        tHeader: ["Advice No.", "Company", "Attention", "Position", "Advice Option", "Advice Wordings", "Created By", "Date Created", "Last Update By", "Last Update"],
        dataTypes: ["text", "text", "text", "text", "select", "text", "text", "date", "text", "date"],
        magnifyingGlass: ["attention", "advWord"],
        nData: new IntCompAdvInfo(null, null, null, null, null, null, null, new Date(), null, new Date()),
        searchFlag: true,
        paginateFlag: true,
        infoFlag: true,
        checkFlag: true,
        pageLength: 10
    }
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | Internal Competition");
        this.tableData = this.quotationService.getIntCompAdvInfo();

        this.opts.push({ selector: "advOpt", vals: ["Pending", "On Going", "Done"] });

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

