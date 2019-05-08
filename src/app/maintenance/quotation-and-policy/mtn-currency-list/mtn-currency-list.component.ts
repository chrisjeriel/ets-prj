import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-mtn-currency-list',
  templateUrl: './mtn-currency-list.component.html',
  styleUrls: ['./mtn-currency-list.component.css']
})
export class MtnCurrencyListComponent implements OnInit {

  @ViewChild("currencyList") currencyList: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

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
    disableDelete: true,
    addFlag: true,
    deleteFlag: true,
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
      for(var i =0; i < data.currency.length;i++){
      	this.passData.tableData.push(data.currency[i]);
      }
       this.currencyList.refreshTable();
        this.getUneditable();
    });
  }

  onrowClick(data){
  	console.log(data)
  	if(data != null){
  		this.passData.disableDelete = false;
  		this.currencyData = data;
  		this.currencyData.createDate = this.ns.toDateTimeString(data.createDate);
  		this.currencyData.updateDate = this.ns.toDateTimeString(data.updateDate);
  	}else{
  		this.passData.disableDelete = true;
  	}
  }

  prepareData(){
  	this.edited = [];
  	for(var i =0; i< this.passData.tableData.length;i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData.deleted){
  			this.edited.push(this.passData.tableData[i])
        this.edited[this.edited.length - 1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.edited[this.edited.length - 1].updateDate = this.ns.toDateTimeString(0);
  		}
  	}
  	this.saveData.saveCurrency = this.edited;
  	console.log(this.edited)
  }

  saveCurrency(cancelFlag?){
      this.cancelFlag = cancelFlag !== undefined;
      this.prepareData();
      console.log(JSON.stringify(this.saveData))
      this.maintenanceService.saveMtnCurrency(this.saveData).subscribe((data:any) => {
        if(data['returnCode'] == 0) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          $('#successModalBtn').trigger('click');
        } else{
          console.log('success');
          this.dialogMessage = "";
          this.dialogIcon = "success";
          $('app-sucess-dialog #modalBtn').trigger('click');
          this.getMtnCurrency();
        }
      });
  }

  onClickSave(){
  	 $('#confirm-save #modalBtn2').trigger('click');

  }

  cancel(){
  	this.cancelBtn.clickCancel();
  }

  getUneditable(){
    for(let data of this.passData.tableData){
      data.uneditable = [];
      if(data.coverCd == ''){
        data.uneditable.pop();
      }else {
          data.uneditable.push('coverCd');
      }
    }
  }
}
