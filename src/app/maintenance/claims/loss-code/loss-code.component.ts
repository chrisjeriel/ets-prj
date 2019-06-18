import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loss-code',
  templateUrl: './loss-code.component.html',
  styleUrls: ['./loss-code.component.css']
})
export class LossCodeComponent implements OnInit {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmDialog: ConfirmSaveComponent;
  @ViewChild("lossCodeTable") lossCodeTable: CustEditableNonDatatableComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  passData: any = {
		tableData:[],
		tHeader				:["Loss Code","Loss Code Abbr","Description","Loss Code Type","Active","Remarks"],
		dataTypes			:["reqNumber","reqText","reqText","select", "checkbox", "text"],
		nData:{
			lossCd        	: null,
			lossCdAbbr		: null,
			description     : null,
			lossCdType		: null,
			activeTag       : 'Y',
			remarks         : null,
			"createUser"    : this.ns.getCurrentUser(),
            "createDate"    : this.ns.toDateTimeString(0),
            "updateUser"	: this.ns.getCurrentUser(),
      		"updateDate"	: null
		},
		opts: [{
        	selector: 'lossCdType',
        	prev: [],
        	vals: [],
    	}],
		checkFlag			: false,
		searchFlag		    : true,
		addFlag				: true,
		genericBtn          :'Delete',
		disableGeneric 		: true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		widths				:[1,'auto','auto','auto',1,'auto'],
		resizable			:[true, true, true ,true, true, true],
		pageunID		    : 'mtn-loss-code',
		keys				:['lossCd','lossAbbr','lossDesc','lossCdType','activeTag','remarks'],
		uneditable			:[false,false,false,false, false, false]

	};

	lossCode : any = {
		lossCd			: null,
		createUser		: null,
	    createDate		: null,
	    updateUser		: null,
	    updateDate		: null,
	}
	lossCd: string = ''
    subscription: Subscription = new Subscription();
    selected: any = null;
    dialogIcon: string = '';
	dialogMessage: string = '';
	lossCdArray : any = [];
	cancelFlag: boolean;
	mtnLossCdReq  : any = { 
    						    "deleteLossCd": [],
                    			"saveLossCd"  : []}
    editedData:any[] = [];
    deletedData:any[] =[];
    deleteBool : boolean;
    selectedData  : any;

  constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal
    ,private route: ActivatedRoute) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Claims | Loss Code');
  	this.getMtnLossCode();
  }

  getMtnLossCode(){
		this.passData.tableData = [];
		var sub$ = forkJoin(this.mtnService.getMtnLossCode(),
  							this.mtnService.getRefCode('LOSS_CODE_TYPE')).pipe(map(([word, ref]) => { return { word, ref }; }));


		this.subscription = sub$.subscribe(data => {
  			this.passData.opts[0].vals = [];
  			this.passData.opts[0].prev = [];

  			console.log(data);

  			var td = data['word']['lossCd'].sort((a, b) => b.createDate - a.createDate).map(a => { 
  															   a.lossCd     =  parseInt(a.lossCd);
		  										   			   a.activeTag  = this.cbFunc(a.activeTag);
		  										   			   a.createDate = this.ns.toDateTimeString(a.createDate);
		  													   a.updateDate = this.ns.toDateTimeString(a.updateDate);
		  													   a.uneditable = ['lossCd'];
		  													   return a; });
		  	for(let i of td) {
  				i.wordings = '';

  				Object.keys(i).forEach(function(key) {
	            	if(/wordText/.test(key)) {
	                    i.wordings += i[key] === null ? '' : i[key];
	                }
	            });
  			}

  			this.passData.tableData = td;
	  		this.passData.disableAdd = false;
	  		this.passData.disableGeneric = false;

	  		this.passData.opts[0].vals = data['ref']['refCodeList'].map(a => a.code);
		  	this.passData.opts[0].prev = data['ref']['refCodeList'].map(a => a.description);

		  	this.table.refreshTable();
	  		this.table.onRowClick(null, this.passData.tableData[0]);
  		});
  }

  cbFunc(cb){
  	return cb === 'Y'?true:false;
  }

  cbFunc2(cb){
  	return cb === true?'Y':'N';
  }

  onRowClick(data){
		this.selected = data;	
		this.passData.disableGeneric = this.selected == null ? true : false;
	if(event !== null){
  		this.selected = data;
  		this.lossCd = data.lossCd;
  	    this.passData.disableGeneric    = false;
	  	this.lossCode.createUser	= data.createUser;
	  	this.lossCode.createDate	= data.createDate;
	  	this.lossCode.updateUser	= data.updateUser;
	  	this.lossCode.updateDate	= data.updateDate;
  	} else {
  	    this.passData.disableGeneric    = true;
	  	this.lossCode.createUser	= null;
	  	this.lossCode.createDate	= null;
	  	this.lossCode.updateUser	= null;
	  	this.lossCode.updateDate	= null;
  	}
  }

  onClickSave(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	 if(this.checkFields()){
		    if(this.hasDuplicates(this.lossCdArray)){
		      this.dialogMessage="Unable to save the record. Loss Code must be unique.";
			  this.dialogIcon = "warning-message";
			  this.successDialog.open();
		    } else {
		      $('#confirm-save #modalBtn2').trigger('click');
		    }
      }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
        this.tblHighlightReq('#mtn-loss-code',this.passData.dataTypes,[0,1,2,3]);
      }
	

  }

  checkFields(){
  	this.lossCdArray = [];
      for(let check of this.passData.tableData){
      	this.lossCdArray.push(check.lossCd);
        if(check.lossCd === null || Number.isNaN(check.lossCd)  || check.lossAbbr === undefined || check.lossAbbr == '' || String(check.lossDesc).trim() == '' || check.lossCdType === null){
          return false;
        }
      }
      return true;
  }

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  change(event){
    $('#cust-table-container').addClass('ng-dirty');
  }


	tblHighlightReq(el, dataTypes, reqInd) {
		setTimeout(() => {
			$(el).find('tbody').children().each(function() {
				$(this).children().each(function(i) {
					if(reqInd.includes(i)) {
						var val;
						if(dataTypes[i] == 'reqText' || dataTypes[i] == 'date' || dataTypes[i] == 'time' || dataTypes[i] == 'reqNumber') {
							val = $(this).find('input').val();
							highlight($(this), val);
						} else if(dataTypes[i] == 'select') {
							val = $(this).find('select').val();
							highlight($(this), val);
						} else if(dataTypes[i] == 'number' || dataTypes[i] == 'currency') {
							val = isNaN(Number($(this).find('input').val())) ? null : $(this).find('input').val();
						}
					}
				});
			});

			function highlight(td, val) {
				td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
			}
		}, 0);
	}
	
	onClickSaveLossCode(){
	 	this.mtnLossCdReq.deleteLossCd = [];
	 	this.mtnLossCdReq.saveLossCd = [];
    	this.editedData  = [];
    	this.deletedData =[];

    	for(var i=0;i<this.passData.tableData.length;i++){

	  		 if(this.passData.tableData[i].edited){
	  		 	  this.editedData.push(this.passData.tableData[i]);
	  		 	  this.editedData[this.editedData.length - 1].activeTag  = this.cbFunc2(this.passData.tableData[i].activeTag);
	              this.editedData[this.editedData.length - 1].updateUser = this.ns.getCurrentUser();
	              this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);             
	         }     
  		}

  		this.mtnLossCdReq.saveLossCd = this.editedData;
        this.mtnLossCdReq.deleteLossCd = this.deletedData;  

        if(this.mtnLossCdReq.saveLossCd.length > 0){
              this.confirmDialog.showBool = true;
              this.passData.disableGeneric = true;
              this.saveLossCd();
            } else {
              this.confirmDialog.showBool = false;
              this.dialogIcon = 'info';
              this.dialogMessage = 'Nothing to save';
              this.successDialog.open();
            }


	}

	saveLossCd(){
  	this.mtnService.saveMtnLossCode(JSON.stringify(this.mtnLossCdReq))
                .subscribe(data => {
                	console.log(data);
                    if(data['returnCode'] == -1){
			            this.dialogIcon = "success";
			            this.successDialog.open();
			            this.getMtnLossCode();
			        }else{
			            this.dialogIcon = "error";
			            this.successDialog.open();
			            this.getMtnLossCode();
			        }
    });
  }

  deleteLossCode(){
  	    if (this.selected.add){
  	    	this.deleteBool = false;
  	    }else {
  	    	this.deleteBool = true;	
  	    }


  	  this.lossCodeTable.indvSelect.deleted = true;
	  	this.lossCodeTable.selected  = [this.lossCodeTable.indvSelect]
	  	this.lossCodeTable.confirmDelete();
  }

  onClickDelLOssCode(obj : boolean){

  	this.mtnLossCdReq.deleteLossCd = [];
	this.mtnLossCdReq.saveLossCd = [];
    this.editedData  = [];
    this.deletedData =[];
    this.passData.disableGeneric = true;
   

      if(obj){
      	this.deletedData.push({
								    "lossCd" : this.lossCd
								     });
    	this.mtnLossCdReq.saveLossCd = this.editedData;
    	this.mtnLossCdReq.deleteLossCd = this.deletedData; 

      		this.mtnService.saveMtnLossCode(JSON.stringify(this.mtnLossCdReq))
                .subscribe(data => {
                	console.log(data);
                    if(data['returnCode'] == -1){
			            this.dialogIcon = "success";
			            this.successDialog.open();
			            this.getMtnLossCode();
			        }else{            
			            this.getMtnLossCode();
			            this.dialogMessage="You are not allowed to delete a loss code that is used by claim processing";
			       		this.dialogIcon = "warning-message";
			       		this.successDialog.open();
			        }
    		});
  	  } 
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }



}
