import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { hideTooltip } from '@app/_directives/highlight';

@Component({
  selector: 'app-mtn-cat-peril-modal',
  templateUrl: './mtn-cat-peril-modal.component.html',
  styleUrls: ['./mtn-cat-peril-modal.component.css']
})
export class MtnCatPerilModalComponent implements OnInit {

  selected: any;

  catPerilListing: any = {
    tableData: [],
    tHeader: ['CAT Peril No', 'Name'],
    dataTypes: ['text', 'text'],
    nData: {
      catPerilId: '',
      catPerilAbbr: '',
      catPerilName: '',
      createDate: this.ns.toDateTimeString(0),
      updateDate: this.ns.toDateTimeString(0),
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateUser: JSON.parse(window.localStorage.currentUser).username,
  },
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 11,
    keys:['catPerilId', 'catPerilName']
  };

  @Input() lineCd: string;
  @Input() hide: any[];
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService, public modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal() {
    this.table.loadingFlag = true;
    this.maintenanceService.getMtnCatPeril(this.lineCd, '000', '').subscribe(data => {
      if (data['catPerilList'] != null) {
        if (this.hide !== undefined) {
          this.catPerilListing.tableData = data['catPerilList'].filter(a => {
            return !this.hide.includes(a.catPerilId);
          });
        } else {
          this.catPerilListing.tableData = data['catPerilList'];
        }

        this.table.refreshTable();
      }
    });
  }

  onRowClick(data) {
    if(Object.entries(data).length === 0 && data.constructor === Object) {
      this.selected = null;
    } else {
      this.selected = data;
    }
  }

  confirm() {
    this.selectedData.emit(this.selected);
    this.selected = null;
  }

}
