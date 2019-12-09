import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotesService, UploadService } from '@app/_services';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

    @Output() emitMessage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

    dialogIcon: string = '';
    dialogMessage: string = '';

    constructor(private upload: UploadService, private notes : NotesService) { }

    ngOnInit() {
    }

    //upload

    //Neco was here.
    validateFiles(event){
      for(let file of event.target.files){
        if (file.name.length == 0) {
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'No file selected!';
          //this.emitMessage.emit(this.dialogMessage);
          //this.successDiag.open();
          return this.dialogMessage;
        }

        else if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type != 'application/vnd.ms-excel' && file.type != '.csv') {
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Invalid file for uploading!';
          //this.emitMessage.emit(this.dialogMessage);
          //this.successDiag.open();
          return this.dialogMessage;
        }
      }
      return '';
    }
    //Neco's influence ends here.
    
    uploadMethod(event, table?, acctType?, tranClass?, tranId?){
      //upload
      for(let file of event.target.files){
        /*if (file.name.length == 0) {
          	alert("No file selected!");
          	return;
        }

        if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type != 'application/vnd.ms-excel' && file.type != '.csv') {
        	alert("Invalid file for uploading!");
          	return;
        }*/

        /*var newFile = new File([file], date + file.name, {type: file.type});*/
        var d = new Date();
        var tbl = table == undefined || table == null ? 'acct_entries' : table;

        console.log(file);


        this.upload.uploadFileToDB(file, d, tbl, acctType, tranClass, tranId, this.notes.getCurrentUser())
          .subscribe(
            event => {
              console.log(event);
              if (event.type == HttpEventType.UploadProgress) {
                const percentDone = Math.round(100 * event.loaded / event.total);
                console.log(`File is ${percentDone}% loaded.`);
              } else if (event instanceof HttpResponse) {
                if(event.body.errorList.length !== 0){
                  this.emitMessage.emit({error: 'Error', message: event.body.errorList[0].errorMessage});
                  console.log(event.body.errorList[0]);
                }else{
                  console.log('File is completely loaded!');
                  this.emitMessage.emit('Success');
                }
              }
            },
            (err) => {
              console.log("Upload Error:", err);
              //this.emitMessage.emit(err);
            }, () => {
              console.log("Upload done");
            }
          )
        }
    }

}
