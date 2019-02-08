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
    
    alopData: any={address: "Quezon City Philippines",
                  alopId: null,
                  alopItem: null,
                  alopItemList: null,
                  annSi: null,
                  annSiD: null,
                  createDate:  null,
                  createUser: null,
                  expiryDate:  null,
                  indemFromDate: null,
                  insuredBusiness: null,
                  insuredDesc: null,
                  insuredId: null,
                  insuredName: null,
                  issueDate: null,
                  maxIndemPd: null,
                  maxIndemPdD: null,
                  maxIndemPdSi: null,
                  maxIndemPdSiD: null,
                  repInterval: null,
                  timeExc: null,
                  updateDate: null,
                  updateUser: null
                };
    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"],
        dataTypes: ["number", "number", "text", "text", "text"],
        nData: {
          createDate: [0,0,0],
          createUser: "Paul",
          description: null,
          importance: 'N',
          itemNo: null,
          lossMin: null,
          quantity: null,
          updateDate: [0,0,0],
          updateUser: "Paul",
        },
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


       

       this.quotationService.getALop(3,'EAR-2019-1-0-3').subscribe((data: any) => {
              this.alopData = data.quotation.alop;
              console.log(this.alopData);
       });

    }

    save() {
      this.alopData.quoteId = 3;
      this.quotationService.saveQuoteAlop(this.alopData).subscribe();
    }

    openAlopItem(){
      while(this.itemInfoData.tableData.length>0){
        this.itemInfoData.tableData.pop();
      }
      this.quotationService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3),3).subscribe((data: any) => {
        
           for (var i=0; i < data.quotation.length; i++) {
                   this.itemInfoData.tableData.push(data.quotation[i].alop.alopItem);
               
           }
           this.table.refreshTable();
           console.log(data)
       });
      $('#alopItemModal #modalBtn').trigger('click');
    }

    saveAlopItem(){
      let savedData: any = {};
      savedData.quoteId = 3;
      savedData.alopId = this.alopData.alopId;
      savedData.alopItemList=[];

      for (var i = 0 ; this.itemInfoData.tableData.length > i; i++) {
        if(this.itemInfoData.tableData[i].edited){
            savedData.alopItemList.push(this.itemInfoData.tableData[i]);
            savedData.alopItemList[savedData.alopItemList.length-1].createDate = new Date(savedData.alopItemList[savedData.alopItemList.length-1].createDate[0],savedData.alopItemList[savedData.alopItemList.length-1].createDate[1]-1,savedData.alopItemList[savedData.alopItemList.length-1].createDate[2]).toISOString();
            savedData.alopItemList[savedData.alopItemList.length-1].updateDate = new Date(savedData.alopItemList[savedData.alopItemList.length-1].updateDate[0],savedData.alopItemList[savedData.alopItemList.length-1].updateDate[1]-1,savedData.alopItemList[savedData.alopItemList.length-1].updateDate[2]).toISOString();
          }
      }
      console.log(savedData);
      this.quotationService.saveQuoteAlopItem(savedData).subscribe((data: any) => {});
  }

}
