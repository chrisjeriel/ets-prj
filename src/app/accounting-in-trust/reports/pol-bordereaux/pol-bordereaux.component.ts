import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService, PrintService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { DecimalPipe } from '@angular/common';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pol-bordereaux',
  templateUrl: './pol-bordereaux.component.html',
  styleUrls: ['./pol-bordereaux.component.css']
})
export class PolBordereauxComponent implements OnInit {

  @ViewChild (CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;	
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild('polReportsModal') polReportsModal: ModalComponent;
  @ViewChild('appDialog') appDialog: SucessDialogComponent;
  @ViewChild('success') openDialog: SucessDialogComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;
  @ViewChild('Range') rangeLOV: ModalComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  passLov: any = {
    selector: 'mtnReport',
    reportId: '',
    hide: []
  }

  params :any = {
    dateRange: '',
    dateParam:'',
    reportName : '',
    byDateFrom:'',
    byDateTo:'',
    byAsOf:'',
    reportId : '',
    lineCd: '',
    lineName: '',
    destination: '',
    cedingId: '',
    cedingName: '',
    alteration: '',
    incRecTag: '',
    byMonthFrom: '',
    byMonthFromYear: '',
    byMonthTo : '',
    byMonthToYear: ''
  }

  sendData: any = {
    extractUser: JSON.parse(window.localStorage.currentUser).username,
    dateRange: '',
    dateParam:'',
    fromDate: '',
    toDate: '',
    cedingIdParam: '',
    lineCdParam: '',
    incRecTag: '',
    reportId : '',
    destination: '',
    forceExtract: 'N',
  };

  repExtractions: Array<string> = [
                        'POLR044A',
                        'POLR044B',
                        'POLR044C',
                        'POLR044D',
                        'POLR044E',
                        'POLR044F',
                        'POLR044G',
                        'POLR044H',
                        'POLR044I',
                        'POLR044J',
                        'POLR044J_ISS',
                        'POLR044J_RET',
                        'POLR044K',
                        'POLR044L',
                        'POLR044M',
                        'POLR044N',
                        'POLR044O',
                        'POLR044P',
                        'POLR044Q',
                        'POLR044R',
                        'POLR044S',
                        'POLR044T',
                        'POLR044U',
                        'ACITR061F',
                        'ACITR061G',
                        'ACITR048A'
                        ];

  rangeParams :any = {
    saveReportsRange:[],
    delReportsRange: []
  };

  passData: any = {
    tableData: [],
    tHeader: ['Range', 'Amount'],
    dataTypes: ['string', 'currency'],
    nData: {siRange: '', amount: ''},
    addFlag: true,
    deleteFlag: false,
    genericBtn:'Delete',
    checkFlag: true,
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    uneditable: [false,false],
    keys: ['siRange', 'amount'],
    widths: [110,140]
  };

  paramsToggle: Array<string> = [];

  extractDisabled: boolean = true;
  modalHeader: string = "";
  modalBody: string = "";
  dialogIcon: string = "";
  dialogMessage: string = "";
  modalMode: string = "";
  loading: boolean = true;
  disableTo: boolean = false;
  tableFlag: boolean = false;
  cancelFlag: boolean = false;

  constructor(private ms: MaintenanceService, private ns: NotesService, private printService: PrintService, public modalService: NgbModal,  private decimal : DecimalPipe, private router:Router) { }

  ngOnInit() {
  	 this.loading = false;
  }

}
