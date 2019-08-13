import { Component, OnInit, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import * as alasql from 'alasql';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-distribution-by-risk',
  templateUrl: './distribution-by-risk.component.html',
  styleUrls: ['./distribution-by-risk.component.css']
})
export class DistributionByRiskComponent implements OnInit, OnDestroy {
  @ViewChild('treaty') treatyTable: CustEditableNonDatatableComponent;
  @ViewChild('limit') limitTable: CustEditableNonDatatableComponent;
  @ViewChild('poolDistTable') poolDistTable: CustEditableNonDatatableComponent;
  @ViewChild('coInsTable') coInsTable: CustEditableNonDatatableComponent;
  @ViewChild('wparam') wparam: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('treatyShare') cedingCoLOV: CedingCompanyComponent;
  @Output() riskDistId = new EventEmitter<any>();
  @Output() riskDistStatus = new EventEmitter<any>();
  @ViewChild('warningPosted') warningPostedMdl: ModalComponent;
  @ViewChild('warningUnsaved') warningUnsvdedMdl: ModalComponent;
  @ViewChild('warningUndistAlt') warningUndistAltMdl: ModalComponent;
  @ViewChild('warningInvShare') warningInvShareMdl: ModalComponent;
  @ViewChild('confirmAlt') confirmAltMdl: ModalComponent;
  @ViewChild('retLimitReached') retLimitReached: ModalComponent;
  
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;

  savedData: any[] = [];
  deletedData: any[] = [];

  @Output() inquiryFlag = new EventEmitter<any>();

  private polDistributionByRisk: DistributionByRiskInfo;
  // tableData: any[] = [];
  // tHeader: any[] = [];
  // dataTypes: any[] = [];
  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null, null);

  tableData: any[] = [];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  distFlag = 'treaty'; /*Values : treaty, pool, coinsurance*/

  checkboxFlag;
  columnId;
  pageLength = 10;

  editedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  passDataLimits: any = {
        tHeader: ["Treaty Name", "Amount"],
        dataTypes: [
                    "text", "number"
                   ],
        tableData: [["Quota & 1st Surplus","1,500,000,000.00"],["2nd Surplus","1,500,000,000.00"]],
        pageLength:2
    };

  poolData: any = [["Quota & 1st Surplus","1,500,000,000.00"],
                   ["2nd Surplus","1,500,000,000.00"]];


  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  //NECO 06/03/2019
  treatyDistData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', 'Treaty Share (%)', 'SI Amount', 'Premium Amount', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
    magnifyingGlass: [],
    options: [],
    dataTypes: ['text', 'text', 'percent', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
    keys: ['treatyName', 'trtyCedName', 'pctShare', 'siAmt', 'premAmt', 'commRt', 'commAmt', 'vatRiComm', 'netDue'],
    opts: [],
    total:[null, 'TOTAL', 'pctShare', 'siAmt', 'premAmt', null, 'commAmt', 'vatRiComm', 'netDue'],
    uneditable:[true,true,true,true,true,true,true,true,true],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    pageID: 'treatyDistTable',
    exportFlag: true,
  };

  limitsData: any = {
    tableData: [],
    tHeader: ['Treaty Name', 'Amount'],
    magnifyingGlass: [],
    options: [],
    dataTypes: ['text', 'currency'],
    keys: ['treatyName', 'amount'],
    uneditable: [true,true],
    opts: [],
    nData: {},
    selectFlag: false,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 3,
    widths: [],
    pageID: 'treatyLimitsTable'
  };

  wparamData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', 'Treaty Share (%)', 'Comm Rate (%)'],
    magnifyingGlass: ['trtyCedName'],
    options: [],
    dataTypes: ['text', 'text', 'percent', 'percent'],
    keys: ['treatyName', 'trtyCedName', 'pctShare', 'commRt'],
    opts: [],
    nData: {},
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    pageID: 'wparamTable',
    genericBtn: 'Delete'
  }

  poolDistributionData: any = {
    tableData: [],
    tHeader: ['Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
    dataTypes: ['text', 'text', 'number', 'currency', 'currency', 'number', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
    keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
    widths: [1,250,1,140,140,1,140,140,1,140,140,140],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true],
    total:[null,'TOTAL','retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', null, 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
    paginateFlag: true,
    infoFlag: true,
    pageLength: 'unli',
    pageID: 'poolDistTable',
    searchFlag: true,
    exportFlag: true,
  }

  coInsuranceData: any = {
    tableData: [],
    tHeader: ['Risk Dist No', 'Dist No', 'Policy No', 'Ceding Company', 'Share (%)', 'SI Amount', 'Premium Amount'],
    dataTypes: ['sequence-5', 'sequence-5', 'text', 'text', 'percent', 'currency', 'currency'],
    keys: ['riskDistId', 'distId', 'policyNo', 'cedingName', 'pctShare', 'siAmt', 'premAmt'],
    widths: [1,1,160,250,100,140,140],
    uneditable: [true,true,true,true,true,true,true],
    infoFlag: true,
    paginateFlag: true,
    total:[null,null,null,'TOTAL','pctShare', 'siAmt', 'premAmt'],
    pageID: 'distCoInsTable'
  }

  //END


 /* mdlConfig = {
        mdlBtnAlign: "center",
    };*/

    //NECO 05/31/2019
    params: any;
    riskDistributionData: any;
    sub: any;
    //END


  controlDisabled:any = {
    oneRetLine:false,
    autoCalc: false,
    saveBtn: false,
    distributeBtn: false,
    seciitrtyLimit: false,
    seciiPremTag: false
  }

  controlHidden:any = {
    saveBtn: false,
    distributeBtn: false,
    coinsBtn:true,
    seciitrtyLimit: false,
    seciiPremTag: false
  }

  postedList:any[] = [];
  undistAlt:any[]=[];
  distAlt:any[]=[];

  secIILimit:any;
  warningModalMsg:string = '';
  warningModalCode:string = '';

  coverage:any = {
    sectionI :0,
    sectionII :0,
    sectionIII :0,
  };

  constructor(private polService: UnderwritingService, private titleService: Title, private modalService: NgbModal, private route: ActivatedRoute, private router: Router,
              private ns: NotesService, private ms: MaintenanceService) { }


  ngOnInit() {
    this.titleService.setTitle("Pol | Risk Distribution");

    this.sub = this.route.params.subscribe((data: any)=>{
                  let polNo:string = '';
                  this.params = data;
                  if(this.params.fromInq == 'true'){
                    this.inquiryMode();
                  }else{
                    if(parseInt(data.policyNo.substr(-3))>0){
                      this.controlDisabled.oneRetLine = true;
                      this.controlDisabled.seciitrtyLimit = true;
                      this.controlDisabled.seciiPremTag = true;
                    }
                  }
                  polNo = this.params.policyNo.split('-')[0];
                  if(polNo!='CAR' && polNo!='EAR'){
                      this.controlHidden.seciitrtyLimit = true;
                      this.controlHidden.seciiPremTag = true;
                  }
                this.retrieveRiskDistribution();
                this.retrieveCoverage();
              });

  }

  retrieveCoverage(){
    this.polService.getUWCoverageInfos(null,this.params.policyId).subscribe((a:any)=>{
      this.coverage.sectionI = a.policy.project.coverage.cumSecISi;
      this.coverage.sectionII = a.policy.project.coverage.cumSecIISi;
      this.coverage.sectionIII = a.policy.project.coverage.cumSecIIISi;
    })
  }
  //NECO 05/31/2019
    retrieveRiskDistribution(){
      this.polService.getRiskDistribution(this.params.policyId, this.params.line, this.params.lineClassCd).subscribe((data: any)=>{
        console.log(data);
        this.distAlt = data.distAlt;
        this.undistAlt = data.undistAlt;
        this.riskDistributionData = data.distWrisk;
        this.riskDistId.emit(this.riskDistributionData.riskDistId);
        this.riskDistStatus.emit(this.riskDistributionData.status);
        var appendTreatyName: string = '';
        var appendTreatyLimitId: number = 0;
        var counter: number = 0;
        //var treatyLimitAmt: any;
        this.treatyDistData.tableData = data.distWrisk.distRiskWtreaty;


        //Check for warnings
        console.log("Params used in Dist Risk Warnings:");
        console.log("riskDistId : " + this.riskDistributionData.riskDistId);
        console.log("altNo :" + this.riskDistributionData.altNo);

        if (this.riskDistributionData.altNo != 0 && this.params.fromInq != 'true') {
          this.polService.getPolDistWarning(this.riskDistributionData.riskDistId, this.riskDistributionData.altNo).subscribe((data2: any)=> {
              if (data2.warningList.length > 0) {
                for (var i = 0; i < data2.warningList.length; i++) {

                  if (data2.warningList[i].warningCode == 'PREV_NOT_POSTED') {
                    this.inquiryFlag.emit(true);
                    this.inquiryMode();
                  } else if (data2.warningList[i].warningCode == 'PREV_HAS_CHANGES') {
                    this.inquiryFlag.emit(false);
                  }
                  this.warningModalCode = data2.warningList[i].warningCode;
                  this.warningModalMsg = data2.warningList[i].warningMessage;
                  $('#warningModal > #modalBtn').trigger('click');
                }
                
              }
          });
        }
        


        //

        this.wparamData.nData = {
                                 riskDistId: this.riskDistributionData.riskDistId,
                                 altNo: this.riskDistributionData.altNo,
                                 commRt: 0,
                                 createDate: '',
                                 createUser: JSON.parse(window.localStorage.currentUser).username,
                                 pctShare: 0,
                                 treatyId: 4,
                                 treatyName: 'Facultative',
                                 treatyYear: new Date().getFullYear(),
                                 trtyCedId: '',
                                 trtyCedName: '',
                                 updateDate: '',
                                 updateUser: JSON.parse(window.localStorage.currentUser).username,
                                 showMG : 1
                                };
        this.wparamData.tableData = [];
        for(var h of data.distRiskWparam){
          if(this.riskDistributionData.altNo != 0 && String(h.treatyName).toUpperCase() !== 'FACULTATIVE'){
            h.uneditable = ['treatyName', 'trtyCedName', 'pctShare'];
          }else{
           h.uneditable = ['treatyName', 'trtyCedName'];
          }
          h.riskDistId = this.riskDistributionData.riskDistId;
          h.altNo = this.riskDistributionData.altNo;
          this.wparamData.tableData.push(h);
        }
        //this.wparamData.tableData = data.distRiskWparam;
        this.limitsData.tableData = [];
        for(var i of data.wriskLimit){
          if(appendTreatyLimitId == 0){
            appendTreatyName = i.treatyName;
            appendTreatyLimitId = i.treatyLimitId;
            counter++;
            continue;
          }
          else if(appendTreatyLimitId == i.treatyLimitId){
            appendTreatyName = appendTreatyName.length == 0 ? i.treatyName : appendTreatyName + ' & ' + i.treatyName;
            i.treatyName = appendTreatyName;
          }else{
            appendTreatyName = '';
            appendTreatyLimitId = i.treatyLimitId;
            if(counter+1 === data.wriskLimit.length){
              this.limitsData.tableData.push(i);
              break;
            }else{
              counter++;
              continue;
            }
          }
          this.limitsData.tableData.push(i);
          counter++;
        }
        this.treatyTable.refreshTable();
        this.limitTable.refreshTable();
        this.wparam.refreshTable();

        this.openCoInsurance();
        this.readOnlyAll();

        // if(){
          
        // }

        setTimeout(()=>{
          $('input[type=text]').focus();
          $('input[type=text]').blur();
        },0);
      });
    }

    inquiryMode() {
      this.controlHidden.saveBtn = true;
      this.controlHidden.distributeBtn = true;

      this.controlDisabled.oneRetLine = true;
      this.controlDisabled.autoCalc = true;
      this.controlDisabled.saveBtn = true;
      this.controlDisabled.distributeBtn = true;

      this.wparamData.genericBtn = undefined;
      this.wparamData.addFlag = false;
      this.wparamData.uneditable=[true,true,true,true,true,];
      this.controlDisabled.seciitrtyLimit = true;
      this.controlDisabled.seciiPremTag = true;
    }

    openPoolDistribution(){
      this.poolDistTable.loadingFlag = true;
      this.polService.getPoolDistribution(this.riskDistributionData.riskDistId, this.riskDistributionData.altNo).subscribe((data: any)=>{
        this.poolDistributionData.tableData = data.poolDistList;
        this.poolDistTable.refreshTable();
        this.poolDistTable.loadingFlag = false;
        setTimeout(()=>{
          $('input[type=text]').focus();
          $('input[type=text]').blur();
        },0);
      });
    }

    openCoInsurance(){
      this.polService.getDistCoIns(this.riskDistributionData.riskDistId,this.params.policyId).subscribe((data: any)=>{
        this.coInsuranceData.tableData = data.distCoInsList;
        this.coInsTable.refreshTable();
        this.coInsTable.loadingFlag = false;
        if(data.distCoInsList.length != 1){
          this.controlHidden.coinsBtn = false
        }
        if(data.postedDist.length>0){
          this.postedList = data.postedDist.filter(a=>a.policyNo != this.params.policyNo);
          if(this.params.fromNegate == 'false')
            this.warningPostedMdl.openNoClose();
          this.readOnlyAll("yes");
        }
      });
    }

    pad(str: string, key: string){
      if(key === 'riskDistId'){
        return String(str).padStart(5, '0');
      }
    }

    round(val: number){
      return Math.round(val * 10000000000) / 10000000000;
    }

    ngOnDestroy(){
      this.sub.unsubscribe();
    }

    onClickDelete(event){
      this.wparam.selected = [this.wparam.indvSelect];
      if(this.wparam.selected[0].treatyName.toUpperCase() !== 'FACULTATIVE'){
        this.dialogIcon = 'info';
        this.dialogMessage = 'Can only delete Facultative Treaty';
        this.successDiag.open();
      }else{
        this.wparam.confirmDelete();
      }
    }

    //PARAMETERS FOR SAVING PREPARATION
    save(cancelFlag?){
      this.cancelFlag = cancelFlag !== undefined;
      this.savedData = [];
      this.deletedData = [];
      //setting up ceding rep updates
      for (var i = 0 ; this.wparamData.tableData.length > i; i++) {
        if(this.wparamData.tableData[i].edited && !this.wparamData.tableData[i].deleted){
            this.wparamData.tableData[i].eSignature = this.wparamData.tableData[i].fileName;
            this.savedData.push(this.wparamData.tableData[i]);
            this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
            this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
            this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
            this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        }
        else if(this.wparamData.tableData[i].edited && this.wparamData.tableData[i].deleted){
            this.deletedData.push(this.wparamData.tableData[i]);
            this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
            this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
        }
      }
        //PARAMS:
        //  One Retention Line -> this.riskDistributionData.retLineAmt
        //  Saved Data For Treaty Share and Comm Share Parameters -> this.savedData
        //  Deleted Data For Treaty Share and Comm Share Parameters -> this.deletedData
        //  Auto Calculation -> this.riskDistributionData.autoCalc
        let params: any = {
          saveWParam:  this.savedData,
          delWParam: this.deletedData,
          riskDistId:  this.riskDistributionData.riskDistId,
          altNo: this.riskDistributionData.altNo,
          retLineAmt: this.riskDistributionData.retLineAmt.toString().replace(/[,]/g,''),
          autoCalc: this.riskDistributionData.autoCalc,
          updateUser: JSON.parse(window.localStorage.currentUser).username,
          policyId: this.params.policyId,
          seciiPremTag: this.riskDistributionData.seciiPremTag,
          trtyLimitSec2: this.riskDistributionData.trtyLimitSec2 == null ?'' : this.riskDistributionData.trtyLimitSec2.toString().replace(/[,]/g,''),
        };
        this.polService.saveDistRisk(params).subscribe((data: any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.wparam.markAsPristine();
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveRiskDistribution();
        }
      });
      
    }

    readOnlyAll(force?){
      if(this.params.fromInq == 'true' || this.riskDistributionData.status.toUpperCase() === 'POSTED' || force!=undefined){
        this.controlHidden.saveBtn = true;
        this.controlHidden.distributeBtn = true;

        this.controlDisabled.oneRetLine = true;
        this.controlDisabled.autoCalc = true;
        this.controlDisabled.saveBtn = true;
        this.controlDisabled.seciitrtyLimit = true;
        this.controlDisabled.seciiPremTag = true;

        this.wparamData.opts = [];
        this.wparamData.uneditable = [];
        this.wparamData.magnifyingGlass = [];
        this.wparamData.addFlag = false;
        this.wparamData.genericBtn = undefined;
        this.wparamData.checkFlag = false;
        this.wparamData.uneditable=[true,true,true,true,true,]
        for(var count = 0; count < this.wparamData.tHeader.length; count++){
          this.wparamData.uneditable.push(true);
        }
      }else if(this.riskDistributionData.autoCalc == 'Y'){
        this.wparamData.uneditable = [];
        for(var count = 0; count < this.wparamData.tHeader.length; count++){
          this.wparamData.uneditable.push(true);
        }
        this.controlDisabled.oneRetLine = true;
        this.wparamData.addFlag = false;
        this.wparamData.genericBtn = undefined;
        this.controlDisabled.seciitrtyLimit = true;
        this.controlDisabled.seciiPremTag = true;
      }else{
        this.wparamData.uneditable = [];
        if(parseInt(this.params.policyNo.substr(-3))==0){
          this.controlDisabled.seciitrtyLimit = false;
          this.controlDisabled.seciiPremTag = false;
          this.controlDisabled.oneRetLine = false;
        }
        this.wparamData.addFlag = true;
        this.wparamData.genericBtn = 'Delete';

      }
    }
  //END


  distribute(){
    if(this.undistAlt.length != 0){
      this.warningUndistAltMdl.openNoClose();
      return;
    }

    if($('.ng-dirty').length ==0){
      let params: any = {
            riskDistId:  this.riskDistributionData.riskDistId,
            altNo: this.riskDistributionData.altNo,
            updateUser: JSON.parse(window.localStorage.currentUser).username
          };
      this.polService.distributeRisk(params).subscribe((data:any)=>{
           if(data.returnCode === 0){
            this.dialogIcon = 'error';
            this.successDiag.open();
          }else{
            this.wparam.markAsPristine();
            this.dialogIcon = '';
            this.successDiag.open();
            this.retrieveRiskDistribution();
          }
        }
        );
    }else{
      this.warningUnsvdedMdl.openNoClose();
    }
  }

  onClickCancel(){
    console.log(this.params.exitLink)
    this.router.navigate([this.params.exitLink,{policyId:this.params.policyId}]);
  }

  onClickSave(){
    let treaty:string[] = this.wparamData.tableData.map(a=>a.treatyId).filter((value, index, self) => self.indexOf(value) === index);
    for(let i of treaty){
      if( Number(this.wparamData.tableData.filter(a=>a.treatyId == i && !a.deleted).reduce((a, b) => a + (parseInt(b['pctShare']) || 0), 0)).toFixed(2) != '100.00' && 
          Number(this.wparamData.tableData.filter(a=>a.treatyId == i && !a.deleted).reduce((a, b) => a + (parseInt(b['pctShare']) || 0), 0)).toFixed(2) != '0.00'){
        this.warningInvShareMdl.openNoClose();
        return;
      }
    }
    if(this.distAlt.length != 0){
      this.confirmAltMdl.openNoClose();
      return;
    }
    this.confirmSave.confirmModal()
  }

// PAUL'S DOMAIN

  hiddenCedingCo: string[] = [];
  treatyShareLOVRow: any;
  openCedingCoLOV(ev) {
    this.hiddenCedingCo = this.wparamData.tableData.filter(a => a.trtyCedId !== undefined && !a.deleted && a.showMG != 1).map(a => a.trtyCedId);
    this.cedingCoLOV.modal.openNoClose();
    this.treatyShareLOVRow = ev.index;
  }

  setSelectedCedCoTreatyShare(data) {
    if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
        this.treatyShareLOVRow = data.ev.index;
        this.ns.lovLoader(data.ev, 0);
        if(data.cedingId != '' && data.cedingId != null && data.cedingId != undefined) {
          this.wparamData.tableData[this.treatyShareLOVRow].showMG = 0;
          this.wparamData.tableData[this.treatyShareLOVRow].trtyCedId = data.cedingId;
          this.wparamData.tableData[this.treatyShareLOVRow].trtyCedName = data.cedingAbbr;
          this.wparamData.tableData[this.treatyShareLOVRow].cedingAbbr = data.cedingAbbr;
          this.wparamData.tableData[this.treatyShareLOVRow].edited = true;
        } else {
          this.wparamData.tableData[this.treatyShareLOVRow].trtyCedId = '';
          this.wparamData.tableData[this.treatyShareLOVRow].trtyCedName = '';
          this.wparamData.tableData[this.treatyShareLOVRow].cedingAbbr = '';
          this.wparamData.tableData[this.treatyShareLOVRow].edited = true;
        }
      } else {
        this.wparamData.tableData = this.wparamData.tableData.filter(a => a.showMG != 1);
        for(let i of data) {
          this.wparamData.tableData.push(JSON.parse(JSON.stringify(this.wparamData.nData)));
          this.wparamData.tableData[this.wparamData.tableData.length - 1].showMG = 0;
          this.wparamData.tableData[this.wparamData.tableData.length - 1].trtyCedId = i.cedingId;
          this.wparamData.tableData[this.wparamData.tableData.length - 1].trtyCedName = i.cedingAbbr;
          this.wparamData.tableData[this.wparamData.tableData.length - 1].cedingAbbr = i.cedingAbbr;
          this.wparamData.tableData[this.wparamData.tableData.length - 1].edited = true;
        }
      }
      this.wparam.refreshTable();
  }

  exportTreatyDist(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PolTreatyRiskDist_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

      //keys: ['treatyName', 'trtyCedName', 'pctShare', 'siAmt', 'premAmt', 'commRt', 'commAmt', 'vatRiComm', 'netDue'],
     alasql('SELECT treatyName AS TreatyName, trtyCedName AS CedingName, pctShare AS PctShare, siAmt AS SumInsured, premAmt AS PremiumAmount, commRt AS CommissionRate, commAmt as CommissionAmount, vatRiComm as VATRiCommision, netDue AS NetDue INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.treatyDistData.tableData]);
  }

  exportPoolDist(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PolPoolDist_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };
      //tHeader: ['Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
      //keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
     alasql('SELECT treatyAbbr AS TreatyName, cedingName AS TreatyCompany, ' +
            'retOneLines AS RetentionOneLines, retOneTsiAmt AS RetentionOneTSIAmount, retOnePremAmt AS RetentionOnePremAmt, ' +
            'retTwoLines AS RetentionTwoLines, retTwoTsiAmt AS RetentionTwoTSIAmount, retTwoPremAmt AS RetentionTwoPremAmt, ' +
            'commRt AS CommRate, totalCommAmt AS CommAmount, totalVatRiComm AS VATonRICOMM, totalNetDue AS NetDue ' +
            'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.poolDistributionData.tableData]);
  }

  //poolDistributionData
  //keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],

  checkLimit(){
    if(this.riskDistributionData.retLineAmt > this.riskDistributionData.secIIInputLimit && this.riskDistributionData.secIIInputLimit!= null){
      this.riskDistributionData.retLineAmt = this.riskDistributionData.secIIInputLimit;
      this.retLimitReached.openNoClose();
    }
  }


}
