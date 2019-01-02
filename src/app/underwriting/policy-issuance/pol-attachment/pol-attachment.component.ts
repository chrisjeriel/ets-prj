import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolAttachmentInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-attachment',
  templateUrl: './pol-attachment.component.html',
  styleUrls: ['./pol-attachment.component.css'],
  providers: [NgbDropdownConfig]
})
export class PolAttachmentComponent implements OnInit {

  @Input() alterationFlag;

  tableData: any[] = [];
  tHeader: any[] = ["File Path", "Description", "Actions"];
  nData: PolAttachmentInfo = new PolAttachmentInfo(null, null);

  passDataAttachment: any = {
        tHeader: ["File Name", "Description", "Actions"],
        dataTypes: [
                    "text", "text"
                   ],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
    };

  constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
  ) {
    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() {
    this.titleService.setTitle("Pol | Attachment");
    this.passDataAttachment.tableData = this.underwritingService.getPolAttachment();
  }

}
