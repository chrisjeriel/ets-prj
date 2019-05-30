import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ceding-company',
  templateUrl: './ceding-company.component.html',
  styleUrls: ['./ceding-company.component.css']
})
export class CedingCompanyComponent implements OnInit {
  @ViewChild('mdl') modal: ModalComponent;
  @Input() exclude: any[] = [];

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;

  passDataCedingCompanyMember: any = {
        tableData : [],
        tHeader: ['Co No','Name','Address'],
        dataTypes:['sequence-3','text','text'],
        pagination: true,
        pageStatus: true,
        searchFlag: true,
        pageLength: 10,
        resizable: [false,true,false,true,false,false,false],
        filters: [
            {
                key: 'coNo',
                title:'Company No',
                dataType: 'text'
            },
            {
                key: 'name',
                title:'Name',
                dataType: 'text'
            },
            {
                key: 'address',
                title:'Address',
                dataType: 'text'
            }            
        ],
        pageID: 'ceding-co'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
        keys:['cedingId','cedingName','address']
    };

    modalOpen:boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  @Input() treaty: boolean;
    
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
  	/*this.underwritingService.getCedingCompanyList().subscribe((data: any) => {
                for(var i=0;i< data.cedingcompany.length;i++){
                    this.passDataCedingCompany.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[i],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[i],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[i],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
                }
				this.table.refreshTable();          
    });*/
    if(this.lovCheckBox){
      this.passDataCedingCompanyMember.checkFlag = true;
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
        this.selected['fromLOV'] = true;
        this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.passDataCedingCompanyMember.tableData.length; i++){
        if(this.passDataCedingCompanyMember.tableData[i].checked){
          this.selects.push(this.passDataCedingCompanyMember.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
     this.passDataCedingCompanyMember.tableData = [];
     

     this.underwritingService.getCedingCompanyList('','','','','','','','','','Y').subscribe((data: any) => {
         for(var i=0; i < data.cedingcompany.length;i++){
           if(!this.exclude.includes(String(data.cedingcompany[i].cedingId).padStart(3, '0'))) {
             this.passDataCedingCompanyMember.tableData.push(data.cedingcompany[i]);
           }            
         }

         if(this.treaty !== undefined && this.treaty) {
           this.passDataCedingCompanyMember.tableData = this.passDataCedingCompanyMember.tableData.filter(a => a.treatyTag == 'Y');
         } else if(this.treaty !== undefined && !this.treaty) {
           this.passDataCedingCompanyMember.tableData = this.passDataCedingCompanyMember.tableData.filter(a => a.treatyTag == 'N');
         }
         this.table.refreshTable();          
     });
     //this.modalOpen = true;
  }

  checkCode(code, ev, id?) {
    if(String(code).trim() === ''){
      this.selectedData.emit({
        cedingId: '',
        cedingName: '',
        cedingAbbr: '',
        ev: ev,
        singleSearchLov: true
      });
    } else if(isNaN(code/1)) {
      this.selectedData.emit({
        cedingId: '',
        cedingName: '',
        cedingAbbr: '',
        ev: ev,
        singleSearchLov: true
      });

      if(id != undefined) {
        $(id + ' #modalBtn').trigger('click');  
      } else {
        // $('#cedingCompanyMdl > #modalBtn').trigger('click');
        this.modal.openNoClose();  
      }      
    } else {
      this.underwritingService.getCedingCompanyList(String(code).padStart(3,'0'),'','','','','','','','','Y').subscribe(data => {
        if(this.treaty) {
           data['cedingcompany'] = data['cedingcompany'].filter(a => a.treatyTag == 'Y');
        }
           
        if(data['cedingcompany'].length > 0 && !this.exclude.includes(String(data['cedingcompany'][0].cedingId).padStart(3, '0'))) {
          data['cedingcompany'][0]['ev'] = ev;
          data['cedingcompany'][0]['singleSearchLov'] = true;
          this.selectedData.emit(data['cedingcompany'][0]);
        } else {
          this.selectedData.emit({
            cedingId: '',
            cedingName: '',
            cedingAbbr: '',
            ev: ev,
            singleSearchLov: true
          });

          if(id != undefined) {
            //$(id + ' #modalBtn').trigger('click');  
            this.modal.openNoClose();
          } else {
            //$('#cedingCompanyMdl > #modalBtn').trigger('click');  
            this.modal.openNoClose();
          }   
        }      
      });
    }
  }
}
