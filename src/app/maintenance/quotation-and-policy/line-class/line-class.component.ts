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

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov                : MtnLineComponent;
  @ViewChild(CancelButtonComponent) cancelBtn         : CancelButtonComponent;

  passData: any = {
    tableData:[],
    tHeader				      : ["Line Class Code", "Description", "Active","Remarks"],
    dataTypes			      : ["pk-cap", "text", "checkbox", "text"],
    nData: {
      newRec           : 1,
      lineClassCd      : null,
      lineClassCdDesc  : null,
      activeTag        : 'Y',
      remarks          : '',
      isNew            : true
    },
    limit: {
      lineClassCd : 7,
      lineCdDesc  : 200,
      remarks     : 100
    },
    mask: {
      lineClassCd: 'AAAAAAA'
    },
    addFlag				      : true,
    paginateFlag		    : true,
    infoFlag			      : true,
    pageLength			    : 10,
    resizable			      : [true, true, true, false],
    pageID				      : 'mtn-line-class',
    keys				        : ['lineClassCd', 'lineClassCdDesc', 'activeTag', 'remarks'],
    uneditable          : [false, false, false, false],
    widths              : [1, 'auto', 'auto', 'auto'],
    genericBtn          : 'Delete',
    disableGeneric      : true,
    disableAdd          : true,
    searchFlag          : true
  };

  cancelFlag				    : boolean = false;
  dialogIcon				    : string;
  dialogMessage			    : string;
  line                  : string;
  description           : string;
  warnMsg               : any;
  fromCancel            : boolean;

  params : any =    {
    saveLineClass    : [],
    deleteLineClass  : []
  };

  lineClassData: any = {
    updateDate:  null,
    updateUser:  null,
    createDate:  null,
    createUser:  null,
  };

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Line Class');
  }

  getMtnLineClass(){
    this.table.overlayLoader = true;
    if(this.line === '' || this.line === null){
      this.clearTbl();
    }else{
      this.mtnService.getLineClassLOV(this.line.toUpperCase())
      .subscribe(data => {
        console.log(data);
        this.passData.tableData  = [];
        var rec = data['lineClass'].map(a => { a.createDate = this.ns.toDateTimeString(a.createDate); a.updateDate = this.ns.toDateTimeString(a.updateDate); return a;});
        this.passData.tableData  = rec;
        this.table.refreshTable();
        this.table.onRowClick(null, this.passData.tableData[0]);
        this.passData.disableAdd = false;
      });
    }
  }

  onSaveMtnLineClass(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isNotUnique : boolean ;
    var saveLc = this.params.saveLineClass;
    var isEmpty = 0;
    for(let record of this.passData.tableData){
      record.lineCd  = this.line;
      if(record.lineClassCd == null || record.lineClassCdDesc == null){
        if(!record.deleted){
          isEmpty = 1;
          this.fromCancel = false;
        }
      }else{
        this.fromCancel = true;
        if(record.edited && !record.deleted){
          record.createUser = (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
          record.createDate = (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
          record.updateUser = this.ns.getCurrentUser();
          record.updateDate = this.ns.toDateTimeString(0);
          this.params.saveLineClass.push(record);
        }else if(record.edited && record.deleted){
          this.params.deleteLineClass.push(record);
        }
      }

    }

    this.passData.tableData.forEach(function(tblData){
      if(tblData.isNew != true){
        saveLc.forEach(function(sLcData){
          if(tblData.lineClassCd.toString().toUpperCase() == sLcData.lineClassCd.toString().toUpperCase()){
            if(sLcData.isNew === true){
              isNotUnique = true;    
            }
          }
        });
      }
    });

    if(isNotUnique == true){
      setTimeout(()=>{
        $('.globalLoading').css('display','none');
        this.warnMsg = 'Unable to save the record. Line Class Code must be unique per Line.';
        this.showWarnLov();
        this.params.saveLineClass  = [];
      },500);
    }else{
      if(isEmpty == 1){
        setTimeout(()=>{
          $('.globalLoading').css('display','none');
          this.dialogIcon = 'error';
          $('app-sucess-dialog #modalBtn').trigger('click');
          this.params.saveLineClass     = [];
        },500);
      }else{
        if(this.params.saveLineClass.length == 0 && this.params.deleteLineClass.length == 0){
          setTimeout(()=>{
            $('.globalLoading').css('display','none');
            this.dialogIcon = 'info';
            this.dialogMessage = 'Nothing to save.';
            $('app-sucess-dialog #modalBtn').trigger('click');
            this.params.saveLineClass     = [];
            this.passData.tableData = this.passData.tableData.filter(a => a.lineClassCd != '');
          },500);
        }else{
          this.mtnService.saveMtnLineClass(JSON.stringify(this.params))
          .subscribe(data => {
            console.log(data);
            this.getMtnLineClass();
            $('app-sucess-dialog #modalBtn').trigger('click');
            this.params.saveLineClass     = [];
            this.passData.disableGeneric = true;
          });
        }    
      }
    }
  }

  onDeleteLineClass(){
    if(this.table.indvSelect.okDelete == 'N'){
      this.warnMsg = 'You are not allowed to delete a Line Class that is already used in quotation processing.';
      this.showWarnLov();
    }else{
      this.table.indvSelect.deleted = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
    }
  }

  clearTbl(){
    this.passData.disableGeneric = true;
    this.passData.disableAdd     = true;
    this.passData.tableData      = [];
    this.table.refreshTable();
  }

  showWarnLov(){
    $('#warnMdl > #modalBtn').trigger('click');
  }

  showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
  }

  setLine(data){
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.getMtnLineClass();
    setTimeout(() => {try{$(data.ev.target).removeClass('ng-dirty');}catch(e){}}, 0);
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), ev);
  }

  onClickRow(event){
    if(event !== null){
      this.lineClassData.createUser = event.createUser;
      this.lineClassData.createDate = event.createDate;
      this.lineClassData.updateDate = event.updateDate;
      this.lineClassData.updateUser = event.updateUser;
      this.passData.disableGeneric    = false;
      this.table.refreshTable();
    }else{
      this.lineClassData.createUser = '';
      this.lineClassData.createDate = '';
      this.lineClassData.updateDate = '';
      this.lineClassData.updateUser = '';
      this.passData.disableGeneric    = true;
    }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  checkCancel(){
    if(this.cancelFlag == true){
      if(this.fromCancel){
        this.cancelBtn.onNo();
      }else{
        return;
      }
    }
  }

}
