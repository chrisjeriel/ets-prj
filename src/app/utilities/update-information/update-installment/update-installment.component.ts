import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnderwritingService, NotesService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-update-installment',
  templateUrl: './update-installment.component.html',
  styleUrls: ['./update-installment.component.css']
})
export class UpdateInstallmentComponent implements OnInit {
  searchParams: any[] = [];
  @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('instllmentTable') instllmentTable: CustEditableNonDatatableComponent;
  @ViewChild('otherTable') otherTable: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancel: CancelButtonComponent;
  @ViewChild(LovComponent) lov: LovComponent;

  selectedPolicy: any = null;
  searchArr: any[] = Array(6).fill('');
  polNo: any[] = [];
  policyId: any = "";
  condition: any = "";
  cedingName: any = "";
  insuredDesc: any = "";
  riskName: any = "";
  inceptionDate: any = "";
  inceptionTime: any = "";
  expiryDate: any = "";
  expiryTime: any = "";
  currency: any = "";
  totalPrem: any = "";
  createUser: any = "";
  selected: any;
  fetchedData: any;
  dialogIcon: string;
  dialogMsg: string = "";
  prevCommRt: any;
  prevCommAmt: any;
  cancelFlag: boolean = false;
  warningMsg: number;

  passDataInstallmentInfo: any = {
    tableData: [],
    tHeader: ["Inst No", "Due Date", "Booking Date", "Premium Amount", "Comm Rate(%)", "Comm Amount", "Other Charges", "Amount Due"],
    dataTypes: ["number", "date", "date", "currency", "percent", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 1,
    widths: ["1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: {
      instNo: '',
      dueDate: '',
      bookingDate: '',
      premAmt: '',
      commRt: '',
      commAmt: '',
      otherChargesInw: 0,
      amtDue: '',
      "createUser": JSON.parse(window.localStorage.currentUser).username,
      "createDate": this.ns.toDateTimeString(0),
      "updateUser": JSON.parse(window.localStorage.currentUser).username,
      "updateDate": this.ns.toDateTimeString(0),
      otherCharges: []
    },
    disableAdd: true,
    keys: ['instNo', 'dueDate', 'bookingDate', 'premAmt', 'commRt', 'commAmt', 'otherChargesInw', 'amtDue'],
    uneditable: [true, false, false, false, false, false, true, true],
    pageLength: 5
  };

  passDataOtherCharges: any = {
    tableData: [["101", "Description 101", "50000"]],
    tHeader: ["Code", "Charge Description", "Amount"],
    dataTypes: ["text", "text", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 'otherCharges',
    uneditable: [true, true],
    nData: {
      instNo: 0,
      chargeCd: null,
      amount: 0,
      createUser: JSON.parse(window.localStorage.currentUser).username,
      createDate: this.ns.toDateTimeString(0),
      updateUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: this.ns.toDateTimeString(0),
      showMG: 1
    },
    disableAdd: true,
    keys: ['chargeCd', 'chargeDesc', 'amount'],
    magnifyingGlass: ['chargeCd'],
    pageLength: 5
  };

  passDataLOV: any = {
    tableData: [],
    tHeader: ["Policy No", "Ceding Company", "Insured", "Risk"],
    dataTypes: ["text", "text", "text", "text"],
    pageLength: 10,
    resizable: [false, false, false, false],
    tableOnly: false,
    keys: ['policyNo', 'cedingName', 'insuredDesc', 'riskName'],
    pageStatus: true,
    pagination: true,
    filters: [],
    pageID: 'createPolLov'
  }

  passLOVData: any = {
    selector: 'otherCharges',
  }

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private ns: NotesService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Update Installment");

    this.retrievePolListing();
  }

  onClickCancel() {
    this.cancel.clickCancel();
  }

  showLOV() {
    $('#polLovMdl > #modalBtn').trigger('click');
  }

  clickLOV(data) {
    this.passLOVData.hide = this.passDataOtherCharges.tableData.filter((a) => { return !a.deleted }).map(a => a.chargeCd);
    this.lov.openLOV();
  }

  onRowClick(event) {
    if (Object.entries(event).length === 0 && event.constructor === Object) {
      this.selected = null;
    } else {
      this.selected = event;
    }
  }

  setDetails(fromMdl?) {
    console.log(fromMdl);
    if (this.selected != null) {
      this.modalService.dismissAll();
      this.underwritingService.getAlterationsPerPolicy(this.selected.policyId, 'alteration').subscribe(data => {
        var polList = data['policyList'];

        var a = polList.filter(p => p.statusDesc.toUpperCase() === 'IN PROGRESS');
        var b = polList.filter(p => p.statusDesc.toUpperCase() !== 'IN PROGRESS');

        if (a.length > 0) {
          this.warningMsg = 1;
          this.showWarningMdl();
          return; 
        }

        b.sort((a, b) => a.altNo - b.altNo);

        if (b.length > 0) {
          this.policyId = b[b.length - 1].policyId;
          this.polNo = b[b.length - 1].policyNo.split('-');

          for (let rec of this.fetchedData) {
            if (rec.policyId == this.policyId && rec.policyNo === b[b.length - 1].policyNo) {
              this.cedingName = rec.cedingName;
              this.insuredDesc = rec.insuredDesc;
              this.riskName = rec.project.riskName;
              this.currency = rec.project.coverage.currencyCd;
              this.totalPrem = rec.project.coverage.totalPrem;
            }
          }

          this.underwritingService.getPolGenInfo(this.policyId, b[b.length - 1].policyNo).subscribe((data: any) => {
            this.createUser = data.policy.createUser;
          });
        } else {
          this.policyId = this.selected.policyId;
          this.polNo = this.selected.policyNo.split('-');
          this.cedingName = this.selected.cedingName;
          this.insuredDesc = this.selected.insuredDesc;
          this.riskName = this.selected.riskName;
          this.currency = this.selected.project.coverage.currencyCd;
          this.totalPrem = this.selected.project.coverage.totalPrem;

          this.underwritingService.getPolGenInfo(this.policyId, this.selected.policyNo).subscribe((data: any) => {
            if (data.policy != null) {
              this.createUser = data.policy.createUser;
            }
          });

          if (fromMdl !== undefined) {
            this.searchArr = this.polNo.map((a, i) => {
              return (i == 0) ? a + '%' : (i == this.polNo.length - 1) ? '%' + a : '%' + a + '%';
            });
            this.search('forceSearch', { target: { value: '' } });
          }
        }

        this.retrievePolInwardBal();
      });
    }
  }

  updateOtherCharges(data) {
    if (data == null || data == '') {
      this.passDataOtherCharges.disableAdd = true;
      this.passDataOtherCharges.tableData = [];
    } else {
      this.passDataOtherCharges.nData.instNo = data.instNo;
      this.passDataOtherCharges.disableAdd = false;
      this.passDataOtherCharges.tableData = data.otherCharges;
    }
    this.otherTable.refreshTable();
  }

  onClickSave() {
    if (this.instllmentTable.getSum('premAmt') != this.totalPrem) {
      this.warningMsg = 2;
      this.showWarningMdl();
    } else {
      this.confirmSave.confirmModal();
    }
  }

  search(key, ev) {
    if (!this.searchArr.includes('%%')) {
      this.selected = null;
    }

    var a = ev.target.value;
    if (key === 'lineCd') {
      this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
    } else if (key === 'year') {
      this.searchArr[1] = '%' + a + '%';
    } else if (key === 'seqNo') {
      this.searchArr[2] = '%' + a + '%';
    } else if (key === 'cedingId') {
      this.searchArr[3] = a === '' ? '%%' : '%' + a.padStart(3, '0') + '%';
    } else if (key === 'coSeriesNo') {
      this.searchArr[4] = '%' + a + '%';
    } else if (key === 'altNo') {
      this.searchArr[5] = a === '' ? '%%' : '%' + a;
    }

    if (this.searchArr.includes('')) {
      this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    }

    this.retrievePolListing([{ key: 'policyNo', search: this.searchArr.join('-') }]);
  }

  clearFields() {
    if (this.warningMsg == 1 || this.warningMsg == null) {
      this.searchArr = Array(6).fill('');
      this.polNo = Array(6).fill('');
      this.cedingName = '';
      this.insuredDesc = '';
      this.riskName = '';
      this.currency = '';
      this.totalPrem = '';
      this.passDataInstallmentInfo.tableData = [];
      this.passDataOtherCharges.tableData = [];
      this.selected = null;

      this.instllmentTable.refreshTable();
      this.otherTable.refreshTable();

      this.retrievePolListing();
      this.passDataOtherCharges.disableAdd = true;
      this.passDataInstallmentInfo.disableAdd = true;
      this.instllmentTable.btnDisabled = true;
      this.otherTable.btnDisabled = true;
    }

    this.warningMsg = null;
  }

  showWarningMdl() {
    $("#altWarningModal > #modalBtn").trigger('click');
  }

  retrievePolListing(param?) {
    console.log('retrieve pol listing');
    this.underwritingService.getParListing(param === undefined ? [] : param).subscribe(data => {
      this.instllmentTable.btnDisabled = true;
      this.otherTable.btnDisabled = true;

      var polList = data['policyList'];
      this.fetchedData = polList;

      polList = polList.filter(p => p.statusDesc.toUpperCase() === 'IN FORCE' && p.altNo == 0)
        .map(p => { p.riskName = p.project.riskName; return p; });

      this.passDataLOV.tableData = polList;
      this.table.forEach(table => { table.refreshTable() });

      if (param !== undefined) {
        if (polList.length === 1 && !this.searchArr.includes('%%')) {
          this.selected = polList[0];
          this.setDetails();
        } else if (polList.length === 0 && !this.searchArr.includes('%%')) {
          this.clearFields();
          this.retrievePolListing();
          this.showLOV();
        } else if (this.searchArr.includes('%%')) {
          this.cedingName = '';
          this.insuredDesc = '';
          this.riskName = '';
          this.selected = null;
        }
      }
    });
  }

  retrievePolInwardBal() {
    this.passDataInstallmentInfo.tableData = [];
    this.underwritingService.getInwardPolBalance(this.policyId).subscribe((data: any) => {
      this.passDataInstallmentInfo.disableAdd = false;
      this.instllmentTable.btnDisabled = false;
      this.otherTable.btnDisabled = true;
      if (data.policyList.length > 0) {
        this.currency = data.policyList[0].project.coverage.currencyCd;
        this.totalPrem = data.policyList[0].project.coverage.totalPrem;
        if (data.policyList[0].inwPolBalance.length != 0) {
          this.passDataInstallmentInfo.tableData = data.policyList[0].inwPolBalance.filter(a => {
            a.dueDate = this.ns.toDateTimeString(a.dueDate);
            a.bookingDate = this.ns.toDateTimeString(a.bookingDate);
            a.otherCharges = a.otherCharges.filter(a => a.chargeCd != null)
            return true;
          });

          this.passDataInstallmentInfo.nData.dueDate = this.ns.toDateTimeString(data.policyList[0].inceptDate);
          this.passDataInstallmentInfo.nData.bookingDate = this.ns.toDateTimeString(data.policyList[0].issueDate);
        }

        this.instllmentTable.btnDisabled = false;
        this.otherTable.btnDisabled = true;
        this.instllmentTable.onRowClick(null, this.passDataInstallmentInfo.tableData[0]);
      }

      this.instllmentTable.refreshTable();
    });
  }

  setSelected(data) {
    this.passDataOtherCharges.tableData = this.passDataOtherCharges.tableData.filter(a => a.showMG != 1 && a.deleted != true);
    if(data.data != undefined){
      for (let rec of data.data) {
          if(rec.inserted == true){
            this.lov.openLOV();
          }else{
            this.passDataOtherCharges.tableData.push(JSON.parse(JSON.stringify(this.passDataOtherCharges.nData)));
            this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].showMG = 0;
            this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].chargeCd = rec.chargeCd;
            this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].chargeDesc = rec.chargeDesc;
            this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].amount = rec.defaultAmt;
            this.passDataOtherCharges.tableData[this.passDataOtherCharges.tableData.length - 1].edited = true;
            rec.inserted = true;  
          }
      }
      this.instllmentTable.indvSelect.otherCharges = this.passDataOtherCharges.tableData;
      this.compute();
      this.otherTable.refreshTable();
    }else{
      this.lov.openLOV();
    }
    
  }

  compute() {
    for (let rec of this.passDataInstallmentInfo.tableData) {
      if (rec.otherCharges.length != 0)
        rec.otherChargesInw = rec.otherCharges.filter((a) => { return !a.deleted }).map(a => a.amount).reduce((sum, curr) => sum + curr, 0);
      rec.amtDue = rec.premAmt - rec.commAmt + rec.otherChargesInw;
    }
    this.instllmentTable.refreshTable();
  }

  calcComm(event) {
    for (let rec of event) {
      if ("commRt" === this.instllmentTable.instllmentKey) {
        rec.commAmt = rec.premAmt * rec.commRt / 100;
      }
      if ("commAmt" === this.instllmentTable.instllmentKey) {
        rec.commRt = rec.commAmt / rec.premAmt * 100;
      }
    }

    this.passDataInstallmentInfo.tableData = event;
    this.instllmentTable.refreshTable();
  }

  delInst() {
    if (this.passDataInstallmentInfo.tableData.filter(a => !a.deleted).length == 1) {
      this.warningMsg = 0;
      this.showWarningMdl();
      return null;
    }

    for (var i = 0; i < this.passDataInstallmentInfo.tableData.length; i++) {
      if (this.passDataInstallmentInfo.tableData[i].instNo == this.instllmentTable.indvSelect.instNo) {
        this.passDataInstallmentInfo.tableData[i].deleted = true;
        this.passDataInstallmentInfo.tableData[i].edited = true;

        for (var j = 0; j < this.passDataOtherCharges.tableData.length; j++) {
          if (this.passDataOtherCharges.tableData[j].instNo == this.passDataInstallmentInfo.tableData[i].instNo) {
            this.passDataOtherCharges.tableData[j].deleted = true;
            this.passDataOtherCharges.tableData[j].edited = true;
          }
        }
      }
    }

    this.instllmentTable.markAsDirty();
    this.instllmentTable.refreshTable();

    this.otherTable.markAsDirty();
    this.otherTable.refreshTable();
    this.compute();
  }

  save(can?) {
    this.cancelFlag = can !== undefined;
    let params: any = {
      policyId: this.policyId,
      user: JSON.parse(window.localStorage.currentUser).username,
      savePolInward: [],
      delPolInward: [],
      saveOtherCharges: [],
      delOtherCharges: [],
      newSavePolInward: []
    }

    for (let inst of this.passDataInstallmentInfo.tableData) {
      if (inst.edited && !inst.deleted && inst.instNo !== null) {
        inst.dueDate = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        inst.createDate = this.ns.toDateTimeString(inst.createDate);
        inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
        inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
        params.savePolInward.push(inst);
      } else if (inst.deleted) {
        params.delPolInward.push(inst);
      }
      if (!inst.deleted && inst.instNo !== null) {
        let instFlag: boolean = false;
        for (let chrg of inst.otherCharges) {
          if (chrg.edited && !chrg.deleted) {
            chrg.createDate = this.ns.toDateTimeString(chrg.createDate);
            chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
            chrg.updateUser = JSON.parse(window.localStorage.currentUser).username;
            params.saveOtherCharges.push(chrg);
            instFlag = true;
          } else if (chrg.deleted) {
            params.delOtherCharges.push(chrg);
            instFlag = true;
          }
        }
        if (instFlag) {
          inst.dueDate = this.ns.toDateTimeString(inst.dueDate);
          inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
          inst.createDate = this.ns.toDateTimeString(inst.createDate);
          inst.updateDate = this.ns.toDateTimeString(inst.updateDate);
          inst.updateUser = JSON.parse(window.localStorage.currentUser).username;
          params.savePolInward.push(inst);
        }
      }
      if (inst.instNo == null) {
        inst.dueDate = this.ns.toDateTimeString(inst.dueDate);
        inst.bookingDate = this.ns.toDateTimeString(inst.bookingDate);
        for (let chrg of inst.otherCharges) {
          chrg.createDate = this.ns.toDateTimeString(chrg.createDate);
          chrg.updateDate = this.ns.toDateTimeString(chrg.updateDate);
        }
        params.newSavePolInward.push(inst);
      }
    }

    if (this.validate(params)) {
      this.underwritingService.saveInwardPolBal(params).subscribe((data: any) => {
        if (data.returnCode == -1) {
          this.dialogIcon = 'success';
          this.successDialog.open();
          this.otherTable.markAsPristine();
          this.instllmentTable.markAsPristine();
          this.retrievePolInwardBal();
        } else {
          this.dialogIcon = 'error';
          this.successDialog.open();
        }
      });
    } else {
      this.dialogMsg = "Please check field values.";
      this.dialogIcon = "error";
      $('#inward > #successModalBtn').trigger('click');
      setTimeout(() => { $('.globalLoading').css('display', 'none'); }, 0);
    }
  }

  delOth() {
    if (this.otherTable.indvSelect != undefined) {
      for (let rec of this.passDataOtherCharges.tableData) {
        if (this.otherTable.indvSelect.chargeCd == rec.chargeCd) {
          rec.deleted = true;
          rec.edited = true;
          rec.inserted = false;
        }  
      }
    }
    this.instllmentTable.indvSelect.otherCharges = this.passDataOtherCharges.tableData;
    this.otherTable.markAsDirty();
    this.otherTable.refreshTable();
    this.compute();
  }

  validate(obj) {
    var req = [];
    var entries = [];

    if (obj.savePolInward.length > 0) {
      req = ['bookingDate', 'dueDate', 'premAmt', 'commRt', 'commAmt'];

      for (let rec of obj.savePolInward) {
        entries = Object.entries(rec);

        for (var [key, val] of entries) {
          if (key === 'premAmt' || key === 'commAmt' || key === 'commRt') {
            if (isNaN(val)) {
              return false;
            }
          } else {
            if ((val == '' || val == null) && req.includes(key)) {
              return false;
            }
          }
        }
      }
    }

    if (obj.newSavePolInward.length > 0) {
      req = ['bookingDate', 'dueDate', 'premAmt', 'commRt', 'commAmt'];

      for (let rec of obj.newSavePolInward) {
        entries = Object.entries(rec);

        for (var [key, val] of entries) {
          if (key === 'premAmt' || key === 'commAmt' || key === 'commRt') {
            if (isNaN(val)) {
              return false;
            }
          } else {
            if ((val == '' || val == null) && req.includes(key)) {
              return false;
            }
          }
        }
      }
    }

    if (obj.saveOtherCharges.length > 0) {
      req = ['amount'];

      for (let rec of obj.saveOtherCharges) {
        entries = Object.entries(rec);

        for (var [key, val] of entries) {
          if ((val == '' || val == null || (val.toString() === 'NaN')) && req.includes(key)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  pad(ev, num) {
    var str = ev.target.value;

    return str === '' ? '' : String(str).padStart(num, '0');
  }

}
