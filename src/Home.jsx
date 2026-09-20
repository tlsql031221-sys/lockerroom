import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

// 팀 데이터 매핑 객체
const TEAMS_BY_SPORT = {
  "전체": ["전체"],
  "KBO (야구)": ["전체", "LG 트윈스", "KIA 타이거즈", "KT 위즈", "NC 다이노스", "SSG 랜더스", "두산 베어스", "롯데 자이언츠", "삼성 라이온즈", "키움 히어로즈", "한화 이글스"],
  "K리그 (축구)": ["전체", "강원 FC", "광주 FC", "김천 상무 FC", "대전 하나 시티즌", "부천 FC 1995", "FC 서울", "FC 안양", "울산 HD", "인천 유나이티드", "전북 현대", "제주 유나이티드", "포항 스틸러스"],
  "KBL (농구)": ["전체", "원주 DB 프로미", "서울 삼성 썬더스", "고양 소노 스카이거너스", "서울 SK 나이츠", "창원 LG 세이커스", "안양 정관장 레드부스터스", "부산 KCC 이지스", "수원 KT 소닉붐", "대구 한국가스공사 페가수스", "울산 현대모비스 피버스"],
  "KOVO (배구)": ["전체", "천안 현대캐피탈 스카이워커스", "인천 대한항공 점보스", "의정부 KB손해보험 스타즈", "서울 우리카드 우리WON", "대전 삼성화재 블루팡스", "수원 한국전력 빅스톰", "부산 OK저축은행 읏맨", "인천 흥국생명 핑크스파이더스", "대전 정관장 레드스파크스", "수원 현대건설 힐스테이트", "화성 IBK기업은행 알토스", "김천 한국도로공사 하이패스", "GS칼텍스 서울 KIXX", "전남광주 SOOP 수퍼스"]
};

function Home() {
  const [selectedSport, setSelectedSport] = useState("전체");
  const [selectedTeam, setSelectedTeam] = useState("전체");
  const [user, setUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true); // 🔹 인증 정보 로딩 상태 추가
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("lockerRoomCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false); // 🔹 인증 체크가 완료되면 로딩 해제
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("lockerRoomCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 상품 데이터
  const [products, setProducts] = useState([
  // --- KBO (야구) 구단 어센틱 유니폼 ---
  { id: "item1", name: "2026 LG 트윈스 홈 어센틱 유니폼", price: 149000, team: "LG 트윈스", sport: "KBO (야구)", imageUrl: "https://twinslockerdium.co.kr/web/product/big/202603/2f8eca384dd62d63b42b38c0a6111bdf.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item2", name: "2026 두산 베어스 홈 어센틱 유니폼", price: 139000, team: "두산 베어스", sport: "KBO (야구)", imageUrl: "https://nolmdshop.com/web/product/big/202510/d0144f87db6534345eab8633d577a6ce.jpg", availableSizes: ["90", "95", "100", "105","110"] },
  { id: "item3", name: "2026 KIA 타이거즈 어센틱 유니폼", price: 139000, team: "KIA 타이거즈", sport: "KBO (야구)", imageUrl: "https://tigers.cdn-nhncommerce.com/Mall-No-5WKb/PARTNER/20260204/PARTNER_94559/2026020416122092316d37004e402ab5c6d80f62c60688/58f7d45eebcbdd6e401c.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item4", name: "2026 삼성 라이온즈 홈 어센틱 유니폼", price: 149000, team: "삼성 라이온즈", sport: "KBO (야구)", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP2mjDkVchsMsohRMlN3lwf6yDGmdwkFR2WTBGS8of8Q&s", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item5", name: "2026 SSG 랜더스 홈 어센틱 유니폼", price: 139000, team: "SSG 랜더스", sport: "KBO (야구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20260522/6533996/6533996_17798594945166_big.jpg?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item6", name: "2026 롯데 자이언츠 홈 어센틱 유니폼", price: 149000, team: "롯데 자이언츠", sport: "KBO (야구)", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd5N01R4oeKBHnYJ07b9OpmO2UISMHouyO20XA8MQn5A&s=10", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item7", name: "2026 KT 위즈 홈 어센틱 유니폼", price: 129000, team: "KT 위즈", sport: "KBO (야구)", imageUrl: "https://ecimg.cafe24img.com/pg2623b60374486020/ktwiz111/web/product/medium/20260323/39e54c09a4104d149301ad878dd7ddbb.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item8", name: "2026 NC 다이노스 홈 어센틱 유니폼", price: 144000, team: "NC 다이노스", sport: "KBO (야구)", imageUrl: "https://m.store.ncdinos.com/web/product/big/202603/e4b8c65a65148f24be80d299e8da459e.jpeg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item9", name: "2026 한화 이글스 홈 어센틱 유니폼", price: 139000, team: "한화 이글스", sport: "KBO (야구)", imageUrl: "https://m.spyder.co.kr/web/product/big/202604/cac7795133173e3ff182ca57bd8f9751.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item10", name: "2026 키움 히어로즈 홈 어센틱 유니폼", price: 129000, team: "키움 히어로즈", sport: "KBO (야구)", imageUrl: "https://nolmdshop.com/web/product/big/202604/f7ceeb8429a4a4ee0bf803b7d3d30d10.jpg", availableSizes: ["90", "95", "100", "105", "110"] },

  // --- K리그 (축구) 구단 어센틱 유니폼 ---
  { id: "item11", name: "2026 강원 FC 홈 어센틱 유니폼", price: 150000, team: "강원 FC", sport: "K리그 (축구)", imageUrl: "https://cdn-optimized.imweb.me/upload/S20231204c320415f97af2/21d1c177f6e36.png?w=750", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item12", name: "2026 광주 FC 홈 어센틱 유니폼", price: 119000, team: "광주 FC", sport: "K리그 (축구)", imageUrl: "https://cafe24img.poxo.com/goalstudio/26SS/official/GJ/detail/DP6AUF204%23YE1.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item13", name: "2026 김천 상무 FC 홈 어센틱 유니폼", price: 120000, team: "김천 상무 FC", sport: "K리그 (축구)", imageUrl: "https://cdn.welfarehello.com/production/home/gift-product-thumbnail/20260910/25e259d60fc25688-1514601828543297608.jpg?w=1080&q=50&f=webp", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item15", name: "2026 대전 하나 시티즌 홈 어센틱 유니폼", price: 119000, team: "대전 하나 시티즌", sport: "K리그 (축구)", imageUrl: "https://store.dhcfc.kr/shopdata/sgoods/Pem90m.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item16", name: "2026 부천 FC 1995 홈 어센틱 유니폼", price: 129000, team: "부천 FC 1995", sport: "K리그 (축구)", imageUrl: "https://media.bunjang.co.kr/product/415663602_1_1786777531_w360.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item17", name: "2026 FC 서울 홈 어센틱 유니폼", price: 109000, team: "FC 서울", sport: "K리그 (축구)", imageUrl: "https://img.prospecs.com/prod/PP3FS26/PP3FS26M011/PP3FS26M011_01.jpg/dims/resizef/1000x1000/optimize", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item18", name: "2026 FC 안양 홈 어센틱 유니폼", price: 120000, team: "FC 안양", sport: "K리그 (축구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20260408/6279154/6279154_17812512623705_big.jpg?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item19", name: "2026 울산 HD 홈 어센틱 유니폼", price: 204000, team: "울산 HD", sport: "K리그 (축구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20260507/6433035/6433035_17781271520776_big.jpg?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item20", name: "2026 인천 유나이티드 홈 어센틱 유니폼", price: 153000, team: "인천 유나이티드", sport: "K리그 (축구)", imageUrl: "https://media.bunjang.co.kr/product/405132157_1_1777612204_w360.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item21", name: "2026 전북 현대 모터스 홈 어센틱 유니폼", price: 177000, team: "전북 현대", sport: "K리그 (축구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20260416/6322017/6322017_17775400347811_big.jpg?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item22", name: "2026 제주 유나이티드 홈 어센틱 유니폼", price: 129000, team: "제주 유나이티드", sport: "K리그 (축구)", imageUrl: "https://media.bunjang.co.kr/product/409047135_1_1779191514_w360.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item23", name: "2026 포항 스틸러스 홈 어센틱 유니폼", price: 129000, team: "포항 스틸러스", sport: "K리그 (축구)", imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/661511/01/fnd/KOR/fmt/png/26-%ED%8F%AC%ED%95%AD%EC%8A%A4%ED%8B%B8%EB%9F%AC%EC%8A%A4-%ED%99%88-%EC%A0%80%EC%A7%80-br26-FC-POHANG-STEELERS-HOME-JERSEY", availableSizes: ["90", "95", "100", "105", "110"] },

  // --- KBL (농구) 구단 어센틱 유니폼 ---
  { id: "item24", name: "원주 DB 프로미 홈 어센틱 유니폼", price: 45000, team: "원주 DB 프로미", sport: "KBL (농구)", imageUrl: "https://media.bunjang.co.kr/product/418339534_2_1783334808_w360.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item25", name: "서울 삼성 썬더스 홈 어센틱 유니폼", price: 67000, team: "서울 삼성 썬더스", sport: "KBL (농구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-IEpx/20251020/151428.441642304/%EC%82%BC%EC%84%B1%EC%8D%AC%EB%8D%94%EC%8A%A4_%EB%A0%88%ED%94%8C%EB%A6%AC%EC%B9%B4%20%ED%99%88%20%EC%9C%A0%EB%8B%88%ED%8F%BC_t1.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item26", name: "고양 소노 스카이거너스 홈 어센틱 유니폼", price: 65000, team: "고양 소노 스카이거너스", sport: "KBL (농구)", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-p5sO-csNzAfO6QSQUtM-4Glw1ZavT7Ktq1alE9IwLkqK-6pWuwG8cdY&s=10", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item27", name: "서울 SK 나이츠 홈 어센틱 유니폼", price: 71500, team: "서울 SK 나이츠", sport: "KBL (농구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20251124/5769037/5769037_17639721296368_big.png?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item28", name: "창원 LG 세이커스 홈 어센틱 유니폼", price: 89000, team: "창원 LG 세이커스", sport: "KBL (농구)", imageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20251020/5615120/5615120_17609427066348_big.jpg?w=1200", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item29", name: "안양 정관장 레드부스터스 홈 어센틱 유니폼", price: 99000, team: "안양 정관장 레드부스터스", sport: "KBL (농구)", imageUrl: "https://ecimg.cafe24img.com/pg2149b61054607094/moausofficial/web/product/extra/big/20250908/6fa0854e2d71b833fa56cca48212a3cf.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item30", name: "부산 KCC 이지스 홈 어센틱 유니폼", price: 80000, team: "부산 KCC 이지스", sport: "KBL (농구)", imageUrl: "https://www.kccegis.com/resources/common/images/img/club_uniform_home_2526_1.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item31", name: "수원 KT 소닉붐 홈 어센틱 유니폼", price: 79000, team: "수원 KT 소닉붐", sport: "KBL (농구)", imageUrl: "https://media.bunjang.co.kr/product/285218289_1_1746075559_w360.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item32", name: "대구 한국가스공사 페가수스 홈 어센틱 유니폼", price: 99000, team: "대구 한국가스공사 페가수스", sport: "KBL (농구)", imageUrl: "https://www.chosun.com/resizer/v2/ROPNZ63L7WQB3IDGZ66MXLFF64.jpg?auth=4716bf30e2bdf7ab3bfe40d85e4bf3d4f08e558d6b287fa19583bf715d9ea744&width=600&height=490&smart=true", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item33", name: "울산 현대모비스 피버스 홈 어센틱 유니폼", price: 96000, team: "울산 현대모비스 피버스", sport: "KBL (농구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-IEpx/20251014/092159.86246928/25-26%20%EC%9C%A0%EB%8B%88%ED%8F%BC_%EB%B0%B0%EB%84%88_HOME.jpg", availableSizes: ["90", "95", "100", "105", "110"] },

  // --- KOVO (배구) 구단 어센틱 유니폼 ---
  { id: "item34", name: "천안 현대캐피탈 스카이워커스 어센틱 유니폼", price: 55000, team: "천안 현대캐피탈 스카이워커스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/2025121614090633b772544ac4462095df4c2ba1644296/d4EFzjH4JQo4g_a3rPNofQ.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item35", name: "인천 대한항공 점보스 어센틱 유니폼", price: 55000, team: "인천 대한항공 점보스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/202512161409196dd6534dfb4644b2b1343523cc1543b5/z8DdsSPPtcBlCmaVO4TpFA.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item36", name: "의정부 KB손해보험 스타즈 어센틱 유니폼", price: 89000, team: "의정부 KB손해보험 스타즈", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/20260407/204615.804269397/24-25%EC%98%90%EB%A1%9C%EC%9A%B0%EC%9C%A0%EB%8B%88%ED%8F%BC%EC%83%81%EC%9D%98%EB%A9%94%EC%9D%B8.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item37", name: "서울 우리카드 우리WON 어센틱 유니폼", price: 59000, team: "서울 우리카드 우리WON", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/20251021/172149.125188496/%EB%A0%88%ED%94%8C%EB%A6%AC%EC%B9%B4_%ED%99%88.png", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item38", name: "대전 삼성화재 블루팡스 어센틱 유니폼", price: 55000, team: "대전 삼성화재 블루팡스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/202512161408483480ece5392f4a49a85f7b4f9afbb06a/awRWQOheX6h0HlZsrN4yTg.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item39", name: "수원 한국전력 빅스톰 어센틱 유니폼", price: 55000, team: "수원 한국전력 빅스톰", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/20251216140826219a27af1cfc4623bcde3f5ce02de697/1AIXWuM2x3lM01i3b35JDg.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item40", name: "부산 OK저축은행 읏맨 어센틱 유니폼", price: 55000, team: "부산 OK저축은행 읏맨", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/20251216140852fdf5f0921c194b18adbb26f223cc2942/JtmEBnA8gtex_OKjxqMzCg.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item41", name: "인천 흥국생명 핑크스파이더스 어센틱 유니폼", price: 55000, team: "인천 흥국생명 핑크스파이더스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/2025121614075953c85ab606084c63af1dbf66c5734973/vyeMb51mPbM3zEUWGIOFmg.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item42", name: "대전 정관장 레드스파크스 어센틱 유니폼", price: 55000, team: "대전 정관장 레드스파크스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/20251216140749da8e68820bcb4e878ba46e1271dab6b3/vRXqm3YTzkWNuvf57ivUlg.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item43", name: "수원 현대건설 힐스테이트 어센틱 유니폼", price: 55000, team: "수원 현대건설 힐스테이트", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/202512161411488fac8d7f2fd14f2f9326b1157a07db34/sWPtze9GOA9o5cRa6oVFOA.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item44", name: "화성 IBK기업은행 알토스 어센틱 유니폼", price: 55000, team: "화성 IBK기업은행 알토스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251209/PARTNER_10001473/2025120909165052a12e11264942f7b4ab535d206e832d/2hhPY8RC9_K3R-etai6mXw.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item45", name: "김천 한국도로공사 하이패스 어센틱 유니폼", price: 55000, team: "김천 한국도로공사 하이패스", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20251216/PARTNER_10001473/202512161407312d0bb75e39794a2eaed3747bf2f22c88/4PQE_g_yaDWJw1kwAvDJ6g.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item46", name: "GS칼텍스 서울 KIXX 어센틱 유니폼", price: 55000, team: "GS칼텍스 서울 KIXX", sport: "KOVO (배구)", imageUrl: "https://shopby-images.cdn-nhncommerce.com/Mall-No-4Yhe/PARTNER/20250625/PARTNER_10001473/2025062521434828a3eaf304dc4a779f5506a10f9c3681/r-ZSVSQ90M7Vu2cwbisftw.jpg", availableSizes: ["90", "95", "100", "105", "110"] },
  { id: "item47", name: "전남광주 SOOP 수퍼스 어센틱 유니폼", price: 99000, team: "전남광주 SOOP 수퍼스", sport: "KOVO (배구)", imageUrl: "public/soop_uniform.jpg", availableSizes: ["90", "95", "100", "105", "110"] }
]);

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    setUser(null);
  };

  const filteredProducts = products.filter((p) => {
    const sportMatch = selectedSport === "전체" || p.sport === selectedSport;
    const teamMatch = selectedTeam === "전체" || p.team === selectedTeam;
    return sportMatch && teamMatch;
  });

  const sports = ["전체", "KBO (야구)", "K리그 (축구)", "KBL (농구)", "KOVO (배구)"];

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product) => {
    const size = selectedSizes[product.id];
    if (!size) {
      alert("사이즈를 선택해 주세요!");
      return;
    }

    const cartItemId = `${product.id}-${size}`;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.cartItemId === cartItemId);
      if (existingItem) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, size, cartItemId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, amount) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; 
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 🔹 결제하기 버튼 핸들러 (인증 로딩이 끝날 때까지 기다리도록 보완)
  const goToCheckout = () => {
    if (authLoading) {
      alert("사용자 인증 정보를 확인 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      setIsCartOpen(false);
      navigate("/login");
      return;
    }
    
    setIsCartOpen(false);
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">
      {/* 네비게이션바 */}
      <nav className="flex items-center justify-between bg-blue-900 px-6 py-4 text-white shadow-md">
        <h1 className="text-2xl font-black tracking-wider cursor-pointer" onClick={() => { setSelectedSport("전체"); setSelectedTeam("전체"); }}>
          LockerRoom
        </h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center bg-blue-800 px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <span className="font-semibold text-sm mr-2">장바구니</span>
            {cartItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2 border-2 border-blue-900">
                {cartItems.length}
              </span>
            )}
          </button>
          <Link to="/mypage" className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition">마이페이지</Link>
          {user ? (
            <button onClick={handleLogout} className="rounded bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition">로그아웃</button>
          ) : (
            <Link to="/login" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 transition">로그인</Link>
          )}
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <div 
        className="relative text-white py-24 px-6 text-center shadow-inner bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/locker.png')" }}
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl drop-shadow-lg">모든 스포츠 구단 굿즈를 한곳에</span>
          <p className="mt-3 text-lg text-gray-200 drop-shadow-md">다양한 종목의 핫한 굿즈들을 한눈에 만나보세요!</p>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow w-full">
        {/* 스포츠 종목 필터 */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => { setSelectedSport(sport); setSelectedTeam("전체"); }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition shadow-sm ${
                selectedSport === sport ? "bg-blue-600 text-white shadow-md scale-105" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* 구단 필터 */}
        {selectedSport !== "전체" && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fadeIn">
            {(TEAMS_BY_SPORT[selectedSport] || ["전체"]).map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedTeam === team ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        )}

        {/* 상품 리스트 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
            <p className="text-lg font-medium text-gray-500">등록된 신상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition flex flex-col">
                <div 
                  onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                  className="cursor-pointer flex flex-col flex-grow"
                >
                  <div className="h-52 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm font-medium">이미지 준비중</span>
                    )}
                    {product.sport && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        {product.sport}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max">
                      {product.team || "기타"}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                    <p className="mt-1 text-gray-900 font-extrabold text-lg">{Number(product.price).toLocaleString()}원</p>
                  </div>
                </div>

                <div className="px-4 pb-3 mt-auto">
                  <select 
                    value={selectedSizes[product.id] || ""}
                    onChange={(e) => handleSizeChange(product.id, e.target.value)}
                    className="w-full p-2 mb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" disabled>사이즈 선택</option>
                    {product.availableSizes?.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>

                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 장바구니 사이드바 */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">장바구니</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-800 text-2xl font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <span className="text-4xl mb-3">🛒</span>
                  <p>장바구니가 비어 있습니다.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.length > 0 && cartItems.map((item) => (
                    <li key={item.cartItemId} className="relative flex gap-4 border-b pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
                        )}
                      </div>
                      <div className="flex-1 pr-6 flex flex-col justify-between"> 
                        <div>
                          <p className="font-bold text-sm text-gray-800 leading-tight">{item.name}</p>
                          <p className="text-xs text-blue-600 font-semibold mt-1">{item.team} | 사이즈: <span className="text-gray-800 font-bold">{item.size}</span></p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-md">
                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold rounded-l-md transition">-</button>
                            <span className="px-3 py-0.5 text-sm font-bold border-l border-r text-gray-800 w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold rounded-r-md transition">+</button>
                          </div>
                          <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 transition-colors">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-5 border-t bg-white">
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-bold text-gray-700">총 결제 금액</span>
                <span className="font-extrabold text-blue-600 text-2xl">{getTotalPrice().toLocaleString()}원</span>
              </div>
              <button onClick={goToCheckout} disabled={cartItems.length === 0} className={`w-full py-4 rounded-xl text-lg font-bold transition ${cartItems.length > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>결제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;