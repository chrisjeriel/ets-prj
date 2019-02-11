import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { getLocaleFirstDayOfWeek, getLocaleDateFormat } from '@angular/common';
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
  
  ngOnInit() {
    this.titleService.setTitle("Quo | Quotation to Hold Cover");
    //this.tableData = this.quotationService.getListOfValuesHoldCover();
    this.holdCoverInfo = new HoldCoverInfo();

    this.quotationService.getHoldCoverInfo()
        .subscribe(val => 
            {
              var rec = val['quotation'];
              console.log(rec);
              this.holdCoverInfo.quotationNo        = rec.quotationNo;
              this.holdCoverInfo.cedingCompany      = rec.cedingName;
              this.holdCoverInfo.insured            = rec.insuredDesc;
              this.holdCoverInfo.risk               = rec.project['riskName'];
              this.holdCoverInfo.holdCoverNo        = rec.holdCover['holdCoverNo'];
              this.holdCoverInfo.periodFrom         = this.formatDate(rec.holdCover['periodFrom']);
              this.holdCoverInfo.requestedBy        = rec.holdCover['reqBy'];
              this.holdCoverInfo.periodTo           = this.formatDate(rec.holdCover['periodTo']);
              this.holdCoverInfo.requestDate        = this.formatDate(rec.holdCover['reqDate']);
              this.holdCoverInfo.coRefHoldCoverNo   = rec.holdCover['compRefHoldCovNo'];
              this.holdCoverInfo.preparedBy         = rec.holdCover['preparedBy'];
              this.holdCoverInfo.status             = rec.holdCover['status'];
              this.holdCoverInfo.approvedBy         = rec.holdCover['approvedBy'];
              
              this.sliceQuoteNo(this.holdCoverInfo.quotationNo);
              this.sliceHcNo(this.holdCoverInfo.holdCoverNo);
              
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
      return date[0] + "-" + '0'+ date[1] + "-" + date[2];
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

  hcLine: string;
  hcYear: string;
  hcSeqNo: string;
  hcRevNo: string;
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
    this.insured = event.insuredDesc;
    this.cedCo = event.cedingName;
    this.risk = event.riskName;
  }

}
