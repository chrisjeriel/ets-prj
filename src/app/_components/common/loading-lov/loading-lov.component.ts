import { Component, OnInit, Input, Renderer, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { MaintenanceService, AccountingService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnPayeeCedingComponent } from '@app/maintenance/mtn-payee-ceding/mtn-payee-ceding.component';

@Component({
	selector: 'app-loading-lov',
	templateUrl: './loading-lov.component.html',
	styleUrls: ['./loading-lov.component.css']
})
export class LoadingLovComponent implements OnInit {

	@Output() selectedData: EventEmitter<any> = new EventEmitter();

    @ViewChild('paw') page: any;
    @ViewChild(ModalComponent) modal : ModalComponent;
    @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
    @ViewChild('cedingLov') cedingLov: MtnPayeeCedingComponent;

    nullRow: boolean = false;
    unselect: boolean = false;

    @Input()
	  passData: any = {
	  	selector:'',
	  	data:{}
	  }

	@Input() set lovCheckBox(val:boolean){
	  this.passTable.checkFlag = val;
	}

    passTable: any = {
        tableData: [],   
        tHeader: [], //['Insured Id', 'Insured Name','Address'],
        dataTypes: [], //['sequence-3', 'text', 'text'],
		keys: [], //['insuredId', 'insuredName','address'],
        resizable: [],     
        colSize: [], //['74px','374px','374px'],      
        tabIndexes: [],   
        pageLength: 10,         
        pageID: 'loading-lov',
        dbKeys: [], //['INSURED_ID','INSURED_NAME','ADDRESS']               
    }

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    sortBy:boolean = true;
    sortIndex:number;
    searchString: string = "";
    p:number = 1;
    checked:boolean;
    selected: any[] = [];
    indvSelect: any = "";
    fillData:any = {};

    loadingFlag:boolean = true;
    loadingTableFlag: boolean = false;

    count:number;

    modalOpen: boolean = false;

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private mtnService:MaintenanceService, private accountingService: AccountingService) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }
    currentIndex: number;
    dialogIcon: string = '';
  	dialogMessage: string = '';
  	multOffCedingId: any = '';
  	multOffCedingName: any = '';

  	select(data){
	    var index = 0;
	    var ref = '';
	    var processingCount = 0;
	    if(Array.isArray(data)){
	      for(var el of data){
	        if(el.processing != null && el.processing != undefined){
	          ref = el.processing;
	          el.checked = false;
	          this.selected[index].checked = false;
	          processingCount = data.filter(a=>{return a.processing}).length;
	          data = data.filter(a=>{return a.checked});
	          this.selected = this.selected.filter(b=>{return b.checked});
	          this.passTable.tableData[this.passTable.tableData.indexOf(el)].checked = false;
	          this.dialogIcon = 'info';
	          if(processingCount > 1){
	            this.dialogMessage = 'Some of the items were not selected because they\'re currently being processed in other transactions.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector.indexOf('acitSoaDtl') == 0 || this.passData.selector.indexOf('multOffSoa') == 0){
	            this.dialogMessage = 'This policy installment is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector.indexOf('clmResHistPayts') == 0 || this.passData.selector == 'acitArClmRecover'){
	            this.dialogMessage = 'This claim history is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector == 'paytReqList'){
	            this.dialogMessage = 'This Payment Request is being processed for payment in another transaction. Please finalize the transaction with Check Voucher No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector == 'acitInvt' || this.passData.selector == 'acitArInvPullout'){
	            this.dialogMessage = 'This Investment (Placement) is being processed for payment in another transaction. Please finalize the transaction with Request No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector == 'acitArInvPullout'){
	            this.dialogMessage = 'This Investment is being processed for payment in another transaction. Please finalize the transaction with Request No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector == 'osQsoa' || this.passData.selector == 'multOffTrty'){
	            this.dialogMessage = 'This QSOA is being processed for payment in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else if(this.passData.selector == 'unappliedColl' || this.passData.selector == 'multOffUnapp'){
	            var refArr = ref.split('-');

	            if(Number(refArr[1]) == 0) {
	              this.dialogMessage = 'This Unapplied Collection is being processed in another transaction. Please finalize the Acknowledgement Receipt first.';
	            } else {
	              this.dialogMessage = 'This Unapplied Collection is being processed in another transaction. Please finalize the transaction with Reference No. '+ ref + ' first.';
	            }
	            
	            this.passData.data = data.filter(a=>{return a.checked});
	          }else{
	            this.passData.data = data;
	          }
	          setTimeout(()=>{this.successDiag.open();/*this.table.refreshTable();*/},0)
	          break;
	        }else{
	          this.passData.data = data;
	        }
	        index += 1;
	      };
	    }else{
	      this.passData.data = data;
	    };
  	}

    tablePress(event: KeyboardEvent, data: any, index){

        event.preventDefault();
        if(this.currentIndex === undefined){
            if(event.key === 'ArrowUp' && index !== 0){
                this.currentIndex = index - 1;
                this.indvSelect = this.passTable.tableData[index-1];
            }else if(event.key === 'ArrowDown' && index !== this.passTable.tableData.length-1){
                this.currentIndex = index + 1;
                this.indvSelect = this.passTable.tableData[index+1];
            }else if((event.key === 'ArrowUp' && index === 0) || (event.key === 'ArrowDown' && index === this.passTable.tableData.length-1)){
                this.currentIndex = index;
                this.indvSelect = this.passTable.tableData[index];
            }
        }else{
            if(event.key === 'ArrowUp' && this.currentIndex !== 0){
                this.currentIndex = this.currentIndex - 1;
                this.indvSelect = this.passTable.tableData[this.currentIndex];
            }else if(event.key === 'ArrowDown' && this.currentIndex !== this.passTable.tableData.length-1){
                this.currentIndex = this.currentIndex + 1;
                this.indvSelect = this.passTable.tableData[this.currentIndex];
            }else if((event.key === 'ArrowUp' && this.currentIndex === 0) || (event.key === 'ArrowDown' && this.currentIndex === this.passTable.tableData.length-1)){
                this.indvSelect = this.passTable.tableData[this.currentIndex];
            }
        }

        if((this.p - 1) * this.passTable.pageLength > this.currentIndex ){
            //this.page.previous();
            this.p -= 1;
            setTimeout(()=>{$('#tableRow').focus();},100);
            console.log('prev');
        }else if(this.p * this.passTable.pageLength -1 < this.currentIndex){
            //this.page.next();
            this.p += 1;
            setTimeout(()=>{$('#tableRow').focus();},100);
            console.log('next');
        }
        
    }

	ngOnInit() {
	}

	openModal(): void {
        this.modalOpen = true;
        this.fillData = new Object();
        for(let key of this.passTable.keys){
            this.fillData[key] = "";
        }

        
        //temporary fix delete this later
        //setTimeout(()=>{this.loadingFlag = false;},2000)
        if(this.passData.selector == 'acitSoaDtl'){
              this.passTable.tHeader = ['Memo No.', 'Policy No.', 'Inst No.', 'Co Ref No', 'Insured', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
              this.passTable.colSize =['300px','300px','300px','auto','200px','200px','200px','200px','200px'];
              this.passTable.dataTypes = ['text', 'text', 'sequence-2', 'text', 'text', 'date', 'currency', 'currency', 'currency'];
              this.passTable.keys = ['memoNo', 'policyNo', 'instNo', 'coRefNo', 'insuredDesc', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
              this.passTable.dbKeys = ['MEMO_NO', 'POLICY_NO', 'INST_NO', 'CO_REF_NO', 'INSURED_DESC', 'DUE_DATE', 'NET_DUE', 'TOTAL_PAYMENTS', 'PREV_BALANCE'];
              this.passTable.checkFlag = true;
              // this.accountingService.getAcitSoaDtlNew(this.passData.currCd, this.passData.policyId, this.passData.instNo, this.passData.cedingId, this.passData.payeeNo,this.passData.zeroBal).subscribe((a:any)=>{
              //   this.passTable.tableData = a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1});
              //   console.log(a["soaDtlList"]);
              //   for(var i of this.passTable.tableData){
              //     if(i.processing !== null && i.processing !== undefined){
              //       i.preventDefault = true;
              //     }
              //   }
              //   this.table.refreshTable();
              // });
              this.search();
            }else if(this.passData.selector == 'multOffSoa'){
              this.passTable.tHeader = ['Memo No.', 'Policy No.', 'Inst No.', 'Co Ref No', 'Insured', 'Due Date', 'Net Due', 'Cumulative Payments', 'Remaining Balance'];
              this.passTable.colSize =['300px','300px','300px','auto','200px','200px','200px','200px','200px'];
              this.passTable.dataTypes = ['text', 'text', 'sequence-2', 'text', 'text', 'date', 'currency', 'currency', 'currency'];
              this.passTable.keys = ['memoNo', 'policyNo', 'instNo', 'coRefNo', 'insuredDesc', 'dueDate', 'netDue', 'totalPayments', 'prevBalance'];
              this.passTable.checkFlag = true;
              if(this.multOffCedingId == '') {
                this.count = this.passTable.pageLength;
                this.loadingFlag = false;
                this.loadingTableFlag = false;
                this.passTable.tableData = [];
                this.addFiller();
              } else {
                this.search();
              }
            }

            // this.search();
    }

    request:any = {
        lovParam:'',
        count:'10',
        position:'1',
        sortKey:'',
        order:''
    }


    private onMouseDown(event){
        
        this.start = event.target;
        this.pressed = true;
        this.startX = event.x;
        this.startWidth = $(this.start).parent().width();
        this.initResizableColumns();
    }

    private initResizableColumns() {
        
        this.renderer.listenGlobal('body', 'mousemove', (event) => {
            if(this.pressed) {
                let width = this.startWidth + (event.x - this.startX);
                $(this.start).parent().css({'min-width': width, 'max-width': width, 'width': width});
                let index = $(this.start).parent().index() + 1;
                $('#notPin'+this.passTable.pageID+' .content-container tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width, 'width': width});
                
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event, data, index?) {
        this.currentIndex = index + ((this.p - 1) * this.passTable.pageLength );   //this.p is the current page number

        if(this.passTable.checkFlag === undefined || !this.passTable.checkFlag){
            if(data !== null){
                this.nullRow = false;
                if( Object.entries(data).length !== 0){
                        if(this.indvSelect == data){
                            this.unselect = true;
                            this.indvSelect = "";
                            data = {};
                        }else{
                           
                            this.indvSelect = data;
                        }
                }
                else{
                     this.indvSelect = "";
                 }
            }
            else{
                 this.indvSelect = "";
                 this.nullRow = true;
            }
        }
    }

    
    
    highlight(data){
        
        this.selected.push(data);
    }

    selectAll(value){
        if(value){
            this.selected = [];
             for (let data of this.passTable.tableData) {
                if(data != this.fillData){
                    console.log('test');
                    if(data.preventDefault !== undefined && data.preventDefault){
                        this.selected.push(data);
                    }else{
                        data.checked = value;
                        this.selected.push(data);
                    }
                }
            }
            this.select(this.selected);
            // this.refreshTable();
        }
        else{
            this.passTable.tableData = this.passTable.tableData.filter((a) => {
                if(a !== null){
                   a.checked = false; 
                   return true;
                } 
            });
            this.select([]);
            this.selected = [];
            // this.refreshTable();
        }
    }

    sort(str,sortBy){
        this.request.sortKey = str;
        this.request.order = sortBy ? 'ASC' :'DESC';

        // this.passTable.tableData = this.passTable.tableData.sort(function(a, b) {
        //     if(sortBy){
        //         if(a[str] < b[str]) { return -1; }
        //         if(a[str] > b[str]) { return 1; }
        //     }else{
        //         if(a[str] < b[str]) { return 1; }
        //         if(a[str] > b[str]) { return -1; }
        //     }
        // });
        // this.mtnService.getMtnInsuredLov(this.request).subscribe(a=>{
        //     this.addFiller();
        //     this.placeData(a['list'])
        //     this.loadingFlag = false;
        // })
        this.search();
        this.sortBy = !this.sortBy;
    }

    showSort(sortBy,i){

        return sortBy && i==this.sortIndex;
    }

    removeSelected(event, data, preventDefault?){
        if(preventDefault !== undefined && preventDefault){
            this.selected.push(data);
            event.preventDefault();
        }else{
            data.checked = event.target.checked;
            if(!event.target.checked){
                this.selected.splice(this.selected.indexOf(data), 1);
            }else{
                this.selected.push(data);
            }
        }
        console.log(this.selected);
        this.select(this.selected);
        // this.rowClick.emit(this.selected);
    }

    addFiller(){

        this.passTable.tableData = Array(this.count + this.passTable.pageLength - (this.count%this.passTable.pageLength)).fill(this.fillData);
        // if(this.passTable.tableData.length%this.passTable.pageLength != 0){
        //     this.autoFill = Array().fill(this.fillData);
        // }
        //this.passTable.tableData = this.passTable.tableData.length;
        // if((typeof this.autoFill != "undefined" && this.passTable.tableData.length%this.passTable.pageLength != 0) || this.passTable.tableData.length==0)
        //     this.passTable.tableData = this.passTable.tableData.concat(this.autoFill);
    }
    
    

    search(){
        this.loadingTableFlag = true;
        this.request = {
            lovParam:this.searchString,
            'paginationRequest.count': this.passTable.pageLength,
            'paginationRequest.position': '1',
            'sortRequest.sortKey': this.request.sortKey == undefined ? '' : this.request.sortKey,
            'sortRequest.order': this.request.order == undefined ? '' : this.request.order
        };

        this.p = 1;

        if(this.passData.selector == 'acitSoaDtl') {
        	this.request.currCd = this.passData.currCd;
    		this.request.policyId = this.passData.policyId == undefined ? '' : this.passData.policyId;
		  	this.request.instNo = this.passData.instNo == undefined ? '' : this.passData.instNo;
		  	this.request.cedingId = this.passData.cedingId == undefined ? '' : this.passData.cedingId;
		  	this.request.payeeNo = this.passData.payeeNo == undefined ? '' : this.passData.payeeNo;
		  	this.request.zeroBal = this.passData.zeroBal == undefined ? '' : this.passData.zeroBal;

            this.accountingService.getAcitSoaDtlNew2(this.request).subscribe((a:any)=>{
              	console.log(this.request);
              	console.log(a);
              	this.count = a['count'];
                this.addFiller();
                // this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}))
                if(this.passData.from == 'ar') {
                    this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1 && data.prevBalance !== 0}));
                } else if(this.passData.from == 'prq') {
                    this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}).map(e => { e.returnAmt = e.cumPayment * (-1); e.edited = true; e.validate = true; return e; }));
                } else {
                  this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}));
                }
                this.loadingFlag = false;
                this.loadingTableFlag = false;
                console.log(a["soaDtlList"]);
                for(var i of this.passTable.tableData){
                  if(i.processing !== null && i.processing !== undefined){
                    i.preventDefault = true;
                  }
                }
                // this.table.refreshTable();
            });
        } else if(this.passData.selector == 'multOffSoa') {
            // this.table.overlayLoader = true;
            this.request.currCd = this.passData.currCd;
            this.request.policyId = this.passData.policyId == undefined ? '' : this.passData.policyId;
            this.request.instNo = this.passData.instNo == undefined ? '' : this.passData.instNo;
            this.request.cedingId = this.multOffCedingId == undefined ? '' : this.multOffCedingId;
            this.request.payeeNo = this.passData.payeeNo == undefined ? '' : this.passData.payeeNo;
            this.request.zeroBal = this.passData.zeroBal == undefined ? '' : this.passData.zeroBal;

            this.accountingService.getAcitSoaDtlNew2(this.request).subscribe((a:any)=>{
                this.count = a['count'];
                this.addFiller();
                this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}));
                this.loadingFlag = false;
                this.loadingTableFlag = false;
                for(var i of this.passTable.tableData) {
                    if(i.processing !== null && i.processing !== undefined) {
                        i.preventDefault = true;
                    }
                }
            });
        }
    }

    placeData(items){
        var start = (this.p - 1) * this.passTable.pageLength;
        for(let itm of items){
            this.passTable.tableData[start] = itm;
            start++;
        }
    }

    updatePage(){
    	this.request['paginationRequest.position'] = this.p;
    	if(this.passData.selector == 'acitSoaDtl') {
	        if(this.passTable.tableData[(this.p - 1) * this.passTable.pageLength] == this.fillData) {
	            this.loadingTableFlag = true;
	            this.accountingService.getAcitSoaDtlNew2(this.request).subscribe((a:any)=>{
                if(this.passData.from == 'ar') {
                    this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1 && data.prevBalance !== 0}));
                } else if(this.passData.from == 'prq') {
                    this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}).map(e => { e.returnAmt = e.cumPayment * (-1); e.edited = true; e.validate = true; return e; }));
                } else {
	              this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}))
                }
	               this.loadingTableFlag = false;

                  for(var i of this.passTable.tableData){
                    if(i.processing !== null && i.processing !== undefined){
                      i.preventDefault = true;
                    }
                  }
	            });
	        }
	    } else if(this.passData.selector == 'multOffSoa') {
            if(this.passTable.tableData[(this.p - 1) * this.passTable.pageLength] == this.fillData){
                this.loadingTableFlag = true;
                this.accountingService.getAcitSoaDtlNew2(this.request).subscribe((a:any)=>{
                  this.placeData(a.soaDtlList.filter((data)=>{return  this.passData.hide.indexOf(data.soaNo)==-1}));
                  this.loadingTableFlag = false;

                  for(var i of this.passTable.tableData){
                    if(i.processing !== null && i.processing !== undefined){
                      i.preventDefault = true;
                    }
                  }
                });
            }
        }
    }

    openLOV(){
      this.modal.openNoClose();
    }

    
    /*okBtnClick(){
      this.indvSelect.insuredId = this.pad(this.indvSelect.insuredId,6);
      this.selectedData.emit(this.indvSelect);
    
    }*/

    okBtnClick(){ 
      let selects:any[] = [];
      if(!this.passTable.checkFlag){
        this.selectedData.emit(this.passData);
      }
      else{
        // selects = this.passTable.tableData.filter(a=>a.checked);
        this.passData['data'] = this.selected;
        this.selectedData.emit(this.passData);
      }

      this.passData.data = null;
      this.resetMultOffCedant();
      this.count = this.passTable.pageLength;
    }


  checkCode(code, id, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        insuredId: '',
        insuredName: '',
        ev: ev
      });
    } else {
      this.mtnService.getMtnInsured(code).subscribe(data => {
        if(data['insured'].length > 0) {
          data['insured'][0]['ev'] = ev;
          data['insured'][0].insuredId = this.pad(data['insured'][0].insuredId, 6); //Ensures 6 digit for insured ID
          this.selectedData.emit(data['insured'][0]);
        } else {
          this.selectedData.emit({
            insuredId: '',
            insuredName: '',
            ev: ev
          });        

          this.openLOV();
        }      
      });
    }
  }

  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(num != null ? num : 3, '0');
  }

  resetMultOffCedant() {
    this.multOffCedingId = '';
    this.multOffCedingName = '';
  }

  showCedingLov(ev) {
    this.cedingLov.modal.openNoClose();
  }

  setCeding(ev) {
    if(ev !== null) {
      this.multOffCedingId = ev.payeeCd;
      this.multOffCedingName = ev.payeeName;
      this.search();
    }
  }
}
