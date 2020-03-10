import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, PivotView } from '@syncfusion/ej2-angular-pivotview';
import { Button } from '@syncfusion/ej2-buttons';
// import { Pivot_Data } from './datasource';
import { MaintenanceService, NotesService, PrintService } from '@app/_services'


@Component({
  selector: 'app-pivot',
  templateUrl: './pivot.component.html',
  styleUrls: ['./pivot.component.css']
})
export class PivotComponent implements OnInit {

  public width: string;
  public dataSourceSettings: IDataOptions;
  public button: Button;

    @ViewChild('pivotview')
    public pivotGridObj: PivotView;

    constructor(private ms : MaintenanceService){}

    ngOnInit(): void {

    	this.ms.getExtractToCsv('PMMSC')
    	.subscribe(data => {
    		console.log(data);
    		this.dataSourceSettings = {
	            dataSource: data['listData'],
	            expandAll: false,
	            columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
	            values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
	            rows: [{ name: 'Country' }, { name: 'Products' }],
	            formatSettings: [{ name: 'Amount', format: 'C0' }],
	            filters: [],
	            valueSortSettings: { headerText: 'FY 2015##Q1##Amount', headerDelimiter: '##', sortOrder: 'Descending' }
	        };
	        this.width = '100%';

	        this.button = new Button({ isPrimary: true });
	        this.button.appendTo('#export');

	        this.button.element.onclick = (): void => {
	            this.pivotGridObj.excelExport();
	        };
    	});

        
    }

}
