export class NotesReminders {
	type: string;
    details: string;
	alarmUser: string;
	alarmDate: Date;
	alarmTime: string;
	status: string;
	createdBy: string;
	dateCreated: Date;

	constructor(type: string,details: string,alarmUser: string,alarmDate: Date,alarmTime: string,status: string,createdBy: string,dateCreated: Date) {
		this.type = type;
		this.details = details;
		this.alarmUser = alarmUser;
		this.alarmDate = alarmDate;
		this.alarmTime = alarmTime;
		this.status = status;
		this.createdBy = createdBy;
		this.dateCreated = dateCreated;
	}

}