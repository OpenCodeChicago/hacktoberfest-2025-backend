
export const htmlTemplate = (name, otp) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333333; text-align: center;">Welcome, ${name}!</h2>
      <p style="color: #555555; font-size: 16px;">We received a request to verify your email. Use the OTP below to complete your signup process:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #555555; font-size: 14px; text-align: center;">This OTP will expire in 5 minutes.</p>
      <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999999;">
        If you did not request this OTP, please ignore this email.
      </p>
    </div>
  </div>
`;
