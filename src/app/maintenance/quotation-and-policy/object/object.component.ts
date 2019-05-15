import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  @ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
  @ViewChild('objectTable') objTable: CustEditableNonDatatableComponent;
  @ViewChild('catPerilTable') catPerilTable: CustEditableNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Object No', 'Description', 'Active','Remarks'],
    tooltip:[null,null,null,null],
    magnifyingGlass: ['endtCd'],
    dataTypes: ['text', 'text', 'checkbox', 'text'],
    nData: {
        lineCd: '',
        lineDesc: '',
        objectId: '',
        description: '',
        activeTag: '',
        remarks: '',
        createDate: this.ns.toDateTimeString(0),
        updateDate: this.ns.toDateTimeString(0),
        createUser: JSON.parse(window.localStorage.currentUser).username,
        updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'endt',
    widths: [1, 'auto', 'auto', 'auto'],
    keys: ['objectId','description', 'activeTag', 'remarks'],
    uneditable: [false, false, false, false]
  };

catPerilData: any = {
    tableData: [],
    tHeader: ['CAT Peril No', 'Name', 'Abbreviation', 'Percent Share on Premium (%)'],
    dataTypes: ['text', 'text', 'text', 'percent'],
    nData: {
        lineCd: '',
        lineDesc: '',
        objectId: '',
        catPerilId: '',
        catPerilAbbr: '',
        catPerilName: '',
        pctSharePrem: '',
        defaultTag: '',
        activeTag: '',
        remarks: '',
        createDate: this.ns.toDateTimeString(0),
        updateDate: this.ns.toDateTimeString(0),
        createUser: JSON.parse(window.localStorage.currentUser).username,
        updateUser: JSON.parse(window.localStorage.currentUser).username,
    },
    addFlag: true,
    disableAdd: true,
    deleteFlag: true,
    checkFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'deductible',
    widths: [1, 'auto', 'auto', 'auto', 'auto'],
    keys: ['catPerilId','catPerilName', 'catPerilAbbr', 'pctSharePrem'],
    uneditable: [false,true,true,true,true]
  }

  line              : string;
  description       : string;
  cancelFlag        : boolean = false;

  userData: any = {
    updateDate: null,
    updateUser: null,
    createDate: null,
    createUser: null
  }

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Object');
  }

  retrieveObject() {
    this.mtnService.getMtnObject(this.line, '').subscribe(data => {
      if (data['object'] != null) {
        this.passData.tableData = data['object'].filter(a => {
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          return true;
        });

        this.passData.tableData.sort((a, b) => (a.createDate > b.createDate) ? -1 : 1);
        this.objTable.btnDisabled = true;
        this.passData.disableAdd = false;
        this.objTable.refreshTable();
      }
    });
  }

  showLineLOV() {
    $('#lineLOV #modalBtn').trigger('click');
  }

  setLine(data) {
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveObject();
  }

  checkCode(ev) {
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), ev);
  }

  rowClick(ev) {
    if (ev != null) {
      if (ev.catPerilList != null) {
        this.catPerilData.tableData = ev.catPerilList.filter(a => {
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          return true;
        });
        this.catPerilTable.refreshTable();
      }

      this.userData.createUser = ev.createUser;
      this.userData.createDate = ev.createDate;
      this.userData.updateUser = ev.updateUser;
      this.userData.updateDate = ev.updateDate;
    }
  }

  onClickSave() {
    $("#confirm-save #modalBtn2").trigger('click');
  }

  onClickSaveObject(cancelFlag?) {
    this.cancelFlag = cancelFlag !== undefined;
    let savedData: any = {};
    savedData.saveObject = [];
    savedData.deleteObject = [];

    for (let rec of this.passData.tableData) {
      if (rec.edited && !rec.deleted) {
        rec.lineCd = this.line;
        rec.activeTag = rec.activeTag === '' ? 'N' : rec.activeTag;
        rec.remarks = rec.remarks === '' ? ' ' : rec.remarks;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.upateDate = this.ns.toDateTimeString(rec.updateDate);
        savedData.saveObject.push(rec);
      } else if (rec.deleted) {
        rec.lineCd = this.line;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.updateDate = this.ns.toDateTimeString(rec.udpateDate);
        savedData.deleteObject.push(rec);
      }
    }
  }

}
