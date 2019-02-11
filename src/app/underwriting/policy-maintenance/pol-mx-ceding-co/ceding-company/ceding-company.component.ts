import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { CedingCompanyList } from '@app/_models';
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
  selected: any;
  passDataCedingCompany: any = {
        tableData : [],
        tHeader: ['Active','Govt','Member','Co No','Name','Abbreviation','Address','Membership Date','Termination Date','Inactive Date'],
        dataTypes:['checkbox','checkbox','checkbox','sequence-3','text','text','text','date','date','date'],
        addFlag: true,
        editFlag: true,
        pagination: true,
        pageStatus: true,
        searchFlag: true,
        pageLength: 10,
        resizable: [false,false,false,false,true,false,true,false,false,false],
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
        pageID: 6,
        keys:['active','govt','member','coNo','name','abbreviation','address','membershipDate','terminationDate','inactiveDate']
    };
    
  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal ) { }

  ngOnInit() {
  	this.underwritingService.getCedingCompanyList().subscribe((data: any) => {
                for(var i=0;i< data.cedingcompany.length;i++){
                    this.passDataCedingCompany.tableData.push(new CedingCompanyList(data.cedingcompany[0].activeTag,data.cedingcompany[0].govtTag,data.cedingcompany[0].membershipTag,data.cedingcompany[0].cedingId,data.cedingcompany[0].cedingName,data.cedingcompany[0].cedingAbbr,data.cedingcompany[0].address,(data.cedingcompany[0].membershipDate == null ? null : new Date(data.cedingcompany[0].membershipDate[0],data.cedingcompany[0].membershipDate[1]-1,data.cedingcompany[0].membershipDate[2])),(data.cedingcompany[0].terminationDate == null ? null : new Date(data.cedingcompany[0].terminationDate[0],data.cedingcompany[0].terminationDate[1]-1,data.cedingcompany[0].terminationDate[2])),(data.cedingcompany[0].inactiveDate == null ? null : new Date(data.cedingcompany[0].inactiveDate[0],data.cedingcompany[0].inactiveDate[1]-1,data.cedingcompany[0].inactiveDate[2]))));
                }
				this.table.refreshTable();          
    });
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

}
