import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useAuthStore } from "../../../store/auth.store";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const verifyMutation = useVerifyOtp();
  const setVerified = useAuthStore((s) => s.setVerified);

  const handleVerify = async () => {
    const data = await verifyMutation.mutateAsync({
      email,
      otp,
    });

    setVerified(true);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">

        <h1>OTP Verification</h1>
        <p>Sent to {email}</p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 w-full"
        />

        <button onClick={handleVerify}>
          Verify OTP
        </button>

      </div>
    </div>
  );
}

export default OtpPage;