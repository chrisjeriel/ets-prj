import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {NgbModal,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy/*, AfterViewInit*/ {

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
    @Input() disabled:boolean = false;

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

    ngOnDestroy(){
        if(this.modalRef != undefined){
            this.modalRef.close();
        }
    }


    open(content?) {
        $('.globalLoading').css('display','none');
        this.modalService.dismissAll();
        this.modalRef = this.modalService.open(this.test, this.mdlOptions);
        this.modalOpened.emit();
    }

    openNoClose(content?){
        $('.globalLoading').css('display','none');
        this.modalRef = this.modalService.open(this.test, this.mdlOptions);
        // this.modalRef.zIndex = 
        // setTimeout(a=>{

        //     if($('.modal').length>1){
        //         $('.modal-backdrop')[$('.modal-backdrop').length-1].style.zIndex = 1051+$('.modal').length+'';
        //         $('.modal')[$('.modal-backdrop').length-1].style.zIndex = 1051+$('.modal').length+1+'';
        //     }    

        // },0)
        this.modalOpened.emit();
    }

    closeModal(){
        this.modalRef.dismiss();
        this.modalRef = undefined;
    }


}