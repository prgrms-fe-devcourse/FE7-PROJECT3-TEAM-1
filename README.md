
<p align="center">
  <a href="https://fe-7-project-3-team-1.vercel.app/" target="_blank">
    <img width="280" height="103" alt="image" src="https://github.com/user-attachments/assets/66ed6944-099c-4c74-91c5-dc41a3ba6166" />
  </a>
</p>

# 📈 업다운 감정시장

> 그날의 감정을 기록하고 지수화하여 트렌드를 한눈에 파악할 수 있는 감정 공유 커뮤니티 서비스

---

## 1️⃣ 프로젝트 개요

### 📖 소개

기존 SNS에서는 행복한 순간만 포장되거나 감정이 휘발되어 자신의 진짜 감정 패턴을 알기 어렵습니다.

**업다운**은 매일의 감정을 주식 차트처럼 '지수화'하여 기록하고 시각화함으로써,
사용자가 자신의 감정 패턴을 객관적으로 이해하고 커뮤니티에서 공감과 위로를 나눌 수 있도록 기획된 서비스입니다.

- **개발 기간**: 2025.11.05 ~ 2025.11.20
- **서비스 링크**: [업다운 바로가기](https://fe-7-project-3-team-1.vercel.app/)

### ✅ 주요 기능

- **감정 지수 & 트렌드 시각화**: 커뮤니티 전체 감정 데이터를 주식 차트로 시각화, 상승/하락 감정 TOP 3 및 실시간 트렌드 태그 제공
- **감정 기반 커뮤니티**: UP/DOWN/HOLD로 감정 포스트 작성, 좋아요·댓글·답글·팔로우로 소통
- **개인화 마이페이지**: 나만의 감정 그래프로 최근 감정 흐름 시각화, 작성/조회 글 관리

### 🔎 팀원 소개
| 이름 | 역할 | GitHub |
|---|---|---|
| 이상엽 | 팀장, 로그인·프로필·소개 페이지 | [@Sangyeop1555](https://github.com/Sangyeop1555) |
| 박상아 | 디자인 총괄, 커뮤니티·게시글 상세 페이지 | [@garlatonic](https://github.com/garlatonic) |
| 한성수 | 메인 대시보드 페이지 | [@elecharu](https://github.com/elecharu) |
| 이상윤 | 헤더·검색 페이지 | [@SangYoonLee1231](https://github.com/SangYoonLee1231) |
| 송주원 | 글쓰기·알림·404 페이지 | [@singilwon](https://github.com/singilwon) |

---

## 2️⃣ 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| DB | Supabase (PostgreSQL) |
| Chart | Recharts v3 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| 상태관리 | Zustand, Supabase Realtime |
| 협업 도구 | Figma, Git, Vercel |

---

## 3️⃣ 개발 환경 설정

### 📋 요구 사항

- **Node.js**: `>= 18.0.0`
- **패키지 매니저**: `npm`
- **추천 IDE 플러그인**: ESLint, Prettier, Tailwind CSS IntelliSense

### 🚀 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/prgrms-fe-devcourse/FE7-PROJECT3-TEAM-1.git
cd FE7-PROJECT3-TEAM-1

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

### 📜 주요 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 자동 포맷팅 |
| `npm run gen` | Supabase 타입 자동 생성 |

---

## 4️⃣ 프로젝트 구조

```
src/
├── app/          # Next.js App Router (라우트 + 페이지)
├── assets/       # 이미지, 아이콘 등 정적 파일
├── components/   # 재사용 가능한 공통 UI 컴포넌트
├── contexts/     # Context API Provider 모음
├── css/          # 전역 스타일
├── features/     # 기능 단위 모듈 (도메인별 컴포넌트/로직)
├── hooks/        # 커스텀 React Hook
├── lib/          # 외부 라이브러리 설정 (Supabase 등)
├── store/        # Zustand 전역 상태 스토어
├── types/        # TypeScript 공용 타입 정의
└── utils/        # 유틸리티 함수
```

---

## 5️⃣ 핵심 구현 포인트

### 🔄 무한 스크롤 & CRUD

- `IntersectionObserver`를 활용한 무한 스크롤로 끊김 없는 탐색 경험 제공
- 게시글 상세 조회·수정·삭제 CRUD 로직 안정적으로 구현

### 💬 댓글 / 답글 시스템

- 대댓글 기능 구현으로 사용자 간 깊이 있는 소통 유도
- Supabase 테이블에서 `comment_id` 하나로 계층 구조 관리, 불필요한 연산 최소화
- 삭제 시 모달로 사용자 실수 방지 및 데이터 무결성 확보

### ⚡ 실시간 반응형 UX

- Supabase Realtime 구독으로 좋아요·댓글 반응 실시간 제공
- 낙관적 업데이트(Optimistic Update) 적용으로 즉각적인 피드백 제공

### 📊 감정 트렌드 시각화

- 감정 데이터 실시간 집계 및 랭킹화 → 오늘의 감정 TOP 3
- 커뮤니티 내 고빈도 키워드를 태그 클라우드로 시각화

---

더 자세한 개발 컨벤션과 PR 작성 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고해주세요.
