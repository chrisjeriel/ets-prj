import { Component, OnInit } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css']
})
export class HoldCoverComponent implements OnInit {

  tableData: any[] = [];
  tHeader: any[] = [];
  quoteLine: any;
  private holdCover: HoldCoverInfo;
  passData: any = {
        tHeader: [
            "Quotation No.", "Ceding Company", "Insured", "Risk",
        ],
        resizable: [
            false,false,false,false
        ],
        dataTypes: [
            "text","text","text","text"
        ],
        tableData: this.quotationService.getListOfValuesHoldCover(),
        pageLength: 10,
        
    };

  constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Quo | Quotation to Hold Cover");
    this.tHeader.push("Quotation No");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Insured");
    this.tHeader.push("Risk");

    this.tableData = this.quotationService.getListOfValuesHoldCover();

    this.holdCover = new HoldCoverInfo();
    this.holdCover.quotationNo = "MOCK TEST";
    this.holdCover.cedingCompany = "MOCK TEST";
    this.holdCover.insured = "MOCK TEST";
    this.holdCover.risk = "MOCK TEST";
    this.holdCover.holdCoverNo = "MOCK TEST";
    this.holdCover.periodFrom = new Date();
    this.holdCover.requestedBy = "MOCK TEST";
    this.holdCover.periodTo = new Date();
    this.holdCover.requestDate = new Date();
    this.holdCover.coRefHoldCoverNo = "MOCK TEST";
    this.holdCover.preparedBy = "MOCK TEST"
    this.holdCover.status = "MOCK TEST";
    this.holdCover.approvedBy = "MOCK TEST";
  }

  search() {
    if (this.quoteLine === 'CAR' ||
      this.quoteLine === 'EAR' ||
      this.quoteLine === 'EEI' ||
      this.quoteLine === 'CEC' ||
      this.quoteLine === 'MBI' ||
      this.quoteLine === 'BPV' ||
      this.quoteLine === 'MLP' ||
      this.quoteLine === 'DOS') {

      $('#modalBtn').trigger('click');
    }

  }

}
