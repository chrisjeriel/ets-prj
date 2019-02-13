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
    //this.tableData = this.quotationService.getListOfValuesHoldCover();
    this.holdCoverInfo = new HoldCoverInfo();

    this.quotationService.getHoldCoverInfo()
        .subscribe(val => 
            {
              var rec = val['quotation'];
              console.log(rec);   
              this.quoteId  = rec.quoteId;  
              this.holdCover                    =  rec.holdCover;
              this.holdCover.periodFrom         =  this.formatDate(this.holdCover.periodFrom);
              this.holdCover.periodTo           =  this.formatDate(this.holdCover.periodTo);
              this.holdCover.reqDate            =  this.formatDate(this.holdCover.reqDate);
              this.holdCover.createDate         =  this.formatDate(this.holdCover.createDate);
              this.holdCover.updateDate         =  this.formatDate(this.holdCover.updateDate);
              //this.sliceQuoteNo(this.holdCoverInfo.quotationNo);
              this.sliceHcNo(this.holdCover.holdCoverNo);
              
            }
      );

      this.quotationService.getQuoProcessingData()
            .subscribe(val => {
              var records = val['quotationList'];
              for(let rec of records){
                this.passDataQuoteLOV.tableData.push({
                  quotationNo: rec.quotationNo,
                  cedingName:  rec.cedingName,
                  insuredDesc: rec.insuredDesc,
                  riskName: (rec.project == null) ? '' : rec.project.riskName
                }                                  
                  
                );
              }
              this.table.refreshTable();
            });
   
  }

  formatDate(date){
    if(date[1] < 9){
      return (date[0] + "-" + '0'+ date[1] + "-" + date[2]);
    }else{
      return date[0] + "-" +date[1] + "-" + date[2];
    }
    
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


  sliceHcNo(hcNo: string){
    var hcArr = hcNo.split("-");
    for(var i=0;i<hcArr.length;i++){
      this.hcLine = hcArr[0];
      this.hcYear = hcArr[1];
      this.hcSeqNo = hcArr[2];
      this.hcRevNo = hcArr[3];
    }
  }

  search() {
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
    this.modalService.dismissAll();
  }
  
  holdCoverReq:any
  onSaveClick(){
    this.holdCoverReq = {
      "approvedBy": this.holdCover.approvedBy,
      "compRefHoldCovNo": this.holdCover.compRefHoldCovNo,
      "createDate": this.holdCover.createDate,
      "createUser": this.holdCover.createUser,
      "holdCoverId": this.holdCover.holdCoverId,
      "holdCoverRevNo": this.hcRevNo,
      "holdCoverSeqNo": this.hcSeqNo,
      "holdCoverYear": this.hcYear,
      "lineCd": this.hcLine,
      "periodFrom": this.holdCover.periodFrom,
      "periodTo": this.holdCover.periodTo,
      "preparedBy": this.holdCover.preparedBy,
      "quoteId": this.quoteId,
      "reqBy": this.holdCover.reqBy,
      "reqDate": this.holdCover.reqDate,
      "status": this.holdCover.status,
      "updateDate": this.holdCover.updateDate,
      "updateUser": this.holdCover.updateUser
    }
        this.quotationService.saveQuoteHoldCover(
          JSON.stringify(this.holdCoverReq)
        ).subscribe(data => console.log(data));
  }

}
