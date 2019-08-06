import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NotesService, AccountingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-jv-app-payments-zero',
  templateUrl: './jv-app-payments-zero.component.html',
  styleUrls: ['./jv-app-payments-zero.component.css']
})
export class JvAppPaymentsZeroComponent implements OnInit {

  @Input() jvDetail: any;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  passData: any = {
    tableData: [], //this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','Curr','Curr Rate','Premium','RI Comm','RI Comm Vat','Charges','Net Due','Payments','Balance',"Overpayments"],
    dataTypes: ['text','text','text','sequence-2','date','date','text','percent','currency','currency','currency','currency','currency','currency','currency','currency'],
    nData: {
       showMG: 1,
       soaNo : '',
       policyNo : '',
       corefNo : '',
       instNo : '',
       effDate : '',
       dueDate : '',
       currCd : '',
       currRate : '',
       premAmt : '',
       riComm : '',
       riCommVat : '',
       charges : '',
       netDue : '',
       prevPaytAmt : '',
       balance : '',
       adjBalAmt : ''
    },
    total:[null,null,null,null,null,null,null,'Total','premAmt', 'riComm','riCommVat', 'charges', 'netDue', 'prevPaytAmt', 'balance', 'adjBalAmt'],
    magnifyingGlass: ['soaNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    disableAdd: true,
    btnDisabled: false,
    pageLength: 10,
    uneditable: [true,true,true,true,true,true,true,true,false,true,true,true,false,false,false,true],
    widths: [215,200,160,50,115,115,40,155,130,130,120,130,130,130,130,85],
    keys:['soaNo','policyNo','coRefNo','instNo','effDate','dueDate','currCd', 'currRate', 'premAmt', 'riComm','riCommVat', 'charges', 'netDue', 'prevPaytAmt', 'balance', 'adjBalAmt' ],
    pageID: 2,
  };

  jvDetails: any = {
    cedingName: '',
    deleteZeroBal: [],
    saveZeroBal:[]
  }

  passLov: any = {
    selector: 'acitSoaDtlZeroBal',
    cedingId: '',
    zeroBal: 0,
    hide: []
  }

  disable: boolean = true;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
    if(this.jvDetail.statusType == 'N' || this.jvDetail.statusType == 'F'){
      this.disable = false;
    }else {
       this.passData.disableAdd = true;
    }
    
  }

  retrieveInwPolZeroBal(){
    this.accService.getAcitJVZeroBal(this.jvDetail.tranId,'',this.jvDetails.ceding).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData= [];
      this.passData.disableAdd = false;
      for(var i = 0 ; i < data.zeroBal.length;i++){
        this.passData.tableData.push(data.zeroBal[i]);
        this.passData.tableData[this.passData.tableData.length - 1].balance = this.passData.tableData[this.passData.tableData.length - 1].netDue - this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt;  
        this.passData.tableData[this.passData.tableData.length - 1].effDate = this.ns.toDateTimeString(data.zeroBal[i].effDate);
        this.passData.tableData[this.passData.tableData.length - 1].dueDate = this.ns.toDateTimeString(data.zeroBal[i].dueDate)
      }
      this.table.refreshTable();

    });
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveInwPolZeroBal()
  }

  openSoaLOV(data){
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.soaNo});
    this.lovMdl.openLOV();
  }

  setSoa(data){
    console.log(data)

    var overdue = null;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0 ; i < data.data.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited  = true;
      this.passData.tableData[this.passData.tableData.length - 1].itemNo = null;
      this.passData.tableData[this.passData.tableData.length - 1].policyId = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo = data.data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo = data.data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo  = data.data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo  = data.data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate  = data.data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate  = data.data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd  = data.data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate  = data.data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt  = data.data[i].treatyBalPrem;
      this.passData.tableData[this.passData.tableData.length - 1].riComm  = data.data[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat  = data.data[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges  = data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue  = this.passData.tableData[this.passData.tableData.length - 1].premAmt - data.data[i].balRiCommVat - data.data[i].balRiComm + data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt  = data.data[i].netDuePayments;
      this.passData.tableData[this.passData.tableData.length - 1].balance  = this.passData.tableData[this.passData.tableData.length - 1].netDue - this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt;
      this.passData.tableData[this.passData.tableData.length - 1].adjBalAmt  = this.passData.tableData[this.passData.tableData.length - 1].netDue - data.data[i].totalPayments;
    }
    this.table.refreshTable();
  }

  prepareData(){
    var edited = [] ;
    var deleted = [];

    for(var i = 0 ; i < this.passData.tableData.length ; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        edited.push(this.passData.tableData[i]);
        edited[edited.length - 1].effDate = this.ns.toDateTimeString(edited[edited.length - 1].effDate);
        edited[edited.length - 1].dueDate = this.ns.toDateTimeString(edited[edited.length - 1].dueDate);
        edited[edited.length - 1].createDate = this.ns.toDateTimeString(edited[edited.length - 1].createDate);
        edited[edited.length - 1].updateDate = this.ns.toDateTimeString(edited[edited.length - 1].updateDate);
        edited[edited.length - 1].createUser = this.ns.getCurrentUser();
        edited[edited.length - 1].updateUser = this.ns.getCurrentUser();
      }

      if(this.passData.tableData[i].deleted){
        deleted.push(this.passData.tableData[i]);
      }
    }

    this.jvDetails.deleteZeroBal = deleted;
    this.jvDetails.saveZeroBal = edited;
  }

  onClickSave(cancelFlag?){
    this.prepareData();

    this.accService.saveAcitZeroBal(this.jvDetails).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInwPolZeroBal();
      }
    });
  }


}
