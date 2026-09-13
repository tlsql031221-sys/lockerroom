import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
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

  // 카테고리 필터링
  const filteredProducts = selectedTeam === "전체" 
    ? products 
    : products.filter(p => p.team === selectedTeam);

  const teams = ["전체", "LG 트윈스", "두산 베어스", "KIA 타이거즈", "삼성 라이온즈"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <nav className="flex items-center justify-between bg-blue-900 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-wider">LockerRoom</h1>
        <button 
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition"
        >
          로그아웃
        </button>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">KBO 구단별 공식 굿즈 샵</h2>
          <p className="mt-2 text-gray-600">원하시는 구단의 상품을 만나보세요!</p>
        </div>

        {/* 구단 카테고리 필터 버튼 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {teams.map((team) => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedTeam === team 
                  ? "bg-blue-600 text-white shadow" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        {/* 상품 목록 그리드 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            등록된 상품이 없습니다. (Firestore의 'products' 컬렉션에 데이터를 추가해 보세요!)
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  {/* 이미지가 있다면 <img> 태그 사용 */}
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>상품 이미지</span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {product.team}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="mt-1 text-gray-900 font-ext500">{Number(product.price).toLocaleString()}원</p>
                  <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
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