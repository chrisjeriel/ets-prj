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
        tHeader: ['G', 'P', 'OR Date', 'OR Number', 'Payor', 'Particulars','Amount'],
        dataTypes: ['checkbox', 'checkbox', 'date', 'text','text','text','currency'],
        widths: [1,1,150,150,200,350,200],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 10,
        keys: ['orNocheck', 'printCheck', 'tranDate', 'orNo', 'payor','particulars','orAmt'],
        uneditable: [false,false,true,true,true,true,true],
        pageID: 'orBatchPrint',
        addFlag: false,
        genericBtn: 'View OR Details',
        disableGeneric: true,
        searchFlag: true
    };

  searchParams: any[] = [];

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

}
