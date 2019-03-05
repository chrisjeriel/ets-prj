import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.css']
})
export class CancelButtonComponent implements OnInit {
  @ViewChild('saveModal') saveModal: ModalComponent;
  @Input() url:any;
  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  constructor(private router:Router) { }

  ngOnInit() {
  }

  clickCancel(){
  	if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
  		this.saveModal.openNoClose();
  	}else{
  	  this.router.navigate([this.url]);
  	}
  }

  onNo(){
  	this.router.navigate([this.url]);
  }

  onClickYes(){
  	this.onYes.emit();
  }

}
