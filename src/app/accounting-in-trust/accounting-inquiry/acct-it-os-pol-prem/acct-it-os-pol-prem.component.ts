import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService, UserService, MaintenanceService } from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as alasql from 'alasql';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-acct-it-os-pol-prem',
  templateUrl: './acct-it-os-pol-prem.component.html',
  styleUrls: ['./acct-it-os-pol-prem.component.css']
})
export class AcctItOsPolPremComponent implements OnInit {

  constructor(private route: Router, private titleService: Title, private ns: NotesService, private as: AccountingService, private userService: UserService, private ms: MaintenanceService) { }

  exc: any[] = [];
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;

	passData:any = {
		tableData: [],
		tHeader: ["Booking Date","Policy No", "Inst No","Co Ref No","Insured","Currency","Premium","Commission", "VAT on Comm.", "Net Due"],
		dataTypes:["date","text","number","text","text","text","currency","currency","currency","currency"],
		keys: ['bookingDate', 'policyNo', 'instNo', 'coRefNo', 'insured','currCd', 'premAmt','commAmt','vatRiComm','amtDue'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true,true,true,true,true],
		widths:[1,166,1,1,'auto',1,150,150,150,150],
	  paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'osPolPrem',
		exportFlag: true
	}

	searchParams:any = {
		cedingId:'',
		from:'',
		to:'',
		cedingName: ''
	}

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | O/S Policy Premiums");
    this.userService.emitModuleId("ACIT067");
  	/*this.queryModal.openNoClose();*/
  	// this.searchOsPolPrem(this.searchParams);
    this.ms.getMtnParameters('V', 'QS_CEDING_ID').subscribe(data => {
      if(data['parameters'].length > 0) {
        this.exc = [data['parameters'][0].paramValueV];
      }
    });
  }

  searchOsPolPrem(params?){
  	this.table.overlayLoader = true;
  	this.as.getAcitOsPolPrem(this.searchParams).subscribe(a=>{
  		this.passData.tableData = a['list'].filter(b=>{
  			b.bookingDate = this.ns.toDateTimeString(b.bookingDate);
  			return true;
  		});
  		this.table.refreshTable();
  	});
  }

  setSelectedCedComp(data){
	  this.searchParams.cedingName = data.cedingName;
	  this.searchParams.cedingId = data.cedingId;
	  this.ns.lovLoader(data.ev, 0);
	}

	showCedCompLOV(){
	  this.cedingCoLOV.modal.openNoClose();
	}

	checkCode(event){
	  this.ns.lovLoader(event, 1);
    this.cedingCoLOV.checkCode(null, event,undefined,this.searchParams.cedingName);
	}

	valChanged(fromVal, toVal) {
    if(toVal !== undefined && toVal !== '' && fromVal !== undefined && fromVal !== '') {
      return new Date(fromVal) > new Date(toVal) ? '' : toVal;
    } else {
      return fromVal === undefined || fromVal === '' ? toVal : '';
    }
  }

  export(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hr = String(today.getHours()).padStart(2,'0');
      var min = String(today.getMinutes()).padStart(2,'0');
      var sec = String(today.getSeconds()).padStart(2,'0');
      var ms = today.getMilliseconds()
      var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
      var filename = 'OSPolPrem'+currDate+'.xls'
      var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");
      var mystyle = {
      	headers:true, 
      	column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(d) {
      		if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
      };

      alasql.fn.isNull = function(n){
        return n==null?'':n;
      };

      alasql('SELECT datetime(bookingDate) AS [Booking Date], isNull(policyNo) AS [Policy No], isNull(instNo) AS [Inst No], isNull(coRefNo) AS [Co Ref No], isNull(currCd) AS [Currency], isNull(insured) AS [Insured], isNull(premAmt) AS [Premium], isNull(commAmt) AS [Commission], isNull(vatRiComm) AS [VAT on Comm.], isNull(amtDue) AS [Net Due]  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.table.displayData]);
  }

  	onTabChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'Exit') {
          this.route.navigateByUrl('');
        } 
    	}
}
