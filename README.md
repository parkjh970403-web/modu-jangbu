# 모두의장부

타코집 원가·가계부 웹앱 (PRD: 「타코집 원가·가계부 PRD」, 시안: 모두의장부 화면 시안).
서버·로그인·빌드 도구 없이 동작하고, 장부는 사장님 PC의 브라우저(IndexedDB)와 직접 고른 JSON 파일에 저장된다.

## 파일
| 파일 | 역할 |
|---|---|
| `index.html` | 앱 전체 (HTML·CSS·JS 한 파일) |
| `manifest.webmanifest`, `icon*.png`, `icon.svg` | "설치" 해서 바탕화면 아이콘으로 실행 (F13) |
| `sw.js` | 오프라인 캐시. 새 버전을 올릴 때 `VERSION` 값을 바꾼다 |
| `rates.json` | 배달앱 기본 수수료. 만드는 사람이 매달 고쳐 올리면 앱이 한 달에 한 번 읽어 간다 (F16) |

## 로컬에서 열어 보기
```
python3 -m http.server 8000
# 크롬·엣지에서 http://localhost:8000
```
파일을 더블클릭(file://)해도 열리지만, 설치·오프라인·수수료 자동 갱신은 http(s) 주소에서만 동작한다.

## 배포
빌드 과정 없음. 두 곳에 올라가 있다.

| 주소 | 올리는 방법 |
|---|---|
| https://modu-jangbu.pages.dev (Cloudflare Pages, 안드로이드 앱이 쓰는 주소) | 아래 명령으로 직접 올린다. GitHub에 push해도 자동으로 바뀌지 않는다 |
| https://parkjh970403-web.github.io/modu-jangbu/ (GitHub Pages) | main에 push하면 자동 |

Cloudflare Pages에 올리기 (처음 한 번 `npx wrangler login`):
```
rm -rf /tmp/mj-deploy && mkdir -p /tmp/mj-deploy && git archive HEAD | tar -x -C /tmp/mj-deploy && rm /tmp/mj-deploy/README.md
npx wrangler pages deploy /tmp/mj-deploy --project-name modu-jangbu --branch main
```
새 버전을 올릴 때는 `sw.js`의 `VERSION`을 바꾸고, `rates.json`만 고쳤을 때도 위 명령으로 다시 올린다. 커밋한 내용만 올라간다.

`.well-known/assetlinks.json`은 안드로이드 앱(`com.modujangbu.app`)이 이 사이트의 주인임을 확인하는 파일이다. 지우거나 옮기면 앱 위쪽에 주소창이 생긴다. 플레이 콘솔의 "앱 서명 키" SHA-256 지문도 여기에 더해야 한다.

## 처음 둘러보기
"4 이번 달 결과" 맨 아래 **예시 장부 넣어 보기** → 시안과 비슷한 가짜 숫자가 들어간다. "방금 한 일 되돌리기"로 원래대로.
