import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-employee',
  templateUrl: './mtn-employee.component.html',
  styleUrls: ['./mtn-employee.component.css']
})
export class MtnEmployeeComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;

  selected: any = null;

  employeeListing: any = {
    tableData: [],
    tHeader: ['Employee No', 'Name', 'Department'],
    dataTypes: ['text', 'text', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'empMtnTable',
    keys:[
      'employeeNo',
      'printableName',
      'department']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  @Input() companyId: any;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.employeeListing.checkFlag = true;
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
     this.employeeListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.employeeListing.tableData.length; i++){
        if(this.employeeListing.tableData[i].checked){
          this.selects.push(this.employeeListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = []; 
    }  
  }

  cancel(){
    this.employeeListing.tableData = [];
    this.table.refreshTable();
  }

   openModal(){
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.maintenanceService.getMtnEmployee(this.companyId).subscribe((data: any) =>{
                 for(var empCount = 0; empCount < data.employeeList.length; empCount++){
                   this.employeeListing.tableData.push(
                     new Row( data.employeeList[empCount].employeeId,
                         data.employeeList[empCount].employeeNo, 
                         data.employeeList[empCount].printableName,
                         data.employeeList[empCount].department)
                   );      
                 }
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);
      
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        employeeId: '',
        employeeNo: '',
        printableName: '',
        ev: ev
      });
    } else {
      var isValid = isNaN(code);
      if (isValid === false){
        this.maintenanceService.getMtnEmployee(code).subscribe(data => {
          if(data['employeeList'].length > 0) {
            data['employeeList'][0]['ev'] = ev;
            this.selectedData.emit(data['employeeList'][0]);
          } else {
            this.selectedData.emit({
              employeeId: '',
              employeeNo: '',
              printableName: '',
              ev: ev
            });
            this.modal.openNoClose();
          }
        });
      } else {
         this.selectedData.emit({
            employeeId: '',
            employeeNo: '',
            printableName: '',
            ev: ev
          });
          this.modal.openNoClose();
      }
   }
  }

}

class Row{
  employeeId : string;
  employeeNo: string;
  printableName: string;
  department: number;

  constructor(
        employeeId : string,
        employeeNo: string, 
        printableName: string,
        department: number){

    this.employeeId = employeeId;
    this.employeeNo   = employeeNo;
    this.printableName = printableName;
    this.department = department;
  }
}
