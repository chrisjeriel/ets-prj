export class DummyInfo {
	id: number;
    firstName: string;
	lastName: string;
	middleName: string;
	gender: string;
	age: number;
	birthDate: string;

	constructor(id: number,firstName: string,lastName: string,middleName: string,gender: string,age: number,birthDate: string) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.middleName = middleName;
		this.gender = gender;
		this.age = age;
		this.birthDate = birthDate;
	}

}