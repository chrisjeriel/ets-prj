import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-open-cover',
  templateUrl: './open-cover.component.html',
  styleUrls: ['./open-cover.component.css']
})
export class OpenCoverComponent implements OnInit, OnDestroy {

  quoteData: any;
  inquiryFlag: boolean = false;
  sub: any;

  constructor(private route: ActivatedRoute,private modalService: NgbModal, private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
            if(params['inquiryFlag'] === 'true'){
              this.inquiryFlag = true;
            }else{
              this.inquiryFlag = false;
            }
        });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  public beforeChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}
	}

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

  quoteDataF(data){
    this.quoteData = data;
    console.log(data);
  }
}
