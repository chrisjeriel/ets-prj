import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { ModalComponent } from '@app/_components/common/modal/modal.component';
@Component({
  selector: 'app-mtn-claim-status-lov',
  templateUrl: './mtn-claim-status-lov.component.html',
  styleUrls: ['./mtn-claim-status-lov.component.css']
})
export class MtnClaimStatusLovComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') modal: ModalComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Status Code','Description'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    colSize:['59px','69px'],
    keys:['statusCode','description']
  };

  fromInput: boolean = false;
  selected: any;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  select(data){
  	console.log(data)
    this.selected = data;
  }

  openModal(){
    this.maintenanceService.getClaimStatus(null).subscribe((data:any) => {
      this.passData.tableData = [];
      for(var i =0; i < data.claimStatus.length; i++){
      	if(data.claimStatus[i].activeTag === 'Y'){
      	   this.passData.tableData.push(data.claimStatus[i]);
      	}
      	this.table.refreshTable();
      }
      	//this.table.refreshTable();
    });
  }

  okBtnClick(){
    this.selected['fromLOV'] = true;
    this.selectedData.emit(this.selected);
  }

   checkCode(code, ev) {
   	var obj =  {
   	  statusCode: '',
   	  Description: '',
   	  ev: ev,
   	  singleSearchLov: true
   	}

   	 if(code === ''){
   	   var arr = [];
   	   arr.push(obj);

   	   this.selectedData.emit(arr);
   	 }else {
   	 	this.passData.tableData = [];
   	 	this.maintenanceService.getClaimStatus(null).subscribe((data:any)=> {
   	 		//data.claimStatus = data.claimStatus.filter((a)=>{return ev.filter.indexOf(a.statusCode)==-1});

   	 		if(data.claimStatus.length == 1){
   	 			data.claimStatus[0]['ev'] = ev;
   	 			data.claimStatus[0]['singleSearchLov'] = true;

   	 			var arr = [];
   	 			arr.push(data['sectionCovers'][0]);

   	 			this.selectedData.emit(arr);
   	 		}else if(data.claimStatus.length > 1){
   	 			this.fromInput = true;

   	 			var arr = [];
   	 			arr.push(obj);

   	 			this.selectedData.emit(arr);
   	 			
   	 			this.passData.tableData = data['claimStatus'];
   	 			this.table.refreshTable();

   	 			//this.modal.openNoClose();
   	 		} else {
	          var arr = [];
	          arr.push(obj);

	          this.selectedData.emit(arr);
	            
	          this.modal.openNoClose();
	        }
   	 	});
   	 }
   }
}
