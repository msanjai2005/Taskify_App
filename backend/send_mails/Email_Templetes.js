
export const welcomeMailTemplate = (name)=>{
    return  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome to Mass Production</title>
  <style>
    /* Basic safe styles for email clients */
    body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    table { border-collapse: collapse; }
    img { border:0; display:block; }
    a { color: #1a73e8; text-decoration: none; }
    .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { padding:24px; text-align:center; background: linear-gradient(90deg,#0f62fe,#0069ff); color:#fff; }
    .logo { max-width:120px; margin:0 auto 8px; }
    .hero { padding:28px 24px; }
    .h1 { margin:0 0 12px; font-size:22px; line-height:1.2; color:#111; }
    .p { margin:0 0 16px; color:#555; font-size:15px; line-height:1.5; }
    .btn { display:inline-block; padding:12px 20px; background:#0f62fe; color:white; border-radius:6px; font-weight:600; }
    .small { font-size:13px; color:#888; }
    .footer { padding:18px 24px; background:#f1f4f8; color:#666; font-size:13px; text-align:center; }
    .social { padding-top:8px; }
    @media (max-width:420px) {
      .h1 { font-size:18px; }
      .hero { padding:20px 16px; }
    }
  </style>
</head>
<body>
  <center style="width:100%; background:#f4f6f8; padding:28px 12px;">
    <table class="container" role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <!-- Header -->
      <tr>
        <td class="header">
          <img src="https://i.pinimg.com/736x/4c/9b/60/4c9b60f233e5b5e18e28bbc85bf1ecf0.jpg" alt="{{app_name}} logo" class="logo" width="100" />
          <div style="font-size:14px; opacity:0.95;">Welcome to <strong>Mass Production</strong></div>
        </td>
      </tr>

      <!-- Hero -->
      <tr>
        <td class="hero">
          <h1 class="h1">Hi ${name}, welcome aboard 👋</h1>
          <p class="p">
            We’re excited to have you at <strong>Mass Production</strong>. Your account is now ready. Here’s a quick guide to help you get started and make the most of our service.
          </p>

          <!-- CTA -->
          <p style="margin:20px 0;">
            <a href="#" class="btn" target="_blank" rel="noopener">Go to your dashboard</a>
          </p>

          <p class="p small">
            Tip: Update your profile and verify your email for full access. If you need help, reply to this email or contact our support at <a href="mailto:msanjai1012@gmail.com">msanjai1012@gmail.com</a>.
          </p>

          <!-- Optional features list -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
            <tr>
              <td style="padding:10px 0; border-top:1px solid #eef1f6;">
                <strong>What you can do next</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0 0;">
                <ul style="margin:8px 0 0; padding-left:18px; color:#555;">
                  <li>Explore your dashboard and settings</li>
                  <li>Invite teammates or connect apps</li>
                  <li>Read the quick start guide in the Help Center</li>
                </ul>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <div>Thanks,<br><strong>The Mass Production Team</strong></div>
          <div class="social" style="margin-top:8px;">
            <a href="#" style="margin-right:10px;">Twitter</a> •
            <a href="#" style="margin-left:10px; margin-right:10px;">LinkedIn</a> •
            <a href="#" style="margin-left:10px;">Help</a>
          </div>
          <div style="margin-top:12px;" class="small">
            If you didn't sign up for Mass Production, please ignore this email or contact <a href="mailto:msanjai1012@gmail.com">msanjai1012@gmail.com</a>.
          </div>
          <div style="margin-top:8px; color:#999; font-size:12px;">
            © <span id="year">2025</span> Mass Production. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`
}

export const otpVerificationTemplate = (name, otp, expiryTime) => {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Email Verification - Mass Production</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    table { border-collapse: collapse; }
    img { border:0; display:block; }
    a { color: #1a73e8; text-decoration: none; }
    .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { padding:24px; text-align:center; background: linear-gradient(90deg,#0f62fe,#0069ff); color:#fff; }
    .logo { max-width:120px; margin:0 auto 8px; }
    .hero { padding:28px 24px; }
    .h1 { margin:0 0 12px; font-size:22px; line-height:1.2; color:#111; }
    .p { margin:0 0 16px; color:#555; font-size:15px; line-height:1.5; }
    .otp-box { 
      font-size:28px; 
      letter-spacing:6px; 
      font-weight:700; 
      text-align:center; 
      background:#eef3ff; 
      padding:14px 0; 
      border-radius:8px; 
      color:#0f62fe; 
      margin:24px 0;
    }
    .btn { display:inline-block; padding:12px 20px; background:#0f62fe; color:white; border-radius:6px; font-weight:600; }
    .small { font-size:13px; color:#888; }
    .footer { padding:18px 24px; background:#f1f4f8; color:#666; font-size:13px; text-align:center; }
    @media (max-width:420px) {
      .h1 { font-size:18px; }
      .hero { padding:20px 16px; }
      .otp-box { font-size:24px; letter-spacing:4px; }
    }
  </style>
</head>
<body>
  <center style="width:100%; background:#f4f6f8; padding:28px 12px;">
    <table class="container" role="presentation" width="100%" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr>
        <td class="header">
          <img src="https://i.pinimg.com/736x/4c/9b/60/4c9b60f233e5b5e18e28bbc85bf1ecf0.jpg" 
               alt="Mass Production Logo" 
               class="logo" width="100" />
          <div style="font-size:14px; opacity:0.95;">
            Verify Your Email – <strong>Mass Production</strong>
          </div>
        </td>
      </tr>

      <!-- Hero -->
      <tr>
        <td class="hero">
          <h1 class="h1">Hi ${name}, verify your email 👋</h1>

          <p class="p">
            Thank you for registering with <strong>Mass Production</strong>.  
            To complete your signup, please enter the verification code below:
          </p>

          <!-- OTP BOX -->
          <div class="otp-box">${otp}</div>

          <p class="p small">
            This OTP will expire at: <strong>${expiryTime}</strong><br />
            Do not share this code with anyone for security reasons.
          </p>

          <!-- Button (Optional, if clicking goes to frontend verify page) -->
          <p style="margin:20px 0;">
            <a href="#" class="btn" target="_blank" rel="noopener">Verify Email</a>
          </p>

          <p class="p small">
            If you didn't request this, please ignore this email or contact 
            <a href="mailto:msanjai1012@gmail.com">msanjai1012@gmail.com</a>.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <div>Thanks,<br><strong>The Mass Production Team</strong></div>

          <div style="margin-top:12px;" class="small">
            © 2025 Mass Production. All rights reserved.
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
};

export const passwordResetOtpTemplate = (otp) => {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Password Reset - Mass Production</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    table { border-collapse: collapse; }
    img { border:0; display:block; }
    a { color: #1a73e8; text-decoration: none; }
    .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { padding:24px; text-align:center; background: linear-gradient(90deg,#0f62fe,#0069ff); color:#fff; }
    .logo { max-width:120px; margin:0 auto 8px; }
    .hero { padding:28px 24px; }
    .h1 { margin:0 0 12px; font-size:22px; line-height:1.2; color:#111; }
    .p { margin:0 0 16px; color:#555; font-size:15px; line-height:1.5; }
    .otp-box { 
      font-size:28px; 
      letter-spacing:6px; 
      font-weight:700; 
      text-align:center; 
      background:#eef3ff; 
      padding:14px 0; 
      border-radius:8px; 
      color:#0f62fe; 
      margin:24px 0;
    }
    .small { font-size:13px; color:#888; }
    .footer { padding:18px 24px; background:#f1f4f8; color:#666; font-size:13px; text-align:center; }
    @media (max-width:420px) {
      .h1 { font-size:18px; }
      .hero { padding:20px 16px; }
      .otp-box { font-size:24px; letter-spacing:4px; }
    }
  </style>
</head>
<body>
  <center style="width:100%; background:#f4f6f8; padding:28px 12px;">
    <table class="container" role="presentation" width="100%" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr>
        <td class="header">
          <img src="https://i.pinimg.com/736x/4c/9b/60/4c9b60f233e5b5e18e28bbc85bf1ecf0.jpg" 
               alt="Mass Production Logo" 
               class="logo" width="100" />
          <div style="font-size:14px; opacity:0.95;">
            Password Reset Request – <strong>Mass Production</strong>
          </div>
        </td>
      </tr>

      <!-- Hero -->
      <tr>
        <td class="hero">
          <h1 class="h1">Password Reset OTP</h1>

          <p class="p">
            You requested to reset your password.  
            Use the following OTP to proceed with your password reset:
          </p>

          <div class="otp-box">${otp}</div>

          <p class="p small">
            This OTP will expire in <strong>10 minutes</strong>.  
            If you did not initiate this request, please ignore this email.
          </p>

          <p class="p small">
            For help, contact:  
            <a href="mailto:msanjai1012@gmail.com">msanjai1012@gmail.com</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <div>Thanks,<br><strong>The Mass Production Team</strong></div>
          <div style="margin-top:12px;" class="small">
            © 2025 Mass Production. All rights reserved.
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
};

export const passwordChangedSuccessTemplate = (name, password) => {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Password Changed - Mass Production</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    table { border-collapse: collapse; }
    img { border:0; display:block; }
    a { color: #1a73e8; text-decoration: none; }
    .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { padding:24px; text-align:center; background: linear-gradient(90deg,#0f62fe,#0069ff); color:#fff; }
    .logo { max-width:120px; margin:0 auto 8px; }
    .hero { padding:28px 24px; }
    .h1 { margin:0 0 12px; font-size:22px; line-height:1.2; color:#111; }
    .p { margin:0 0 16px; color:#555; font-size:15px; line-height:1.5; }
    .password-box { 
      font-size:20px; 
      background:#eef3ff; 
      padding:12px 16px; 
      border-radius:8px; 
      color:#0f62fe; 
      margin:20px 0; 
      font-weight:600;
      text-align:center;
    }
    .small { font-size:13px; color:#888; }
    .footer { padding:18px 24px; background:#f1f4f8; color:#666; font-size:13px; text-align:center; }
    @media (max-width:420px) {
      .h1 { font-size:18px; }
      .hero { padding:20px 16px; }
    }
  </style>
</head>
<body>
  <center style="width:100%; background:#f4f6f8; padding:28px 12px;">
    <table class="container" role="presentation" width="100%" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr>
        <td class="header">
          <img src="https://i.pinimg.com/736x/4c/9b/60/4c9b60f233e5b5e18e28bbc85bf1ecf0.jpg" 
               alt="Mass Production Logo" 
               class="logo" width="100" />
          <div style="font-size:14px; opacity:0.95;">
            Password Updated – <strong>Mass Production</strong>
          </div>
        </td>
      </tr>

      <!-- Hero -->
      <tr>
        <td class="hero">
          <h1 class="h1">Hi ${name}, your password was successfully updated ✔</h1>

          <p class="p">
            Your account password has been changed. Below is your new password:
          </p>

          <!-- Password Box -->
          <div class="password-box">${password}</div>

          <p class="p small">
            For security, we recommend changing this temporary password  
            after your next login.
          </p>

          <p class="p small">
            If you did <strong>NOT</strong> request this change, please reset your  
            password immediately or contact our support:
            <a href="mailto:msanjai1012@gmail.com">msanjai1012@gmail.com</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <div>Thanks,<br><strong>The Mass Production Team</strong></div>
          <div style="margin-top:12px;" class="small">
            © 2025 Mass Production. All rights reserved.
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
};
