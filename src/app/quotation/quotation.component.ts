import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-quotation',
	templateUrl: './quotation.component.html',
	styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
	constructor(private modalService: NgbModal) { }

	ngOnInit() {
	}

	public beforeChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}
	}

	showApprovalModal(content) {
    	this.modalService.open(content, { centered: true, backdrop: 'static', windowClass : "modal-size" });
	}
}
