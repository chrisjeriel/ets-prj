import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit {

    @Input() modalSize: string = "modal-size";
    
    content1: any = "";
    content: any;

    @Input() mdlConfig = {
        mdlType: "",
        mdlOpener: "",
        mdlBtnAlign: "",
        mdlSize: "",
        confirmationMsg: "",
        successMsg: ""
    };
        /*
            mdlType: confirmation, success, error, custom       DEFAULT: custom
            mdlOpener: button, a, div, icon;                    DEFAULT: button
            mdlBtnAlign: left, center, right;                   DEFAULT: right
            mdlSize: sm, md, lg;                                DEFAULT: md
            mdlTitle: ""                                        DEFAULT: null

        */
    @Input() btnTitle: string = "Open Modal from Child";
    
    @ViewChild('content') test: any;
    content: EventEmitter<Object> = new EventEmitter<Object>();

    constructor(private modalService: NgbModal) { }

    ngOnInit() {

    }
    ngAfterViewInit(){
        //console.log(this.test);
    }

    open(content) {
        this.content = content;
        this.modalService.dismissAll();
        this.modalService.open(this.content, { centered: true, backdrop: 'static', windowClass : this.modalSize });
    }


}