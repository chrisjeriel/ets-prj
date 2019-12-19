import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-by-month',
  templateUrl: './by-month.component.html',
  styleUrls: ['./by-month.component.css']
})
export class ByMonthComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('myForm') form: NgForm;

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
    total:[null,"TOTAL",null,null,'totalBudget','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
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
    uneditable: [true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false],
    pagination: true,
    pageStatus: true,
    printBtn: false,
    keys: ['glShortCd','glShortDesc','slTypeName','slName','totalBudget','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
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
  	this.retrieveAcseBudExpMonthly(this.selectedYear);
  }

  generateYears(){
    //need to talk about this method. It basically generates years starting from 2000 up to current year.
    var startYear: number = 2000;
    var currYear: number = new Date().getFullYear()+10;
    while(startYear <= currYear){
      this.yearArray.push(currYear);
      currYear -= 1;
    }
    this.yearArray.sort((a,b) => b-a);
    this.selectedYear = this.yearArray[0];
  }

  retrieveAcseBudExpMonthly(year: number, fromNgModelChange?: boolean){
    if(fromNgModelChange){
      this.table.overlayLoader = true;
    }
    this.selectedYear = year;
    this.as.getAcseBudExpMonthly(year).subscribe(
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


  //Programmer's Note: If anyone of you reading this, please help me optimize this function.
  //Basically, what it does is that it pushes all the edited fields on the table for saving.
  //The first condition is if the array for saving is empty, simply push
  //The second condition is if the user is editing his last edit again, simply update the budget amount on the savedData array instead of pushing the same object
  //The third condition is basically the same as the first condition
  //All of this conditions are applied on the 12 months (the one on the switch case) so it's kinda using a lot of lines.
  //As you can see, I just forced this implementation. If you have any ideas on how to optimize this, please don't hesitate to try it. -Neco
  onTableDataChange(data){
    console.log(data);
    switch(data.key){
      case 'jan':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.jan,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 1, //1 for January
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'1')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'1')].budgetAmt = data.lastEditedRow.jan;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.jan,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 1, //1 for January
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'feb':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.feb,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 2, //2 for February
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'2')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'2')].budgetAmt = data.lastEditedRow.feb;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.feb,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 2, //2 for February
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'mar':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.mar,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 3, //3 for March
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'3')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'3')].budgetAmt = data.lastEditedRow.mar;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.mar,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 3, //3 for March
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'apr':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.apr,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 4, //4 for April
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'4')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'4')].budgetAmt = data.lastEditedRow.apr;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.apr,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 4, //4 for April
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'may':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.may,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 5, //5 for May
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'5')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'5')].budgetAmt = data.lastEditedRow.may;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.may,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 5, //5 for May
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'jun':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.jun,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 6, //6 for June
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'6')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'6')].budgetAmt = data.lastEditedRow.jun;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.jun,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 6, //6 for June
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'jul':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.jul,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 7, //7 for July
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'7')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'7')].budgetAmt = data.lastEditedRow.jul;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.jul,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 7, //7 for July
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'aug':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.aug,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 8, //8 for August
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'8')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'8')].budgetAmt = data.lastEditedRow.aug;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.aug,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 8, //8 for August
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'sep':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.sep,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 9, //9 for September
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'9')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'9')].budgetAmt = data.lastEditedRow.sep;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.sep,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 9, //9 for September
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'oct':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.oct,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 10, //10 for October
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'10')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'10')].budgetAmt = data.lastEditedRow.oct;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.oct,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 10, //10 for October
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'nov':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.nov,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 11, //1 for November
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'11')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'11')].budgetAmt = data.lastEditedRow.nov;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.nov,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 11, //1 for November
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      case 'dec':
        if(this.savedData.length == 0){
          this.savedData.push({
            budgetYear: data.lastEditedRow.budgetYear,
            budgetAmt: data.lastEditedRow.dec,
            createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
            createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
            updateUser: this.ns.getCurrentUser(),
            updateDate: this.ns.toDateTimeString(0),
            expenseAmt: 0, //placeholder,
            glAcctId: data.lastEditedRow.glAcctId,
            itemNo: data.lastEditedRow.itemNo,
            mm: 12, //12 for December
            slCd: data.lastEditedRow.slCd,
            slTypeCd: data.lastEditedRow.slTypeCd
          });
        }else{
          if(this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).includes(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'12')){
            this.savedData[this.savedData.map(a=>{return String(a.budgetYear).toString()+String(a.itemNo).toString()+String(a.glAcctId).toString()+String(a.mm).toString()}).indexOf(String(data.lastEditedRow.budgetYear).toString()+String(data.lastEditedRow.itemNo).toString()+String(data.lastEditedRow.glAcctId).toString()+'12')].budgetAmt = data.lastEditedRow.dec;
          }else{
            this.savedData.push({
              budgetYear: data.lastEditedRow.budgetYear,
              budgetAmt: data.lastEditedRow.dec,
              createUser: data.lastEditedRow.createUser == null ? this.ns.getCurrentUser() : data.lastEditedRow.createUser,
              createDate: data.lastEditedRow.createDate == null ? this.ns.toDateTimeString(0) : this.ns.toDateTimeString(data.lastEditedRow.createDate),
              updateUser: this.ns.getCurrentUser(),
              updateDate: this.ns.toDateTimeString(0),
              expenseAmt: 0, //placeholder,
              glAcctId: data.lastEditedRow.glAcctId,
              itemNo: data.lastEditedRow.itemNo,
              mm: 12, //12 for December
              slCd: data.lastEditedRow.slCd,
              slTypeCd: data.lastEditedRow.slTypeCd
            });
          }
        }
        break;
      default:
        console.log('nothing');
    }
    console.log(this.savedData);
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  onClickSave(){
    if(this.exceedTotalBudget()){
      this.dialogIcon = 'error-message';
      this.dialogMessage = 'Cannot save. The total of Monthly Budgets is not equal to its Yearly Budget.';
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  onClickPrint(){
    this.export();
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    
    let finalParam: any = {
      saveBudExpMonthly: this.savedData
    }
    console.log(finalParam);

    this.as.saveAcseBudExpMonthly(finalParam).subscribe(
      (data:any)=>{
        if(data.returnCode == 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          console.log(this.selectedYear);
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveAcseBudExpMonthly(this.selectedYear, true);
          this.table.markAsPristine();
          this.savedData = [];
        }
      }
    );
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
      var filename = this.selectedYear + 'BudgetByMonth.xls'
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
      var totalBudget: number = 0;
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
        totalBudget += i.totalBudget;
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
        alasql('INSERT INTO sample VALUES(?,?,?,?,currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?))', [i.glShortCd, i.glShortDesc, i.slTypeName == null ? '' : i.slTypeName, i.slName == null ? '' : i.slName, i.totalBudget, i.jan, i.feb, i.mar, i.apr, i.may, i.jun, i.jul, i.aug, i.sep, i.oct, i.nov, i.dec]);
      }
      alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '','','','','','','','','','','','',]);
      alasql('INSERT INTO sample VALUES(?,?,?,?,currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?),currency(?))', ['', '', 'TOTAL', '', totalBudget, monthlyBudget.jan, monthlyBudget.feb, monthlyBudget.mar, monthlyBudget.apr, monthlyBudget.may, monthlyBudget.jun, monthlyBudget.jul, monthlyBudget.aug, monthlyBudget.sep, monthlyBudget.oct, monthlyBudget.nov, monthlyBudget.dec]);
      alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16, row17 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
      alasql('DROP TABLE sample');  
    }

  //VALIDATIONS STARTS HERE
  exceedTotalBudget(): boolean{
    for(var i of this.passData.tableData){
      console.log(i.totalBudget);
      console.log(i.jan+i.feb+i.mar+i.apr+i.may+i.jun+i.jul+i.aug+i.sep+i.oct+i.nov+i.dec);
      if(i.totalBudget != i.jan+i.feb+i.mar+i.apr+i.may+i.jun+i.jul+i.aug+i.sep+i.oct+i.nov+i.dec){
        return true;
      }
    }
    return false;
  }
}
