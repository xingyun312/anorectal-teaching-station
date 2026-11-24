# 肛肠专科互动教学站

面向**进修医生**与**助理全科医师**的肛肠专科临床思维与手术决策互动教学平台（纯前端静态站点，支持零成本托管于 Cloudflare Pages / Workers Static Assets）。

## 功能模块

1. **痔、肛瘘、肛周脓肿病例闯关**：8 例临床真实情景病例，涵盖 Goligher 分度、Goodsall 定律、高位深部骨盆直肠间隙脓肿及克罗恩病肛瘘鉴别陷阱。
2. **手术适应证与术式选择模拟**：交互式术式决策推演器 + 实战考核（含妊娠期、抗栓/抗凝、高龄括约肌薄弱等特殊人群）。
3. **肛管直肠解剖互动图**：冠状面交互图谱（9 大核心解剖结构与手术红线）+ Parks 4 型肛瘘路径叠加 + 截石位 Goodsall 定律实时推演器。
4. **术后并发症判断练习**：涵盖脱线期继发性大出血、急性尿潴留、肛缘皮桥水肿、创面假性愈合、肛门狭窄与括约肌损伤预警。
5. **带教病例库与考核记录**：关键词检索/收藏病例库、本地持久化考核记录、自动错题本、JSON 导出及一键打印出科成绩单。

## 本地运行

```bash
npm install
npm run dev
```

## 构建与 Cloudflare 托管（GitHub 联动）

1. 将本目录初始化并推送到你的 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "feat: 初始化肛肠专科互动教学站"
   git branch -M main
   git remote add origin <你的 GitHub 仓库地址>
   git push -u origin main
   ```
2. 登录 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Connect to Git**，选择你的 GitHub 仓库：
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
   - 若使用 Cloudflare Workers Static Assets，仓库根目录已内置 `wrangler.jsonc`，也可直接执行 `npx wrangler deploy`。
