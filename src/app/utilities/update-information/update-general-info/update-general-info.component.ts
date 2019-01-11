import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-general-info',
  templateUrl: './update-general-info.component.html',
  styleUrls: ['./update-general-info.component.css']
})
export class UpdateGeneralInfoComponent implements OnInit {
  typeOfCession:string='';
  
  constructor() { }

  ngOnInit() {
  }

  checkRetrocession(){
  	if(this.typeOfCession.toLowerCase() == 'retrocession')
  		return true;
  	return false;
  }

}
