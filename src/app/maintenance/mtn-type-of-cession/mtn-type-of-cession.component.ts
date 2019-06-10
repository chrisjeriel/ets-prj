import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-type-of-cession',
  templateUrl: './mtn-type-of-cession.component.html',
  styleUrls: ['./mtn-type-of-cession.component.css']
})
export class MtnTypeOfCessionComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;
	selected: any = null;

  cessionListing: any = {
    tableData: [],
    tHeader: ['Cession ID','Description'],
    dataTypes: ['sequence-3', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'typeOfCession'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
    keys:[
    	'cessionId',
    	'description'
    	]
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	/*this.maintenanceService.getMtnTypeOfCession('').subscribe(data =>{
  		var records = data['cession'];

            for(let rec of records){
            	this.cessionListing.tableData.push({
                    cessionId: rec.cessionId,
                    cessionAbbr: rec.cessionAbbr,
                    description: rec.description,
                    remarks: rec.remarks                    
                });
            }

  		this.table.refreshTable();
  	});*/
    if(this.lovCheckBox){
      this.cessionListing.checkFlag = true;
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

  confirm(){
    if(!this.lovCheckBox){
      this.selected['fromLOV'] = true;
      this.selectedData.emit(this.selected);
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.cessionListing.tableData.length; i++){
        if(this.cessionListing.tableData[i].checked){
          this.selects.push(this.cessionListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    this.cessionListing.tableData = [];
    
     this.maintenanceService.getMtnTypeOfCession('').subscribe(data => {
       var records = data['cession'];

             for(let rec of records){
               this.cessionListing.tableData.push({
                     cessionId: rec.cessionId,
                     cessionAbbr: rec.cessionAbbr,
                     description: rec.description,
                     remarks: rec.remarks                    
                 });
             }

       this.table.refreshTable();
     });
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        cessionId: '',
        description: '',
        ev: ev
      });
    }  else if(isNaN(code/1)) {
      this.selectedData.emit({
        cessionId: '',
        description: '',
        ev: ev
      });

      // $('#typeOfCessionMdl > #modalBtn').trigger('click');
      this.modal.openNoClose();
    } else {
      this.maintenanceService.getMtnTypeOfCession(code).subscribe(data => {
        if(data['cession'].length > 0) {
          data['cession'][0]['ev'] = ev;
          this.selectedData.emit(data['cession'][0]);
        } else {
          this.selectedData.emit({
            cessionId: '',
            description: '',
            ev: ev
          });

          //$('#typeOfCessionMdl > #modalBtn').trigger('click');
          this.modal.openNoClose();
        }
        
      });
  }
  }

}
