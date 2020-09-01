import { Component, OnInit, ViewChild } from '@angular/core';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent} from '@app/maintenance/mtn-line/mtn-line.component'
@Component({
  selector: 'app-user-amt-limit',
  templateUrl: './user-amt-limit.component.html',
  styleUrls: ['./user-amt-limit.component.css']
})
export class UserAmtLimitComponent implements OnInit {
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(MtnLineComponent) mtnLineLov: MtnLineComponent;
  passLov: any = {
  	selector: 'userGrp',
  	userGrp: ''
  }
  group:any = {
  	userGrp:'',
  	userGrpDesc:'',
  };

  passData:any={
  	tableData: [],
  	tHeader: ['Line','Amount Limit','All Amount SW','Remarks'],
  	dataTypes:['lovInput','currency','checkbox','text'],
  	keys:['lineCd','amtLimit','allAmtSw','remarks'],
  	addFlag:true,
  	genericBtn:'Delete',
  	infoFlag:true,
  	paginateFlag:true,
  	widths:[95,180,1,'auto'],
    magnifyingGlass: ['lineCd'],
  	nData:{
      showMG:1,
    	userGrp:'',
  		lineCd:'',
  		allAmtSw:'N',
  		amtLimit:'',
  		remarks:'',
  		createUser:this.ns.getCurrentUser(),
  		createDate:this.ns.toDateTimeString(0),
  		updateUser:this.ns.getCurrentUser(),
  		updateDate:this.ns.toDateTimeString(0),
  	},
    uneditable:[false,false,false,false],
  	disableGeneric:true,
  	disableAdd: true,
    searchFlag: true
  }

  info:any;
  LineLOVRow: number;
  hideLine:string[] = [];
  constructor(private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	setTimeout(a=>this.table.refreshTable,0);
  }

  setUserGrp(data){
  	console.log(data)
  	if(data.data!=null){
	  	this.group = data.data;
	  	this.passData.nData.userGrp = this.group.userGrp;
	  	this.getUserAmtLimit();
	 }else{
	 	this.group = {
	 		userGrp:'',
	 		userGrpDesc:'',
	 	};
	 	this.passData.tableData = [];
	 	this.passData.disableAdd =  true;
  		this.passData.disableGeneric = true;
	 	this.table.refreshTable();
	 }
	 this.ns.lovLoader(data.ev, 0);
  }

  getUserAmtLimit(){
  	this.table.loadingFlag = true;
  	this.ms.getMtnUserAmtLimit(this.group.userGrp).subscribe(a=>{
  		this.passData.tableData = a['userAmtLimit'];
  		this.passData.tableData.forEach(a=>{
        a.uneditable = ['lineCd'];
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.passData.disableAdd =  false;
  		this.passData.disableGeneric = true;
      this.passData.tableData.forEach(a=>{
        if(a.allAmtSw == 'Y' ){
          if(a.edited)
            a.amtLimit = '';
          a.uneditable = ['amtLimit'];
        }else{
          a.uneditable = [];
        }
      })
  		this.table.refreshTable();
  	})
  }

  onClickDelete(data){
  	this.table.selected = [this.table.indvSelect];
  	this.table.confirmDelete();
  }

  onTableClick(data){
  	if(data == null){
  		this.passData.disableGeneric = true;
  	}else{
  		this.passData.disableGeneric = false;
  	}
  	this.info = data;
  }

  onClickSave(){
  	if(this.passData.tableData.some(a=>(a.amtLimit==null || a.amtLimit=='') && a.allAmtSw=='N' && !a.deleted)){
  		this.dialogIcon = "error";
		  this.successDialog.open();
		  return;
  	}else{
		  this.conSave.confirmModal();
  	}
  }

  cancelFlag:boolean = false;
  dialogIcon:string = '';

  save(can?){
  	this.cancelFlag = can !== undefined;
  	let params : any = {
  		saveUserAmtLmt:[],
  		delUserAmtLmt:[],
  	}
  	
  	params.saveUserAmtLmt = this.passData.tableData.filter(a=>a.edited&& !a.deleted);
  	params.delUserAmtLmt = this.passData.tableData.filter(a=>a.deleted);

  	this.ms.saveMtnUserAmtLimit(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getUserAmtLimit();
            this.table.markAsPristine();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	})

  }

  checkCode(ev){
  	console.log(ev);
  	this.passLov.userGrp = ev.target.value;
    this.ns.lovLoader(ev, 1);
    this.lov.checkCode('userGrp',undefined, undefined, undefined, undefined, undefined, ev);
  }

  setLine(data){
    console.log(data)
    if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
      this.LineLOVRow = data.ev.index;
      this.ns.lovLoader(data.ev, 0);
    }

    /*$('#cust-table-container').addClass('ng-dirty');

    if(data.lineCd != '' && data.lineCd != null && data.lineCd != undefined) {
      //HIDE THE POWERFUL MAGNIFYING GLASS
      this.passData.tableData[this.LineLOVRow].showMG = 1;
    }
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);*/
    this.passData.tableData[this.LineLOVRow].lineCd = data.lineCd;
    if(data.lineCd != ''){
      this.passData.tableData[this.LineLOVRow].uneditable = ['lineCd'];
      this.passData.tableData[this.LineLOVRow].showMG = 0;
    }
    this.table.refreshTable();
  }

  showLineLOV(data){
      $('#lineLOV #modalBtn').trigger('click');
      this.hideLine = this.passData.tableData.map(a=> a.lineCd);
      this.LineLOVRow = data.index;
  }

  update(data){
    if(data.hasOwnProperty('lovInput')) {
      this.hideLine = this.passData.tableData.map(a=> a.lineCd);
      data.ev['index'] = data.index;
      this.mtnLineLov.checkCode(data.ev.target.value, data.ev);
    }

    this.passData.tableData.forEach(a=>{
      if(a.allAmtSw == 'Y'){
        if(a.edited && data.key == 'allAmtSw' )
          a.amtLimit = '';
        a.uneditable = ['amtLimit'];
      }else{
        a.uneditable = [];
      }
    })
  }


}