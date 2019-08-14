import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService, MaintenanceService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { FormsModule }   from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { highlight,unHighlight } from '@app/_directives/highlight';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild('cancelButtonComponent') cancelBtn : CancelButtonComponent;
  @ViewChild('cancelModalComponent') cancelModalBtn : CancelButtonComponent;
  @ViewChild('myForm') form:any;
  @ViewChild("from") from:any;
  @ViewChild("to") to:any;
  @ViewChild("indemFrom") indemFrom:any;
  @ViewChild('alopSuccess') successDiag: SucessDialogComponent;
  @ViewChild('alopItemSuccess') successItemDiag: SucessDialogComponent;
  @ViewChild('itemInfoModal') itmInfoMdl: ModalComponent;

  aLOPInfo: ALOPInfo = new ALOPInfo();
  
 
  policyRecordInfo: any = {};
  

  passDataCar: any = {
    tableData: [],
    tHeader: ["Item No", "Description", "Possible Loss Minimization"],
    dataTypes: ["text","text","text"],
    keys: ["itemNo", "description", "lossMin"],
    nData: {
      itemNo: '',
      description: '',
      lossMin: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
    },
    uneditable: [true, false, false],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };

  passDataEar: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    keys: ["itemNo", "quantity", "description", "importance", "lossMin"],
    uneditable: [true, false, false, false, false],
    nData: {
      itemNo: '',
      quantity: '',
      description: '',
      important: '',
      lossMin: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
    },
    selectFlag: false,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };

  passLOV: any = {
      selector: 'insured',
    }
  nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
  line: string;
  pageType: string;
  sub: any;
  policyNo:string = '';
  policyId: string;
  cancelFlag:boolean;
  dateErFlag:boolean = false;
  dialogMessage:string = "";
  polURL:string = "";
  dialogIcon: string = "";
  showAlopItem:boolean = false;
  newAlt: boolean = false;
  prevPolicyId: string;
  prevPolNo: string;
  promptClickItem:boolean = false;
  savedData: any = {};

  @Input() policyInfo:any = {};
  @Input() alterFlag: boolean;
  polAlopData: any={
                     insId: null,
                     insuredName: null,
                     insuredDesc: null,
                     address: null,
                     annSi: null,
                     maxIndemPdSi: null,
                     issueDate: '',
                     expiryDate: '',
                     maxIndemPd: null,
                     indemFromDate: null,
                     timeExc: null,
                     repInterval: null,
                     createUser: null,
                     createDate: null,
                     updateUser: null,
                     updateDate: null
  };

  constructor(private underwritingService: UnderwritingService, public modalService: NgbModal, private route: ActivatedRoute, private titleService: Title, private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | ALOP");
    this.sub = this.route.params.subscribe(params => {
      this.policyNo = params['policyNo']
      this.line = params['line'];
      //this.prevPolicyId = params['prevPolicyId'] == undefined ? '' : params['prevPolicyId'];;
      this.prevPolicyId = this.policyInfo.prevPolicyId
    });

    if(this.line == 'EAR'){
      this.passDataCar.tHeader = ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Minimization"];
      this.passDataCar.dataTypes = ["text", "text", "text", "text", "text"]
      this.passDataCar.keys = ['itemNo','quantity','description','importance','lossMin']
    }

    if(this.underwritingService.fromCreateAlt) {
        this.newAlt = true;
    }

    this.polURL =  (this.alterFlag) ? 'alt-policy-listing' : 'policy-listing';

    this.getPolAlop();

    //paul
    if(this.policyInfo.fromInq=='true'){
      this.passDataCar.uneditable = [true,true,true,true,true,true];
      this.passDataEar.uneditable = [true,true,true,true,true,true];
      this.passDataCar.checkFlag = false;
      this.passDataEar.checkFlag = false;
      this.passDataCar.addFlag = false;
      this.passDataEar.addFlag = false;
      this.passDataCar.deleteFlag = false;
      this.passDataEar.deleteFlag = false;
    }
    console.log(this.policyInfo)
  }

  getPolAlop() {
    this.underwritingService.getPolAlop(this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {
      
      if (data.policy != null) {

        this.policyId = data.policy.policyId;
        this.polAlopData = data.policy.alop;
        this.polAlopData.issueDate = this.polAlopData.issueDate == null? null:this.ns.toDateTimeString(this.polAlopData.issueDate);
        this.polAlopData.expiryDate = this.polAlopData.expiryDate == null? null:this.ns.toDateTimeString(this.polAlopData.expiryDate);
        this.polAlopData.indemFromDate = this.polAlopData.indemFromDate == null? null:this.ns.toDateTimeString(this.polAlopData.indemFromDate);
        this.polAlopData.createDate = this.ns.toDateTimeString(this.polAlopData.createDate);
        this.polAlopData.updateDate = this.ns.toDateTimeString(this.polAlopData.updateDate);
        
        if(data.policy.policyId != this.policyInfo.policyId && this.policyInfo.fromInq!='true'){
          this.form.control.markAsDirty()
          this.polAlopData.annSi = '';
        }
        this.getSumInsured();

      } else {
        this.mtnService.getMtnInsured(this.policyInfo.principalId).subscribe((data: any) => {
          this.polAlopData.insId = data.insured[0].insuredId;
          this.polAlopData.insuredName = data.insured[0].insuredAbbr;
          this.polAlopData.insuredDesc = data.insured[0].insuredName;
          this.polAlopData.address = data.insured[0].address;

          this.polAlopData.createUser = JSON.parse(window.localStorage.currentUser).username
          this.polAlopData.createDate = this.ns.toDateTimeString(new Date());
          this.polAlopData.updateDate = this.ns.toDateTimeString(new Date());
          this.polAlopData.updateUser = JSON.parse(window.localStorage.currentUser).username
          this.getSumInsured();
        });

        this.underwritingService.getPolGenInfo(this.policyInfo.policyId, null).subscribe((data:any) => {
          if (data.policy != null) {
            this.policyId = data.policy.policyId;
            this.polAlopData.issueDate = data.policy.inceptDate == null? null:this.ns.toDateTimeString(data.policy.inceptDate);
            this.polAlopData.expiryDate = data.policy.expiryDate == null? null:this.ns.toDateTimeString(data.policy.expiryDate);
            this.polAlopData.indemFromDate = data.policy.alop.indemFromDate == null? null:this.ns.toDateTimeString(data.policy.alop.indemFromDate);
            this.polAlopData.createDate = this.ns.toDateTimeString(data.policy.alop.createDate);
            this.polAlopData.updateDate = this.ns.toDateTimeString(data.policy.alop.updateDate);
          }
        });
      }
    });
  }

  getSumInsured(){
   if(!this.alterFlag){
     this.underwritingService.getUWCoverageInfos(null,this.policyInfo.policyId).subscribe((data:any) => {
       if (data.policy != null) {
         var sectionCovers = data.policy.project.coverage.sectionCovers;
         for( var i = 0; i < sectionCovers.length;i++){
           if(sectionCovers[i].coverCd == 16){
             this.polAlopData.annSi = sectionCovers[i].sumInsured;
           }
         }
         this.polAlopData.maxIndemPdSi = isNaN(this.polAlopData.maxIndemPd) ? 0: ((this.polAlopData.maxIndemPd/12)*this.polAlopData.annSi);
       }
     });
   }else{
     this.underwritingService.getUWCoverageInfos(null,this.policyInfo.policyId).subscribe((data:any) => {
       console.log(data)
       if (data.policy != null) {
         var sectionCovers = data.policy.project.coverage.sectionCovers;
         for( var i = 0; i <sectionCovers.length;i++){
           if(sectionCovers[i].coverCd == 16){
             this.polAlopData.annSi = sectionCovers[i].cumSi;
           }
         }
         console.log(this.polAlopData.annSi)
         this.polAlopData.maxIndemPdSi = isNaN(this.polAlopData.maxIndemPd) ? 0: ((this.polAlopData.maxIndemPd/12)*this.polAlopData.annSi);
       } 
     });
   }
 }

  getPolAlopItem() {
    this.underwritingService.getPolAlopItem(this.policyNo, this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {
      this.passDataCar.tableData = [];

      if(data.policy != null){
        var dataInfos = data.policy.alop.alopItem;

        for(var i=0;i<dataInfos.length;i++){
          this.passDataCar.tableData.push(dataInfos[i]);
        }

      }
      this.table.refreshTable();
      this.table.loadingFlag = false;

    });
  }

  savePolAlop(cancelFlag?) {
    this.cancelFlag = cancelFlag != undefined;

    this.polAlopData.policyId = this.policyInfo.policyId;
    this.polAlopData.policyNo = this.policyInfo.policyNo;

    if (this.validateALOPFields(this.polAlopData)) {
      this.underwritingService.savePolAlop(this.polAlopData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          this.successDiag.open();
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          this.successDiag.open()

          if(this.newAlt) {
            this.newAlt = false;
            this.underwritingService.fromCreateAlt = false;
          }

          this.form.control.markAsPristine()
          this.getPolAlop();
        }
      });
    } else {
      this.dialogMessage="Please check field values.";
      this.dialogIcon = "error";
      this.successDiag.open();

      setTimeout(()=>{$('.globalLoading').css('display','none');},0);
    }

  }

  savePolAlopItem(cancelFlag?){
     this.cancelFlag = cancelFlag != undefined;
     this.prepareDataItem();
     if (this.validateALOPItemFields(this.savedData)) {
       this.underwritingService.savePolAlopItem(this.savedData).subscribe((data: any) => {
          if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successItemDiag.open();
          } else{
            this.dialogIcon = "success";
            this.successItemDiag.open();
            this.table.markAsPristine();
            if(cancelFlag !== undefined){
              this.itmInfoMdl.closeModal();
            }
            if(this.newAlt) {
              this.newAlt = false;
              this.underwritingService.fromCreateAlt = false;
            }
            this.getPolAlopItem();
          }
        });
     } else {
       this.dialogMessage="Please check field values.";
       this.dialogIcon = "error";
       this.successItemDiag.open();

       setTimeout(()=>{$('.globalLoading').css('display','none');},0);
     }

  }

  prepareDataItem(){
    this.savedData.policyId = this.policyInfo.policyId;
    this.savedData.savePolAlopItemList=[];
    this.savedData.deletePolAlopItemList=[];

    for( var i =0; i< this.passDataCar.tableData.length;i++){
        if (this.passDataCar.tableData[i].edited && !this.passDataCar.tableData[i].deleted) {
           this.savedData.savePolAlopItemList.push(this.passDataCar.tableData[i]);
           this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
           this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].createDate);
           this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
           this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(this.savedData.savePolAlopItemList[this.savedData.savePolAlopItemList.length-1].updateDate);
        } else if (this.passDataCar.tableData[i].deleted) {
           this.savedData.deletePolAlopItemList.push(this.passDataCar.tableData[i]);
           this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
           this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
           this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].createDate);
           this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
           this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(this.savedData.deletePolAlopItemList[this.savedData.deletePolAlopItemList.length-1].updateDate);
        }
    }
  }

  openAlopItem(){
      
      /*this.getPolAlopItem();
      setTimeout(()=>{
        $('#alopItemModal #modalBtn').trigger('click');
      },0)
*/
      if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
        this.promptClickItem = true;
        this.onClickSavePolAlop();
      }else{
        this.promptClickItem = false;
        this.showAlopItem = true;
        this.passDataCar.tableData = [];
        this.table.loadingFlag = true;
        this.getPolAlopItem();
        setTimeout(()=>{
          this.itmInfoMdl.openNoClose();
        },0);
      }
  }


  cancelButton() {
    this.cancelBtn.clickCancel();
  }

  cancelModal() {
    this.prepareDataItem();
    if(this.savedData.savePolAlopItemList.length == 0 && this.savedData.deletePolAlopItemList.length == 0){
      this.modalService.dismissAll();
    }else{
      this.cancelModalBtn.clickCancel();
    }
  }


  openGenericLOV(selector){
    this.passLOV.selector = selector;
    $('#lov #modalBtn').trigger('click');
  }

  setInsured(data){
    this.polAlopData.insuredName = data.data.insuredAbbr;
    this.polAlopData.insuredDesc = data.data.insuredName;
    this.polAlopData.insId = data.data.insuredId;
    this.polAlopData.address = data.data.address;
    this.form.control.markAsDirty();
  }

  onClickSavePolAlop(){
    if(!this.dateErFlag)
      $('#polAlop #confirm-save #modalBtn2').trigger('click');
    else{
      this.dialogMessage = "Please check date fields";
      this.dialogIcon = "error";
      this.successDiag.open();
    }
  }

  onClickSavePolAlopItem(){
    $('#polAlopItem #confirm-save #modalBtn2').trigger('click');
  }

  checkDates(){
    if((new Date(this.polAlopData.issueDate) >= new Date(this.polAlopData.expiryDate))){
      console.log('pasok')
     highlight(this.to);
     highlight(this.from);
     this.dateErFlag = true;
    }else{
     unHighlight(this.to);
     unHighlight(this.from);
     this.dateErFlag = false;
    }

    if(!this.dateErFlag){
      if((new Date(this.polAlopData.indemFromDate) <= new Date(this.polAlopData.expiryDate))){
        highlight(this.to);
        highlight(this.indemFrom);
        this.dateErFlag = true;
      }else{
        unHighlight(this.to);
        unHighlight(this.indemFrom);
        this.dateErFlag = false;
      }
    }
    
    if(this.polAlopData.issueDate == ""){
      this.polAlopData.issueDate = null;
    }else if(this.polAlopData.expiryDate == ""){
      this.polAlopData.expiryDate = null
    }
  }

  validateALOPFields(obj) {
    var req = ['insuredDesc', 'maxIndemPd', 'timeExc', 'repInterval'];
    var entries = Object.entries(obj);

    for (var[key, val] of entries) {
      if ((val == '' || val == null) && req.includes(key)) {
        return false;
      }
    }

    return true;
  }

  validateALOPItemFields(obj) {
    for (let rec of obj.savePolAlopItemList) {
       var entries = Object.entries(rec);

       for (var[key, val] of entries) {
         if ((val == '' || val == null) && 'description' === key) {
           return false;
         }
       }
    }
    return true;
  }

}
