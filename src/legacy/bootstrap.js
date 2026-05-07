const API_BASE = window.ClashCubeRuntime?.config?.apiBase
  || (window.location.protocol === "file:" ? "http://192.168.5.190:8000" : "/api");

/** 为 true 时不拉取 healthz/nodes/workflows，仅用页面内模拟数据；地址栏加 ?controller=1 可连接真实控制器 */
const USE_LOCAL_DEMO_DATA_ONLY = (() => {
  try {
    if (new URLSearchParams(window.location.search).get("controller") === "1") return false;
  } catch (_) {}
  return window.ClashCubeRuntime?.config?.useLocalDemoData ?? true;
})();

const industries = [
  ["media", "短视频"],
  ["legal", "律师"],
  ["finance", "财会"],
  ["ecommerce", "电商运营"],
  ["hr", "人力招聘"],
  ["consulting", "企业咨询"],
  ["marketing", "品牌营销"],
  ["trade", "跨境外贸"],
  ["healthcare", "医疗健康"],
  ["education", "教育培训"],
  ["property", "地产物业"],
  ["manufacturing", "制造工厂"],
  ["catering", "餐饮本地生活"],
  ["insurance", "保险理赔"],
  ["auto", "汽车服务"],
  ["facility", "物业管理"],
  ["renovation", "家装工程"],
  ["logistics", "物流仓储"],
  ["travel", "旅游酒旅"],
  ["beauty", "美容医美"],
  ["ip", "知识产权"],
  ["bidding", "政企投标"],
  ["community", "社区团购"],
  ["quant", "量化交易"],
];

const EXECUTION_STYLE_LABELS = {
  balanced: "标准模式",
  creative: "创意模式",
  strict: "深度模式",
  fast: "快速模式",
};

const DISCUSSION_ROLE_EXAMPLES = [
  "法务负责人",
  "财务分析师",
  "运营主管",
  "产品经理",
  "销售总监",
  "风控专员",
  "招聘经理",
  "品牌策划",
];

function executionStyleLabel(key) {
  return EXECUTION_STYLE_LABELS[key] || key || "";
}

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: "¥0",
    quota: 30,
    used: 9,
    description: "每日赠送基础 Token，并开放个别行业。",
    industries: ["media", "legal"],
    features: ["每日 30 Token", "开放 2 个行业", "平台推荐模板"],
  },
  {
    id: "basic",
    name: "Basic",
    price: "¥99/月",
    quota: 500,
    used: 120,
    description: "固定赠送 Token，开放多个高频业务行业。",
    industries: ["media", "legal", "finance", "ecommerce", "marketing", "hr"],
    features: ["每月 500 Token", "开放 6 个行业", "保存我的模板"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "¥299/月",
    quota: 2000,
    used: 640,
    description: "固定赠送高 Token，并开放全部行业。",
    industries: industries.map(([value]) => value),
    features: ["每月 2000 Token", "开放所有行业", "多节点讨论"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "联系定制",
    quota: 9999,
    used: 1280,
    description: "面向企业私有部署、高级节点和专属流程定制。",
    industries: industries.map(([value]) => value),
    features: ["高级定制", "专属节点配置", "企业级支持"],
  },
];

const industryProfiles = {
  media: {
    title: "短视频内容生产",
    skills: [
      { skill: "创意 brief", description: "把业务目标整理成可执行的创作约束、受众设定与交付口径。" },
      { skill: "分镜拆解", description: "将脚本拆成镜头序列与节奏点，便于逐镜生成与对齐复核。" },
      { skill: "图片/视频提示词", description: "产出适配模型与风格锚点的图文提示词、负面词与版本迭代记录。" },
      { skill: "连续性复核", description: "检查人设、场景、服装口播与时间线的前后一致性，标记穿帮与跳剪。" },
      { skill: "成片修改清单", description: "汇总需返工的镜头、优先级与参考片段，支撑快速迭代审片。" },
    ],
    stages: ["选题策划", "分镜包装", "素材生成", "创意复核", "成片交付"],
    deliverables: ["创意 brief", "镜头表", "提示词", "分片资产", "修改清单"],
  },
  legal: {
    title: "法律合同审查",
    skills: [
      { skill: "条款抽取", description: "结构化抽取定义、标的、付款、违约与争议解决等关键条款要素。" },
      { skill: "风险分级", description: "按合规与履约影响标注风险等级、处置时限与升级路径。" },
      { skill: "义务识别", description: "厘清各方权利义务链路、触发条件与连带保证关系。" },
      { skill: "修改建议", description: "给出可落地的改写句式、谈判筹码与替代条款表述。" },
      { skill: "律师复核提示", description: "列出须执业律师确认的疑点、证据缺口与访谈清单。" },
    ],
    stages: ["材料读取", "条款结构化", "风险审查", "修改建议", "复核交付"],
    deliverables: ["合同摘要", "风险清单", "修改建议表", "待确认问题"],
  },
  finance: {
    title: "财会经营分析",
    skills: [
      { skill: "报表读取", description: "对齐口径读取资产负债表、利润表与现金流量表要点与附注提示。" },
      { skill: "收入成本分析", description: "拆分收入结构、毛利变动与成本驱动因素，标注异常区间。" },
      { skill: "现金流检查", description: "识别经营性与筹资性现金拐点，评估资金周转安全边际。" },
      { skill: "异常波动识别", description: "对标往期与同业，标注超常科目并给出可能成因假设。" },
      { skill: "经营建议", description: "输出可改善利润率与现金回报的优先级动作与跟踪指标。" },
    ],
    stages: ["数据接入", "科目映射", "指标计算", "风险解释", "报告输出"],
    deliverables: ["财务摘要", "异常清单", "现金流分析", "经营建议"],
  },
  ecommerce: {
    title: "电商运营增长",
    skills: [
      { skill: "商品卖点", description: "提炼主打卖点、差异点与一句话购买理由，对齐人群场景。" },
      { skill: "标题优化", description: "在平台搜索与合规规则下优化关键词、转化词与敏感表述。" },
      { skill: "详情页结构", description: "规划卖点层级、信任背书、参数与 FAQ 的信息架构与首屏策略。" },
      { skill: "活动节奏", description: "设定上新、预热、爆发与返场的节点节奏与资源配比建议。" },
      { skill: "客服话术", description: "覆盖售前咨询、异议处理与售后关怀的标准话术与升级边界。" },
    ],
    stages: ["商品诊断", "卖点包装", "内容生成", "活动执行", "数据复盘"],
    deliverables: ["商品卖点卡", "详情页文案", "活动方案", "素材清单"],
  },
  marketing: {
    title: "品牌营销战役",
    skills: [
      { skill: "受众洞察", description: "刻画人群画像、动机触点与内容偏好假设，形成洞察摘要。" },
      { skill: "传播主题", description: "提炼战役主线叙述与可延展的选题矩阵、tone & manner。" },
      { skill: "渠道策略", description: "匹配媒介组合、预算拆分与投放节拍，注明考核指标。" },
      { skill: "素材矩阵", description: "规划短视频、海报与文案等多形态产出清单与规格约束。" },
      { skill: "复盘归因", description: "把曝光、互动与转化链路归因到创意、定向与落地页因子。" },
    ],
    stages: ["目标设定", "洞察定位", "内容策划", "投放执行", "效果复盘"],
    deliverables: ["战役 brief", "内容日历", "素材脚本", "投放计划"],
  },
  quant: {
    title: "量化研究模拟",
    skills: [
      { skill: "行情标准化", description: "清洗对齐行情与基本面数据，处理复权、停牌与缺失值填补策略。" },
      { skill: "策略假设", description: "明确因子逻辑、持仓约束、适用市场 regime 与失效条件。" },
      { skill: "历史回测", description: "在统一成本、滑点与成交量假设下评估收益风险与稳健性。" },
      { skill: "信号生成", description: "把研究假设落成可执行的下单、调仓或预警信号规则。" },
      { skill: "Paper Only 风控", description: "仅在模拟环境校验阈值与熔断规则，严禁未经审批的实盘指令。" },
    ],
    stages: ["行情接入", "策略创建", "本地回测", "风控准入", "模拟观察"],
    deliverables: ["数据质量报告", "策略参数", "回测指标", "风控结论"],
  },
  default: {
    title: "行业协同工作流",
    skills: [
      { skill: "目标拆解", description: "把业务目标拆成可量化节点、验收口径与时间边界。" },
      { skill: "节点分派", description: "按角色与依赖拆分任务，明确交接物、SLA 与阻塞上报机制。" },
      { skill: "资料整理", description: "收集、归类与标注支撑决策的关键资料与引用来源。" },
      { skill: "结果复核", description: "对照清单检查输出完整性、一致性与可追溯性。" },
      { skill: "项目沉淀", description: "归档模版、参数与复盘结论，形成可复用的组织资产。" },
    ],
    stages: ["目标澄清", "任务分解", "节点执行", "质量复核", "交付归档"],
    deliverables: ["任务单", "执行结果", "风险清单", "项目摘要"],
  },
};

const sampleNodes = [
  {
    node_id: "oc-node-005",
    node_name: "planner-01",
    role: "planner",
    studio_role: "总策划",
    http_endpoint: "http://192.168.5.100:8105",
    ai_model: "gpt-5",
    seconds_since_heartbeat: 12,
    status: "online",
    labels: ["planning", "brief", "script"],
    runtime_seconds: 18650,
  },
  {
    node_id: "oc-node-002",
    node_name: "producer-01",
    role: "producer",
    studio_role: "内容执行",
    http_endpoint: "http://192.168.5.167:8102",
    ai_model: "gpt-image / video",
    seconds_since_heartbeat: 8,
    status: "online",
    labels: ["image-gen", "video-gen", "shot-build"],
    runtime_seconds: 10320,
  },
  {
    node_id: "oc-node-003",
    node_name: "reviewer-01",
    role: "reviewer",
    studio_role: "复核质检",
    http_endpoint: "http://192.168.5.172:8103",
    ai_model: "gpt-5",
    seconds_since_heartbeat: 25,
    status: "online",
    labels: ["review", "qc", "continuity"],
    runtime_seconds: 24210,
  },
];

const sampleKnowledgeItems = [
  {
    id: "kb-001",
    title: "短视频投放标准执行流知识包",
    category: "workflow",
    industry: "短视频",
    source: "平台沉淀",
    updatedAt: "2026-05-06 10:20",
    tags: ["投放", "脚本", "复核"],
    summary: "沉淀短视频从目标确认、脚本分镜、素材生成、复核闭环到投放建议的标准执行口径。",
    content: "适用于新品冷启动、活动预热和日常种草投放。执行时优先确认目标人群、核心 KPI、合规边界和交付规格；产出必须包含脚本版本、镜头表、封面文案、复核清单和 A/B 投放建议。",
  },
  {
    id: "kb-002",
    title: "合同风险条款复核规范",
    category: "policy",
    industry: "律师",
    source: "法务复盘",
    updatedAt: "2026-05-05 18:40",
    tags: ["合同", "风险", "红线"],
    summary: "定义合同审查中高风险、中风险、低风险条款的判定口径与交付格式。",
    content: "高风险优先覆盖违约责任不封顶、验收标准缺失、付款触发条件不清、争议管辖不明确等条款。输出时必须带原文证据、建议改写、责任主体、影响等级和律师确认问题清单。",
  },
  {
    id: "kb-003",
    title: "经营分析现金流预警案例",
    category: "case",
    industry: "财会",
    source: "项目执行记录",
    updatedAt: "2026-05-05 19:40",
    tags: ["现金流", "经营分析", "预警"],
    summary: "记录 Q2 经营分析中识别现金流压力、拆解归因并形成管理动作的案例。",
    content: "现金流紧张并不必然代表销售规模下滑。该案例将回款延迟、广告费用前置、库存采购节奏错配作为三条证据链，形成客户分层催收、投放预算周度释放、库存阈值下调三项动作。",
  },
  {
    id: "kb-004",
    title: "多节点讨论提示词模板",
    category: "prompt",
    industry: "通用",
    source: "协同区",
    updatedAt: "2026-05-04 14:12",
    tags: ["讨论", "提示词", "节点协同"],
    summary: "用于让不同节点按角色输出观点，并由复核节点归并共识、分歧和风险。",
    content: "推荐结构：先说明讨论目标，再列出参与角色、讨论轮次、必须达成的结论、不可越界内容。每轮输出应包含角色观点、证据依据、待确认问题和下一轮追问方向。",
  },
];

// 项目模块已下线：不再维护 sampleProjects / localProjects 相关数据

const state = {
  connected: false,
  activeModule: "overview",
  activeWorkflowRunId: "",
  openWorkflowRunMenuId: "",
  activePlan: "pro",
  industry: "all",
  nodes: sampleNodes.map(normalizeNode),
  workflows: [],
  workflowRuns: [], // 新增：工作流执行记录（对话 / 讨论 / 工作流）
  knowledgeItems: sampleKnowledgeItems.map((item) => ({ ...item })),
  knowledgeIndustryFilter: "all",
  activeKnowledgeId: "kb-001",
  localTemplates: [],
  results: [],
  templateFilter: "all",
  templateDisplayCount: 30,
  templatePaginationKey: "",
  hiddenMineTemplateIds: [],
  workflowDockIndustry: "",
  createWorkflowDraft: {
    editingTemplateId: "",
    steps: [],
    iconDataUrl: "",
  },
  pendingAction: null,
  /** 模板详情弹窗中当前展示的步骤（用于步骤附件下载） */
  templateDetailSteps: [],
  skillToggles: {},
};

const MAX_STEP_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const STEP_ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.txt,.csv,.json,.md,.png,.jpg,.jpeg,.webp,.gif";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function skillIconFingerprint(industryKey, skill, index) {
  const str = `${industryKey}\0${skill}\0${index}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const SKILL_ICON_GLYPHS = [
  `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon fill="currentColor" points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 22a10 10 0 100-20 10 10 0 000 20zm0-4a6 6 0 100-12 6 6 0 000 12z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 18h4V8H4v10zm6 0h4V4h-4v14zm6 0h4v-8h-4v8z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.2 7.5H22l-6 4.6 2.3 7L12 17l-6.3 5 2.3-7-6-4.6h7.8L12 2z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 10h18v2H3v-2zm2 4h14v2H5v-2zm2 4h10v2H7v-2z"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
];

function renderSkillIconMarkup(industryKey, skill, index) {
  const fp = skillIconFingerprint(industryKey, skill, index);
  const tone = fp % 12;
  const glyph = SKILL_ICON_GLYPHS[fp % SKILL_ICON_GLYPHS.length];
  return `<span class="skill-toggle-icon skill-icon-tone-${tone}" aria-hidden="true">${glyph}</span>`;
}

function industryName(key = state.industry) {
  if (key === "all") return "全部行业";
  return industries.find(([value]) => value === key)?.[1] || key;
}

/** 行业标签色：与 styles.css 一致；主强调为亮绿色 `--palette-cyan-bright`（#00FF84） */
const templateIndustryTagPalette = {
  media: { bg: "rgba(0, 255, 132, 0.13)", border: "rgba(0, 255, 132, 0.46)", text: "#ecfeff" },
  legal: { bg: "rgba(148, 163, 184, 0.14)", border: "rgba(148, 163, 184, 0.38)", text: "#e2e8f0" },
  finance: { bg: "rgba(0, 255, 132, 0.12)", border: "rgba(0, 255, 132, 0.38)", text: "#c8f6d9" },
  ecommerce: { bg: "rgba(100, 116, 139, 0.18)", border: "rgba(100, 116, 139, 0.38)", text: "#cbd5e1" },
  marketing: { bg: "rgba(200, 246, 217, 0.11)", border: "rgba(0, 255, 132, 0.42)", text: "#c8f6d9" },
  hr: { bg: "rgba(0, 255, 132, 0.10)", border: "rgba(34, 214, 111, 0.38)", text: "#c8f6d9" },
  trade: { bg: "rgba(15, 122, 67, 0.12)", border: "rgba(34, 214, 111, 0.38)", text: "#c8f6d9" },
  education: { bg: "rgba(71, 85, 105, 0.22)", border: "rgba(148, 163, 184, 0.40)", text: "#f1f5f9" },
  healthcare: { bg: "rgba(15, 122, 67, 0.14)", border: "rgba(0, 255, 132, 0.36)", text: "#c8f6d9" },
  manufacturing: { bg: "rgba(51, 65, 85, 0.24)", border: "rgba(148, 163, 184, 0.36)", text: "#e2e8f0" },
  property: { bg: "rgba(15, 122, 67, 0.12)", border: "rgba(0, 255, 132, 0.38)", text: "#e7ffef" },
  quant: { bg: "rgba(15, 122, 67, 0.18)", border: "rgba(0, 255, 132, 0.42)", text: "#c8f6d9" },
  mine: { bg: "rgba(0, 255, 132, 0.15)", border: "rgba(200, 246, 217, 0.46)", text: "#ecfeff" },
  default: { bg: "rgba(148, 163, 184, 0.12)", border: "rgba(148, 163, 184, 0.32)", text: "#e2e8f0" },
};

function templateIndustryLabel(template) {
  return industryName(template.industry || "all");
}

function templateIndustryTagStyle(template) {
  const paletteKey = template.industry || "default";
  const palette = templateIndustryTagPalette[paletteKey] || templateIndustryTagPalette.default;
  return `--tag-bg:${palette.bg};--tag-border:${palette.border};--tag-text:${palette.text};`;
}

function templateUsageCount(template) {
  const seed = String(template?.id || template?.title || "template");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return 10000 + (hash % 90000);
}

function buildTemplateSteps(template) {
  if (Array.isArray(template.steps) && template.steps.length) {
    return template.steps.map((step, index) => {
      if (typeof step === "object" && step) {
        const name = typeof step.attachmentName === "string" ? step.attachmentName : "";
        const dataUrl = typeof step.attachmentDataUrl === "string" ? step.attachmentDataUrl : "";
        return {
          title: step.title || `步骤 ${index + 1}`,
          description: step.description || step.detail || "按模板执行当前步骤。",
          attachmentName: name,
          attachmentDataUrl: name && dataUrl ? dataUrl : "",
        };
      }
      return { title: `步骤 ${index + 1}`, description: String(step), attachmentName: "", attachmentDataUrl: "" };
    });
  }
  const profile = profileForIndustry(template.industry || "all");
  const label = industryName(template.industry || "all");
  const titleText = String(template.title || "");
  const profileStages = Array.isArray(profile.stages) && profile.stages.length
    ? profile.stages.slice(0, 5)
    : ["目标澄清", "任务拆解", "执行产出", "复核优化", "交付沉淀"];

  const stepMap = [
    {
      match: /(标准执行流|标准流|标准执行)/,
      steps: [
        ["目标定义", `明确本次${label}任务目标、交付边界与验收标准。`],
        ["方案规划", `结合${label}业务上下文拆解执行路径与阶段产出。`],
        ["核心执行", `按优先级推进关键动作并同步中间结果。`],
        ["质量复核", "检查结果完整性、一致性和可直接使用程度。"],
        ["交付归档", "输出最终版本并沉淀可复用模板与注意事项。"],
      ],
    },
    {
      match: /(增长优化流|效率流|优化流)/,
      steps: [
        ["现状诊断", `定位${label}当前链路中的效率瓶颈与损耗点。`],
        ["关键指标设定", "确定核心指标与提升目标，明确优先优化项。"],
        ["策略实验", "设计并执行优化动作，记录关键过程数据。"],
        ["效果评估", "对比优化前后变化，识别高收益策略。"],
        ["方案固化", "沉淀稳定可复用的增长/效率优化方法。"],
      ],
    },
    {
      match: /(风险复核流|复核流|风险)/,
      steps: [
        ["风险清单构建", `从${label}流程中抽取关键风险点并分级。`],
        ["证据核验", "逐条核查输入依据与执行过程是否充分。"],
        ["问题修正", "给出可执行修正动作与责任归属建议。"],
        ["复审确认", "复盘修正结果，确认高风险项已闭环。"],
        ["审查结论", "形成审查报告与后续跟进计划。"],
      ],
    },
    {
      match: /(极速交付流|快速|极速|执行流)/,
      steps: [
        ["目标压缩", "快速确认核心目标，剔除非必要工作项。"],
        ["资源聚焦", "优先调度关键资源并建立最短执行路径。"],
        ["并行产出", "同步推进高优先级任务，缩短等待链路。"],
        ["快速验收", "进行轻量质量检查，确保可上线/可交付。"],
        ["发布回收", "交付版本并回收反馈，准备下一轮迭代。"],
      ],
    },
    {
      match: /(项目规划流|创意流|规划)/,
      steps: [
        ["需求梳理", `梳理${label}场景的业务诉求和关键限制条件。`],
        ["结构设计", "形成项目结构、阶段节点和角色分工。"],
        ["内容策划", "输出创意方向或执行方案初稿。"],
        ["排期确认", "确定里程碑、资源安排和交付节奏。"],
        ["计划发布", "发布项目计划并明确跟踪机制。"],
      ],
    },
    {
      match: /(数据分析流|诊断流|分析)/,
      steps: [
        ["数据采集", "明确数据口径并收集核心样本。"],
        ["指标建模", "建立分析维度，拆解关键表现指标。"],
        ["异常识别", "定位异常波动与潜在原因。"],
        ["结论推导", "输出数据结论与业务影响解释。"],
        ["行动建议", "给出可执行优化动作及优先级。"],
      ],
    },
    {
      match: /(内容生产流|内容流|素材)/,
      steps: [
        ["主题定位", `确定${label}内容方向、受众和表达重点。`],
        ["结构编排", "搭建内容结构与叙事顺序。"],
        ["内容产出", "生成主内容并补充关键素材。"],
        ["表达优化", "统一语气与风格，提升可读可用性。"],
        ["成稿交付", "输出可直接发布/执行的最终内容版本。"],
      ],
    },
    {
      match: /(运营协同流|协同流|协同)/,
      steps: [
        ["任务分派", "按职责拆分任务并明确接口人。"],
        ["过程同步", "建立协同节奏与状态回传机制。"],
        ["依赖处理", "识别跨角色依赖并提前消除阻塞。"],
        ["联合复核", "多角色共同确认关键输出质量。"],
        ["协同复盘", "沉淀协同经验与下一次协作规范。"],
      ],
    },
    {
      match: /(复盘迭代流|迭代流|迭代)/,
      steps: [
        ["结果回收", "汇总本轮产出、指标与反馈数据。"],
        ["问题归因", "定位效果差异和关键失败原因。"],
        ["策略调整", "提出下一轮优化策略与验证假设。"],
        ["版本更新", "更新流程模板和执行参数。"],
        ["迭代计划", "确认下一轮目标、节奏与评估方式。"],
      ],
    },
  ];

  const matched = stepMap.find((item) => item.match.test(titleText));
  const fallbackSteps = profileStages.map((stage, index) => [
    `${stage}`,
    `围绕${label}场景推进${stage}，并输出该阶段可复用结果。`,
    index,
  ]);
  const steps = (matched ? matched.steps : fallbackSteps).slice(0, 5);
  return steps.map((item, index) => ({
    title: `${index + 1}. ${item[0]}`,
    description: item[1],
    attachmentName: "",
    attachmentDataUrl: "",
  }));
}

function activePlan() {
  return subscriptionPlans.find((plan) => plan.id === state.activePlan) || subscriptionPlans[0];
}

function profileForIndustry(key = state.industry) {
  return industryProfiles[key] || industryProfiles.default;
}

function normalizeSkillEntry(entry) {
  if (entry && typeof entry === "object" && entry.skill != null) {
    return {
      skill: String(entry.skill),
      description: entry.description != null ? String(entry.description) : "",
    };
  }
  const label = String(entry ?? "");
  return { skill: label, description: "" };
}

function skillEntryLabel(entry) {
  return normalizeSkillEntry(entry).skill;
}

function initializeSkillToggles() {
  const toggles = {};
  industries.forEach(([industryKey]) => {
    const profile = profileForIndustry(industryKey);
    toggles[industryKey] = profile.skills.map((entry) => {
      const { skill, description } = normalizeSkillEntry(entry);
      return { skill, description, enabled: true };
    });
  });
  return toggles;
}

function enabledSkills(industryKey = state.industry) {
  const skills = state.skillToggles[industryKey];
  if (!Array.isArray(skills)) {
    return profileForIndustry(industryKey).skills.map(skillEntryLabel);
  }
  const selected = skills.filter((item) => item.enabled).map((item) => item.skill);
  return selected.length ? selected : ["当前行业未启用技能，请在技能模块开启。"];
}

function formatAge(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value)) return "未知";
  if (value < 60) return `${Math.max(1, Math.round(value))} 秒前`;
  if (value < 3600) return `${Math.round(value / 60)} 分钟前`;
  return `${Math.round(value / 3600)} 小时前`;
}

function formatRuntime(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "未知";
  if (value < 60) return `${Math.max(1, Math.round(value))} 秒`;
  if (value < 3600) return `${Math.max(1, Math.round(value / 60))} 分钟`;
  if (value < 86400) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours} 小时 ${minutes} 分钟`;
  }
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  return `${days} 天 ${hours} 小时`;
}

function runtimeForDisplay(node, nodeIndex = 0) {
  const raw = Number(node?.runtime_seconds || 0);
  if (Number.isFinite(raw) && raw > 0) return raw + (nodeIndex * 37);
  const seed = String(node?.node_id || node?.node_name || "node");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  }
  // 稳定随机在 30 秒到 20 天之间
  return 30 + ((hash + nodeIndex * 9973) % (20 * 24 * 3600));
}

/** 与总览节点网格相同的筛选顺序（用于标题编号与搜索联动） */
function nodesMatchingNodeSearch(queryRaw) {
  const query = String(queryRaw ?? "").trim().toLowerCase();
  return state.nodes.filter((node) => {
    const text = [node.node_id, node.node_name, node.http_endpoint, node.ai_model].join(" ").toLowerCase();
    return !query || text.includes(query);
  });
}

/** 总览卡片主标题「节点-01」规则；讨论区参与节点标题与此一致 */
function overviewNodeCardTitle(node) {
  const filtered = nodesMatchingNodeSearch($("#node-search")?.value);
  const idxFiltered = filtered.findIndex((n) => n.node_id === node.node_id);
  if (idxFiltered >= 0) {
    return `节点-${String(idxFiltered + 1).padStart(2, "0")}`;
  }
  const idxAll = state.nodes.findIndex((n) => n.node_id === node.node_id);
  if (idxAll >= 0) {
    return `节点-${String(idxAll + 1).padStart(2, "0")}`;
  }
  return node.node_name || node.node_id || "节点";
}

function timestamp() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function consumeQuota(amount) {
  const plan = activePlan();
  plan.used = Math.min(plan.quota, plan.used + amount);
  renderOverview();
}

function addResult(type, title, detail, payload = null) {
  state.results.unshift({
    id: uid("result"),
    type,
    title,
    detail,
    payload,
    time: timestamp(),
  });
  state.results = state.results.slice(0, 12);
  renderResults();
}

function endpointHost(endpoint) {
  try {
    return new URL(endpoint).host;
  } catch {
    return endpoint || "-";
  }
}

/** 讨论区等：优先展示配置中的机器 IP，否则从接入地址解析 host:port */
function nodeMachineIpDisplay(node) {
  const explicit = String(node?.machine_ip || "").trim();
  if (explicit) return explicit;
  const host = endpointHost(node?.http_endpoint);
  if (host && host !== "-") return host;
  return "—";
}

/** 仅这些模型不展示「API Key」；其余选项需填写 API Key */
const PLATFORM_AI_MODEL_IDS = new Set([
  "qwen",
]);

function isPlatformAiModelValue(modelId) {
  return PLATFORM_AI_MODEL_IDS.has(String(modelId || "").trim());
}

function updateConfigModelApiKeyVisibility() {
  const select = $("#config-ai-model");
  const wrap = $("#config-model-api-key-wrap");
  if (!select || !wrap) return;
  const input = wrap.querySelector('input[name="model_api_key"]');
  const val = String(select.value || "").trim();
  const needsKey = Boolean(val) && !isPlatformAiModelValue(val);
  wrap.classList.toggle("config-model-api-key-wrap--hidden", !needsKey);
  wrap.setAttribute("aria-hidden", needsKey ? "false" : "true");
  if (input) {
    input.required = needsKey;
    input.tabIndex = needsKey ? 0 : -1;
    if (!needsKey) input.value = "";
  }
}

function normalizeNode(node, index) {
  return {
    node_id: node.node_id || `local-node-${index + 1}`,
    node_name: node.node_name || node.name || `node-${index + 1}`,
    role: node.role || node.worker_role || "assistant",
    studio_role: node.studio_role || node.worker_role || node.role || "AI 节点",
    machine_ip: String(node.machine_ip || "").trim(),
    http_endpoint: node.http_endpoint || node.endpoint || "",
    ai_model: node.ai_model || node.model || node.persona_profile || "AI model",
    seconds_since_heartbeat: node.seconds_since_heartbeat,
    status: node.status || (node.stale ? "stale" : "online"),
    labels: [...(node.labels || []), ...(node.capability_tags || [])].filter(Boolean),
    paused: false,
    runtime_seconds: Number(node.runtime_seconds || node.uptime_seconds || node.uptime || 0),
  };
}

const platformTemplateBlueprints = [
  ["标准执行流", "围绕目标制定执行链路并产出标准交付结果。"],
  ["增长优化流", "聚焦效率与效果提升，输出可落地优化动作。"],
  ["风险复核流", "识别关键风险并形成分级处理建议。"],
  ["极速交付流", "压缩流程周期，优先交付可执行版本。"],
  ["项目规划流", "完成目标拆解、资源排布和节奏编排。"],
  ["数据分析流", "基于关键指标进行诊断并给出决策建议。"],
  ["内容生产流", "产出结构化内容素材并完成质量校验。"],
  ["运营协同流", "组织多角色协同执行并沉淀复盘记录。"],
  ["复盘迭代流", "总结结果、归因问题并制定下一轮策略。"],
];

const personalTemplateBlueprints = [
  ["我的标准流", "基于个人偏好执行标准流程并保留关键步骤。"],
  ["我的效率流", "以效率优先方式完成任务并输出简版结论。"],
  ["我的复核流", "加入个人复核检查点，降低交付风险。"],
  ["我的创意流", "强调创意表达和差异化方案生成。"],
  ["我的执行流", "聚焦动作拆解和落地推进，强调执行可行性。"],
  ["我的诊断流", "先诊断问题，再输出针对性优化建议。"],
  ["我的内容流", "围绕目标持续产出内容并统一表达风格。"],
  ["我的协同流", "按个人协同习惯组织节点协作与反馈。"],
  ["我的迭代流", "结合历史结果持续迭代并沉淀经验模版。"],
];

const MAX_TEMPLATE_ICON_BYTES = 512 * 1024;

const TEMPLATE_ICON_LOGO_MARKUP = `<span class="template-card-icon-logo">OC</span>`;

/** 平台模版：按行业 + 标题生成与技能中心一致的多彩图标（渐变底 + 几何图形） */
function platformTemplateIconDescriptor(industryKey) {
  const normalizedIndustry = String(industryKey || "default").trim() || "default";
  const fingerprint = skillIconFingerprint(normalizedIndustry, "platform-template", 0);
  return {
    tone: fingerprint % 12,
    glyph: SKILL_ICON_GLYPHS[fingerprint % SKILL_ICON_GLYPHS.length],
  };
}

function renderPlatformTemplateIconMarkup(template) {
  const industryKey = template.industry || "default";
  const { tone, glyph } = platformTemplateIconDescriptor(industryKey);
  return `<span class="skill-toggle-icon platform-template-icon platform-icon-tone-${tone}" aria-hidden="true">${glyph}</span>`;
}

function renderTemplateCardIconInnerHtml(template) {
  const isMine = template.source === "mine";
  if (isMine && template.iconDataUrl) {
    return `<img class="template-card-icon-img" alt="" loading="lazy" decoding="async" src="${template.iconDataUrl}">`;
  }
  if (!isMine) {
    return renderPlatformTemplateIconMarkup(template);
  }
  return TEMPLATE_ICON_LOGO_MARKUP;
}

function renderTemplateCardIconBlockHtml(template) {
  const kind = template.source === "mine" ? "mine" : "platform";
  return `<div class="template-card-icon ${kind}" aria-hidden="true">${renderTemplateCardIconInnerHtml(template)}</div>`;
}

function templatesForIndustry(key = state.industry) {
  const enabledIndustries = new Set(activePlan().industries);
  const candidateIndustries = industries
    .map(([industryKey]) => industryKey)
    .filter((industryKey) => (
      key === "all"
        ? enabledIndustries.has(industryKey)
        : industryKey === key
    ));
  const platformTemplates = candidateIndustries.flatMap((industryKey) => {
    const profile = profileForIndustry(industryKey);
    const label = industryName(industryKey);
    const primarySkill = skillEntryLabel(profile.skills?.[0]) || "目标拆解";
    const primaryDeliverable = profile.deliverables?.[0] || "交付结果";
    return platformTemplateBlueprints.map(([suffix, description], index) => {
      const title = `${label}${suffix}`;
      return {
        id: `tpl-${industryKey}-${index + 1}`,
        industry: industryKey,
        source: "platform",
        title,
        description,
        projectName: `${label}项目`,
        objective: `请围绕“${title}”完成任务，重点关注${primarySkill}，并输出${primaryDeliverable}。`,
        executionStyle: index % 3 === 0 ? "strict" : index % 3 === 1 ? "balanced" : "fast",
      };
    });
  });
  const mineIndustryCandidates = industries
    .map(([industryKey]) => industryKey)
    .filter((industryKey) => enabledIndustries.has(industryKey))
    .slice(0, 9);
  const localTemplates = state.localTemplates.filter((template) => (
    key === "all"
      ? !template.industry || enabledIndustries.has(template.industry)
      : template.industry === key
  ));
  const localTemplateIdSet = new Set(localTemplates.map((template) => template.id));
  const presetPersonalTemplates = mineIndustryCandidates.map((industryKey, index) => {
    const profile = profileForIndustry(industryKey);
    const label = industryName(industryKey);
    const [suffix, description] = personalTemplateBlueprints[index % personalTemplateBlueprints.length];
    const title = `${label}${suffix}`;
    return {
      id: `mine-preset-${industryKey}-1`,
      industry: industryKey,
      source: "mine",
      title,
      description,
      projectName: `${label}个人项目`,
      objective: `请按“${title}”完成任务，重点关注${skillEntryLabel(profile.skills?.[1]) || "方案输出"}，并输出${profile.deliverables?.[1] || "执行清单"}。`,
      executionStyle: index % 3 === 0 ? "balanced" : index % 3 === 1 ? "creative" : "fast",
    };
  }).filter((template) => !state.hiddenMineTemplateIds.includes(template.id) && !localTemplateIdSet.has(template.id));

  return [...platformTemplates, ...presetPersonalTemplates, ...localTemplates];
}

function collaborationTemplatesForDock(industryKey, source) {
  const normalizedSource = source === "mine" ? "mine" : "platform";
  return templatesForIndustry(industryKey).filter((item) => item.source === normalizedSource);
}

function refreshCollaborationTemplateSelect(preferredId = null) {
  const form = $("#collaboration-form");
  const select = $("#collaboration-template-select");
  if (!form || !select) return;
  const industrySelect = form.elements.namedItem("collaboration_industry");
  const industryRaw = String(industrySelect?.value ?? "").trim();
  if (!industryRaw) {
    select.innerHTML = `<option value="">请先选择行业</option>`;
    select.value = "";
    select.disabled = true;
    syncCustomSelect(select);
    return;
  }
  select.disabled = false;
  const industryKey = industryRaw;
  const sourceRaw = $("#collaboration-template-source")?.value || "platform";
  const source = sourceRaw === "mine" ? "mine" : "platform";
  const list = collaborationTemplatesForDock(industryKey, source);
  const prev = preferredId != null && preferredId !== "" ? preferredId : select.value;
  select.innerHTML = list.length
    ? list.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.title)}</option>`).join("")
    : `<option value="">该类型暂无可用模版</option>`;
  if (prev && list.some((t) => t.id === prev)) {
    select.value = prev;
  } else if (list[0]) {
    select.value = list[0].id;
  } else {
    select.value = "";
  }
  syncCustomSelect(select);
}

function updateCollaborationDockGate() {
  const fieldset = $("#collaboration-gated-fields");
  const industrySelect = $("#collaboration-industry-select");
  if (!fieldset || !industrySelect) return;
  const open = Boolean(String(industrySelect.value ?? "").trim());
  fieldset.disabled = !open;
  if (open) {
    fieldset.removeAttribute("aria-disabled");
    refreshCollaborationTemplateSelect();
  } else {
    fieldset.setAttribute("aria-disabled", "true");
    const tplSelect = $("#collaboration-template-select");
    if (tplSelect) {
      tplSelect.innerHTML = `<option value="">请先选择行业</option>`;
      tplSelect.value = "";
      tplSelect.disabled = true;
      syncCustomSelect(tplSelect);
    }
  }
  syncAllCustomSelects($("#collaboration-form") || document);
}

function setCollaborationTemplateSourceUI(source) {
  const normalized = source === "mine" ? "mine" : "platform";
  const input = $("#collaboration-template-source");
  if (input) input.value = normalized;
  $$("[data-collab-template-source]").forEach((button) => {
    button.classList.toggle("active", button.dataset.collabTemplateSource === normalized);
  });
}

function parseApiJsonBody(text, response) {
  const raw = String(text ?? "");
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return null;
  const head = trimmed.slice(0, 400).toLowerCase();
  if (head.startsWith("<!doctype") || head.startsWith("<html") || (trimmed.startsWith("<") && head.includes("<html"))) {
    throw new Error(`接口返回了网页(HTTP ${response.status})，请确认后端已启动且地址 ${API_BASE} 正确`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`接口返回不是合法 JSON(HTTP ${response.status})`);
  }
}

async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs || 5000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: options.method ? "no-store" : "default",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    const text = await response.text();
    const data = parseApiJsonBody(text, response);
    if (!response.ok) throw new Error(data?.detail || data?.message || `请求失败 ${response.status}`);
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}

function toast(message, type = "info") {
  const region = $("#toast-region");
  if (!region) return;
  const item = document.createElement("div");
  item.className = `toast ${type === "error" ? "error" : ""}`;
  item.textContent = message;
  region.appendChild(item);
  setTimeout(() => item.remove(), 4200);
}

function downloadWorkflowDemoFile(fileMeta, contextTitle = "") {
  const safeName = String(fileMeta?.name || "demo-file").replace(/[/\\?%*:|"<>]/g, "_");
  const stem = safeName.replace(/\.[^/.]+$/, "");
  const downloadName = safeName.toLowerCase().endsWith(".txt") ? safeName : `${stem}_演示导出.txt`;
  const body = [
    "# CubeSaas 控制台演示导出（占位文件）",
    "",
    `执行标题：${contextTitle}`,
    `文件名：${fileMeta?.name || ""}`,
    `类型：${fileMeta?.type || ""}`,
    `大小（示意）：${fileMeta?.size || ""}`,
    `状态：${fileMeta?.status || ""}`,
    `备注：${fileMeta?.note || ""}`,
    "",
    "以下内容仅供界面演示，不代表真实业务产出文件。",
    "---",
    "",
    "(在实际接入后端后，此处应替换为真实文件下载链接。)",
    "",
  ].join("\n");
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = downloadName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function setConnection(status, detail = "") {
  const statusLine = $("#connection-status");
  if (!statusLine) return;
  statusLine.classList.toggle("offline", status !== "online" && status !== "demo");
  statusLine.classList.toggle("demo", status === "demo");
  if (status === "online") {
    statusLine.textContent = `控制器已连接 · ${detail}`;
  } else if (status === "loading") {
    statusLine.textContent = "正在连接控制器";
  } else if (status === "demo") {
    statusLine.textContent = detail || "节点进行中";
  } else {
    statusLine.textContent = detail ? `离线演示数据 · ${detail}` : "离线演示数据 · 控制器不可达";
  }
}

async function loadData() {
  if (USE_LOCAL_DEMO_DATA_ONLY) {
    state.connected = false;
    state.workflows = [];
    setConnection("demo", "节点进行中");
    renderAll();
    return;
  }

  setConnection("loading");
  renderAll();
  try {
    const [health, nodes, workflows] = await Promise.all([
      api("/healthz"),
      api("/nodes"),
      api(`/workflows${state.industry === "all" ? "?limit=10" : `?industry=${encodeURIComponent(state.industry)}&limit=10`}`),
    ]);
    state.connected = health?.status === "ok";
    state.nodes = (Array.isArray(nodes) ? nodes : []).map(normalizeNode);
    state.workflows = Array.isArray(workflows) ? workflows : [];
    setConnection("online", `${state.nodes.length} 个节点`);
  } catch (error) {
    state.connected = false;
    state.nodes = sampleNodes.map(normalizeNode);
    state.workflows = [];
    setConnection("offline", error.message);
    toast("控制器不可达，已进入演示数据。", "error");
  }
  renderAll();
}

function renderIndustrySelect() {
  const select = $("#industry-select");
  const skillsSelect = $("#skills-industry-select");
  if (!select && !skillsSelect) return;
  const plan = activePlan();
  const options = [
    { value: "all", label: "全部行业", disabled: false },
    ...industries.map(([value, label]) => ({
      value,
      label,
      disabled: !plan.industries.includes(value),
    })),
  ];
  const optionHtml = options.map((item) => (
    `<option value="${item.value}" ${item.disabled ? "disabled" : ""}>${item.label}${item.disabled ? " · 升级开放" : ""}</option>`
  )).join("");
  if (select) select.innerHTML = optionHtml;
  if (skillsSelect) skillsSelect.innerHTML = optionHtml;
  if (state.industry !== "all" && !plan.industries.includes(state.industry)) {
    state.industry = "all";
  }
  if (select) select.value = state.industry;
  if (skillsSelect) skillsSelect.value = state.industry;
  const triggerLabel = $("#industry-select-trigger span");
  if (triggerLabel) triggerLabel.textContent = industryName(state.industry);
  const skillsTriggerLabel = $("#skills-industry-select-trigger span");
  if (skillsTriggerLabel) skillsTriggerLabel.textContent = industryName(state.industry);
  const menu = $("#industry-select-menu");
  if (menu) {
    menu.innerHTML = options.map((item) => (
      `<button class="custom-select-option ${item.value === state.industry ? "active" : ""}" type="button" data-industry-value="${escapeHtml(item.value)}" ${item.disabled ? "disabled" : ""}>${escapeHtml(item.label)}${item.disabled ? " · 升级开放" : ""}</button>`
    )).join("");
  }
  const skillsMenu = $("#skills-industry-select-menu");
  if (skillsMenu) {
    skillsMenu.innerHTML = options.map((item) => (
      `<button class="custom-select-option ${item.value === state.industry ? "active" : ""}" type="button" data-skills-industry-value="${escapeHtml(item.value)}" ${item.disabled ? "disabled" : ""}>${escapeHtml(item.label)}${item.disabled ? " · 升级开放" : ""}</button>`
    )).join("");
  }
}

function renderOverview() {
  const plan = activePlan();
  const executions = state.workflowRuns.length;

  const metricNodes = $("#metric-nodes");
  if (metricNodes) metricNodes.textContent = String(state.nodes.length);
  const metricIndustries = $("#metric-industries");
  if (metricIndustries) metricIndustries.textContent = String(plan.industries.length);
  const metricExecutions = $("#metric-executions");
  if (metricExecutions) metricExecutions.textContent = String(executions);
  const metricQuota = $("#metric-quota");
  if (metricQuota) metricQuota.textContent = `${plan.used} / ${plan.quota}`;
  const sidebarPlan = $("#sidebar-plan");
  if (sidebarPlan) sidebarPlan.textContent = plan.name;
  const sidebarQuota = $("#sidebar-quota");
  if (sidebarQuota) sidebarQuota.textContent = `${plan.quota} Token`;
  const activePlanLabel = $("#active-plan-label");
  if (activePlanLabel) activePlanLabel.textContent = `当前：${plan.name}`;
}

function renderOverviewCharts() {
  const trend = [3, 8, 5, 11, 6, 13, 9];
  const trendMax = Math.max(...trend, 1);
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const dayGradients = [
    "linear-gradient(180deg, #64748b, #334155)",
    "linear-gradient(180deg, #22d66f, #0f7a43)",
    "linear-gradient(180deg, #94a3b8, #475569)",
    "linear-gradient(180deg, #00FF84, #18b85f)",
    "linear-gradient(180deg, #cbd5e1, #64748b)",
    "linear-gradient(180deg, #18b85f, #155e75)",
    "linear-gradient(180deg, #c8f6d9, #0f7a43)",
  ];
  const trendChart = $("#workflow-trend-chart");
  if (trendChart) {
    trendChart.innerHTML = trend.map((value, index) => `
    <div class="bar-item">
      <i data-value="${value}%" style="height:${Math.max(12, Math.round((value / trendMax) * 100))}%;background:${dayGradients[index]};"></i>
      <span>${days[index]}</span>
    </div>
  `).join("");
  }

  const projectChart = $("#workflow-project-chart");
  if (!projectChart) return;
  const typeLabel = (type) => {
    if (type === "workflow") return "工作流";
    if (type === "discussion") return "讨论";
    return "指令";
  };
  const runItems = state.workflowRuns.slice(0, 4);
  if (!runItems.length) {
    projectChart.innerHTML = `<div class="empty-state">暂无执行记录，发起对话/讨论/工作流后会在这里展示最近执行。</div>`;
    return;
  }
  projectChart.innerHTML = runItems.map((item) => `
    <article class="workflow-project-row" role="button" tabindex="0" aria-label="查看执行记录 ${escapeHtml(item.title || "未命名")} 详情" data-overview-run-id="${escapeHtml(item.id)}">
      <div>
        <strong>${escapeHtml(item.title || "未命名")}</strong>
        <p>${escapeHtml(`${industryName(item.industry)} · ${typeLabel(item.type)} · ${item.status}`)}</p>
      </div>
    </article>
  `).join("");
}

function renderPlans() {
  const planList = $("#plan-list");
  if (!planList) return;
  planList.innerHTML = subscriptionPlans.map((plan) => {
    const active = plan.id === state.activePlan;
    let footer = "";
    if (plan.id === "free") {
      footer = active
        ? `<div class="plan-card-current-strip" role="status">当前方案</div>`
        : `<div class="plan-card-footer-spacer" aria-hidden="true"></div>`;
    } else if (active) {
      footer = `<button class="button secondary" type="button" data-plan="${escapeHtml(plan.id)}">当前方案</button>`;
    } else if (plan.id === "enterprise") {
      footer = `<button class="button primary" type="button" data-plan="${escapeHtml(plan.id)}">联系客服</button>`;
    } else {
      footer = `<button class="button primary" type="button" data-plan="${escapeHtml(plan.id)}">订阅</button>`;
    }
    return `
    <article class="plan-card ${active ? "active" : ""}">
      <div>
        <h3>${escapeHtml(plan.name)}</h3>
        <div class="price">${escapeHtml(plan.price)}</div>
        <p>${escapeHtml(plan.description)}</p>
      </div>
      <div class="feature-list">
        ${plan.features.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
      ${footer}
    </article>
  `;
  }).join("");
}

function renderNodes() {
  const grid = $("#node-grid");
  if (!grid) return;
  const nodes = nodesMatchingNodeSearch($("#node-search")?.value);

  if (!nodes.length) {
    grid.innerHTML = `<div class="empty-state">没有符合条件的节点。可到「节点配置」添加或接入节点。</div>`;
    return;
  }

  grid.innerHTML = nodes.map((node, nodeIndex) => {
    const displayName = overviewNodeCardTitle(node);
    const status = node.paused ? "paused" : node.status;
    const statusLabel = status === "online" || status === "paused" ? "" : "陈旧";
    const cpuLoad = Math.max(12, Math.min(96, 42 + (node.node_name.length * 7) % 52));
    const trendPointCount = 8 + ((node.node_id.length + nodeIndex) % 3);
    const heartbeatTrend = Array.from({ length: trendPointCount }, (_, index) => {
      const baseSeries = [22, 34, 28, 40, 31, 48, 36, 44, 30, 52];
      const base = baseSeries[index % baseSeries.length];
      const offset = (node.node_id.length + index * 3) % 9;
      return Math.max(14, Math.min(64, base + offset));
    });
    const trendWidth = 240;
    const trendHeight = 70;
    const stepX = trendPointCount > 1 ? trendWidth / (trendPointCount - 1) : trendWidth;
    const linePoints = heartbeatTrend.map((value, index) => {
      const x = Math.round(index * stepX);
      const y = Math.round(trendHeight - (value / 100) * trendHeight);
      return `${x},${y}`;
    }).join(" ");
    const areaPoints = `0,${trendHeight} ${linePoints} ${trendWidth},${trendHeight}`;
    return `
      <article class="node-card">
        <div class="node-head">
          <div>
            <h3>${escapeHtml(displayName)}</h3>
          </div>
          <span class="node-status ${escapeHtml(status)}" aria-label="${status === "online" ? "运行中" : status === "paused" ? "已暂停" : escapeHtml(statusLabel)}" title="${status === "online" ? "运行中" : status === "paused" ? "已暂停" : escapeHtml(statusLabel)}">
            <i class="node-status-dot"></i>${statusLabel}
          </span>
        </div>
        <div class="node-visual">
          <div class="node-structure" aria-hidden="true">
            <span class="hardware-box-icon" aria-hidden="true"><i></i></span>
          </div>
          <div class="node-mini-chart" aria-label="节点负载趋势">
            <svg viewBox="0 0 ${trendWidth} ${trendHeight}" preserveAspectRatio="none" role="img" aria-label="节点走势图">
              <defs>
                <linearGradient id="node-trend-fill-${escapeHtml(node.node_id)}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(198, 220, 245, 0.52)"></stop>
                  <stop offset="100%" stop-color="rgba(198, 220, 245, 0.04)"></stop>
                </linearGradient>
              </defs>
              <polyline class="node-trend-area" points="${areaPoints}" fill="url(#node-trend-fill-${escapeHtml(node.node_id)})"></polyline>
              <polyline class="node-trend-line" points="${linePoints}"></polyline>
            </svg>
          </div>
        </div>
        <div class="node-meta">
          <span>机器 IP：<strong>${escapeHtml(endpointHost(node.http_endpoint))}</strong></span>
          <span>AI 模型：<strong>${escapeHtml(node.ai_model)}</strong></span>
          <span>运行时长：<strong>${escapeHtml(formatRuntime(runtimeForDisplay(node, nodeIndex)))}</strong></span>
          <span>负载估计：<strong>${cpuLoad}%</strong></span>
          <div class="node-load-track" aria-hidden="true"><i style="width:${cpuLoad}%"></i></div>
        </div>
        <div class="card-actions">
          <button class="button small ${node.paused ? "primary" : "secondary"}" type="button" data-toggle-node="${escapeHtml(node.node_id)}">
            ${node.paused ? "启动节点" : "暂停节点"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderDiscussionNodePicker() {
  const discussionLabel = $("#discussion-node-field-label");
  if (discussionLabel) {
    discussionLabel.textContent = `参与节点（当前 ${state.nodes.length} 个节点）`;
  }
  const discussionPicker = $("#discussion-node-picker");
  if (!discussionPicker) return;
  discussionPicker.classList.toggle("discussion-node-picker--scroll", state.nodes.length > 6);
  discussionPicker.innerHTML = state.nodes.length
    ? state.nodes.map((node, index) => `
    <div class="discussion-node-option">
      <label class="discussion-node-option-select">
        <input type="checkbox" name="participant_node_ids" value="${escapeHtml(node.node_id)}">
        <span class="discussion-node-option-body">
          <strong>${escapeHtml(overviewNodeCardTitle(node))}</strong>
          <small class="discussion-node-meta">机器 IP：${escapeHtml(nodeMachineIpDisplay(node))}</small>
        </span>
      </label>
      <input
        class="discussion-role-input"
        type="text"
        name="participant_role_${escapeHtml(node.node_id)}"
        placeholder="输入该节点代表的职业，例如：${escapeHtml(DISCUSSION_ROLE_EXAMPLES[index % DISCUSSION_ROLE_EXAMPLES.length])}"
      >
    </div>
  `).join("")
    : `<p class="discussion-node-empty">当前工作台暂无节点。请先在「节点配置」中添加或接入节点，再为节点填写职业描述并发起讨论。</p>`;
}

function renderWorkflowControls() {
  const profile = profileForIndustry();
  const currentEnabledSkills = enabledSkills();
  const industryLabel = industryName();
  const plan = activePlan();
  const collaborationIndustry = $("#collaboration-industry-select");
  if (collaborationIndustry) {
    const options = [
      `<option value="">请先选择行业</option>`,
      ...industries.map(([value, label]) => (
        `<option value="${escapeHtml(value)}" ${!plan.industries.includes(value) ? "disabled" : ""}>${escapeHtml(label)}${!plan.industries.includes(value) ? " · 升级开放" : ""}</option>`
      )),
    ].join("");
    collaborationIndustry.innerHTML = options;
    let value = state.workflowDockIndustry;
    if (value === "all" || (value && !plan.industries.includes(value))) {
      state.workflowDockIndustry = "";
      value = "";
    }
    collaborationIndustry.value = value ?? "";
    updateCollaborationDockGate();
  }
  renderDiscussionNodePicker();
  const industrySkillTitle = $("#industry-skill-title");
  const industrySkillList = $("#industry-skill-list");
  const deliverableList = $("#deliverable-list");
  if (industrySkillTitle) industrySkillTitle.textContent = profile.title;
  if (industrySkillList) industrySkillList.innerHTML = currentEnabledSkills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("");
  if (deliverableList) deliverableList.innerHTML = profile.deliverables.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("");
  const templateTitle = $("#workflow-template-title");
  const templateHint = $("#workflow-template-industry-hint");
  if (templateTitle) templateTitle.textContent = `${industryLabel}工作流模版`;
  if (templateHint) templateHint.textContent = `仅展示当前行业（${industryLabel}）可用模版`;
}

function renderSkillsPanel() {
  const container = $("#skills-module-list");
  if (!container) return;
  const plan = activePlan();
  const industryEntries =
    state.industry === "all"
      ? industries
      : industries.filter(([key]) => key === state.industry);
  let totalCount = 0;
  let enabledCount = 0;
  const cards = industryEntries.map(([industryKey]) => {
    const industryLabel = industryName(industryKey);
    const locked = !plan.industries.includes(industryKey);
    const skillList = state.skillToggles[industryKey] || [];
    totalCount += skillList.length;
    enabledCount += skillList.filter((item) => item.enabled).length;
    const skillRows = skillList.map((item, index) => `
    <div class="skill-toggle-item ${item.enabled ? "is-on" : "is-off"}${locked ? " locked" : ""}">
      ${renderSkillIconMarkup(industryKey, item.skill, index)}
      <div class="skill-toggle-text">
        <span class="skill-toggle-label">${escapeHtml(item.skill)}</span>
        <span class="skill-toggle-desc">${escapeHtml(item.description || "")}</span>
      </div>
      <button type="button" class="skill-switch"
        role="switch"
        aria-checked="${item.enabled ? "true" : "false"}"
        aria-label="${item.enabled ? "已开启，点击关闭" : "已关闭，点击开启"}"
        data-skill-industry="${escapeHtml(industryKey)}"
        data-skill-index="${index}"
        ${locked ? "disabled" : ""}>
        <span class="skill-switch-thumb" aria-hidden="true"></span>
      </button>
    </div>
  `).join("");
    return `
    <article class="industry-skill-card ${locked ? "locked" : ""}">
      <div class="industry-skill-head">
        <strong>${escapeHtml(industryLabel)}</strong>
        ${locked ? "<small>当前订阅不可编辑</small>" : ""}
      </div>
      <div class="industry-skill-list">${skillRows}</div>
    </article>`;
  }).join("");
  const disabledCount = Math.max(0, totalCount - enabledCount);
  const skillsTotal = $("#skills-total-count");
  if (skillsTotal) skillsTotal.textContent = String(totalCount);
  const skillsEnabled = $("#skills-enabled-count");
  if (skillsEnabled) skillsEnabled.textContent = String(enabledCount);
  const skillsDisabled = $("#skills-disabled-count");
  if (skillsDisabled) skillsDisabled.textContent = String(disabledCount);
  container.innerHTML = cards;
}

function renderTemplates() {
  $$(".segment[data-template-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.templateFilter === state.templateFilter);
  });
  const templates = templatesForIndustry().filter((template) => {
    return state.templateFilter === "all" || template.source === state.templateFilter;
  });
  if (state.templateFilter === "platform") {
    templates.sort((a, b) => templateUsageCount(b) - templateUsageCount(a));
  }
  const paginationKey = `${state.templateFilter}|${state.industry}|${state.activePlan}`;
  if (state.templatePaginationKey !== paginationKey) {
    state.templatePaginationKey = paginationKey;
    state.templateDisplayCount = 30;
  }
  const visibleTemplates = state.templateFilter === "platform"
    ? templates.slice(0, state.templateDisplayCount)
    : templates;
  const templateListEl = $("#template-list");
  if (!templateListEl) return;
  templateListEl.innerHTML = visibleTemplates.map((template) => `
    <article class="template-card ${escapeHtml(template.source)}">
      <div class="template-card-main">
        ${renderTemplateCardIconBlockHtml(template)}
        <div class="template-card-content">
          <div class="template-head">
            <h3>${escapeHtml(template.title)}</h3>
            <span class="template-source template-source-tag" style="${templateIndustryTagStyle(template)}">${escapeHtml(templateIndustryLabel(template))}</span>
          </div>
          <p>${escapeHtml(template.description)}</p>
        </div>
      </div>
      <div class="template-foot">
        ${template.source === "mine" ? "" : `<span class="template-usage">全网套用次数:<span class="template-usage-count">${templateUsageCount(template)}</span>次</span>`}
        <div class="inline-actions ${template.source === "mine" ? "mine-template-actions" : ""}">
          <button class="button small secondary" type="button" data-template-detail="${escapeHtml(template.id)}">详情</button>
          ${template.source === "mine" ? `<button class="button small secondary" type="button" data-edit-template="${escapeHtml(template.id)}">编辑</button>` : ""}
          <button class="button small secondary" type="button" data-apply-template="${escapeHtml(template.id)}">套用</button>
          ${template.source === "mine" ? `<button class="button small ghost delete-icon-button" type="button" data-delete-template="${escapeHtml(template.id)}" title="删除" aria-label="删除"><span aria-hidden="true">🗑</span></button>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

function maybeLoadMorePlatformTemplates() {
  if (state.activeModule !== "workflow" || state.templateFilter !== "platform") return;
  const workspace = $(".workspace");
  if (!workspace) return;
  const nearBottom = workspace.scrollTop + workspace.clientHeight >= workspace.scrollHeight - 120;
  if (!nearBottom) return;
  const totalPlatformTemplates = templatesForIndustry().filter((template) => template.source === "platform").length;
  if (state.templateDisplayCount >= totalPlatformTemplates) return;
  state.templateDisplayCount += 30;
  renderTemplates();
}

// 项目模块已下线：移除 allProjects / renderProjects / workflow-detail 等相关逻辑

function renderResults() {
  const container = $("#result-list");
  if (!container) return;
  if (!state.results.length) {
    container.innerHTML = `<div class="empty-state">还没有执行结果。对话、工作流、讨论、模板和节点动作会回显在这里。</div>`;
    return;
  }
  container.innerHTML = state.results.map((item) => `
    <article class="result-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.detail)}</p>
        <small>${escapeHtml(item.type)} · ${escapeHtml(item.time)}</small>
      </div>
      ${item.payload ? `<button class="button small secondary" type="button" data-result-detail="${escapeHtml(item.id)}">查看</button>` : ""}
    </article>
  `).join("");
}

function renderKnowledgeIndustrySelect() {
  const select = $("#knowledge-industry-select");
  if (!select) return;
  const currentValue = String(select.value || "通用").trim();
  const options = [
    ["通用", "全部行业"],
    ...industries.map(([, label]) => [label, label]),
  ];
  select.innerHTML = options.map(([value, label]) => `
    <option value="${escapeHtml(value)}">${escapeHtml(label)}</option>
  `).join("");
  select.value = options.some(([value]) => value === currentValue) ? currentValue : "通用";
  syncCustomSelect(select);
}

function availableKnowledgeIndustries() {
  const knownOrder = new Map(["通用", ...industries.map(([, label]) => label)].map((label, index) => [label, index]));
  return [...new Set([
    ...industries.map(([, label]) => label),
    ...state.knowledgeItems.map((item) => item.industry).filter(Boolean),
  ])]
    .sort((a, b) => {
      const aRank = knownOrder.has(a) ? knownOrder.get(a) : Number.MAX_SAFE_INTEGER;
      const bRank = knownOrder.has(b) ? knownOrder.get(b) : Number.MAX_SAFE_INTEGER;
      if (aRank !== bRank) return aRank - bRank;
      return a.localeCompare(b);
    });
}

function renderKnowledgeIndustryFilter() {
  const container = $("#knowledge-industry-filter");
  if (!container) return;
  const options = ["all", ...availableKnowledgeIndustries().filter((value) => value !== "通用")];
  if (!options.includes(state.knowledgeIndustryFilter)) {
    state.knowledgeIndustryFilter = "all";
  }
  container.innerHTML = options.map((value) => `
    <button
      class="segment ${value === state.knowledgeIndustryFilter ? "active" : ""}"
      type="button"
      data-knowledge-industry="${escapeHtml(value)}">${escapeHtml(value === "all" ? "全部行业" : value)}</button>
  `).join("");
}

function syncKnowledgeAttachmentUi() {
  const input = $("#knowledge-attachment-input");
  const nameEl = $("#knowledge-attachment-name");
  const clearBtn = $("#knowledge-attachment-clear-btn");
  if (!(input instanceof HTMLInputElement) || !nameEl || !clearBtn) return;
  const file = input.files?.[0];
  nameEl.textContent = file?.name || "未选择文件";
  nameEl.title = file?.name || "";
  clearBtn.hidden = !file;
}

function knowledgeCategoryLabel(category) {
  const labels = {
    workflow: "工作流",
    policy: "规范",
    case: "案例",
    prompt: "提示词",
  };
  return labels[category] || "资料";
}

function filteredKnowledgeItems() {
  const query = String($("#knowledge-search")?.value || "").trim().toLowerCase();
  return state.knowledgeItems.filter((item) => {
    const industryOk = state.knowledgeIndustryFilter === "all" || item.industry === state.knowledgeIndustryFilter;
    const text = [
      item.title,
      item.summary,
      item.content,
      item.industry,
      item.source,
      ...(item.tags || []),
    ].join(" ").toLowerCase();
    return industryOk && (!query || text.includes(query));
  });
}

function renderKnowledgeBase() {
  const list = $("#knowledge-list");
  const detail = $("#knowledge-detail");
  const countEl = $("#knowledge-count");
  const totalEl = $("#knowledge-total-count");
  const industryEl = $("#knowledge-industry-count");
  const tagEl = $("#knowledge-tag-count");
  if (!list || !detail) return;

  const allItems = state.knowledgeItems;
  renderKnowledgeIndustryFilter();
  const filtered = filteredKnowledgeItems();
  const industriesCovered = uniqueValues(allItems.map((item) => item.industry));
  const tags = uniqueValues(allItems.flatMap((item) => item.tags || []));

  if (countEl) countEl.textContent = `${filtered.length} 条资料`;
  if (totalEl) totalEl.textContent = String(allItems.length);
  if (industryEl) industryEl.textContent = String(industriesCovered.length);
  if (tagEl) tagEl.textContent = String(tags.length);

  if (!filtered.length) {
    state.activeKnowledgeId = "";
    list.innerHTML = `<div class="empty-state">没有匹配的知识资料。可以调整搜索条件，或在下方新增资料。</div>`;
    detail.innerHTML = `<div class="empty-state">选择一条知识资料后，会在这里展示摘要、正文和标签。</div>`;
    return;
  }

  const activeItem = filtered.find((item) => item.id === state.activeKnowledgeId) || filtered[0];
  state.activeKnowledgeId = activeItem.id;

  list.innerHTML = filtered.map((item) => `
    <article
      class="knowledge-row ${item.id === activeItem.id ? "active" : ""}"
      role="button"
      tabindex="0"
      data-knowledge-id="${escapeHtml(item.id)}"
      aria-label="查看知识资料 ${escapeHtml(item.title)}">
      <div class="knowledge-row-head">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.industry)}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <div class="knowledge-meta-line">
        <span>${escapeHtml(knowledgeCategoryLabel(item.category))}</span>
        <span>${escapeHtml(item.updatedAt)}</span>
      </div>
    </article>
  `).join("");

  detail.dataset.knowledgeId = activeItem.id;
  detail.innerHTML = `
    <div class="knowledge-detail-head">
      <div>
        <span>${escapeHtml(knowledgeCategoryLabel(activeItem.category))} · ${escapeHtml(activeItem.source || "本地资料")}</span>
        <h3>${escapeHtml(activeItem.title)}</h3>
      </div>
      <strong>${escapeHtml(activeItem.industry)}</strong>
    </div>
    <p class="knowledge-detail-summary">${escapeHtml(activeItem.summary)}</p>
    <div class="knowledge-detail-content">${escapeHtml(activeItem.content)}</div>
    ${activeItem.attachmentName ? `<p class="knowledge-detail-attachment">上传文件：${escapeHtml(activeItem.attachmentName)}</p>` : ""}
    <div class="knowledge-tag-row">
      ${(activeItem.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="knowledge-detail-foot">
      <span>更新时间：${escapeHtml(activeItem.updatedAt)}</span>
      <button class="button small secondary" type="button" data-apply-knowledge="${escapeHtml(activeItem.id)}">加入执行参考</button>
    </div>
  `;
}

function selectKnowledgeItem(itemId) {
  if (!state.knowledgeItems.some((item) => item.id === itemId)) return;
  state.activeKnowledgeId = itemId;
  renderKnowledgeBase();
}

function renderWorkflowRuns() {
  const list = $("#workflow-runs-list");
  const detail = $("#workflow-runs-detail");
  const countEl = $("#workflow-runs-count");
  if (!list || !detail) return;

  const typeLabel = (type) => {
    if (type === "workflow") return "工作流";
    if (type === "discussion") return "讨论";
    return "指令";
  };

  if (!state.workflowRuns.length) {
    state.activeWorkflowRunId = "";
    state.openWorkflowRunMenuId = "";
    list.innerHTML = `<div class="empty-state">暂无工作流执行记录。请在右侧协同区发起一次对话、讨论或工作流。</div>`;
    detail.removeAttribute("data-workflow-run-id");
    detail.innerHTML = `<div class="empty-state">选择左侧一条执行记录后，会在这里展示对应的对话、讨论或工作流详情。</div>`;
    if (countEl) countEl.textContent = "0 条记录";
    return;
  }

  const activeRun = state.workflowRuns.find((run) => run.id === state.activeWorkflowRunId) || state.workflowRuns[0];
  state.activeWorkflowRunId = activeRun.id;
  if (!state.workflowRuns.some((run) => run.id === state.openWorkflowRunMenuId)) {
    state.openWorkflowRunMenuId = "";
  }

  const rowsHtml = state.workflowRuns.map((run) => `
    <article
      class="workflow-run-row ${run.id === activeRun.id ? "active" : ""}"
      role="button"
      tabindex="0"
      aria-label="查看执行记录 ${escapeHtml(run.title || "未命名")} 详情"
      data-workflow-run-id="${escapeHtml(run.id)}">
      <div class="workflow-run-row-head">
        <strong>${escapeHtml(run.title)}</strong>
        <div class="workflow-run-actions">
          <button
            class="workflow-run-more"
            type="button"
            data-toggle-run-menu="${escapeHtml(run.id)}"
            title="更多操作"
            aria-label="打开 ${escapeHtml(run.title || "执行记录")} 的更多操作"
            aria-haspopup="menu"
            aria-expanded="${state.openWorkflowRunMenuId === run.id ? "true" : "false"}">...</button>
          ${state.openWorkflowRunMenuId === run.id ? `
            <div class="workflow-run-menu" role="menu" aria-label="${escapeHtml(run.title || "执行记录")} 操作">
              <button class="workflow-run-menu-item danger" type="button" role="menuitem" data-delete-run="${escapeHtml(run.id)}">删除</button>
            </div>
          ` : ""}
        </div>
      </div>
      <div class="workflow-run-meta-line">
        <span class="workflow-run-chip workflow-run-chip-type">${escapeHtml(typeLabel(run.type))}</span>
        <span class="workflow-run-chip workflow-run-chip-industry">${escapeHtml(industryName(run.industry))}</span>
        <span class="workflow-run-duration">耗时：${Math.max(1, Math.round(run.durationSeconds / 60 || 1))}分钟</span>
      </div>
    </article>
  `).join("");
  list.innerHTML = rowsHtml;
  if (countEl) countEl.textContent = `${state.workflowRuns.length} 条记录`;

  renderWorkflowRunDetail(activeRun);
}

function selectWorkflowRun(runId) {
  const run = state.workflowRuns.find((item) => item.id === runId);
  if (!run) return;
  state.activeWorkflowRunId = run.id;
  state.openWorkflowRunMenuId = "";
  renderWorkflowRuns();
}

function deleteWorkflowRun(runId) {
  const index = state.workflowRuns.findIndex((item) => item.id === runId);
  if (index < 0) return;
  const [removed] = state.workflowRuns.splice(index, 1);
  if (state.activeWorkflowRunId === runId) {
    state.activeWorkflowRunId = state.workflowRuns[index]?.id || state.workflowRuns[index - 1]?.id || "";
  }
  if (state.openWorkflowRunMenuId === runId) state.openWorkflowRunMenuId = "";
  renderWorkflowRuns();
  renderOverview();
  renderOverviewCharts();
  addResult("项目记录", `${removed.title} 已删除`, "项目执行记录已从当前工作台移除。", removed);
  toast("项目执行记录已删除。");
}

function detailContentForRun(run) {
  if (run?.detailContent) return run.detailContent;
  if (run?.id === "wf-demo-001") {
    return {
      steps: [
        { title: "1. 立项与目标澄清（结果范例）", result: "项目代号：SPARK-2026-05\n业务目标：新品冷启动拉新 + 首周种草扩散\n目标人群：25-35 岁一线城市职场女性（熬夜、通勤、轻熟龄护肤需求）\n核心 KPI：CTR>=2.8%，3秒留存>=78%，完播率>=22%，互动率>=4%，收藏率>=1.5%\n预算边界：首轮测试预算 3.6 万，单日上限 8 千\n交付约束：48 小时交付；不得出现绝对化疗效承诺；不得使用未经授权人物素材\n验收标准：3 条 15 秒竖版成片 + 3 张封面 + 2 版投放文案 + 1 份 A/B 测试计划\n里程碑：T+12h 脚本定稿，T+30h 成片初版，T+42h 复核完成，T+48h 交付上线" },
        { title: "2. 竞品拆解（结果范例）", result: "样本池：同类高表现短视频 18 条（近 30 天，互动率前 20%）\n拆解维度：开场钩子、镜头密度、字幕节奏、卖点表达、CTA 位置、评论引导\n高频有效开场：\n- 反常识问题句（占比 44%，平均 3 秒留存 81%）\n- 对比冲突镜头（占比 33%，CTR 平均高 0.6pct）\n- 场景代入提问（占比 23%，互动率更高）\n失败共性：卖点出现过晚、字幕密度过高、镜头切换不稳定\n沉淀结论：前 1.5 秒必须出现“痛点 + 结果”双信息；第 8-10 秒插入证据点；CTA 建议在第 11-13 秒\n可复用素材：开场钩子 12 条、镜头模板 4 套、字幕节奏 2 套、评论引导句 6 条" },
        { title: "3. 脚本与镜头（结果范例）", result: "脚本路线：A 痛点切入、B 对比演示、C 场景故事\n脚本 A 首句：'每天护肤10分钟，为什么状态还是差？'\n脚本 B 首句：'同样作息，肤色差一档到底差在哪？'\n脚本 C 首句：'赶地铁前 30 秒，我只做这一步。'\n镜头结构（以 A2 为例）：\n1) 问题抛出 2s（近景 + 大字）\n2) 痛点放大 3s（素颜/暗沉对比）\n3) 产品动作演示 4s（使用手法 + 质地特写）\n4) 对比结果 3s（前后光感对比）\n5) 信任背书 2s（成分/检测数据点）\n6) CTA 收口 1s（限时试用入口）\n文案双版本：激进转化版 + 审核稳妥版；均已通过词库合规检查" },
        { title: "4. 成片产出（结果范例）", result: "产出版本：A1/A2、B1、C1 共 4 个版本，分辨率 1080x1920，码率 10Mbps\n主推版本：A2（15s）\n版本对比结果：\n- A1：叙事完整但 CTA 偏晚\n- A2：节奏最优，开场信息密度高\n- B1：对比镜头强，但评论引导弱\n- C1：场景共鸣好，转化弱于 A2\n关键改动：\n- 开场字幕从'皮肤问题'改为'熬夜暗沉'\n- CTA 从第13秒前置到第11秒\n- BGM 节奏加快 8%，镜头切换由 7 切增至 9 切\n导出结果：成片 3 条、备选版本 1 条、封面图 3 张、字幕稿 2 版" },
        { title: "5. 复核闭环（结果范例）", result: "复核清单维度：信息一致性、字幕可读性、卖点突出度、合规表达、画质稳定性\n问题单 #01：字幕遮挡人脸 -> 调整字幕到安全区并缩短单行字数\n问题单 #02：CTA 出现偏晚 -> 前置 2 秒并补一句行动引导\n问题单 #03：产品镜头过暗 -> 提升曝光 + 补高光 + 降低噪点\n问题单 #04：成分表述过满 -> 删除 2 处边界词并替换中性表述\n回归结果：4 项问题全部关闭，合规检查通过率 100%\n质量打分：脚本 8.9/10，画面 9.1/10，转化引导 8.7/10，综合 8.9/10" },
        { title: "6. 投放建议（结果范例）", result: "首轮投放：A2/B1 并行 A/B，预算 6:4，投放 2 个核心人群包\n人群策略：\n- 包 A：近 30 天护肤内容高互动人群\n- 包 B：职场女性通勤场景兴趣人群\nDay1：跑量拉样本（目标曝光 18 万）\nDay2：按完播率 + 点击成本双指标淘汰低效素材\nDay3：将预算集中到前 20% 素材，保留评论区高质量问答\n放量规则：CTR>3.1% 且 CPC 低于基线 12% -> 增投 30%\n停投规则：连续 2 小时低于阈值 -> 自动降预算；连续 6 小时低于阈值 -> 下线素材" },
        { title: "7. 复盘沉淀（结果范例）", result: "项目复盘结论：A2 为当前最优版本，关键增益来自“开场双信息 + CTA 前置”\n复用资产沉淀：\n- 短视频开场钩子模板 12 条\n- 15 秒镜头节奏模板 3 套\n- 审核风险词清单 48 条\n- 评论引导话术 20 条\n- A/B 决策阈值模板 1 套\n下轮优化方向：\n- 首秒加入视觉冲突元素\n- 第 9 秒增加评论引导句\n- 封面图文字从 10 字压缩到 6 字提升识别\n预期改进：CTR +0.3pct，3 秒留存 +2pct" },
      ],
      files: [
        { name: "01_项目目标确认单_v1.0.md", type: "项目文档", size: "36 KB", status: "已确认", note: "记录业务目标、KPI、合规约束、交付验收标准和责任分工。" },
        { name: "02_竞品拆解与素材采样_2026Q2.xlsx", type: "研究资料", size: "142 KB", status: "已归档", note: "包含 18 条竞品结构标注、开场钩子分类和镜头节奏统计。" },
        { name: "03_脚本方案与镜头分解_v2.1.xlsx", type: "脚本与镜头", size: "168 KB", status: "已确认", note: "三条视频的逐镜头规划，含口播、字幕、时长、镜头目标。" },
        { name: "04_成片交付_15s_3条.zip", type: "视频成片", size: "28.7 MB", status: "可下载", note: "含 A/B 版本及横封/竖封两套输出，符合投放规格。" },
        { name: "05_封面图与文案_双版本.zip", type: "投放素材", size: "7.4 MB", status: "可下载", note: "3 张封面图 + 2 套文案，已按渠道规范命名。" },
        { name: "06_复核问题闭环清单_v1.2.md", type: "复核记录", size: "28 KB", status: "已归档", note: "3 项问题的定位截图、修复说明、回归结果和责任人签名。" },
        { name: "07_投放建议与A_B实验计划.docx", type: "投放策略", size: "54 KB", status: "已确认", note: "包含 Day1-3 投放节奏、预算分配、指标阈值和停投规则。" },
        { name: "08_项目复盘与模板更新记录.md", type: "复盘文档", size: "32 KB", status: "已归档", note: "沉淀可复用模板、风险清单和下一轮优化任务。" },
      ],
    };
  }
  if (run?.id === "wf-demo-002") {
    return {
      steps: [
        { title: "1. 条款抽取（结果范例）", result: "合同版本：2026-05-外包合作主协议（32 页）\n结构化字段：67 项（含金额、节点、责任、违约、争议、保密）\n关键条款映射：\n- 付款节点 6 条\n- 验收条款 5 条\n- 违约责任 4 条\n- 争议解决 2 条\n主体识别：甲方 2 个部门、乙方 1 个主体、第三方服务商 1 个\n产出完整度：98%（2 个附件引用待补）" },
        { title: "2. 风险识别（结果范例）", result: "识别风险点 7 项，风险等级分布：高 2 / 中 3 / 低 2\n高风险：\n- 违约金封顶缺失（可能导致责任不封顶）\n- 验收标准表述模糊（争议空间过大）\n中风险：\n- 付款触发条件不完整\n- 交付里程碑时间边界不清\n- 争议解决地约定不明确\n低风险：\n- 保密期限表达不统一\n- 附件编号引用不一致" },
        { title: "3. 讨论结论（结果范例）", result: "讨论轮次：2 轮（法务/业务/风控）\n第一轮：确认风险真实性与业务影响\n第二轮：确认修订优先级与落地成本\n达成一致的 4 条修订：\n1) 增加违约金上限与计算口径\n2) 验收标准量化为 5 条可验证项\n3) 付款条款补齐触发条件与逾期罚则\n4) 固定争议地与管辖法院\n保留待律师确认事项：2 条（跨地域履约责任、不可抗力边界）" },
        { title: "4. 处置计划（结果范例）", result: "执行时限：48 小时\n责任分配：\n- 法务：红线修订（D1 18:00 前）\n- 业务：可执行性确认（D2 10:00 前）\n- 风控：风险闭环复核（D2 16:00 前）\n验收规则：\n- 高风险 2 项必须全部关闭\n- 中低风险关闭率 >= 80%\n- 所有修订项必须有责任人和证据链" },
        { title: "5. 最终输出（结果范例）", result: "交付包包含：\n- 红线版合同（含 26 处修订）\n- 清洁版合同（可对外流转）\n- 律师确认清单（2 条）\n管理结论：\n- 预计争议发生概率下降约 30%\n- 履约责任边界更清晰\n- 付款与验收链路可追溯性显著增强" },
      ],
      files: [
        { name: "01_合同条款结构化清单_v1.xlsx", type: "结构化结果", size: "64 KB", status: "已确认", note: "67 项条款字段及责任主体映射，便于后续追溯。" },
        { name: "02_合同风险点与证据索引_v1.1.xlsx", type: "风险清单", size: "58 KB", status: "已确认", note: "7 个风险点分别对应原文证据、历史案例与规则编号。" },
        { name: "03_多角色讨论纪要_2轮.md", type: "讨论纪要", size: "41 KB", status: "已归档", note: "完整记录法务/业务/风控观点、分歧点和最终决议。" },
        { name: "04_风险分级矩阵与处置计划.docx", type: "处置方案", size: "46 KB", status: "已确认", note: "高/中/低分级与截止时间、责任人、验收标准。" },
        { name: "05_合同修订建议稿_红线版.docx", type: "修订稿", size: "52 KB", status: "可下载", note: "逐条展示建议修改内容，供法务终审直接使用。" },
        { name: "06_律师确认问题清单.md", type: "确认清单", size: "19 KB", status: "已归档", note: "2 条待确认争议点和补充证据要求。" },
      ],
    };
  }
  if (run?.id === "wf-demo-003") {
    return {
      steps: [
        { title: "1. 数据准备（结果范例）", result: "数据源接入：资产负债表、利润表、现金流量表、销售明细、广告投放明细\n样本范围：2026Q1-Q2（按周）\n缺失字段补齐：12 项（以财务系统主口径回填）\n异常值处理：4 处（两处重复记账、两处时间戳错位）\n质量校验：通过率 98.6%，2 项口径差异已统一并留痕" },
        { title: "2. 指标结果（结果范例）", result: "Q2 核心经营指标：\n- 毛利率：31.2%（环比 -1.8pct）\n- 回款周期：47 天（环比 +11 天）\n- 库存周转：36 天（环比 +5 天）\n- 广告回收期：21 天（环比 +4 天）\n- 经营现金净流入：较 Q1 下降 14%\n结论：利润端可控，现金端承压明显" },
        { title: "3. 异常归因（结果范例）", result: "现金流紧张窗口：4 月第 2 周、6 月第 1 周\n直接原因：\n- 回款延迟（重点客户平均延迟 11 天）\n- 广告费用前置（当周投放集中释放）\n- 库存采购节奏未同步调整\n根因判断：资金节奏错配，不是销售规模下滑\n证据链：订单回款流水 + 投放账单 + 采购单据三方一致" },
        { title: "4. 改善动作（结果范例）", result: "动作 A：客户分层催收（预计回款周期 -6 天）\n- S 级客户：专人跟进 + 周频催收\n- A/B 客户：自动化提醒 + 法务预警\n动作 B：投放预算周度释放（预计现金波动 -18%）\n- 从单周集中投放改为 4 周分摊\n动作 C：库存阈值下调 8%（预计释放现金 120 万）\n- 设置安全库存动态阈值并周度更新" },
        { title: "5. 管理决策包（结果范例）", result: "交付件：一页管理摘要 + 6 周跟踪看板 + 动作责任矩阵\n决策项：\n- 立即执行 A/B/C 三项动作\n- 对高风险客户启用回款预警\n- 将现金阈值纳入周会固定议题\n成功标准：\n- 6 周内回款周期回落到 40 天以内\n- 经营现金净流入恢复到 Q1 的 92% 以上" },
      ],
      files: [
        { name: "01_Q2数据质量与口径说明.md", type: "数据文档", size: "27 KB", status: "已归档", note: "列出数据来源、校验结果、缺失补齐规则和口径定义。" },
        { name: "02_经营指标趋势分析_2026Q2.xlsx", type: "指标分析", size: "188 KB", status: "已确认", note: "含 12 个核心指标的周维度趋势和同比环比对照。" },
        { name: "03_现金流异常归因报告_v1.0.md", type: "归因报告", size: "35 KB", status: "已确认", note: "解释两段现金流紧张窗口及其业务成因。" },
        { name: "04_改善方案评估与收益测算.xlsx", type: "方案测算", size: "114 KB", status: "已确认", note: "三项改善动作的成本、收益、风险和落地顺序。" },
        { name: "05_管理层汇报_一页纸.pptx", type: "汇报材料", size: "2.6 MB", status: "可下载", note: "包含问题摘要、决策建议、执行里程碑和责任人。" },
        { name: "06_6周跟踪指标看板.xlsx", type: "跟踪看板", size: "132 KB", status: "可下载", note: "每周更新现金流预警指标并自动标色提醒。" },
      ],
    };
  }
  return {
    steps: [
      { title: "1. 指令解析", content: "解析用户输入、目标角色、执行约束和交付格式，生成任务上下文。" },
      { title: "2. 执行调度", content: "选择合适节点执行任务，记录执行参数、重试次数和耗时。" },
      { title: "3. 结果校验", content: "对输出结果做完整性、格式和风险检查，补充必要说明。" },
      { title: "4. 结果交付", content: "将结果写入执行记录、文件区，并回传给操作面板展示。" },
    ],
    files: [
      { name: "01_指令上下文记录.json", type: "执行上下文", size: "12 KB", status: "已归档", note: "包含输入参数、目标角色、执行配置和追踪 ID。" },
      { name: "02_执行结果与建议.md", type: "执行结果", size: "24 KB", status: "已确认", note: "包含结果摘要、细节输出、风险提示和后续建议。" },
    ],
  };
}

function renderWorkflowRunDetail(run) {
  const detail = $("#workflow-runs-detail");
  if (!detail) return;
  if (!run) {
    detail.removeAttribute("data-workflow-run-id");
    detail.innerHTML = `<div class="empty-state">暂无可展示的执行详情。</div>`;
    return;
  }
  detail.dataset.workflowRunId = run.id;
  const typeLabel = run.type === "workflow" ? "工作流" : run.type === "discussion" ? "讨论" : "指令";
  const detailContent = detailContentForRun(run);
  detail.innerHTML = `
    <h3>${escapeHtml(run.title)}</h3>
    <p class="workflow-run-detail-meta">
      类型：${escapeHtml(typeLabel)} · 行业：${escapeHtml(industryName(run.industry))} · 状态：${escapeHtml(run.status)}<br>
      开始时间：${escapeHtml(run.startedAt)} · 时长约 ${Math.max(1, Math.round(run.durationSeconds / 60 || 1))} 分钟
    </p>
    <div class="workflow-run-detail-body">
      <p>${escapeHtml(run.summary || "本条为演示数据，实际环境中会展示完整对话、讨论与工作流执行过程。")}</p>
    </div>
    <section class="workflow-detail-section">
      <h4>流程内容</h4>
      <div class="workflow-detail-steps">
        ${detailContent.steps.map((step) => `
          <article class="workflow-detail-step-item">
            <strong>${escapeHtml(step.title)}</strong>
            <p>${escapeHtml(step.result || step.content || "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="workflow-detail-section">
      <h4>文件区展示</h4>
      <div class="workflow-detail-files">
        ${detailContent.files.map((file, fileIndex) => `
          <article class="workflow-detail-file-item">
            <div class="workflow-detail-file-main">
              <strong>${escapeHtml(file.name)}</strong>
              <p>${escapeHtml(file.type)} · ${escapeHtml(file.size)} · ${escapeHtml(file.status)}</p>
              <p>${escapeHtml(file.note || "")}</p>
            </div>
            <button class="button small secondary workflow-detail-file-download" type="button" data-download-workflow-file="${fileIndex}" aria-label="下载 ${escapeHtml(file.name)}">下载</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAll() {
  renderIndustrySelect();
  renderKnowledgeIndustrySelect();
  renderSkillsPanel();
  renderOverview();
  renderOverviewCharts();
  renderPlans();
  renderNodes();
  renderWorkflowControls();
  renderTemplates();
  renderWorkflowRuns();
  renderKnowledgeBase();
  renderResults();
  syncAllCustomSelects();
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function formJson(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function selectedOptionText(select) {
  const selected = select.selectedOptions?.[0]
    || Array.from(select.options || []).find((option) => option.value === select.value)
    || select.options?.[0];
  return selected?.textContent?.trim() || "请选择";
}

function syncCustomSelect(select) {
  const wrapper = select?.closest?.(".auto-custom-select");
  if (!wrapper) return;
  const trigger = wrapper.querySelector(".custom-select-trigger");
  const triggerText = trigger?.querySelector("span");
  const menu = wrapper.querySelector(".custom-select-menu");
  if (!trigger || !triggerText || !menu) return;
  triggerText.textContent = selectedOptionText(select);
  const disabled = select.matches(":disabled") || select.disabled;
  trigger.disabled = disabled;
  trigger.setAttribute("aria-disabled", disabled ? "true" : "false");
  trigger.setAttribute("aria-expanded", wrapper.classList.contains("open") ? "true" : "false");
  const options = Array.from(select.options || []);
  menu.innerHTML = options.map((option) => `
    <button class="custom-select-option ${option.value === select.value ? "active" : ""}" type="button" role="option"
      data-select-value="${escapeHtml(option.value)}" aria-selected="${option.value === select.value ? "true" : "false"}"
      ${option.disabled ? "disabled" : ""}>${escapeHtml(option.textContent.trim())}</button>
  `).join("");
}

function enhanceNativeSelect(select) {
  if (!select || select.multiple || select.classList.contains("native-select-hidden") || select.closest(".custom-select")) return;
  const wrapper = document.createElement("div");
  wrapper.className = "custom-select auto-custom-select";
  wrapper.dataset.customizedNativeSelect = "true";
  const trigger = document.createElement("button");
  trigger.className = "custom-select-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  const label = document.createElement("span");
  const icon = document.createElement("i");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "⌄";
  trigger.append(label, icon);
  const menu = document.createElement("div");
  menu.className = "custom-select-menu";
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", select.getAttribute("aria-label") || select.name || "下拉选择");
  select.parentNode.insertBefore(wrapper, select);
  wrapper.append(trigger, menu, select);
  select.classList.add("native-select-hidden");
  select.setAttribute("aria-hidden", "true");
  select.tabIndex = -1;
  syncCustomSelect(select);
}

function syncAllCustomSelects(root = document) {
  $$("select:not(.native-select-hidden)", root).forEach(enhanceNativeSelect);
  $$(".auto-custom-select select", root).forEach(syncCustomSelect);
}

function closeAutoCustomSelects(except = null) {
  $$(".auto-custom-select.open").forEach((wrapper) => {
    if (wrapper === except) return;
    wrapper.classList.remove("open");
    wrapper.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
  });
}

function wireAutoCustomSelects() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".auto-custom-select .custom-select-trigger");
    if (trigger) {
      const wrapper = trigger.closest(".auto-custom-select");
      if (!wrapper || trigger.disabled) return;
      const willOpen = !wrapper.classList.contains("open");
      closeAutoCustomSelects(wrapper);
      wrapper.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      return;
    }

    const option = event.target.closest(".auto-custom-select .custom-select-option");
    if (option) {
      const wrapper = option.closest(".auto-custom-select");
      const select = wrapper?.querySelector("select");
      if (!wrapper || !select || option.disabled) return;
      select.value = option.dataset.selectValue ?? "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      syncCustomSelect(select);
      closeAutoCustomSelects();
      return;
    }

    if (!event.target.closest(".auto-custom-select")) closeAutoCustomSelects();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAutoCustomSelects();
  });

  document.addEventListener("reset", (event) => {
    window.setTimeout(() => syncAllCustomSelects(event.target), 0);
  });
}

const moduleRoutes = [
  { id: "overview", path: "/overview", title: "仪表盘" },
  { id: "workflow", path: "/workflow", title: "工作模版" },
  { id: "skills", path: "/skills", title: "行业技能" },
  { id: "projects", path: "/projects", title: "我的项目" },
  { id: "knowledge", path: "/knowledge", title: "知识库" },
  { id: "config", path: "/config", title: "节点配置" },
  { id: "subscription", path: "/subscription", title: "订阅服务" },
];
const moduleIds = moduleRoutes.map((route) => route.id);
const moduleRouteMap = new Map(moduleRoutes.map((route) => [route.id, route]));
const moduleAliases = {
  nodes: "overview",
  templates: "workflow",
  "workflow-runs": "projects",
};

function normalizeModuleId(sectionId) {
  return moduleIds.includes(sectionId) ? sectionId : (moduleAliases[sectionId] || "overview");
}

function moduleIdFromLocation(location = window.location) {
  const hashRoute = location.hash.replace(/^#\/?/, "").split(/[/?]/)[0];
  if (hashRoute) return normalizeModuleId(hashRoute);
  const pathRoute = decodeURIComponent(location.pathname || "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")[0];
  return normalizeModuleId(pathRoute || "overview");
}

function routePathForModule(moduleId) {
  return moduleRouteMap.get(normalizeModuleId(moduleId))?.path || "/overview";
}

function syncBrowserRoute(moduleId, { replace = false } = {}) {
  const path = routePathForModule(moduleId);
  const nextUrl = `${path}${window.location.search || ""}`;
  const currentUrl = `${window.location.pathname}${window.location.search || ""}`;
  if (currentUrl === nextUrl && !window.location.hash) return;
  const method = replace ? "replaceState" : "pushState";
  history[method]({ moduleId }, "", nextUrl);
}

function showWorkflowTab(name) {
  $$(".segment[data-workflow-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.workflowTab === name);
  });
  $$("[data-workflow-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.workflowPanel === name);
  });
  if (name === "collaboration") {
    updateCollaborationDockGate();
  }
  if (name === "discussion") {
    renderDiscussionNodePicker();
  }
}

function switchModule(sectionId, options = {}) {
  const moduleId = normalizeModuleId(sectionId);
  const route = moduleRouteMap.get(moduleId);
  state.activeModule = moduleId;
  $$(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === moduleId);
    if (item.dataset.section === moduleId) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
  $$("[data-module-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.modulePanel === moduleId);
  });
  document.body.dataset.activeModule = moduleId;
  document.title = route ? `${route.title} · ClashCube OS` : "ClashCube OS";
  const workspace = $(".workspace");
  if (workspace && options.scroll !== false) {
    workspace.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
  }
  if (options.syncRoute !== false) {
    syncBrowserRoute(moduleId, { replace: Boolean(options.replace) });
  }
  if (moduleId === "config") {
    updateConfigModelApiKeyVisibility();
  }
}

function jumpTo(sectionId) {
  switchModule(sectionId);
}

function openConfirm({ title, body, payload, onConfirm, confirmText = "确认执行" }) {
  state.pendingAction = onConfirm || null;
  const confirmTitle = $("#confirm-title");
  if (confirmTitle) confirmTitle.textContent = title;
  const confirmBody = $("#confirm-body");
  if (confirmBody) confirmBody.textContent = body;
  const confirmPayload = $("#confirm-payload");
  if (confirmPayload) confirmPayload.textContent = JSON.stringify(payload, null, 2);
  const submitBtn = $("#confirm-submit");
  if (submitBtn) {
    submitBtn.hidden = !onConfirm;
    submitBtn.textContent = confirmText;
  }
  const confirmModal = $("#confirm-modal");
  if (confirmModal) {
    confirmModal.classList.add("open");
    confirmModal.setAttribute("aria-hidden", "false");
  }
}

function closeConfirm() {
  state.pendingAction = null;
  const confirmModal = $("#confirm-modal");
  if (confirmModal) {
    confirmModal.classList.remove("open");
    confirmModal.setAttribute("aria-hidden", "true");
  }
}

function closeTopLayer() {
  if ($("#confirm-modal")?.classList.contains("open")) {
    closeConfirm();
    return true;
  }
  if ($("#template-detail-modal")?.classList.contains("open")) {
    closeTemplateDetail();
    return true;
  }
  if ($("#create-workflow-modal")?.classList.contains("open")) {
    closeCreateWorkflowModal();
    return true;
  }
  return false;
}

function openTemplateDetail(template) {
  const modal = $("#template-detail-modal");
  if (!modal) return;
  const detailTitle = $("#template-detail-title");
  if (detailTitle) detailTitle.textContent = template.title || "模板详情";
  const iconSlot = $("#template-detail-icon-slot");
  if (iconSlot) {
    iconSlot.innerHTML = renderTemplateCardIconBlockHtml(template);
    iconSlot.removeAttribute("aria-hidden");
  }
  const detailDesc = $("#template-detail-desc");
  if (detailDesc) detailDesc.textContent = template.description || "该模板包含标准执行步骤。";
  const steps = buildTemplateSteps(template);
  state.templateDetailSteps = steps.map((step) => ({ ...step }));
  const stepsEl = $("#template-detail-steps");
  if (stepsEl) {
    stepsEl.innerHTML = steps.map((step, stepIndex) => `
    <article class="template-step-card">
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.description)}</p>
      ${step.attachmentName && step.attachmentDataUrl ? `<p class="template-step-attachment"><button type="button" class="button small secondary template-step-file-download" data-template-step-file="${stepIndex}">下载附件 · ${escapeHtml(step.attachmentName)}</button></p>` : ""}
    </article>
  `).join("");
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeTemplateDetail() {
  state.templateDetailSteps = [];
  const modal = $("#template-detail-modal");
  if (!modal) return;
  const iconSlot = $("#template-detail-icon-slot");
  if (iconSlot) {
    iconSlot.innerHTML = "";
    iconSlot.setAttribute("aria-hidden", "true");
  }
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function renderCreateWorkflowIndustryOptions() {
  const select = $("#create-workflow-industry");
  if (!select) return;
  const enabledIndustries = new Set(activePlan().industries);
  const availableOptions = industries
    .filter(([industryKey]) => enabledIndustries.has(industryKey))
    .map(([industryKey, label]) => ({ value: industryKey, label }));
  select.innerHTML = availableOptions.length
    ? availableOptions.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("")
    : `<option value="">当前订阅暂无可用行业</option>`;
  if (state.createWorkflowDraft.industry && enabledIndustries.has(state.createWorkflowDraft.industry)) {
    select.value = state.createWorkflowDraft.industry;
  } else {
    select.value = availableOptions[0]?.value || "";
    state.createWorkflowDraft.industry = select.value;
  }
  const triggerLabel = $("#create-industry-select-trigger span");
  if (triggerLabel) triggerLabel.textContent = industryName(select.value);
  const createIndustrySelectContainer = $("#create-industry-custom-select");
  createIndustrySelectContainer?.classList.toggle("locked", Boolean(state.createWorkflowDraft.editingTemplateId));
  const triggerButton = $("#create-industry-select-trigger");
  if (triggerButton) {
    triggerButton.disabled = Boolean(state.createWorkflowDraft.editingTemplateId);
    triggerButton.setAttribute("aria-disabled", state.createWorkflowDraft.editingTemplateId ? "true" : "false");
  }
  const menu = $("#create-industry-select-menu");
  if (menu) {
    const menuOptions = availableOptions.length
      ? availableOptions.map((item) => ({ ...item, disabled: false }))
      : [{ value: "", label: "当前订阅暂无可用行业", disabled: true }];
    menu.innerHTML = menuOptions.map((item) => (
      `<button class="custom-select-option ${item.value === select.value ? "active" : ""}" type="button" data-create-industry-value="${escapeHtml(item.value)}" ${item.disabled ? "disabled" : ""}>${escapeHtml(item.label)}</button>`
    )).join("");
  }
}

function renderCreateWorkflowSteps() {
  const list = $("#create-steps-list");
  if (!list) return;
  if (!state.createWorkflowDraft.steps.length) {
    list.innerHTML = `<div class="empty-state">请点击“增加流程”添加步骤。</div>`;
    return;
  }
  list.innerHTML = state.createWorkflowDraft.steps.map((step, index) => {
    const fileName = String(step.attachmentName || "").trim();
    const hasFile = Boolean(fileName && step.attachmentDataUrl);
    const labelTitle = fileName ? escapeHtml(fileName) : "";
    const labelShort = fileName.length > 14 ? `${escapeHtml(fileName.slice(0, 12))}…` : labelTitle;
    return `
    <div class="create-step-row" data-create-step-index="${index}">
      <input data-create-step-field="title" value="${escapeHtml(step.title || "")}" placeholder="流程名称">
      <input data-create-step-field="description" value="${escapeHtml(step.description || "")}" placeholder="流程描述">
      <div class="create-step-actions">
        <input type="file" class="create-step-file-input" data-create-step-file-input="${index}" accept="${STEP_ATTACHMENT_ACCEPT}" aria-label="上传步骤附件">
        <button class="button small secondary" type="button" data-upload-create-step="${index}">上传文件</button>
        ${hasFile ? `<span class="create-step-file-name" title="${labelTitle}">${labelShort}</span><button class="button small ghost create-step-file-clear" type="button" data-clear-create-step-file="${index}" aria-label="移除附件">×</button>` : ""}
        <button class="button small ghost" type="button" data-remove-create-step="${index}">删除</button>
      </div>
    </div>
  `;
  }).join("");
}

function createDefaultWorkflowDraft(industryKey = state.industry) {
  const plan = activePlan();
  const fallbackIndustry = plan.industries[0] || industries[0]?.[0] || "";
  const normalizedIndustry = industryKey && industryKey !== "all" && plan.industries.includes(industryKey)
    ? industryKey
    : fallbackIndustry;
  return {
    editingTemplateId: "",
    industry: normalizedIndustry,
    title: "",
    description: "",
    steps: [],
    iconDataUrl: "",
  };
}

function syncCreateWorkflowIconUi() {
  const img = $("#create-workflow-icon-img");
  const placeholder = $("#create-workflow-icon-placeholder");
  const preview = $("#create-workflow-icon-preview");
  if (!img || !placeholder || !preview) return;
  const url = state.createWorkflowDraft.iconDataUrl;
  if (url) {
    img.src = url;
    img.hidden = false;
    placeholder.innerHTML = "";
    placeholder.hidden = true;
  } else {
    img.removeAttribute("src");
    img.hidden = true;
    placeholder.hidden = false;
    placeholder.innerHTML = TEMPLATE_ICON_LOGO_MARKUP;
  }
}

function openCreateWorkflowModal() {
  const isEditing = Boolean(state.createWorkflowDraft.editingTemplateId);
  if (!isEditing) {
    const draftIsEmpty = !state.createWorkflowDraft.title
      && !state.createWorkflowDraft.description
      && (!state.createWorkflowDraft.steps?.length
        || state.createWorkflowDraft.steps.every((step) => !step.title && !step.description && !step.attachmentName));
    if (draftIsEmpty) {
      state.createWorkflowDraft = createDefaultWorkflowDraft(state.industry);
    }
  }
  renderCreateWorkflowIndustryOptions();
  renderCreateWorkflowSteps();
  const form = $("#create-workflow-form");
  if (form) {
    const titleInput = form.elements.namedItem("title");
    const descriptionInput = form.elements.namedItem("description");
    if (titleInput) titleInput.value = state.createWorkflowDraft.title || "";
    if (descriptionInput) descriptionInput.value = state.createWorkflowDraft.description || "";
  }
  const modalTitle = $("#create-workflow-title");
  if (modalTitle) {
    modalTitle.textContent = state.createWorkflowDraft.editingTemplateId ? "编辑工作流模版" : "新建工作流模版";
  }
  const iconFile = $("#create-workflow-icon-file");
  if (iconFile) iconFile.value = "";
  syncCreateWorkflowIconUi();
  $("#create-workflow-modal")?.classList.add("open");
  $("#create-workflow-modal")?.setAttribute("aria-hidden", "false");
}

function closeCreateWorkflowModal() {
  $("#create-workflow-modal")?.classList.remove("open");
  $("#create-workflow-modal")?.setAttribute("aria-hidden", "true");
  const iconFile = $("#create-workflow-icon-file");
  if (iconFile) iconFile.value = "";
  state.createWorkflowDraft = createDefaultWorkflowDraft();
}

function applyTemplate(templateId) {
  const template = findTemplate(templateId);
  const form = $("#collaboration-form");
  if (!template || !form) return;
  showWorkflowTab("collaboration");
  const industrySelect = form.elements.namedItem("collaboration_industry");
  if (industrySelect) {
    const plan = activePlan();
    let ind = template.industry;
    if (!ind || !plan.industries.includes(ind)) {
      ind = plan.industries[0] || industries.find(([key]) => plan.industries.includes(key))?.[0];
    }
    if (!ind) {
      toast("当前订阅下没有可用行业，无法套用模版。", "error");
      return;
    }
    industrySelect.value = ind;
    state.industry = ind;
    state.workflowDockIndustry = ind;
  }
  setCollaborationTemplateSourceUI(template.source === "mine" ? "mine" : "platform");
  form.execution_style.value = template.executionStyle || "fast";
  form.project_name.value = template.projectName || "";
  form.objective.value = template.objective || "";
  updateCollaborationDockGate();
  refreshCollaborationTemplateSelect(template.id);
  jumpTo("workflow");
  toast(`已套用模板：${template.title}`);
}

function editTemplate(templateId) {
  const template = findTemplate(templateId);
  if (!template) return;
  state.createWorkflowDraft = {
    editingTemplateId: template.id,
    industry: template.industry || "all",
    title: template.title || "",
    description: template.description || "",
    iconDataUrl: template.iconDataUrl || "",
    steps: buildTemplateSteps(template).map((step) => ({
      title: step.title.replace(/^\d+\.\s*/, ""),
      description: step.description,
      attachmentName: step.attachmentName || "",
      attachmentDataUrl: step.attachmentDataUrl || "",
    })),
  };
  openCreateWorkflowModal();
  toast(`正在编辑：${template.title}`);
}

async function submitWorkflow(payload) {
  let result = null;
  let remote = true;
  try {
    result = await api("/workflows/run", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    remote = false;
    result = { status: "local-demo", error: error.message };
  }
  const runTemplateTitle = payload.workflow_template
    ? templatesForIndustry(payload.industry).find((item) => item.id === payload.workflow_template)?.title
    : "";
  state.workflowRuns.unshift({
    id: result?.workflow_id || uid("run"),
    type: "workflow",
    title: payload.project_name,
    industry: payload.industry || state.industry || "all",
    status: remote ? (result?.status || "running") : "local-demo",
    startedAt: timestamp().slice(0, 16).replace("T", " "),
    durationSeconds: 0,
    fromTemplate: runTemplateTitle || (payload.workflow_template ? "已套用模版" : ""),
    summary: remote ? "控制器已接收工作流，执行中。" : `控制器不可达：${result.error}`,
    raw: { payload, result },
  });
  consumeQuota(6);
  addResult(
    "协同区",
    `${payload.project_name} 已开始`,
    remote ? "控制器已接收工作流，执行记录已更新。" : `控制器不可达，已生成本地演示执行：${result.error}`,
    { payload, result },
  );
  renderWorkflowRuns();
  toast(remote ? "工作流已开始执行。" : "已生成本地演示工作流。", remote ? "info" : "error");
  if (remote) await loadData();
}

function localCommandSummary(payload) {
  const message = payload.payload?.message || payload.payload?.task || payload.payload?.prompt || "";
  const styleKey = payload.payload?.execution_style;
  return [
    `路由角色：${payload.target_value}`,
    `执行风格：${executionStyleLabel(styleKey) || styleKey || payload.command_type}`,
    `行业：${industryName(payload.payload?.industry)}`,
    `本地结果：已生成任务回执，建议进入执行记录或模版区继续沉淀。`,
    `摘要：${message.slice(0, 120) || "未提供消息"}`,
  ].join("\n");
}

function localDiscussionSummary(payload) {
  const participants = payload.participant_assignments?.length
    ? payload.participant_assignments.map((item) => `${item.node_title || item.node_id}（${item.role}）`)
    : payload.participant_roles?.length
      ? payload.participant_roles
      : payload.participant_node_ids;
  return [
    `参与节点：${participants.join("、")}`,
    `讨论次数：${payload.rounds}`,
    "本地结论：已建立讨论任务，建议由复核节点汇总风险、由执行节点补齐可执行动作。",
    `话题：${payload.topic.slice(0, 160)}`,
  ].join("\n");
}

function seedDemoWorkflowRuns() {
  if (state.workflowRuns && state.workflowRuns.length) return;
  state.workflowRuns = [
    {
      id: "wf-demo-001",
      type: "workflow",
      title: "短视频投放标准执行流",
      industry: "media",
      status: "running",
      startedAt: "2026-05-06 00:30",
      durationSeconds: 320,
      fromTemplate: "短视频 · 标准执行流",
      summary: "正在生成素材版本 v2，并等待复核节点确认。本条为演示数据，实际环境会展示完整工作流步骤与输出摘要。",
    },
    {
      id: "wf-demo-002",
      type: "discussion",
      title: "合同风险条款讨论",
      industry: "legal",
      status: "completed",
      startedAt: "2026-05-05 21:12",
      durationSeconds: 520,
      fromTemplate: "法律合同 · 风险复核流",
      summary: "已输出高风险条款清单与修改建议，并标注需律师进一步确认的要点。本条为演示数据。",
    },
    {
      id: "wf-demo-003",
      type: "dialogue",
      title: "Q2 经营分析与现金流预警对话",
      industry: "finance",
      status: "completed",
      startedAt: "2026-05-05 19:40",
      durationSeconds: 410,
      fromTemplate: "",
      summary: "基于 Q2 财务数据，识别出两处现金流紧张区间，并给出优先级调整建议。本条为演示数据。",
    },
  ];
}

function findTemplate(templateId) {
  return templatesForIndustry().find((item) => item.id === templateId);
}

function saveCurrentTemplate() {
  const form = $("#collaboration-form");
  if (!form) return;
  const values = formJson(form);
  const objective = values.objective?.trim();
  if (!objective) {
    toast("请先填写完成目标，再保存模板。", "error");
    return;
  }
  const industryKey = values.collaboration_industry || state.industry;
  const template = {
    id: uid(`${industryKey}-custom-template`),
    industry: industryKey,
    source: "mine",
    title: values.project_name?.trim() || `我的${industryName(industryKey)}模板`,
    description: `执行风格：${values.execution_style || "fast"}。`,
    projectName: values.project_name?.trim() || `${industryName(industryKey)}自定义项目`,
    objective,
    executionStyle: values.execution_style || "fast",
  };
  state.localTemplates.unshift(template);
  state.templateFilter = "mine";
  renderWorkflowControls();
  renderTemplates();
  addResult("模板", `${template.title} 已保存`, "模板已加入“我的模板”，后续可以套用、查看或删除。", template);
  jumpTo("workflow");
  toast("已保存为我的模板。");
}

function switchPlan(planId) {
  const plan = subscriptionPlans.find((item) => item.id === planId);
  if (!plan) return;
  state.activePlan = plan.id;
  if (state.industry !== "all" && !plan.industries.includes(state.industry)) {
    state.industry = "all";
  }
  if (state.workflowDockIndustry && !plan.industries.includes(state.workflowDockIndustry)) {
    state.workflowDockIndustry = "";
  }
  renderAll();
  addResult("订阅", `已切换到 ${plan.name}`, `开放行业 ${plan.industries.length} 个，Token ${plan.used} / ${plan.quota}。`, plan);
  toast(`已切换到 ${plan.name} 方案。`);
}

function wireForms() {
  $("#dialogue-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const submittedForm = event.currentTarget;
    const values = formJson(submittedForm);
    const message = values.message?.trim();
    if (!message) {
      toast("请先输入指令。", "error");
      return;
    }
    const targetRole = state.nodes[0]?.role || "assistant";
    const executionStyle = values.execution_style || "fast";
    const payload = {
      target_type: "role",
      target_value: targetRole,
      command_type: "run_task",
      issued_by: "saas-console-user",
      payload: {
        industry: state.industry,
        message,
        task: message,
        execution_style: executionStyle,
      },
    };
    const styleLabel = executionStyleLabel(executionStyle);
    openConfirm({
      title: "发送指令",
      body: "将把指令提交给控制器进行处理。",
      payload,
      onConfirm: async () => {
        let result = null;
        let remote = true;
        try {
          result = await api("/commands", { method: "POST", body: JSON.stringify(payload) });
        } catch (error) {
          remote = false;
          result = { status: "local-demo", message: localCommandSummary(payload), error: error.message };
        }
        consumeQuota(1);
        state.workflowRuns.unshift({
          id: result?.command_id || uid("cmd"),
          type: "dialogue",
          title: `指令 · ${styleLabel}`,
          industry: state.industry,
          status: remote ? (result?.status || "completed") : "local-demo",
          startedAt: timestamp().slice(0, 16).replace("T", " "),
          durationSeconds: 0,
          fromTemplate: "",
          summary: remote ? "指令已发送，等待节点反馈。" : result.message,
          raw: { payload, result },
        });
        addResult(
          "对话区",
          `指令 · ${styleLabel}`,
          remote ? "控制器已接收指令，结果可在原节点任务中继续追踪。" : result.message,
          { payload, result },
        );
        renderWorkflowRuns();
        submittedForm.reset();
        toast(remote ? "指令已发送。" : "已生成本地对话结果。", remote ? "info" : "error");
      },
    });
  });

  $("#collaboration-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formJson(form);
    const objective = values.objective?.trim();
    if (!objective) {
      toast("请先输入完成目标。", "error");
      return;
    }
    const industryKey = String(values.collaboration_industry ?? "").trim();
    if (!industryKey) {
      toast("请先选择行业。", "error");
      return;
    }
    const plan = activePlan();
    if (!plan.industries.includes(industryKey)) {
      toast("当前订阅不可使用该行业。", "error");
      return;
    }
    const templateSource = (values.template_source || "platform") === "mine" ? "mine" : "platform";
    const sourceLabel = templateSource === "mine" ? "个人模版" : "平台模版";
    const dockList = collaborationTemplatesForDock(industryKey, templateSource);
    const workflow_template = String(values.workflow_template || "").trim();
    const selectedTemplate = workflow_template
      ? dockList.find((item) => item.id === workflow_template)
      : null;
    if (dockList.length && !workflow_template) {
      toast("请选择模版。", "error");
      return;
    }
    if (workflow_template && !selectedTemplate) {
      toast("所选模版与当前行业或模版类型不一致，请重新选择。", "error");
      return;
    }
    const payload = {
      industry: industryKey,
      workflow_key: "default",
      execution_style: values.execution_style || "fast",
      project_name: values.project_name?.trim() || `${industryName(industryKey)}项目`,
      objective,
      workflow_template,
      timeout_seconds: 180,
      issued_by: "saas-console-user",
      style_bible: [
        `执行风格：${executionStyleLabel(values.execution_style)}`,
        `模版类型：${sourceLabel}`,
        selectedTemplate ? `选用模版：${selectedTemplate.title}` : "选用模版：无（该类型下暂无可选模版）",
      ].join("\n"),
    };
    openConfirm({
      title: "发送工作流",
      body: "将按所选行业、模版类型、具体模版与执行风格发送工作流。",
      payload,
      onConfirm: async () => {
        state.industry = industryKey;
        state.workflowDockIndustry = industryKey;
        await submitWorkflow(payload);
      },
    });
  });

  $("#discussion-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formJson(form);
    const selected = Array.from(form.querySelectorAll('input[name="participant_node_ids"]:checked')).map((input) => input.value);
    const assignments = selected.map((nodeId) => {
      const node = state.nodes.find((item) => item.node_id === nodeId);
      const rawRole = values[`participant_role_${nodeId}`];
      const role = String(Array.isArray(rawRole) ? rawRole[0] : rawRole || "").trim();
      return {
        node_id: nodeId,
        node_title: node ? overviewNodeCardTitle(node) : nodeId,
        role,
      };
    });
    if (!values.topic?.trim() || !selected.length) {
      toast("请填写讨论话题并选择参与节点。", "error");
      return;
    }
    if (assignments.some((item) => !item.role)) {
      toast("请为每个已选节点填写职业描述。", "error");
      return;
    }
    const payload = {
      topic: values.topic.trim(),
      participant_node_ids: selected,
      participant_roles: assignments.map((item) => item.role),
      participant_assignments: assignments,
      rounds: Number(values.rounds || 2),
    };
    openConfirm({
      title: "发起讨论",
      body: "将按所选节点、对应职业描述与讨论次数发起多节点讨论。",
      payload,
      onConfirm: async () => {
        let result = null;
        let remote = true;
        try {
          result = await api("/discussions", { method: "POST", body: JSON.stringify(payload) });
        } catch (error) {
          remote = false;
          result = { status: "local-demo", summary: localDiscussionSummary(payload), error: error.message };
        }
        consumeQuota(2);
        state.workflowRuns.unshift({
          id: result?.discussion_id || uid("discussion"),
          type: "discussion",
          title: `多节点讨论 · ${payload.rounds} 次`,
          industry: state.industry,
          status: remote ? (result?.status || "completed") : "local-demo",
          startedAt: timestamp().slice(0, 16).replace("T", " "),
          durationSeconds: 0,
          fromTemplate: "",
          summary: remote ? "讨论已创建，等待节点观点回传。" : result.summary,
          raw: { payload, result },
        });
        addResult(
          "讨论区",
          `多节点讨论 · ${payload.rounds} 次`,
          remote ? "控制器已创建讨论，参与节点会按讨论次数生成观点。" : result.summary,
          { payload, result },
        );
        renderWorkflowRuns();
        form.reset();
        toast(remote ? "讨论已创建。" : "已生成本地讨论结果。", remote ? "info" : "error");
      },
    });
  });

  $("#config-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const submittedForm = event.currentTarget;
    const values = formJson(submittedForm);
    if (!values.node_name?.trim() || !values.machine_ip?.trim() || !values.username?.trim() || !values.password?.trim() || !values.ai_model?.trim()) {
      toast("请完整填写节点名称、机器 IP、用户名、密码和 AI 模型。", "error");
      return;
    }
    if (!isPlatformAiModelValue(values.ai_model) && !String(values.model_api_key || "").trim()) {
      toast("当前模型需填写 API Key。", "error");
      return;
    }
    const preview = {
      node_name: values.node_name,
      machine_ip: values.machine_ip,
      username: values.username,
      password: "******",
      ai_model: values.ai_model || "未填写",
      ...(isPlatformAiModelValue(values.ai_model) ? {} : { api_key: "******" }),
    };
    openConfirm({
      title: "节点配置",
      body: "密码与 API Key 不会在本页持久化展示。确认后将把节点加入当前工作台。",
      payload: preview,
      onConfirm: async () => {
        const labels = ["configured"];
        if (!isPlatformAiModelValue(values.ai_model)) labels.push("custom-model-api");
        const node = normalizeNode({
          node_id: `local-${Date.now()}`,
          node_name: values.node_name,
          role: "assistant",
          studio_role: "AI 节点",
          machine_ip: values.machine_ip.trim(),
          http_endpoint: `http://${values.machine_ip}`,
          ai_model: values.ai_model || "AI model",
          seconds_since_heartbeat: 0,
          status: "online",
          labels,
        });
        state.nodes.unshift(node);
        submittedForm.reset();
        updateConfigModelApiKeyVisibility();
        renderAll();
        jumpTo("overview");
        addResult("节点", `${values.node_name} 已加入`, "已保存到当前工作台，可在总览节点卡片中暂停、启动或指挥。", preview);
        toast("节点已加入当前工作台。");
      },
    });
  });

  $("#config-ai-model")?.addEventListener("change", updateConfigModelApiKeyVisibility);
  updateConfigModelApiKeyVisibility();

  $("#knowledge-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formJson(form);
    const attachmentInput = form.elements.namedItem("attachment");
    const attachmentFile = attachmentInput instanceof HTMLInputElement ? attachmentInput.files?.[0] : null;
    const title = String(values.title || "").trim();
    const summary = String(values.summary || "").trim();
    const content = String(values.content || "").trim();
    if (!title || !summary || !content) {
      toast("请填写知识资料的标题、摘要和正文。", "error");
      return;
    }
    const item = {
      id: uid("kb"),
      title,
      category: "workflow",
      industry: String(values.industry || "通用").trim() || "通用",
      source: attachmentFile?.name ? "上传文件" : "手动录入",
      updatedAt: timestamp(),
      tags: String(values.tags || "")
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8),
      summary,
      content,
    };
    if (attachmentFile?.name) item.attachmentName = attachmentFile.name;
    state.knowledgeItems.unshift(item);
    state.activeKnowledgeId = item.id;
    form.reset();
    renderKnowledgeIndustrySelect();
    syncKnowledgeAttachmentUi();
    renderKnowledgeBase();
    addResult("知识库", `${item.title} 已保存`, "知识资料已加入当前工作台，可用于后续指令和工作流参考。", item);
    toast("知识资料已保存。");
  });
}

function wireUi() {
  wireAutoCustomSelects();
  const industrySelect = $("#industry-select");
  const skillsIndustrySelect = $("#skills-industry-select");
  const industryTrigger = $("#industry-select-trigger");
  const industryMenu = $("#industry-select-menu");
  const skillsIndustryTrigger = $("#skills-industry-select-trigger");
  const skillsIndustryMenu = $("#skills-industry-select-menu");
  const createIndustrySelect = $("#create-workflow-industry");
  const createIndustryTrigger = $("#create-industry-select-trigger");
  const createIndustryMenu = $("#create-industry-select-menu");
  if (industrySelect) {
    industrySelect.addEventListener("change", async (event) => {
      state.industry = event.target.value;
      await loadData();
    });
  }
  if (skillsIndustrySelect) {
    skillsIndustrySelect.addEventListener("change", async (event) => {
      state.industry = event.target.value;
      await loadData();
    });
  }
  if (skillsIndustryTrigger) {
    skillsIndustryTrigger.addEventListener("click", () => {
      const container = $("#skills-industry-custom-select");
      if (!container) return;
      const isOpen = container.classList.toggle("open");
      skillsIndustryTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
  if (industryTrigger) {
    industryTrigger.addEventListener("click", () => {
      const container = $("#industry-custom-select");
      if (!container) return;
      const isOpen = container.classList.toggle("open");
      industryTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
  if (industryMenu) {
    industryMenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-industry-value]");
      if (!option || option.disabled) return;
      const value = option.dataset.industryValue;
      const select = $("#industry-select");
      if (!value || !select) return;
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      $("#industry-custom-select")?.classList.remove("open");
      $("#industry-select-trigger")?.setAttribute("aria-expanded", "false");
    });
  }
  if (skillsIndustryMenu) {
    skillsIndustryMenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-skills-industry-value]");
      if (!option || option.disabled) return;
      const value = option.dataset.skillsIndustryValue;
      const select = $("#skills-industry-select");
      if (!value || !select) return;
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      $("#skills-industry-custom-select")?.classList.remove("open");
      $("#skills-industry-select-trigger")?.setAttribute("aria-expanded", "false");
    });
  }
  if (createIndustryTrigger) {
    createIndustryTrigger.addEventListener("click", () => {
      const container = $("#create-industry-custom-select");
      if (!container) return;
      const isOpen = container.classList.toggle("open");
      createIndustryTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
  if (createIndustryMenu) {
    createIndustryMenu.addEventListener("click", (event) => {
      if (state.createWorkflowDraft.editingTemplateId) return;
      const option = event.target.closest("[data-create-industry-value]");
      if (!option) return;
      const value = option.dataset.createIndustryValue;
      if (!value || !createIndustrySelect) return;
      createIndustrySelect.value = value;
      state.createWorkflowDraft.industry = value;
      renderCreateWorkflowIndustryOptions();
      $("#create-industry-custom-select")?.classList.remove("open");
      $("#create-industry-select-trigger")?.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", (event) => {
    const container = $("#industry-custom-select");
    if (!container || container.contains(event.target)) return;
    container.classList.remove("open");
    $("#industry-select-trigger")?.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    const container = $("#create-industry-custom-select");
    if (!container || container.contains(event.target)) return;
    container.classList.remove("open");
    $("#create-industry-select-trigger")?.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    const container = $("#skills-industry-custom-select");
    if (!container || container.contains(event.target)) return;
    container.classList.remove("open");
    $("#skills-industry-select-trigger")?.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (closeTopLayer()) {
      event.preventDefault();
      return;
    }
    $("#industry-custom-select")?.classList.remove("open");
    $("#industry-select-trigger")?.setAttribute("aria-expanded", "false");
    $("#create-industry-custom-select")?.classList.remove("open");
    $("#create-industry-select-trigger")?.setAttribute("aria-expanded", "false");
    $("#skills-industry-custom-select")?.classList.remove("open");
    $("#skills-industry-select-trigger")?.setAttribute("aria-expanded", "false");
  });
  $("#node-search")?.addEventListener("input", () => {
    renderNodes();
    renderDiscussionNodePicker();
  });
  $("#knowledge-search")?.addEventListener("input", renderKnowledgeBase);
  $("#knowledge-attachment-upload-btn")?.addEventListener("click", () => {
    $("#knowledge-attachment-input")?.click();
  });
  $("#knowledge-attachment-input")?.addEventListener("change", syncKnowledgeAttachmentUi);
  $("#knowledge-attachment-clear-btn")?.addEventListener("click", () => {
    const input = $("#knowledge-attachment-input");
    if (input instanceof HTMLInputElement) input.value = "";
    syncKnowledgeAttachmentUi();
  });
  $("#knowledge-industry-filter")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-knowledge-industry]");
    if (!button) return;
    state.knowledgeIndustryFilter = button.dataset.knowledgeIndustry || "all";
    renderKnowledgeBase();
  });
  $("#knowledge-list")?.addEventListener("click", (event) => {
    const row = event.target.closest("[data-knowledge-id]");
    if (!row) return;
    selectKnowledgeItem(row.dataset.knowledgeId);
  });
  $("#knowledge-list")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("[data-knowledge-id]");
    if (!row) return;
    event.preventDefault();
    selectKnowledgeItem(row.dataset.knowledgeId);
  });
  syncKnowledgeAttachmentUi();

  $("#save-template-button")?.addEventListener("click", saveCurrentTemplate);

  $("#collaboration-industry-select")?.addEventListener("change", async (event) => {
    const v = String(event.target.value ?? "").trim();
    state.workflowDockIndustry = v;
    if (!v) {
      updateCollaborationDockGate();
      return;
    }
    state.industry = v;
    await loadData();
  });
  $$("[data-collab-template-source]").forEach((button) => {
    button.addEventListener("click", () => {
      setCollaborationTemplateSourceUI(button.dataset.collabTemplateSource || "platform");
      refreshCollaborationTemplateSelect();
    });
  });
  const clearResultsButton = $("#clear-results");
  if (clearResultsButton) {
    clearResultsButton.addEventListener("click", () => {
      state.results = [];
      renderResults();
    });
  }

  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => jumpTo(button.dataset.section));
  });
  $$("[data-section-jump]").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (event.currentTarget instanceof HTMLAnchorElement) event.preventDefault();
      jumpTo(event.currentTarget.dataset.sectionJump);
    });
  });
  $$("[data-dock-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      showWorkflowTab(button.dataset.dockTab);
      jumpTo("workflow");
    });
  });
  $$(".segment[data-workflow-tab]").forEach((button) => {
    button.addEventListener("click", () => showWorkflowTab(button.dataset.workflowTab));
  });
  $$(".segment[data-template-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.templateFilter = button.dataset.templateFilter;
      $$(".segment[data-template-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderTemplates();
    });
  });
  $(".workspace")?.addEventListener("scroll", maybeLoadMorePlatformTemplates);
  $("#create-workflow-button")?.addEventListener("click", () => {
    state.createWorkflowDraft = createDefaultWorkflowDraft(state.industry);
    openCreateWorkflowModal();
  });
  $("#add-create-step")?.addEventListener("click", () => {
    state.createWorkflowDraft.steps.push({
      title: "",
      description: "",
      attachmentName: "",
      attachmentDataUrl: "",
    });
    renderCreateWorkflowSteps();
  });
  $("#create-steps-list")?.addEventListener("input", (event) => {
    const row = event.target.closest("[data-create-step-index]");
    const field = event.target.dataset.createStepField;
    if (!row || !field) return;
    const index = Number(row.dataset.createStepIndex);
    if (Number.isNaN(index) || !state.createWorkflowDraft.steps[index]) return;
    state.createWorkflowDraft.steps[index][field] = event.target.value;
  });
  $("#create-steps-list")?.addEventListener("click", (event) => {
    const uploadBtn = event.target.closest("[data-upload-create-step]");
    if (uploadBtn) {
      const row = uploadBtn.closest("[data-create-step-index]");
      const input = row?.querySelector("[data-create-step-file-input]");
      input?.click();
      return;
    }
    const clearBtn = event.target.closest("[data-clear-create-step-file]");
    if (clearBtn) {
      const index = Number(clearBtn.dataset.clearCreateStepFile);
      if (Number.isNaN(index) || !state.createWorkflowDraft.steps[index]) return;
      state.createWorkflowDraft.steps[index].attachmentName = "";
      state.createWorkflowDraft.steps[index].attachmentDataUrl = "";
      const row = clearBtn.closest("[data-create-step-index]");
      const input = row?.querySelector("[data-create-step-file-input]");
      if (input) input.value = "";
      renderCreateWorkflowSteps();
      return;
    }
    const removeButton = event.target.closest("[data-remove-create-step]");
    if (!removeButton) return;
    const index = Number(removeButton.dataset.removeCreateStep);
    if (Number.isNaN(index)) return;
    state.createWorkflowDraft.steps.splice(index, 1);
    renderCreateWorkflowSteps();
  });
  $("#create-steps-list")?.addEventListener("change", (event) => {
    const input = event.target.closest("[data-create-step-file-input]");
    if (!input || !(input instanceof HTMLInputElement)) return;
    const row = input.closest("[data-create-step-index]");
    const index = Number(row?.dataset.createStepIndex);
    if (Number.isNaN(index) || !state.createWorkflowDraft.steps[index]) return;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > MAX_STEP_ATTACHMENT_BYTES) {
      toast(`附件不能超过 ${Math.round(MAX_STEP_ATTACHMENT_BYTES / 1024 / 1024)}MB。`, "error");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.createWorkflowDraft.steps[index].attachmentDataUrl = String(reader.result || "");
      state.createWorkflowDraft.steps[index].attachmentName = file.name;
      renderCreateWorkflowSteps();
    };
    reader.onerror = () => {
      toast("附件读取失败，请换一份文件。", "error");
      input.value = "";
    };
    reader.readAsDataURL(file);
  });
  $("#create-workflow-icon-upload-btn")?.addEventListener("click", () => {
    $("#create-workflow-icon-file")?.click();
  });
  $("#create-workflow-icon-file")?.addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > MAX_TEMPLATE_ICON_BYTES) {
      toast("图标文件过大，请使用 512KB 以内的图片。", "error");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.createWorkflowDraft.iconDataUrl = String(reader.result || "");
      syncCreateWorkflowIconUi();
    };
    reader.onerror = () => toast("图标读取失败，请换一张图片。", "error");
    reader.readAsDataURL(file);
  });
  $("#create-workflow-icon-clear")?.addEventListener("click", () => {
    state.createWorkflowDraft.iconDataUrl = "";
    const input = $("#create-workflow-icon-file");
    if (input) input.value = "";
    syncCreateWorkflowIconUi();
  });
  $("#create-workflow-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const industryInput = form.elements.namedItem("industry");
    const titleInput = form.elements.namedItem("title");
    const descriptionInput = form.elements.namedItem("description");
    const industryKey = industryInput?.value || "";
    const title = String(titleInput?.value || "").trim();
    const description = String(descriptionInput?.value || "").trim();
    const steps = state.createWorkflowDraft.steps
      .map((item) => {
        const title = String(item.title || "").trim();
        const description = String(item.description || "").trim();
        const attachmentName = String(item.attachmentName || "").trim();
        const attachmentDataUrl = String(item.attachmentDataUrl || "").trim();
        const step = { title, description };
        if (attachmentName && attachmentDataUrl) {
          step.attachmentName = attachmentName;
          step.attachmentDataUrl = attachmentDataUrl;
        }
        return step;
      })
      .filter((item) => item.title && item.description);
    if (!industryKey || !title || !description) {
      toast("请先填写行业、标题和描述。", "error");
      return;
    }
    if (!steps.length) {
      toast("请至少添加一个完整流程（名称+描述）。", "error");
      return;
    }
    const template = {
      id: state.createWorkflowDraft.editingTemplateId || uid(`${industryKey}-mine-workflow`),
      industry: industryKey,
      source: "mine",
      title,
      description,
      projectName: `${title}项目`,
      objective: description,
      executionStyle: "fast",
      steps,
    };
    const iconUrl = String(state.createWorkflowDraft.iconDataUrl || "").trim();
    if (iconUrl) template.iconDataUrl = iconUrl;
    const existingIndex = state.localTemplates.findIndex((item) => item.id === template.id);
    if (existingIndex >= 0) {
      state.localTemplates.splice(existingIndex, 1, template);
    } else {
      state.localTemplates.unshift(template);
    }
    state.templateFilter = "mine";
    state.createWorkflowDraft = createDefaultWorkflowDraft(state.industry);
    renderWorkflowControls();
    renderTemplates();
    closeCreateWorkflowModal();
    toast(existingIndex >= 0 ? "工作流已更新。" : "新建工作流已保存到个人工作流。");
  });

  $("#workflow-runs-list")?.addEventListener("click", (event) => {
    const menuButton = event.target.closest("[data-toggle-run-menu]");
    if (menuButton) {
      event.preventDefault();
      event.stopPropagation();
      const runId = menuButton.dataset.toggleRunMenu;
      state.openWorkflowRunMenuId = state.openWorkflowRunMenuId === runId ? "" : runId;
      renderWorkflowRuns();
      return;
    }

    const deleteButton = event.target.closest("[data-delete-run]");
    if (deleteButton) {
      event.preventDefault();
      event.stopPropagation();
      const run = state.workflowRuns.find((item) => item.id === deleteButton.dataset.deleteRun);
      if (!run) return;
      state.openWorkflowRunMenuId = "";
      renderWorkflowRuns();
      openConfirm({
        title: "删除项目记录",
        body: "删除后只会从当前项目执行记录中移除，不影响工作流模版、节点配置或文件区演示数据。",
        payload: run,
        confirmText: "确认删除",
        onConfirm: async () => deleteWorkflowRun(run.id),
      });
      return;
    }

    const row = event.target.closest("[data-workflow-run-id]");
    if (!row) return;
    selectWorkflowRun(row.dataset.workflowRunId);
  });

  $("#workflow-runs-list")?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.openWorkflowRunMenuId) {
      state.openWorkflowRunMenuId = "";
      renderWorkflowRuns();
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("[data-toggle-run-menu], [data-delete-run]")) return;
    const row = event.target.closest("[data-workflow-run-id]");
    if (!row) return;
    event.preventDefault();
    selectWorkflowRun(row.dataset.workflowRunId);
  });

  $("#workflow-runs-detail")?.addEventListener("click", (event) => {
    const downloadButton = event.target.closest("[data-download-workflow-file]");
    if (!downloadButton) return;
    event.preventDefault();
    event.stopPropagation();
    const detailEl = $("#workflow-runs-detail");
    const runId = detailEl?.dataset.workflowRunId;
    const run = state.workflowRuns.find((item) => item.id === runId);
    const index = Number(downloadButton.dataset.downloadWorkflowFile);
    if (!run || Number.isNaN(index)) return;
    const files = detailContentForRun(run).files;
    const fileMeta = files[index];
    if (!fileMeta) return;
    downloadWorkflowDemoFile(fileMeta, run.title || "");
    toast(`已开始下载：${fileMeta.name}`);
  });

  document.addEventListener("click", (event) => {
    if (state.openWorkflowRunMenuId && !event.target.closest(".workflow-run-actions")) {
      state.openWorkflowRunMenuId = "";
      renderWorkflowRuns();
    }

    const planButton = event.target.closest("[data-plan]");
    if (planButton) {
      const plan = subscriptionPlans.find((item) => item.id === planButton.dataset.plan);
      if (!plan) return;
      if (plan.id === state.activePlan) {
        openConfirm({
          title: `${plan.name} 方案详情`,
          body: "当前正在使用该订阅方案。",
          payload: plan,
        });
        return;
      }
      openConfirm({
        title: `切换到 ${plan.name}`,
        body: "这会更新当前 Token、开放行业和工作台可选行业。",
        payload: plan,
        confirmText: "确认切换",
        onConfirm: async () => switchPlan(plan.id),
      });
    }

    const templateButton = event.target.closest("[data-apply-template]");
    if (templateButton) applyTemplate(templateButton.dataset.applyTemplate);

    const templateDetail = event.target.closest("[data-template-detail]");
    if (templateDetail) {
      const template = findTemplate(templateDetail.dataset.templateDetail);
      if (template) {
        openTemplateDetail(template);
      }
    }

    const templateStepFileBtn = event.target.closest("[data-template-step-file]");
    if (templateStepFileBtn) {
      event.preventDefault();
      const idx = Number(templateStepFileBtn.dataset.templateStepFile);
      const meta = state.templateDetailSteps[idx];
      if (!meta?.attachmentDataUrl) return;
      const a = document.createElement("a");
      a.href = meta.attachmentDataUrl;
      a.download = meta.attachmentName || "attachment";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    const editTemplateButton = event.target.closest("[data-edit-template]");
    if (editTemplateButton) editTemplate(editTemplateButton.dataset.editTemplate);

    const applyKnowledgeButton = event.target.closest("[data-apply-knowledge]");
    if (applyKnowledgeButton) {
      const item = state.knowledgeItems.find((entry) => entry.id === applyKnowledgeButton.dataset.applyKnowledge);
      const target = $("#dialogue-form textarea[name='message']");
      if (item && target) {
        target.value = [
          `请参考知识库资料《${item.title}》执行：`,
          item.summary,
          item.content,
        ].join("\n");
        showWorkflowTab("dialogue");
        jumpTo("workflow");
        toast("已加入指令参考。");
      }
    }

    const deleteTemplate = event.target.closest("[data-delete-template]");
    if (deleteTemplate) {
      const targetTemplateId = deleteTemplate.dataset.deleteTemplate;
      const template = findTemplate(targetTemplateId);
      if (template) {
        openConfirm({
          title: "删除我的模板",
          body: "删除后不会影响已经创建的执行记录。",
          payload: template,
          confirmText: "确认删除",
          onConfirm: async () => {
            state.localTemplates = state.localTemplates.filter((item) => item.id !== template.id);
            if (!state.hiddenMineTemplateIds.includes(template.id)) {
              state.hiddenMineTemplateIds.push(template.id);
            }
            renderWorkflowControls();
            renderTemplates();
            addResult("模板", `${template.title} 已删除`, "我的模板已从当前工作台移除。", template);
            toast("模板已删除。");
          },
        });
      }
    }

    const nodeButton = event.target.closest("[data-toggle-node]");
    if (nodeButton) {
      const node = state.nodes.find((item) => item.node_id === nodeButton.dataset.toggleNode);
      if (node) {
        node.paused = !node.paused;
        renderNodes();
        addResult("节点", `${node.node_name} 已${node.paused ? "暂停" : "启动"}`, `节点当前状态：${node.paused ? "已暂停" : "运行中"}。`, node);
        toast(`${node.node_name} 已${node.paused ? "暂停" : "启动"}。`);
      }
    }

    const resultDetail = event.target.closest("[data-result-detail]");
    if (resultDetail) {
      const result = state.results.find((item) => item.id === resultDetail.dataset.resultDetail);
      if (result) {
        openConfirm({
          title: result.title,
          body: result.detail,
          payload: result.payload || result,
        });
      }
    }

    const overviewRun = event.target.closest("[data-overview-run-id]");
    if (overviewRun) {
      const id = overviewRun.dataset.overviewRunId;
      const run = state.workflowRuns.find((item) => item.id === id);
      if (run) {
        state.activeWorkflowRunId = run.id;
        jumpTo("projects");
        renderWorkflowRuns();
      }
    }

    if (event.target.closest("[data-close-modal]")) closeConfirm();
    if (event.target.closest("[data-close-template-detail]")) closeTemplateDetail();
    if (event.target.closest("[data-close-create-workflow]")) closeCreateWorkflowModal();
  });

  $("#skills-module-list")?.addEventListener("click", (event) => {
    const btn = event.target.closest("button.skill-switch");
    if (!(btn instanceof HTMLButtonElement)) return;
    if (btn.disabled) return;
    const industryKey = btn.dataset.skillIndustry;
    const skillIndex = Number(btn.dataset.skillIndex);
    if (!industryKey || Number.isNaN(skillIndex)) return;
    const skillList = state.skillToggles[industryKey];
    if (!Array.isArray(skillList) || !skillList[skillIndex]) return;
    const turnOn = !skillList[skillIndex].enabled;
    skillList[skillIndex].enabled = turnOn;
    renderSkillsPanel();
    renderWorkflowControls();
    if (industryKey === state.industry) {
      toast(`当前行业技能已${turnOn ? "开启" : "关闭"}。`);
    }
  });

  window.addEventListener("popstate", () => {
    switchModule(moduleIdFromLocation(), { syncRoute: false, instant: true, scroll: false });
  });

  window.addEventListener("hashchange", () => {
    const moduleId = moduleIdFromLocation();
    switchModule(moduleId, { replace: true, instant: true, scroll: false });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("[data-overview-run-id]");
    if (!row) return;
    event.preventDefault();
    const id = row.dataset.overviewRunId;
    const run = state.workflowRuns.find((item) => item.id === id);
    if (!run) return;
    state.activeWorkflowRunId = run.id;
    jumpTo("projects");
    renderWorkflowRuns();
  });

  $("#confirm-submit")?.addEventListener("click", async () => {
    if (!state.pendingAction) return;
    const action = state.pendingAction;
    closeConfirm();
    try {
      await action();
    } catch (error) {
      toast(error.message, "error");
    }
  });
}

state.skillToggles = initializeSkillToggles();
state.templateFilter = "platform";
seedDemoWorkflowRuns();
wireUi();
wireForms();
renderAll();
switchModule(moduleIdFromLocation(), { replace: true, instant: true, scroll: false });
window.ClashCubeOS = {
  routes: moduleRoutes.map((route) => ({ ...route })),
  get activeModule() {
    return state.activeModule;
  },
  navigate: jumpTo,
  render: renderAll,
};
loadData();
