<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c4d234df-05e2-4666-bd50-96089067a941

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

이 저장소는 `Selective-course2`라는 이름으로 GitHub에 올린다고 가정하고 설정되어 있습니다.

1. GitHub에서 `Selective-course2`라는 이름의 새 저장소를 만들고, 이 폴더의 내용을 그대로 업로드(커밋)합니다.
2. 저장소 **Settings → Secrets and variables → Actions → New repository secret**에서
   - Name: `GEMINI_API_KEY`
   - Value: 본인의 Gemini API 키
   를 등록합니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
4. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드·배포하며, 완료되면
   `https://<GitHub 사용자명>.github.io/Selective-course2/` 에서 접속할 수 있습니다.

> 참고: 이 방식은 API 키를 빌드 시점에 클라이언트 번들에 포함시키는 방식이라, 배포된 사이트의 JS 파일을 열어보면 키가 노출됩니다. 다른 학생용 도구들과 동일한 방식이니 참고만 해주세요.
