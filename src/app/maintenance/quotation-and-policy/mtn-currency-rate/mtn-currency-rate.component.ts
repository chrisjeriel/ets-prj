import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService} from '@app/_services'
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-mtn-currency-rate',
  templateUrl: './mtn-currency-rate.component.html',
  styleUrls: ['./mtn-currency-rate.component.css']
})
export class MtnCurrencyRateComponent implements OnInit {

  @ViewChild(MtnCurrencyComponent) currencyLov: MtnCurrencyComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  passData: any = {
    tHeader: [ "Hist No","Currency Rate","Eff Date From","Eff Date To", "Active","Remarks"],
    tableData:[],
    dataTypes: ['sequence-3','percent','date','date',"checkbox", "text"],
    nData: {
      histNo: null,
      currencyRt: null,
      effDateFrom: null,
      effDateTo: null,
      activeTag: 'N',
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'currencyRt',
    //checkFlag: true,
    disableDelete: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    //uneditable:[false,false,false,false,false],
    //widths:[130,250,360,50,'auto'],
    keys:['histNo','currencyRt','effDateFrom','effDateTo','activeTag','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  currencyData: any = {
    createUser:'',
    createDate:null,
    updateUser:'',
    updateDate:null,
  }

  currencyCd: any = '';
  description:any = '';
  editedData:any = [];
  saveData : any ={
    saveCurrencyRt: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.getCurrencyRate();
  }

  getCurrencyRate(){
    if(this.currencyCd == '' || this.currencyCd == null){
      this.emptyTbl();
    }else{
      this.passData.tableData = [];
      this.maintenanceService.getMtnCurrencyRt(this.currencyCd).subscribe((data:any) => {
        console.log(data)
        var currData = data.currencyCd;
        for(var i = 0;i < currData.length;i++){
          this.passData.tableData.push(currData[i]);
        }
         this.table.refreshTable();
      })
    }
  }

  clickRow(data){
    console.log(data)
    if(data !== null){
      this.currencyData = data;
      this.currencyData.createDate = this.ns.toDateTimeString(data.createDate);
      this.currencyData.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      /*this.currencyData.createUser = null;
      this.currencyData.createDate = null;
      this.currencyData.updateDate = null;
      this.currencyData.updateUser = null;*/
      this.passData.disableDelete = true;
    }
  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
    $('#currencyModal #modalBtn').addClass('ng-dirty')
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.currencyLov.checkCode(this.currencyCd.toUpperCase(), ev);
  }

  setCurrency(data){
    console.log(data)
    this.currencyCd = data.currencyCd;
    this.description = data.currencyDesc;
    this.ns.lovLoader(data.ev, 0);
    this.getCurrencyRate();
  }

  emptyTbl(){
    this.passData.tableData = [];
  }

  prepareData(){
    this.editedData = [];
    for(var i = 0; i< this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.editedData.push(this.passData.tableData[i]);
        this.editedData[this.editedData.length - 1].currencyCd = this.currencyCd;
        this.editedData[this.editedData.length - 1].effDateFrom = this.ns.toDateTimeString(this.passData.tableData[i].effDateFrom);
        this.editedData[this.editedData.length - 1].effDateTo = this.ns.toDateTimeString(this.passData.tableData[i].effDateTo);
        this.editedData[this.editedData.length - 1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }

    this.saveData.saveCurrencyRt = this.editedData;
  }

  onClickSave(){
    this.prepareData();
    this.maintenanceService.saveMtnCurrencyRt(this.saveData).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
          console.log('failed')
        } else{
          console.log('success')
        }
    })
  }
}
