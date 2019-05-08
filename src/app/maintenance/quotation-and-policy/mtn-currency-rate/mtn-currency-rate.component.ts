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
}
