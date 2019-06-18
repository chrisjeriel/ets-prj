import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claims-attachment',
  templateUrl: './claims-attachment.component.html',
  styleUrls: ['./claims-attachment.component.css']
})
export class ClaimsAttachmentComponent implements OnInit {
  passData: any = {
  	tableData:[],
  	tHeader:['File Name', 'Description', 'Actions'],
  	widths:['auto','auto',71],
  	checkFlag:true,
  	addFlag:true,
  	deleteFlag:true,
  	infoFlag:true,
  	paginateFlag:true,
  	nData:[null,null]
  };

  constructor() { }

  ngOnInit() {
  }

}
