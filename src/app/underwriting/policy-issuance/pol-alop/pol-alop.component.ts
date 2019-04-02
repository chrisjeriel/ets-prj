import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { FormsModule }   from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ActivatedRoute } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('myForm') form:any;
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

  passDataCar: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
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
    selectFlag: false,
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
  insured:string = '';

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
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private route: ActivatedRoute, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    /*this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
    this.tHeader = ["Item No","Quantity","Description","Relative Importance","Possible Loss Min"];
    this.dataTypes = ["number","number","text","text","text"];
    
    if(this.policyRecordInfo.policyNo.substr(0,3) =="CAR"){
      this.tHeader = ["Item No","Quantity","Description","Possible Loss Min"];
      this.dataTypes = ["number","number","text","text"];
    }

    this.tableData = this.underwritingService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0,3));*/
    this.titleService.setTitle("Pol | ALOP");

    this.passDataCar.tHeader.push("Item No", "Description", "Possible Loss Minimization");
    this.passDataCar.widths.push("1", "auto", "auto");
    this.passDataCar.tableData = this.tableData;

    this.passDataEar.tHeader.push("Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Minimization");
    this.passDataEar.dataTypes.push("text", "text", "text", "text", "text");
    this.passDataEar.widths.push("1", "1", "auto", "auto", "auto");

    this.passDataEar.tableData = this.tableData2;

    this.insured = this.policyInfo.principalName + " / " + this.policyInfo.contractorName;
    this.policyNo = this.policyInfo.policyNo.split(/[-]/g)[0];

    this.polURL = (this.alterFlag == false)? 'alt-policy-listing' : 'policy-listing'; 

    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
    });

    this.getPolAlop();
    this.getPolAlopItem();

  }

  save(cancelFlag?) {
    this.cancelFlag = cancelFlag != undefined;

    this.polAlopData.policyId = this.policyInfo.policyId;
    this.polAlopData.policyNo = this.policyInfo.policyNo;
    
    this.underwritingService.savePolAlop(this.polAlopData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          this.form.control.markAsPristine()
          this.getPolAlop();
        }
    });
  }

  savePolAlopItem(cancelFlag?){
     this.cancelFlag = cancelFlag != undefined;
     let savedData: any = {};

     savedData.policyId = this.policyInfo.policyId;
     savedData.savePolAlopItemList=[];
     savedData.deletePolAlopItemList=[];

     if (this.policyNo === "CAR") {
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
            console.log(savedData.deletePolAlopItemList)
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
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].createDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].createDate);
            savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username,
            savedData.deletePolAlopItemList[savedData.deletePolAlopItemList.length-1].updateDate = this.ns.toDateTimeString(savedData.savePolAlopItemList[savedData.savePolAlopItemList.length-1].updateDate);
         }
       }
     }

    this.underwritingService.savePolAlopItem(savedData).subscribe((data: any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          this.dialogIcon = "success";
          $('#successModalBtn').trigger('click');
          this.table.markAsPristine();
          this.getPolAlopItem();
        }
      });
  }

  getPolAlop() {
    
    this.underwritingService.getPolAlop(this.policyInfo.policyId,'').subscribe((data: any) => {
      if (data.policy != null) {
        this.policyId = data.policy.policyId;
        this.polAlopData = data.policy[0].alop[0]===null ? this.polAlopData : data.policy[0].alop[0];
        this.polAlopData.issueDate = this.ns.toDateTimeString(this.polAlopData.issueDate);
        this.polAlopData.expiryDate = this.ns.toDateTimeString(this.polAlopData.expiryDate);
        this.polAlopData.indemFromDate = this.ns.toDateTimeString(this.polAlopData.indemFromDate);
        this.polAlopData.createDate = this.ns.toDateTimeString(this.polAlopData.createDate);
        this.polAlopData.updateDate = this.ns.toDateTimeString(this.polAlopData.updateDate);
      }

    });
  }

  getPolAlopItem() {

    this.underwritingService.getPolAlopItem(this.policyNo, this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {
      if (data.policy != null) {
        var dataInfos = data.policy.alop[0].alopItem;

        this.passDataCar.tableData = [];
        this.passDataEar.tableData = [];

        if(this.policyNo === "CAR") {
          for(var i=0; i< dataInfos.length; i++){
            this.passDataCar.tableData.push( {"itemNo": dataInfos[i].itemNo, 
                                              "description": dataInfos[i].description, 
                                              "lossMin": dataInfos[i].lossMin} );
          }
        } else {
          for(var i=0; i< dataInfos.length; i++){
            this.passDataEar.tableData.push( {"itemNo": dataInfos[i].itemNo, 
                                              "quantity": dataInfos[i].quantity, 
                                              "description": dataInfos[i].description, 
                                              "importance": dataInfos[i].importance, 
                                              "lossMin": dataInfos[i].lossMin} );
          }
        }
        
        this.table.refreshTable();
      }
    });
  }

  cancel() {
    this.cancelBtn.clickCancel();
  }


  openGenericLOV(selector){
    this.passLOV.selector = selector;
    $('#lov #modalBtn').trigger('click');
  }

  setInsured(data){
    this.polAlopData.insuredName = data.data.insuredName;
    this.polAlopData.insId = data.data.insuredId;
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

}
