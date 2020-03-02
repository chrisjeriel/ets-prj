import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-or-only',
  templateUrl: './or-only.component.html',
  styleUrls: ['./or-only.component.css']
})
export class OrOnlyComponent implements OnInit, OnDestroy {

	@Input() record: any;
	@ViewChild('taxAlloc') taxAllocMdl : ModalComponent;
	@ViewChild(LovComponent) lovMdl: LovComponent;
	@ViewChild('mainTbl') mainTbl: CustEditableNonDatatableComponent;
	@ViewChild('genTaxTbl') genTaxTbl: CustEditableNonDatatableComponent;
	@ViewChild('whTaxTbl') whTaxTbl: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  	@ViewChild('mainCancel') cancelBtn : CancelButtonComponent;
  	@ViewChild('taxAllocCancel') taxCancelBtn : CancelButtonComponent;
  	@Output() emitCreateUpdate: any = new EventEmitter<any>();
    @Input() inquiryFlag: boolean; // added by ENGEL;

	 passData : any = {
	    tableData: [],
	    tHeader : ["Item","Reference No","VAT Tag","Curr","Curr Rate","Amount","Amount(PHP)"],
	    dataTypes: ["reqTxt","text","reqSelect","text","percent","reqCurrency","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    infoFlag: true,
	    pageLength: 10,
	    paginateFlag: true,
	    total: [null,null,null,null,'Total','currAmt','localAmt'],
	    uneditable: [false,false,false,true,true,false,true],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
	        itemName: '',
	        currCd: '',
	        currRate: '',
	        currAmt: 0,
	        localAmt: 0,
	        refNo: '',
	        remarks: '',
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
          vatTag: '',
	        taxAllocation: []
	    },
	    keys: ['itemName', 'refNo', 'vatTag', 'currCd', 'currRate', 'currAmt', 'localAmt'],
	    widths: ['auto',150,130,1,100,120,120],
	    pageID: 'mainTbl',
      opts:[
          {
            selector: 'vatTag',
            vals: [],
            prev: []
          }
      ]
	  }

	  passDataGenTax : any = {
	  	tableData: [],
	    tHeader : ["Tax Code","Description","Base Amount","Rate","Tax Amount"],
	    dataTypes: ["text","text","currency","percent","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    pageLength: 5,
	    //uneditable: [false,false,true,true,false,true],
	    magnifyingGlass: ['taxCd'],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
          genType: 'M',
	        taxType: 'G', //for General Tax, Tax Type
	        taxCd: '',
	        taxName: '',
	        taxRate: '',
	        taxAmt: 0,
          taxBaseAmt: 0,
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
	        showMG: 1
	    },
	    keys: ['taxCd', 'taxName', 'taxBaseAmt', 'taxRate', 'taxAmt'],
	    widths: [1,150,120,120, 120],
      uneditable: [true,true,true,true,true],
	    pageID: 'genTaxTbl'
	  }

    sub: Subscription;

	  passDataWhTax : any = {
	  	tableData: [],
	    tHeader : ["Tax Code","Description","Base Amount","Rate","Tax Amount"],
	    dataTypes: ["text","text","currency","percent","currency"],
	    addFlag: true,
	    deleteFlag: true,
	    checkFlag: true,
	    pageLength: 5,
	    //uneditable: [false,false,true,true,false,true],
	    magnifyingGlass: ['taxCd'],
	    nData: {
	        tranId: '',
	        billId: '',
	        itemNo: '',
          genType: 'M',
	        taxType: 'W', //for Witholding Tax, Tax Type
	        taxCd: '',
	        taxName: '',
	        taxRate: '',
	        taxAmt: 0,
          taxBaseAmt: 0,
	        createUser: '',
	        createDate: '',
	        updateUser: '',
	        updateDate: '',
	        showMG: 1
	    },
	    keys: ['taxCd', 'taxName', 'taxBaseAmt', 'taxRate', 'taxAmt'],
	    widths: [1,150,120,120, 120],
      uneditable: [true,true,true,true,true],
	    pageID: 'whTaxTbl'
	  }

	  selectedItem: any = {};
	  disableTaxBtn: boolean = true;
	  cancelFlag: boolean = false;
	  genTaxIndex: number;
	  whTaxIndex: number;
	  dialogMessage: string = '';
	  dialogIcon: string = '';

	  passLov: any = {
	    selector: '',
	    activeTag: '',
	    hide: []
	  }

	  savedData: any = [];
	  deletedData: any = [];
	  deletedTaxData: any = [];

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
    this.ms.getRefCode('VAT_TAG').subscribe(data => {
      this.passData.opts[0].vals = data['refCodeList'].map(a => a.code);
      this.passData.opts[0].prev = data['refCodeList'].map(a => a.description);
    });

  	this.passData.nData.currCd = this.record.currCd;
  	this.passData.nData.currRate = this.record.currRate;
    this.passData.nData.vatTag = this.record.vatTag == null || this.record.vatTag == '' ? 3 : this.record.vatTag;
    this.checkPayeeVsVat(); //Check the payee's VAT_TAG if its gonna have a VAT or not in his payments.
    this.addDefaultTaxes();
  	if(this.record.orStatDesc.toUpperCase() != 'NEW' || this.inquiryFlag){
  		this.passData.addFlag = false;
  		this.passData.deleteFlag = false;
  		this.passData.checkFlag = false;
  		this.passDataGenTax.addFlag = false;
  		this.passDataGenTax.checkFlag = false;
  		this.passDataGenTax.deleteFlag = false;
  		this.passDataWhTax.checkFlag = false;
  		this.passDataWhTax.addFlag = false;
		  this.passDataWhTax.deleteFlag = false;
  		this.passData.uneditable = [true,true,true,true,true,true,true];
  		this.passDataGenTax.uneditable = [true,true,true,true];
  		this.passDataWhTax.uneditable = [true,true,true,true];
  	}
  	this.retrieveOrTransDtl();
  }

  ngOnDestroy(){
    if(this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  addDefaultTaxes(){
     var sub$ = forkJoin(this.ms.getAcseDefTax('OR',this.record.tranTypeCd),
                        this.ms.getAcseDefWhTax('OR',this.record.tranTypeCd)).pipe(map(([defTax, defWhTax]) => { return { defTax, defWhTax }; }));
     this.sub = sub$.subscribe(
       (forkData:any)=>{
         let defTax = forkData.defTax;
         let defWhTax = forkData.defWhTax;
         console.log(defTax);
         console.log(defWhTax);
         for(var i of defTax.defTax){
           console.log(i.taxCd);
           console.log(this.passData.nData.taxAllocation.map(a=>{return a.taxCd}).includes(i.taxCd));
           if(!this.passData.nData.taxAllocation.map(a=>{return a.taxCd}).includes(i.taxCd)){
             this.passData.nData.taxAllocation.push({
               tranId: this.record.tranId,
               billId: 1, // 1 for Official Receipt
               itemNo: '',
               genType: 'A',
               taxType: 'G', //for General Tax, Tax Type
               taxCd: i.taxCd,
               taxName: i.taxDesc,
               taxRate: i.taxRate,
               taxAmt: i.fixedAmount !== null ? i.fixedAmount : 0,
               createUser: '',
               createDate: '',
               updateUser: '',
               updateDate: '',
               showMG: 0,
               //edited: true
             });
           }
         }
         for(var j of defWhTax.defWhTax){
           this.passData.nData.taxAllocation.push({
             tranId: this.record.tranId,
             billId: 1, // 1 for Official Receipt
             itemNo: '',
             genType: 'A',
             taxType: 'W', //for Withholding Tax, Tax Type
             taxCd: j.taxCd,
             taxName: j.taxDesc,
             taxRate: j.taxRate,
             taxAmt: 0,
             createUser: '',
             createDate: '',
             updateUser: '',
             updateDate: '',
             showMG: 0,
             //edited: true
           });
         }
         this.passData.nData.taxAllocation = this.passData.nData.taxAllocation.filter(a=>{
                                                 if((this.record.vatTag == 3 || this.record.vatTag == 2) && this.record.orType == 'VAT'){
                                                    return a;
                                                 }else{
                                                   return a.taxCd !== 'VAT';
                                                 }
                                             });
       }
     );

  }

  checkPayeeVsVat(){
    if((this.record.vatTag == 3 || this.record.vatTag == 2) && this.record.orType == 'VAT'){
      this.ms.getMtnGenTax('VAT').subscribe(
         (data: any)=>{
           var vatDetails: any = {
             tranId: this.record.tranId,
             billId: 1, // 1 for Official Receipt
             itemNo: '',
             genType: 'A',
             taxType: 'G', //for General Tax, Tax Type
             taxCd: data.genTaxList[0].taxCd,
             taxName: data.genTaxList[0].taxName,
             taxRate: data.genTaxList[0].taxRate,
             taxAmt: 0,
             createUser: '',
             createDate: '',
             updateUser: '',
             updateDate: '',
             showMG: 0,
             edited: true
           }
           this.passData.nData.taxAllocation.push(vatDetails);
           console.log(this.passData.nData);
         },
         (error)=>{
           console.log('An error occured when fetching maintenance gentax');
         }
      );
    }
  }

  openTaxAllocation(){
  	this.taxAllocMdl.openNoClose();
  }

  retrieveOrTransDtl(){
  	//this.passData.tableData = [];
  	this.as.getAcseOrTransDtl(this.record.tranId, 1).subscribe(
  		(data:any)=>{
  			console.log(data.orDtlList);
  			if(data.orDtlList.length !== 0){
  				this.passData.tableData = data.orDtlList;
  				/*for(var i  of data.orDtlList){
  					this.passData.tableData.push(i);
  				}*/
  				this.mainTbl.refreshTable();
  				if(this.passData.checkFlag){
  					this.mainTbl.onRowClick(null, this.passData.tableData.filter(a=>{return a.itemName == this.selectedItem.itemName}).length == 0 ? null :
  							    				  this.passData.tableData.filter(a=>{return a.itemName == this.selectedItem.itemName})[0] );
  				}
  			}
  			
  		},
  		(error)=>{
  			console.log('An error occured');
  			console.log(error);
  			this.mainTbl.refreshTable();
  		}
    );
  }

  onRowClick(data){
  	if(data === null){
  		this.disableTaxBtn = true;
  		this.selectedItem = {};
  		this.emitCreateUpdate.emit(null);
  	}else{
  		data.updateDate = this.ns.toDateTimeString(data.updateDate);
  		data.createDate = this.ns.toDateTimeString(data.createDate);
  		this.emitCreateUpdate.emit(data);
  		this.disableTaxBtn = false;
  		this.passDataGenTax.nData.tranId = data.tranId;
  		this.passDataGenTax.nData.billId = data.billId;
  		this.passDataGenTax.nData.itemNo = data.itemNo;
  		this.passDataWhTax.nData.tranId = data.tranId;
  		this.passDataWhTax.nData.billId = data.billId;
  		this.passDataWhTax.nData.itemNo = data.itemNo;
  		this.passDataGenTax.tableData = data.taxAllocation.filter(a=>{return a.taxType == 'G'});
  		this.passDataWhTax.tableData = data.taxAllocation.filter(a=>{return a.taxType == 'W'});
  		this.genTaxTbl.refreshTable();
  		this.whTaxTbl.refreshTable();
  		this.selectedItem = data;
  	}
  }

  openGenTaxLOV(event){
  	this.passLov.activeTag = 'Y';
  	this.passLov.selector = 'mtnGenTax';
    this.passLov.hide = this.passDataGenTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    if((this.record.vatTag == 1 && !this.passLov.hide.includes('VAT')) || this.record.orType == 'NON-VAT'){ //if Payee is VAT EXEMPT, hide VAT in LOV
      this.passLov.hide.push('VAT')
    }
    this.genTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  openWhTaxLOV(event){
  	this.passLov.activeTag = 'Y';
  	this.passLov.selector = 'mtnWhTax';
    this.passLov.hide = this.passDataWhTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
    this.whTaxIndex = event.index;
    this.lovMdl.openLOV();
  }

  setSelectedData(data){
  	let selected = data.data;
    if(selected[0].taxId !== undefined){ //set values to general taxes table
    	console.log(selected);
	    this.passDataGenTax.tableData = this.passDataGenTax.tableData.filter(a=>a.showMG!=1);
	    for(var i = 0; i < selected.length; i++){
	      this.passDataGenTax.tableData.push(JSON.parse(JSON.stringify(this.passDataGenTax.nData)));
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxCd = selected[i].taxCd; 
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxName = selected[i].taxName; 
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxRate = selected[i].taxRate;
	      //this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = selected[i].amount;
        if(selected[i].taxRate == null || (selected[i].taxRate !== null && selected[i].taxRate == 0)){ //if fixed tax
          this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = selected[i].amount;
        }else{ //else if rated tax
          this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = (selected[i].taxRate/100) * this.selectedItem.localAmt;
        }
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].tranId = this.record.tranId;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].billId = 1;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].edited = true;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].showMG = 0;
	      this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].uneditable = ['taxCd'];
    	}
    	this.genTaxTbl.refreshTable();
    }else if(selected[0].whTaxId !== undefined){ //set values to withholding taxes table
    	console.log(selected);
    	this.passDataWhTax.tableData = this.passDataWhTax.tableData.filter(a=>a.showMG!=1);
    	for(var i = 0; i < selected.length; i++){
    	  this.passDataWhTax.tableData.push(JSON.parse(JSON.stringify(this.passDataWhTax.nData)));
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxCd = selected[i].taxCd; 
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxName = selected[i].taxName; 
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxRate = selected[i].taxRate;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxAmt = (selected[i].taxRate/100) * this.selectedItem.localAmt; //placeholder
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].tranId = this.record.tranId;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].billId = 1;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].edited = true;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].showMG = 0;
    	  this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].uneditable = ['taxCd'];
    	}
    	this.whTaxTbl.refreshTable();
    }
    this.selectedItem.edited = true;
    this.selectedItem.taxAllocation = this.passDataGenTax.tableData.concat(this.passDataWhTax.tableData);
  }

  onTableDataChange(data){
    console.log(data);
    if(data.key == 'currAmt'){
      for(var i of this.passData.tableData){
        i.localAmt = i.currAmt * i.currRate;
        for(var j of i.taxAllocation){
          if(j.taxCd == 'VAT' && this.record.vatTag == 2){ //if Payee is ZERO VAT
            i.taxAmt = 0;
          }else if(j.taxRate !== null && j.taxRate !== 0){
            j.taxAmt = i.localAmt * (j.taxRate / 100);
          }
          j.edited = true;
        }
      }
    }
  }

  onClickSave(){
  	if(this.record.dcbStatus == 'C' || this.record.dcbStatus == 'T'){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'O.R. cannot be saved. DCB No. is '; 
      this.dialogMessage += this.record.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
      this.successDiag.open();
    }else if(this.checkFields()){
      this.dialogIcon = 'error';
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  test(event){
    console.log(event);
  }

  save(cancelFlag?){
  	var totalLocalAmt: number = 0;
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];
  	this.deletedTaxData = [];
  	for (var i = 0 ; this.passData.tableData.length > i; i++) {
  	  if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  	      this.savedData.push(this.passData.tableData[i]);
  	      this.savedData[this.savedData.length-1].tranId = this.record.tranId;
  	      this.savedData[this.savedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
  	      this.deletedTaxData = this.savedData[this.savedData.length-1].taxAllocation.filter(a=>{return a.deleted});
  	      this.savedData[this.savedData.length-1].taxAllocation = this.savedData[this.savedData.length-1].taxAllocation.filter(a=>{return a.edited && !a.deleted});
  	  }
  	  else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
  	     this.deletedData.push(this.passData.tableData[i]);
  	     this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
  	     this.deletedData[this.deletedData.length-1].billId = 1; //1 for Official Receipt Transaction Type
  	     this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	     this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	     this.deletedTaxData.push(this.deletedData[this.deletedData.length-1].taxAllocation);
  	  }
  	}
  	this.passData.tableData.filter(a=>{return !a.deleted}).forEach(b=>{
  		totalLocalAmt += b.localAmt;
  	});
  	let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Official Receipt Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveOrTransDtl: this.savedData,
      delOrTransDtl: this.deletedData,
      delOrItemTaxes: this.deletedTaxData.flat()
    }
    console.log(params);

    this.as.saveAcseOrTransDtl(params).subscribe(
      (data:any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveOrTransDtl();
          this.mainTbl.refreshTable();
          this.mainTbl.markAsPristine();
          this.genTaxTbl.markAsPristine();
          this.whTaxTbl.markAsPristine();
          if(this.cancelFlag && this.taxAllocMdl !== undefined){
          	this.taxAllocMdl.closeModal();
          }
        }
      },
      (error: any)=>{

      }
    );
  }

  confirmLeaveTaxAlloc(){
    if(this.genTaxTbl.form.first.dirty || this.whTaxTbl.form.first.dirty){
      return true;
    }
    return false;
  }

  //VALIDATIONS STARTS HERE
  checkFields(): boolean{
    for(var i of this.passData.tableData){
      if(i.itemName == null || (i.itemName !== null && i.itemName.length == 0) ||
         i.currAmt == null || (i.currAmt !== null && String(i.currAmt).toString().length == 0) ||
         i.vatTag == '' || i.vatTag == null){
        return true;
      }
    }
    return false;
  }

}
