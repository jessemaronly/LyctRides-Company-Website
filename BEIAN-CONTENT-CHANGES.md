# BEIAN-CONTENT-CHANGES · ICP 备案内容前置 · 恢复清单

> **基线 (baseline)**：tag `pre-beian-clean` = `d180546427c371aac979ff8ef303358205bff7ce`
> 清洗前原文永久可查：`git show pre-beian-clean:<文件>`
> 行号均以 **baseline** 为准（清洗后行号会因结构改动漂移，请用「原文」定位）。

## 恢复规则（下号后）

- 走「新的评审改动」，**按本清单逐条挑 🟡 恢复**——不要 `git revert` 一把全恢复（🔴 永久不能回来）。
- 单条恢复示例：在对应文件里把「备案合规替换」改回「原文」。
- 🔴 = **永久不恢复**（网约车 / 打车 / 即时叫车派单 / 司机入驻 / 不实自营车队）。
- 🟡 = **下号后可逐条恢复**（B 端高端口径：专车 / chauffeur / 专属司机 / 点到点 / 车队 措辞）。
- 🟢 = 保持干净（企业用车 / 商务出行 等替换词，无需恢复）。

## 计数

- 🔴 永久不恢复：**17** 处
- 🟡 可选择性恢复：**206** 处
- 结构改动（见末尾）：fleet.html 整页删除 + 全站 Fleet/车队 导航项移除 + 首页 fleet teaser 改写

---

## 🔴 永久不恢复（17 处）

| 文件:行 | 原文 (baseline) | 备案合规替换 | 说明 |
|---|---|---|---|
| `about.html:755` | Years on, our fleet has grown from a handful of Mercedes to a hospitality network across Greater China. | Years on, our partner network has grown from a focused beginning into a hospitality network across Greater China. | false self-owned fleet / car-count claim |
| `about.html:762` | 数年过去，我们的车队从最初的几辆奔驰，扩展为横跨大中华区的礼宾网络。 | 数年过去，我们的合作网络从最初的专注起步，扩展为横跨大中华区的礼宾出行网络。 | false self-owned fleet / car-count claim |
| `data/news.json:60` | innovation in fleet management across Greater China | innovation in service operations across Greater China | fleet management -> service operations |
| `data/news.json:67` | 高客户留存率及车队管理创新 | 高客户留存率及服务运营创新 | 车队管理 -> 服务运营 |
| `data/news.json:109` | the addition of the ZEEKR 009 to our premium fleet | the addition of the ZEEKR 009 to our premium service line-up | owned-fleet |
| `data/news.json:112` | All ZEEKR 009 vehicles in our fleet are maintained to the same EHL-certified standards as our Mercedes-Benz models | All ZEEKR 009 vehicles offered through our partner network meet the same EHL-certified standards as the Mercedes-Benz models we coordinate | owned-fleet maintenance claim |
| `data/news.json:116` | 将极氪009纳入旗下豪华车队 | 将极氪009纳入合作车型阵容 | owned-fleet |
| `data/news.json:119` | 车队中所有极氪009均按照与奔驰车型相同的EHL认证标准维护保养 | 我们协调调度的所有极氪009均按照与奔驰车型相同的EHL认证标准维护保养 | owned-fleet maintenance claim |
| `services.html:821` | Single point-to-point trips within the city — hotel to office, dinner to airport, anywhere you need to be next. Booked on demand, dispatched in minutes. | Single door-to-door trips within the city — hotel to office, dinner to airport, anywhere you need to be next. Booked in advance, arranged ahead. | on-demand / dispatched-in-minutes |
| `services.html:822` | 市内单程点到点出行——酒店、办公、晚宴、机场之间随叫随到。按需预订，分钟级派单。 | 市内单程预约用车——酒店、办公、晚宴、机场之间门到门接送。提前预约，统一安排。 | 随叫随到 / 分钟级派单 |
| `services/cityrides.html:7` | on-demand point-to-point chauffeur trips within the city. Flat zone rates, same chauffeur standard, dispatched in minutes. | pre-arranged door-to-door car trips within the city. Flat zone rates, the same service standard, arranged in advance. | on-demand / dispatched-in-minutes (meta) |
| `services/cityrides.html:795` | Why not ride-hailing | Beyond a booking app | ride-hailing wording |
| `services/cityrides.html:816` | <span class="lang-en">On-demand dispatch</span><span class="lang-cn">按需派单</span> | <span class="lang-en">Scheduled dispatch</span><span class="lang-cn">预约调度</span> | 按需派单 -> 预约调度 |
| `services/cityrides.html:818` | Single point-to-point trips booked in minutes. No subscription, no commitment &mdash; pay only for the ride you take. | Single door-to-door trips arranged in advance. No subscription, no commitment &mdash; pay only for the trip you book. | booked-in-minutes |
| `services/cityrides.html:819` | 分钟级派单的单程出行。无包月、无承诺，按次计费。 | 提前安排的单程用车。无包月、无承诺，按次计费。 | 分钟级派单 |
| `services/hourly.html:1009` | Single chauffeur, single fee, all stops covered &mdash; no Didi orchestration, no missed handoffs. | Single driver, single fee, all stops covered &mdash; no juggling multiple apps, no missed handoffs. | Didi / network-ride reference |
| `services/hourly.html:1012` | 不必反复打车 | 无需反复自行安排用车 | 打车 -> 自行安排用车 |

---

## 🟡 下号后可逐条恢复（206 处）

| 文件:行 | 原文 (baseline) | 备案合规替换 | 说明 |
|---|---|---|---|
| `about.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `about.html:7` | premium chauffeur service | premium corporate car service | meta/body |
| `about.html:14` | Premium chauffeur service | Premium corporate car service | meta/body |
| `about.html:713` | Premium chauffeur service | Premium corporate car service | meta/body |
| `about.html:877` | chauffeur | driver | chauffeur -> driver |
| `about.html:907` | chauffeurs | drivers | chauffeur -> driver |
| `about.html:923` | chauffeurs | drivers | chauffeur -> driver |
| `about.html:1040` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `article.html:7` | premium chauffeur service | premium corporate car service | meta/body |
| `article.html:13` | Premium chauffeur service | Premium corporate car service | meta/body |
| `article.html:216` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `careers.html:6` | LyctRides 光年专车招聘 | LyctRides 招聘 | drop 光年专车 descriptor |
| `careers.html:7` | premium chauffeur service | premium corporate car service | meta/body |
| `careers.html:7` | chauffeurs | drivers | chauffeur -> driver |
| `careers.html:8` | chauffeur | driver | chauffeur -> driver |
| `careers.html:8` | chauffeur | driver | chauffeur -> driver |
| `careers.html:17` | chauffeur and concierge service | car and concierge service | meta/body |
| `careers.html:674` | chauffeur | driver | chauffeur -> driver |
| `careers.html:717` | chauffeur | driver | chauffeur -> driver |
| `careers.html:768` | Chauffeur | Driver | chauffeur -> driver |
| `careers.html:797` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `contact.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `contact.html:7` | premium chauffeur and concierge services | premium corporate car and concierge services | meta |
| `contact.html:905` | chauffeur service | car service | generic service phrase |
| `contact.html:940` | How is an on-demand booking different from a long-term charter? | How is a single booking different from a long-term charter? | on-demand wording |
| `contact.html:941` | 「零单」和「长包车」 | 「单次预约」和「长包车」 | 零单 -> 单次预约 |
| `contact.html:947` | point-to-point | door-to-door | point-to-point -> door-to-door |
| `contact.html:947` | An on-demand booking is a one-off ride | A single booking is a one-off trip | on-demand wording |
| `contact.html:948` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `contact.html:948` | 点到点 | 门到门 | 点到点 -> 门到门 |
| `contact.html:948` | 零单是单次按需出行 | 单次用车即单次预约出行 | 零单/按需 wording |
| `contact.html:976` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `data/careers.json:4` | Chauffeur | Driver | chauffeur -> driver |
| `data/careers.json:14` | chauffeur | driver | chauffeur -> driver |
| `data/careers.json:14` | chauffeur | driver | chauffeur -> driver |
| `data/careers.json:46` | chauffeur | driver | chauffeur -> driver |
| `data/news.json:6` | chauffeur | driver | chauffeur -> driver |
| `data/news.json:10` | chauffeurs | drivers | chauffeur -> driver |
| `data/news.json:12` | chauffeur | driver | chauffeur -> driver |
| `data/news.json:37` | chauffeurs | drivers | chauffeur -> driver |
| `data/news.json:55` | LyctRides Named Best Luxury Chauffeur Service — China Business Travel Awards 2024 | LyctRides Named Best Luxury Corporate Car Service — China Business Travel Awards 2024 | award name |
| `data/news.json:55` | 光年荣获2024中国商务出行最佳豪华专车服务奖 | 光年荣获2024中国商务出行最佳豪华商务用车服务奖 | award name |
| `data/news.json:59` | named Best Luxury Chauffeur Service at the China Business Travel Awards 2024 | named Best Luxury Corporate Car Service at the China Business Travel Awards 2024 | award name |
| `data/news.json:61` | chauffeur | driver | chauffeur -> driver |
| `data/news.json:66` | 「最佳豪华专车服务」称号 | 「最佳豪华商务用车服务」称号 | award name |
| `data/news.json:104` | { "en": "Fleet", "cn": "车队资讯" } | { "en": "Vehicles", "cn": "车型资讯" } | news category Fleet -> Vehicles |
| `enterprise.html:6` | LyctRides 光年专车 企业门户 | LyctRides 企业门户 | drop 光年专车 descriptor |
| `enterprise.html:6` | Corporate Chauffeur & Bilingual Driver Service | Corporate Car Service & Bilingual Driver | service name |
| `enterprise.html:7` | Corporate chauffeur and bilingual / English-speaking driver service | Corporate car service with bilingual / English-speaking drivers | service name |
| `enterprise.html:8` | corporate chauffeur China | corporate car service China | keyword |
| `enterprise.html:8` | chauffeur | driver | chauffeur -> driver |
| `enterprise.html:8` | chauffeur | driver | chauffeur -> driver |
| `enterprise.html:8` | 公司专车 | 公司用车 | 专车 -> 用车 (keyword) |
| `enterprise.html:8` | 公司专车 | 公司用车 | 专车 -> 用车 (keyword) |
| `enterprise.html:14` | Corporate Chauffeur · Bilingual Driver | Corporate Car Service · Bilingual Driver | service name |
| `enterprise.html:15` | Corporate chauffeur with English-speaking drivers | Corporate car service with English-speaking drivers | service name |
| `enterprise.html:951` | Real-time fleet tracking | Real-time trip tracking | fleet -> trip |
| `enterprise.html:951` | 实时车队追踪 | 实时行程追踪 | 车队追踪 -> 行程追踪 |
| `enterprise.html:1045` | chauffeur | driver | chauffeur -> driver |
| `enterprise.html:1105` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `index.html:6` | LyctRides · 光年出行 · Bilingual Premium Chauffeur | LyctRides · Bilingual Premium Corporate Car Service | drop CN descriptor (title/og) |
| `index.html:7` | Premium chauffeur and cross-border transfer service | Premium corporate car and cross-border transfer service | meta |
| `index.html:8` | 光年专车, |  | drop 光年专车 keyword |
| `index.html:8` | premium chauffeur China | premium car service China | keyword |
| `index.html:8` | corporate chauffeur China | corporate car service China | keyword |
| `index.html:8` | expat chauffeur China | expat driver China | keyword |
| `index.html:8` | Hong Kong cross-border chauffeur | Hong Kong cross-border driver | keyword |
| `index.html:8` | inbound China chauffeur | inbound China driver | keyword |
| `index.html:8` | chauffeur | driver | chauffeur -> driver |
| `index.html:18` | LyctRides · 光年出行 · Bilingual Premium Chauffeur | LyctRides · Bilingual Premium Corporate Car Service | drop CN descriptor (title/og) |
| `index.html:19` | Premium chauffeur across Greater China | Premium corporate car service across Greater China | meta |
| `index.html:30` | 光年专车 | 光年出行 | stray 光年专车 guard -> 光年出行 |
| `index.html:33` | Premium chauffeur and cross-border transfer service | Premium corporate car and cross-border transfer service | meta |
| `index.html:34` | LyctRides (光年专车) is a Guangzhou-based premium bilingual chauffeur | LyctRides is a Guangzhou-based premium bilingual corporate car service | JSON-LD descriptor + chauffeur |
| `index.html:86` | Premium Chauffeur Service | Premium Corporate Car Service | service name (JSON-LD) |
| `index.html:88` | Cross-Border Chauffeur | Cross-Border Car Service | service name |
| `index.html:91` | Inbound China Tourist Chauffeur | Inbound China Tourist Car Service | service name (JSON-LD) |
| `index.html:657` | chauffeur | driver | chauffeur -> driver |
| `index.html:677` | Executive chauffeur and concierge service across Greater China | Executive car and concierge service across Greater China | hero/meta |
| `index.html:678` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `index.html:762` | Your chauffeur, your route, your hours. | Your driver, your route, your hours. | body copy |
| `index.html:763` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `index.html:777` | point-to-point | door-to-door | point-to-point -> door-to-door |
| `index.html:778` | 点到点 | 门到门 | 点到点 -> 门到门 |
| `index.html:1048` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `lyctai.html:6` | — LyctRides 光年专车 | — LyctRides | drop 光年专车 descriptor |
| `lyctai.html:916` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `news.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `news.html:7` | premium chauffeur service | premium corporate car service | meta/body |
| `news.html:8` | chauffeur service | car service | generic service phrase |
| `news.html:8` | chauffeur | driver | chauffeur -> driver |
| `news.html:17` | executive chauffeur service | executive corporate car service | meta/body |
| `news.html:644` | 车队资讯 | 车型资讯 | 车队资讯 -> 车型资讯 |
| `news.html:666` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services.html:7` | chauffeur | driver | chauffeur -> driver |
| `services.html:14` | Premium chauffeur and concierge services | Premium corporate car and concierge services | meta |
| `services.html:778` | chauffeur | driver | chauffeur -> driver |
| `services.html:798` | Your chauffeur, your route, your hours. | Your driver, your route, your hours. | body copy |
| `services.html:799` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services.html:865` | Fleet allocation | Vehicle allocation | fleet -> vehicle |
| `services.html:865` | chauffeur | driver | chauffeur -> driver |
| `services.html:923` | chauffeur | driver | chauffeur -> driver |
| `services.html:924` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services.html:1001` | VIP 车队护送 | VIP 车辆护送 | 车队护送 -> 车辆护送 |
| `services.html:1049` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/airport.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/airport.html:6` | Bilingual Chauffeur | Bilingual Driver | service name |
| `services/airport.html:7` | chauffeurs | drivers | chauffeur -> driver |
| `services/airport.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:14` | Bilingual Chauffeur | Bilingual Driver | service name |
| `services/airport.html:15` | chauffeurs | drivers | chauffeur -> driver |
| `services/airport.html:821` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:845` | Chauffeur | Driver | chauffeur -> driver |
| `services/airport.html:910` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:992` | chauffeurs | drivers | chauffeur -> driver |
| `services/airport.html:1013` | chauffeur | driver | chauffeur -> driver |
| `services/airport.html:1139` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/cityrides.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/cityrides.html:14` | Premium chauffeur and concierge services | Premium corporate car and concierge services | meta |
| `services/cityrides.html:788` | 点到点 | 门到门 | 点到点 -> 门到门 |
| `services/cityrides.html:826` | chauffeur | driver | chauffeur -> driver |
| `services/cityrides.html:828` | chauffeurs | drivers | chauffeur -> driver |
| `services/cityrides.html:948` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/citytocity.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/citytocity.html:6` | Cross-Border Chauffeur | Cross-Border Car Service | service name |
| `services/citytocity.html:7` | Cross-border chauffeur | Cross-border car service | service name |
| `services/citytocity.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:14` | Cross-Border Chauffeur | Cross-Border Car Service | service name |
| `services/citytocity.html:15` | Cross-border chauffeur | Cross-border car service | service name |
| `services/citytocity.html:795` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:804` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:831` | Chauffeur | Driver | chauffeur -> driver |
| `services/citytocity.html:872` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:924` | chauffeur service | car service | generic service phrase |
| `services/citytocity.html:963` | chauffeur | driver | chauffeur -> driver |
| `services/citytocity.html:1089` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/events.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/events.html:7` | Fleet allocation | Vehicle allocation | fleet -> vehicle |
| `services/events.html:7` | chauffeur | driver | chauffeur -> driver |
| `services/events.html:14` | Premium chauffeur and concierge services | Premium corporate car and concierge services | meta |
| `services/events.html:883` | we propose a fleet plan and on-site team | we propose a vehicle plan and on-site team | fleet plan -> vehicle plan |
| `services/events.html:884` | 我们提供车队方案与驻场团队建议 | 我们提供用车方案与驻场团队建议 | 车队方案 -> 用车方案 |
| `services/events.html:994` | chauffeurs | drivers | chauffeur -> driver |
| `services/events.html:1120` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/hourly.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/hourly.html:6` | Hourly Chauffeur for China Inbound Travel | Hourly Car Service for China Inbound Travel | service name |
| `services/hourly.html:7` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:8` | China inbound chauffeur | China inbound driver | keyword |
| `services/hourly.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:14` | Hourly Chauffeur for Inbound China Travel | Hourly Car Service for Inbound China Travel | service name |
| `services/hourly.html:15` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:769` | Your chauffeur, your route, your hours. | Your driver, your route, your hours. | body copy |
| `services/hourly.html:793` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:818` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:821` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:842` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:842` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services/hourly.html:845` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:869` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:910` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:920` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:970` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:979` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:1082` | chauffeur | driver | chauffeur -> driver |
| `services/hourly.html:1170` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/longterm.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/longterm.html:7` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:8` | expat chauffeur China | expat driver China | keyword |
| `services/longterm.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:8` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:14` | Annual Dedicated Chauffeur in China | Annual Dedicated Driver in China | service name |
| `services/longterm.html:15` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:791` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:791` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services/longterm.html:793` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:794` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services/longterm.html:802` | 不进入车队调度池 | 不参与共享调度 | 车队调度池 -> 共享调度 |
| `services/longterm.html:823` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:824` | 专属司机 | 固定司机 | 专属司机 -> 固定司机 |
| `services/longterm.html:884` | chauffeur | driver | chauffeur -> driver |
| `services/longterm.html:973` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |
| `services/privatejet.html:6` | LyctRides 光年专车 | LyctRides | drop 光年专车 descriptor (titles) |
| `services/privatejet.html:14` | Premium chauffeur and concierge services | Premium corporate car and concierge services | meta |
| `services/privatejet.html:768` | chauffeur | driver | chauffeur -> driver |
| `services/privatejet.html:769` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `services/privatejet.html:895` | chauffeur | driver | chauffeur -> driver |
| `services/privatejet.html:896` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `services/privatejet.html:959` | chauffeur | driver | chauffeur -> driver |
| `services/privatejet.html:960` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `services/privatejet.html:977` | chauffeur | driver | chauffeur -> driver |
| `services/privatejet.html:978` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `services/privatejet.html:998` | chauffeur | driver | chauffeur -> driver |
| `services/privatejet.html:1001` | 专车 | 商务用车 | 专车 -> 商务用车 |
| `services/privatejet.html:1124` | Executive chauffeur service across Greater China. Available 24/7. | Corporate ground transportation across Greater China. Available 24/7. | footer tagline |

---

## 结构改动（reversible via baseline）

| 项 | 改动 | 桶 | 恢复方式 |
|---|---|---|---|
| `fleet.html` | **整页删除**（整页含 chauffeur standards / "our fleet" / EHL 卓越车队 等自营暗示） | 🟡 | `git checkout pre-beian-clean -- fleet.html`，再按需逐条洗其中 🔴 项后恢复 |
| 全站导航 | 17 页移除 `Fleet/车队` 导航项（桌面 pill + 移动菜单 + 页脚链接，每页 3 处） | 🟡 | 从 baseline 取回对应 `<a>` 片段 |
| `index.html` fleet teaser | `The Fleet/车队概览`→`Vehicle Classes/车型概览`；`卓越车队，精心保养`→`多元车型，按需匹配`；`View All Vehicles`/4 tiles 链接 `/fleet.html`→`/services.html` | 🟡 | 见 `git show pre-beian-clean:index.html` 第 930–1009 行 |
| `sitemap.xml` | 移除 `/fleet.html` 的 `<url>` 条目 | 🟡 | 恢复 fleet.html 后补回 |

## 🟢 保持干净（无需恢复）

企业用车 / 商务出行 / 企业差旅 / 预约用车 / 门到门 / 合作供应商履约 / corporate car service / professional driver 等 —— 这些是合规替换词，长期保留。

## 新增内容（永久保留，与恢复无关）

- `privacy.html` 隐私政策（B2B · PIPL 最小必要）
- `terms.html` 用户协议（B2B · 供应商履约定位）
- `holding.html` 备案窗口期落地页
- 全站页脚 ICP 备案占位组件（`<!-- BEIAN:start -->` … `<!-- BEIAN:end -->`，含 `粤ICP备XXXXXXXX号` + 公安备案号注释占位）

> ⚠️ **隐私政策 / 用户协议正式生效前，建议经执业律师 / 法务终审。** 注册地址、ICP 号、公安备案号均为占位，下号 / 确认后替换。

---

## 复核修正 · round 2（Codex review 后）

复核发现一审验证有两处盲区：(a) 只搜了 `our/own fleet` 没搜裸词 `fleet`；(b) `车队` grep 漏了字间距写法 `车 队`（如 `V I P 接 待 车 队`）。补修如下：

| 文件:行(当前) | 改动 | 桶 |
|---|---|---|
| `data/news.json` | summary `Our newest fleet addition` → `The newest addition to our service line-up`（自有车队暗示） | 🔴 |
| `news.html` | 筛选钮 `data-cat="Fleet"`+标签 `Fleet` → `Vehicles`（**并修复因 news.json 分类已改 Vehicles 导致的筛选失效**） | 🟡 |
| `services/citytocity.html` `services/hourly.html` `services/airport.html` | `§ 04 · Fleet` 段标 → `Vehicles` | 🟡 |
| `services/events.html` | `VIP guest fleet / VIP 接 待 车 队` → `VIP guest vehicles / VIP 接 待 车 辆`；`车 队 调 度` → `多 车 调 度` | 🟡 |
| `index.html` | 注释 `<!-- Fleet Teaser -->` → `Vehicle Classes Teaser`（仅 grep 噪音） | — |

**故意保留**：`data/news.json` 的 `"id": "zeekr-fleet-addition-2024"` 是文章 URL 的内部 slug（`article.html?id=…`），改它会断已有链接，按内部 key 例外保留（同 `senior-chauffeur-shanghai`）。

## 复核修正 · 非红线一致性（与备案口径对齐）

- **主体英文名**：privacy/terms/holding 的 `lang-en` 原误用我臆造的 `Lightyear (Guangzhou) Automobile Services Co., Ltd.` 且把中文名塞进了英文 span（混排）。已统一为官方英文名 **`LyctRides Car Service Co., Ltd.`**（`lang-en`）/ `光年（广州）汽车服务有限责任公司`（`lang-cn`）。
- **公开联系邮箱**：新法律/备案页 `billing@` → **`bd@lyctai.com`**（与全站现有 18 页一致）。
- **付款口径**：`contact.html` 去掉「微信支付/支付宝/国际信用卡」按次收款表述 → 仅「对公转账 + 集中月结开票 + Net-30/60；本站不提供按次在线车费支付」，与 terms.html 第 4 条一致。
- **招聘 SEO**：`careers.html` meta keywords 去掉「driver jobs / premium driver hiring」公开招募口径 → 运营岗口径。

## 备案号下号后如何统一替换（footer 全站多处）

页脚 BEIAN 块是逐页静态片段（利于备案展示 + 无 JS 也能显示），不是单点。下号后全站统一替换用：

```bash
# ICP 号（把 X 换成正式号）
grep -rl '粤ICP备XXXXXXXX号' --include='*.html' . | xargs sed -i '' 's/粤ICP备XXXXXXXX号/粤ICP备12345678号/g'
# 公安联网备案号：每页 footer 的 BEIAN 块里有注释好的占位，取消注释并把 XXXXXXXX 换成正式号
```
（macOS sed 用 `-i ''`；Linux 用 `-i`。如要改成共享组件，可后续抽 `beian-footer.js` 注入，但静态片段对备案审核更稳。）
