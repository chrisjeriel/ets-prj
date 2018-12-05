import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-post',
  templateUrl: './pol-post.component.html',
  styleUrls: ['./pol-post.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbProgressbarConfig]
})
export class PolPostComponent implements OnInit {

  progress: number = 0;	
 
  constructor(config: NgbModalConfig, configprogress: NgbProgressbarConfig, private modalService: NgbModal) {
  	config.backdrop = 'static';
    config.keyboard = false;
    configprogress.max = 100;
    configprogress.striped = true;
    configprogress.animated = true;
    configprogress.height = '20px';
   }

  ngOnInit() {		


  }

  

   

 


  
}
