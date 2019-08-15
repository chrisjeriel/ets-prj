import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ClaimsService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-clm-history-lov',
  templateUrl: './mtn-clm-history-lov.component.html',
  styleUrls: ['./mtn-clm-history-lov.component.css']
})
export class MtnClmHistoryLovComponent implements OnInit {
	@ViewChild('clmHistMdl') modal				: ModalComponent;
  	@Output() selectedData						: EventEmitter<any> = new EventEmitter();
  	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  	selected: any;
  	fromInput: boolean = false;

  	passData: any = {
	    tableData	: [],
	    tHeader		: ['Claim No.','Hist No.','Hist Category','Hist Type','Reserve','Approved Amount','Paid Amount'],
	    dataTypes	: ['text', 'sequence-2', 'text', 'text', 'currency', 'currency', 'currency'],
	    pageLength	: 10,
	    searchFlag	: true,
	    pageStatus	: true,
	    pagination	: true,
	    fixedCol	: false,
	    pageID		: 'passDataClmHistoryLov'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
	    widths      : ['auto','auto','auto','auto','auto','auto','auto'],
    	keys        : ['claimNo','histNo','histCatDesc','histTypeDesc','reserveAmt','approvedAmt','paytAmt']
	};

	@Input() lovCheckBox: boolean = false;
	@Input() limitClmHistTbl : any[] = [];
	@Input() limitHistCat : string = '';
	@Input() limitData : any = {
		histCategory : [], 
		histType	 : []
	};
  	selects: any[] = [];

 	constructor(private clmService: ClaimsService, private modalService: NgbModal) { }

	ngOnInit() {
		if(this.lovCheckBox){
	      this.passData.checkFlag = true;
	    }
	}

	select(data){
    	this.selected = data;
  	}

  	okBtnClick(){
	    this.selected['fromLOV'] = true;
	    
	    if(!this.lovCheckBox){
	      this.selectedData.emit(this.selected);
	    }
	    else{
	      for(var i = 0; i < this.passData.tableData.length; i++){
	        if(this.passData.tableData[i].checked){
	          this.selects.push(this.passData.tableData[i]);
	        }
	      }
	      console.log(this.selects)
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
	}

	openModal(){
	    if(!this.fromInput) {
		    this.passData.tableData = [];
		    this.table.overlayLoader = true;
		    this.clmService.getClaimHistory()
		    .subscribe(data => {
	     		var rec = data['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e })
	     				  .filter(e => this.limitData.histCategory.includes(e.histCategory) && this.limitData.histType.includes(Number(e.histType)))
	     				  .map(e => { 
	     				  	e.paytAmt = (e.paytAmt == '' || e.paytAmt == null)?0:e.paytAmt; 
	     				  	e.approvedAmt = (e.approvedAmt == '' || e.approvedAmt == null)?0:e.approvedAmt; 
	     				  	return e; });
	     		if(this.limitClmHistTbl.length != 0){
	     			var limit = this.limitClmHistTbl.filter(a => a.showMG != 1).map(a => JSON.stringify({claimId: a.claimId, histNo: a.histNo}));
	     			this.passData.tableData =  	rec.filter(a => {
								     				var mdl = JSON.stringify({claimId: a.claimId, histNo: a.histNo});
								     				return !limit.includes(mdl);
								     			});
	     		}
      			this.table.refreshTable();
	      	});
	    }else {
	    	this.fromInput = false;
	    }
	}

	checkCode(code, ev) {  
	    var obj =  {
	      claimNo			: '',
	      histNo			: '',
	      histCatDesc		: '',
	      histTypeDesc		: '',
	      reserveAmt		: '',
	      paytAmt			: '',
	      ev				: ev,
	      singleSearchLov	: true
	    };

	    if(code === ''){
	      var arr = [];
	      arr.push(obj);

	      this.selectedData.emit(arr);
	    } else {
	    	this.clmService.getClaimHistory()
	    	.subscribe(data =>{
	    		var rec = data['claimReserveList'].map(e => e.clmHistory).flatMap(e => { return e }).filter(e => e.histCategory == 'L').map(e => { return e });

	        if(rec.length == 1) {          
	        	rec[0]['ev'] = ev;
	        	rec[0]['singleSearchLov'] = true;

	        	var arr = [];
	        	arr.push(rec[0]);

	        	this.selectedData.emit(arr);
	        } else if(rec.length > 1) {
	        	this.fromInput = true;

	          	var arr = [];
	          	arr.push(obj);

	          	this.selectedData.emit(arr);
	          
	          	this.passData.tableData = rec;
	          	this.table.refreshTable();

	          	this.modal.openNoClose();
	        } else {
	          	var arr = [];
	          	arr.push(obj);

	          	this.selectedData.emit(arr);
	            
	          	this.modal.openNoClose();
	        }
	        
	      });  
	    }
	}

}
