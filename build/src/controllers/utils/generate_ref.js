"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefGenerator = void 0;
class RefGenerator {
    constructor() {
        this.instantiate = () => this.reference;
        this.prefix = "TRF_";
        this.currentMonth = String(new Date().getUTCMonth() + 1).padStart(2, "0");
        this.currentDateArray = new Date().toUTCString().split(" ");
        this.time = this.currentDateArray[4].split(":").join("");
        this.num = this.currentDateArray[1].padStart(2, "0") + this.currentMonth + this.currentDateArray[3] + this.time;
        this.reference = this.prefix + this.num;
    }
}
exports.RefGenerator = RefGenerator;
