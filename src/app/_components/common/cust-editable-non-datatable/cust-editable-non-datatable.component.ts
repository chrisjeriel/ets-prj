import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-cust-editable-non-datatable',
    templateUrl: './cust-editable-non-datatable.component.html',
    styleUrls: ['./cust-editable-non-datatable.component.css']
})
export class CustEditableNonDatatableComponent implements OnInit {

    @Input() tableData: any[] = [];
    @Input() tHeader: any[] = [];
    @Input() magnifyingGlass: any[] = [];
    @Input() options: any[] = [];
    @Input() dataTypes: any[] = [];
    @Input() nData;
    @Input() checkFlag;
    @Input() selectFlag;
    @Input() addFlag;
    @Input() editFlag;
    @Input() deleteFlag;
    @Input() checkboxFlag;
    dataKeys: any[] = [];
    values: any[][];
    
    
    constructor() { }

    ngOnInit() {
        console.log(this.tableData.length);
        console.log(this.tHeader.length);
        if (this.tableData.length > 0) {
            this.dataKeys = Object.keys(this.nData);
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

}
