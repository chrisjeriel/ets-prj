import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { QuoteALOPItemInformation, QuoteALOPInfo } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';



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
    
    sub:any;
    quotationNo: string;
    quoteId: string;

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
        keys:['itemNo','quantity','description','importance','lossMin'],
        widths:[1,1,1,1,1,1]
    }

    
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute) { }

    ngOnInit() {

      let quoteNo:string = "";
      this.sub = this.route.params.subscribe(params => {
        this.quotationNo = params["quotationNo"];
        quoteNo = this.quotationNo.split(/[-]/g)[0]
        for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
         quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
       } 
      });

        this.titleService.setTitle("Quo | ALOP");
        this.policyRecordInfo.policyNo = "EAR-2018-5081-077-0177";
        this.tHeader = ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"];
        this.dataTypes = ["number", "number", "text", "text", "text"];
        if (this.policyRecordInfo.policyNo.substr(0, 3) == "CAR") {
            this.itemInfoData.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Min"];
            this.itemInfoData.dataTypes = ["number", "number", "text", "text"];
            this.itemInfoData.keys = ['itemNo','quantity','description','lossMin'];
        }

       this.quotationService.getALop(null,quoteNo).subscribe((data: any) => {
              this.alopData = data.quotation.alop;
              this.alopData.issueDate = this.alopData.issueDate[0]+'-'+("0" + this.alopData.issueDate[1]).slice(-2)+'-'+  ("0" + this.alopData.issueDate[2]).slice(-2);
              this.alopData.expiryDate = this.alopData.expiryDate[0]+'-'+("0" + this.alopData.expiryDate[1]).slice(-2)+'-'+ ("0" + this.alopData.expiryDate[2]).slice(-2);
              this.alopData.indemFromDate = this.alopData.indemFromDate[0]+'-'+("0" + this.alopData.indemFromDate[1]).slice(-2)+'-'+("0" + this.alopData.indemFromDate[2]).slice(-2);
              
       });


       this.quotationService.getALOPItemInfos(quoteNo,this.quoteId).subscribe((data: any) => {
            for (var i=0; i < data.quotation[0].alop.alopItemList.length; i++) {
                    this.itemInfoData.tableData.push(data.quotation[0].alop.alopItemList[i]);
            }
            this.table.refreshTable();

        });
       

    }

    save() {
      this.alopData.quoteId = this.quoteId;
      this.quotationService.saveQuoteAlop(this.alopData).subscribe();
      this.ngOnInit();
    }

    openAlopItem(){
      while(this.itemInfoData.tableData.length>0){
        this.itemInfoData.tableData.pop();
      }
      $('#alopItemModal #modalBtn').trigger('click');
    }

    saveAlopItem(){
      let savedData: any = {};
      savedData.quoteId = this.quoteId;
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

  showInsuredLOV(){
    $('#insuredLOV #modalBtn').trigger('click');
  }

  setInsured(data){
    this.alopData.insuredName = data.insuredName;
    this.alopData.insuredId = data.insuredId;
  }

}
