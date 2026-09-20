import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useDaumPostcodePopup } from "react-daum-postcode";

// 카카오 주소 API 스크립트 URL
const scriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home에서 전달받은 장바구니 아이템들
  const cartItems = location.state?.cartItems || [];

  const [paymentMethod, setPaymentMethod] = useState("카드");
  const [deliveryRequest, setDeliveryRequest] = useState("문 앞");

  // 🏠 배송지 상태 관리 (상세주소, 공동현관 비밀번호 추가)
  const [addressInfo, setAddressInfo] = useState({
    name: "원진석",
    zonecode: "04951",
    address: "서울특별시 광진구 아차산로49길 88",
    detailAddress: "302호 (구의동, 아침빌라)",
    entrancePassword: "#1234*",
    phone: "010-3253-6336"
  });

  // 팝업(모달) 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시 입력값 상태
  const [tempAddress, setTempAddress] = useState(addressInfo);

  // 카카오 주소 팝업 훅 호출
  const openPostcode = useDaumPostcodePopup(scriptUrl);

  // 주소 검색 완료 시 실행될 콜백 함수
  const handleCompletePostcode = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += (extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== "" ? ` (${extraAddress})` : "");
    }

    // 선택된 우편번호와 기본 주소를 임시 상태에 반영
    setTempAddress({
      ...tempAddress,
      zonecode: data.zonecode,
      address: fullAddress,
    });
  };

  // 주소 검색 버튼 클릭 시
  const handleOpenAddressSearch = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  // 배송지 저장 핸들러
  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddressInfo(tempAddress);
    setIsModalOpen(false);
  };

  // 총 상품 가격 계산
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 💳 토스페이먼츠 결제창 호출 함수
  const handlePayment = async () => {
    if (cartItems.length === 0) return;

    const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
    
    try {
      const tossPayments = await loadTossPayments(clientKey);

      const orderName = cartItems.length > 1 
        ? `${cartItems[0].name} 외 ${cartItems.length - 1}건` 
        : cartItems[0].name;

      const orderId = `order_${new Date().getTime()}`;

      // 토스 결제창으로 넘어가기 직전에 주문 내역 저장 & 장바구니 비우기
      const savedOrders = localStorage.getItem("lockerRoomOrders");
      const previousOrders = savedOrders ? JSON.parse(savedOrders) : [];

      const newOrder = {
        orderId: orderId,
        date: new Date().toLocaleDateString(),
        items: cartItems,
        totalPrice: getTotalPrice()
      };

      // 1. 주문 내역에 새 주문 추가
      localStorage.setItem("lockerRoomOrders", JSON.stringify([newOrder, ...previousOrders]));
      // 2. 장바구니 초기화
      localStorage.removeItem("lockerRoomCart");

      // 토스 결제창 호출
      await tossPayments.requestPayment(paymentMethod === "계좌이체" ? "계좌이체" : "카드", {
        amount: getTotalPrice(),
        orderId: orderId,
        orderName: orderName,
        customerName: addressInfo.name,
        successUrl: window.location.origin + "/mypage",
        failUrl: window.location.origin + "/checkout",
      });
    } catch (error) {
      console.error("결제 에러:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 relative">
      {/* 상단 타이틀 */}
      <div className="max-w-5xl w-full px-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900">주문/결제</h1>
        <button onClick={() => navigate('/home')} className="text-sm text-blue-600 hover:underline font-semibold">
          &lt; 쇼핑 계속하기
        </button>
      </div>

      {/* 메인 레이아웃 */}
      <div className="max-w-5xl w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 좌측 정보 영역 */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 배송지 정보 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-gray-900">배송지</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded">{addressInfo.name}</span>
                <button 
                  onClick={() => { setTempAddress(addressInfo); setIsModalOpen(true); }}
                  className="text-xs font-bold text-blue-600 border border-blue-600 px-2.5 py-1 rounded hover:bg-blue-50 transition"
                >
                  배송지 변경
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1">[우편번호: {addressInfo.zonecode}]</p>
            <p className="text-sm font-bold text-gray-800">{addressInfo.address} {addressInfo.detailAddress}</p>
            {addressInfo.entrancePassword && (
              <p className="text-xs text-gray-500 mt-1">공동현관 비밀번호 : {addressInfo.entrancePassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">휴대폰 : {addressInfo.phone}</p>
          </div>

          {/* 배송 요청사항 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-3">배송 요청사항</h2>
            <select 
              value={deliveryRequest} 
              onChange={(e) => setDeliveryRequest(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-blue-600"
            >
              <option value="문 앞">문 앞</option>
              <option value="직접 받고 경비실에 위탁">경비실에 위탁</option>
              <option value="택배함 수령">택배함 수령</option>
            </select>
          </div>

          {/* 결제 수단 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-4">결제수단</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === "카드"} 
                  onChange={() => setPaymentMethod("카드")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-semibold text-gray-800">신용/체크카드</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === "계좌이체"} 
                  onChange={() => setPaymentMethod("계좌이체")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-semibold text-gray-800">계좌이체</span>
              </label>
            </div>
          </div>

          {/* 주문 상품 리스트 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-4">주문 상품 ({cartItems.length}건)</h2>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400">주문할 상품이 없습니다.</p>
            ) : (
              <div className="space-y-4 divide-y">
                {cartItems.map((item, index) => (
                  <div key={index} className="pt-4 first:pt-0 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">수량: {item.quantity}개 / 무료배송</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 우측 결제 요약 박스 */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">최종 결제 금액</h2>
            
            <div className="space-y-2.5 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>총 상품 가격</span>
                <span>{getTotalPrice().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송지</span>
                <span className="text-xs text-gray-500 truncate max-w-[120px]" title={`${addressInfo.address} ${addressInfo.detailAddress}`}>{addressInfo.address}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>0원</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-3 border-t">
                <span>총결제금액</span>
                <span className="text-blue-600">{getTotalPrice().toLocaleString()}원</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-xl text-base font-bold transition shadow-md ${
                cartItems.length > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              결제하기
            </button>
          </div>
        </div>

      </div>

      {/* 🏠 배송지 수정 및 주소 API 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">배송지 변경</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">수령인</label>
                <input 
                  type="text" 
                  value={tempAddress.name} 
                  onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">우편번호</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tempAddress.zonecode} 
                    readOnly 
                    className="w-28 p-2.5 border rounded-lg text-sm bg-gray-50 text-center font-bold"
                  />
                  <button 
                    type="button" 
                    onClick={handleOpenAddressSearch}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg text-xs transition"
                  >
                    우편번호 검색
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">기본 주소</label>
                <input 
                  type="text" 
                  value={tempAddress.address} 
                  readOnly 
                  className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">상세 주소 (동·호수 등)</label>
                <input 
                  type="text" 
                  value={tempAddress.detailAddress} 
                  onChange={(e) => setTempAddress({ ...tempAddress, detailAddress: e.target.value })}
                  placeholder="예: 302호 (구의동, 아침빌라)"
                  className="w-full p-2.5 border rounded-lg text-sm focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">공동현관 비밀번호 (선택)</label>
                <input 
                  type="text" 
                  value={tempAddress.entrancePassword} 
                  onChange={(e) => setTempAddress({ ...tempAddress, entrancePassword: e.target.value })}
                  placeholder="예: #1234* 또는 자유 양식"
                  className="w-full p-2.5 border rounded-lg text-sm focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">휴대폰 번호</label>
                <input 
                  type="text" 
                  value={tempAddress.phone} 
                  onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm focus:outline-blue-600"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition text-sm"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Checkout;