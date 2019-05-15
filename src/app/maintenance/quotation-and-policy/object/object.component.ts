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
    genericBtn :'Delete',
    dataTypes: ['text', 'text', 'checkbox', 'text'],
    nData: {
        lineCd: '',
        lineDesc: '',
        objectId: '',
        description: '',
        activeTag: 'Y',
        remarks: '',
        createDate: this.ns.toDateTimeString(0),
        updateDate: this.ns.toDateTimeString(0),
        createUser: JSON.parse(window.localStorage.currentUser).username,
        updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    addFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'endt',
    widths: [1, 'auto', 'auto', 'auto'],
    keys: ['objectId','description', 'activeTag', 'remarks'],
    disableGeneric : true,
    disableAdd : true
  };

catPerilData: any = {
    tableData: [],
    tHeader: ['CAT Peril No', 'Name', 'Abbreviation', 'Percent Share on Premium (%)'],
    dataTypes: ['text', 'text', 'text', 'percent'],
    magnifyingGlass: ['catPerilId'],
    nData: {
        lineCd: '',
        lineDesc: '',
        objectId: '',
        catPerilId: '',
        showMG: 1,
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
    uneditable: [false,false,false,false]
  }

  line              : string;
  objectId          : string;
  description       : string;
  cancelFlag        : boolean = false;
  dialogMessage     : string;
  dialogIcon        : string;
  hideCATPeril      : any = [];
  warningMsg        : string;

  userData: any = {
    updateDate: null,
    updateUser: null,
    createDate: null,
    createUser: null
  }

  catPeril: any = {
    catPerilId: null,
    catPerilName: null,
    catPerilAbbr: null
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
        this.passData.disableAdd = false;
        this.objTable.refreshTable();
      }
    });
  }

  showObjLineLOV() {
    $('#objLineLOV #modalBtn2').trigger('click');
  }

  showCATPerilLOV() {
    this.hideCATPeril = this.catPerilData.tableData.filter(a => !a.deleted).map(a => a.catPerilId);

    $('#catPerilLOV #modalBtn2').trigger('click');
  }

  setLine(data) {
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveObject();
  }

  setCATPeril(data) {
      console.log(data);
    this.catPerilData.tableData[this.catPerilData.tableData.length - 1] = data;
    this.catPerilData.tableData[this.catPerilData.tableData.length - 1].edited = true;
    this.catPerilData.tableData[this.catPerilData.tableData.length - 1].add = true;

    this.catPerilTable.refreshTable();
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
        this.catPerilData.disableAdd = false;
        this.passData.disableGeneric = false;
        this.catPerilTable.refreshTable();
      }

      this.objectId = ev.objectId;

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
    savedData.saveCatPeril = [];
    savedData.delCatPeril = [];

    for (let rec of this.passData.tableData) {
      if (rec.edited && !rec.deleted) {
        rec.lineCd = this.line;
        rec.activeTag = rec.activeTag === '' ? 'N' : rec.activeTag;
        // rec.remarks = rec.remarks === '' ? ' ' : rec.remarks;
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

    for (let rec of this.catPerilData.tableData) {
      if (rec.edited && !rec.deleted) {
        rec.lineCd = this.line;
        rec.objectId = this.objectId;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.updateDate = this.ns.toDateTimeString(rec.updateDate);
        savedData.saveCatPeril.push(rec);
      } else if (rec.deleted) {
        rec.lineCd = this.line;
        rec.objectId = this.objectId;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.updateDate = this.ns.toDateTimeString(rec.updateDate);
        savedData.delCatPeril.push(rec);
      }
    }

    if (this.validate(savedData)) {
      if (savedData.saveObject.length > 0 || savedData.deleteObject.length) {
        this.mtnService.saveMtnObject(JSON.stringify(savedData)).subscribe((data: any) => {
          if(data['returnCode'] === 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = 'error';
            $('#objectSuccess > #successModalBtn').trigger('click');
          } else {
            this.dialogIcon = 'success';
            $('#objectSuccess > #successModalBtn').trigger('click');
            this.objTable.markAsPristine();
            this.retrieveObject();
          }
        });
      }

      if (savedData.saveCatPeril.length > 0 || savedData.delCatPeril.length > 0) {
        this.mtnService.saveMtnCatPeril(savedData).subscribe((data: any) => {
          if(data['returnCode'] === 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = 'error';
            $('#objectSuccess > #successModalBtn').trigger('click');
          } else {
            this.dialogIcon = 'success';
            $('#objectSuccess > #successModalBtn').trigger('click');

            this.catPerilTable.markAsPristine();
            this.retrieveObject();
            this.catPerilData.tableData = [];
            this.catPerilTable.refreshTable();
          }
        });
      }

      setTimeout(() => { $('.globalLoading').css('display', 'none'); }, 0);
    } else {
      this.dialogMessage = 'Please check field values';
      this.dialogIcon = 'error';
      $('#objectSuccess > #successModalBtn').trigger('click');

      setTimeout(() => { $('.globalLoading').css('display', 'none'); }, 0);
    }
  }

  validate(obj) {
    for (let rec of obj.saveObject) {
      var entries = Object.entries(rec);

      for (var[key, val] of entries) {
        if ((val === '' || val == null) && 'objectId' === key) {
          return false;
        }
      }
    }

    for (let rec of obj.saveCatPeril) {
      var entries = Object.entries(rec);

      for (var[key, val] of entries) {
        if ((val === '' || val == null) && 'catPerilId' === key) {
          return false;
        }
      }
    }

    return true;
  }

  // delObject() {
  //   for (let rec of this.passData.tableData) {
  //     if (rec.objectId === this.objTable.indvSelect.objectId) {
  //       rec.deleted = true;
  //       rec.edited = true;
  //     }
  //   }

  //   this.objTable.markAsDirty();
  //   this.objTable.refreshTable();
  // }

  // delCATPeril() {
  //   for (let rec of this.catPerilData.tableData) {
  //     if (rec.catPerilId === this.catPerilTable.indvSelect.catPerilId) {
  //       rec.deleted = true;
  //       rec.edited = true;
  //     }
  //   }

  //   this.catPerilTable.markAsDirty();
  //   this.catPerilData.refreshTable();
  // }

  delObject() {
    this.objTable.indvSelect.deleted = true;
    this.objTable.selected = [this.objTable.indvSelect];

    for (let rec of this.catPerilData.tableData) {
        rec.deleted = true;
        rec.edited = true;
    }

    console.log(this.catPerilData.tableData);

    this.catPerilTable.markAsDirty();
    this.catPerilTable.refreshTable();

    this.objTable.confirmDelete();
  }

}
