import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SucessDialogComponent, ModalComponent } from '@app/_components/common';
import { NotesService, PrintService, MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-extract-bir-taxes',
  templateUrl: './extract-bir-taxes.component.html',
  styleUrls: ['./extract-bir-taxes.component.css']
})
export class ExtractBirTaxesComponent implements OnInit {

  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('mdl') mdl: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  
  defaultTab: false;

  params = {
    reportId : 'ACSER009',
    reportName : 'ACSER009',
    taxType: '1',
    fromDate: '',
    toDate: '',
    destination: 'exl',
    extractUser: this.ns.getCurrentUser(),
    extractDate: ''
  }

  rType: any = 'S';
  dialogIcon: string = "";
  dialogMessage: string = "";
  modalMode: string = "";
  modalHeader: string = "";
  modalBody: string = "";
  loading: boolean = false;
  passDataCsv : any[] =[];

  constructor(private ns: NotesService, private ps: PrintService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.onChange.emit(this.params.taxType);
  }

  taxTypeChange(event) {
    this.onChange.emit(event.target.value);
  }

  onClickExtract(forceExtract?) {
    this.params.extractDate = this.ns.toDateTimeString(0);
    this.params['periodFrom'] = this.params.fromDate;
    this.params['periodTo'] = this.params.toDate;
    let param: any = JSON.parse(JSON.stringify(this.params));
    param.forceExtract = forceExtract != undefined ? 'Y' : 'N';
    
    this.loading = true;
    this.ps.extractReport({ reportId: param.reportId, acser009Params: param }).subscribe((data:any)=>{
        this.modalMode = "";
        this.loading = false;
        if (data.errorList.length > 0) {
          
          if (data.errorList[0].errorMessage.includes("parameters already exists.")) {
            this.modalMode = "reExtract";
            this.modalHeader = "Confirmation";
            this.mdl.openNoClose();
          } else {
            this.dialogIcon = 'error';
            this.appDialog.open();
          }
          
        } else {
          // if (data.params.extractCount != 0) {
          if (data.returnCode == -1) {
            this.modalHeader = "Extraction Completed";
            // this.modalBody = "Successfully extracted " + data.params.extractCount + " record/s.";
            this.modalBody = "Successfully extracted record/s.";
            this.mdl.openNoClose();
          } else {
            this.modalHeader = "Extraction Completed";
            this.modalBody = "No record/s extracted.";
            this.mdl.openNoClose();
          }
        }
        console.log(data)
    },
    (err) => {
      alert("Exception when calling services.");
    });
  }

  getExtractToCsv(){
    console.log(this.params.reportId);
      console.log(this.ns.getCurrentUser() + ' >> current user');
      this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACSER009',null,null,null,null,null,null,
           null,null,null,null,null,null,null,null,null,null,
           null,null,this.rType, this.params.taxType)
      .subscribe(data => {
        console.log(data);
        var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };

        var name = this.params.reportId;
        var query = '';

        if(this.rType == 'D'){
          this.passDataCsv = data['listAcser009'];
          // this.passDataCsv.forEach(a=>{a.extType = a.extType == 'N' ? 'Net' : 'Total Debit & Total Credits'});
          // query = 'SELECT checkNullNo(extractId) as [EXTRACT ID],extractUser as [EXTRACT USER],myFormat(extractDate) as [EXTRACT DATE],checkNullNo(glAcctId) as [GL ACCT ID],'+
          // 'isNull(acctCode) as [ACCT CODE],isNull(acctName) as [ACCT NAME],isNull(currCd) as [CURRENCY],checkNullNo(slTypeCd) as [SL TYPE CD],'+
          // 'isNull(slTypeName) as [SL TYPE NAME],checkNullNo(slCd) as [SL CD],isNull(slName) as [SL NAME],negFmt(currency(totalCredit)) as [TOTAL CREDIT],'+
          // 'negFmt(currency(totalDebit)) as [TOTAL DEBIT],myFormat(periodFrom) as [PERIOD FROM],myFormat(periodTo) as [PERIOD TO],isNull(currCdParam) as [CURR CD PARAM],'+
          // 'isNull(extType) as [EXT TYPE]';
          query = 'SELECT checkNullNo(tranId) as [TRAN ID], isNull(tranNo) as [TRAN NO], myFormat(tranDate) as [TRAN DATE], isNull(tranStat) as [TRAN STAT], isNull(status) as [STATUS], checkNullNo(payeeClassCd) as [PAYEE CLASS CD], ' +
                  'isNull(payeeCd) as [PAYEE CD], isNull(payeeName) as [COMPANY NAME], checkNullNo(bussTypeCd) as [BUSS TYPE CD], isNull(bussTypeName) as [BUSS TYPE NAME], isNull(tin) as [TIN], isNull(mailAddress) as [ADDRESS], ' +
                  'negFmt(currency(baseAmt)) as [BASE AMT], negFmt(currency(taxAmt)) as [TAX AMT], isNull(taxCd) as [TAX CODE], negFmt(currency(rate)) as [RATE]';

          this.ns.export('ACSER009B', query, this.passDataCsv);
        } else if(this.rType == 'S'){
          this.passDataCsv = data['listAcser009'];
          query = 'SELECT isNull(tranNo) as [TRAN NO], myFormat(tranDate) as [TRAN DATE], isNull(payeeName) as [COMPANY NAME], isNull(tin) as [TIN], isNull(mailAddress) as [ADDRESS], ' +
                  'negFmt(currency(baseAmt)) as [BASE AMT], negFmt(currency(taxAmt)) as [TAX AMT], isNull(taxCd) as [TAX CODE], negFmt(currency(rate)) as [RATE]';

          this.ns.export('ACSER009A', query, this.passDataCsv);
        }

        console.log(this.passDataCsv);
      });
  }

}
