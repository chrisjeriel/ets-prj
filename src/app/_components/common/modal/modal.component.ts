import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild} from '@angular/core';
import {NgbModal,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit/*, AfterViewInit*/ {

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

    @Input() modalSize: string = "modal-size";
    @Input() btnTitle: string = "Open Modal from Child";
    
    @ViewChild('content') test: any;
    content: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() modalOpened: EventEmitter<Object> = new EventEmitter<Object>();
    modalRef: NgbModalRef;
    constructor(private modalService: NgbModal) { }

    ngOnInit() {

    }
    ngAfterViewInit(){
        
    }


    open(content) {
        $('.globalLoading').css('display','none');
        this.modalService.dismissAll();
        this.modalService.open(this.test, { centered: true, backdrop: 'static', windowClass : this.modalSize });
        this.modalOpened.emit();
    }

    openNoClose(content?){
        $('.globalLoading').css('display','none');
        this.modalRef = this.modalService.open(this.test, { centered: true,  windowClass : this.modalSize });
        this.modalOpened.emit();
    }

    closeModal(){
        this.modalRef.dismiss();
    }


}