import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { environment } from '@environments/environment';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-line-class',
  templateUrl: './line-class.component.html',
  styleUrls: ['./line-class.component.css']
})
export class LineClassComponent implements OnInit {

  @ViewChild('lineClassTable') table: CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov : MtnLineComponent;
  @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  passData: any = {
    tableData:[['', '', '', '']],
    tHeader				:["Line Class Code", "Description", "Active","Remarks"],
    dataTypes			:["text", "text", "checkbox", "text"],
    genericBtn    :'Delete',
    nData:{
      lineClassCd       : null,
      lineCdDesc        : null,
      activeTag         : 'Y',
      remarks           : '',
      createUser        : null,
      createDate        : this.ns.toDateTimeString(0),
      updateUser        : null,
      updateDate        : this.ns.toDateTimeString(0)
    },
    addFlag				      : true,
    paginateFlag		    : true,
    infoFlag			      : true,
    pageLength			    : 10,
    resizable			      : [true, true, true, false],
    pageID				      : 'line-mtn-line',
    keys				        : ['lineClassCd', 'lineCdDesc', 'activeTag','remarks'],
    disableGeneric      : true,
    disableAdd          : true
  };

  cancelFlag				    : boolean = false;
  loading					      : boolean;
	dialogIcon				    : string;
	dialogMessage			    : string;
	@Input() inquiryFlag	: boolean 	= false;
	successMessage			  : string 	= environment.successMessage;
	arrLineCd     			  : any     	= [];
	counter					      : number;
  mtnLineReq 				    : any;

  line                  : string;
  description           : string;
  warningMsg            : any;
  searchParams          : any[] = [];

  lineClassData: any = {
    updateDate:  null,
    updateUser:  null,
    createDate:  null,
    createUser:  null,
  };

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Line Class');

    if(this.inquiryFlag) {
      this.passData.tHeader.pop();
      this.passData.opts = [];
      this.passData.uneditable = [];
      this.passData.magnifyingGlass = [];
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      for (var count = 0; count < this.passData.tHeader.length; count++){
        this.passData.uneditable.push(true);
      }
    }
  }

  retrieveLineClass() {
    if(this.line === '' || this.line == null) {
      this.clearTbl();
    } else {
      this.mtnService.getLineClassLOV(this.line).subscribe(data => {
        if (data['lineClass'] != null) {
          this.passData.tableData = data['lineClass'].filter(a => {
            a.createDate = this.ns.toDateTimeString(a.createDate);
            a.updateDate = this.ns.toDateTimeString(a.updateDate);
            return true;
          });

          this.passData.tableData.sort((a,b) => (a.createDate > b.createDate)? -1 : 1);
          this.passData.disableAdd = false;
          this.table.refreshTable();
        }
      });
    }
  }

  checkLineClassCd() {
    var lineCds = this.passData.tableData.map(a => a.lineClassCd);

    var duplicates = lineCds.reduce((acc, el, i, arr) => {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) {
        acc.push(el);
      }
      return acc;
    }, []);

    return duplicates.length > 0? false : true;
  }

  onClickSaveLineClass(cancelFlag?) {
    this.cancelFlag = cancelFlag !== undefined;
    let savedData: any = {};
    savedData.saveLineClass = [];
    savedData.deleteLineClass = [];

    for (let rec of this.passData.tableData) {
      if (rec.edited && !rec.deleted) {
        rec.lineCd = this.line;
        rec.activeTag = rec.activeTag ===  '' ? 'N' : rec.activeTag;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.updateDate = this.ns.toDateTimeString(rec.updateDate);
        savedData.saveLineClass.push(rec);
      } else if (rec.deleted) {
        rec.lineCd = this.line;
        rec.createUser = JSON.parse(window.localStorage.currentUser).username;
        rec.createDate = this.ns.toDateTimeString(rec.createDate);
        rec.updateUser = JSON.parse(window.localStorage.currentUser).username;
        rec.updateDate = this.ns.toDateTimeString(rec.updateDate);
        savedData.deleteLineClass.push(rec);
      }
    }

    if (this.validate(savedData.saveLineClass)) {
      if (this.checkLineClassCd()) {
        this.mtnService.saveMtnLineClass(JSON.stringify(savedData)).subscribe((data: any) => {
          if (data['returnCode'] === 0) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            $('#lineClassSuccess > #successModalBtn').trigger('click');
          } else {
            this.dialogIcon = "success";
            $('#lineClassSuccess > #successModalBtn').trigger('click');
            this.table.markAsPristine();
            this.retrieveLineClass();
          }
        });
      } else {
        this.warningMsg = 0;
        this.showWarningMdl();

        setTimeout(() => {$('.globalLoading').css('display','none');},0);
      }
    } else {
      this.dialogMessage = 'Please check field values';
      this.dialogIcon = 'error';
      $('#lineClassSuccess > #successModalBtn').trigger('click');

      setTimeout(() => {$('.globalLoading').css('display', 'none');}, 0);
    }
  }

  delLineClass() {
    if ('Y' === this.table.indvSelect.okDelete) {
      for (let rec of this.passData.tableData) {
        if (rec.lineClassCd === this.table.indvSelect.lineClassCd) {
          rec.deleted = true;
          rec.edited = true;
        }
      }

      this.table.markAsDirty();
      this.table.refreshTable();
    } else {
      this.warningMsg = 1;
      this.showWarningMdl();
    }
  }

  validate(obj) {
    var req = ['lineClassCd', 'lineCdDesc'];

    for (let rec of obj) {
      var entries = Object.entries(rec);

      for (var[key, val] of entries) {
        if ((val == '' || val == null) && req.includes(key)) {
          return false;
        }
      }
    }
    return true;
  }

  showWarningMdl() {
    $("#altWarningModal > #modalBtn").trigger('click');
  }

  onClickCancel() {
    this.cancel.clickCancel();
  }

  showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), ev);
  }

  clickRow(ev) {
    if (ev != null) {
      this.lineClassData.createUser = ev.createUser;
      this.lineClassData.createDate = ev.createDate;
      this.lineClassData.updateUser = ev.updateUser;
      this.lineClassData.updateDate = ev.updateDate;

      this.passData.disableGeneric = false;
    }
  }

  setLine(data) {
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.lineClassData = {};
    this.retrieveLineClass();
  }

  onClickSave() {
    $('#confirm-save #modalBtn2').trigger('click');
  }

  clearTbl() {
    this.passData.tableData = [];
    this.table.refreshTable();
  }

  deleteLineClass() {
    if ('Y' === this.table.indvSelect.okDelete) {
      this.table.indvSelect.deleted = true;
      this.table.selected = [this.table.indvSelect];
      this.table.confirmDelete();
    } else {
      this.warningMsg = 1;
      this.showWarningMdl();
    }
  }

}
