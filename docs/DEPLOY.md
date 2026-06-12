# GitHub Pages 上线指南

项目路径：`sites/timothy-yap-portfolio`  
部署方式：推送到 GitHub 后，Actions 自动发布。

---

## 一次性设置（约 5 分钟）

### 1. 初始化 Git 并推送到 GitHub

在项目文件夹打开终端：

```powershell
cd "C:\Users\timot\Documents\I Have a Plan\sites\timothy-yap-portfolio"
git init
git add .
git commit -m "Initial portfolio site"
gh repo create timothy-yap-portfolio --public --source=. --remote=origin --push
```

或用 **GitHub Desktop**：
1. File → Add local repository → 选上面路径
2. Publish repository → Name: `timothy-yap-portfolio` → Public

### 2. 开启 GitHub Pages

1. 打开 https://github.com/Motypro66/timothy-yap-portfolio/settings/pages
2. **Build and deployment → Source** 选 **GitHub Actions**
3. 回到 **Actions** 标签，等 Deploy 变绿 ✅

### 3. 你的网站地址

```
https://motypro66.github.io/timothy-yap-portfolio/
```

---

## 本地开发

```powershell
cd "C:\Users\timot\Documents\I Have a Plan\sites\timothy-yap-portfolio"
npm install
npm run dev
```

浏览器打开 http://localhost:5173/timothy-yap-portfolio/

---

## 以后每次改完

```powershell
git add .
git commit -m "描述你的改动"
git push
```

Actions 约 1–2 分钟自动重新部署。

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 白屏 / 资源 404 | 确认 `vite.config.ts` 里 `base: '/timothy-yap-portfolio/'` 与仓库名一致 |
| Actions 失败 | Settings → Pages → Source 必须是 **GitHub Actions** |
| 本地 npm 报错 | 需要 Node.js 18+ |
