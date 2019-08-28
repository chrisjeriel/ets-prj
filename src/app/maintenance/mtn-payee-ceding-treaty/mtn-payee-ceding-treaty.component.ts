import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UnderwritingService, MaintenanceService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-payee-ceding-treaty',
  templateUrl: './mtn-payee-ceding-treaty.component.html',
  styleUrls: ['./mtn-payee-ceding-treaty.component.css']
})
export class MtnPayeeCedingTreatyComponent implements OnInit {

 @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild('modal') modal: ModalComponent;
  @Input() lovCheckBox: boolean = false;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  selected: any = null;
  selects: any[] = [];

  passData: any = {
      tableData : [],
      tHeader: ['Co No','Name','Address'],
      dataTypes:['text','text','text'],
      pagination: true,
      pageStatus: true,
      searchFlag: true,
      pageLength: 10,
      resizable: [false,true,false,true,false,false,false],
      filters: [
          {
              key: 'payeeCd',
              title:'Company No',
              dataType: 'text'
          },
          {
              key: 'payeeName',
              title:'Name',
              dataType: 'text'
          },
          {
              key: 'payeeAddress',
              title:'Address',
              dataType: 'text'
          },          
      ],
      pageID: '1232141',
      keys:['payeeCd','payeeName','payeeAddress']
  };

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
  	if(this.lovCheckBox){
  	  this.passData.checkFlag = true;
  	}
  }

  onRowClick(data){  	
    // if(Object.is(this.selected, data)){
   if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null;
    } else {
      this.selected = data;
    }
  }

  okBtnClick(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selects.push(this.passData.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    this.passData.tableData = [];

    this.maintenanceService.getMtnPayeeCeding(1,'Y').subscribe((data: any) => {
         for(var i=0;i< data.payeeCeding.length;i++){
           this.passData.tableData.push(data.payeeCeding[i]);
         }
         this.table.refreshTable(); 
     });
  }

  /*checkCode(code, ev) {    
    if(code.trim() === ''){
      this.selectedData.emit({
        cedingId: '',
        cedingName: '',
        cedingAbbr:'',
        ev: ev,
        singleSearchLov: true
      });
    } else {
      this.maintenanceService.getMtnPayeeCeding('Y',code).subscribe((data: any) => {
        if(data['cedingcompany'].length > 0) {
          data['cedingcompany'][0]['ev'] = ev;
          data['cedingcompany'][0]['singleSearchLov'] = true;
          this.selectedData.emit(data['cedingcompany'][0]);
        } else {
          this.selectedData.emit({
            cedingId: '',
            cedingName: '',
            cedingAbbr:'',
            ev: ev,
            singleSearchLov: true
          });
		 this.modal.openNoClose();
        }      
      });
    }
  }*/
}
