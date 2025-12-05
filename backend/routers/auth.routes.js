router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // 1. Set JWT cookie
      await getTokenAndSetcookies(res, req.user._id);

      // 2. Generate OTP
      const otp = generateOtp();
      const expireTime = Date.now() + 10 * 60 * 1000;

      // 3. Update user
      const dbUser = await User.findById(req.user._id);
      dbUser.verifyOtp = otp;
      dbUser.verifyOtpExpireAt = expireTime;
      await dbUser.save();

      // 4. Send email
      await mailverification(dbUser.email, otp, expireTime);

      // 5. Client-side redirect for Vercel
      return res.send(`
        <html>
          <head>
            <script>
              window.location.href = "${process.env.FRONTEND_URL}/dashboard";
            </script>
          </head>
          <body>
            Redirecting...
          </body>
        </html>
      `);
    } catch (error) {
      console.log("google login error");
      console.log(error.message);

      return res.send(`
        <html>
          <head>
            <script>
              window.location.href = "${process.env.FRONTEND_URL}/login?error=google_failed";
            </script>
          </head>
          <body>
            Redirecting...
          </body>
        </html>
      `);
    }
  }
);
