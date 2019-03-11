import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ceding-company',
  templateUrl: './ceding-company.component.html',
  styleUrls: ['./ceding-company.component.css']
})
export class CedingCompanyComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;

  passDataCedingCompanyMember: any = {
        tableData : [],
        tHeader: ['Co No','Name','Address'],
        dataTypes:['sequence-3','text','text',],
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
        pageID: 'direct',
        keys:['cedingId','cedingName','address']
    };

    modalOpen:boolean = false;

    
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
  	/*this.underwritingService.getCedingCompanyList().subscribe((data: any) => {
                for(var i=0;i< data.cedingcompany.length;i++){
                    this.passDataCedingCompany.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[i],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[i],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[i],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
                }
				this.table.refreshTable();          
    });*/
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
  	this.selectedData.emit(this.selected);
  }

  openModal(){
     this.passDataCedingCompanyMember.tableData = [];

     this.underwritingService.getCedingCompanyList('','','','','','','','','','Y').subscribe((data: any) => {
         for(var i=0;i< data.cedingcompany.length;i++){
            // this.passDataCedingCompanyMember.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[0],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[0],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[0],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
           this.passDataCedingCompanyMember.tableData.push({
               cedingId: data.cedingcompany[i].cedingId,
               cedingName: data.cedingcompany[i].cedingName,
               address: data.cedingcompany[i].address
           });
         }
         this.table.refreshTable();          
     });
     this.modalOpen = true;
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        cedingId: '',
        cedingName: '',
        ev: ev
      });
    } else {
      this.underwritingService.getCedingCompanyList(code,'','','','','','','','','Y').subscribe(data => {     
        if(data['cedingcompany'].length > 0) {
          data['cedingcompany'][0]['ev'] = ev;
          // this.selectedData.emit(new CedingCompanyListing(data['cedingcompany'][0].cedingId,data['cedingcompany'][0].cedingName,data['cedingcompany'][0].cedingAbbr,data['cedingcompany'][0].address,(data['cedingcompany'][0].membershipDate == null ? null : new Date(data['cedingcompany'][0].membershipDate[0],data['cedingcompany'][0].membershipDate[1]-1,data['cedingcompany'][0].membershipDate[2])),(data['cedingcompany'][0].terminationDate == null ? null : new Date(data['cedingcompany'][0].terminationDate[0],data['cedingcompany'][0].terminationDate[1]-1,data['cedingcompany'][0].terminationDate[2])),(data['cedingcompany'][0].inactiveDate == null ? null : new Date(data['cedingcompany'][0].inactiveDate[0],data['cedingcompany'][0].inactiveDate[1]-1,data['cedingcompany'][0].inactiveDate[2]))));
          this.selectedData.emit(data['cedingcompany'][0]);
        } else {
          this.selectedData.emit({
            cedingId: '',
            cedingName: '',
            ev: ev
          });

          $('#cedingCompanyMdl > #modalBtn').trigger('click');
        }      
      });
    }
  }
}
