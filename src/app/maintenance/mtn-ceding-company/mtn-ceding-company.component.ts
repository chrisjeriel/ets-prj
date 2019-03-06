import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyListing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mtn-ceding-company',
  templateUrl: './mtn-ceding-company.component.html',
  styleUrls: ['./mtn-ceding-company.component.css']
})
export class MtnCedingCompanyComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any = null;

  passDataCedingCompanyNotMember: any = {
      tableData : [],
      tHeader: ['Co No','Name','Abbreviation','Address','Membership Date','Termination Date','Inactive Date'],
      dataTypes:['text','text','text','text','date','date','date'],
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
              key: 'abbreviation',
              title:'Abbreviation',
              dataType: 'text'
          },
          {
              key: 'address',
              title:'Address',
              dataType: 'text'
          },
          {
              key: 'membershipDate',
              title:'Membership Date',
              dataType: 'date'
          },
          {
              key: 'terminationDate',
              title:'Termination Date',
              dataType: 'date'
          },
          {
              key: 'inactiveDate',
              title:'Inactive Date',
              dataType: 'date'
          }
      ],
      pageID: '1232141',
      keys:['coNo','name','abbreviation','address','membershipDate','terminationDate','inactiveDate']
  };
  
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
  }

  onRowClick(data){  	
    if(Object.is(this.selected, data)){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

  openModalNotMember(){
    this.passDataCedingCompanyNotMember.tableData = [];

    this.underwritingService.getCedingCompanyList('','','','','','','','','','N').subscribe((data: any) => {
         for(var i=0;i< data.cedingcompany.length;i++){
            this.passDataCedingCompanyNotMember.tableData.push(new CedingCompanyListing(data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[0],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[0],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[0],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
         }
         this.table.refreshTable(); 
     });
  }

  checkCode(code) {
    if(code.trim() === ''){
      this.selectedData.emit({
        coNo: '',
        name: ''
      });
    } else {
      this.underwritingService.getCedingCompanyList(code,'','','','','','','','','N').subscribe(data => {
        if(data['cedingcompany'].length > 0) {
          this.selectedData.emit(new CedingCompanyListing(data['cedingcompany'][0].cedingId,data['cedingcompany'][0].cedingName,data['cedingcompany'][0].cedingAbbr,data['cedingcompany'][0].address,(data['cedingcompany'][0].membershipDate == null ? null : new Date(data['cedingcompany'][0].membershipDate[0],data['cedingcompany'][0].membershipDate[1]-1,data['cedingcompany'][0].membershipDate[2])),(data['cedingcompany'][0].terminationDate == null ? null : new Date(data['cedingcompany'][0].terminationDate[0],data['cedingcompany'][0].terminationDate[1]-1,data['cedingcompany'][0].terminationDate[2])),(data['cedingcompany'][0].inactiveDate == null ? null : new Date(data['cedingcompany'][0].inactiveDate[0],data['cedingcompany'][0].inactiveDate[1]-1,data['cedingcompany'][0].inactiveDate[2]))));
        } else {
          this.selectedData.emit({
            coNo: '',
            name: ''
          });

          $('#cedingCompanyNotMemberMdl > #modalBtn').trigger('click');
        }      
      });
   }
  }

}
