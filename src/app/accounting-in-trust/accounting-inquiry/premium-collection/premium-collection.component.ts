import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService, UserService, MaintenanceService } from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as alasql from 'alasql';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common';

@Component({
  selector: 'app-premium-collection',
  templateUrl: './premium-collection.component.html',
  styleUrls: ['./premium-collection.component.css']
})
export class PremiumCollectionComponent implements OnInit {

  constructor(private route: Router, private titleService: Title, private ns: NotesService, private as: AccountingService, private userService: UserService, private ms: MaintenanceService) { }

  exc: any[] = [];
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;
	@ViewChild("tranModal") tranModal: ModalComponent;
	@ViewChild("tranTable") tranTable: CustEditableNonDatatableComponent;

	passData:any = {
		tableData: [],
		tHeader: ["Policy No", "Inst No","Co Ref No","Insured","Booking Date","Currency","Premium","Commission", "VAT on Comm.", "Net Due","Premium","Commission", "VAT on Comm.", "Net Due","Premium","Commission", "VAT on Comm.", "Net Due"],
		dataTypes:["text","number","text","text","date","text","currency","currency","currency","currency","currency","currency","currency","currency","currency","currency","currency","currency"],
		keys: [ 'policyNo', 'instNo', 'coRefNo', 'insured','bookingDate','currCd','polPremAmt', 'polCommAmt', 'polVatRiComm', 'polAmtDue', 'colPremAmt', 'colCommAmt', 'colVatRiComm', 'colAmtDue', 'osPremAmt', 'osCommAmt', 'osVatRiComm', 'osAmtDue'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
		//widths:[1,166,1,1,'auto',1,150,150,150,150],
	  paginateFlag: true,
		infoFlag: true,
		searchFlag: true,
		pageID: 'premCol',
		exportFlag: true,
		tHeaderWithColspan:[{header:'',span: 6},{header:'Policy Amount',span: 4},{header:'Collection Amount',span: 4},{header:'Outstanding Amount',span: 4}],
		genericBtn: 'View Transaction Details',

    	disableGeneric: true
	}

	passDataTran:any={
			tableData: [],
			tHeader: ["Tran Date", "Tran No","Premium","Commission", "VAT on Comm.", "Net Due"],
			dataTypes:["date","text","currency","currency","currency","currency"],
			keys: [ 'tranDate', 'tranNo', 'premAmt', 'riComm','riCommVat','paytAmt'],
			pageLength: 5,
			uneditable: [true,true,true,true,true,true],
			widths:[1,1,150,150,150,150],
		  paginateFlag: true,
			infoFlag: true,
			searchFlag: true,
			pageID: 'premColTran',
			exportFlag: true,
	}

	searchParams:any = {
		cedingId:'',
		from:'',
		to:'',
		cedingName: ''
	}

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Premium Collection");
    this.userService.emitModuleId("ACIT068");
  	/*this.queryModal.openNoClose();*/
  	// this.searchOsPolPrem(this.searchParams);
    this.ms.getMtnParameters('V', 'QS_CEDING_ID').subscribe(data => {
      if(data['parameters'].length > 0) {
        this.exc = [data['parameters'][0].paramValueV];
      }
    });
  }

  searchPremCol(params?){
  	this.table.overlayLoader = true;
  	this.passData.disableGeneric = true;
  	this.as.getAcitPremCol(this.searchParams).subscribe(a=>{
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
      var filename = 'PremiumCollection'+currDate+'.xls'
      var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");
      var mystyle = {
      	headers:true, 
      	column: {style:{Font:{Bold:"1"}}}
      };
      var cedingId = this.searchParams.cedingId;
      var cedingName = this.searchParams.cedingName;

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

      alasql.fn.cedingId = function(){
      	return cedingId;
      }

      alasql.fn.cedingName = function(){
      	return cedingName;
      }

      alasql('SELECT cedingId() AS [Ceding Id], cedingName() AS [Ceding Name], isNull(policyNo) AS [Policy No], isNull(instNo) AS [Inst No], isNull(coRefNo) AS [Co Ref No], isNull(insured) AS [Insured], datetime(bookingDate) AS [Booking Date], isNull(currCd) AS [Currency], isNull(polPremAmt) AS [Pol Premium], isNull(polCommAmt) AS [Pol Commission], isNull(polVatRiComm) AS [Pol VAT on Comm.], isNull(polAmtDue) AS [Pol Net Due], isNull(colPremAmt) AS [Col Premium], isNull(colCommAmt) AS [Col Commission], isNull(colVatRiComm) AS [Col VAT on Comm.], isNull(colAmtDue) AS [Col Net Due], isNull(osPremAmt) AS [Os Premium], isNull(osCommAmt) AS [Os Commission], isNull(osVatRiComm) AS [Os VAT on Comm.], isNull(osAmtDue) AS [Os Net Due]  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
		  this.route.navigateByUrl('');
		} 
	}

	onRowClick(data){
		this.passData.disableGeneric = data == null || data == '';
	}

	viewTransaction(data){
		this.tranModal.openNoClose();
		this.tranTable.overlayLoader = true;
		this.as.getAcitInwPolPayts(this.table.indvSelect.policyId,null).subscribe(a=>{
			this.passDataTran.tableData = a['list'].filter(b=>{
  			b.tranDate = this.ns.toDateTimeString(b.tranDate);
  			return b.instNo == this.table.indvSelect.instNo;
  		});
  		this.tranTable.refreshTable();
		})
	}

	exportTran(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var hr = String(today.getHours()).padStart(2,'0');
		var min = String(today.getMinutes()).padStart(2,'0');
		var sec = String(today.getSeconds()).padStart(2,'0');
		var ms = today.getMilliseconds()
		var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
		var filename = 'PremiumCollectionTransactions'+currDate+'.xls'
		var months = new Array("Jan", "Feb", "Mar", 
		  "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
		  "Oct", "Nov", "Dec");
		var mystyle = {
			headers:true, 
			column: {style:{Font:{Bold:"1"}}}
		};
		var cedingId = this.searchParams.cedingId;
		var cedingName = this.searchParams.cedingName;

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

		alasql.fn.cedingId = function(){
			return cedingId;
		}

		alasql.fn.cedingName = function(){
			return cedingName;
		}

		alasql('SELECT cedingId() AS [Ceding Id], cedingName() AS [Ceding Name], tranDate AS [Tran Date], tranNo AS [Tran No], premAmt AS [Premium], riComm AS [Commission], riCommVat AS [VAT on Comm.], paytAmt AS [Net Due] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataTran.tableData]);
	}
}
