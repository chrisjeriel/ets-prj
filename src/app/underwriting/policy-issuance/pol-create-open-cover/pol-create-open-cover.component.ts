import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pol-create-open-cover',
    templateUrl: './pol-create-open-cover.component.html',
    styleUrls: ['./pol-create-open-cover.component.css']
})
export class PolCreateOpenCoverComponent implements OnInit {

    quoteLine: any;
    
    constructor(private titleService: Title, private router: Router) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Create Open Cover");
    }

    navigateToGenInfo(){
        if (this.quoteLine === 'CAR' ||
            this.quoteLine === 'EAR' ||
            this.quoteLine === 'EEI' ||
            this.quoteLine === 'CEC' ||
            this.quoteLine === 'MBI' ||
            this.quoteLine === 'BPV' ||
            this.quoteLine === 'MLP' ||
            this.quoteLine === 'DOS') {
            this.router.navigate(['/create-open-cover-letter', { line: this.quoteLine }], { skipLocationChange: true });
        }
    }
}
