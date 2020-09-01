export class UsersInfo {
	userId: string
	userName: string
	userGroup: string
	description: string
	active: string
	email: string
	remarks: string

	constructor(userId: string,userName: string,userGroup: string,description: string,active: string,email: string,remarks: string){
		this.userId = userId
		this.userName = userName
		this.userGroup = userGroup
		this.description = description
		this.active = active
		this.email = email
		this.remarks = remarks
	}
}