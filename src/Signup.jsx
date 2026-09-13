import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Signup() {
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 상태 추가

  const navigate = useNavigate();

  const handleSendCode = () => {
    if (!email) return alert("이메일을 먼저 입력해주세요.");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    const templateParams = {
      to_email: email,
      code: code,
    };

    emailjs
      .send(
        "service_s67gsmq",
        "template_9me2337",
        templateParams,
        "WvinKvwlaubR4RBZh"
      )
      .then(() => {
        setIsCodeSent(true);
        alert("인증번호가 발송되었습니다. 이메일을 확인해주세요.");
      })
      .catch((error) => {
        alert("메일 발송 실패: " + error.text);
      });
  };

  // 인증번호 확인 로직
  const handleVerifyCode = () => {
    if (!isCodeSent) return alert("먼저 인증번호 보내기 버튼을 눌러주세요.");
    if (!inputCode) return alert("인증번호를 입력해주세요.");

    if (inputCode === generatedCode) {
      setIsVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!isVerified) return alert("이메일 인증확인을 먼저 완료해주세요.");
    if (password.length < 6) return alert("비밀번호는 6자리 이상이어야 합니다.");
    if (password !== passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">회원가입</h1>
        
        <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
          {/* 아이디(이메일) 및 인증번호 전송 */}
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="이메일 (아이디)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isVerified}
              className="w-2/3 rounded border border-gray-300 p-2 disabled:bg-gray-100" 
              required 
            />
            <button 
              type="button"
              onClick={handleSendCode} 
              disabled={isVerified}
              className="w-1/3 rounded bg-blue-600 p-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isCodeSent ? "재전송" : "번호 보내기"}
            </button>
          </div>

          {/* 인증번호 입력 및 확인 */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="인증번호 6자리" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              disabled={isVerified}
              className="w-2/3 rounded border border-gray-300 p-2 disabled:bg-gray-100" 
              required={!isVerified} 
            />
            <button 
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerified}
              className="w-1/3 rounded bg-green-600 p-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              {isVerified ? "인증완료" : "인증확인"}
            </button>
          </div>

          {/* 비밀번호 및 비밀번호 확인 */}
          <input 
            type="password" 
            placeholder="비밀번호 (6자리 이상)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="rounded border border-gray-300 p-2" 
            required 
          />
          <div className="flex flex-col gap-1">
            <input 
              type="password" 
              placeholder="비밀번호 확인" 
              value={passwordConfirm} 
              onChange={(e) => setPasswordConfirm(e.target.value)} 
              className="rounded border border-gray-300 p-2" 
              required 
            />
            {passwordConfirm.length > 0 && password === passwordConfirm && (
              <span className="pl-1 text-xs text-green-600">비밀번호가 일치합니다.</span>
            )}
          </div>

          {/* 최종 가입 버튼 */}
          <button 
            type="submit" 
            className="mt-4 w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-900"
          >
            가입 완료하기
          </button>
        </form>

        <button 
          onClick={() => navigate("/")} 
          className="mt-6 w-full text-sm text-gray-500 hover:underline"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Signup;