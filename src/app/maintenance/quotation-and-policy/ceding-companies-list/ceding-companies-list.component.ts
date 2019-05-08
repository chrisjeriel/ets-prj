import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NotesService,  UnderwritingService, MaintenanceService } from '@app/_services';
import {  NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ceding-companies-list',
  templateUrl: './ceding-companies-list.component.html',
  styleUrls: ['./ceding-companies-list.component.css']
})
export class CedingCompaniesListComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

  selected: any;

  searchParams: any[] = [];

  maintenanceCedingCoListData: any = {
      tableData: [],
      tHeader: ['Co No.', 'Name', 'Abbreviation', 'Address', 'Active', 'Govt.', 'Member', 'Membership Date', 'Termination Date', 'Inactive Date'],
      dataTypes: ['sequence-3', 'text', 'text', 'text', 'checkbox', 'checkbox', 'checkbox', 'date', 'date', 'date'],
      resizable: [false, false, true, false, true, true, true, true, true, true],
      tableOnly: false,
      addFlag: true,
      editFlag: true,
      exportFlag: true,
      pageStatus: true,
      pagination: true,
      pageLength: 15,
      keys: ['cedingId','cedingName','cedingAbbr','address','activeTag','govtTag','membershipTag','membershipDate','terminationDate','inactiveDate'],
      filters: [
          {
              key: 'cedingId',
              title: 'Co No.',
              dataType: 'text'
          },
          {
              key: 'cedingName',
              title: 'Name',
              dataType: 'text'
          },
          {
              key: 'cedingAbbr',
              title: 'Abbreviation',
              dataType: 'text'
          },
          {
              key: 'address',
              title: 'Address',
              dataType: 'text'
          },
          {
              key: 'membershipDate',
              title: 'Membership Date',
              dataType: 'date'
          },
          {
              key: 'terminationDate',
              title: 'Termination Date',
              dataType: 'date'
          },
          {
              key: 'inactiveDate',
              title: 'Inactive Date',
              dataType: 'date'
          }
      ]
  }

  constructor(private titleService: Title, private underwritingService: UnderwritingService, 
                private maintenanceService: MaintenanceService, private router: Router, private ns: NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Ceding Company List');
  	this.retrieveMtnCedCoListMethod();
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

  retrieveMtnCedCoListMethod(){
  	this.maintenanceService.getCedingCompanyList(this.searchParams).subscribe((data: any)=>{
  		console.log(data);
  		/*for(var i of data.cedingCompany){
  			this.maintenanceCedingCoListData.tableData.push(i);
  		}*/
  		this.maintenanceCedingCoListData.tableData = data.cedingcompany;
  		this.table.refreshTable();
  	});
  }

    onClickAdd(event){
        this.router.navigate(['/ceding-co-form', { info: 'new'}], {skipLocationChange: true});
    }
    
    onClickEdit(event){
        this.selected = event;
        this.router.navigate(['/ceding-co-form',this.selected], {skipLocationChange: true});
    }

    onRowClick(data){
    	console.log(data);
        this.selected = data;
    }

    onRowDblClick(data){
       this.selected = data;
       this.router.navigate(['/ceding-co-form',this.selected], {skipLocationChange: true});
    }

    //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.maintenanceCedingCoListData.tableData = [];
        this.retrieveMtnCedCoListMethod();
    }

    export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'MtnCedingCoList_'+currDate+'.xlsx'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            return num
      };

    var importData: any[] = [];
    for(var i of this.maintenanceCedingCoListData.tableData){
        i.membershipDate = i.membershipDate === null ? '' : i.membershipDate;
        i.terminationDate = i.terminationDate === null ? '' : i.terminationDate;
        i.inactiveDate = i.inactiveDate === null ? '' : i.inactiveDate;
        i.activeTag = i.activeTag === null ? '' : i.activeTag;
        i.membershipTag = i.membershipTag === null ? '' : i.membershipTag;
        i.govtTag = i.govtTag === null ? '' : i.govtTag;
        importData.push(i);
    }

    alasql('SELECT cedingId AS CoNo, cedingName AS Name, cedingAbbr AS Abbreviation, address AS Address, activeTag AS Active, '+
           'govtTag AS Govt, membershipTag AS Member, membershipDate AS MemberShipDate, terminationDate AS TerminationDate, inactiveDate AS InactiveDate '+
           'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,importData]);
  }

}
