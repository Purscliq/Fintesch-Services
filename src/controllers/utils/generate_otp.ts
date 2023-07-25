export class GenerateOTP {
  private min: number;
  private max: number;
  private OTP: number;

  constructor() {
    this.min = 100000; // Minimum value (inclusive)
    this.max = 999999; // Maximum value (inclusive)
    this.OTP = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }
 
  public instantiate() {
    return this.OTP;
  } 
}