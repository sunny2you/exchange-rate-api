
# 🌐 **GraphQL 환율 정보 CRUD API**

> **GraphQL + MongoDB**를 사용하여 원화(KRW) ↔ 미화(USD) 환율 정보를 CRUD하는 API 서버입니다.

---

## 🚀 **프로젝트 소개**
이 프로젝트는 GraphQL을 통해 환율 정보를 조회, 등록, 수정, 삭제할 수 있는 API를 제공합니다.  
MongoDB를 데이터 저장소로 사용하며, Node.js와 Express.js 기반으로 개발되었습니다.

---

## 🛠️ **기술 스택**
- **Backend**: Node.js, Express.js, GraphQL
- **Database**: MongoDB, Mongoose
- **Dev Tools**: Nodemon, Dotenv

---

## 📂 **디렉토리 구조**
```plaintext
project-root/
├── graphql/
│   ├── resolvers.js       # GraphQL resolvers
│   ├── schema.js          # GraphQL schema
│   ├── utils/             # 유틸리티 함수
│       └── exchangeRateUtils.js
├── models/
│   └── ExchangeRate.js    # Mongoose schema
├── src/
│   └── server.js          # Express 서버 진입점
├── .env.example           # 환경 변수 템플릿
├── package.json           # 프로젝트 설정
├── README.md              # 프로젝트 설명
```

---

## 🖥️ **설치 및 실행 방법**

### 1️⃣ 저장소 클론
```bash
git clone https://github.com/sunny2you/exchange-rate-api.git
cd exchange-rate-api
```

### 2️⃣ 의존성 설치
```bash
npm install
```

### 3️⃣ 환경 변수 설정
`.env.example` 파일을 참고해 `.env` 파일을 생성하고 아래 정보를 입력하세요(해당 URI는 과제 전용 계정으로 생성되었으며, 제한된 권한만 부여된 계정입니다):
```plaintext
MONGO_URI=mongodb+srv://sampleuser:samplepass@cluster0.dwmppug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5110
```

### 4️⃣ 서버 실행
```bash
npm start
```

### 5️⃣ GraphQL Playground 접속
브라우저에서 [http://localhost:5110/graphql](http://localhost:5110/graphql)에 접속하여 API를 테스트할 수 있습니다.

---

## 🔍 **GraphQL 예제**

### 📖 **환율 조회**
```graphql
query {
  getExchangeRate(src: "krw", tgt: "usd") {
    src
    tgt
    rate
    date
  }
}
```

### ✍️ **환율 등록/업데이트**
```graphql
mutation {
  postExchangeRate(info: { src: "usd", tgt: "krw", rate: 1350.0, date: "2023-11-20" }) {
    src
    tgt
    rate
    date
  }
}
```

### ❌ **환율 삭제**
```graphql
mutation {
  deleteExchangeRate(info: { src: "usd", tgt: "krw", date: "2023-11-20" }) {
    src
    tgt
    rate
    date
  }
}
```

---

## 🛠️ **테스트**
**Curl 명령어를 통해 API를 테스트할 수 있습니다.**

### 📖 환율 조회
```bash
curl -XPOST "http://localhost:5001/graphql" \
-H "Content-Type: application/json" \
-d '{"query": "query { getExchangeRate(src: \"krw\", tgt: \"usd\") { src tgt rate date } }"}'
```

### ✍️ 환율 등록
```bash
curl -XPOST "http://localhost:5001/graphql" \
-H "Content-Type: application/json" \
-d '{"query": "mutation { postExchangeRate(info: { src: \"usd\", tgt: \"krw\", rate: 1350.0, date: \"2023-11-20\" }) { src tgt rate date } }"}'
```

### ❌ 환율 삭제
```bash
curl -XPOST "http://localhost:5001/graphql" \
-H "Content-Type: application/json" \
-d '{"query": "mutation { deleteExchangeRate(info: { src: \"usd\", tgt: \"krw\", date: \"2023-11-20\" }) { src tgt rate date } }"}'
```

---

## ❗ **유의사항**
1. **MongoDB 연결 오류**: `MONGODB_URI`를 확인하세요.
2. **포트 충돌**: `.env` 파일에서 `PORT` 값을 변경하세요.

---

## 🙋‍♂️ **문의**
프로젝트와 관련된 문의는 아래 이메일로 연락 주세요:  
📧 ally1008@naver.com

