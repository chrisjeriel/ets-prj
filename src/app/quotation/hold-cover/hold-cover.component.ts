import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService,NotesService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Location } from '@angular/common'
import { DecimalPipe } from '@angular/common';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css'],
  providers: [DecimalPipe]
})
export class HoldCoverComponent implements OnInit {
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild('opt') opt: CustNonDatatableComponent;

  tableData: any[] = [];
  tHeader: any[] = [];
  quoteLine: string = "";
  private holdCoverInfo: HoldCoverInfo;
  
  passDataQuoteLOV : any = {
    tableData: [],
    tHeader:["Quotation No.", "Ceding Company", "Insured", "Risk"],
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['quotationNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    {key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'},
    // {key: 'cessionDesc',title: 'Type of Cession',dataType: 'text'},
    // {key: 'lineClassCdDesc',title: 'Line Class',dataType: 'text'},
    // {key: 'status',title: 'Status',dataType: 'text'},
    // {key: 'principalName',title: 'Principal',dataType: 'text'},
    // {key: 'contractorName',title: 'Contractor',dataType: 'text'},   
    // {key: 'objectDesc',title: 'Object',dataType: 'text'},
    // {key: 'site',title: 'Site',dataType: 'text'},
    // {key: 'policyNo',title: 'Policy No.',dataType: 'seq'},
    // {key: 'currencyCd',title: 'Currency',dataType: 'text'},
    // {key: 'issueDate',title: 'Quote Date',dataType: 'date'},
    // {key: 'expiryDate',title: 'Valid Until',dataType: 'date'},
    // {key: 'reqBy',title: 'Requested By',dataType: 'text'},
    // {key: 'createUser',title: 'Created By',dataType: 'text'},
    ],
    colSize: ['', '250px', '250px', '250px'],
  };

  passDataQuoteOptionsLOV : any = {
    tableData: [],
    tHeader: ['Option No','Rate(%)','Conditions','Comm Rate Quota(%)','Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
    dataTypes: ['number','percent','text','percent','percent','percent'],
    pageLength: 10,
    resizable: [false,false,false,false,false,false],
    tableOnly: true,
    keys: ['optionNo','rate','conditions','commRateQuota','commRateSurplus','commRateFac'],
    pageStatus: true,
    pagination: true,
    pageID:10,
    // filters:[
    //   {key:'optionNo',title:'Option No',dataType:'text'},
    //   {key:'rate',title:'Option No',dataType:'text'},
    //   {key:'conditions',title:'Option No',dataType:'text'},
    //   {key:'commRateQuota',title:'Option No',dataType:'text'},
    //   {key:'commRateSurplus',title:'Option No',dataType:'text'},
    //   {key:'commRateFac',title:'Option No',dataType:'text'},
    // ]
  };

  searchParams: any[] = [];
  searchParams2: any[] = [];

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, private location: Location, private decPipe: DecimalPipe, private ns : NotesService, private router: Router) { 
  }

  qLine: string;
  qYear: string;
  qSeqNo: string;
  qRevNo: string;
  qCedingId: string;

  quoteNo:string;
  cedCo:string;
  insured:string;
  risk:string;

  rowRec;

  hcPrefix             : string;
  hcLine               : string;
  hcYear               : string;
  hcSeqNo              : string;
  hcRevNo              : string;
  type                 : string;
  cancelFlag           : boolean;
  typeTime             : string;


  quoteId: number;
  warningMsg: string;
  clickView:boolean;
  clickModif:boolean;
  btnApprovalEnabled: boolean;
  btnCancelMainEnabled: boolean;
  loading:boolean;
  dialogMessage:string = '';
  dialogIcon:string = '';

  cbSearchQn: boolean;
  inSearcnQn: string;
  showAll:boolean;

  periodFromTime: any;
  periodToTime:any;
  ids :any;
  genMsg : string = '';
  icon:string='';
  selectedOption:any;
  optLovEnabled: boolean;
  cancelHcBtnEnabled: boolean;

  holdCover: any = {
    approvedBy:     "",
    compRefHoldCovNo:     "",
    createDate:     "",
    createUser:     "",
    holdCoverId:    "",
    holdCoverNo:    "",
    holdCoverRevNo:     "",
    optionId:        "",
    holdCoverSeqNo:     "",
    holdCoverYear:    "",
    lineCd:     "",
    lineCdDesc:     "",
    periodFrom:     "",
    periodTo:     "",
    preparedBy:     "",
    reqBy:    "",
    reqDate:    "",
    status:     "",
    updateDate:     "",
    updateUser:     "",
  }

  project: any ={
    coverage: "",
    createDate: "",
    createUser: "",
    duration: "",
    ipl: "",
    noClaimPd: "",
    objectDesc: "",
    objectId: "",
    pctShare: "",
    pctShareI: "",
    projDesc: "",
    projId: "",
    quoteId: "",
    riskId: "",
    riskName: "",
    site: "",
    testing: "",
    timeExc: "",
    totalSi: "",
    totalSiI: "",
    totalValue: "",
    updateDate: "",
    updateUser: "",
  }

  ngOnInit() {
    this.titleService.setTitle("Quo | Quotation to Hold Cover");
    this.holdCoverInfo = new HoldCoverInfo();
    this.btnApprovalEnabled = false;
    this.passDataQuoteLOV.filters[0].enabled = false;
    this.showAll = true;
    this.cancelHcBtnEnabled = false;
    this.search();
  }

  formatDate(date){
    return new Date(date[0] + "-" + date[1] + "-" + date[2]).toISOString();
  }

  sliceQuoteNo(qNo: string){
    var qArr = qNo.split("-");
    this.qLine = qArr[0];
    this.qYear = qArr[1];
    this.qSeqNo = qArr[2];
    this.qRevNo = qArr[3];
    this.qCedingId = qArr[4];        
  }


  splitHcNo(hcNo: string){
    var hcArr = hcNo.split("-");
    this.hcLine = hcArr[1];
    this.hcYear = hcArr[2];
    this.hcSeqNo = hcArr[3];
    this.hcRevNo = hcArr[4];        
  }

  searchQuery(searchParams){
    this.searchParams = searchParams;
    this.passDataQuoteLOV.tableData = [];
    this.search();
  }

            searchMatchingQuote(){
              this.passDataQuoteLOV.tableData = [];
              this.qLine = (this.qLine === '' || this.qLine === null || this.qLine === undefined)? '' : this.qLine;
              this.qYear = (this.qYear === '' || this.qYear === null || this.qYear === undefined)? '' : this.qYear;
              this.qSeqNo = (this.qSeqNo === '' || this.qSeqNo === null || this.qSeqNo === undefined)? '' : this.qSeqNo;
              this.qRevNo = (this.qRevNo === '' || this.qRevNo === null || this.qRevNo === undefined)? '' : this.qRevNo;
              this.qCedingId = (this.qCedingId === '' || this.qCedingId === null || this.qCedingId === undefined)? '' : this.qCedingId;

              this.quotationService.getSearchQuoteInfo(this.qLine.toUpperCase(),this.qYear,this.qSeqNo,this.qRevNo,this.qCedingId)
              .subscribe(data => {
                console.log(data);
                var rec = data['quotation'];
                if(rec !== '' ||  rec !== null || rec !== undefined){
                  for(let i of rec){
                    this.passDataQuoteLOV.tableData.push({
                      quotationNo: i.quotationNo,
                      cedingName:  i.cedingName,
                      insuredDesc: i.insuredDesc,
                      riskName: (i.project == null) ? '' : i.project.riskName
                    });
                  }
                  this.table.refreshTable();
                  $('#lovMdl > #modalBtn').trigger('click');
                }
              });
            }

            search() {
                          this.passDataQuoteLOV.tableData = [];
                          this.quotationService.getQuoProcessingData(this.searchParams)
                          .subscribe(val => {
                            var records = val['quotationList'];

                            if(records === null  || records === '' || records === undefined){
                              this.showAll = false;
                            }else{
                              for(let rec of records){
                                if(rec.status.toUpperCase() === 'RELEASED' || rec.status.toUpperCase() === 'ON HOLD COVER'){
                                  this.passDataQuoteLOV.tableData.push({
                                    quotationNo: rec.quotationNo,
                                    cedingName:  rec.cedingName,
                                    insuredDesc: rec.insuredDesc,
                                    riskName: (rec.project == null) ? '' : rec.project.riskName
                                  });
                                }
                              }
                            }
                            this.table.refreshTable();
                          });

                          var qLine = this.quoteLine.toUpperCase();

                          if (qLine === '' ||
                            qLine === 'EAR' ||
                            qLine === 'EEI' ||
                            qLine === 'CEC' ||
                            qLine === 'MBI' ||
                            qLine === 'BPV' ||  
                            qLine === 'MLP' ||
                            qLine === 'DOS') {

                            $('#lovMdl > #modalBtn').trigger('click');
                        }
                      }

                      onRowClick(event){
                        this.rowRec = event;
                      }

                      onSaveClickLOV(){
                        this.sliceQuoteNo(this.rowRec.quotationNo);
                        this.quoteNo = this.rowRec.quotationNo;
                        if(this.quoteNo != null || this.quoteNo != undefined || this.quoteNo != ''){
                        }

                        this.modalService.dismissAll();
                        this.btnApprovalEnabled = false;
                        this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(this.quoteNo))
                        .subscribe(data => {
                          this.newHc(false);
                          this.insured = this.rowRec.insuredDesc;
                          this.cedCo = this.rowRec.cedingName;
                          this.risk = this.rowRec.riskName;
                          this.hcLine  = this.qLine;
                          this.hcYear  =  String(new Date().getFullYear());
                          this.showAll = true;

                          if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){ 
                            this.holdCover.holdCoverId = '';
                            this.hcLine  = '';
                            this.hcYear  =  '';
                            this.hcSeqNo = '';
                            this.hcRevNo = '';
                            this.holdCover.holdCoverNo = '';
                            this.holdCover.periodFrom = '';
                            this.holdCover.periodTo = '';
                            this.holdCover.compRefHoldCovNo = '';
                            this.holdCover.status = '';
                            this.holdCover.reqBy = '';
                            this.holdCover.reqDate = '';
                            this.holdCover.preparedBy = '';
                            this.holdCover.approvedBy = '';
                            this.holdCover.optionId = '';
                            this.clickView = false;
                            this.quoteId = (data['quotationList'][0] === undefined) ? '' : data['quotationList'][0].quoteId;
                            this.cancelHcBtnEnabled = false;
                            this.btnApprovalEnabled = false;

                          }else{
                            var rec = data['quotationList'][0].holdCover;
                            this.holdCover.holdCoverNo = rec.holdCoverNo;
                            this.splitHcNo(rec.holdCoverNo);
                            this.holdCover.periodFrom = this.ns.toDateTimeString(rec.periodFrom);
                            this.holdCover.periodTo = this.ns.toDateTimeString(rec.periodTo);
                            this.periodFromTime = this.holdCover.periodFrom.split('T')[1];
                            this.periodToTime = this.holdCover.periodTo.split('T')[1];
                            this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
                            this.holdCover.reqBy  = rec.reqBy;
                            this.holdCover.reqDate  = this.ns.toDateTimeString(rec.reqDate);
                            this.holdCover.status  = rec.status;
                            this.holdCover.approvedBy =  rec.approvedBy;
                            this.holdCover.holdCoverId = rec.holdCoverId;
                            this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
                            this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
                            this.holdCover.createDate = this.ns.toDateTimeString(rec.createDate);
                            this.holdCover.createUser = rec.createUser;
                            this.holdCover.optionId = rec.optionId;
                            this.quoteId = data['quotationList'][0].quoteId;
                            this.cancelHcBtnEnabled = true;
                            this.btnApprovalEnabled = true;

                            if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
                              this.clickView = false;

                            }else{
                              $('#modifMdl > #modalBtn').trigger('click');

                            }
                          }

                        });
                      }

                      holdCoverReq:any
                      onSaveClick(cancelFlag?){
                        this.cancelFlag = cancelFlag !== undefined;
                        if(this.quoteNo === '' || this.quoteNo === null || this.quoteNo === undefined ||
                          this.holdCover.periodFrom === '' || this.holdCover.periodFrom === null || this.holdCover.periodFrom === undefined ||
                          this.holdCover.periodTo === '' || this.holdCover.periodTo === null || this.holdCover.periodTo === undefined ||
                          this.holdCover.compRefHoldCovNo === '' || this.holdCover.compRefHoldCovNo === null || this.holdCover.compRefHoldCovNo === undefined ||
                          this.holdCover.reqBy === '' || this.holdCover.reqBy ===  null || this.holdCover.reqBy === undefined ||
                          this.holdCover.reqDate === '' || this.holdCover.reqDate === null || this.holdCover.reqDate === undefined ||
                          this.holdCover.optionId === '' || this.holdCover.optionId === null || this.holdCover.optionId === undefined){

                          this.dialogIcon = 'error';
                        this.dialogMessage = 'Please complete all the required fields.';
                        $('app-sucess-dialog #modalBtn').trigger('click');
                        setTimeout(()=>{$('.globalLoading').css('display','none');},0);
                        $('.warn').focus();
                        $('.warn').blur();
                      }else{
                        this.quotationService.getQuoteGenInfo('',this.plainQuotationNo(this.quoteNo))
                        .subscribe(val => {
                          this.quoteId = val['quotationGeneralInfo'].quoteId;

                          this.holdCoverReq = {
                            "approvedBy": this.holdCover.approvedBy,
                            "compRefHoldCovNo": this.holdCover.compRefHoldCovNo,
                            "createDate": (this.holdCover.createDate === null || this.holdCover.createDate === '' || this.holdCover.createDate === undefined) ? this.ns.toDateTimeString(0) : this.holdCover.createDate,
                            "createUser": (this.holdCover.createUser === null || this.holdCover.createUser === '' || this.holdCover.createUser === undefined) ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.createUser,
                            "holdCoverId": this.holdCover.holdCoverId,
                            "holdCoverRevNo": this.hcRevNo,
                            "holdCoverSeqNo": this.hcSeqNo,
                            "optionId": this.holdCover.optionId,
                            "holdCoverYear": (this.hcYear === null || this.hcYear === '' || this.hcYear === undefined) ? String(new Date().getFullYear()) : this.hcYear,
                            "lineCd": (this.hcLine === null || this.hcLine === '' || this.hcLine === undefined) ? this.qLine.toUpperCase() : this.hcLine.toUpperCase() ,
                            "periodFrom": this.holdCover.periodFrom.split('T')[0] + 'T' + (this.periodFromTime === undefined ? this.holdCover.periodFrom.split('T')[1]: this.periodFromTime),
                            "periodTo": this.holdCover.periodTo.split('T')[0] + 'T' + (this.periodToTime === undefined ? this.holdCover.periodTo.split('T')[1]: this.periodToTime),
                            "preparedBy": (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy,
                            "quoteId": this.quoteId,
                            "reqBy": this.holdCover.reqBy,
                            "reqDate": (this.holdCover.reqDate === null  || this.holdCover.reqDate === undefined || this.holdCover.reqDate === '') ?  this.ns.toDateTimeString(0) : this.holdCover.reqDate,
                            "status": (this.holdCover.status === null || this.holdCover.status === '') ? 'I' : this.holdCover.status.substring(0,1),
                            "updateDate" : this.ns.toDateTimeString(0),
                            "updateUser": (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy
                          }

                          console.log(JSON.stringify(this.holdCoverReq));
                          this.quotationService.saveQuoteHoldCover(
                            JSON.stringify(this.holdCoverReq)
                            ).subscribe(data => {
                              var returnCode = data['returnCode'];
                              var hcNo = data['holdCoverNo'].split('-');
                              this.hcLine = hcNo[1];
                              this.hcYear = hcNo[2];
                              this.hcSeqNo = hcNo[3];
                              this.hcRevNo = hcNo[4];

                              if(returnCode === 0){
                                this.dialogIcon = 'error';
                                this.dialogMessage = 'Data insertion error.';
                                $('app-sucess-dialog #modalBtn').trigger('click');
                                setTimeout(()=>{$('.globalLoading').css('display','none');},0);
                                $('.warn').focus();
                                $('.warn').blur();
                              }else{
                                this.dialogIcon = '';
                                this.dialogMessage = '';
                                $('app-sucess-dialog #modalBtn').trigger('click');
                                this.btnApprovalEnabled = true;
                                this.cancelHcBtnEnabled = true;
                                $('.warn').focus();
                                $('.warn').blur();

                                if(this.btnCancelMainEnabled === true){
                                  this.modalService.dismissAll();
                                }  
                                this.quotationService.getHoldCoverInfo('',this.plainHc(data['holdCoverNo']))
                                .subscribe(data => {
                                  var rec = data['quotation'].holdCover;
                                  this.holdCover.holdCoverNo = rec.holdCoverNo;
                                  this.holdCover.holdCoverId = rec.holdCoverId;
                                  this.holdCover.periodFrom = this.ns.toDateTimeString(rec.periodFrom);
                                  this.holdCover.periodTo = this.ns.toDateTimeString(rec.periodTo);
                                  this.holdCover.compRefHoldCovNo  = rec.compRefHoldCovNo;
                                  this.holdCover.status = rec.status;
                                  this.holdCover.reqBy =  rec.reqBy;
                                  this.holdCover.reqDate = (rec.reqDate === null || rec.reqDate === undefined) ? '' : this.ns.toDateTimeString(rec.reqDate);
                                  this.holdCover.preparedBy = rec.preparedBy;
                                  this.holdCover.approvedBy = rec.approvedBy;
                                  this.holdCover.optionId = rec.optionId;
                                  this.periodFromTime = this.holdCover.periodFrom.split('T')[1];
                                  this.periodToTime = this.holdCover.periodTo.split('T')[1];
                                });
                              }
                            });

                          });
// }
}

}

plainHc(data:string){
  var arr = data.split('-');
  return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
}

plainQuotationNo(data: string){
  var arr = data.split('-');
  return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + arr[4];
}

setPeriodTo(periodFrom){  
  try{
    if(periodFrom === ''){
      this.holdCover.periodTo = '';
    }else{
      var d = new Date(periodFrom);
      var s = d.setDate(d.getDate()+30);
      this.holdCover.periodTo = (s === null  || s === undefined ) ? '' : this.ns.toDateTimeString(s);
      this.holdCover.periodFrom = this.ns.toDateTimeString(periodFrom);
    }
  }catch(e){
  }
}

searchQuoteInfo(line,year,seq,rev,ced){
  var qNo = line.toUpperCase() +"-"+year+"-"+seq+"-"+rev+"-"+ced;
  this.quotationService.getSelectedQuote(this.plainQuotationNo(qNo))
  .subscribe(val => {

    var data = val['quotationList'][0];
    if(data === undefined || data === null){
      this.quoteNo = '';
      this.insured = '';
      this.cedCo = '';
      this.risk = '';
      this.hcLine  = '';
      this.hcYear  =  '';
      
      if(line === '' || year === '' || seq === '' || rev === '' || ced === ''){
      }else{
        $('#lovMdl > #modalBtn').trigger('click');
      }

    }else{
      if(data.status.toUpperCase() === 'RELEASED'){
        this.newHc(false);
        this.quoteNo = (data.quotationNo === null || data.quotationNo === undefined) ? '' : data.quotationNo;
        this.sliceQuoteNo(qNo);
        this.insured = (data.insuredDesc  === null || data.insuredDesc === undefined) ? '' : data.insuredDesc;
        this.cedCo = (data.cedingName  === null || data.cedingName === undefined) ? '' : data.cedingName;
        this.risk = (data.project  === null || data.project === undefined) ? '' : data.project.riskName;
        // this.hcLine  = line;
        // this.hcYear  =  year;
      }
    }
  });


  try{
    this.btnApprovalEnabled = false;
    this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(qNo))
    .subscribe(data => {
      if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){
        this.insured = '';
        this.cedCo = ''
        this.risk = '';
        this.holdCover.holdCoverId = '';
        this.hcLine  = '';
        this.hcYear  =  '';
        this.hcSeqNo = '';
        this.hcRevNo = '';
        this.holdCover.periodFrom = '';
        this.holdCover.periodTo = '';
        this.holdCover.compRefHoldCovNo = '';
        this.holdCover.status = '';
        this.holdCover.reqBy = '';
        this.holdCover.reqDate = '';
        this.holdCover.preparedBy = '';
        this.holdCover.approvedBy = '';
        this.cancelHcBtnEnabled = false;
        
      }else{

        var rec = data['quotationList'][0].holdCover;
        this.holdCover.holdCoverNo = rec.holdCoverNo;
        this.splitHcNo(rec.holdCoverNo);
        this.holdCover.periodFrom = this.ns.toDateTimeString(rec.periodFrom);
        this.holdCover.periodTo = this.ns.toDateTimeString(rec.periodTo);
        this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
        this.holdCover.reqBy  = rec.reqBy;
        this.holdCover.reqDate  = this.ns.toDateTimeString(rec.reqDate);
        this.holdCover.status  = rec.status;
        this.holdCover.approvedBy =  rec.approvedBy;
        this.holdCover.holdCoverId = rec.holdCoverId;
        this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
        this.holdCover.createDate = this.ns.toDateTimeString(rec.createDate);
        this.holdCover.createUser = rec.createUser;
        this.cancelHcBtnEnabled = true;
        this.btnApprovalEnabled = true;

        if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
          this.clickView = false;

        }else{
          $('#modifMdl > #modalBtn').trigger('click');

        }

      }
    });
  }catch(Exception){
  }



}


onClickView(){
  this.modalService.dismissAll();
  this.clickView = true;
  this.disableFieldsHc(true);
}

onClickModif(){
  this.modalService.dismissAll();
  this.clickView = false;
  this.clickModif = true;
}

onClickCancelModifMdl(){

  this.modalService.dismissAll();
  this.clearAll();
}

onClickCancelQuoteLOV(){
  this.modalService.dismissAll();
  //this.loading = false;
}

onClickCancel(){
  //  this.btnCancelMainEnabled = true;
  // $('#confirm-save #modalBtn2').trigger('click');
  this.cancelBtn.clickCancel();
}

newHc(isNew:boolean){
  if(isNew === true){
    this.hcPrefix = '';
    this.type = 'text';
    this.typeTime = 'text';
    this.disableFieldsHc(true);
  }else{
    this.hcPrefix = 'HC';
    this.type = 'date';
    this.typeTime = 'time';
    this.disableFieldsHc(false);
  }
}

disableFieldsHc(isDisabled:boolean){
  if(isDisabled === true){
    $("#periodFrom").prop('readonly', true);
    $("#periodTo").prop('readonly', true);
    $("#reqBy").prop('readonly', true);
    $("#reqDate").prop('readonly', true);
    $("#coRef").prop('readonly', true);
    $("#periodFromTime").prop('readonly',true);
    $("#periodToTime").prop('readonly',true);
    $("#optionId").prop('readonly',true);
    this.optLovEnabled = false;

  }else{
    $("#periodFrom").prop('readonly', false);
    $("#periodTo").prop('readonly', false);
    $("#reqBy").prop('readonly', false);
    $("#reqDate").prop('readonly', false);
    $("#coRef").prop('readonly', false);
    $("#periodFromTime").prop('readonly',false);
    $("#periodToTime").prop('readonly',false);
    $("#optionId").prop('readonly',false);
    this.optLovEnabled = true;  
  }
}

clearAll(){
  this.quoteNo = '';
  this.qLine = '';
  this.qYear = '';
  this.qSeqNo = '';
  this.qRevNo = '';
  this.qCedingId ='';
  this.insured = '';
  this.cedCo = '';
  this.risk = '';
  this.hcLine  = '';
  this.hcYear  =  '';
  this.hcSeqNo = '';
  this.hcRevNo ='';
  this.holdCover.holdCoverNo ='';
  this.holdCover.periodFrom = '';
  this.holdCover.periodTo = '';
  this.holdCover.compRefHoldCovNo = '';
  this.holdCover.status = '';
  this.holdCover.reqBy = '';
  this.holdCover.reqDate = '';
  this.holdCover.preparedBy = '';
  this.holdCover.approvedBy = '';
  this.holdCover.optionId = '';
}

onClickSave(){
  $('#confirm-save #modalBtn2').trigger('click');
}

onClickApprovalBtnMdl(){
  $('#approvalBtnMdl #modalBtn').trigger('click');
}

fmtSq(sq){
  this.qSeqNo = (this.decPipe.transform(sq,'5.0-0') === null) ? '' : this.decPipe.transform(sq,'5.0-0').replace(',','');
}

fmtRn(rn){
  this.qRevNo = (this.decPipe.transform(rn,'2.0-0') === null) ? '' : this.decPipe.transform(rn,'2.0-0').replace(',','');
}

fmtCn(cn){
  this.qCedingId = (this.decPipe.transform(cn,'2.0-0') === null) ? '' : this.decPipe.transform(cn,'2.0-0').replace(',','');
}

// sampleOk(){
  //   this.table.pressEnterFilter();
  //   console.log(this.passDataQuoteLOV.filters[0].search + "  >> FILTERS HERE 3rd ");
  // }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('hold-cover-monitoring');
    } 
  }

  onClickCancelHoldCover(){
    this.loading = true;
    this.ids = {
      "quoteId":(this.quoteId === null || this.quoteId === undefined)? '' : this.quoteId,
      "holdCoverId":this.holdCover.holdCoverId
    };

    if(this.quoteId === null || this.quoteId === undefined){
      this.genMsg = 'No existing Hold Cover';
      this.icon = 'fa fa-times-circle fa-3x';
      $('#successModal #modalBtn').trigger('click');
      this.loading = false;
    }else{
      this.quotationService.updateHoldCoverStatus(JSON.stringify(this.ids))
      .subscribe(data => {
        console.log(data);
        this.loading = false;
        this.genMsg = 'Cancelled successfully' ;
        this.icon = 'fa fa-check-circle fa-3x';
        $('#successModal #modalBtn').trigger('click');
        this.clearHcDetails();
        this.cancelHcBtnEnabled = false;
        this.btnApprovalEnabled = false;
      });  
    }

  }

  onConfirmCancelHc(){
    this.warningMsg = 'Do you really want to cancel this Hold Cover?'
    $('#warningMdl #modalBtn').trigger('click');  
  }

  onClickOptionLOV(){
    this.passDataQuoteOptionsLOV.tableData = [];
    $('#optionMdl #modalBtn2').trigger('click');
    this.quotationService.getQuoteOptions(this.quoteId.toString(),'')
    .subscribe(data => {
      console.log(data);
      var rec = data['quotation'].optionsList;
      for(let i of rec){
        this.passDataQuoteOptionsLOV.tableData.push({
          optionNo:         i.optionId,
          rate:             i.optionRt,
          conditions:       i.condition,
          commRateQuota:    i.commRtQuota,
          commRateSurplus:  i.commRtSurplus,
          commRateFac:      i.commRtFac
        });
      }
      this.opt.refreshTable();
    });
  }

  onClickOptionRow(event){
    this.selectedOption = event;
  }

  onClickOkOption(){
    this.holdCover.optionId = this.selectedOption.optionNo;
    this.modalService.dismissAll();
  }

  clearHcDetails(){
    this.holdCover.holdCoverNo = '';
    this.holdCover.holdCoverId = '';
    this.holdCover.periodFrom = '';
    this.holdCover.periodTo = '';
    this.periodFromTime = '';
    this.periodToTime = '';
    this.holdCover.compRefHoldCovNo = '';
    this.holdCover.status = '';
    this.holdCover.reqBy = '';
    this.holdCover.reqDate = '';
    this.holdCover.preparedBy = '';
    this.holdCover.approvedBy = '';
    this.holdCover.optionId = '';
  }

  searchOptNo(optNoInput){
    this.quotationService.getQuoteOptions(this.quoteId.toString(),'')
    .subscribe(data => {
        var rec = data['quotation'].optionsList;
        for(let i of rec){
          if(Number(i.optionId) !== Number(optNoInput)){
            this.holdCover.optionId = '';
            this.onClickOptionLOV();

          }
        }
    });
  }
}
