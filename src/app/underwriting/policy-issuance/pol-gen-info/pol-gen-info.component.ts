import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-gen-info',
  templateUrl: './pol-gen-info.component.html',
  styleUrls: ['./pol-gen-info.component.css']
})
export class PolGenInfoComponent implements OnInit, OnDestroy {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];

  @Input() mode;
  @Input() alteration: boolean = false;
  line: string;
  private sub: any;
  hcChecked: boolean = false;
  ocChecked: boolean = false;
  decChecked: boolean = false;
  typeOfCession: string = "";

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
    private underwritingService: UnderwritingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | General Info");
    this.tHeader.push("Item No", "Description of Items");
    this.dataTypes.push("text", "text");
    this.filters.push("Item No", "Desc. of Items");
    this.tableData = this.underwritingService.getItemInfoData();

    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showItemInfoModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  toggleRadioBtnSet() {
    document.getElementById('radioBtnSet').style.background = (!this.decChecked) ? '#ffffff' : '#e9ecef';
  }
}