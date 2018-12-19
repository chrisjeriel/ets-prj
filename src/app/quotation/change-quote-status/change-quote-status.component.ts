import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {

    tHeader: any[] = [];
    tableData: any[] = [];
    resizable: boolean[] = [false, false, true, true, true];
    
    passData: any = {
        tableData: [
            ["CAR-2015-0002832-01", "Retrocession", "Malayan", "5K Builders & ABE International Corp", "ABC Building"]
        ], 
        tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
        dataTypes: [],
        resizable: [false, false, true, true, true],
        filters: [],
        pageLength: 10,
        expireFilter: false, checkFlag: true, tableOnly: true, fixedCol: false, printBtn: false, 
    }
    
    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {
        setTimeout(function(){$('#modalBtn').trigger('click');}, 100);
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Type of Cession");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Insured");
        this.tHeader.push("Risk");
        
        //temporary
        this.tableData.push(["CAR-2015-0002832-01", "Retrocession", "Malayan", "5K Builders & ABE International Corp", "ABC Building"]);     
        /*this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);*/
        //end temporary
    }
    
    save(){
        //do something
    }
    query(){
        $('#modalBtn').trigger('click'); 
    }

}
