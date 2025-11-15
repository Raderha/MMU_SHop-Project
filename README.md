# MMU Mart - 쇼핑몰 프로젝트

React와 Express를 사용한 웹 기반 쇼핑몰 프로젝트입니다.

## 프로젝트 구조

```
Shop_DB_Project/
├── Front/                    # 프론트엔드 (React + Vite)
│   ├── public/
│   │   └── items_img/       # 상품 이미지 파일
│   ├── src/
│   │   ├── components/      # 공통 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetailView.jsx
│   │   │   ├── ShoppingCart.jsx
│   │   │   └── Banner.jsx
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ShoppingCart.jsx
│   │   ├── modals/          # 모달 컴포넌트
│   │   │   ├── LoginModal.jsx
│   │   │   ├── RegisterModal.jsx
│   │   │   ├── FindPW.jsx
│   │   │   └── Modal.css
│   │   ├── utils/           # 유틸리티
│   │   │   ├── api.js
│   │   │   └── cart.js        # 장바구니 관리 유틸리티
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── Backend/                  # 백엔드 (Express + MongoDB)
    ├── src/
    │   ├── config/          # 설정 파일
    │   │   └── db.js        # MongoDB 연결 설정
    │   ├── controllers/    # 컨트롤러
    │   │   ├── authController.js
    │   │   ├── itemController.js
    │   │   └── productController.js
    │   ├── models/        # 데이터 모델
    │   │   ├── User.js
    │   │   ├── Item.js
    │   │   └── Product.js
    │   ├── routes/          # 라우터
    │   │   ├── auth.js
    │   │   ├── items.js
    │   │   ├── products.js
    │   │   └── users.js
    │   ├── middleware/      # 미들웨어
    │   │   └── auth.js      # JWT 인증 미들웨어
    │   └── server.js        # 서버 진입점
    └── package.json
```

## 사전 준비

### 필수 요구사항

- **Node.js** (v16 이상 권장)
- **MongoDB** (로컬 또는 원격 MongoDB 서버)
- **npm** 또는 **yarn**

## 실행 방법

### 1. 의존성 설치

#### 프론트엔드
```bash
cd Front
npm install
```

#### 백엔드
```bash
cd Backend
npm install
```

#### 백엔드 서버 실행 (포트 5000)
```bash
cd Backend
npm run dev
```

#### 프론트엔드 서버 실행 (포트 3000)
```bash
cd Front
npm run dev
```

## 주요 기능

### 사용자 인증
- 회원가입 / 로그인 / 로그아웃
- JWT 토큰 기반 인증
- 비밀번호 찾기

### 상품 관리
- 상품 목록 조회 및 필터링
- 상품 상세 정보 조회
- 카테고리별 상품 필터링
- 가격 및 색상 필터링

### 장바구니 기능
- 상품 장바구니 추가/제거
- 장바구니 아이템 수량 조절
- 장바구니 총액 계산
- 배달비 계산 (2,500원 고정)
- 할인 적용 (50,000원 이상 구매 시 5% 할인)
- 프로모 코드 입력 기능
- 관련 상품 추천 (Recommended Items)