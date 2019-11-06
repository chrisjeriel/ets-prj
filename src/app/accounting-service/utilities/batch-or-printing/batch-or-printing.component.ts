import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { BatchOR } from '@app/_models';
import { AccountingService,MaintenanceService, NotesService } from '@app/_services';
import { ActivatedRoute,Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-batch-or-printing',
  templateUrl: './batch-or-printing.component.html',
  styleUrls: ['./batch-or-printing.component.css']
})
export class BatchOrPrintingComponent implements OnInit {
  @ViewChild('batchOR') table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild('printModal') printMdl: ModalComponent;
  @ViewChild('printConfirmModal') printConfirmModal: ModalComponent;

  exitLink: string;
  exitTab: string;
  sub: any;

  dialogIcon: string = '';
  dialogMessage: string = '';
  paymentTypes: any[] = [];
  tranTypeCd : string;
  fromDate: string = "";
  toDate: string = "";
  genORBool: boolean = true;
  printORBool: boolean = true;
  stopPrintBool: boolean = true;
  boolSearch: boolean = true;
  boolRadioTag: boolean = true;

  byvat: any = '';
  bynonvat: any = '';
  radioVal: any = '';
  vatOrNO: any;
  nonVatOrNO: any;
  radioTagVal: any = '';
  untag: any = '';
  tag: any = '';

  orInfo: any = {};

  passData: any = {
        tableData: [],
        tHeader: ['G', 'P', 'OR Date','OR Type','OR Number', 'Payor', 'Particulars','Amount'],
        dataTypes: ['checkbox', 'checkbox', 'date', 'text','text','text','text','currency'],
        widths: [1,1,150,1,100,200,350,200],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 10,
        keys: ['orNocheck', 'printCheck', 'tranDate','orType','orNo', 'payor','particulars','orAmt'],
        uneditable: [false,false,true,true,true,true,true,true],
        pageID: 'orBatchPrint',
        addFlag: false,
        genericBtn: 'View OR Details',
        disableGeneric: true,
        searchFlag: true
    };

  searchParams: any[] = [];
  batchData   : any = { 
                    "reportRequest": []
                    };
  selectedrecord: any = {};
  record: any = {};
  loading: boolean = false;
  changeStatData: any = {
        printOrList: []
    };
  lastOrNo: any;

  constructor(private accountingService: AccountingService,private router: Router, private route: ActivatedRoute,private ms: MaintenanceService,private ns: NotesService) { }

  ngOnInit() {
    this.retrievePaymentType();
  }

  retrievePaymentType(){
    this.paymentTypes = [];
    this.ms.getMtnAcseTranType('OR',null,null,null,null,'Y').subscribe(
      (data:any)=>{
        if(data.tranTypeList.length !== 0){
          data.tranTypeList = data.tranTypeList.filter(a=>{return a.tranTypeCd !== 0});
          this.paymentTypes = data.tranTypeList;
        }
      }
    );
  }

  retrieveBatchORList(search?){
    this.accountingService.getAcseBatchOr(search).subscribe( data => {
      console.log(data['batchOrList']);
        var td = data['batchOrList'].map(a => { 
                        var totn_string = String(a.orNo);
                        a.orNo = totn_string.padStart(6, '0');

                        if(a.orNo !== null){
                          a.orNocheck = 'Y';
                          a.uneditable = ['orNocheck'];
                        }

                        a.tranDate = this.ns.toDateTimeString(a.tranDate);
                        return a; });
        this.passData.tableData = td;
        this.table.overlayLoader = false;
        this.table.refreshTable();
        this.printORBool = false;
        this.stopPrintBool = false;
        this.boolRadioTag = false;
        this.radioTagVal = null;
    });
  }

  onClickSearch(){
      this.fromDate === null   || this.fromDate === undefined ?'':this.fromDate;
      this.toDate === null || this.toDate === undefined?'':this.toDate;
      this.tranTypeCd === null || this.tranTypeCd === undefined ?'':this.tranTypeCd;
      this.passData.tableData = [];
      this.passData.disableGeneric = true;
      this.table.overlayLoader = true;
      this.searchParams = [    {key: "orDateFrom", search: this.fromDate },
                               {key: "orDateTo", search: this.toDate },
                               {key: "tranTypeCd", search: this.tranTypeCd},
                               ]; 
      console.log(this.searchParams);
      this.retrieveBatchORList(this.searchParams);
  }



  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }

  onRadioTagChange(){
    console.log(this.passData.tableData.length);
    if(this.passData.tableData.length === 0){
    } else {
      if (this.radioTagVal === 'untag'){
        this.onClicktag('N');
      } else if (this.radioTagVal === 'tag'){
        this.onClicktag('Y');
      }
    }
  }

  onTableClick(data){
    console.log(data);
    this.selectedrecord = data;
    this.passData.disableGeneric = data == null;
  }

  onClicktag(tag?){
    for(var i=0; i < this.passData.tableData.length;i++){
      if (this.passData.tableData[i].orNo === null){
        this.passData.tableData[i].orNocheck = tag;
        this.passData.tableData[i].printCheck = tag;
      } else {
        this.passData.tableData[i].printCheck = tag;
      }
    }
  }

  printOR(){
    let tranIdArray=[];
    this.changeStatData.printOrList = [];
    for(var i=0; i < this.passData.tableData.length;i++){
      if (this.passData.tableData[i].orNo !== null && this.passData.tableData[i].printCheck === 'Y'){
        tranIdArray.push({ tranId: this.passData.tableData[i].tranId, orNo: this.passData.tableData[i].orNo });
      }
    }

    if(tranIdArray.length === 0){
      this.dialogMessage = 'Please choose records to be printed.';
      this.dialogIcon = 'error-message';
      this.successDiag.open();
    } else {
      let selectedBatchData = [];
       this.batchData.reportRequest = [];

      for(let i=0;i<tranIdArray.length ;i++){ 
        selectedBatchData.push({ tranId :  tranIdArray[i].tranId , reportName : 'ACITR_AR' , userId : JSON.parse(window.localStorage.currentUser).username }); 
        this.changeStatData.printOrList.push({tranId :  tranIdArray[i].tranId, orNo: tranIdArray[i].orNo, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }

      this.batchData.reportRequest = selectedBatchData;
      this.printPDF(this.batchData);
      this.loading = true;
    }  
  }      

  printPDF(batchData: any){  
   let result: boolean;    
   this.accountingService.batchPrint(JSON.stringify(batchData))
     .pipe(
           finalize(() => this.finalPrint(result) )
      )
          .subscribe(data => {
           var newBlob = new Blob([data as BlobPart], { type: "application/pdf" });
           var downloadURL = window.URL.createObjectURL(data);
           //window.open(downloadURL, '_blank');
           const iframe = document.createElement('iframe');
           iframe.style.display = 'none';
           iframe.src = downloadURL;
           document.body.appendChild(iframe);
           iframe.contentWindow.print();


           result= false;
    },
     error => {
           result =true;
           this.dialogIcon= "error-message";
           this.dialogMessage = "Error generating batch OR PDF file(s)";
           this.successDiag.open();
   });     

}

finalPrint(error?){
  this.loading = false;
  if(!error){
    this.printMdl.open();
  }
  
}

updateOrStatus(){
  this.table.overlayLoader = true;
  console.log(JSON.stringify(this.changeStatData));
   setTimeout(()=>{
         this.accountingService.printOrBatch(this.changeStatData).subscribe(
           (data:any)=>{
             if(data.returnCode == 0){
               this.dialogIcon = 'error-message';
               this.dialogIcon = 'An error has occured when updating OR status';
               this.successDiag.open();
             }else{
               this.retrieveBatchORList(this.searchParams);
             }
           }
         );
      },1000);
}
 
viewOR(){
   this.record = {
     tranId : this.selectedrecord.tranId,
     orNo: this.selectedrecord.orNo == null ? '' : this.selectedrecord.orNo,
     payor: this.selectedrecord.payor,
     orDate: this.selectedrecord.tranDate,
     paymentType: this.selectedrecord.tranTypeName,
     particulars: this.selectedrecord.particulars,
     amount: this.selectedrecord.orAmt
   }

   this.router.navigate(['/accounting-service', { slctd: JSON.stringify(this.record), action: 'edit', inquiry: true }], { skipLocationChange: true });
}

failedOrPrint(){
  console.log(this.lastOrNo);
}



}
