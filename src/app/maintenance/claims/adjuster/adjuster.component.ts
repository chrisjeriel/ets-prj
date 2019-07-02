import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NotesService,  UnderwritingService, MaintenanceService } from '@app/_services';
import {  NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-adjuster',
  templateUrl: './adjuster.component.html',
  styleUrls: ['./adjuster.component.css']
})
export class AdjusterComponent implements OnInit {

@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

  selected: any;

  searchParams: any[] = [];

  mtnAdjusterListData: any = {
      tableData: [],
      tHeader: ['Adj No.', 'Name', 'Adj Ref No', 'Address', 'Active', 'Company Contact No', 'Company Email Address'],
      dataTypes: ['sequence-3', 'text', 'text', 'text', 'checkbox', 'text', 'text'],
      tableOnly: false,
      addFlag: true,
      editFlag: true,
      exportFlag: true,
      pageStatus: true,
      pagination: true,
      pageLength: 15,
      keys: ['adjId','adjName','adjRefNo','fullAddress','activeTag','contactNo', 'emailAdd'],
      filters: [
          {
              key: 'adjName',
              title: 'Name',
              dataType: 'text'
          },
          {
              key: 'adjRefNo',
              title: 'Adj. Ref. No.',
              dataType: 'text'
          },
          {
              key: 'fullAddress',
              title: 'Address',
              dataType: 'text'
          },
          {
              key: 'zipCd',
              title: 'Zip Code',
              dataType: 'text'
          },
          {
              key: 'contactNo',
              title: 'Contact No.',
              dataType: 'text'
          },
          {
              key: 'emailAdd',
              title: 'Email Address',
              dataType: 'text'
          },
          {
              key: 'createUser',
              title: 'Created By',
              dataType: 'text'
          },
          {
              keys: {
                  from: 'createDateFrom',
                  to: 'createDateTo'
              },
              title: 'Date Created',
              dataType: 'datespan'
          },
          {
              key: 'updateUser',
              title: 'Last Update By',
              dataType: 'text'
          },
          {
              keys: {
                  from: 'updateDateFrom',
                  to: 'updateDateTo'
              },
              title: 'Last Update',
              dataType: 'datespan'
          }
      ]
  }

  constructor(private titleService: Title, private underwritingService: UnderwritingService, 
                private maintenanceService: MaintenanceService, private router: Router, private ns: NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Ceding Company List');
  	this.retrieveMtnAdjustList();
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('/maintenance-clm');
      }
    }

  retrieveMtnAdjustList(){
  	this.maintenanceService.getMtnAdjusterList(this.searchParams).subscribe((data: any)=>{
  		/*for(var i of data.cedingCompany){
  			this.mtnAdjusterListData.tableData.push(i);
  		}*/
  		this.mtnAdjusterListData.tableData = data.adjusterList;
  		this.table.refreshTable();
  	});
  }

    onClickAdd(event){
        this.router.navigate(['/adjuster-form', { info: 'new'}], {skipLocationChange: true});
    }
    
    onClickEdit(event){
        this.router.navigate(['/adjuster-form',this.selected], {skipLocationChange: true});
    }

    onRowClick(data){
      console.log(data);
        this.selected = data;
    }

    onRowDblClick(data){
       this.selected = data;
       this.router.navigate(['/adjuster-form',this.selected], {skipLocationChange: true});
    }

    //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.mtnAdjusterListData.tableData = [];
        this.retrieveMtnAdjustList();
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
    var filename = 'MtnAdjusterList_'+currDate+'.xlsx'
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
    for(var i of this.mtnAdjusterListData.tableData){
        /*i.membershipDate = i.membershipDate === null ? '' : i.membershipDate;
        i.terminationDate = i.terminationDate === null ? '' : i.terminationDate;
        i.inactiveDate = i.inactiveDate === null ? '' : i.inactiveDate;
        i.activeTag = i.activeTag === null ? '' : i.activeTag;
        i.membershipTag = i.membershipTag === null ? '' : i.membershipTag;
        i.govtTag = i.govtTag === null ? '' : i.govtTag;*/
        importData.push(i);
    }

    alasql('SELECT adjId AS AdjNo, adjName AS Name, adjRefNo AS ReferenceNo, fullAddress AS Address, activeTag AS Active, '+
           'contactNo AS CompanyContactNo, emailAdd AS CompanyEmailAddress '+
           'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,importData]);
  }

}
