import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CedingCompanyList, CedingCompany } from '../../../_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pol-mx-ceding-co',
    templateUrl: './pol-mx-ceding-co.component.html',
    styleUrls: ['./pol-mx-ceding-co.component.css']
})
export class PolMxCedingCoComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
    addEdit: boolean = false;
    cedingCompanyListData: any;

    record: any = {
      companyNo : null,
      activeTag : null,
      name : null,
      abbreviation : null,
      oldCompanyNo : null,
      address : null,
      zipCode : null,
    }

    passData: any = {
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
        pageID: 1,
        keys:['active','govt','member','coNo','name','abbreviation','address','membershipDate','terminationDate','inactiveDate']
    };
    
    cedingCompanyData: any;
    passDataAddEdit: any = {
        tableData:[/*
            [true,'Mr.','Henry','I','Tiu','Engg Head','Engineering Insurance','09178348984',null],
            [false,'Ms.','Rose','O','Lim','Acct Head','Accounting','09112233456',null]*/
        ],
        tHeader: ['Default','Designation','First Name','M.I.','Last Name','Position','Department','Contact No','E-Signature'],
        dataTypes:['checkbox','text','text','text','text','text','text','text','text'],
        addFlag: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: ['1','1','1','1','1','auto','auto','auto','1'],
        pageID: 2,
        keys:['defaultParam' ,'designation' ,'firstName' ,'mI' ,'lastName' ,'position' ,'department' ,'contactNo' ,'eSignature' ]
    }


    constructor(private underwritingService: UnderwritingService, private router: Router) { }

    ngOnInit() {

        this.underwritingService.getCedingCompanyList('','','','','','','','','','').subscribe((data: any) => {
            for (var i = 0; i <  data.cedingcompany.length ; i++) {
                 this.passData.tableData.push(new CedingCompanyList(data.cedingcompany[i].activeTag,data.cedingcompany[i].govtTag,data.cedingcompany[i].membershipTag,data.cedingcompany[i].cedingId,data.cedingcompany[i].cedingName,data.cedingcompany[i].cedingAbbr,data.cedingcompany[i].address,(data.cedingcompany[i].membershipDate == null ? null : new Date(data.cedingcompany[i].membershipDate[0],data.cedingcompany[i].membershipDate[1]-1,data.cedingcompany[i].membershipDate[2])),(data.cedingcompany[i].terminationDate == null ? null : new Date(data.cedingcompany[i].terminationDate[0],data.cedingcompany[i].terminationDate[1]-1,data.cedingcompany[i].terminationDate[2])),(data.cedingcompany[i].inactiveDate == null ? null : new Date(data.cedingcompany[i].inactiveDate[0],data.cedingcompany[i].inactiveDate[1]-1,data.cedingcompany[i].inactiveDate[2]))));
            }
            this.table.refreshTable();
        });

        this.underwritingService.getCedingCompany().subscribe((data:any) => {
            for (var i = 0; i < data.cedingCompany.length; i++) {
                this.passDataAddEdit.tableData.push(new CedingCompany( data.cedingCompany[i].cedingRepresentative.defaultTag,  data.cedingCompany[i].cedingRepresentative.designation, data.cedingCompany[i].cedingRepresentative.firstName, data.cedingCompany[i].cedingRepresentative.middleInitial, data.cedingCompany[i].cedingRepresentative.lastName, data.cedingCompany[i].cedingRepresentative.position, data.cedingCompany[i].cedingRepresentative.department, data.cedingCompany[i].cedingRepresentative.contactNo, data.cedingCompany[i].cedingRepresentative.eSignature));

            }
            this.table.refreshTable();
        });
    }

    

    toAddEdit() {
        this.addEdit = true;
    }

    toGenerateCedingEdit(event){
      var selectedRow = event.target.closest('tr').children;

      
      this.record = {
        companyNo: selectedRow[3].innerText,
        name: selectedRow[4].innerText,
        abbreviation: selectedRow[5].innerText,
        address: selectedRow[6].innerText
      }
          this.addEdit = true;
      /*this.router.navigate(['/maintenance-ceding-co', { slctd: JSON.stringify(this.record), action: 'edit' }], { skipLocationChange: true });
  */
    }
}
  

