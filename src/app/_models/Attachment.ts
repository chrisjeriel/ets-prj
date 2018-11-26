export class AttachmentInfo {
	filePath: string;
	description: string;
	tableCode: string;
	action: string;

	constructor(filePath: string,description: string,tableCode: string, action: string){
		this.filePath = filePath;
		this.description = description;
		this.tableCode = tableCode;
		this.action = action;
	}

}