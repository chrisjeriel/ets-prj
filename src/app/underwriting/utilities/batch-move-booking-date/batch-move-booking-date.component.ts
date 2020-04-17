import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService} from '@app/_services';
import { CustNonDatatableComponent, SucessDialogComponent } from '@app/_components/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-move-booking-date',
  templateUrl: './batch-move-booking-date.component.html',
  styleUrls: ['./batch-move-booking-date.component.css']
})
export class BatchMoveBookingDateComponent implements OnInit {

  constructor(private underwritingService: UnderwritingService, private ns: NotesService, private router: Router) { }

  passData: any = {
        tableData: [],
        tHeader: ['Policy No.', 'Inst. No.', 'Booking Date', 'Distribution Status','With Installment','Type of Cession', 'Created By', 'Sum Insured', 'Premium','Insured'],
        dataTypes: ['text','number','date','text','checkbox','text','text','currency','currency','text'],
        keys: ['policyNo','instNo','bookingDate','distStatus','withInst','cessionDesc',
            'createUser','totalSi','totalPrem','insuredDesc',],
        filters: [
            {
                key: 'policyNo',
                title: 'Policy No.',
                dataType: 'text'
            },
            {
                key: 'instNo',
                title: 'Inst No.',
                dataType: 'text'
            },
            {
                key: 'cessionDesc',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'createdBy',
                title: 'Created By',
                dataType: 'text'
            },
            {
               keys: {
                    from: 'totalSiFrom',
                    to: 'totalSiTo'
                },
                title: 'Sum Insured',
                dataType: 'textspan'
            },
            {
                keys: {
                    from: 'totalPremFrom',
                    to: 'totalPremTo'
                },
                title: 'Premium',
                dataType: 'textspan'
            },
            {
                key: 'insuredDesc',
                title: 'Insured',
                dataType: 'text'
            },

        ],
        pageLength: 15,
        checkFlag: true, 
        tableOnly: false, 
        fixedCol: false, 
        printBtn: false, 
        pagination: true, 
        pageStatus: true,
        colSize: [],
        exportFlag:true
    }

    searchParams:any = {
    	distStatus : 'U'
    }

    bookingDates:any = {
      newBookingDate : '',
      minDate: ''
    }


    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
    @ViewChild(SucessDialogComponent) diag: SucessDialogComponent;
    dialogIcon: String = '';

  ngOnInit() {
  	this.getPolicyListing();
  }

  getValidBookingMth(){
    this.underwritingService.getValidBookingDate({date1:this.ns.toDateTimeString(0)}).subscribe((a:any)=>{
      this.bookingDates.newBookingDate = this.ns.toDateTimeString(a.dates.suggestedDate).split('T')[0];
      this.bookingDates.minDate = this.ns.toDateTimeString(a.dates.minDate).split('T')[0];
    });
  }


  getPolicyListing(params?:any[]){
    if(this.table){
      this.table.overlayLoader = true;
  	}
    if(params){
  		for(let param of params){
  			this.searchParams[param.key] = param.search;
  		}
  	}
  	this.underwritingService.getMoveBookingList(this.searchParams).subscribe(a=>{
  		this.passData.tableData = a['list'];
  		this.table.refreshTable();
  	})

    this.getValidBookingMth();
  }


  save(){
    if(this.table){
      this.table.overlayLoader = true;
    }
    let params:any = {
      list: this.passData.tableData.filter(a=>a.checked),
      bookingDate: this.bookingDates.newBookingDate.split('T')[0],
      updateUser: this.ns.getCurrentUser()
    }
    this.underwritingService.batchUpdateBookingDate(params).subscribe((data:any)=>{
      if(data.returnCode === 0){
         this.dialogIcon = "error";
       }else{
         this.dialogIcon = "";
         this.getPolicyListing();
       }
       this.diag.open();
    })
  }

  onCLickCancel(){
    this.router.navigate(['/']);
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
    var filename = 'PolicyInquiry_'+currDate+'.xls'
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
            num = num == 'NaN' ?'' : num;
            return num
      };



         alasql('SELECT policyNo AS [Policy No.], instNo AS [Inst. No.], datetime(bookingDate) AS [Booking Date], distStatus AS [Distribution Status], withInst AS [With Installment], cessionDesc AS [Type of Cession], createUser AS [Created By], currency(totalSi) AS [Sum Insured], currency(totalPrem) AS [Premium], insuredDesc AS [Insured]   INTO XLSXML("'+filename+'",?) FROM ?',
           [mystyle,this.table.displayData.filter(a=>a!= this.table.fillData)]);

     
  }

}
