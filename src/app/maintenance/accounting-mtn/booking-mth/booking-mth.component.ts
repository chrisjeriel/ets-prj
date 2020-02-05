import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '@app/_components/common/modal/modal.component';


@Component({
  selector: 'app-booking-mth',
  templateUrl: './booking-mth.component.html',
  styleUrls: ['./booking-mth.component.css']
})
export class BookingMthComponent implements OnInit {

  @ViewChild('bookingtable') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('genBookingMthModal') genBookingMthModal: ModalComponent;


  dialogIcon:string = '';
  dialogMessage: string = '';
  bookingYr: string = '';
  info:any = {
  	createUser : '',
  	createDate : '',
  	updateUser : '',
  	updateDate : '',
  }

  passTable:any={
  	tableData:[],
  	widths:[1,1,1,1,1],
  	tHeader:['Booking Month','Booking Year','Booked','Temp Closed','Remarks'],
  	dataTypes:['text','text','checkbox','checkbox','text'],
  	uneditable:[true,true,true,false,false],
  	keys:['bookingMmName','bookingYear','bookedTag','tempClosedTag','remarks'],
  	addFlag: false,
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 12,
  }
  cancelFlag:boolean;
  boolGenBooking: boolean;
  bookingItems  : any = { 
  	  year		: null,
  	  createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
  }

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Booking Month');
  	this.getBookingMth();
  	console.log(this.ns.toDateTimeString(0));
  }

  getBookingMth(){
  	this.ms.getMtnBookingMonth('','').subscribe(a=>{
      console.log(a);
  		this.passTable.tableData = a['bookingMonthList'];
  		this.passTable.tableData.forEach(a=>{
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.table.refreshTable();
  		this.table.overlayLoader = false;
  	})
  }

  onTableClick(data){
  	console.log(data);
  	this.info = data;
    console.log(data);
  }

  genBooking(){
  	this.genBookingMthModal.openNoClose();
  }

  onClickSave(){
  	this.conSave.confirmModal();
  }

  generateBookingMth(){
  	if (this.isEmptyObject(this.bookingYr)){
		this.dialogIcon = "error-message";
		this.dialogMessage = "Please input booking year";
        this.successDialog.open();
  	}else {
  	    this.validateBookingYr(this.bookingYr);
  	}
 }
  

 validateBookingYr(bookingYr){
  	this.ms.getMtnBookingMonth('',bookingYr).pipe(
           finalize(() => this.generate())
           ).subscribe(a=>{
  		 if (a['bookingMonthList'].length === 0){
  		 	this.boolGenBooking = false;
  		} else {
  			this.boolGenBooking = true;
  		}
  	})
  }

  generate(){
  	if (this.boolGenBooking){
  		this.dialogIcon = "error-message";
		this.dialogMessage = "Unable to generate Booking Months. The entered Booking Year has an existing Booking Months setup already.";
        this.successDialog.open();
  	}else {
  		this.bookingItems.year = this.bookingYr;

  		this.ms.generateBookingMth(this.bookingItems).subscribe(a=>{
  			if (a ['returnCode'] == -1){
	  			this.dialogIcon = "success";
	 			this.successDialog.open();
	 			this.table.overlayLoader = true;
	 			this.getBookingMth();
            }else{
                this.dialogIcon = "error-message";
				this.dialogMessage = "Unable to generate booking months. An error occured.";
        		this.successDialog.open();
            }
  		});
  	}	
  }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
  }
  
  save(){
  	let params: any = {
  		saveBookingMth:[]
  	}
  	params.saveBookingMth = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveBookingMth.forEach(a=>{
  		a.updateUser = this.ns.getCurrentUser();
  		a.updateDate = this.ns.toDateTimeString(0)
  	});
    console.log(params);
  	this.ms.saveMtnBookingMth(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.form.control.markAsPristine();
            this.dialogIcon = "success";
            this.successDialog.open();
            this.table.overlayLoader = true;
            this.getBookingMth();
            $('.ng-dirty').removeClass('ng-dirty');
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSaveCancel(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    console.log(this.cancelFlag);
    if(this.cancelFlag){
       this.save();
    } else {
      this.save();
    }
  }


}
