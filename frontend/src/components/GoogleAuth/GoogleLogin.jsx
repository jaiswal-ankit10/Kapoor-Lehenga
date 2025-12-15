import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../services/api";
import googleLogo from "../../assets/icons/googleIcon.png";

export default function GoogleLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleResponse = async (authResult) => {
    try {
      if (!authResult.code) {
        console.log("Google Auth Error:", authResult);
        return;
      }

      const res = await googleAuth(authResult.code);

      const user = res.data.data.user;
      const token = res.data.data.token;

      dispatch(setUser({ user, token }));

      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleGoogleResponse,
    flow: "auth-code",
  });
  return (
    <button className="bg-gray-200 px-4 py-2 rounded" onClick={googleLogin}>
      <img src={googleLogo} className="w-10" />
    </button>
  );
}
