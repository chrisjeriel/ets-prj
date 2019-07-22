import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';

@Component({
  selector: 'app-bordereaux',
  templateUrl: './bordereaux.component.html',
  styleUrls: ['./bordereaux.component.css']
})
export class BordereauxComponent implements OnInit {
	@ViewChild('lineLov') lineLOV: MtnLineComponent;
	@ViewChild('cessionLov') cessionLOV: MtnTypeOfCessionComponent;

	dateParam: string = 'period';
	extnType: string = 'O';
	extnSubType: string = 'osLossDate';
	clmHistType: string = 'loss';
	perLine: boolean = true;
	perTypeOfCession: boolean = true;
	lineCd: string = '';
	lineDesc: string = '';
	cessionId: string = '';
	cessionDesc: string = '';
	periodFrom: string = '';
	periodTo: string = '';
	asOf: string = '';

	constructor(private titleService: Title, private route: ActivatedRoute, private router: Router, private ns: NotesService, private ms: MaintenanceService) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | Bordereaux");
	}

	onTabChange($event: NgbTabChangeEvent) {
		if($event.nextId === 'Exit') {
		  	$event.preventDefault();
		  	this.router.navigateByUrl('');
		}
	}

	setExtnSubType() {
		this.extnSubType = this.extnType == 'O' ? 'osLossDate' : 'lpTranDate';
	}

	showLineLOV() {
		this.lineLOV.modal.openNoClose();
	}

	setLine(ev) {
		this.ns.lovLoader(ev.ev, 0);

		this.lineCd = ev.lineCd;
		this.lineDesc = ev.description;
	}

	showCessionLOV() {
		this.cessionLOV.modal.openNoClose();
	}

	setCession(ev) {
		this.ns.lovLoader(ev.ev, 0);

		this.cessionId = ev.cessionId;
		this.cessionDesc = ev.description;
	}

	checkCode(ev, str) {
		this.ns.lovLoader(ev, 1);

		if(str == 'line') {
			this.lineLOV.checkCode(this.lineCd, ev);
		} else if(str == 'cession') {
			this.cessionLOV.checkCode(this.cessionId, ev);
		}
	}
}
