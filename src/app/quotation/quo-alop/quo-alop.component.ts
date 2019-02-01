import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'



@Component({
    selector: 'app-quo-alop',
    templateUrl: './quo-alop.component.html',
    styleUrls: ['./quo-alop.component.css']
})
export class QuoAlopComponent implements OnInit {
    aLOPInfo: ALOPInfo = new ALOPInfo();
    tableData: any[] = [];
    tHeader: string[] = [];
    policyRecordInfo: any = {};
    dataTypes: string[] = [];
    nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
    alopItemData: any;
    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"],
        dataTypes: ["number", "number", "text", "text", "text"],
        nData: new ALOPItemInformation(null, null, null, null, null),
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
        keys:['itemNo','quantity','description','importance','lossMin']
    }
    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | ALOP");
        this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
        this.tHeader = ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"];
        this.dataTypes = ["number", "number", "text", "text", "text"];
        if (this.policyRecordInfo.policyNo.substr(0, 3) == "CAR") {
            this.itemInfoData.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Min"];
            this.itemInfoData.dataTypes = ["number", "number", "text", "text"];
            this.itemInfoData.keys = ['itemNo','quantity','description','lossMin'];
        }

       // this.itemInfoData.tableData = this.uwService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3));


       this.quotationService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3)).subscribe((data: any) => {
           /*this.alopItemData = data.quotation.project.coverage;
           // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
           for (var i = data.quotation.project.coverage.sectionCovers.length - 1; i >= 0; i--) {
             this.passData.tableData.push(data.quotation.project.coverage.sectionCovers[i]);
           }
           this.table.refreshTable();*/
           console.log(data)
       });

    }

    save() {
        console.log(this.aLOPInfo);
    }

}
