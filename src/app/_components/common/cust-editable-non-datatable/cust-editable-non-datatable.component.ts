import { Component, OnInit, Input, Output, EventEmitter, Renderer } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-cust-editable-non-datatable',
    templateUrl: './cust-editable-non-datatable.component.html',
    styleUrls: ['./cust-editable-non-datatable.component.css'],
    providers: [NgbDropdownConfig]
})
export class CustEditableNonDatatableComponent implements OnInit {

    @Input() tableData: any[] = [];
    @Output() tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() tHeader: any[] = [];
    @Input() magnifyingGlass: any[] = [];
    @Input() options: any[] = [];
    @Input() dataTypes: any[] = [];
    @Input() opts: any[] = [];
    @Input() nData;
    @Input() checkFlag;
    @Input() selectFlag;
    @Input() addFlag;
    @Input() editFlag;
    @Input() deleteFlag;

    @Input() checkboxFlag;
    @Input() columnId;
    @Input() pageLength;

    @Input() editedData: any[] = [];
    @Output() editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();

    dataKeys: any[] = [];
    tableLoad: boolean = true;
    nextId: number = 0;
    exists:Boolean = false;

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;


    constructor(config: NgbDropdownConfig, public renderer: Renderer) { 
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        if (this.tableData.length > 0) {
            this.dataKeys = Object.keys(this.tableData[0]);
        } else {
            this.tHeader.push("No Data");
        }
    }

    processData(key: any, data: any) {
        return data[key];
    }

    onClickAdd() {
        this.tableData.push(this.nData);
    }

    onClickDelete() {
        this.tableData.pop();
    }
    private onMouseDown(event){
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
        this.rowClick.next(event);
    }

    onRowDblClick(event) {
        this.rowDblClick.next(event);
    }
}
