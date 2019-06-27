import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-mtn-currency-list',
  templateUrl: './mtn-currency-list.component.html',
  styleUrls: ['./mtn-currency-list.component.css']
})
export class MtnCurrencyListComponent implements OnInit {

  @ViewChild("currencyList") currencyList: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  passData: any = {
    tHeader: [ "Currency Code","Currency Word","Description","Active", "Remarks"],
    tableData:[],
    dataTypes: ['text','text','text',"checkbox", "text"],
    nData: {
      currencyCd: null,
      currencyWord: null,
      activeTag: 'N',
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'currency',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false,false,false],
    widths:[130,250,360,50,'auto'],
    keys:['currencyCd','currencyWord','description','activeTag','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  currencyData : any = {
    createDate: '',
    createUser: null,
    updateDate: '',
    updateUser: null
  }

  edited: any =[];
  deleted: any = [];
  cancelFlag:boolean;
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag: boolean = false;
  saveData : any = {
  	saveCurrency: []
  }

  constructor(private maintenanceService:MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.getMtnCurrency();
  }

  getMtnCurrency(){
    this.passData.tableData = [];
    this.maintenanceService.getMtnCurrencyList(null).subscribe((data:any) => {
      console.log(data)
      for(var i =0; i < data.currency.length;i++){
      	this.passData.tableData.push(data.currency[i]);
        this.passData.tableData[i].uneditable = ['currencyCd']
      }
       this.currencyList.refreshTable();
    });
  }

  onrowClick(data){
  	console.log(data)
  	if(data != null){
  		this.passData.disableGeneric = false;
  		this.currencyData = data;
  		this.currencyData.createDate = this.ns.toDateTimeString(data.createDate);
  		this.currencyData.updateDate = this.ns.toDateTimeString(data.updateDate);
  	}else{
  		this.passData.disableGeneric = true;
  	}
  }

  prepareData(){
  	this.edited = [];
    this.deleted = [];
    this.errorFlag = false;
  	for(var i =0; i< this.passData.tableData.length;i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  			this.edited.push(this.passData.tableData[i])
        this.edited[this.edited.length - 1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.edited[this.edited.length - 1].updateDate = this.ns.toDateTimeString(0);
  		}else if(this.passData.tableData[i].deleted){
        this.deleted.push(this.passData.tableData[i]);
      }

      if(this.passData.tableData[i].currencyCd === null || this.passData.tableData[i].currencyCd === ''){
        this.errorFlag = true;
      }
  	}
  	this.saveData.saveCurrency = this.edited;
    this.saveData.delCurrency = this.deleted;
  }

  saveCurrency(cancelFlag?){
      this.cancelFlag = cancelFlag !== undefined;
      this.prepareData();
      console.log(this.currencyList)
     if(this.errorFlag){
       setTimeout(()=> {
        this.dialogIcon = 'error-message';
        this.dialogMessage =  'Please Check Field Values.';
        this.successDialog.open();
        },0);
     }else if(this.currencyList.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'You are not allowed to delete a Currency Code that is already used in Quotation Processing.';
      this.successDialog.open();
     }else if(this.edited.length === 0 && this.deleted.length === 0){
        setTimeout(()=> {
        this.dialogMessage = "Nothing to Save.";
        this.dialogIcon = "info";
        this.successDialog.open();
        },0);
     }else{
       this.maintenanceService.saveMtnCurrency(this.saveData).subscribe((data:any) => {
         if(data['returnCode'] == 0) {
           this.dialogMessage = data['errorList'][0].errorMessage;
           this.dialogIcon = "error";
           this.successDialog.open();
         } else{
           this.dialogIcon = "success";
           this.successDialog.open();
           this.getMtnCurrency();
         }
       });
     } 
  }

  onClickSave(){
    let currCds:string[] = this.passData.tableData.filter(a=>!a.deleted).map(a=>String(a.currencyCd).padStart(3,'0'));

    if(currCds.some((a,i)=>currCds.indexOf(a) != i)){
      this.dialogMessage = 'Unable to save the record. Currency Code must be unique per Line';
      this.dialogIcon = 'error-message';
      this.successDialog.open();
      return;
    }else{
  	 $('#confirm-save #modalBtn2').trigger('click');
    }

  }

  cancel(){
  	this.cancelBtn.clickCancel();
  }

  /*getUneditable(){
    for(let data of this.passData.tableData){
      data.uneditable = [];
      if(data.coverCd == ''){
        data.uneditable.pop();
      }else {
          data.uneditable.push('coverCd');
      }
    }
  }*/

  deleteCurr(){
    if(this.currencyList.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'You are not allowed to delete a Currency Code that is already used in Quotation Processing.';
      this.successDialog.open();
    }else{
      this.currencyList.indvSelect.deleted = true;
      this.currencyList.selected  = [this.currencyList.indvSelect]
      this.currencyList.confirmDelete();
    }
  }
}
