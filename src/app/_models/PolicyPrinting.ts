export class PolicyPrinting{
    docType: string;
    destination: string;
    printerName: string;
    noOfCopy: number;

    constructor(docType: string,
                destination: string,
                printerName: string,
                noOfCopy: number
                )
    {
        this.docType = docType;
        this.destination = destination;
        this.printerName = printerName;
        this.noOfCopy = noOfCopy;
    }
}