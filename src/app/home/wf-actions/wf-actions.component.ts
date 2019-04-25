import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wf-actions',
  templateUrl: './wf-actions.component.html',
  styleUrls: ['./wf-actions.component.css']
})
export class WfActionsComponent implements OnInit {
  @ViewChild('content') contentMdl : any;

  content: any ;
  disablebtnBool: boolean;
  disableAssignTo: boolean;
  disableAssignToMany: boolean;

userInfo:any = {
	userId: null,
	userName: null
}

  constructor(config: NgbModalConfig,
     private modalService: NgbModal) { }

ngOnInit() {
  	this.clear('disable');
}

open(content) {
    this.content = content;
    this.modalService.open(this.content, { centered: true , windowClass : 'modal-size'} );
}

handleRadioBtnChange(event){
   	this.disablebtnBool = false;
   	switch(event.target.value) { 
   		case '1': { 
        console.log('1'); 
        this.clear('enable');
        break; 
        } 
        case '2': { 
        this.disableAssignTo = false;
        $("a").removeClass('disabled-a').addClass('');
        this.disableAssignToMany = true;
        break; 
        } 
        case '3': { 
        this.disableAssignTo = true;
        $("a").removeClass('').addClass('disabled-a');
        this.disableAssignToMany = false;
        break; 
        } 
        case '4': { 
        console.log('4'); 
        this.clear('enable');
        break;
        } 
         default: { 
        //statements; 
        break; 
        } 
    }
}

cancelReminder(){
   	this.clear('disable');
}

clear(obj){
	$("a").removeClass('').addClass('disabled-a');
  	this.disableAssignTo = true;
  	this.disableAssignToMany = true;

  	if (obj == 'disable'){
  		this.disablebtnBool = true;
    } else {
    	this.disablebtnBool = false;
    }
}

showUsersLOV(){
	$('#usersLOV #modalBtn').trigger('click');
    $('#usersLOV #modalBtn').addClass('ng-dirty');
}

setPreparedBy(event){
	console.log(event);

	this.userInfo.userId = event.userId;
	this.userInfo.userName = event.userName;

	this.open(this.contentMdl);
}

blur(event){
	$("a").removeClass('disabled-a').addClass('');
}

}
