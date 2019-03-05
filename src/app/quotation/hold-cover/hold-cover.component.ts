import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';



@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css']
})
export class HoldCoverComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
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
      /*filters: [
        {
          key: 'quotationNo',
          title : 'Quotation No.',
          dataType: 'text'
        },
        {
          key: 'cedingName',
          title : 'Ceding Company',
          dataType: 'text'
        },
        {
          key: 'insuredDesc',
          title : 'Insured',
          dataType: 'text'
        },
        {
          key: 'riskName',
          title : 'Risk',
          dataType: 'text'
        }
      ]*/
      filters: [
        {
            key: 'quotationNo',
            title: 'Quotation No.',
            dataType: 'seq'
        },
        {
            key: 'cessionDesc',
            title: 'Type of Cession',
            dataType: 'text'
        },
        {
            key: 'lineClassCdDesc',
            title: 'Line Class',
            dataType: 'text'
        },
        {
            key: 'status',
            title: 'Status',
            dataType: 'text'
        },
        {
            key: 'cedingName',
            title: 'Ceding Co.',
            dataType: 'text'
        },
        {
            key: 'principalName',
            title: 'Principal',
            dataType: 'text'
        },
        {
            key: 'contractorName',
            title: 'Contractor',
            dataType: 'text'
        },
        {
            key: 'insuredDesc',
            title: 'Insured',
            dataType: 'text'
        },
        {
            key: 'riskName',
            title: 'Risk',
            dataType: 'text'
        },
        {
            key: 'objectDesc',
            title: 'Object',
            dataType: 'text'
        },
        {
            key: 'site',
            title: 'Site',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title: 'Policy No.',
            dataType: 'seq'
        },
        {
            key: 'currencyCd',
            title: 'Currency',
            dataType: 'text'
        },
        {
            key: 'issueDate',
            title: 'Quote Date',
            dataType: 'date'
        },
        {
            key: 'expiryDate',
            title: 'Valid Until',
            dataType: 'date'
        },
        {
            key: 'reqBy',
            title: 'Requested By',
            dataType: 'text'
        },
        {
            key: 'createUser',
            title: 'Created By',
            dataType: 'text'
        },
        ],

        colSize: ['', '250px', '250px', '250px'],
    };

    searchParams: any[] = [];

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

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

  hcLine               : string;
  hcYear               : string;
  hcSeqNo              : string;
  hcRevNo              : string;

  quoteId: number;
  warningMsg: string;
  clickView:boolean;
  clickModif:boolean;

  holdCover: any = {
    approvedBy:     "",
    compRefHoldCovNo:     "",
    createDate:     "",
    createUser:     "",
    holdCoverId:    "",
    holdCoverNo:    "",
    holdCoverRevNo:     "",
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
    //this.holdCover.status = "I";
    this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;
  }

  formatDate(date){
    return new Date(date[0] + "/" + date[1] + "/" + date[2]).toISOString();
  }

  sliceQuoteNo(qNo: string){
    var qArr = qNo.split("-");
    for(var i=0;i<qArr.length;i++){
      this.qLine = qArr[0];
      this.qYear = qArr[1];
      this.qSeqNo = qArr[2];
      this.qRevNo = qArr[3];
      this.qCedingId = qArr[4];
    }
  }


  splitHcNo(hcNo: string){
    var hcArr = hcNo.split("-");
    for(var i=0;i<hcArr.length;i++){
      this.hcLine = hcArr[1];
      this.hcYear = hcArr[2];
      this.hcSeqNo = hcArr[3];
      this.hcRevNo = hcArr[4];
    }
  }

  search() {
    this.passDataQuoteLOV.tableData = [];
    this.quotationService.getQuoProcessingData([])
    .subscribe(val => {
      var records = val['quotationList'];
      for(let rec of records){
        if(rec.status === 'Issued' || rec.status === 'ISSUED' || rec.status === 'issued'){
          this.passDataQuoteLOV.tableData.push({
            quotationNo: rec.quotationNo,
            cedingName:  rec.cedingName,
            insuredDesc: rec.insuredDesc,
            riskName: (rec.project == null) ? '' : rec.project.riskName
          });  
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
  // this.insured = this.rowRec.insuredDesc;
  // this.cedCo = this.rowRec.cedingName;
  // this.risk = this.rowRec.riskName;
  // this.hcLine  = this.qLine;
  // this.hcYear  =  String(new Date().getFullYear());
  this.modalService.dismissAll();

  // this.quotationService.getSelectedQuote(this.plainQuotationNo(this.quoteNo))
  //   .subscribe(val => {
    //     this.holdCover.reqBy  = val['quotationList'][0].reqBy;
    //   });
    this.holdCover.reqDate  = new Date().toISOString();
    this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(this.quoteNo))
    .subscribe(data => {
      this.insured = this.rowRec.insuredDesc;
      this.cedCo = this.rowRec.cedingName;
      this.risk = this.rowRec.riskName;
      this.hcLine  = this.qLine;
      this.hcYear  =  String(new Date().getFullYear());

      if(data['quotationList'][0] === null || data['quotationList'][0] === undefined || data['quotationList'][0] === ''){ 
        this.holdCover.holdCoverId = 1;
        this.hcRevNo = '01';
        this.hcSeqNo = '00001';
      }else{
        var rec = data['quotationList'][0].holdCover;
        this.holdCover.holdCoverNo = rec.holdCoverNo;
        this.splitHcNo(rec.holdCoverNo);
        this.holdCover.periodFrom = this.formatDate(rec.periodFrom);
        this.holdCover.periodTo = this.formatDate(rec.periodTo);
        this.holdCover.compRefHoldCovNo = rec.compRefHoldCovNo;
        this.holdCover.reqBy  = rec.reqBy;
        this.holdCover.reqDate  = this.formatDate(rec.reqDate);
        this.holdCover.status  = rec.status;
        this.holdCover.approvedBy =  rec.approvedBy;
        this.holdCover.holdCoverId = rec.holdCoverId;
        this.holdCover.updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.holdCover.preparedBy = JSON.parse(window.localStorage.currentUser).username;

        if(rec.approvedBy === '' || rec.approvedBy === null ||  rec.approvedBy === undefined){
          this.clickView = false;

        }else{
          $('#modifMdl > #modalBtn').trigger('click');

        }
      }

    });
  }
  
  holdCoverReq:any
  // onSaveClick(qline,qyear,qseqNo,qrevNo,qcomNo,periodTo,periodFrom,coRef,status,reqDate,prepBy,appBy,hcline,hcyear,hcseqNo,hcrevNo,reqBy){
      onSaveClick(){
    // if(qline === "" || qyear === "" || qseqNo === "" || qrevNo === "" || qcomNo === "" || periodTo === "" || periodFrom === ""  || hcline === "" || hcyear === ""){
    //   $('#warningMdl > #modalBtn').trigger('click');
    //   $('.warn').focus();
    //   $('.warn').blur();
    //   this.warningMsg = "Please complete all required fields!";
    //   $('.warn').focus();
    //   $('.warn').blur();
    // }else {
      this.quotationService.getQuoteGenInfo('',this.plainQuotationNo(this.quoteNo))
      .subscribe(val => {
        this.quoteId = val['quotationGeneralInfo'].quoteId;
        this.holdCover.createDate = this.formatDate(val['quotationGeneralInfo'].createDate);
        this.holdCover.createUser = val['quotationGeneralInfo'].createUser;

        // this.holdCoverReq = {
        //   "approvedBy": appBy,
        //   "compRefHoldCovNo": coRef,
        //   "createDate": this.holdCover.createDate,
        //   "createUser": this.holdCover.createUser,
        //   "holdCoverId": (this.holdCover.holdCoverId === null || this.holdCover.holdCoverId === '') ? 1 : hcrevNo,
        //   "holdCoverRevNo": (hcrevNo === null || hcrevNo === '') ? 1 : hcrevNo,
        //   "holdCoverSeqNo": (hcseqNo === null || hcseqNo === '') ? 1 : hcseqNo,
        //   "holdCoverYear": hcyear,
        //   "lineCd": hcline,
        //   "periodFrom": periodFrom,
        //   "periodTo": periodTo,
        //   "preparedBy": prepBy,
        //   "quoteId": this.quoteId,
        //   "reqBy": reqBy,
        //   "reqDate": reqDate,
        //   "status": (status === null || status === '') ? 'I' : status,
        //   "updateDate": new Date().toISOString(),
        //   "updateUser": (prepBy === null || prepBy === '') ? JSON.parse(window.localStorage.currentUser).username : prepBy
        // }

         this.holdCoverReq = {
          "approvedBy": this.holdCover.approvedBy,
          "compRefHoldCovNo": this.holdCover.compRefHoldCovNo,
          "createDate": this.holdCover.createDate,
          "createUser": this.holdCover.createUser,
          "holdCoverId": (this.holdCover.holdCoverId === null || this.holdCover.holdCoverId === '') ? 1 : Number(this.hcRevNo),
          "holdCoverRevNo": (this.hcRevNo === null || this.hcRevNo === '') ? 1 : this.hcRevNo,
          "holdCoverSeqNo": (this.hcSeqNo === null || this.hcSeqNo === '') ? 1 : this.hcSeqNo,
          "holdCoverYear": this.hcYear,
          "lineCd": this.hcLine,
          "periodFrom": this.holdCover.periodFrom,
          "periodTo": this.holdCover.periodTo,
          "preparedBy": this.holdCover.preparedBy,
          "quoteId": this.quoteId,
          "reqBy": this.holdCover.reqBy,
          "reqDate": this.holdCover.reqDate,
          "status": (this.holdCover.status === null || this.holdCover.status === '') ? 'I' : this.holdCover.status,
          "updateDate": new Date().toISOString(),
          "updateUser": (this.holdCover.preparedBy === null || this.holdCover.preparedBy === '') ? JSON.parse(window.localStorage.currentUser).username : this.holdCover.preparedBy
        }

        console.log(JSON.stringify(this.holdCoverReq));
        this.quotationService.saveQuoteHoldCover(
          JSON.stringify(this.holdCoverReq)
          ).subscribe(data => {
            var returnCode = data['returnCode'];
            if(returnCode === 0){
              $('#warningMdl > #modalBtn').trigger('click');
              $('.warn').focus();
              $('.warn').blur();
              this.warningMsg = data['errorList'][0].errorMessage;
            }else{
              $('app-sucess-dialog #modalBtn').trigger('click');
              this.quotationService.getSelectedQuotationHoldCoverInfo(this.plainQuotationNo(this.quoteNo))
              .subscribe(data => {
                var rec = data['quotationList'][0].holdCover;
                this.splitHcNo(rec.holdCoverNo);
                this.holdCover.status = rec.status;

                //changing status of prev hold cover to replaced
                // if(this.clickModif === true){
                  
                // }
              });
            }
          });

        });
   // }
  }

  plainQuotationNo(data: string){
    var arr = data.split('-');
    return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
  }

  setPeriodTo(periodFrom){
    var d = new Date(periodFrom);
    d.setDate(d.getDate()+30);
    this.holdCover.periodTo = d.toISOString();
  }

  searchQuoteInfo(line,year,seq,rev,ced){
    this.holdCover.reqDate  = new Date().toISOString();
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
      }else{
        if(data.status === 'Issued' || data.status === 'issued'){
          this.quoteNo = (data.quotationNo === null || data.quotationNo === undefined) ? '' : data.quotationNo;
          this.insured = (data.insuredDesc  === null || data.insuredDesc === undefined) ? '' : data.insuredDesc;
          this.cedCo = (data.cedingName  === null || data.cedingName === undefined) ? '' : data.cedingName;
          this.risk = (data.project  === null || data.project === undefined) ? '' : data.project.riskName;
          this.hcLine  = line;
          this.hcYear  =  year;
        }
      }
    });
  }


  onClickView(){
    this.modalService.dismissAll();
    this.clickView = true;
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
    this.holdCover.periodFrom = '';
    this.holdCover.periodTo = '';
    this.holdCover.compRefHoldCovNo = '';
    this.holdCover.status = '';
    this.holdCover.reqBy = '';
    this.holdCover.reqDate = '';
    this.holdCover.preparedBy = '';
    this.holdCover.approvedBy = '';
  }

  // updatePrevStats(rec){
  //   this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCoverReq)).subscribe(data => {console.log(data);});
  // }
  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }



}
