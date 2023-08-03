export class GenerateOTP {
  private min: number;
  private max: number;
  private OTP: number;

  constructor() {
    this.min = 100000;
    this.max = 999999;
    this.OTP = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }
 
  public instantiate = () => this.OTP;
}