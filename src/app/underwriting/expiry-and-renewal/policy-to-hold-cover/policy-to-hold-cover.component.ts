import { Component, OnInit } from '@angular/core';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';
import { Title } from '@angular/platform-browser';
import { NotesService } from '@app/_services';

@Component({
	selector: 'app-policy-to-hold-cover',
	templateUrl: './policy-to-hold-cover.component.html',
	styleUrls: ['./policy-to-hold-cover.component.css']
})
export class PolicyToHoldCoverComponent implements OnInit {

	private policyHoldCoverInfo: PolicyHoldCoverInfo;

	constructor(private titleService: Title, private noteService: NotesService) { }

	periodFrom: any;

	ngOnInit() {
		this.titleService.setTitle("Pol | Policy to Hold Cover");
		this.policyHoldCoverInfo = new PolicyHoldCoverInfo();
		this.policyHoldCoverInfo.policyNo = 1;
		this.policyHoldCoverInfo.insured = "MOCK TEST";
		this.policyHoldCoverInfo.risk = "MOCK TEST";
		this.policyHoldCoverInfo.holdCoverNo = 1;
		this.policyHoldCoverInfo.compRefHoldCoverNo = 1;
		this.policyHoldCoverInfo.status = "MOCK TEST";
		this.policyHoldCoverInfo.periodFrom = new Date();
		this.policyHoldCoverInfo.periodTo = new Date();
		this.policyHoldCoverInfo.requestedBy = "MOCK TEST";
		this.policyHoldCoverInfo.requestDate = new Date();

	}
	test(){
		console.log(this.noteService.toDateTimeString(this.periodFrom));
	}

}
