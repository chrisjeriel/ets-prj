import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-policy-issuance-alt',
    templateUrl: './policy-issuance-alt.component.html',
    styleUrls: ['./policy-issuance-alt.component.css']
})
export class PolicyIssuanceAltComponent implements OnInit {

    alteration: boolean;
    constructor(private modalService: NgbModal) {
        this.alteration = true;
    }

    ngOnInit() {
    }
    public beforeChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'print-tab') {
            $event.preventDefault();
        }
    }

    showApprovalModal(content) {
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    }
}
