import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 로그인 상태 확인 (예시로 localStorage의 isLoggedIn 또는 사용자 정보를 체크)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    // 1. 로그인 여부 체크 (실제 로그인 구현 방식에 맞춰 수정 가능)
    const savedUser = localStorage.getItem("lockerRoomUser"); // 로그인 시 저장되는 사용자 정보 예시
    
    // 만약 로그인 정보가 없다면 로그인 페이지로 유도
    if (!savedUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login'); // 로그인 페이지 경로로 이동
      return;
    }

    setIsLoggedIn(true);
    setUser(JSON.parse(savedUser));

    // 2. 장바구니 및 주문 내역 로드
    const savedCart = localStorage.getItem("lockerRoomCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("장바구니 파싱 에러:", e);
      }
    }

    const savedOrders = localStorage.getItem("lockerRoomOrders");
    let initialOrders = savedOrders ? JSON.parse(savedOrders) : [];

    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (orderId && amount) {
      const isAlreadyExists = initialOrders.some((order) => order.orderId === orderId);
      
      if (!isAlreadyExists) {
        const newOrder = {
          orderId: orderId,
          date: new Date().toLocaleDateString(),
          totalPrice: Number(amount),
          items: cartItems.length > 0 ? cartItems : [{ name: '2026 LG 홈 유니폼', price: Number(amount), quantity: 1, team: 'LG 트윈스' }],
          hasReview: false,
          review: null
        };

        initialOrders = [newOrder, ...initialOrders];
        localStorage.setItem("lockerRoomOrders", JSON.stringify(initialOrders));
        localStorage.removeItem("lockerRoomCart");
        setCartItems([]);

        alert("성공적으로 결제가 완료되었습니다!");
      }
    }

    setOrderList(initialOrders);
  }, [searchParams, navigate]);

  // 로그인이 안 되어 있다면 빈 화면 혹은 로딩을 띄워 리다이렉트 전 깜빡임 방지
  if (!isLoggedIn) {
    return null; 
  }

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += delta;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }

    setCartItems(updatedCart);
    localStorage.setItem("lockerRoomCart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("lockerRoomCart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const openReviewModal = (order) => {
    setSelectedOrderForReview(order);
    setReviewRating(5);
    setReviewText('');
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    const updatedOrders = orderList.map((order) => {
      if (order.orderId === selectedOrderForReview.orderId) {
        return {
          ...order,
          hasReview: true,
          review: {
            rating: reviewRating,
            text: reviewText,
            date: new Date().toLocaleDateString()
          }
        };
      }
      return order;
    });

    setOrderList(updatedOrders);
    localStorage.setItem("lockerRoomOrders", JSON.stringify(updatedOrders));
    setIsReviewModalOpen(false);
    alert("소중한 리뷰가 등록되었습니다!");
  };

  const renderContent = () => {
    if (activeTab === 'cart') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-900 mb-6">장바구니</h3>
          
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-4xl mb-4">🛒</span>
              <p className="text-gray-500 font-medium">장바구니에 담긴 상품이 없습니다.</p>
              <button 
                onClick={() => navigate('/home')}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                쇼핑 계속하기
              </button>
            </div>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200 mb-6">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">⚾</span>
                        )}
                      </div>
                      <div>
                        {item.team && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.team}</span>}
                        <p className="text-lg font-bold text-gray-800 mt-1">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString()}원</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button onClick={() => handleQuantityChange(index, -1)} className="px-3 py-1 bg-gray-50 font-bold">-</button>
                        <span className="px-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(index, 1)} className="px-3 py-1 bg-gray-50 font-bold">+</button>
                      </div>

                      <span className="text-base font-extrabold text-gray-900 w-24 text-right">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>

                      <button onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-red-500 text-sm font-bold">
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between items-center bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
                <span className="text-lg font-bold text-gray-700">총 결제 금액</span>
                <span className="text-3xl font-extrabold text-blue-600">{getTotalPrice().toLocaleString()}원</span>
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => navigate('/home')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition text-lg">
                  쇼핑 계속하기
                </button>
                <button onClick={() => navigate('/checkout', { state: { cartItems } })} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md text-lg">
                  주문하기
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="animate-fadeIn space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">최근 주문 내역</h3>
            <button onClick={() => navigate('/home')} className="text-sm text-blue-600 font-semibold hover:underline">상품 보러가기 &gt;</button>
          </div>
          
          {orderList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-gray-100">
              <span className="text-4xl mb-4">📦</span>
              <p className="text-gray-500 font-medium">최근 3개월 이내에 주문한 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {orderList.map((order, index) => (
                <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">결제 완료</span>
                      <span className="text-xs text-gray-400">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-blue-600">{order.totalPrice.toLocaleString()}원</span>
                      
                      {order.hasReview ? (
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                          ⭐ 작성완료
                        </span>
                      ) : (
                        <button 
                          onClick={() => openReviewModal(order)}
                          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition shadow-sm"
                        >
                          리뷰 작성
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 font-mono">주문번호: {order.orderId}</div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-800">
                            {item.name} {item.quantity > 1 ? `외 ${item.quantity - 1}건` : ''}
                          </span>
                          <span className="text-gray-600">{item.price.toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.hasReview && order.review && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-orange-100 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-orange-400 font-bold">
                        {"★".repeat(order.review.rating)}{"☆".repeat(5 - order.review.rating)}
                        <span className="text-gray-400 ml-2 font-normal">{order.review.date}</span>
                      </div>
                      <p className="text-gray-700">{order.review.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6"> 
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">마이페이지</h2>
          <button onClick={() => navigate('/home')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            메인으로 돌아가기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{user?.name || '사용자'} 님</h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <ul className="space-y-1">
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    주문/배송 내역
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cart')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'cart' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    장바구니 보기 {cartItems.length > 0 && `(${cartItems.length})`}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold text-gray-900">상품 리뷰 작성</h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              {selectedOrderForReview && (
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                  <p className="font-bold text-gray-800">주문 상품 요약</p>
                  <p className="mt-1">{selectedOrderForReview.items?.[0]?.name} {selectedOrderForReview.items?.length > 1 ? `외 ${selectedOrderForReview.items.length - 1}건` : ''}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">별점 선택</label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`focus:outline-none transition ${star <= reviewRating ? 'text-orange-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-700 self-center ml-2">({reviewRating}/5)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">리뷰 내용</label>
                <textarea 
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="상품의 품질, 배송 등에 대한 솔직한 리뷰를 남겨주세요."
                  className="w-full p-3 border rounded-xl text-sm focus:outline-blue-600 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition text-sm">
                  취소
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-md">
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;