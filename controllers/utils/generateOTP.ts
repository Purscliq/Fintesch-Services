export function generateOTP() {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)
  const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
  return OTP;
}