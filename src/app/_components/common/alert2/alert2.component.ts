import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert2Service } from '@app/_services'

@Component({
  selector: 'alert2',
  templateUrl: './alert2.component.html',
  styleUrls: ['./alert2.component.css']
})
export class Alert2Component implements OnInit {

  private subscription: Subscription;
    message: any;
    timeout:any;

    constructor(private alertService: Alert2Service) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
        	clearTimeout(this.timeout);
            this.message = message;
        	this.timeout = setTimeout(a=>{this.message = undefined},10000)
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}