import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
@Component({
  selector: 'app-mtn-currency-code',
  templateUrl: './mtn-currency-code.component.html',
  styleUrls: ['./mtn-currency-code.component.css']
})
export class MtnCurrencyCodeComponent implements OnInit {
  selected: any = null;

  currencyListing: any = {
    tableData: [],
    tHeader: ['Currency Code', 'Currency Word', 'Currency Description',],
    dataTypes: ['text', 'text', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
      'currencyCd',
      'currencyWord',
      'description']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal) { }

  ngOnInit() {
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
             this.maintenanceService.getMtnCurrencyList('').subscribe((data: any) =>{
                   for(var i = 0; i < data.currency.length; i++){
                     if(data.currency[i].activeTag == 'Y'){
                       this.currencyListing.tableData.push(data.currency[i]);
                     }   
                   }
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
        this.maintenanceService.getMtnCurrencyList(code).subscribe(data => {
          console.log(data)
          if(data['currency'].length > 0 && data['currency'][0]['activeTag'] == 'Y') {
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
