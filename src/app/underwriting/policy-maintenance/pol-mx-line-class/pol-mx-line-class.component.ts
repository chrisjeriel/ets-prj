import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-mx-line-class',
  templateUrl: './pol-mx-line-class.component.html',
  styleUrls: ['./pol-mx-line-class.component.css']
})
export class PolMxLineClassComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov : MtnLineComponent;

  passData: any = {
    tableData:[],
    tHeader				:["Line Class Code", "Description", "Active","Remarks"],
    dataTypes			:["text", "text", "checkbox", "text"],
    nData:{
      lineClassCd       : null,
      lineCdDesc        : null,
      activeTag         : null,
      remarks           : null
    },
    addFlag				      : true,
    deleteFlag		 	    : true,
    paginateFlag		    : true,
    infoFlag			      : true,
    pageLength			    : 10,
    resizable			      : [true, true, true, false],
    pageID				      : 'line-mtn-line',
    keys				        : ['lineClassCd', 'lineCdDesc', 'activeTag','remarks'],
  };

  cancelFlag				    : boolean;
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

  lineClassData: any = {
    updateDate:  null,
    updateUser:  null,
    createDate:  null,
    createUser:  null,
  };

  constructor(private titleService: Title, private mtnService: MaintenanceService,
              private ns: NotesService,private modalService: NgbModal) { }

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

  retrieveLineClass(){
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

          this.passData.tableData.sort((a,b) => a.createDate.localeCompare(b.createDate));
          this.table.refreshTable();
        }
      });
    }
  }

  onClickSaveLineClass(cancelFlag?) {
    this.cancelFlag = cancelFlag != undefined;

    for (let rec of this.passData.tableData) {

    }
  }

  validate() {

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
    }
  }

  setLine(data) {
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveLineClass();
  }

  onClickSave() {
    $('#confirm-save #modalBtn2').trigger('click');
  }

  clearTbl() {
    this.passData.addFlag = false;
    this.passData.deleteFlag = false;
    this.passData.tableData = [];
    this.table.refreshTable();
  }

}
