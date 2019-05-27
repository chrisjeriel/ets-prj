import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UserService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { finalize } from 'rxjs/operators';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-approver',
  templateUrl: './mtn-approver.component.html',
  styleUrls: ['./mtn-approver.component.css']
})
export class MtnApproverComponent implements OnInit {
@ViewChild('userModal') modal: ModalComponent;
@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
@Output() cancelMdl: EventEmitter<any> = new EventEmitter();
@Output() selectedData: EventEmitter<any> = new EventEmitter();
@Input() lovCheckBox: boolean = false;
@Input() hide:string[] = [];

selected: any = null;
modalOpen: boolean = false;
searchParams: any[] = [];
selects: any[] = [];
  usersListing: any = {
    tableData: [],
    tHeader: ['User ID', 'User Name'],
    dataTypes: ['text', 'text'],
    filters: [
	    {
	    	key: 'userId',
	    	title: 'User Id',
	    	dataType: 'text',
	    },
	    {
	    	key: 'userName',
	    	title: 'User Name',
	    	dataType: 'text',
	    },
    ],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    pageID: 'usersLov',
    colSize: ['100px', '250px'],
    keys:['userId','userName']
  };

  constructor(private userService: UserService, private modalService: NgbModal, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.usersListing.checkFlag = true;
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
      this.usersListing.tableData = [];
      this.table.refreshTable('');
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.usersListing.tableData.length; i++){
        if(this.usersListing.tableData[i].checked){
          this.selects.push(this.usersListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  cancel(){
    this.usersListing.tableData = [];
    this.table.refreshTable();
  }

  cancelClicked(event) {
       this.cancelMdl.next(event);
   }


  openModal(){
      this.maintenanceService.getMtnApprover().subscribe((data:any) => {
      	for(var i = 0; i < data.approverList.length; i++){
          if(this.hide.indexOf(data.approverList[i].userId)== -1){
           this.usersListing.tableData.push(data.approverList[i]);
          }
        }
        this.table.refreshTable();
      });
      	this.modalOpen = true;
  }

  checkCode(code:string, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        userId: '',
        userName:'',
        ev: ev,
        singleSearchLov: true
      });
    } else {
      //console.log(code.toUpperCase() == 'EARL')
      this.maintenanceService.getMtnApprover(code.toUpperCase().trim()).subscribe((data:any) => {
      		data['approverList'] = data['approverList'].filter(a=> this.hide.indexOf(a.userId) == -1)
      		if(data['approverList'].length > 0) {
      		  data['approverList'][0]['ev'] = ev;
      		  data['approverList'][0]['singleSearchLov'] = true;
      		  this.selectedData.emit(data['approverList'][0]);
      		} else {
      		  data['approverList'] = data['approverList'].filter((a)=>{return ev.filter.indexOf(a.userId)==-1});
      		  this.selectedData.emit({
      		    userId: '',
      		    userName:'',
      		    ev: ev,
      		    singleSearchLov: true
      		  });
      		  this.modal.openNoClose();
      		}
      });
   }
  }

  //Method for DB query
  searchQuery(searchParams){
      this.searchParams = searchParams;
      this.usersListing.tableData = [];
      this.openModal();
  }
}