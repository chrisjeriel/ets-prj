import { Component, OnInit } from '@angular/core';
import { NotesService, UploadService } from '@app/_services';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

    constructor(private upload: UploadService, private notes : NotesService) { }

    ngOnInit() {
    }

    //upload


    
    uploadMethod(event){
      //upload
      for(let file of event.target.files){
        if (file.name.length == 0) {
          	alert("No file selected!");
          	return;
        }

        if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type != 'application/vnd.ms-excel' && file.type != '.csv') {
        	alert("Invalid file for uploading!");
          	return;
        }

        /*var newFile = new File([file], date + file.name, {type: file.type});*/
        var d = new Date();

        console.log(file);


        this.upload.uploadFileToDB(file, d, 'acct_entries', 'ACIT', 'CV', '3', this.notes.getCurrentUser())
          .subscribe(
            event => {
              if (event.type == HttpEventType.UploadProgress) {
                const percentDone = Math.round(100 * event.loaded / event.total);
                console.log(`File is ${percentDone}% loaded.`);
              } else if (event instanceof HttpResponse) {
                console.log('File is completely loaded!');
              }
            },
            (err) => {
              console.log("Upload Error:", err);
            }, () => {
              console.log("Upload done");
            }
          )
        }
    }

}
