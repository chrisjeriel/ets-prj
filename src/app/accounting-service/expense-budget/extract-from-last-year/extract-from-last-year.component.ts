import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-extract-from-last-year',
  templateUrl: './extract-from-last-year.component.html',
  styleUrls: ['./extract-from-last-year.component.css']
})
export class ExtractFromLastYearComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

   passData: any = {
    tableData: [],
    tHeader: [
        "Account Code","Account Name", "SL Type", "SL Name", "Total","Jan", "Feb", "Mar",
        "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ],
    dataTypes: [
            "text","text", "text","text", "currency", "currency","currency","currency",
            "currency","currency","currency","currency","currency","currency",
            "currency","currency","currency"
    ],
    total:[null,"TOTAL",null,null,'totalExpense','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
    magnifyingGlass: [],
    options: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    infoFlag: true,
    searchFlag: true,
    pageLength: 15,
    widths: [1,1,50,1,100,50,50,50,50,50,50,50,50,50,50,50,50],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    pagination: true,
    pageStatus: true,
    printBtn: false,
    keys: ['glShortCd','glShortDesc','slTypeName','slName','totalExpense','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
    filters: [
            {
                key: 'glShortCd',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'glShortDesc',
                title: 'Account Name',
                dataType: 'text'
            },
            {
                key: 'jan',
                title: 'Jan',
                dataType: 'text'
            },
            {
                key: 'feb',
                title: 'Feb',
                dataType: 'text'
            },
            {
                key: 'mar',
                title: 'Mar',
                dataType: 'text'
            },
            {
                key: 'apr',
                title: 'Apr',
                dataType: 'text'
            },
            {
                key: 'may',
                title: 'May',
                dataType: 'text'
            },
            {
                key: 'jun',
                title: 'Jun',
                dataType: 'text'
            },
            {
                key: 'jul',
                title: 'Jul',
                dataType: 'text'
            },
            {
                key: 'aug',
                title: 'Aug',
                dataType: 'text'
            },
            {
                key: 'sep',
                title: 'Sep',
                dataType: 'text'
            },
            {
                key: 'oct',
                title: 'Oct',
                dataType: 'text'
            },
            {
                key: 'nov',
                title: 'Nov',
                dataType: 'text'
            },
            {
                key: 'dec',
                title: 'Dec',
                dataType: 'text'
            },
        ],
  };

  savedData: any[] = [];
  yearArray: number[] = [];
  selectedYear: number = new Date().getFullYear();
  cancelFlag: boolean = false;
  dialogIcon: string = '';
  dialogMessage: string = '';

  createUpdate: any = {
    createUser: null,
    createDate: null,
    updateUser: null,
    updateDate: null
  };

  constructor(private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.generateYears();
    //this.retrieveAcseActExpMonthly(this.selectedYear);
  }

  generateYears(){
    //need to talk about this method. It basically generates years starting from 2000 up to current year.
    var startYear: number = 2000;
    var currYear: number = new Date().getFullYear();
    while(startYear <= currYear){
      this.yearArray.push(currYear);
      currYear -= 1;
    }
  }

  retrieveAcseActExpMonthly(year: number, fromNgModelChange?: boolean){
    if(fromNgModelChange){
      this.table.overlayLoader = true;
    }
    this.selectedYear = year;
    this.as.getAcseActExpMonthly(year).subscribe(
      (data:any)=>{
        if(data.budExpMonthlyList.length !== 0){
          this.passData.tableData = data.budExpMonthlyList;
          //this.passData.tableData.changes = []; //this is where I will store the changes that the user has made. To be used in saving later.
        }else{
          this.passData.tableData = [];
        }
        this.table.refreshTable();
        this.table.overlayLoader = false;
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  onRowClick(data){
   if(data == null){
     this.createUpdate = {
       createUser: null,
       createDate: null,
       updateUser: null,
       updateDate: null
     };
   }else{
     this.createUpdate.createUser = data.createUser;
     this.createUpdate.createDate = this.ns.toDateTimeString(data.createDate);
     this.createUpdate.updateUser = data.updateUser;
     this.createUpdate.updateDate = this.ns.toDateTimeString(data.updateDate);
   }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  onClickExtract(){
    this.retrieveAcseActExpMonthly(this.selectedYear, true);
  }

  onClickPrint(){
    this.export();
  }

  export(){
          //do something
      /*var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hr = String(today.getHours()).padStart(2,'0');
      var min = String(today.getMinutes()).padStart(2,'0');
      var sec = String(today.getSeconds()).padStart(2,'0');
      var ms = today.getMilliseconds()
      var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;*/
      var filename = this.selectedYear + 'ActualExpenseByMonth.xlsx'
      var mystyle = {
          headers:false, 
          column: {style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
          rows: {0:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}
                 }
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
      var totalExpense: number = 0;
      var monthlyBudget: any = {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 0,
        dec: 0
      }
      alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2, row8 VARCHAR2, row9 VARCHAR2, row10 VARCHAR2, row11 VARCHAR2, row12 VARCHAR2, row13 VARCHAR2, row14 VARCHAR2, row15 VARCHAR2, row16 VARCHAR2, row17 VARCHAR2)');
      alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Total', 'January','February','March','April','May','June','July','August','September','October','November','December']);
      for(var i of this.passData.tableData){
        totalExpense += i.totalExpense;
        monthlyBudget.jan += i.jan;
        monthlyBudget.feb += i.feb;
        monthlyBudget.mar += i.mar;
        monthlyBudget.apr += i.apr;
        monthlyBudget.may += i.may;
        monthlyBudget.jun += i.jun;
        monthlyBudget.jul += i.jul;
        monthlyBudget.aug += i.aug;
        monthlyBudget.sep += i.sep;
        monthlyBudget.oct += i.oct;
        monthlyBudget.nov += i.nov;
        monthlyBudget.dec += i.dec;
        alasql('INSERT INTO sample VALUES(?,?,?,?,currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?))', [i.glShortCd, i.glShortDesc, i.slTypeName == null ? '' : i.slTypeName, i.slName == null ? '' : i.slName, i.totalExpense, i.jan, i.feb, i.mar, i.apr, i.may, i.jun, i.jul, i.aug, i.sep, i.oct, i.nov, i.dec]);
      }
      alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '','','','','','','','','','','','',]);
      alasql('INSERT INTO sample VALUES(?,?,?,?,currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?))', ['', '', 'TOTAL', '', totalExpense, monthlyBudget.jan, monthlyBudget.feb, monthlyBudget.mar, monthlyBudget.apr, monthlyBudget.may, monthlyBudget.jun, monthlyBudget.jul, monthlyBudget.aug, monthlyBudget.sep, monthlyBudget.oct, monthlyBudget.nov, monthlyBudget.dec]);
      alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16, row17 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
      alasql('DROP TABLE sample');  
    }

  //VALIDATIONS STARTS HERE
  exceedTotalBudget(): boolean{
    for(var i of this.passData.tableData){
      console.log(i.totalBudget);
      console.log(i.jan+i.feb+i.mar+i.apr+i.may+i.jun+i.jul+i.aug+i.sep+i.oct+i.nov+i.dec);
      if(i.totalBudget < i.jan+i.feb+i.mar+i.apr+i.may+i.jun+i.jul+i.aug+i.sep+i.oct+i.nov+i.dec){
        return true;
      }
    }
    return false;
  }

}