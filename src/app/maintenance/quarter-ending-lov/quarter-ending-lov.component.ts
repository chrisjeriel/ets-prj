import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MaintenanceService, AccountingService } from '@app/_services';


@Component({
  selector: 'app-quarter-ending-lov',
  templateUrl: './quarter-ending-lov.component.html',
  styleUrls: ['./quarter-ending-lov.component.css']
})
export class QuarterEndingLovComponent implements OnInit {
  
  @ViewChild('modal') modal: ModalComponent; 
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Input() tranClass;
  @Input() cedingId;
  @Input() quarterDates: string[];

  constructor(private maintenanceService: MaintenanceService, private accService: AccountingService) { }

  quarters: any[] = [];
  year:any;

  yearObj:any = {
    label:'',
    value:''
  };
  quarterOptions : any = [];
  yearOptions:any=[];
  quarter:any;
  quarterYear:any;
  quarterval:any;
  quarterEnd:any;

  dialogIcon: string = '';
  dialogMessage: string = '';

  sendData : any = {
    fundsHeld : '',
    quarterEnding : '',
    premResQuota : '',
    premRes1surplus : '',
    premRes2surplus : ''
  }
  ngOnInit() {
    this.getParameters();
  }

  openModal(){
  	this.quarters = this.quarters.sort();
    //this.year = new Date().getFullYear() - 10;
    this.yearOptions = [];
    //for (var i = 1; i <= 10; i++) {
    //  this.yearOptions.push(this.year+i);
    //}
    var startYear: number = 2000;
    var currYear: number = new Date().getFullYear();
    while(startYear <= currYear){
      this.yearOptions.push(currYear);
      currYear -= 1;
    }
  }

  getParameters(){
      this.maintenanceService.getMtnParameters('V').subscribe((data : any) => {
        this.quarters = [];
        for( var i = 0; i < data.parameters.length; i++){
          if(data.parameters[i].paramName == 'FIRST_QTR_ENDING' ||
            data.parameters[i].paramName == 'SECOND_QTR_ENDING' ||
            data.parameters[i].paramName == 'THIRD_QTR_ENDING' ||
            data.parameters[i].paramName == 'FOURTH_QTR_ENDING' ){
            this.quarters.push(data.parameters[i].paramValueV);
          }
        }
        this.quarters = this.quarters.sort();
        // for(var i = 0 ; i <  this.quarters.length; i++){
        //   this.quarterOptions.push({label: String(this.quarters[i]).slice(0,2) + '/' + String(this.quarters[i]).slice(2,4) , value:this.quarters[i]})
        // }
        //this.year = new Date().getFullYear() - 10;
        this.yearOptions = [];
        //for (var i = 1; i <= 10; i++) {
        //  this.yearOptions.push(this.year+i);
        //}
        var startYear: number = 2000;
        var currYear: number = new Date().getFullYear();
        while(startYear <= currYear){
          this.yearOptions.push(currYear);
          currYear -= 1;
        }
        /*for (var i = 1; i <= 7; i++) {
          this.yearOptions.push({label: this.year + i, value: this.year + i});
        }*/
      });
  }

  slicer(slice){
  	return String(slice).slice(0,2) + '/' + String(slice).slice(2,4);
  }
  

  confirm(){
    this.selectedData.emit();
  }

  quarterData(data){
    this.quarter = data;
  }

  yearData(data){
    this.quarterYear = data;         
  }

  onClickOk(){
    var date = new Date(this.quarterYear,parseInt(this.quarter.substring(0,2))-1,parseInt(this.quarter.substring(2,4)));

    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }
    if(this.quarterDates == undefined || this.quarterDates == null){ //default setup without the quarter ending validation
      this.quarterval = date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
      this.quarterEnd = pad(date.getMonth()+1) + '/' + pad(date.getDate()) +  '/' + date.getFullYear();
      if(this.tranClass !== undefined){
        this.accService.getQuarterPrem(this.quarterEnd,this.cedingId).subscribe((data:any) => {
          console.log(data)
          this.sendData = data;
          this.selectedData.emit(this.sendData)
        });
      }else{
        this.selectedData.emit(this.quarterval);
      }

      this.quarterYear = '';
      this.quarter = '';
      this.modal.closeModal();
    }else{
      this.quarterval = date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
      this.quarterEnd = pad(date.getMonth()+1) + '/' + pad(date.getDate()) +  '/' + date.getFullYear();
      if(this.quarterDates.includes(this.quarterval)){ //If inputed date is already in the table, show error message
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'The date specified is already in the records.';
        this.successDiag.open();
      }else{
        if(this.tranClass !== undefined){
          this.accService.getQuarterPrem(this.quarterEnd,this.cedingId).subscribe((data:any) => {
            console.log(data)
            this.sendData = data;
            this.selectedData.emit(this.sendData)
          });
        }else{
          this.selectedData.emit(this.quarterval);
        }

        this.quarterYear = '';
        this.quarter = '';
        this.modal.closeModal();
      }
    }
  }
}
