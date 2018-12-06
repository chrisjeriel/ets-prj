import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

    /*
        App Modal Attributes (not final, gonna convert it to arraylist):
        <app-modal>
            [btnTitle] = "Open Modal"           -> name of button that will open the modal
            [modalTitle] = "Sample Title"       -> set the modal title
            [modalCustTable] = "true"           -> Set to true if will use custom table. Must set the [tHeader], 
                                                   [tableData], etc with values
            [modalCustTable] = "true"           -> Set to true if will use custom editable table. Must set the 
                                                   [tHeader], [tableData], etc with values.
            [pageLength] = 10                   -> Set the no of rows of the table before going in to next page.
            [modalProgressBar] = "true"         -> Set to true if will use progress bar.
            [textFlag] = "true"                 -> Set to true if will use text. Must set value to [modalText]
            [btnModalOk] = "true"               -> Set to true if will use Ok button.
            [btnModalYes] = "true"              -> Set to true if will use Yes button.
            [btnModalNo] = "true"               -> Set to true if will use No button.
            [btnModalCancel] = "true"           -> Set to true if will use Cancel button.
            [modalSize] = "sm | md | lg | xl"   -> Set the modal size.
        </app-modal>
    */

    //for tables
    @Input() tableData: any[] = [];
    @Output() tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() tHeader: any[] = [];
    @Input() magnifyingGlass: any[] = [];
    @Input() options: any[] = [];
    @Input() dataTypes: any[] = [];
    @Input() opts: any[] = [];
    @Input() nData;
    @Input() checkFlag;
    @Input() selectFlag;
    @Input() addFlag;
    @Input() editFlag;
    @Input() deleteFlag;
    @Input() checkboxFlag;
    @Input() columnId;
    @Input() pageLength = 3;
    @Input() filters: any[] = [];

    //modal activator
    @Input() btnTitle: string = "Button Modal";

    //modal title
    @Input() modalTitle: string = "Sample Title";

    //modal body
    @Input() modalCustTable: boolean = false;
    @Input() modalCustEditableTable: boolean = false;
    @Input() modalProgressBar: boolean = true;
    @Input() textFlag: boolean = false;
    @Input() modalText: string = "Sample";

    //modal footer
    @Input() btnModalOk: boolean = true;
    @Input() btnModalCancel: boolean = true;
    @Input() btnModalYes: boolean;
    @Input() btnModalNo: boolean;

    @Input() progress: number = 90;

    @Input() modalSize: string = "modal-size"

    content: any;
    
    constructor(private modalService: NgbModal) { }

    ngOnInit() {

    }

    open(content) {
        this.content = content;
        this.modalService.dismissAll();
        this.modalService.open(this.content, { centered: true, backdrop: 'static', windowClass : this.modalSize });
    }
    


}