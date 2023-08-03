export class RefGenerator {
    private prefix: string;
    private currentMonth: string; 
    private currentDateArray: string[]
    private time: string
    //date(00), month(00), year(0000) and time(00:00:00)
    private num: string 
    private reference 

    constructor() {
        this.prefix = "TRF_";
        this.currentMonth = String(new Date().getUTCMonth() + 1).padStart(2, "0");
        this.currentDateArray  = new Date().toUTCString().split(" ");
        this.time = this.currentDateArray[4].split(":").join("");
        this.num = this.currentDateArray[1].padStart(2, "0") + this.currentMonth + this.currentDateArray[3] + this.time;
        this.reference = this.prefix + this.num;
    }

    public instantiate = () => this.reference;
}