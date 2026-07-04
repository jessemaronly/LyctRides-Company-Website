# LyctRides 官网全面重建 · 设计规格(Design Spec)

- 日期:2026-07-04 · 作者:Fable 5(规划)→ Sonnet 5(施工)
- 状态:待用户最终审阅
- 上线前提:**公安联网备案通过后才部署**(见记忆 lyctai-beian-cutover-state)

---

## 0. 为什么重建(用户原始诉求,验收时逐条回看)

1. 现站信息爆炸,用户找不到想了解的 → **三层信息架构**
2. 向 Uber/Lyft/Didi 取经,但我们不做网约车 → **偷体验语言,不偷业务模型**
3. 交互太差,不像底层有 LyctAI 的公司 → **三个签名式交互 + 全站动效系统**
4. 用 Fable 5 规划做出更好看更好用的网页 → 本 spec
5. 优化 Google/Bing/Baidu 搜索 + 社媒宣传 → **§7 SEO 交接计划**

---

## 1. 不可违背的约束(红线,优先级最高)

1. **合规红线词永不出现在任何新页面**:网约车、打车、即时叫车、自营车队、自有车队、司机入驻、招募司机、零担、快车、顺风车、拼车。唯一例外:法务层以否定句式声明(见下)。
2. **terms/privacy 的 7 条法律定性表述原文迁移、一字不改**(完整原文见附录 A;含"不从事道路旅客运输或网约车经营…"、"车辆与驾驶由具备相应道路运输经营资质的合作供应商提供…"、"居间协调方,不承担承运人责任"、"邀请制…不提供面向公众的自助注册或下单"、"不提供按次在线车费支付"及 privacy 两条)。
3. **营销页口径 = 直接服务措辞**("我们的管家 / 为您配备 / LyctRides 提供"),既不写"供应商派出",也不明写自有/雇佣。对客称**管家**(EN: chauffeur),不称司机。
4. **全站 footer 保留 ICP 备案号"粤ICP备2026084775号"**(链 beian.miit.gov.cn)+ 公安备案号占位(号下来后填,链 beian.gov.cn)。中英文路径都要有;**英文路径下备案号保持中文原文不翻译、链接不省略**(工信部展示规范),可附一行英文说明 "ICP filing — required by PRC regulations"。
5. 不做在线支付、不做公开注册下单、不展示实时叫车类 UI。表单只收"洽谈线索"。
6. 品牌名只写 **LyctRides**(驼峰);中文主体名 光年(广州)汽车服务有限责任公司;法定英文名 LyctRides Car Service Co., Ltd.。

## 2. 信息架构:三层

### 2.1 第 1 层 · 主导航(6 项)

`首页 · 解决方案 · LyctAI · 企业服务 · 公司(关于/动态/招聘 下拉) · 联系`

全站单一主 CTA:**企业洽谈**(联系页表单)。次 CTA:预约方案(同表单,预填场景)。

### 2.2 第 2 层 · 深度 + SEO 落地层(不进主导航;由解决方案页、页脚、sitemap、站内链接进入)

7 个场景深度页 + 车型页 + 城市页 + 动态 + 招聘。

### 2.3 第 3 层 · 法务层

用户协议 / 隐私政策 / 备案信息。

## 3. URL 总表(中文在根路径,英文镜像在 /en/)

| 中文 URL | 英文 URL | 页面 | 迁移来源(必保信息见 §5) |
|---|---|---|---|
| `/` | `/en/` | 首页 | index.html |
| `/solutions/` | `/en/solutions/` | 解决方案总览 + 配置器 | services.html |
| `/solutions/executive-chauffeur/` | `/en/solutions/executive-chauffeur/` | ① 高管专属用车 | longterm.html(年约/月季结算/6 城 expat 区) |
| `/solutions/airport-rail-concierge/` | `/en/solutions/airport-rail-concierge/` | ② 机场·高铁礼宾 🆕 | 新写(见 §4.3) |
| `/solutions/airport-transfer/` | `/en/solutions/airport-transfer/` | ③ 接送机·接送站 | services/airport.html(机场代码表/车型规格/浦东案例) |
| `/solutions/business-hospitality/` | `/en/solutions/business-hospitality/` | ④ 商务接待 | services/hourly.html + cityrides.html(计费定义/固定费率承诺/场景) |
| `/solutions/events/` | `/en/solutions/events/` | ⑤ 活动·会议包车 | services/events.html(5 个量化案例/100+ 车) |
| `/solutions/intercity-crossborder/` | `/en/solutions/intercity-crossborder/` | ⑥ 跨城·跨境 | services/citytocity.html(港深 90min 流程/48h 规则/路线组) |
| `/solutions/private-jet/` | `/en/solutions/private-jet/` | ⑦ 公务机 | services/privatejet.html |
| `/lyctai/` | `/en/lyctai/` | LyctAI 技术底座 | lyctai.html(6 能力/4 层架构/4 原则) |
| `/enterprise/` | `/en/enterprise/` | 企业服务 | enterprise.html(Net30/60/90、80+ 字段、3 级权限、8 行业、1 日开户) |
| `/vehicles/` | `/en/vehicles/` | 车型臻选 | vehicles.html(6 车规格含升数/管家标准) |
| `/cities/` + `/cities/{shanghai,beijing,guangzhou,shenzhen,hongkong}/` | `/en/cities/…` | 城市覆盖 hub + 5 城页 | about.html 覆盖模块拆出 + 扩写 |
| `/about/` | `/en/about/` | 关于(品牌故事/时间线/价值观) | about.html |
| `/news/` + `/news/<slug>/` | `/en/news/…` | 动态列表 + 文章静态页 | news.html + article.html + data/news.json |
| `/careers/` | `/en/careers/` | 招聘 | careers.html + data/careers.json |
| `/contact/` | `/en/contact/` | 联系(表单/FAQ) | contact.html(5 条 FAQ/K341 地址/7 意向选项) |
| `/terms/` `/privacy/` | `/en/terms/` `/en/privacy/` | 法务 | terms.html / privacy.html(原文迁移) |

**301 映射**:所有 19 个旧 URL → 上表对应新 URL(nginx 层配置;services.html→/solutions/、services/hourly.html 与 cityrides.html→/solutions/business-hospitality/、longterm.html→/solutions/executive-chauffeur/、holding.html→/;其余一一对应)。映射表随实现产出,提交进仓库 `docs/redirects-301.md` 并写进 nginx conf。

## 4. 页面内容模型(逐页骨架)

### 4.1 首页(转化主战场,克制到 8 个 section)

1. **Hero**:品牌主张(行有度·礼有节 / Travel with Measure · Service with Manner)+ 一句 LyctAI 驱动定位 + 主 CTA「企业洽谈」+ **事实带**(§6.1)
2. **7 场景卡**(紧凑网格,每卡一句钩子)→ 各深度页
3. **信任带**:3 个量化案例轮播(上海时装周 4 天 80 辆 / 浦东 23:50 落地 00:41 抵店 / 港深门到门 90 分钟)+ 8 行业客户条
4. **LyctAI teaser**:聚焦"智能匹配与流程效率"(3 项 Live 能力)→ /lyctai/。措辞调度的是**信息与流程**,不写"调度车辆/运力"类表述
5. **车型速览** 4 卡(旗舰轿车/行政轿车/高端商务/考斯特 + 载客数)→ /vehicles/。卡组旁固定一行小字:**"车辆与管家服务由具备资质的合作供应商提供"**(与 terms 第 2 条同口径,打断"车+系统=自营"的连续读感)
6. **覆盖**:300+ 城市 · 港澳台跨境 → /cities/
7. **企业参数带**:Net 30/60/90 · 80+ 计费字段 · 1 个工作日开户 → /enterprise/
8. **终版 CTA + footer**

### 4.2 解决方案总览 /solutions/

开场一句定位 → **方案顾问**(对客名称;内部代号 configurator,§6.2)→ 7 场景卡(次序:高管专属打头 → 机场·高铁礼宾 → 接送机 → 商务接待 → 活动 → 跨城跨境 → 公务机)→ 礼宾服务标准 4 项(24/7 双语分钟级响应 / 举牌接机 / 企业支付 80+ 字段 / 出行定制含路演预勘)→ CTA。

### 4.3 机场·高铁礼宾(新业务,唯一从零写的页面)

定位:机场/高铁站的**地面礼宾服务**(h1/标题禁用"VIP 通道/礼宾特权"类强特许词)——贵宾接送举牌、**陪同引导至安检口与排队时间规划**(禁写"安检协助/快速安检")、贵宾厅引导、行李全程协助、专人陪同,可无缝衔接接送车。"优先/贵宾通道"仅可写"通道**对接协助**"且附说明:"具体通道资源以各机场/车站官方政策及供应商资质为准"。页内固定资质边界句:**"相关站内引导与协助服务由具备相应资质的合作供应商在其授权范围内提供。"** 措辞总原则:礼宾≠承运≠特许,全部用"协助/引导/衔接/规划"类动词。结构:场景痛点 → 服务包含(6 项)→ 流程 3 步 → 与接送机的衔接 → CTA。内容由施工时按此口径撰写,双语。

### 4.4 其余深度页

沿用旧页优质骨架(服务包含/流程/车型/覆盖/真实案例/FAQ/CTA),内容从 §3 迁移来源逐块搬运 + 按 §5 修正。每页尾部:相关场景横向推荐(3 卡)+ 城市链接,织内链网。

**商务接待页(business-hospitality)特别要求**(合并 hourly + cityrides 两页,信息不许抹平):
1. 页内分**两种子模式**清晰呈现:「时租·日租」(半日=4h / 全日=8 或 10h / 多日,车型-场景对照表)与「单程点对点」(按次计费、无订阅无承诺、**城市分区固定费率/无高峰加价/无夜间附加/无隐藏收费**——全站唯一计费透明承诺,原文保留)。
2. 保留**「入境游客包车」子场景**及其行程范例(上海一日多点行程)与关键词族(入境中国包车/来华游客包车/China inbound chauffeur/tourist driver China)——这是独立业务线,不是重复内容。

### 4.4a 车型臻选页模型(/vehicles/)

必含 5 个子模块,缺一不可:① 6 车规格表(载客/行李件数/后备箱升数);② 管家培训标准(200+ 学时/30+ 门课程);③ 着装规范(黑色定制西装/白手套/皮鞋);④ 车内物资清单(矿泉水/湿巾/充电线/阅读灯/报刊,每程更换)+ 温度预设/隔断可选;⑤ 环境香氛(S-Class 配备,可选无香)。**车型规格以本页为全站唯一权威数据源**(实现为共享数据文件,airport-transfer 等页引用同一来源,禁止各页自维护副本)。

### 4.5 LyctAI 页

6 能力(3 Live + 3 Roadmap,量化指标保留:22 字段/2 步映射/7 维度/4 类意图/月报/日简报)→ **活架构图**(§6.3)→ 4 设计原则(AI 不替代承诺/人在决策环上/国产模型优先/可解释可审计)。架构图里"Driver App"文案改为"Chauffeur App / 履约端"。

### 4.6 关于 / 城市 / 动态 / 招聘 / 联系

- 关于:品牌故事全文(光年=Light 无声精准 + Year 日复一日持守)、时间线 2018/2020/2023/2026、四价值观详述版。
- 城市页模板:该城覆盖范围(机场/商圈/expat 区)+ 适用场景卡 + 当地案例(有则放)+ CTA。首发 5 城,后续按矩阵扩(§8.4)。**香港页承接**:HK 驾照双语管家 + 大湾区联运细节;**澳门(中英葡三语管家/HKZM 大桥)与台湾(TPE·TSA·KHH/两岸商旅)不在首发 5 城,其覆盖细节保留在 /cities/ hub 页与 /about/ 覆盖模块中**,不许因拆分而无处安放。
- 动态:列表 + **文章静态化**(build 时从 data/news.json 生成 /news/<slug>/,每篇独立 canonical/OG/Article JSON-LD;保留 API 优先 + JSON 兜底的运行时增强,但 SEO 不再依赖 JS)。
- 招聘:文化 3 支柱 + 职位(build 时从 careers.json 生成 + JobPosting JSON-LD)+ 申请表单(POST /api/public/careers/apply 不变)。
- 联系:表单(POST /api/public/leads 不变,7 个意向选项保留)+ 5 条 FAQ 原样迁移(含"不提供按次在线支付/以签约企业客户为主"两条边界表述)+ 完整地址(含 106 房 K341)。

## 5. 内容修正清单(迁移时一并执行)

1. **V-Class 载客数全站统一为 6 人**(用户拍板)。
2. **EHL 认证表述全部清除**:careers.html 的"EHL Certified"徽章、data/news.json 内所有 EHL 措辞(至少涉及 `gba-expansion-2025` / `cbt-awards-2024` / `zeekr-fleet-addition-2024` 三篇,以全文 grep 为准)→ 改为"光年服务标准/200+ 学时培训"口径;**同一批文章正文里的"司机"一并替换为"管家"**(与 §5.4 同一趟处理)。
3. **GDPR Compliant 标签删除**,合规主张统一为 **PIPL**。
4. **"司机"残留清零**:citytocity"双语跨境司机"、events"司机简报协议"→ 管家(meta/SEO 关键词中的"双语司机"等搜索词保留,那是用户搜索语言)。替换"管家简报协议"时,**VIP 名单/着装规范/NDA 保密协议/统一着装定制四项流程内容完整保留**,只换词不删段。
5. article 页 canonical/og:url 指向自身 URL(静态化后天然解决)。
6. 全站日期/数字口径复核:成立 2018-08-08、300+ 城市、10K+ 企业客户、团队 120+,以现站数字为准,不虚增。

## 6. 交互与动效规格(「底层有 LyctAI」的手感)

### 6.0 总原则

- 动效是**信息的呈现方式**,不是装饰。每个动效必须回答"它让用户更懂了什么"。
- 时长:微交互 150–250ms,场景转场 400–600ms;缓动统一 `cubic-bezier(0.32,0.72,0,1)`(现站 --ease-ios,延续肌肉记忆)。
- 全部尊重 `prefers-reduced-motion`(退回静态终态);无 JS 时内容完整可读(渐进增强)。
- 移动端动效减配版(去视差/去粘性,保留 reveal 与转场)。

### 6.1 签名交互 ① 事实带(首页 hero)

一条单行、等宽字体的事实带,**静态玉色圆点(不做呼吸/脉冲——呼吸灯的视觉语义=运力在线,是网约车读感,禁用)**+ 轮播 3–5 条**历史聚合事实**(如"覆盖 300+ 城市 · 10K+ 企业客户""港深跨境 · 门到门约 90 分钟""上海时装周 · 4 天 80 辆车")。**内容硬规则:禁止出现日期敏感词(今日/现在/实时/当前/在班)与任何运力数量表述**,只允许历史聚合事实与已完成案例。数据源:构建期 JSON(`src/data/facts.json`);实现层命名一律用 facts/highlights,**禁用 status/live/online 类命名**(防止未来运营顺手填入实时口径)。轮播:8s/条,淡入淡出,hover 暂停。

### 6.2 签名交互 ② 方案顾问(/solutions/,内部代号 configurator)

三步选择:**场景**(7 选 1)→ **城市**(5+其他)→ **人数/行李**(区间)。即时输出:**文字为主的方案说明卡**(建议服务组合 + 建议车型**以图标级小图 + 文字呈现,禁止车型大图卡库式陈列**——那是选车下单页的视觉语言)+ 一句为什么 → CTA 统一用**「获取方案」/「转交商务对接」**(跳联系表单并预填;**禁用"预约/立即用车/叫车"类动词**)。组件顶部常驻双语提示:**"本工具用于生成沟通方案,不构成在线预约或下单。"** 纯前端决策树(`src/data/configurator.json`),无价格、无下单、无实时可用性。选择切换用 250ms 交叉淡入,结果卡从下方 12px 浮入。**过线判定(写进验收)**:请一位非公司人员首次看到该页,5 秒内回答"这是不是能直接叫车"——答案含混即判不合格,重新弱化。

### 6.3 签名交互 ③ LyctAI 活架构图

分层 SVG(4 层架构 + 4 类入口),hover 高亮所在层并显示一句职责说明;6 能力节点:Live=玉色实心标识点(静态,不做呼吸/脉冲,与 §6.1 同一纪律),Roadmap=灰色空心。滚动进入时分层依次亮起(stagger 120ms)。触屏:tap 展开,再 tap 收起。

### 6.4 全站动效系统(基础层)

- **页面转场**:Astro View Transitions,同层导航用 250ms 交叉淡入;进入深度页时,被点击的场景卡做 morph 过渡(卡片→页头)。
- **滚动 reveal**:进入视口渐显 + 12–24px 上移,组内 stagger 60ms;标题模糊渐入(blur 12→0)只用于每页 h1。
- **导航**:滚动收拢(logo 与留白缩小、玻璃加深),向下滚隐藏/向上滚出现(移动端)。
- **数字**:统计数字进入视口 count-up(1.3s easeOutCubic,tabular-nums 防抖)。
- **卡片 hover**:上浮 6px + 阴影加深 + 图片 1.05 缩放(500ms);CTA hover 箭头右移 4px。
- **图片**:hero 慢 Ken Burns(20s,幅度 ≤4%);懒加载 + LQIP 占位。

## 7. 视觉方向

1. **色彩**:基底不变——`#0A0A0A` + `#FAFAF7`。新增**唯一功能色:玉色(Jade)** `#1D9E75`(亮景强调)/`#0F6E56`(深景),**仅限**:运营状态带呼吸点、LyctAI Live 标识、配置器当前选中态、表单 focus 与成功态。禁止:大面积色块、装饰性使用、第三种颜色。任何视口内玉色占比 ≤5%。
2. **字体**(全部自托管 + 子集化):Albert Sans(西文标题/正文)、Noto Sans SC(中文正文)、Noto Serif SC(中文大标题,关于/品牌叙事场合)、JetBrains Mono(数据/状态带/代码感元素)。中文字体按用字子集化(构建期),首屏字体预载 ≤2 个文件。
3. **版式**:大留白、窄正文列(65–75ch)、超大 h1(clamp 2.5–5rem)、编辑部式排版;数据用等宽字体呈现,是"系统感"的字体语言。
4. **摄影**:延续现库(黑色系车辆/管家白手套/城市夜景),新增机场·高铁礼宾题材可后补,先用现库 + 排版补位。

## 8. SEO 与社媒规格

1. **双语路径分离**:根=zh-CN,`/en/`=en;每对页面 hreflang 互指 + `x-default → /en/`;html[lang] 正确;语言切换器为**真实链接**(非 JS 切换),偏好写 localStorage `lyct-lang`(与后台共用键)但**不自动跳转**(避免爬虫劫持),仅在站内导航时保持所选语言。
2. **JSON-LD 全覆盖**:全站 Organization+LocalBusiness(首页,含 3 电话/地址/成立日期/sameAs);Service(7 场景页);Article(每篇动态);JobPosting(职位);ContactPage;BreadcrumbList(全部深度页);ItemList(动态列表)。
3. **零海外运行时依赖**:Tailwind 构建期编译(@tailwindcss 本地),字体自托管,无 Google Fonts/CDN 外链——百度蜘蛛可稳定渲染,CWV 达标(LCP<2.5s / CLS<0.1 / INP<200ms,移动端 Lighthouse ≥90)。
4. **关键词继承与扩张**:audit 所列各页现有词(北京/上海机场接送、深港跨境用车、外籍长包车、会展用车、hourly chauffeur、expat chauffeur China…)由对应新页继承进 title/description/h1;城市×服务矩阵页首发 5 城 hub,数据结构预留 `city × solution` 组合页扩展。
5. **收尾动作**:XML sitemap(双语全 URL);robots.txt;301 全量;上线后 Google Search Console + Bing Webmaster + 百度站长(主动推送 API)提交;GA4 + 百度统计(轻量、无个人数据)。
6. **社媒**:每页独立 OG 图(构建期生成,统一模板:黑底白字 + 页面标题 + 品牌签名行);twitter:card 补齐独立标签;微信分享确保 og 齐全 + 首图合规;动态文章即公众号/LinkedIn 内容源(canonical 修复后可安全外发)。

## 9. 技术规格

- **框架**:Astro(静态输出 `output: 'static'`),TypeScript,Tailwind CSS(构建期);组件化 chrome(导航/页脚/CTA/场景卡只写一遍——终结 3 套导航变体的历史)。
- **i18n**:Astro 内置 i18n 路由(`defaultLocale: 'zh-cn'`, locales zh-cn/en);文案集中在 `src/i18n/` 与内容集合,**禁止**同页双语 span 机制。
- **内容**:Astro Content Collections;news/careers 沿用 `data/*.json` 为源(build 生成静态页 + 运行时 API 增强保留:`/api/public/news`、`/api/public/careers` 双层 fallback 逻辑迁入轻量客户端脚本,仅做"上新即时可见",SEO 不依赖)。**文章 HTML 渲染必须保留净化机制**(构建期 sanitize,白名单口径沿用旧 article.html:标签/属性/iframe 前缀)——运行时 API 增强渲染同样过净化;**保留 prev/next 文章导航**(按集合排序)。**双语数据对齐**:news.json/careers.json 及新建 facts.json/configurator.json 均须中英字段成对,纳入双语等价验收。
- **表单**:POST `/api/public/leads`、`/api/public/careers/apply` 同源相对路径不变。
- **构建与部署**:仓库根新增 Astro 工程;`npm run build` → `dist/`;**GitHub Actions 于 push main 时构建并 rsync dist/ 至服务器**(保持"git 单一可信源",生产不手改);deploy-website.sh 与 INFRA.md 同步更新为新流程;nginx 加 301 映射与 `/en/` 路由。旧站文件在切换 commit 中整体移除(git 历史即备份;备用 tag `pre-rebuild`)。
- **上线开关**:公安备案通过 → 先按现冻结批次填公安号上线(旧站小改),重建站在独立分支开发,验收后一次性切换。**切换前置动作**:①核实本次改版(新增机场·高铁礼宾板块、全站 IA/URL 重构)是否构成通信管理局定义的**备案信息实质性变更**,需要则先办变更备案再切换,不得默认"旧站已过审=新站自动沿用";②确认机场·高铁礼宾页口径仍落在既定 ICP 定性(软件/信息技术/商务服务)内,不引入新的前置许可类目;③判断过程留存记录(docs/)。

## 10. 非目标(本期不做)

在线支付/下单、用户注册、实时可用性查询、价格计算器、多于 5 城的城市页、司机端/后台任何改动、繁体中文独立路径(hreflang 先指向简中)。

## 11. 验收标准

1. 三层 IA 落地,主导航 6 项,任一信息 ≤3 次点击可达;audit `mustNotLose` 清单 100% 在新站有家(逐条核对)。
2. §1 红线扫描 0 命中(法务层否定句式除外);7 条法律表述逐字一致;**附录 A 之外,隐私政策的保留期限数字(行程/沟通 ≤2 年;发票对账 5–10 年)、版本号/更新日期、跨境传输 PIPL 单独同意条款同样逐字核对**。
3. §5 六项内容修正全部完成。
4. §6 三个签名交互 + 基础动效系统按规格实现,reduced-motion/无 JS/移动端三态可用;**方案顾问通过"5 秒第三方测试"**(§6.2);事实带内容 0 实时词/0 运力表述。
5. §8:hreflang 成对、JSON-LD 全覆盖、零海外运行时依赖、301 全量生效、移动 Lighthouse ≥90。
6. 双语内容等价(中英信息量一致,不混排),**含 news/careers/facts/configurator 四个 JSON 数据源的双语字段**。
7. footer:ICP 号 + 公安号(下号后)双语路径齐全,英文路径备案号中文原文展示。
8. **连续通读测试**:一名审读者从首页 hero 滚到 footer 一次读完,第一反应必须是"LyctRides 提供出行服务(居间/服务定性)"而非"LyctRides 运营车队(承运定性)";偏向后者则调整模块次序/边界句后复测。
9. **备案变更必要性判断已完成并留档**(§9 切换前置动作)。

---

## 附录 A · 法律定性原文(迁移时逐字核对)

**terms(5 条)**:
1. "现阶段,LyctRides 自身不从事道路旅客运输或网约车经营,不面向不特定公众提供即时叫车,不公开招募司机入驻,亦不在线向乘客收取按次车费;在未取得相应许可前,不开展需特定行政许可的相关业务。"
2. "车辆与驾驶由具备相应道路运输经营资质的合作供应商提供,相关资质归供应商所有。"
3. "LyctRides 作为居间协调方,不承担承运人责任。"
4. "服务以邀请制并经企业签约的方式向企业客户提供。本网站现阶段不提供面向公众的自助注册或下单。"
5. "现阶段以对公月结或线下结算为主,本网站不提供按次在线车费支付。"

**privacy(2 条)**:
6. "我们的服务以企业对企业(B2B)方式提供给企业客户。现阶段我们不面向不特定公众提供即时叫车服务,亦不会收集超出协调与履约一段已预约行程所必需范围的信息。"
7. "车辆与驾驶服务由具备相应经营资质的合作供应商提供,相关资质归供应商所有……我们仅向被指派的供应商共享该次行程所必需的最小信息。"

(实施时以 terms.html/privacy.html 现行全文为准整篇迁移,以上为关键句锚点。)
