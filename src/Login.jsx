import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // 로그인 성공 시 메인 화면으로 이동
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        {/* LockerRoom 타이틀 클릭 시 /home으로 이동하도록 수정 */}
        <h1 
          className="mb-6 text-center text-2xl font-bold text-blue-900 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/home")}
        >
          LockerRoom
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="이메일 (아이디)" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="rounded border border-gray-300 p-2" 
            required 
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="rounded border border-gray-300 p-2" 
            required 
          />
          <button type="submit" className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">로그인</button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sm text-gray-500 hover:underline">회원가입 하러가기</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;