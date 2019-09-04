import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService, NotesService, AccountingService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jv-soa-lov',
  templateUrl: './jv-soa-lov.component.html',
  styleUrls: ['./jv-soa-lov.component.css']
})
export class JvSoaLovComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Input() cedingId: any;
  @Input() tranId:any;
  @Input() lovCheckBox: boolean = false;
  @Input() hide: any;

  passData: any = {
    tableData: [],
    tHeader: ['SOA No.','Policy No','Inst No', 'Due Date', 'Balance'],
    dataTypes: ['text','text','sequence-2','date','currency'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    colSize: ['460','460','50','200','450'],
    keys:['soaNo','policyNo','instNo','dueDate','balAmtDue']
  };

  modalOpen: boolean = false;
  selected: any;
  selects: any[] = [];

  constructor(private ns: NotesService, private maintenanceService: MaintenanceService, public modalService: NgbModal,private accountingService: AccountingService) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.passData.checkFlag = true;
    }
  }

  openModal(){
	  setTimeout(()=>{  
	  		this.accountingService.getJVSOA(this.tranId,'','',this.cedingId).subscribe((data:any) => {
          var test = data.soaDetails.filter((a)=>{return this.hide.indexOf((a.policyId.toString()+ '-'+ a.instNo))==-1})
          this.passData.tableData = data.soaDetails.filter((a)=>{return this.hide.indexOf((a.policyId.toString()+ '-'+ a.instNo))==-1})
	  			/*for(var i=0; i < data.soaDetails.length;i++){
	  				this.passData.tableData.push(data.soaDetails[i]);
	  			}*/
	  			this.table.refreshTable();
	  		});
	            this.modalOpen = true;
	   }, 0);
  }

  onRowClick(data){
    console.log(data)
  	if(data!=null){
  		this.selected = data;
  	}else{
  		this.selected = null;
  	}
  }

  cancel(){
    this.passData.tableData = [];
    this.table.refreshTable();
  }

  confirm(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }else {
      for(var i = 0 ; i < this.passData.tableData.length; i++){
        if(this.passData.tableData[i].checked){
          this.selects.push(this.passData.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  	this.passData.tableData = [];
  	this.table.refreshTable();
  }

}
