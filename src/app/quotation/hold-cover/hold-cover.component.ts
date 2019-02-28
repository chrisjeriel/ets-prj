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
      tableOnly: true,
      keys: ['quotationNo','cedingName','insuredDesc','riskName'],
      pageStatus: true,
      pagination: true,
    };

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
    this.holdCover.status = "In Progress";
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
      this.hcLine = hcArr[0];
      this.hcYear = hcArr[1];
      this.hcSeqNo = hcArr[2];
      this.hcRevNo = hcArr[3];
    }
  }

  search() {
    this.passDataQuoteLOV.tableData = [];
    this.quotationService.getQuoProcessingData()
    .subscribe(val => {
      var records = val['quotationList'];
      for(let rec of records){
        this.passDataQuoteLOV.tableData.push({
          quotationNo: rec.quotationNo,
          cedingName:  rec.cedingName,
          insuredDesc: rec.insuredDesc,
          riskName: (rec.project == null) ? '' : rec.project.riskName
        });
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
    this.insured = this.rowRec.insuredDesc;
    this.cedCo = this.rowRec.cedingName;
    this.risk = this.rowRec.riskName;
    this.hcLine  = this.qLine;
    this.hcYear  =  String(new Date().getFullYear());
    this.modalService.dismissAll();

    this.quotationService.getSelectedQuote(this.plainQuotationNo(this.quoteNo))
      .subscribe(val => {
        this.holdCover.reqBy  = val['quotationList'][0].reqBy;
      });
    this.holdCover.reqDate  = new Date().toISOString();
  }
  
  holdCoverReq:any
  onSaveClick(qline,qyear,qseqNo,qrevNo,qcomNo,periodTo,periodFrom,coRef,status,reqDate,prepBy,appBy,hcline,hcyear,hcseqNo,hcrevNo,reqBy){
    if(qline === "" || qyear === "" || qseqNo === "" || qrevNo === "" || qcomNo === "" || periodTo === "" || periodFrom === "" || status === "" || hcline === "" || hcyear === "" || hcseqNo === "" || hcrevNo === ""){
      $('#warningMdl > #modalBtn').trigger('click');
      $('.warn').focus();
      $('.warn').blur();
      this.warningMsg = "Please complete all required fields!";
      $('.warn').focus();
      $('.warn').blur();
    }else {
        this.quotationService.getQuoteGenInfo('',this.plainQuotationNo(this.quoteNo))
          .subscribe(val => {
          this.quoteId = val['quotationGeneralInfo'].quoteId;
          this.holdCover.createDate = this.formatDate(val['quotationGeneralInfo'].createDate);
          this.holdCover.createUser = val['quotationGeneralInfo'].createUser;

             this.holdCoverReq = {
                  "approvedBy": appBy,
                  "compRefHoldCovNo": coRef,
                  "createDate": this.holdCover.createDate,
                  "createUser": this.holdCover.createUser,
                  "holdCoverId": this.quoteId,
                  "holdCoverRevNo": hcrevNo,
                  "holdCoverSeqNo": hcseqNo,
                  "holdCoverYear": hcyear,
                  "lineCd": hcline,
                  "periodFrom": periodFrom,
                  "periodTo": periodTo,
                  "preparedBy": prepBy,
                  "quoteId": this.quoteId,
                  "reqBy": reqBy,
                  "reqDate": reqDate,
                  "status": status,
                  "updateDate": new Date().toISOString(),
                  "updateUser": prepBy
                }
                    this.quotationService.saveQuoteHoldCover(
                      JSON.stringify(this.holdCoverReq)
                    ).subscribe(data => {
                      console.log(data);

                      var returnCode = data['returnCode'];
                      if(returnCode === 0){
                         $('#warningMdl > #modalBtn').trigger('click');
                         $('.warn').focus();
                         $('.warn').blur();
                         this.warningMsg = data['errorList'][0].errorMessage;
                      }else{
                         $('#successMdl > #modalBtn').trigger('click');
                      }
                    });

                  });
   }
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
          this.quoteNo = (data.quotationNo === null || data.quotationNo === undefined) ? '' : data.quotationNo;
          this.insured = (data.insuredDesc  === null || data.insuredDesc === undefined) ? '' : data.insuredDesc;
          this.cedCo = (data.cedingName  === null || data.cedingName === undefined) ? '' : data.cedingName;
          this.risk = (data.project  === null || data.project === undefined) ? '' : data.project.riskName;
          this.hcLine  = line;
          this.hcYear  =  year;
        }
      });
  }
}
