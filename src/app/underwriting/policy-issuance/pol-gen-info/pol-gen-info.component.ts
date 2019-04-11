import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit, OnDestroy {
  tableData: any;
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];

  @Input() mode;
  @Input() alteration: boolean = false;
  policyInfo:any = {
    policyId: null,
    policyNo: null,
    lineCd: null,
    lineCdDesc: null,
    polYear: null,
    polSeqNo: null,
    cedingId: null,
    cedingName: null,
    coSeriesNo: null,
    altNo: null,
    cessionId: null,
    cessionDesc: null,
    lineClassCd: null,
    lineClassDesc: null,
    quoteId: null,
    quotationNo: null,
    holdCoverNo: null,
    status: null,
    statusDesc: null,
    coRefNo: null,
    reinsurerId: null,
    reinsurerName: null,
    riBinderNo: null,
    mbiRefNo: null,
    policyIdOc: null,
    openPolicyNo: null,
    refOpenPolNo: null,
    intmId: null,
    intmName: null,
    principalId: null,
    principalName: null,
    contractorId: null,
    contractorName: null,
    insuredDesc: null,
    inceptDate: null,
    expiryDate: null,
    lapseFrom: null,
    lapseTo: null,
    maintenanceFrom: null,
    maintenanceTo: null,
    issueDate: null,
    effDate: null,
    distDate: null,
    acctDate: null,
    currencyCd: null,
    currencyRt: null,
    bookedTag: null,
    govtTag: null,
    openCoverTag: null,
    holdCoverTag: null,
    declarationTag: null,
    minDepTag: null,
    altTag: null,
    specialPolicyTag: null,
    instTag: null,
    extensionTag: null,
    excludeDistTag: null,
    wordings: null,
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null,
    showPolAlop: false,
    project: {
      projId: null,
      projDesc: null,
      riskId: null,
      riskName: null,
      regionCd: null,
      regionDesc: null,
      provinceCd: null,
      provinceDesc: null,
      cityCd: null,
      cityDesc: null,
      districtCd: null,
      districtDesc: null,
      blockCd: null,
      blockDesc: null,
      latitude: null,
      longitude: null,
      totalSi: null,
      objectId: null,
      objectDesc: null,
      site: null,
      duration: null,
      testing: null,
      ipl: null,
      timeExc: null,
      noClaimPd: null,
      createUser: null,
      createDate: null,
      updateUser: null,
      updateDate: null
    },
    alop: {
      insId: null,
      insuredName: null,
      insuredDesc: null,
      address: null,
      insBusiness: null,
      annSi: null,
      maxIndemPdSi: null,
      issueDate: null,
      expiryDate: null,
      maxIndemPd: null,
      indemFromDate: null,
      timeExc: null,
      repInterval: null,
      createUser: null,
      createDate: null,
      updateUser: null,
      updateDate: null
    }
  };
  line: string;
  private sub: any;
  hcChecked: boolean = false;
  ocChecked: boolean = false;
  decChecked: boolean = false;
  typeOfCession: string = "";
  policyId: string;
  policyNo: string;

  @Output() emitPolicyInfoId = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
    private underwritingService: UnderwritingService, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | General Info");
    this.tHeader.push("Item No", "Description of Items");
    this.dataTypes.push("text", "text");
    this.filters.push("Item No", "Desc. of Items");
    this.tableData = this.underwritingService.getItemInfoData();

    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
      this.policyId = params['policyId'];
      this.policyNo = params['policyNo'];
    });
    this.getPolGenInfo();
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  toggleRadioBtnSet() {
    $('#radioBtnSet').css('backgroundColor', (this.policyInfo.declarationTag === 'Y') ? '#ffffff' : '#f5f5f5');
  }

  getPolGenInfo() {
    this.underwritingService.getPolGenInfo(this.policyId, this.policyNo).subscribe((data:any) => {
      if(data.policy != null) {
        this.policyInfo = data.policy;
        this.policyInfo.inceptDate = this.ns.toDateTimeString(this.policyInfo.inceptDate);
        this.policyInfo.expiryDate = this.ns.toDateTimeString(this.policyInfo.expiryDate);
        this.policyInfo.lapseFrom = this.policyInfo.lapseFrom == null ? '' : this.ns.toDateTimeString(this.policyInfo.lapseFrom);
        this.policyInfo.lapseTo = this.policyInfo.lapseTo == null ? '' : this.ns.toDateTimeString(this.policyInfo.lapseTo);
        this.policyInfo.maintenanceFrom = this.policyInfo.maintenanceFrom == null ? '' : this.ns.toDateTimeString(this.policyInfo.maintenanceFrom);
        this.policyInfo.maintenanceTo = this.policyInfo.maintenanceTo == null ? '' : this.ns.toDateTimeString(this.policyInfo.maintenanceTo);
        this.policyInfo.issueDate = this.ns.toDateTimeString(this.policyInfo.issueDate);
        this.policyInfo.effDate = this.ns.toDateTimeString(this.policyInfo.effDate);
        this.policyInfo.distDate = this.ns.toDateTimeString(this.policyInfo.distDate);
        this.policyInfo.acctDate = this.ns.toDateTimeString(this.policyInfo.acctDate);
        this.policyInfo.createDate = this.ns.toDateTimeString(this.policyInfo.createDate);
        this.policyInfo.updateDate = this.ns.toDateTimeString(this.policyInfo.updateDate);
        this.checkPolIdF(this.policyInfo.policyId);
        this.toggleRadioBtnSet();

        setTimeout(() => {
          $('input[appCurrencyRate]').focus();
          $('input[appCurrencyRate]').blur();
        },0) 
      }
    });
  }

  checkPolIdF(event){
    this.underwritingService.getUWCoverageInfos(null, this.policyId).subscribe((data:any)=>{
      if(data.policy !== null){
        let alopFlag = false;
        if(data.policy.project !== null){
          for(let sectionCover of data.policy.project.coverage.sectionCovers){
                if(sectionCover.section == 'III'){
                    alopFlag = true;
                   break;
                 }
          }
        }
            
               this.policyInfo.showPolAlop = alopFlag;
      }

      this.emitPolicyInfoId.emit({
        policyId: event,
        policyNo: this.policyInfo.policyNo,
        riskName: this.policyInfo.project.riskName,
        insuredDesc: this.policyInfo.insuredDesc,
        riskId: this.policyInfo.project.riskIdz,
        showPolAlop: this.policyInfo.showPolAlop
      });    

    });
  }

  updateExpiryDate() {
    var d = new Date(this.policyInfo.inceptDate);
    d.setFullYear(d.getFullYear() + 1);

    this.policyInfo.expiryDate = this.ns.toDateTimeString(d);
  }

  //add by paul for deductibles
  @ViewChild('deductiblesTable') deductiblesTable :CustEditableNonDatatableComponent;
  @ViewChild('deductiblesModal') deductiblesModal :ModalComponent;
  dialogIcon:string = '';
  @ViewChild('dedSuccess') successDlg: SucessDialogComponent;
  @ViewChild('dedLov') lov :LovComponent;
  lovCheckBox:boolean;
  passLOVData:any = {
    selector: '',

  }
  dialogMsg:string;


  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Deductible Text", "Rate(%)", "Amount"],
        dataTypes: ["text","text","text", "percent", "currency"],
        pageLength:10,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        checkFlag: true,
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        magnifyingGlass: ['deductibleCd'],
        keys:['deductibleCd','deductibleTitle','deductibleTxt','deductibleRt','deductibleAmt'],
        tableData:[],
        pageID:'deductibles',
        nData: {
          "coverCd": 0,
          "createDate": this.ns.toDateTimeString(0),
          "createUser": JSON.parse(window.localStorage.currentUser).username,
          "deductibleAmt": 0,
          "deductibleCd": null,
          "deductibleRt": 0,
          "deductibleTxt": '',
          "endtCd": "0",
          "updateDate": this.ns.toDateTimeString(0),
          "updateUser":JSON.parse(window.localStorage.currentUser).username,
          showMG : 1
        }
    };

  showDeductiblesModal(deductibles){
    // setTimeout(()=>{this.getDeductibles();},0);
    // this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    this.getDeductibles();
    this.deductiblesModal.openNoClose();
  }

  getDeductibles(){
    this.deductiblesTable.loadingFlag = true;
    let params : any = {
      policyId:this.policyId,
      policyNo:'',
      coverCd:0,
      endtCd: 0
    }
    this.underwritingService.getUWCoverageDeductibles(params).subscribe(data=>{
      console.log(data);
      if(data['policy']!==null){
        this.passDataDeductibles.tableData = data['policy']['deductibles'].filter(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.updateUser = JSON.parse(window.localStorage.currentUser).username;
          return true;
        });
      }
      else
        this.passDataDeductibles.tableData = [];
      this.deductiblesTable.refreshTable();
    });
  }

  saveDeductibles(){
    let params:any = {
      policyId:this.policyId,
      saveDeductibleList: [],
      deleteDeductibleList:[]
    };
    params.saveDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && !a.deleted && a.deductibleCd!==null);
    params.deleteDeductibleList = this.passDataDeductibles.tableData.filter(a=>a.edited && a.deleted && a.deductibleCd!==null);
    if(params.saveDeductibleList.length==0 && params.deleteDeductibleList.length==0){
      this.dialogMsg = 'Nothing to save.'
      this.dialogIcon = 'info'
      this.successDlg.open();
      return;
    }

    this.deductiblesTable.loadingFlag = true;
    this.underwritingService.savePolDeductibles(params).subscribe(data=>{
        if(data['returnCode'] == -1){
          this.dialogIcon = '';
          this.successDlg.open();
          this.getDeductibles();
        }else{
          this.deductiblesTable.loadingFlag = false;
          this.dialogIcon = 'error';
          this.successDlg.open();
        }
      });
  }

  setSelected(data){
    if(data.selector == 'deductibles'){
      this.passDataDeductibles.tableData = this.passDataDeductibles.tableData.filter(a=>a.showMG!=1);
      for(var i = 0; i<data.data.length;i++){
        this.passDataDeductibles.tableData.push(JSON.parse(JSON.stringify(this.passDataDeductibles.nData)));
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTitle = data.data[i].deductibleTitle;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleRt = data.data[i].deductibleRate;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleAmt = data.data[i].deductibleAmt;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleTxt = data.data[i].deductibleText;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].edited = true;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length -1].deductibleCd = data.data[i].deductibleCd;
        this.passDataDeductibles.tableData[this.passDataDeductibles.tableData.length - 1].showMG = 0;
      }
    }else if (data.selector == 'otherRates'){

    }
    this.deductiblesTable.refreshTable();
  }

  clickDeductiblesLOV(data){
    if(data.key=="deductibleCd"){
      this.lovCheckBox = true;
      this.passLOVData.selector = 'deductibles';
      this.passLOVData.lineCd = this.policyInfo.lineCd;
      this.passLOVData.params = {
        coverCd : 0,
        endtCd: '0',
        activeTag:'Y'
      }
      this.passLOVData.hide = this.passDataDeductibles.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
    }
    this.lov.openLOV();
  }


}

