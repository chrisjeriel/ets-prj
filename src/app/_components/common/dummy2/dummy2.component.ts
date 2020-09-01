
import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalComponent } from '../../../_components/common/modal/modal.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-dummy2',
    templateUrl: './dummy2.component.html',
    styleUrls: ['./dummy2.component.css']
})
export class DummyComponent2 implements OnInit {
    //@ViewChild('content') content;
    @ViewChild(ModalComponent) modalComp: ModalComponent;


    constructor(private modalService: NgbModal) { 
    }

    ngOnInit() {
       
    }

    open(){

    }
    
    openAgain(){

    }

    // random(){
    //     var randomWords = require('random-words');
    //     console.log(randomWords());
    // }
}
