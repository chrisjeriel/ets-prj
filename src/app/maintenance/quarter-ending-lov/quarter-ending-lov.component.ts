import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MaintenanceService } from '@app/_services';


@Component({
  selector: 'app-quarter-ending-lov',
  templateUrl: './quarter-ending-lov.component.html',
  styleUrls: ['./quarter-ending-lov.component.css']
})
export class QuarterEndingLovComponent implements OnInit {
  
  @ViewChild('modal') modal: ModalComponent; 
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService) { }

  quarters: any[] = [];
  year:any;
  cities:any;

  ngOnInit() {
  }

  openModal(){
  	this.maintenanceService.getMtnParameters('V').subscribe((data : any) => {
  		console.log(data);
  		for( var i = 0; i < data.parameters.length; i++){
  			if(data.parameters[i].paramName == 'FIRST_QTR_ENDING' ||
  			  data.parameters[i].paramName == 'SECOND_QTR_ENDING' ||
  			  data.parameters[i].paramName == 'THIRD_QTR_ENDING' ||
  			  data.parameters[i].paramName == 'FOURTH_QTR_ENDING' ){
  				this.quarters.push(data.parameters[i].paramValueV);
  			}
  		}
  		this.quarters = this.quarters.sort();

  		this.year = new Date().getFullYear();
      this.cities = [{label:'2019', value:'2019'},{label:'2020',value:'2020'},{label:'2021',value:'2021'}]
  	});
  }

  slicer(slice){
  	return String(slice).slice(0,2) + '/' + String(slice).slice(2,4);
  }
  

  confirm(){
    this.selectedData.emit();
  }

}
