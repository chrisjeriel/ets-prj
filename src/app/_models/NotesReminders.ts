export class NotesReminders {
	type: string;
    details: string;
	alarmUser: string;
	alarmDate: string;
	alarmTime: string;
	status: string;
	createdBy: string;
	dateCreated: string;

	constructor(type: string,details: string,alarmUser: string,alarmDate: string,alarmTime: string,status: string,createdBy: string,dateCreated: string) {
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