import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


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

    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"],
        dataTypes: ["number", "number", "text", "text", "text"],
        nData: new ALOPItemInformation(null, null, null, null, null),
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
    }
    
    constructor(private uwService: UnderwritingService, private modalService: NgbModal, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Quo | ALOP");
        this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
        this.tHeader = ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"];
        this.dataTypes = ["number", "number", "text", "text", "text"];
        if (this.policyRecordInfo.policyNo.substr(0, 3) == "CAR") {
            this.itemInfoData.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Min"];
            this.itemInfoData.dataTypes = ["number", "number", "text", "text"];
        }

        this.itemInfoData.tableData = this.uwService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3));


        /*this.quotationService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3)).subscribe ((data: any) =>{
            for (var i = 0; i <  data.quotation.length ; i++) {
            
            arrayData.push(new ALOPItemInformation(data.quotation[i].alop.alopitem.itemNo, data.quotation[i].alop.alopitem.quantity, data.quotation[i].alop.alopitem.description, null,data.quotation[i].alop.alopitem.lossMin));


      }
        });
        this.itemInfoData.tableData = arrayData;*/
    }

    save() {
        console.log(this.aLOPInfo);
    }

}
