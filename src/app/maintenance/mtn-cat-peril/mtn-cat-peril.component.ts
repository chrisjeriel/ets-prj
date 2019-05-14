import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mtn-cat-peril',
  templateUrl: './mtn-cat-peril.component.html',
  styleUrls: ['./mtn-cat-peril.component.css']
})
export class MtnCatPerilComponent implements OnInit {

  catPerilListing: any = {
    tableData: [],
    tHeader: ['CAT Peril No', 'Name'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 11,
    keys:['catPerilId', 'catPerilName']
  };

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal() {
    this.catPerilListing.tableData = [];


  }

}
