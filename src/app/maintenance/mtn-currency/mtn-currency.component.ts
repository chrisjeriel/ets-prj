import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-currency',
  templateUrl: './mtn-currency.component.html',
  styleUrls: ['./mtn-currency.component.css']
})
export class MtnCurrencyComponent implements OnInit {
  @ViewChild('currMdl') modal: ModalComponent;
  
  selected: any = null;

  currencyListing: any = {
    tableData: [],




    tHeader: ['Currency Code', 'Currency Word', 'Currency Rate', 'Currency Description',],
    dataTypes: ['text', 'text', 'currencyRate', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
      'currencyCd',
      'currencyWord',
      'currencyRt',
      'currencyDesc',]
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  // @ViewChild(ModalComponent) modal: ModalComponent;
  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  @Input() effDateFrom: any;
  selects: any[] = [];
  

  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
    /*this.maintenanceService.getMtnCurrency().subscribe((data: any) =>{
      for(var currencyCount = 0; currencyCount < data.currency.length; currencyCount++){
        this.currencyListing.tableData.push(
          new Row(data.currency[currencyCount].currencyCd, 
              data.currency[currencyCount].currencyAbbr,
              data.currency[currencyCount].currencyWord,
              data.currency[currencyCount].currencyRt,
              data.currency[currencyCount].currencyDesc)
        );      
      }
      this.table.refreshTable();
    });*/
    if(this.lovCheckBox){
      this.currencyListing.checkFlag = true;
    }
  }

  onRowClick(data){
    // if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
     this.selectedData.emit(this.selected);
     this.currencyListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.currencyListing.tableData.length; i++){
        if(this.currencyListing.tableData[i].checked){
          this.selects.push(this.currencyListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }  
  }

  cancel(){
    this.currencyListing.tableData = [];
    this.table.refreshTable();
  }

  openModal(){
      /*for(var j = 0; j < this.passDataAttention.tableData.length; j++){
        this.passDataAttention.tableData.pop();
      }*/
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.maintenanceService.getMtnCurrency('','Y', this.effDateFrom).subscribe((data: any) =>{
                 for(var currencyCount = 0; currencyCount < data.currency.length; currencyCount++){
                   this.currencyListing.tableData.push(
                     new Row(data.currency[currencyCount].currencyCd, 
                         //data.currency[currencyCount].currencyAbbr,
                         data.currency[currencyCount].currencyWord,
                         data.currency[currencyCount].currencyRt,
                         data.currency[currencyCount].currencyDesc)
                   );      
                 }
                 /*if(this.effDateFrom !== undefined){
                   var latest: any;
                   this.currencyListing.tableData = data.currency.filter(a=>{
                     latest = latest == undefined ? <any>new Date() - <any>new Date(this.ns.toDateTimeString(a.effDateFrom).split('T')[0]) : latest;
                     if(latest > <any>new Date() - <any>new Date(this.ns.toDateTimeString(a.effDateFrom).split('T')[0])){
                       latest = <any>new Date() - <any>new Date(this.ns.toDateTimeString(a.effDateFrom).split('T')[0]);
                     }
                     return new Date(this.ns.toDateTimeString(a.effDateFrom).split('T')[0]) <= new Date(this.ns.toDateTimeString(this.effDateFrom).split('T')[0])
                                                                                    && <any>new Date() - <any>new Date(this.ns.toDateTimeString(a.effDateFrom).split('T')[0]) <= latest});
                 }else{
                   this.currencyListing.tableData = data.currency;
                 }*/
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);
      
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        currencyCd: '',
        currencyRt: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getMtnCurrency(code,'Y').subscribe(data => {
        if(data['currency'].length > 0) {
          data['currency'][0]['ev'] = ev;
          this.selectedData.emit(data['currency'][0]);
        } else {
          this.selectedData.emit({
            currencyCd: '',
            currencyRt: '',
            ev: ev
          });

          $('#currencyMdl > #modalBtn').trigger('click');
        }
        
      });
   }
  }

}

class Row{
  currencyCd: string;
  //currencyAbbr: string;
  currencyWord: string;
  currencyRt: number;
  currencyDesc: string;

  constructor(currencyCd: string, 
        //currencyAbbr: string,
        currencyWord: string,
        currencyRt: number,
        currencyDesc: string){
    this.currencyCd = currencyCd;
    //this.currencyAbbr = currencyAbbr;
    this.currencyWord = currencyWord;
    this.currencyRt = currencyRt;
    this.currencyDesc = currencyDesc;
  }
}
