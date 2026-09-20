import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 기본 상품 목록
  const defaultProducts = [
    { id: '1', name: '2026 LG 홈 유니폼', team: 'LG 트윈스', league: 'KBO', price: 115000, category: '유니폼', imageUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=500' },
    { id: '2', name: '2026 KIA 타이거즈 어센틱 모자', team: 'KIA 타이거즈', league: 'KBO', price: 42000, category: '모자', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=500' },
    { id: '3', name: 'KBO 공식 공인구', team: 'KBO', league: 'KBO', price: 23000, category: '기타', imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc6d?auto=format&fit=crop&q=80&w=500' },
    { id: '4', name: '2026 FC서울 홈 유니폼', team: 'FC 서울', league: 'K리그', price: 110000, category: '유니폼', imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=500' },
    { id: '5', name: '울산 HD FC 어센틱 머플러', team: '울산 HD', league: 'K리그', price: 25000, category: '응원용품', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=500' },
    { 
      id: 'item47', 
      name: '전남광주 SOOP 수퍼스 어센틱 유니폼', 
      team: '전남광주 SOOP 수퍼스', 
      league: 'KOVO (배구)', 
      price: 99000, 
      category: '유니폼', 
      imageUrl: '/soop_uniform.jpg' 
    }
  ];

  const matchedProduct = defaultProducts.find((p) => p.id === id) || defaultProducts[0];
  const product = location.state && location.state.product ? location.state.product : matchedProduct;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('95');
  const [activeTab, setActiveTab] = useState('detail');
  const [reviews, setReviews] = useState([]);
  
  // 이미지 로드 실패 시 대체 화면을 보여주기 위한 상태
  const [imageError, setImageError] = useState(false);

  // 종목별 전체 구단 데이터베이스 정의 (누락 방지)
  const sportsDatabase = {
    KBO: {
      key: 'KBO',
      name: 'KBO',
      emoji: '⚾',
      title: 'KBO 공식 인증 정품 야구 굿즈입니다.',
      desc: '경기 관람 및 일상생활에서도 스타일리시하게 착용할 수 있는 최고급 경기용 원단 상품입니다.',
      keywords: ['kia', '기아', '타이거즈', '삼성', '라이온즈', 'lg', '엘지', '트윈스', '두산', '베어스', 'ssg', '랜더스', '롯데', '자이언츠', 'kt', '케이티', '위즈', '한화', '이글스', 'nc', '다이노스', '키움', '히어로즈', 'kbo', '야구']
    },
    KBL: {
      key: 'KBL',
      name: 'KBL',
      emoji: '🏀',
      title: 'KBL 공식 인증 정품 농구 굿즈입니다.',
      desc: '코트 위 활동성과 일상의 스트릿 감성을 동시에 담은 최고급 굿즈 상품입니다.',
      keywords: ['서울 삼성', '삼성 썬더스', '썬더스', '서울 SK', 'sk나이츠', '나이츠', '창원 LG', '세이커스', '원주 DB', '프로미', 'kt 소닉붐', '소닉붐', '고양 소노', '소노', '대구 한국가스공사', '가스공사', '부산 kcc', '이지스', '안양 정관장', '정관장', '울산 현대모비스', '현대모비스', 'kbl', '농구']
    },
    KOVO: {
      key: 'KOVO',
      name: 'KOVO',
      emoji: '🏐',
      title: 'KOVO 공식 인증 정품 배구 굿즈입니다.',
      desc: '역동적인 코트 열기를 그대로 담아낸 통기성 뛰어난 최고급 공식 굿즈 상품입니다.',
      keywords: ['대한항공', '점보스', 'kb손해', '손해보험', '스타즈', '한국전력', '빅스톰', '현대캐피탈', '스카이워커스', '우리카드', '우리WON', 'ok금융그룹', '읏맨', '삼성화재', '블루팡스', '흥국생명', '핑크스파이더스', '현대건설', '힐스테이트', '정관장', '레드스파크스', '한국도로공사', '하이패스', '페퍼저축은행', 'AI페퍼스', 'ibk기업은행', '알토스', 'kovo', 'v리그', '배구', '수퍼스', 'soop']
    },
    KLEAGUE: {
      key: 'K리그',
      name: 'K리그',
      emoji: '⚽',
      title: 'K리그 공식 인증 정품 축구 굿즈입니다.',
      desc: '경기 관람 및 일상생활에서도 스타일리시하게 착용할 수 있는 최고급 공식 굿즈 상품입니다.',
      keywords: ['fc서울', '울산', '전북', '포항', '인천', '제주', '대구', '대전', '수원', '광주', '강원', '김천', 'fc', 'K리그', '축구']
    }
  };

  const getResolvedLeagueInfo = (prod) => {
    const l = (prod.league || '').toLowerCase();
    const t = (prod.team || '').toLowerCase();
    const n = (prod.name || '').toLowerCase();
    const combinedText = `${l} ${t} ${n}`;

    for (const [leagueKey, data] of Object.entries(sportsDatabase)) {
      const isMatched = data.keywords.some((keyword) => combinedText.includes(keyword.toLowerCase()));
      if (isMatched) {
        return data;
      }
    }

    return {
      key: prod.league || 'K리그',
      name: prod.league || 'K리그',
      emoji: '⚽',
      title: `${prod.league || '스포츠'} 공식 인증 정품 굿즈입니다.`,
      desc: '경기 관람 및 일상생활에서도 스타일리시하게 착용할 수 있는 최고급 공식 굿즈 상품입니다.'
    };
  };

  const leagueInfo = getResolvedLeagueInfo(product);
  const displayLeague = leagueInfo.name;

  useEffect(() => {
    setImageError(false); // 상품이 바뀌면 이미지 에러 상태 초기화
    const savedOrders = localStorage.getItem("lockerRoomOrders");
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        const collectedReviews = [];

        orders.forEach((order) => {
          if (order.hasReview && order.review && order.items) {
            const hasCurrentProduct = order.items.some((item) => {
              return item.name === product.name || item.name.includes(product.name);
            });

            if (hasCurrentProduct) {
              collectedReviews.push({
                id: order.orderId,
                rating: order.review.rating,
                text: order.review.text,
                date: order.review.date,
                author: '원진석'
              });
            }
          }
        });

        setReviews(collectedReviews);
      } catch (e) {
        console.error("리뷰 파싱 에러:", e);
      }
    }
  }, [product.name]);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: `${product.name} (${selectedSize})`,
      team: product.team,
      league: displayLeague,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl
    };

    const savedCart = localStorage.getItem("lockerRoomCart");
    const currentCart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = currentCart.findIndex((item) => item.name === cartItem.name);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem("lockerRoomCart", JSON.stringify(currentCart));
    
    if (window.confirm("장바구니에 상품이 담겼습니다. 장바구니로 이동하시겠습니까?")) {
      navigate('/mypage');
    }
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: product.id,
      name: `${product.name} (${selectedSize})`,
      team: product.team,
      league: displayLeague,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl
    };
    navigate('/checkout', { state: { cartItems: [cartItem] } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        <button onClick={() => navigate('/home')} className="text-sm font-semibold text-blue-600 hover:underline mb-6 block">
          &lt; 홈으로 돌아가기
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {product.imageUrl && !imageError ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <span className="text-5xl mb-2">{leagueInfo.emoji}</span>
                <span className="text-xs text-gray-500 font-medium">이미지를 불러올 수 없습니다</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {displayLeague}
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {product.team}
                </span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mt-2">{product.name}</h1>
              <p className="text-2xl font-extrabold text-blue-600 mt-3">{product.price.toLocaleString()}원</p>
            </div>

            <div className="space-y-4 my-6">
              <div>
                사이즈 선택: <span className="font-bold">{selectedSize}</span>
              </div>
              <div className="flex gap-2">
                {['90', '95', '100', '105', '110'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-bold transition ${
                      selectedSize === size ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div>
                수량 선택
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg w-32 overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 bg-gray-50 font-bold">-</button>
                <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-gray-50 font-bold">+</button>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">총 상품 금액</span>
                <span className="text-2xl font-black text-gray-900">{(product.price * quantity).toLocaleString()}원</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition"
                >
                  장바구니
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
                >
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('detail')}
              className={`flex-1 py-4 text-center font-bold text-sm transition ${activeTab === 'detail' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 bg-gray-50'}`}
            >
              상품 상세정보
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-center font-bold text-sm transition ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 bg-gray-50'}`}
            >
              상품 리뷰 ({reviews.length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'detail' ? (
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed text-center py-10">
                <p className="font-bold text-lg text-gray-800">{leagueInfo.emoji} {leagueInfo.title}</p>
                <p>{leagueInfo.desc}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">구매 고객 리얼 리뷰</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-medium">
                    아직 작성된 리뷰가 없습니다. 구매 후 마이페이지에서 리뷰를 남겨보세요!
                  </div>
                ) : (
                  <div className="space-y-4 divide-y">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400 text-lg">
                              {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                            </span>
                            <span className="text-xs font-bold text-gray-700">{rev.author} 님</span>
                          </div>
                          <span className="text-xs text-gray-400">{rev.date}</span>
                        </div>
                        <p className="text-sm text-gray-800">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;