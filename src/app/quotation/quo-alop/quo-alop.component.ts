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
import { MtnInsuredComponent } from '@app/maintenance/mtn-insured/mtn-insured.component';

 
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
  @ViewChildren(MtnInsuredComponent) insuredLovs: QueryList<MtnInsuredComponent>;



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
  readonlyFlag: boolean = true;
  alopSI: number = 0;
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
                     alopDetails:[]
                     // maxIndemPd: null,
                     // maxIndemPdD: null,
                     // maxIndemPdSiD: null,
                     // repInterval: null,
                     // timeExc: null
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
            updateDateAlop: new Date(),
            updateUserAlop: JSON.parse(window.localStorage.currentUser).username,
            createDateAlop:  new Date(),
            createUserAlop: JSON.parse(window.localStorage.currentUser).username
    }

    newAlopDetails: any = {
            optionId: null,
            annSi: null,
            maxIndemPdSi: null,
            issueDate: null,
            expiryDate:null,
            maxIndemPd: null,
            indemFromDate: null,
            timeExc: null,
            repInterval: null,
            updateDateAlop: new Date(),
            updateUserAlop: JSON.parse(window.localStorage.currentUser).username,
            createDateAlop:  new Date(),
            createUserAlop: JSON.parse(window.localStorage.currentUser).username
    }
         
     

    itemInfoData: any = {
        tableData: [],
        tHeader: ["Item No", "Quantity", "Description", "Possible Loss Minimization"],
        dataTypes: ["number", "number", "text", "text"],
        uneditable: [true,false,false,false,false],
        nData: {
          createDate: new Date(),
          createUser: JSON.parse(window.localStorage.currentUser).username,
          description: null,
          itemNo: null,
          importance: null,
          lossMin: null,
          quantity: null,
          updateDate: new Date(),
          updateUser: JSON.parse(window.localStorage.currentUser).username,
        },
        addFlag: true,
        deleteFlag: true,
        infoFlag: true,
        paginateFlag: true,
        keys:['itemNo','quantity','description','lossMin'],
        widths:[1,1,1,1,1],
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
    optionsList:any = [];
    disabledFlag:boolean = true;

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private route: ActivatedRoute, private mtnService: MaintenanceService, private ns: NotesService) { }

    ngOnInit() {
      this.titleService.setTitle("Quo | ALOP");
      
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

       if (this.quoteNo.substr(0, 3) == "EAR") {
           this.itemInfoData.tHeader = ["Item No", "Quantity", "Description","Relative Importance", "Possible Loss Minimization"];
           this.itemInfoData.dataTypes = ["number", "number", "text", "text", "text"];
           this.itemInfoData.keys = ['itemNo','quantity','description','importance','lossMin'];
           this.itemInfoData.widths = [1,1,1,1,1]
       }
        this.getAlop();
        this.getQuoteOption();
        this.getAlopSumInsured();
    }

    getQuoteOption(){
      var id = this.quotationInfo.quoteId == '' ? '' : this.quotationInfo.quoteId;
      this.quotationService.getQuoteOptions(id, '').subscribe((data: any) => {

          // this.optionRecords = data.QuotationOption.optionsList; this.plainQuotationNo(this.quotationNum)
           if (data['quotation'] == null || data['quotation'] == undefined ){
           }else{
              // for(var i = data.quotation.optionsList.length - 1; i >= 0; i--){
                for(var i = 0; i < data.quotation.optionsList.length; i++){
                 console.log(data.quotation.optionsList[i].otherRatesList);
                 data.quotation.optionsList[i].optionRt = data.quotation.optionsList[i].otherRatesList.find(a=>a.coverCdDesc==='Advance Loss of Profit').rate;
                 this.quoteOptionsData.tableData.push(data.quotation.optionsList[i]);
              }
              
           }
         this.tableNonEditable.refreshTable();
      });
    }

    getAlop(){
      this.quotationService.getALop(this.quotationInfo.quoteId,'').subscribe((data: any) => {
             this.loading = false;
             if(data.quotation != null){
              this.quoteId = data.quotation.quoteId;
              this.alopData = data.quotation.alop===null ? this.alopData : data.quotation.alop;
              this.alopData.createDate = this.ns.toDateTimeString(this.alopData.createDate);
              this.alopData.updateDate = this.ns.toDateTimeString(this.alopData.updateDate);
              this.optionsList = data.quotation.optionsList;
              /*for(var i=0;i<data.quotation.optionsList.length;i++){
                this.alopDetails = data.quotation.optionsList
              }*/
              
                /*if(this.alopData == null){
                  this.alopData.alopDetails.indemFromDate = this.ns.toDateTimeString(this.alopData.alopDetails.indemFromDate);
                  this.alopData.alopDetails.expiryDate = this.ns.toDateTimeString(this.alopData.alopDetails.expiryDate);
                  this.alopData.alopDetails.issueDate = this.ns.toDateTimeString(this.alopData.alopDetails.issueDate);
                  this.alopData.alopDetails.createDateAlop = this.ns.toDateTimeString(this.alopData.alopDetails.createDateAlop);
                  this.alopData.alopDetails.updateDateAlop = this.ns.toDateTimeString(this.alopData.alopDetails.updateDateAlop);
                }else{
                  this.mtnService.getMtnInsured(this.quotationInfo.principalId).subscribe((data: any) => {
                    this.alopData.insuredId = data.insured[0].insuredId;
                    this.alopData.insuredName = data.insured[0].insuredAbbr;
                    this.alopData.insuredDesc = data.insured[0].insuredName;
                    this.alopData.address = data.insured[0].address;
                  })
                }*/
              //if(this.alopData.alopDetails.length != 0){
               /* if(data.quotation.optionsList[0].alopDetails.length != 0){
                for(var i=0; i < this.alopData.alopDetails.length;i++){
                  this.alopData.alopDetails[i].indemFromDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].indemFromDate);
                  this.alopData.alopDetails[i].expiryDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].expiryDate);
                  this.alopData.alopDetails[i].issueDate = this.ns.toDateTimeString(this.alopData.alopDetails[i].issueDate);
                  this.alopData.alopDetails[i].createDateAlop = this.ns.toDateTimeString(this.alopData.alopDetails[i].createDateAlop);
                  this.alopData.alopDetails[i].updateDateAlop = this.ns.toDateTimeString(this.alopData.alopDetails[i].updateDateAlop);
                }
                // this.alopData.issueDate = this.alopData.issueDate[0]+'-'+("0" + this.alopData.issueDate[1]).slice(-2)+'-'+  ("0" + this.alopData.issueDate[2]).slice(-2);
                // this.alopData.expiryDate = this.alopData.expiryDate[0]+'-'+("0" + this.alopData.expiryDate[1]).slice(-2)+'-'+ ("0" + this.alopData.expiryDate[2]).slice(-2);
                // this.alopData.indemFromDate = this.alopData.indemFromDate[0]+'-'+("0" + this.alopData.indemFromDate[1]).slice(-2)+'-'+("0" + this.alopData.indemFromDate[2]).slice(-2);
              }else{
                this.mtnService.getMtnInsured(this.quotationInfo.principalId).subscribe((data: any) => {
                  this.alopData.insuredId = data.insured[0].insuredId;
                  this.alopData.insuredName = data.insured[0].insuredAbbr;
                  this.alopData.insuredDesc = data.insured[0].insuredName;
                  this.alopData.address = data.insured[0].address;
                })
              }*/
              //this.emptyVar();
            }else{
                this.mtnService.getMtnInsured(this.quotationInfo.principalId).subscribe((data: any) => {
                  this.alopData.insuredId = data.insured[0].insuredId;
                  this.alopData.insuredName = data.insured[0].insuredAbbr;
                  this.alopData.insuredDesc = data.insured[0].insuredName;
                  this.alopData.address = data.insured[0].address;
                })

                this.alopData.createUser = JSON.parse(window.localStorage.currentUser).username
                this.alopData.createDate = this.ns.toDateTimeString(new Date());
                this.alopData.updateDate = this.ns.toDateTimeString(new Date());
                this.alopData.updateUser = JSON.parse(window.localStorage.currentUser).username
            }
       });
    }

    emptyVar(){
        this.alopDetails =  {
                issueDate: null,
                expiryDate:null,
                indemFromDate: null
        }
    }

    cancelFlag:boolean;

    save(cancel?) {
      this.cancelFlag = cancel !== undefined;

      this.alopData.quoteId = this.quotationInfo.quoteId;
      this.alopData.alopDetails = [];
      console.log(this.optionsList)
      for(let option of this.optionsList){
          option.alopDetails.optionId = option.optionId;
          option.alopDetails.createDateAlop = this.ns.toDateTimeString(option.alopDetails.createDateAlop);
          console.log(option.alopDetails.indemFromDate)
          option.alopDetails.indemFromDate = this.ns.toDateTimeString(option.alopDetails.indemFromDate);
          option.alopDetails.updateDateAlop = this.ns.toDateTimeString(option.alopDetails.updateDateAlop);
          option.alopDetails.expiryDate = this.ns.toDateTimeString(option.alopDetails.expiryDate);
          option.alopDetails.issueDate = this.ns.toDateTimeString(option.alopDetails.issueDate);
          this.alopData.alopDetails.push(option.alopDetails);
      }
      this.quotationService.saveQuoteAlop(this.alopData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          this.form.control.markAsPristine()
          this.getAlop();
          //this.emptyVar();
          this.alopDetails = this.alopData.alopDetails.filter(a => a.optionId == this.alopDetails.optionId)[0];
          this.optionsList = this.optionsList.filter(a => a.optionId == this.optionsList.optionId)[0];
        }
      });
      // this.ngOnInit();
    }

    openAlopItem(){
      this.itemInfoData.tableData = [];
      this.showAlopItem = true;
      this.alopItem();
      setTimeout(()=>{
        $('#alopItemModal #modalBtn').trigger('click');
      },0)
      
       
    }

    alopItem(){
      this.quotationService.getALOPItemInfos(this.quoteNo[0],this.quotationInfo.quoteId,this.tableNonEditable.indvSelect.optionId).subscribe((data: any) => {
            this.itemInfoData.tableData = [];
            var dataInfos = data.alopItem;
            for(var i=0; i< dataInfos.length;i++){
              this.itemInfoData.tableData.push(dataInfos[i]);
            }
            this.table.refreshTable();
      });

    }

    saveAlopItem(){
      let savedData: any = {};
      savedData.quoteId = this.quotationInfo.quoteId;
      
      savedData.saveAlopItemList=[];
      savedData.deleteAlopItemList=[];
      for (var i = 0 ; this.itemInfoData.tableData.length > i; i++) {
        if(this.itemInfoData.tableData[i].edited && !this.itemInfoData.tableData[i].deleted){
            savedData.saveAlopItemList.push(this.itemInfoData.tableData[i]);
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].optionId = this.tableNonEditable.indvSelect.optionId
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createUserItem = JSON.parse(window.localStorage.currentUser).username,
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].createDateItem = this.ns.toDateTimeString(0);
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateUserItem = JSON.parse(window.localStorage.currentUser).username,
            savedData.saveAlopItemList[savedData.saveAlopItemList.length-1].updateDateItem = this.ns.toDateTimeString(0);
        }else if(this.itemInfoData.tableData[i].deleted){
            savedData.deleteAlopItemList.push(this.itemInfoData.tableData[i]);
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].optionId = this.tableNonEditable.indvSelect.optionId
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createUserItem = JSON.parse(window.localStorage.currentUser).username,
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].createDateItem = this.ns.toDateTimeString(0);
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateUserItem = JSON.parse(window.localStorage.currentUser).username,
            savedData.deleteAlopItemList[savedData.deleteAlopItemList.length-1].updateDateItem = this.ns.toDateTimeString(0);
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
          this.alopItem();
        }
      });
      
  }

  showInsuredLOV(){
    $('#insuredLOV #modalBtn').trigger('click');
  }

  setInsured(data){
    // this.alopData.insuredName = data.insuredName;
    // this.alopData.insuredId = data.insuredId;
    this.alopData.insuredName = data.insuredAbbr;
    this.alopData.insuredId = data.insuredId;
    this.alopData.insuredDesc = data.insuredName;
    this.alopData.address = data.address;
    this.ns.lovLoader(data.ev, 0);
    this.form.control.markAsDirty();
  }

  openGenericLOV(selector){
    this.passLOV.selector = selector;
    $('#insuredLOV #modalBtn').trigger('click');
  }

  updateItemInfoData(data){
    /*let delCount : number = 0;
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
    //this.itemInfoData.nData.itemNo =  this.itemInfoData.tableData.filter((data)=>{return !data.deleted}).length + 1 ; 
    this.table.refreshTable();*/
  }

  /*adjustItemNo(data,index){
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
  }*/
  cancel(){
    this.cancelBtn.clickCancel();
  }

  checkDates(){
    console.log(new Date(this.alopDetails.issueDate))

    if((new Date(this.alopDetails.issueDate) >= new Date(this.alopDetails.expiryDate))){
     highlight(this.to);
     highlight(this.from);
     this.dateErFlag = true;
    }else{
     unHighlight(this.to);
     unHighlight(this.from);
     this.dateErFlag = false;
    }

    if(this.alopDetails.issueDate == ""){
      this.alopDetails.issueDate = null;
    }else if(this.alopDetails.expiryDate == ""){
      this.alopDetails.expiryDate = null
    }
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


  getAlopSumInsured(){
     this.quotationService.getCoverageInfo(null,this.quotationInfo.quoteId).subscribe((data: any) => {
       var sectionCover = data.quotation.project.coverage.sectionCovers;
       for(var i=0;i < sectionCover.length;i++){
         if(sectionCover[i].coverCdAbbr == 'ALOP'){
             this.alopSI = sectionCover[i].sumInsured;
         }
       }
     });
  }

  clickRow(data) {
      if(Object.keys(data).length == 0){
        this.readonlyFlag = true;
        this.emptyVar();
        unHighlight(this.to);
        unHighlight(this.from);
        this.disabledFlag = true;
      }else{
        /*console.log(this.optionsList)
        if(this.optionsList.length > 1){
          this.getAlop();
        }*/

        this.getAlopSumInsured();
        unHighlight(this.to);
        unHighlight(this.from);
        this.disabledFlag = false;
        this.readonlyFlag = false;
        this.alopDetails.optionId = data.optionId;
          if(this.optionsList.filter(a => a.optionId == data.optionId)[0] != undefined){
              this.alopDetails = this.optionsList.filter(a => a.optionId == data.optionId)[0].alopDetails
              this.alopDetails.annSi = this.alopSI;
              this.alopDetails.issueDate = this.ns.toDateTimeString(this.alopDetails.issueDate);
              this.alopDetails.expiryDate = this.ns.toDateTimeString(this.alopDetails.expiryDate);
              this.alopDetails.indemFromDate = this.ns.toDateTimeString(this.alopDetails.indemFromDate);
              this.alopDetails.maxIndemPdSi = ((this.alopDetails.maxIndemPd/12)*this.alopDetails.annSi);
          }else{
            //this.optionsList = []
            this.optionsList.push({
              optionId: data.optionId,
              alopDetails: JSON.parse(JSON.stringify(this.newAlopDetails))
            })
            this.alopDetails = this.optionsList[this.optionsList.length-1].alopDetails;
            this.alopDetails.annSi = this.alopSI;
            this.alopDetails.maxIndemPdSi = 0;
          }

        setTimeout(() => this.focusBlur(),0);
      }
  }

  focusBlur() {
    setTimeout(() => {$('.req').focus();$('.req').blur()},0)
  }

  checkCode(ev, field) {
    this.ns.lovLoader(ev, 1);
    $(ev.target).addClass('ng-dirty');

    if(field === 'principal') {
        this.insuredLovs['first'].checkCode(this.alopData.insuredId, '#insuredLOV', ev);
    }
  }
}
