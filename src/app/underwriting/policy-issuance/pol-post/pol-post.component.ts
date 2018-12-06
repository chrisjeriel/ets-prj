import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbModalConfig, NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-post',
  templateUrl: './pol-post.component.html',
  styleUrls: ['./pol-post.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbProgressbarConfig]
})
export class PolPostComponent implements OnInit {

  progress: number = 0;	
  @ViewChild('content') content;
  @ViewChild('successinfo') successinfo;

  constructor(config: NgbModalConfig, configprogress: NgbProgressbarConfig, private modalService: NgbModal) {
  	config.backdrop = 'static';
    config.keyboard = false;
    configprogress.max = 100;
    configprogress.striped = true;
    configprogress.animated = true;
    configprogress.height = '20px';
   }

  ngOnInit() {	
    setTimeout(() => {
      this.modalService.open(this.content,  { centered: true ,  backdrop: 'static', windowClass : "xl"});
      this.fakeProgress();  
    });


  }

   fakeProgress(){
      setTimeout(() => {
           if(this.progress < 100){
             this.progress +=30;
             this.fakeProgress();
           } else { 
             this.progress = 0;
             this.modalService.dismissAll(true);
                 this.modalService.open(this.successinfo,  { centered: true ,  backdrop: 'static', windowClass : "xl"});
           }
    },500);

    }

  	

   
}
