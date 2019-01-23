export class DummyInfo {
	id: number;
    firstName: string;
	lastName: string;
	middleName: string;
	gender: string;
	age: number;
	birthDate: string;

	constructor(id: number,firstName: string,lastName: string,middleName: string,gender: string,age: number,birthDate: string) {
		this.id = (id == null ? 0 : id);
		this.firstName = (firstName == null ? '' : firstName);
		this.lastName = (lastName == null ? '' : lastName);
		this.middleName = (middleName == null ? '' : middleName);
		this.gender = (gender == null ? '' : gender);
		this.age = (age == null ? 0 : age);
		this.birthDate = (birthDate == null ? '' : birthDate);
	}

}

export class EditableDummyInfo{
	id: number;
    firstName: string;
	lastName: string;
	middleName: string;
	gender: string;
	age: number;
	birthDate: Date;

	constructor(id: number,firstName: string,lastName: string,middleName: string,gender: string,age: number,birthDate: Date) {
		this.id = (id == null ? 0 : id);
		this.firstName = (firstName == null ? '' : firstName);
		this.lastName = (lastName == null ? '' : lastName);
		this.middleName = (middleName == null ? '' : middleName);
		this.gender = (gender == null ? '' : gender);
		this.age = (age == null ? 0 : age);
		this.birthDate = (birthDate == null ? new Date() : birthDate);
	}

}