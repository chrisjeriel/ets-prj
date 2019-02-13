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
                    this.passDataCedingCompany.tableData.push(new CedingCompanyList(data.cedingcompany[i].activeTag,data.cedingcompany[i].govtTag,data.cedingcompany[i].membershipTag,data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[i],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[i],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[i],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
                }
				this.table.refreshTable();          
    });
  }

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

}
