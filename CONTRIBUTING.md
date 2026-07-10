# 🤝 Contributing to 업다운 감정시장

> 이 문서는 업다운 감정시장 프론트엔드 레포지토리에 기여할 때 따라야 하는 **협업 규칙과 코드 컨벤션**을 정리한 가이드입니다.

---

## 🌿 기본 워크플로우

1. Issue 생성 (작업 범위와 목적 정의)
2. 브랜치 생성 후 작업
3. PR 작성 및 리뷰 요청
4. 코드 리뷰 및 PR 승인 (3인 이상)
5. `dev`에 병합 후 작업 브랜치 삭제

---

## 🌱 브랜치 전략

### 브랜치 종류

| 구분 | 브랜치명 |
|------|---------|
| 배포용 | `main` |
| 개발용 | `dev` |
| 기능 개발용 | `feat` |
| 버그 수정용 | `fix` |
| 리팩토링용 | `refactor` |
| 스타일용 | `style` |
| 문서용 | `doc` |

### 브랜치 네이밍 규칙

**형식:** `type`/`작업명`

- `type`: `feat` / `fix` / `refactor` / `style` / `doc`
- `작업명`: `kebab-case`로 작성

**예시:**
```text
feat/community-post
fix/login-redirect
```

---

## 🔁 Pull Request 규칙

### PR 제목 규칙

**형식:** `close#이슈번호 이모지 작업 요약`

```text
close#197 🐛 비회원 투표 애니메이션 해제
```

**PR 전 체크리스트**
- [ ] PR 제목이 규칙에 맞게 작성되었는지 확인
- [ ] 작업 내용이 명확하게 설명되었는지 확인
- [ ] console.log, debugger 제거
- [ ] npm run lint 통과 확인
- [ ] 패키지 설치 여부 및 변경 사항 상세 기재
- [ ] UX에 영향을 주는 변경이라면 스크린샷/영상 첨부

---

## 🪄 커밋 컨벤션 (Gitmoji)

**형식:** `{이모지} 작업 요약`

```text
✨ 무한 스크롤 구현
🐛 답글 부모 ID 맵핑 오류 수정
```

### 커밋 타입

| 이모지 | 타입 | 설명 |
|--------|------|------|
| ✨ | `feat` | 새로운 기능 추가 |
| ✅ | `feat` | 기능 파편 추가/수정 |
| 🐛 | `fix` | 버그 수정 |
| 🚑 | `hotfix` | 긴급 수정 |
| 🎨 | `style` | 코드 포맷/스타일 변경 |
| 💄 | `style` | UI, 스타일 파일 추가/업데이트 |
| ♻️ | `refactor` | 코드 리팩토링 |
| 📝 | `docs` | 문서 작성/수정 |
| 🔥 | `remove` | 파일/코드 삭제 |
| 🚀 | - | 배포 관련 수정 |

---

## 💻 코드 컨벤션

```text
탭 크기: 2
문자열: 더블 쿼터 `"`
세미콜론 `;` 사용
PR 전 `console.log` / `debugger` 제거
```

### 컴포넌트 작성
- 컴포넌트는 함수 선언식 사용
```typescript
export default function Component() {}
```
- 이벤트 핸들러: `handle~` (예: `handleDelete`)
- 콜백 Props: `on~` (예: `onEdit`, `onChange`, `onSubmit`)
- 공통 컴포넌트의 Props에는 가능한 기본값을 지정해 사용성을 높임

### 타입 작성
- `type` 우선 사용 (`interface`는 필요한 경우만)
- 타입 불분명 시 `unknown`으로 선언 후 TODO 주석으로 보완 필요성 명시
- `null`보다 `undefined` 선호
- 옵셔널 체이닝 `?.`, 널 병합 연산자 `??` 적극 사용

### 클래스/스타일
- 클래스 병합 시 `twMerge` 사용
- 외부에서 전달받은 `className`은 항상 마지막에 병합하여 오버라이드 가능하게 유지

---

## 📁 파일 & 폴더

### 네이밍 규칙

| 구분 | 컨벤션 |
|------|--------|
| 파일/폴더 | `kebab-case` |
| 컴포넌트 | `PascalCase` |
| Hook | `useName` |
| Boolean | `isName`, `hasName`, `canName`, `shouldName` |
| Type/Interface | `Name`, `NameProps`, `NameType` |
| Zustand Store | `useNameStore` |

---

## 🧭 Next.js 작업 가이드

- `"use client"`는 가능한 한 하위 컴포넌트에만 선언
- 데이터 패칭은 가능한 한 Server Component에서 수행 후 Client Component로 전달
- `<Suspense>`를 적극 사용해 구역별 로딩 상태를 명확하게 분리
- 이미지와 링크는 Next.js 컴포넌트(`<Image>`, `<Link>`) 사용
- `page.tsx`는 기본적으로 Server Component로 유지