import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfoComponent } from '@app/quotation/general-info/general-info.component';



@Component({
	selector: 'app-quotation',
	templateUrl: './quotation.component.html',
	styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
	constructor(private route: ActivatedRoute,private modalService: NgbModal, private titleService: Title, private router: Router) { }
	docTitle: string = "";
	sub: any;
	line: string;

	quoteInfo = {
		quoteId: '',
		quotationNo: '',
		riskName: '',
		insuredDesc: ''
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
        });        
	}

	showApprovalModal(content) {
		this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
	}

	onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 

  		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}
 
  	}

  	checkQuoteInfo(event){  		
  		this.quoteInfo = event;
  	}

	// setDocumentTitle(event) {
	// 	console.log(event.target.closest('div').innerText);
	// 	this.docTitle = event.target.innerText;
	// 	if (this.docTitle == "General Info") {
	// 		this.titleService.setTitle("Quo | General Info");
	// 	} else if (this.docTitle == "Coverage") {
	// 		this.titleService.setTitle("Quo | Coverage");
	// 	} else if (this.docTitle == "Quote Option") {
	// 		this.titleService.setTitle("Quo | Quote Option");
	// 	} else if (this.docTitle == "Endorsement") {
	// 		this.titleService.setTitle("Quo | Endorsement");
	// 	} else if (this.docTitle == "ALOP") {
	// 		this.titleService.setTitle("Quo | ALOP");
	// 	} else if (this.docTitle == "Internal Competition") {
	// 		this.titleService.setTitle("Quo | Internal Competition");
	// 	} else if (this.docTitle == "Attachment") {
	// 		this.titleService.setTitle("Quo | Attachment");
	// 	}
	// }
}
