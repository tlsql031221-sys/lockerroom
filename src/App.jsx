import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import MyPage from "./MyPage"; 
import Checkout from "./Checkout"; 
import ProductDetail from "./ProductDetail"; // 1. 상세페이지 컴포넌트 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* 2. 상세페이지 주소 등록 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;