import { Component, OnInit, Input,  ViewChild, ViewChildren, QueryList } from '@angular/core';
import { QuotationService, MaintenanceService, NotesService } from '../../_services';
import { QuoteALOPItemInformation, QuoteALOPInfo, QuotationOption } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { highlight,unHighlight } from '@app/_directives/highlight';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { RequiredDirective } from '@app/_directives/required.directive';
import { FormsModule }   from '@angular/forms';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

 
@Component({
    selector: 'app-quo-alop',
    templateUrl: './quo-alop.component.html',
    styleUrls: ['./quo-alop.component.css']
})
export class QuoAlopComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(CustNonDatatableComponent) tableNonEditable: CustNonDatatableComponent;
  @ViewChild("from") from:any;
  @ViewChild("to") to:any;
  @ViewChildren(RequiredDirective) inputs: QueryList<RequiredDirective>;
  @ViewChild('myForm') form:any;
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

   alopData: any={
                     address: null,
                     alopId: '1',
                     alopItem: null,
                     alopItemList: null,
                     // annSiD: null,
                     //indemFromDate: null,
                     insuredBusiness: null,
                     insuredDesc: null,
                     insuredId: null,
                     insuredName: null,
                     // maxIndemPd: null,
                     // maxIndemPdD: null,
                     // maxIndemPdSiD: null,
                     // repInterval: null,
                     // timeExc: null,
                     alopDetails: []
    };

    alopDetails: any = {
            optionId: null,
            annSi: null,
            maxIndemPdSi: null,
            issueDate: '',
            expiryDate:'',
            maxIndemPd: null,
            indemFromDate: '',
            timeExc: null,
            repInterval: null,
            updateDate: '',
            updateUser: 'Paul',
            createDate:  '',
            createUser: 'Paul'
    }

         
     

    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Minimization"],
        dataTypes: ["number", "number", "text", "text", "text"],
        uneditable: [true,false,false,false,false,false],
        nData: {
          createDate: '',
          createUser: "Paul",
          description: null,
          importance: null,
          itemNo: 1,
          lossMin: null,
          quantity: null,
          updateDate: '',
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

    quoteOptionsData: any = {
        tableData: [],
        tHeader: ['Option No', 'Rate(%)', 'Conditions', 'Comm Rate Quota(%)', 'Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
        dataTypes: ['text', 'percent', 'text', 'percent', 'percent', 'percent', 'percent'],
        resizable: [false, false, true, false, false, false],
        pagination: true,
        pageStatus: true,
        tableOnly: true,
        pageLength: 3,
        keys: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac']
    } 

    passLOV: any = {
      selector: 'insured',
    }
    
    loading:boolean = true;
    dialogMessage:string = "";
    dialogIcon: string = "";
    showAlopItem:boolean = false;
    dateErFlag:boolean = false;
    refresh:boolean = true;
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute, private mtnService: MaintenanceService, private ns: NotesService) { }

    ngOnInit() {
      setTimeout(()=>{
        
      },0);
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
            this.itemInfoData.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Minimization"];
            this.itemInfoData.dataTypes = ["number", "number", "text", "text"];
            this.itemInfoData.keys = ['itemNo','quantity','description','lossMin'];
        }
        this.getAlop();
        this.getQuoteOption();
    }

    getQuoteOption(){
      var id = this.quotationInfo.quoteId == '' ? '' : this.quotationInfo.quoteId;
      this.quotationService.getQuoteOptions(id, '').subscribe((data: any) => {
        console.log(data)
          // this.optionRecords = data.QuotationOption.optionsList; this.plainQuotationNo(this.quotationNum)
           if (data['quotation'] == null || data['quotation'] == undefined ){
           }else{
              // for(var i = data.quotation.optionsList.length - 1; i >= 0; i--){
                for(var i = 0; i < data.quotation.optionsList.length; i++){
                 this.quoteOptionsData.tableData.push(data.quotation.optionsList[i]);
              }
              
           }
         this.tableNonEditable.refreshTable();
      });
    }

    getAlop(){
      this.quotationService.getALop(null,this.quoteNo).subscribe((data: any) => {
             this.quoteId = data.quotation.quoteId;
              this.alopData = data.quotation.alop===null ? this.alopData : data.quotation.alop;
              if(this.alopData.alopDetails.length != 0){
                this.loading = false;
                for(var i=0; i < this.alopData.alopDetails.length;i++){
                  this.alopData.alopDetails[i].indemFromDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].indemFromDate);
                  this.alopData.alopDetails[i].expiryDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].expiryDate);
                  this.alopData.alopDetails[i].issueDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].issueDate);
                  this.alopData.alopDetails[i].createDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].createDate);
                  this.alopData.alopDetails[i].updateDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].updateDate);
                }
                // this.alopData.issueDate = this.alopData.issueDate[0]+'-'+("0" + this.alopData.issueDate[1]).slice(-2)+'-'+  ("0" + this.alopData.issueDate[2]).slice(-2);
                // this.alopData.expiryDate = this.alopData.expiryDate[0]+'-'+("0" + this.alopData.expiryDate[1]).slice(-2)+'-'+ ("0" + this.alopData.expiryDate[2]).slice(-2);
                // this.alopData.indemFromDate = this.alopData.indemFromDate[0]+'-'+("0" + this.alopData.indemFromDate[1]).slice(-2)+'-'+("0" + this.alopData.indemFromDate[2]).slice(-2);
              }else{
                this.mtnService.getMtnInsured(this.quotationInfo.principalId).subscribe((data: any) => {
                  this.loading = false;
                  this.alopData.insuredId = data.insured[0].insuredId;
                  this.alopData.insuredName = data.insured[0].insuredAbbr;
                  this.alopData.insuredDesc = data.insured[0].insuredName;
                  this.alopData.address = data.insured[0].address;
                })
              }
              this.emptyVar();
       });
    }

    emptyVar(){
        this.alopDetails =  {
                optionId: null,
                annSi: null,
                maxIndemPdSi: null,
                issueDate: '',
                expiryDate:'',
                maxIndemPd: null,
                indemFromDate: '',
                timeExc: null,
                repInterval: null,
                updateDate: '',
                updateUser: 'Paul',
                createDate:  '',
                createUser: 'Paul'
        }
    }

    cancelFlag:boolean;
    save(cancelFlag?) {
      this.cancelFlag = cancelFlag !== undefined;
      this.alopData.quoteId = this.quoteId;
      //this.alopData.alopDetails = this.alopDetails;
      for(var i = 0; i < this.alopData.alopDetails.length;i++){
        this.alopData.alopDetails[i].createDate = this.alopData.alopDetails[i].createDate
        this.alopData.alopDetails[i].indemFromDate = this.alopData.alopDetails[i].indemFromDate
        this.alopData.alopDetails[i].updateDate = this.alopData.alopDetails[i].updateDate
         this.alopData.alopDetails[i].expiryDate = this.alopData.alopDetails[i].expiryDate
         this.alopData.alopDetails[i].issueDate = this.alopData.alopDetails[i].issueDate
     }

      this.quotationService.saveQuoteAlop(this.alopData).subscribe((data: any) => {
        // this.alopData.issueDate = this.alopData.issueDate.split('T')[0];
        // this.alopData.expiryDate = this.alopData.expiryDate.split('T')[0];
        // this.alopData.indemFromDate = this.alopData.indemFromDate.split('T')[0];
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          // this.refresh = false;
          // setTimeout(()=>{
          //   this.refresh = true;
          // },0)
          this.form.control.markAsPristine()

          this.getAlop();
        }
      });
      // this.ngOnInit();
    }

    openAlopItem(){
      this.showAlopItem = true;
      this.itemInfoData.tableData = [];
      this.itemInfoData.nData.itemNo =  this.itemInfoData.tableData.filter((data)=>{return !data.deleted}).length + 1 ;
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
      setTimeout(()=>{
        $('#alopItemModal #modalBtn').trigger('click');
      },0)
      
       
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
      this.quotationService.saveQuoteAlopItem(savedData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogIcon = "succuess";
          $('#successModalBtn').trigger('click');
          this.table.markAsPristine();
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
    this.form.control.markAsDirty();
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
    this.itemInfoData.nData.itemNo =  this.itemInfoData.tableData.filter((data)=>{return !data.deleted}).length + 1 ; 
    this.table.refreshTable();
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
  }

  triggerCurrencyDirective(){

  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  checkDates(){
    // if(new Date(this.alopData.issueDate)>= new Date(this.alopData.expiryDate)){
    //  highlight(this.to);
    //  highlight(this.from);
    //  this.dateErFlag = true;
    // }else{
    //  unHighlight(this.to);
    //  unHighlight(this.from);
    //  this.dateErFlag = false;
    // }
  }

  onClickSave(){
    if(!this.dateErFlag)
      $('#alop #confirm-save #modalBtn2').trigger('click');
    else{
      this.dialogMessage = "Please check date fields";
      this.dialogIcon = "error";
      $('#successModalBtn').trigger('click');
    }
  }

  onClickSaveAlopItem(){
    $('#alopItem #confirm-save #modalBtn2').trigger('click');
  }

  clickRow(data) {
    console.log(this.alopData)
    this.alopDetails.optionId = data.optionId;
    if(this.alopData.alopDetails.length != 0){
      this.alopDetails = this.alopData.alopDetails.filter(a => a.optionId == this.alopDetails.optionId)[0];
    }else{
      //this.alopData.alopDetails = [];

      let alopDetails = new Object();
      alopDetails['optionId'] = data.optionId;
      alopDetails['annSi'] = null;
      alopDetails['maxIndemPdSi'] = null;
      alopDetails['issueDate'] = '';
      alopDetails['expiryDate'] = '';
      alopDetails['maxIndemPd'] = null;
      alopDetails['indemFromDate'] = '';
      alopDetails['timeExc'] = null;
      alopDetails['repInterval'] = null;
      alopDetails['updateDate'] = '';
      alopDetails['updateUser'] = 'Paul';
      alopDetails['createDate'] =  '';
      alopDetails['createUser'] = 'Paul';
      this.alopData.alopDetails.push(alopDetails)
      
      this.alopDetails = alopDetails
    }
  }

}
