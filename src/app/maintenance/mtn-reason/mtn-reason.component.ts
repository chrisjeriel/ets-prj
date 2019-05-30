import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-reason',
  templateUrl: './mtn-reason.component.html',
  styleUrls: ['./mtn-reason.component.css']
})
export class MtnReasonComponent implements OnInit {
   @ViewChild('mdl') modal : ModalComponent;

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  
   constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }

    passDataReason: any = {
          tableData: [],
          tHeader: ["Reason","Description"],
          dataTypes: ['text', 'text'],
          pageLength: 6,
          fixedCol: false,
          pageID: 'reason',
          keys:[
          	'reasonCd', 
            'description', 
            ]

      }
      selected: any;


  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

    ngOnInit() {
    	if(this.lovCheckBox){
        this.passDataReason.checkFlag = true;
      }
      
    }



    select(data){
    	  this.selected = data;
    }

    okBtnClick(){
    	  if(!this.lovCheckBox){
          this.selectedData.emit(this.selected);
        }
        else{
          for(var i = 0; i < this.passDataReason.tableData.length; i++){
            if(this.passDataReason.tableData[i].checked){
              this.selects.push(this.passDataReason.tableData[i]);
            }
          }
          this.selectedData.emit(this.selects);
          this.selects = [];
        }
    }

   openModal(){
     /*this.mtnService.getMtnReason().subscribe((data: any) => {
        for (var i = 0; i < data.reason.length; i++) {
          this.passDataReason.tableData.push(data.reason[i]);
        }
        this.table.refreshTable();
      });
     this.modalOpen = true;*/

     this.mtnService.getMtnQuoteReason({activeTag:'Y'}).subscribe((data: any) => {
        console.log(data)
        this.passDataReason.tableData = data.reasonList;
        this.table.refreshTable();
      });
   }

   checkCode(code, ev) {
     console.log(code);
     if(code.trim() === ''){
       this.selectedData.emit({
         reasonCd: '',
         description: '',
         ev: ev
       });
     } else {
       this.mtnService.getMtnQuoteReason({reasonCd: code, activeTag: 'Y'}).subscribe(data => {
         console.log(data['reasonList']);
         if(data['reasonList'].length > 0) {
           data['reasonList'][0]['ev'] = ev;
           this.selectedData.emit(data['reasonList'][0]);
         } else {
           this.selectedData.emit({
             reasonCd: '',
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
