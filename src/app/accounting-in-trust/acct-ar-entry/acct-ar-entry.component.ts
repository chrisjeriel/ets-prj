import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-acct-ar-entry',
  templateUrl: './acct-ar-entry.component.html',
  styleUrls: ['./acct-ar-entry.component.css']
})
export class AcctArEntryComponent implements OnInit, OnDestroy {
  @ViewChild('paytDtl') paytDtlTbl: CustEditableNonDatatableComponent;

  passData: any = {
        tableData: [],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class'],
        dataTypes: ['select','select','percent','currency','select','text','number','date','select'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [130,70,100,150,210,1,"auto",100,180],
        keys: ['paytMode', 'currCd', 'currRate', 'paytAmt', 'bank', 'bankAcct', 'checkNo', 'checkDate', 'checkClass'],
        pageID: 1,
        opts:[
          {
            selector: 'paytMode',
            vals: ['BT', 'CA', 'CK', 'CR'],
            prev: ['Bank Transfer', 'Cash', 'Check', 'Credit Card']
          },
          {
            selector: 'currCd',
            vals: ['EUR','PHP','USD'],
            prev: ['EUR', 'PHP', 'USD']
          },
          {
            selector: 'bank',
            vals: ['1'],
            prev: ['Bank of the Philippine Islands']
          },
          {
            selector: 'checkClass',
            vals: ['LC', 'RC', 'MC', 'OU'],
            prev: ['Local Clearing', 'Regional Clearing', 'Manager\'s Check','On-Us']
          },
        ]
    };

  @Input() record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  sub: any;
  isAdd: boolean = false;

  arInfo: any = {
    tranId: '',
    arNo: '',
    arDate: '',
    arStatus: '',
    arStatDesc: '',
    dcbYear: '',
    dcbUserCd: '',
    dcbNo: '',
    dcbBank: '',
    dcbBankAcct: '',
    refNo: '',
    tranTypeCd: '',
    tranTypeName: '',
    prNo: '',
    prDate: '',
    prPreparedBy: '',
    payor: '',
    mailAddress: '',
    bussTypeCd: '',
    tin: '',
    currCd: '',
    arAmt: '',
    currRate: '',
    particulars: '',
    createUser: '',
    createDate: '',
    updateUser: '',
    updateDate: '',
  }

  arDate: any = {
    date: '',
    time: ''
  }

  prDate: any = {
    date: '',
    time: ''
  }

  paymentTypes: any[] = [];

  constructor(private route: ActivatedRoute, private as: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    var tranId;
    var arNo;
    this.onChange.emit({ type: this.arInfo.tranTypeName });
    this.sub = this.route.params.subscribe(
       data=>{
         console.log(data['action']);
         if('add' === data['action'].trim()){
           this.isAdd = true;
         }else{
           this.isAdd = false;
           let params = JSON.parse(data['slctd']);
           tranId = params.tranId;
           arNo = params.arNo;
           console.log(tranId);
           console.log(arNo);
         }
       }
    );
    console.log(this.isAdd);
    if(!this.isAdd){
      this.retrieveArEntry(tranId, arNo);
    }
    this.retrievePaymentType();
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  tabController(event) {
  	this.onChange.emit({ type: this.arInfo.tranTypeName });
  }

  retrieveArEntry(tranId, arNo){
    this.as.getArEntry(tranId, arNo).subscribe(
      (data:any)=>{
        console.log(data);
        if(data.ar !== null){
          this.arInfo.tranId         = data.ar.tranId;
          this.arInfo.arNo           = data.ar.arNo;
          this.arInfo.arDate         = this.ns.toDateTimeString(data.ar.arDate);
          this.arDate.date           = this.arInfo.arDate.split('T')[0];
          this.arDate.time           = this.arInfo.arDate.split('T')[1];
          this.arInfo.arStatus       = data.ar.arStatus;
          this.arInfo.arStatDesc     = data.ar.arStatDesc;
          this.arInfo.dcbYear        = data.ar.dcbYear;
          this.arInfo.dcbUserCd      = data.ar.dcbUserCd;
          this.arInfo.dcbNo          = data.ar.dcbNo;
          this.arInfo.dcbBank        = data.ar.dcbBank;
          this.arInfo.dcbBankAcct    = data.ar.dcbBankAcct;
          this.arInfo.refNo          = data.ar.refNo;
          this.arInfo.tranTypeCd     = data.ar.tranTypeCd;
          this.arInfo.tranTypeName   = data.ar.tranTypeName;
          this.arInfo.prNo           = data.ar.prNo;
          this.arInfo.prDate         = this.ns.toDateTimeString(data.ar.prDate);
          this.prDate.date           = this.arInfo.prDate.split('T')[0];
          this.prDate.time           = this.arInfo.prDate.split('T')[1];
          this.arInfo.prPreparedBy   = data.ar.prPreparedBy;
          this.arInfo.payor          = data.ar.payor;
          this.arInfo.mailAddress    = data.ar.mailAddress;
          this.arInfo.bussTypeCd     = data.ar.bussTypeCd;
          this.arInfo.tin            = data.ar.tin;
          this.arInfo.currCd         = data.ar.currCd;
          this.arInfo.arAmt          = data.ar.arAmt;
          this.arInfo.currRate       = data.ar.currRate;
          this.arInfo.particulars    = data.ar.particulars;
          this.arInfo.createUser     = data.ar.createUser;
          this.arInfo.createDate     = this.ns.toDateTimeString(data.ar.createDate);
          this.arInfo.updateUser     = data.ar.updateUser;
          this.arInfo.updateDate     = this.ns.toDateTimeString(data.ar.updateDate);

          this.passData.tableData    = data.ar.paytDtl;
          this.paytDtlTbl.refreshTable();
        }
      },
      (error)=>{

      }
    );
  }

  retrievePaymentType(){
    this.ms.getMtnAcitTranType('AR').subscribe(
      (data:any)=>{
        this.paymentTypes = data.tranTypeList;
      }
    );
  }

}
