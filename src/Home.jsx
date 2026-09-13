import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedSport, setSelectedSport] = useState("전체");
  const [selectedTeam, setSelectedTeam] = useState("전체");
  const navigate = useNavigate();

  // 파이어베이스에서 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("상품을 불러오는 중 오류가 발생했습니다: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 종목 및 팀 필터링 로직
  const filteredProducts = products.filter((p) => {
    const sportMatch = selectedSport === "전체" || p.sport === selectedSport;
    const teamMatch = selectedTeam === "전체" || p.team === selectedTeam;
    return sportMatch && teamMatch;
  });

  const sports = ["전체", "KBO (야구)", "KBL (농구)", "KOVO (배구)"];
  
  // 선택된 종목에 따른 하위 팀 목록 동적 변경 (예시)
  const getTeamsBySport = () => {
    if (selectedSport === "KBO (야구)") return ["전체", "LG 트윈스", "두산 베어스", "KIA 타이거즈", "삼성 라이온즈"];
    if (selectedSport === "KBL (농구)") return ["전체", "서울 SK 나이츠", "원주 DB 프로미"];
    if (selectedSport === "KOVO (배구)") return ["전체", "수원 현대건설 힐스테이트", "인천 대한항공 점보스"];
    return ["전체"];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 네비게이션 바 */}
      <nav className="flex items-center justify-between bg-blue-900 px-6 py-4 text-white shadow-md">
        <h1 className="text-2xl font-black tracking-wider cursor-pointer" onClick={() => { setSelectedSport("전체"); setSelectedTeam("전체"); }}>
          LockerRoom
        </h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => alert("내 정보 페이지는 준비 중입니다!")}
            className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition"
          >
            내 정보
          </button>
          <button 
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </nav>

      {/* 상단 히어로 배너 이미지 영역 */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-6 text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Official Sports Merchandise
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            전 종목 공식 굿즈 통합 신상품 쇼케이스
          </h2>
          <p className="mt-3 text-lg text-gray-300">
            야구, 농구, 배구 등 다양한 종목의 핫한 신상품을 한눈에 만나보세요!
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow w-full">
        {/* 상위 종목(리그) 탭 필터 */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => { setSelectedSport(sport); setSelectedTeam("전체"); }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition shadow-sm ${
                selectedSport === sport 
                  ? "bg-blue-600 text-white shadow-md scale-105" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* 하위 구단 필터 (종목 선택 시 활성화) */}
        {selectedSport !== "전체" && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fadeIn">
            {getTeamsBySport().map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedTeam === team 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        )}

        {/* 상품 목록 그리드 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
            <p className="text-lg font-medium text-gray-500">등록된 신상품이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">Firestore에 해당 조건의 상품 데이터를 추가해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition flex flex-col">
                <div className="h-52 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">상품 이미지 준비중</span>
                  )}
                  {product.sport && (
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {product.sport}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max">
                    {product.team || "기타"}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-gray-900 font-extrabold text-lg">{Number(product.price).toLocaleString()}원</p>
                  <button className="mt-auto pt-3 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                    구매하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;