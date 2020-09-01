import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MaintenanceService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mtn-printable-names',
  templateUrl: './mtn-printable-names.component.html',
  styleUrls: ['./mtn-printable-names.component.css']
})
export class MtnPrintableNamesComponent implements OnInit {
  
  @ViewChild('Modal') modal: ModalComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;
  modalOpen: boolean = false;

  passData: any = {
    tableData: [],
    tHeader: ['Name', 'Position'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:['printableName', 'designation']
  };
  fromInput: boolean = false;

  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal(){
  	setTimeout(()=>{
     if(!this.fromInput) {
     this.maintenanceService.getMtnPrintableName(null,'Y').subscribe((data:any) => {
     	for( var i = 0 ; i < data.printableNames.length; i++){
     		this.passData.tableData.push(data.printableNames[i]);
     	}
     	this.table.refreshTable();
     });
    } else {
      this.fromInput = false;
    }

    this.modalOpen = true;
    }, 0);
  }

  retrievePrintable(){
  	this.maintenanceService.getMtnPrintableName('','Y').subscribe((data:any) => {
  		for( var i = 0 ; i < data.printableNames.length; i++){
  			this.passData.tableData.push(data.printableNames[i]);
  		}
  		this.table.refreshTable();
  	});
  }

  onRowClick(data){
    if(data === null){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    this.selectedData.emit(this.selected);
  }

  cancel(){
    this.passData.tableData = [];
    this.table.refreshTable();
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        printableName: '',
        designation: '',
        userId: '',
        ev: ev
      });
    } else {
      /*this.maintenanceService.getMtnPrintableName(code).subscribe(data => {
        if(data['printableNames'].length > 0) {
          data['printableNames'][0]['ev'] = ev;
          this.selectedData.emit(data['printableNames'][0]);
          console.log(this.selectedData);
        } else {
          this.selectedData.emit({
            printableName: '',
            ev: ev
          });

          // $('#printable > #modalBtn').trigger('click');
          this.modal.openNoClose();
        }
        
      });*/

      this.maintenanceService.getMtnUserLov(code).subscribe(data => {
        if(data['userList'].length == 1) {
          data['userList'][0]['ev'] = ev;
          this.selectedData.emit(data['userList'][0]);
        } else if(data['userList'].length > 1) {
          this.fromInput = true;

          this.selectedData.emit({
            printableName: '',
            designation: '',
            userId: '',
            ev: ev
          });

          this.passData.tableData = data['userList'];
          this.modal.openNoClose();
        } else {
          this.selectedData.emit({
            printableName: '',
            designation: '',
            userId: '',
            ev: ev
          });

          this.modal.openNoClose();
        }
      });
   }
  }
}
