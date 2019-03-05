import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { ModuleInfo } from '@app/_models';

@Component({
  selector: 'app-security-modules',
  templateUrl: './security-modules.component.html',
  styleUrls: ['./security-modules.component.css']
})
export class SecurityModulesComponent implements OnInit {

  PassData: any = {
      tableData: this.securityServices.getModuleInfo(),
      tHeader: ['Module ID', 'Description', 'Module Group','Remarks'],
      dataTypes: ['text', 'text', 'select','text'],
      nData: new ModuleInfo(null,null,null,null),
      pageID: 4,
      addFlag: true,
      deleteFlag: true,
      pageLength:10,
      magnifyingGlass:['userGroup'],
      searchFlag: true,
      opts: [{
          selector: 'moduleGroup',
          vals: ['Quotation', 'Testing'],
      }],
      widths: [],
    }

    constructor(private securityServices: SecurityService) { }

    ngOnInit() {
    }

}
