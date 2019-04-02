import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';

@Component({
  selector: 'app-pol-gen-info-open-cover',
  templateUrl: './pol-gen-info-open-cover.component.html',
  styleUrls: ['./pol-gen-info-open-cover.component.css']
})
export class PolGenInfoOpenCoverComponent implements OnInit {

  line: string;
  tableData: any;
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];
  constructor( private modalService: NgbModal, private underwritingService: UnderwritingService) { }

  ngOnInit() {
  	this.tHeader.push("Item No", "Description of Items");
    this.dataTypes.push("text", "text");
    this.filters.push("Item No", "Desc. of Items");
    this.tableData = this.underwritingService.getItemInfoData('','');
  	this.line = 'EAR';
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

}
