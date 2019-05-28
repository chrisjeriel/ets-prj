import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

  dialogIcon: string = "";
  dialogMessage: string = "";

  selectedRow: any;
  indvSelect: any;

  cancelFlag: boolean = false;

  savedData: any = [];
  deletedData: any = [];

  reportsData: any = {
  	tableData: [],
  	tHeader: ['Report ID', 'Report Title', 'Filename', 'Report Group', 'Generation Frequency', 'Remarks'],
  	dataTypes: ['text', 'text', 'text', 'select', 'select', 'text'],
  	keys: ['reportId', 'reportTitle', 'fileName', 'reportGrp', 'genFreq', 'remarks'],
  	uneditable: [false,false,false,false,false,false],
  	opts: [{
	            selector: 'reportGrp',
	            prev: [],
	            vals: [],
           },
           {
           		selector: 'genFreq',
           		prev: [],
           		vals: [],
           }
          ],
  	nData: {
  		reportId: '',
  		reportTitle: '',
  		fileName: '',
  		reportGrp: '',
  		genFreq: '',
  		renarks: '',
  		createUser: this.currentUser,
  		createDate: this.ns.toDateTimeString(0),
  		updateUser: this.currentUser,
  		updateDate: this.ns.toDateTimeString(0)
  	},
  	paginateFlag: true,
  	infoFlag: true,
  	addFlag: true,
  	searchFlag: true,
    genericBtn: 'Delete',
    widths: [1,200,200,100,1,'auto']
  }

  constructor(private route: ActivatedRoute,private router: Router, private ms: MaintenanceService, private ns: NotesService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.retrieveMtnReportsMethod();
  }

  retrieveMtnReportsMethod(){
  	//get reports list
  	this.reportsData.tableData = [];
  	this.reportsData.opts[0].vals = [];
  	this.reportsData.opts[0].prev = [];
  	this.reportsData.opts[1].vals = [];
  	this.reportsData.opts[1].prev = [];
  	this.ms.getMtnReports().subscribe((data: any)=>{
  		//this.reportsData.tableData = data.reports;
  		for(var rec of data.reports){
  			rec.uneditable = 'reportId';
  			this.reportsData.tableData.push(rec);
  		}
  		//get report group dropdown values
  		this.ms.getRefCode('REPORT_GRP').subscribe((data:any)=>{
  			for(var ref of data.refCodeList){
  			  this.reportsData.opts[0].vals.push(ref.code);
  			  this.reportsData.opts[0].prev.push(ref.description);
  			}
  			//get generation frequency dropdown values
  			this.ms.getRefCode('MTN_REPORTS.GENERATION_FREQUENCY').subscribe((data: any)=>{
  				for(var ref of data.refCodeList){
	  			  this.reportsData.opts[1].vals.push(ref.code);
	  			  this.reportsData.opts[1].prev.push(ref.description);
	  			}
  				this.table.refreshTable();
  			});
  		});
  		this.table.onRowClick(null, this.reportsData.tableData[0]);
  	});
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

  onRowClick(data){
  	this.selectedRow = data;
  }

  onClickSave(){
  	if(!this.checkFields()){
  		this.dialogIcon = 'error';
  		this.successDiag.open();
  	}else if(!this.checkForDuplicates()){
    	this.dialogIcon = "info";
    	this.dialogMessage = "Unable to save record. Report ID must be unique.";
    	this.successDiag.open();
    }else{
  		$('#confirm-save #modalBtn2').trigger('click');
  	}
  }

  onClickDelete(data){
    /*this.indvSelect = data;
    $('#delete > #modalBtn').trigger('click');*/
    this.table.selected = [this.table.indvSelect];
    this.table.confirmDelete();
  }

/*  delete(){
    this.table.markAsDirty();
    this.deletedData.push(this.indvSelect);
    this.reportsData.tableData = this.reportsData.tableData.filter(a =>{
                                            if(this.indvSelect.addCounter === undefined){
                                              return a.adviceWordId !== this.indvSelect.adviceWordId;
                                            }else{
                                              return a.addCounter !== this.indvSelect.addCounter;
                                            }
                                        });
    this.table.refreshTable();
  }*/

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  save(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];

  	for (var i = 0 ; this.reportsData.tableData.length > i; i++) {
  	  if(this.reportsData.tableData[i].edited && !this.reportsData.tableData[i].deleted){
  	      this.savedData.push(this.reportsData.tableData[i]);
  	      //this.savedData[this.savedData.length-1].adviceWordId = '0';
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
  	  }
  	  else if(this.reportsData.tableData[i].edited && this.reportsData.tableData[i].deleted){
  	     this.deletedData.push(this.reportsData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }

  	}

  	this.ms.saveMtnReports(this.savedData, this.deletedData).subscribe((data:any)=>{
  		if(data.returnCode === 0){
  			this.dialogIcon = 'error';
  			this.successDiag.open();
  		}else{
  			this.dialogIcon = '';
  			this.successDiag.open();
	        this.deletedData = [];
	        this.table.markAsPristine();
	  		this.retrieveMtnReportsMethod();
  		}
  	});
  }

  checkFields(){
  	for(var i of this.reportsData.tableData){
  		if(i.reportId.length === 0 || i.reportId === undefined || i.reportId === null ||
  		   i.reportTitle.length === 0 || i.reportTitle === undefined || i.reportTitle === null ||
  		   i.reportGrp.length === 0 || i.reportGrp === undefined || i.reportGrp === null ||
  		   i.genFreq.length === 0 || i.genFreq === undefined || i.genFreq === null){
  			return false;
  		}
  	}
  	return true;
  }

   checkForDuplicates(){
  	//check if there are similar reasonCd
  	for(var j = 0; j < this.reportsData.tableData.length; j++){
  		for(var k = j; k < this.reportsData.tableData.length; k++){
  			if(j !== k && this.reportsData.tableData[j].reportId === this.reportsData.tableData[k].reportId){
  				return false;
  			}
  		}
  	}
  	return true;
  }

}
