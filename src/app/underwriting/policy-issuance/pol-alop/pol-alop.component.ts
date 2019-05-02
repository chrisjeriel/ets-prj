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

  aLOPInfo: ALOPInfo = new ALOPInfo();
  tableData: any[] = [["1", "Description 1", "Information 1"],
  ["2", "Description 2", "Information 2"],
  ["3", "Description 3", "Information 3"],
  ["4", "Description 4", "Information 4"],
  ["5", "Description 5", "Information 5"],
  ];

  tableData2: any[] = [
    ["1", "5", "Description 1", "Information", "Information"],
    ["2", "5", "Description 2", "Information", "Information"],
    ["3", "5", "Description 3", "Information", "Information"],
    ["4", "5", "Description 4", "Information", "Information"],
    ["5", "5", "Description 5", "Information", "Information"],
  ]

  tHeader: string[] = [];
  tHeader2: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  pageLength = 10;
  alopFlag:string = '';

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
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private route: ActivatedRoute, private titleService: Title, private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | ALOP");
    this.sub = this.route.params.subscribe(params => {
      this.policyNo = params['policyNo']
      this.line = params['line'];
      this.prevPolicyId = params['prevPolicyId'] == undefined ? '' : params['prevPolicyId'];
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
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');

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
      $('#polAlopSuccess > #successModalBtn').trigger('click');

      setTimeout(()=>{$('.globalLoading').css('display','none');},0);
    }
    
  }

  savePolAlopItem(cancelFlag?){
     this.cancelFlag = cancelFlag != undefined;
     let savedData: any = {};

     savedData.policyId = this.policyInfo.policyId;
     savedData.savePolAlopItemList=[];
     savedData.deletePolAlopItemList=[];

     for( var i =0; i< this.passDataCar.tableData.length;i++){
         if (this.passDataCar.tableData[i].edited && !this.passDataCar.tableData[i].deleted) {
            savedData.savePolAlopItemList.push(this.passDataCar.tableData[i]);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate);
         } else if (this.passDataCar.tableData[i].deleted) {
            savedData.deletePolAlopItemList.push(this.passDataCar.tableData[i]);
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate);
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate);
         }
     }

     /*if (this.policyNo === "CAR") {
       for (var i=0; i<this.passDataCar.tableData.length; i++) {
         if (this.passDataCar.tableData[i].edited && !this.passDataCar.tableData[i].deleted) {
            savedData.savePolAlopItemList.push(this.passDataCar.tableData[i]);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate);
         } else if (this.passDataCar.tableData[i].deleted) {
            savedData.deletePolAlopItemList.push(this.passDataCar.tableData[i]);
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate);
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate);
         }
       }
     }

     if (this.policyNo === "EAR") {
       for (var i=0; i<this.passDataEar.tableData.length; i++) {
         if (this.passDataEar.tableData[i].edited && !this.passDataEar.tableData[i].deleted) {
            savedData.savePolAlopItemList.push(this.passDataEar.tableData[i]);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate);
         } else if (this.passDataEar.tableData[i].deleted) {
            savedData.deletePolAlopItemList.push(this.passDataEar.tableData[i]);  
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].policyId = this.policyInfo.policyId;
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate);
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate);
         }
       }
     }*/

     if (this.validateALOPItemFields(savedData)) {
       this.underwritingService.savePolAlopItem(savedData).subscribe((data: any) => {
          if(data['returnCode'] == 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#successModalBtn').trigger('click');
          } else{
            this.dialogIcon = "success";
            $('#successModalBtn').trigger('click');
            this.table.markAsPristine();

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
       $('#polAlopSuccess > #successModalBtn').trigger('click');

       setTimeout(()=>{$('.globalLoading').css('display','none');},0);
     }
      
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
      }else { 
          this.underwritingService.getPolGenInfo(this.prevPolicyId, null).subscribe((data:any) => {
            if (data.policy != null) {
              this.underwritingService.getPolAlop(this.prevPolicyId, data.policy.policyNo).subscribe((data: any) => {
                if (data.policy != null) {
                  this.policyId = data.policy.policyId;
                  this.polAlopData = data.policy.alop;
                  this.polAlopData.issueDate = this.polAlopData.issueDate == null? null:this.ns.toDateTimeString(this.polAlopData.issueDate);
                  this.polAlopData.expiryDate = this.polAlopData.expiryDate == null? null:this.ns.toDateTimeString(this.polAlopData.expiryDate);
                  this.polAlopData.indemFromDate = this.polAlopData.indemFromDate == null? null:this.ns.toDateTimeString(this.polAlopData.indemFromDate);
                  this.polAlopData.createDate = this.ns.toDateTimeString(this.polAlopData.createDate);
                  this.polAlopData.updateDate = this.ns.toDateTimeString(this.polAlopData.updateDate);
                }
              });
            }
          });

          
          /*this.mtnService.getMtnInsured(this.policyInfo.principalId).subscribe((data: any) => {
          this.polAlopData.insId = data.insured[0].insuredId;
          this.polAlopData.insuredName = data.insured[0].insuredAbbr;
          this.polAlopData.insuredDesc = data.insured[0].insuredName;
          this.polAlopData.address = data.insured[0].address;
        })

        this.polAlopData.createUser = JSON.parse(window.localStorage.currentUser).username
        this.polAlopData.createDate = this.ns.toDateTimeString(new Date());
        this.polAlopData.updateDate = this.ns.toDateTimeString(new Date());
        this.polAlopData.updateUser = JSON.parse(window.localStorage.currentUser).username*/
      }
    });
    this.getSumInsured();
  }

  getSumInsured(){
    this.underwritingService.getUWCoverageInfos(null,this.policyInfo.policyId).subscribe((data:any) => {
      if (data.policy != null) {
        var sectionCovers = data.policy.project.coverage.sectionCovers;
        for( var i = 0; i <sectionCovers.length;i++){
          if(sectionCovers[i].coverName == 'Advance Loss of Profit'){
            this.polAlopData.annSi = sectionCovers[i].sumInsured;
          }
        }
        this.polAlopData.maxIndemPdSi = isNaN(this.polAlopData.maxIndemPd) ? 0: ((this.polAlopData.maxIndemPd/12)*this.polAlopData.annSi);
      } else {

      }
      
    });
  }

  getPolAlopItem() {
    this.underwritingService.getPolAlopItem(this.policyNo, this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {
      this.passDataCar.tableData = [];

      if(data.policy != null){
        var dataInfos = data.policy.alop.alopItem;

        for(var i=0;i<dataInfos.length;i++){
          this.passDataCar.tableData.push(dataInfos[i]);
        }

        this.table.refreshTable();
      } else {
         this.underwritingService.getPolGenInfo(this.prevPolicyId, null).subscribe((data:any) => {
           if (data != null) {
             this.underwritingService.getPolAlopItem(this.policyNo, this.prevPolicyId, data.policy.policyNo).subscribe((data: any) => {
                 if (data.policy != null) {
                     var dataInfos = data.policy.alop.alopItem;

                    for(var i=0;i<dataInfos.length;i++){
                      this.passDataCar.tableData.push(dataInfos[i]);
                    }

                    this.table.refreshTable();
                 }
             });
           }
         });
      }
      
      /*this.passDataCar.tableData = [];
      this.passDataEar.tableData = [];

      if (data.policy != null && data.policy.alop.length > 0) {
        var dataInfos = data.policy.alop[0].alopItem;

        if(this.policyNo === "CAR") {
          for(var i=0; i< dataInfos.length; i++){
            this.passDataCar.tableData.push( {"itemNo": dataInfos[i].itemNo, 
                                              "description": dataInfos[i].description, 
                                              "lossMin": dataInfos[i].lossMin,
                                              "quantity": dataInfos[i].quantity,
                                              "importance": dataInfos[i].importance,
                                              "createDate": dataInfos[i].createDate,
                                              "createUser": dataInfos[i].createUser,
                                              "updateDate": dataInfos[i].updateDate,
                                              "updateUser": dataInfos[i].updateUser} );
          }
        } else {
          for(var i=0; i< dataInfos.length; i++){
            this.passDataEar.tableData.push( {"itemNo": dataInfos[i].itemNo, 
                                              "quantity": dataInfos[i].quantity, 
                                              "description": dataInfos[i].description, 
                                              "importance": dataInfos[i].importance, 
                                              "lossMin": dataInfos[i].lossMin,
                                              "createDate": dataInfos[i].createDate,
                                              "createUser": dataInfos[i].createUser,
                                              "updateDate": dataInfos[i].updateDate,
                                              "updateUser": dataInfos[i].updateUser } );
          }
        }
        
        this.table.refreshTable();
      }*/
    });
  }

  openAlopItem(){
      this.showAlopItem = true;
      this.getPolAlopItem();
      setTimeout(()=>{
        $('#alopItemModal #modalBtn').trigger('click');
      },0)
  }


  cancelButton() {
    this.alopFlag = 'alop';
    this.cancelBtn.clickCancel();
  }

  cancelModal() {
    this.alopFlag = 'alopitem';
    this.cancelModalBtn.clickCancel();
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
      $('#successModalBtn').trigger('click');
    }
  }

  onClickSavePolAlopItem(){
    $('#polAlopItem #confirm-save #modalBtn2').trigger('click');
  }

  checkDates(){
    console.log('check')
    if((new Date(this.polAlopData.issueDate) >= new Date(this.polAlopData.expiryDate))){
     highlight(this.to);
     highlight(this.from);
     this.dateErFlag = true;
    }else{
     unHighlight(this.to);
     unHighlight(this.from);
     this.dateErFlag = false;
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
