import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { NgbModalConfig, NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-post',
  templateUrl: './pol-post.component.html',
  styleUrls: ['./pol-post.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbProgressbarConfig]
})
export class PolPostComponent implements OnInit {

  TabName:  any[] = ["Gen Info","Coverage","OtherRates","Endorsement","CoInsurance","Distribution","Attachment"];
  showTab: number = 0;
  progress: number = 0;	
  alterNum: number = 0;
  @ViewChild('alterationFlag') alteration;
  @ViewChild('content') content;
  @ViewChild('successinfo') successinfo;
  @Input() alterationFlag ;

  constructor(config: NgbModalConfig, configprogress: NgbProgressbarConfig, private modalService: NgbModal) {
  	config.backdrop = 'static';
    config.keyboard = false;
    configprogress.max = 100;
    configprogress.striped = true;
    configprogress.animated = true;
    configprogress.height = '20px';
   }

  ngOnInit() {	
    if (this.alteration='true'){
       this.getAlterNum();
    }
    setTimeout(() => {
      this.modalService.open(this.content,  { centered: true, windowClass : 'modal-size'});
      this.fakeProgress(); 
    });


  }

   fakeProgress(){
      setTimeout(() => {
           if(this.progress < 100 || this.showTab <= this.TabName.length ){
             this.progress +=25;
             this.showTab = ++this.showTab;
             this.fakeProgress();
           } else { 
             this.showTab = 0;
             this.progress = 0;
             this.modalService.dismissAll(true);
                 this.modalService.open(this.successinfo,  { centered: true , windowClass : 'modal-size'});
           }
    },100);

    }

    getAlterNum(){
      this.alterNum = 1;
    }
    

  	

   
}
