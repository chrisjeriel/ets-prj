import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { QuoteALOPItemInformation, QuoteALOPInfo } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'



@Component({
    selector: 'app-quo-alop',
    templateUrl: './quo-alop.component.html',
    styleUrls: ['./quo-alop.component.css']
})
export class QuoAlopComponent implements OnInit {
      @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    aLOPInfo: QuoteALOPInfo = new QuoteALOPInfo();
    tableData: any[] = [];
    tHeader: string[] = [];
    policyRecordInfo: any = {};
    dataTypes: string[] = [];
    nData: QuoteALOPItemInformation = new QuoteALOPItemInformation(null, null, null, null, null);
    
    alopItemData: any;
    alopData: any;
    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"],
        dataTypes: ["number", "number", "text", "text", "text"],
        nData: new QuoteALOPItemInformation(null, null, null, null, null),
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


       this.quotationService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3)).subscribe((data: any) => {
        
           for (var i=0; i < data.quotation.length; i++) {
                   this.itemInfoData.tableData.push(data.quotation[i].alop.alopItem);
               
           }
           this.table.refreshTable();
           console.log(data)
       });

       this.quotationService.getALop(3,'EAR-2019-1-0-3').subscribe((data: any) => {
              this.alopItemData = data.quotation.alop
       });
    }

    save() {
        console.log(this.aLOPInfo);
    }

}
