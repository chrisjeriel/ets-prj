import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { QuoteALOPItemInformation, QuoteALOPInfo } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { highlight,unHighlight } from '@app/_directives/highlight';



@Component({
    selector: 'app-quo-alop',
    templateUrl: './quo-alop.component.html',
    styleUrls: ['./quo-alop.component.css']
})
export class QuoAlopComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild("from") from:any;
  @ViewChild("to") to:any;
  aLOPInfo: QuoteALOPInfo = new QuoteALOPInfo();
  @Input() quotationInfo:any = {};
  @Input() inquiryFlag: boolean = false;
  tableData: any[] = [];
  tHeader: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  nData: QuoteALOPItemInformation = new QuoteALOPItemInformation(null, null, null, null, null);
  errorMdlMessage: string = "";
    sub:any;
    quotationNo: string;
    quoteId: string;
    quoteNo:string = '';

    alopData: any={address: null,
                  alopId: '1',
                  alopItem: null,
                  alopItemList: null,
                  annSi: null,
                  annSiD: null,
                  createDate:  [0,0,0],
                  createUser: 'Paul',
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
                  updateDate: [0,0,0],
                  updateUser: 'Paul'
                };

    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"],
        dataTypes: ["number", "number", "text", "text", "text"],
        uneditable: [true,false,false,false,false,false],
        nData: {
          createDate: [0,0,0],
          createUser: "Paul",
          description: null,
          importance: null,
          itemNo: 1,
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
        widths:[1,1,1,1,1,1],
        checkFlag:true
    }

    passLOV: any = {
      selector: 'insured',
    }
    
    loading:boolean = true;
    dialogMessage:string = "";
    dialogIcon: string = "";
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute) { }

    ngOnInit() {
      //neco
      if(this.inquiryFlag){
        this.itemInfoData.opts = [];
        this.itemInfoData.uneditable = [];
        this.itemInfoData.magnifyingGlass = [];
        this.itemInfoData.addFlag = false;
        this.itemInfoData.deleteFlag = false;
        for(var count = 0; count < this.itemInfoData.tHeader.length; count++){
          this.itemInfoData.uneditable.push(true);
        }
      }
      //neco end
      this.quotationNo = this.quotationInfo.quotationNo;
      this.quoteNo = this.quotationNo.split(/[-]/g)[0]
      for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
         this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
       } 

        this.titleService.setTitle("Quo | ALOP");
        if (this.quoteNo.substr(0, 3) == "CAR") {
            this.itemInfoData.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Min"];
            this.itemInfoData.dataTypes = ["number", "number", "text", "text"];
            this.itemInfoData.keys = ['itemNo','quantity','description','lossMin'];
        }
        this.getAlop();

    }


    getAlop(){
      this.quotationService.getALop(null,this.quoteNo).subscribe((data: any) => {
             this.loading = false;
             
             this.quoteId = data.quotation.quoteId;
              this.alopData = data.quotation.alop===null ? this.alopData : data.quotation.alop;
              this.alopData.issueDate = this.alopData.issueDate[0]+'-'+("0" + this.alopData.issueDate[1]).slice(-2)+'-'+  ("0" + this.alopData.issueDate[2]).slice(-2);
              this.alopData.expiryDate = this.alopData.expiryDate[0]+'-'+("0" + this.alopData.expiryDate[1]).slice(-2)+'-'+ ("0" + this.alopData.expiryDate[2]).slice(-2);
              this.alopData.indemFromDate = this.alopData.indemFromDate[0]+'-'+("0" + this.alopData.indemFromDate[1]).slice(-2)+'-'+("0" + this.alopData.indemFromDate[2]).slice(-2);
              setTimeout(() => {
                $('input[appCurrency]').focus();
                $('input[appCurrency]').blur();
              }, 0)
       });
    }


    save() {
      this.alopData.quoteId = this.quoteId;
      this.quotationService.saveQuoteAlop(this.alopData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          $('#successModalBtn').trigger('click');
          this.getAlop();
        }
      });
      // this.ngOnInit();
    }

    openAlopItem(){
      this.quotationService.getALOPItemInfos(this.quoteNo,this.quoteId).subscribe((data: any) => {
            if(data.quotation[0] !==undefined){
              this.itemInfoData.nData.itemNo = data.quotation[0] === undefined ? 1:data.quotation[0].alop.alopItemList.length + 1; 
              for (var i=0; i < data.quotation[0].alop.alopItemList.length; i++) {
                this.itemInfoData.tableData.push(data.quotation[0].alop.alopItemList[i]);
              }
              this.itemInfoData.tableData = this.itemInfoData.tableData.sort(function(a,b){return a.itemNo - b.itemNo})
            }
            this.table.refreshTable();
            
        });
      while(this.itemInfoData.tableData.length>0){
        this.itemInfoData.tableData.pop();
      }
      $('#alopItemModal #modalBtn').trigger('click');
       
    }

    saveAlopItem(){
      let savedData: any = {};
      savedData.quoteId = this.quoteId;
      savedData.alopId = this.alopData.alopId;
      savedData.saveAlopItemList=[];
      savedData.deleteAlopItemList=[];
      for (var i = 0 ; this.itemInfoData.tableData.length > i; i++) {
        if(this.itemInfoData.tableData[i].edited && !this.itemInfoData.tableData[i].deleted){
            savedData.saveAlopItemList.push(this.itemInfoData.tableData[i]);
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createDate = new Date(savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createDate[0],savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createDate[1]-1,savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createDate[2]).toISOString();
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateDate = new Date(savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateDate[0],savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateDate[1]-1,savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateDate[2]).toISOString();
        }else if(this.itemInfoData.tableData[i].deleted){
            savedData.deleteAlopItemList.push(this.itemInfoData.tableData[i]);
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createDate = new Date(savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createDate[0],savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createDate[1]-1,savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createDate[2]).toISOString();
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateDate = new Date(savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateDate[0],savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateDate[1]-1,savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateDate[2]).toISOString();
        }
      }
      console.log(JSON.stringify(savedData));
      this.quotationService.saveQuoteAlopItem(savedData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.errorMdlMessage = data['errorList'][0].errorMessage;
          $('#errorMdl > #modalBtn').trigger('click');
        } else{
          $('app-sucess-dialog #modalBtn').trigger('click');
        }
      });
      
  }

  showInsuredLOV(){
    $('#insuredLOV #modalBtn').trigger('click');
  }

  setInsured(data){
    // this.alopData.insuredName = data.insuredName;
    // this.alopData.insuredId = data.insuredId;

    this.alopData.insuredName = data.data.insuredName;
    this.alopData.insuredId = data.data.insuredId;
  }

  openGenericLOV(selector){
    this.passLOV.selector = selector;
    $('#lov #modalBtn').trigger('click');
  }

  updateItemInfoData(data){
    let delCount : number = 0;
    let delFlag:boolean ;
    do {
      delFlag = false;
      for (var i = 0; i < data.length-delCount; ++i) {
        console.log(data[i]);
        
        if(data[i].deleted){
          delCount ++;
          this.adjustItemNo(data,i);
          delFlag = true;
          data[i].checked = false;
        }
      }
    } while (delFlag);
    

    for (var i = data.length - 1; i >= data.length -delCount; i--) {
      data[i].deleted = true;
      data[i].edited = true;
    }



    this.itemInfoData.tableData=data;
    this.itemInfoData.nData.itemNo =  this.itemInfoData.tableData.length + 1 ; 
    this.table.refreshTable();
    console.log(this.itemInfoData.nData.itemNo);
  }

  adjustItemNo(data,index){
    let keys:string[] = Object.keys(data[index]);
    for(var i = index ; i < data.length-1; i++ ){
      for (var key in keys) {
        if(keys[key] == 'itemNo'){
          continue;
        }
        data[i][keys[key]] = data[i+1][keys[key]]
      }
      data[i].edited = true;
    }
    console.log(data);
  }

  triggerCurrencyDirective(){

  }

  testOnly(){
    console.log(this.from);
    console.log(this.to);
  }

  checkDates(){
    console.log(this.alopData.issueDate);
    console.log(this.alopData.expiryDate);
    if(new Date(this.alopData.issueDate)>= new Date(this.alopData.expiryDate)){
     highlight(this.to);
     highlight(this.from);
    }
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  onClickSaveAlopItem(){
    $('#alopItem #confirm-save #modalBtn2').trigger('click');
  }


}
