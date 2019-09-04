import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { environment } from '@environments/environment';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-line-class',
  templateUrl: './line-class.component.html',
  styleUrls: ['./line-class.component.css']
})
export class LineClassComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) lineLov                : MtnLineComponent;
  @ViewChild(CancelButtonComponent) cancelBtn         : CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) cs : ConfirmSaveComponent;

  passData: any = {
    tableData:[],
    tHeader				      : ["Line Class Code", "Description", "Active","Remarks"],
    dataTypes			      : ["pk-cap", "text", "checkbox", "text"],
    nData: {
      newRec           : 1,
      lineClassCd      : '',
      lineClassCdDesc  : '',
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
    widths              : [1, 'auto', 1, 'auto'],
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
  firstLoading        : boolean;
  passEvent           : any;
  changeLine          : boolean;
  tempLineCd          : string = '';
  counter             : number = 0;
  exit                : boolean;

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

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,public modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Line Class');
    this.firstLoading = true;
  }

  getMtnLineClass(){
    this.table.overlayLoader = true;
    this.counter = 0;
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
    this.tempLineCd    = this.line.toUpperCase();
  }

  onSaveMtnLineClass(){
    console.log('onSaveMtnLineClass  this.changeLine >> ' + this.changeLine);
    if(this.changeLine){
      this.params.saveLineClass.map(i => i.lineCd = this.tempLineCd );
      this.params.deleteLineClass.map(i => i.lineCd = this.tempLineCd );
    }
    this.params.saveLineClass.map(i => i.description = i.lineClassCdDesc);
    this.params.deleteLineClass.map(i => i.description = i.lineClassCdDesc);

    console.log(this.params);
    this.counter++;
    this.mtnService.saveMtnLineClass(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      this.getMtnLineClass();
      $('app-sucess-dialog #modalBtn').trigger('click');
      this.params.saveLineClass     = [];
      this.params.deleteLineClass   = [];
      this.passData.disableGeneric  = true;
      $('.ng-dirty').removeClass('ng-dirty');
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';

    var isNotUnique : boolean ;
    var saveLc = this.passData.tableData.filter(i => i.isNew == true);
    var isEmpty = 0;

    for(let record of this.passData.tableData){
      record.lineCd  = this.line.toUpperCase();
      if(record.lineClassCd == '' || record.lineClassCd == null || record.lineClassCdDesc == '' || record.lineClassCdDesc == null){
        if(!record.deleted){
          isEmpty = 1;
          record.fromCancel = false;
        }else{
          this.params.deleteLineClass.push(record);
        }
      }else{
        record.fromCancel = true;
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

    if(isEmpty == 1){
        this.dialogIcon = 'error';
        $('app-sucess-dialog #modalBtn').trigger('click');
        this.params.saveLineClass = [];
        this.line = (this.changeLine == true)?this.tempLineCd:this.line;
    }else{
      if(isNotUnique == true){
        this.warnMsg = 'Unable to save the record. Line Class Code must be unique per Line.';
        this.showWarnLov();
        this.params.saveLineClass  = [];
      }else{
        if(this.params.saveLineClass.length == 0 && this.params.deleteLineClass.length == 0){
          $('.ng-dirty').removeClass('ng-dirty');
          this.cs.confirmModal();
          this.params.saveLineClass  = [];
          this.passData.tableData = this.passData.tableData.filter(a => a.lineClassCd != '');
        }else{
          if(this.changeLine == true){
            this.lineLoading();
            this.line=this.tempLineCd;
          }
          if(this.cancelFlag == true){
            this.cs.showLoading(true);
            setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
          }else{
            this.cs.confirmModal();
          }
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
      var i = this.table.selected[0];

      if(i.lineClassCd == '' && i.lineClassCdDesc == '' && i.activeTag == '' && i.remarks == ''){
        this.table.onClickDelete('force');
        $('.ng-dirty').removeClass('ng-dirty');
        this.passData.disableGeneric=true;
      }else{
        this.table.confirmDelete();
      }
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
    this.firstLoading = false;
    if($('.ng-dirty').length != 0){
      this.counter++;
      this.changeLine = true;
      (this.counter<2)?this.cancelBtn.clickCancel():'';
    }else{
      this.changeLine = false;
      this.getMtnLineClass();
    }
  }

  checkCode(ev){
    this.passEvent = ev;
    if(this.firstLoading == true){
      this.ns.lovLoader(ev, 1);
      this.lineLov.checkCode(this.line.toUpperCase(), ev);
      $('.ng-dirty').removeClass('ng-dirty');   
    }else{
      if($('.ng-dirty').length != 0){
        this.changeLine = true;
        this.cancelBtn.clickCancel();
      }else{          
        this.changeLine = false;
        this.ns.lovLoader(ev, 1);
        this.lineLov.checkCode(this.line.toUpperCase(), ev);
      }
    }
  }

  onClickRow(event){
    if(event !== null){
      this.lineClassData.createUser = event.createUser;
      this.lineClassData.createDate = event.createDate;
      this.lineClassData.updateDate = event.updateDate;
      this.lineClassData.updateUser = event.updateUser;
      this.passData.disableGeneric  = false;
      //this.table.refreshTable();
    }else{
      this.lineClassData.createUser = '';
      this.lineClassData.createDate = '';
      this.lineClassData.updateDate = '';
      this.lineClassData.updateUser = '';
      this.passData.disableGeneric  = true;
    }
  }

  cancel(){
    this.exit = true
    this.cancelBtn.clickCancel();
  }

  lineLoading(){
    this.ns.lovLoader(this.passEvent, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), this.passEvent);
  }

  onCancel(){
    this.counter = 0;
    this.line = this.tempLineCd;
    this.modalService.dismissAll();
  }

  onClickNo(){
    if(this.exit == true){
      this.changeLine = false;
      this.cancelBtn.url = '/maintenance-qu-pol';
      this.cancelBtn.onNo(); 
    }else{
      this.lineLoading();
      this.getMtnLineClass();
      this.table.refreshTable();
    }
  }

  checkCancel(){
    if(this.cancelFlag == true){
      if(this.passData.tableData.some(i => i.fromCancel == false)){
        return;
      }else{
        if(this.changeLine == true){
          this.changeLine = false;
          if(this.exit == true){
            this.cancelBtn.url = '/maintenance-qu-pol';
            this.cancelBtn.onNo(); 
          }else{
            this.modalService.dismissAll();
            return;
          }
        }else{
          this.cancelBtn.onNo();
        }
      }
    }
  }

}
