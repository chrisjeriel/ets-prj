import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import { IntCompAdvInfo } from '../../../_models';



@Component({
    selector: 'app-cust-table',
    templateUrl: './cust-table.component.html',
    styleUrls: ['./cust-table.component.css'],
    providers: [NgbDropdownConfig]
})
export class CustTableComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    @Input() tableData: any[] = [];
    @Input() tHeader: any[] = [];
    @Input() expireFilter: boolean;
    @Input() dataTypes: any[] = [];
    @Input() filters: any[] = [];
    @Input() pageLength: number;
    @Input() from: string = "";
    dataKeys: any[] = [];
    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private quotationService: QuotationService, private router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit(): void {

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: this.pageLength,
        };

        if (this.tableData.length > 0) {
            this.dataKeys = Object.keys(this.tableData[0]);
        } else {
            this.tHeader.push("No Data");
        }
    }

    processData(key: any, data: any) {
        return data[key];
    }

    private onMouseDown(event){
      console.log(event);
      this.start = event.target;
      this.pressed = true;
      this.startX = event.x;
      this.startWidth = $(this.start).parent().width();
      this.initResizableColumns();
    }

    private initResizableColumns() {
         this.renderer.listenGlobal('body', 'mousemove', (event) => {
            if(this.pressed) {
               let width = this.startWidth + (event.x - this.startX);
               $(this.start).parent().css({'min-width': width, 'max-   width': width});
               let index = $(this.start).parent().index() + 1;
               $('.glowTableBody tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width});
            }
         });
         this.renderer.listenGlobal('body', 'mouseup', (event) => {
         if(this.pressed) {
             this.pressed = false;
         }
       });
    }

    onRowClick(event) {
      for(var i = 0; i < event.path[1].cells.length; i++) {
        this.quotationService.rowData[i] = event.path[1].cells[i].innerText;
      }

      for(var i = 0; i < event.path[2].children.length; i++) {
        event.path[2].children[i].style.backgroundColor = "";
      }

      event.path[1].style.backgroundColor = "#67b4fc";
    }

    onRowDblClick(event) {
      for(var i = 0; i < event.path[1].cells.length; i++) {
        this.quotationService.rowData[i] = event.path[1].cells[i].innerText;
      }

      this.quotationService.toGenInfo = "edit";
      this.router.navigate(['/quotation']);
    }
}
