import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { BatchOR } from '@app/_models';
import { AccountingService,MaintenanceService, NotesService, PrintService } from '@app/_services';
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
  orNoDigits: any;
  orNo: any;
  orNoArray=[];
  orNonVatIdArray=[];
  orVatIdArray=[];

  genOrData: any = {
        orNoList: []
  };

  checkAllGVal :any = '';
  checkAllPVal :any = '';

  printData : any = {
    selPrinter  : '',
    printers    : [],
    destination : 'screen'
  };

  constructor(private accountingService: AccountingService,private router: Router, private route: ActivatedRoute,private ms: MaintenanceService,private ns: NotesService, public ps : PrintService) { }

  ngOnInit() {
    this.getPrinters();
    this.retrievePaymentType();
    this.getInvNoDigits();
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
                        if(a.orNo !== null){
                          var totn_string = String(a.orNo);
                          a.orNo = totn_string.padStart(6, '0');

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
        this.checkAllGVal = null;
        this.checkAllPVal = null;
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

  checkAllGenPrin(from?){
   if(this.passData.tableData.length === 0){
   } else {
      for(var i=0; i < this.passData.tableData.length;i++){
        if (this.passData.tableData[i].orNo === null){
           if(from == 'checkAllG'){
            this.passData.tableData[i].orNocheck = (this.checkAllGVal)?'Y':'N';
           }else if(from == 'checkAllP'){
            this.passData.tableData[i].printCheck = (this.checkAllPVal)?'Y':'N';
           } 
        } else {
          if(from == 'checkAllP'){
            this.passData.tableData[i].printCheck = (this.checkAllPVal)?'Y':'N';
          } 
        }
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

  //original
  // printOR(){
  //   this.lastOrNo = null;
  //   let tranIdArray=[];
  //   this.changeStatData.printOrList = [];
  //   for(var i=0; i < this.passData.tableData.length;i++){
  //     if (this.passData.tableData[i].orNo !== null && this.passData.tableData[i].printCheck === 'Y'){
  //       tranIdArray.push({ tranId: this.passData.tableData[i].tranId, orNo: this.passData.tableData[i].orNo, orType: this.passData.tableData[i].orType });
  //     }
  //   }

  //   if(tranIdArray.length === 0){
  //     this.dialogMessage = 'Please choose records to be printed.';
  //     this.dialogIcon = 'error-message';
  //     this.successDiag.open();
  //   } else {
  //     let selectedBatchData = [];
  //      this.batchData.reportRequest = [];

  //     for(let i=0;i<tranIdArray.length ;i++){ 

  //       console.log(tranIdArray[i]);
  //       if (tranIdArray[i].orType === 'VAT'){
  //         selectedBatchData.push({ tranId :  tranIdArray[i].tranId , reportName : 'ACSER_OR_VAT' , userId : JSON.parse(window.localStorage.currentUser).username }); 
  //       }else if (tranIdArray[i].orType === 'NON-VAT'){
  //          selectedBatchData.push({ tranId :  tranIdArray[i].tranId , reportName : 'ACSER_OR_NVAT' , userId : JSON.parse(window.localStorage.currentUser).username }); 
  //       }
  //       this.changeStatData.printOrList.push({tranId :  tranIdArray[i].tranId, orNo: tranIdArray[i].orNo, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
  //     }

  //     this.batchData.reportRequest = selectedBatchData;
  //     console.log(this.batchData);
  //     this.printPDF(this.batchData);
  //     this.loading = true;
  //   }  
  // }

  printOR(){
    this.lastOrNo = null;
    let tranIdArray=[];
    this.changeStatData.printOrList = [];
    for(var i=0; i < this.passData.tableData.length;i++){
      if (this.passData.tableData[i].orNo !== null && this.passData.tableData[i].printCheck === 'Y'){
        tranIdArray.push({ tranId: this.passData.tableData[i].tranId, orNo: this.passData.tableData[i].orNo, orType: this.passData.tableData[i].orType });
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

        console.log(tranIdArray[i]);
        var vOrType = '';

        if (tranIdArray[i].orType === 'VAT'){
          vOrType = 'ACSER_OR_VAT';
        }else if (tranIdArray[i].orType === 'NON-VAT'){
          vOrType = 'ACSER_OR_NVAT';
        }

        if(this.printData.destination == 'dlPdf'){
          selectedBatchData.push({ tranId :  tranIdArray[i].tranId , reportName : vOrType , userId : JSON.parse(window.localStorage.currentUser).username });
          var param = {
            tranId: tranIdArray[i].tranId,
            reportName: vOrType,
            userId: JSON.parse(window.localStorage.currentUser).username,
            fileName: tranIdArray[i].orNo
          };
          this.batchData.reportRequest = selectedBatchData;
          console.log(this.batchData);
          this.printPDF(param);
          this.ps.printLoader = true;
        }
        else if(this.printData.destination == 'screen'){
          window.open(environment.prodApiUrl + '/util-service/generateReport?reportName='+ vOrType + '&userId=' + 
                        this.ns.getCurrentUser() + '&tranId=' + tranIdArray[i].tranId, '_blank');
        }else if(this.printData.destination == 'printPdf'){
          let params = {
            tranId: tranIdArray[i].tranId,
            printerName: this.printData.selPrinter,
            pageOrientation: 'LANDSCAPE',
            paperSize: 'LETTER',
            reportName : vOrType
          };
          this.loading = true;
          this.ps.directPrint(params).subscribe(data => {
            console.log(data);
            this.loading = false;
          });
        }

        this.changeStatData.printOrList.push({tranId :  tranIdArray[i].tranId, orNo: tranIdArray[i].orNo, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }
    }  
  }      

  printPDF(batchData: any){
   let result: boolean;
   this.ps.downloadPDF(batchData);

   // this.accountingService.pdfMerge(JSON.stringify(batchData))
   //   .pipe(
   //         finalize(() => this.finalPrint(result) )
   //    )
   //        .subscribe(data => {
   //         var newBlob = new Blob([data as BlobPart], { type: "application/pdf" });
   //         var downloadURL = window.URL.createObjectURL(data);
   //         console.log(newBlob);
   //         const iframe = document.createElement('iframe');
   //         iframe.style.display = 'none';
   //         iframe.src = downloadURL;
   //         document.body.appendChild(iframe);
   //         iframe.contentWindow.print();
   //         result= false;
   //  },
   //   error => {
   //         result =true;
   //         this.dialogIcon= "error-message";
   //         this.dialogMessage = "Error generating batch OR PDF file(s)";
   //         this.successDiag.open();
   // });     

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
               this.dialogIcon = "success";
               this.successDiag.open();
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
  let changeStatData: any = {
        printOrList: []
    };
  for(let i=0;i<this.changeStatData.printOrList.length ;i++){ 
      if (parseInt(this.changeStatData.printOrList[i].orNo) <= parseInt(this.lastOrNo)){
        changeStatData.printOrList.push({tranId :  this.changeStatData.printOrList[i].tranId, orNo: this.changeStatData.printOrList[i].orNo, updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
      }
  }

  if (changeStatData.printOrList.length === 0){
  }else {
    setTimeout(()=>{
         this.accountingService.printOrBatch(changeStatData).subscribe(
           (data:any)=>{
             if(data.returnCode == 0){
               this.dialogIcon = 'error-message';
               this.dialogIcon = 'An error has occured when updating OR status';
               this.successDiag.open();
             }else{
               this.dialogIcon = "success";
               this.successDiag.open();
               this.retrieveBatchORList(this.searchParams);
             }
           }
         );
     },1000);
  }


}

validateORLastPrinted(data){
  this.lastOrNo = this.pad(data.target.value);
}

validateORNonVat(data){
    let orNo = this.pad(data.target.value);
    this.nonVatOrNO = orNo;

    if (this.isEmptyObject(orNo)){
      this.genORBool = true;
    } else {
      this.genORBool = false;
      this.retrieveInvSeriesNo('NON-VAT',orNo,orNo,null,null,'validate');
    }
}

validateORVat(data){
    let orNo = this.pad(data.target.value);
    this.vatOrNO = orNo;

    if (this.isEmptyObject(orNo)){
      this.genORBool = true;
    } else {
      this.genORBool = false;
      this.retrieveInvSeriesNo('VAT',orNo,orNo,null,null,'validate');
    }
}

pad(str) {
    if(str === '' || str == null){
      return '';
    }else{
        return String(str).padStart(this.orNoDigits, '0');
    }
}

retrieveInvSeriesNo(orType,orFrom,orTo,usedTag,length,action){
    this.ms.getAcseOrSeries(orType,orFrom,orTo,usedTag,length).subscribe( data => {
         if (action === 'validate'){
           console.log(data['orSeries']);
           if (data['orSeries'].length === 0){
             if (orType === 'NON-VAT'){
               this.nonVatOrNO = null;
             }else if (orType === 'VAT'){
               this.vatOrNO = null;
             }
             this.genORBool = true;
             this.dialogMessage = 'Cannot use OR No. It may not yet generated.';
             this.dialogIcon = 'error-message';
             this.successDiag.open();
           }
         }else if (action === 'generate'){
           this.orNoArray = [];
           if (data['orSeries'].length === 0){
             this.orNoArray = [];
           }else {
             let genOrNoData=[];

              data['orSeries'].map(a => { 
                this.orNoArray.push({ orNo : parseInt(a.orNo) });       
              });

              for(let i=0;i<this.orNoArray.length ;i++){ 

                if (orType === 'NON-VAT'){
                   genOrNoData.push({ tranId : this.orNonVatIdArray[i].tranId, orNo :  this.orNoArray[i].orNo, orType:  orType,
                                        updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
                }else if (orType === 'VAT'){
                   genOrNoData.push({ tranId : this.orVatIdArray[i].tranId, orNo :  this.orNoArray[i].orNo, orType:  orType, 
                                        updateDate : this.ns.toDateTimeString(0) , updateUser : JSON.parse(window.localStorage.currentUser).username });
                }

               
              }
             this.genOrData.orNoList = genOrNoData;
             console.log(JSON.stringify(this.genOrData));

             this.accountingService.genBatchOr(this.genOrData).subscribe(data => {
               console.log(data);
                 if(data['returnCode'] == -1){
                    this.dialogIcon = "success";
                    this.successDiag.open();
                    this.table.overlayLoader = true;
                    this.retrieveBatchORList(this.searchParams);
                }else{
                    this.dialogMessage = "Cannot generate Invoice No."
                    this.dialogIcon = "error-message";
                    this.successDiag.open();
                }
             });
           }
         }
    });
  }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
  }

  getInvNoDigits(){
    this.ms.getMtnParameters('N', 'OR_NO_DIGITS').subscribe(data => { 
     this.orNoDigits = parseInt(data['parameters'][0].paramValueN);
    });
  }

  generateOR(){
    this.orNonVatIdArray=[];
    this.orVatIdArray=[];

    for(var i=0; i < this.passData.tableData.length;i++){
      if (this.passData.tableData[i].orNo === null && this.passData.tableData[i].orNocheck === 'Y'){
        if (this.passData.tableData[i].orType === 'NON-VAT'){
          this.orNonVatIdArray.push({ tranId: this.passData.tableData[i].tranId });
        }else if (this.passData.tableData[i].orType === 'VAT'){
          this.orVatIdArray.push({ tranId: this.passData.tableData[i].tranId });
        }
      }
    }
    if(this.radioVal === 'byvat'){
      if(this.orVatIdArray.length === 0){
        this.dialogMessage = 'Please choose records.';
        this.dialogIcon = 'error-message';
        this.successDiag.open();
      }else {
        console.log(this.orVatIdArray);
        this.retrieveInvSeriesNo('VAT',this.vatOrNO,null,'N',this.orVatIdArray.length,'generate');
      }
    }else if (this.radioVal === 'bynonvat'){
      if(this.orNonVatIdArray.length === 0){
        this.dialogMessage = 'Please choose records.';
        this.dialogIcon = 'error-message';
        this.successDiag.open();
      }else {
        console.log(this.orNonVatIdArray);
        this.retrieveInvSeriesNo('NON-VAT',this.nonVatOrNO,null,'N',this.orNonVatIdArray.length,'generate');
      }
    }   
  }


clearPrinterName(){
  (this.printData.destination != 'printPdf')?this.printData.selPrinter='':''
}

getPrinters(){
  this.ps.getPrinters()
  .subscribe(data => {
    this.printData.printers = data;
  });
}
}
