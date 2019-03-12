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
    mdlOptions:any;

    constructor(private modalService: NgbModal) { }

    ngOnInit() {
        this.mdlOptions = {
            centered: true, 
            backdrop: 'static', 
            windowClass : this.modalSize
        }

    }
    ngAfterViewInit(){
        
    }


    open(content) {
        $('.globalLoading').css('display','none');
        this.modalService.dismissAll();
        this.modalRef = this.modalService.open(this.test, this.mdlOptions);
        this.modalOpened.emit();
    }

    openNoClose(content?){
        $('.globalLoading').css('display','none');
        this.modalRef = this.modalService.open(this.test, this.mdlOptions);
        if($('.modal').length>1){
            $('.modal-backdrop')[$('.modal-backdrop').length-1].style.zIndex = 1051+$('.modal').length+'';
        }    
        this.modalOpened.emit();
    }

    closeModal(){
        this.modalRef.dismiss();
    }


}