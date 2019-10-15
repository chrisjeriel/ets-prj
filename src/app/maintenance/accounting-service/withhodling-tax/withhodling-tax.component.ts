import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-withhodling-tax',
  templateUrl: './withhodling-tax.component.html',
  styleUrls: ['./withhodling-tax.component.css']
})
export class WithhodlingTaxComponent implements OnInit {
   
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

   passData: any = {
      tableData: [],
      tHeader: ['WhTax ID','WhTax Code', 'Withholding Tax Name', 'WhTax Type','Rate', 'Default GL Account', 'GL Account Name', 'Creditable','Fixed','Active'],
      dataTypes: ['number','text', 'text', 'select','currency','text', 'text', 'checkbox','checkbox','checkbox'],
      nData: {
        whtaxId : '',
        taxCd : '',
        taxName : '',
        taxType : '',
        rate : '',
        defaultAcitGl : '',
        defaultAcseGl : '',
        creditableTag : 'N',
        fixedTag : 'N',
        activeTag : 'N',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      opts: [{
              selector: 'taxType',
              prev: [],
              vals: [],
             }
      ],
      //uneditable: [true,true,true,true,true,true,true,true,true,true],
      widths: [60,70,390,115,75,110,90,65,50,67],
      keys: ['whtaxId', 'taxCd', 'taxName', 'taxType', 'rate', 'defaultAcitGl','defaultAcseGl', 'creditableTag','fixedTag', 'activeTag'],
  }

  params = {
    remarks: '',
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:'',
    delWhTax: [],
    saveWhTax: []
  }

  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveWhtax();
  }

  retrieveWhtax(){
    this.maintenanceService.getWhTax(null,null,null).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      for (var i = 0; i < data.whtax.length; i++) {
        this.passData.tableData.push(data.whtax[i]);
      }
      this.passData.opts[0].vals.push('I');
      this.passData.opts[0].prev.push('I');
      this.passData.opts[0].vals.push('C');
      this.passData.opts[0].prev.push('C');
      this.table.refreshTable();
    });
  }

  onRowClick(data){
    console.log(data)
    if(data !== null){
      this.params.remarks = data.remarks;
      this.params.createUser = data.createUser;
      this.params.createDate = this.ns.toDateTimeString(data.createDate);
      this.params.updateUser = data.updateUser;
      this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.params.remarks = '';
      this.params.createUser = '';
      this.params.createDate = '';
      this.params.updateUser = '';
      this.params.updateDate = '';
    }
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    this.params.saveWhTax = [];
    this.params.delWhTax = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        console.log(this.passData.tableData[i])
        this.params.saveWhTax.push(this.passData.tableData[i]);
        this.params.saveWhTax[this.params.saveWhTax.length - 1].createDate = this.ns.toDateTimeString(0);
        this.params.saveWhTax[this.params.saveWhTax.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.params.delWhTax.push(this.passData.tableData[i]);
      }
    }
  }

  saveMtnWhTax(cancel?){
    this.prepareData();
    console.log(this.params)
    this.maintenanceService.saveWhTax(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveWhtax();
      }
    });
  }
}
