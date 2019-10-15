import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-withhodling-tax',
  templateUrl: './withhodling-tax.component.html',
  styleUrls: ['./withhodling-tax.component.css']
})
export class WithhodlingTaxComponent implements OnInit {
   
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
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
        creditableTag : '',
        fixedTag : '',
        activeTag : '',
        createUser : '',
        createDate : '',
        updateUser : '',
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
      uneditable: [true,true,true,true,true,true,true,true,true,true],
      widths: [60,70,390,115,75,110,90,65,50,67],
      keys: ['whtaxId', 'taxCd', 'taxName', 'taxType', 'rate', 'defaultAcitGl','defaultAcseGl', 'creditableTag','fixedTag', 'activeTag'],
  }

  params = {
    remarks: ''
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveWhtax();
  }

  retrieveWhtax(){
    this.maintenanceService.getWhTax(null,null,null).subscribe((data:any) => {
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
    }else{
      this.params.remarks = '';
    }
    
  }
}
