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
    
    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {
        //$('#modalBtn').trigger('click');        //this line causes an error but somehow still works
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Type of Cession");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Insured");
        this.tHeader.push("Risk");
        
        //temporary
        this.tableData.push(["CAR-2015-0002832-01", "Retrocession", "Malayan", "5K Builders & ABE International Corp", "ABC Building"]);     
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        this.tableData.push([" ", " ", " ", " ", " "]);
        //end temporary
    }
    
    save(){
        //do something
    }
    query(){
        $('#modalBtn').trigger('click'); 
    }

}
