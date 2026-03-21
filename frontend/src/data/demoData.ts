export type Role = 'student' | 'teacher' | 'admin';
export type MapMode = 'realistic' | 'abstract';

export interface Task {
  id: string;
  title: string;
  topic: string;
  description: string;
  mode: MapMode;
  deadline: string;
  status: '进行中' | '已完成' | '草稿';
  className: string;
  completionRate: number;
}

export interface Region {
  id: string;
  name: string;
  tags: string[];
  x: number;
  y: number;
  scores: {
    market: number;
    transport: number;
    environment: number;
    agglomeration: number;
    rawMaterial: number;
    labor: number;
  };
}

export const factoryProfiles = {
  食品厂: { market: 0.3, transport: 0.25, environment: 0.2, agglomeration: 0.1, rawMaterial: 0.05, labor: 0.1 },
  服装厂: { market: 0.2, transport: 0.2, environment: 0.1, agglomeration: 0.1, rawMaterial: 0.05, labor: 0.35 },
  化工厂: { market: 0.05, transport: 0.2, environment: 0.35, agglomeration: 0.1, rawMaterial: 0.2, labor: 0.1 },
  钢铁厂: { market: 0.05, transport: 0.25, environment: 0.1, agglomeration: 0.1, rawMaterial: 0.35, labor: 0.15 },
  高新技术厂: { market: 0.2, transport: 0.15, environment: 0.2, agglomeration: 0.25, rawMaterial: 0.05, labor: 0.15 },
} as const;

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: '工业区位选择：工厂落点决策',
    topic: '高中地理 · 工业区位选择',
    description: '学生在地图中选择建厂位置，系统基于交通、市场、环境、集聚等要素生成分析报告。',
    mode: 'realistic',
    deadline: '2026-03-25 18:00',
    status: '进行中',
    className: '高一（3）班',
    completionRate: 62,
  },
  {
    id: 'task-2',
    title: '反向推荐：最优选址推演',
    topic: '高中地理 · 工业区位选择',
    description: '从产业偏好出发，观察不同工厂类型最优布局的差异。',
    mode: 'abstract',
    deadline: '2026-03-28 20:00',
    status: '进行中',
    className: '高一（5）班',
    completionRate: 41,
  },
];

export const regions: Region[] = [
  { id: 'r1', name: '城镇中心', tags: ['市场广阔', '劳动力密集'], x: 18, y: 28, scores: { market: 95, transport: 75, environment: 45, agglomeration: 80, rawMaterial: 35, labor: 90 } },
  { id: 'r2', name: '铁路枢纽区', tags: ['交通便利', '物流优先'], x: 52, y: 22, scores: { market: 78, transport: 96, environment: 58, agglomeration: 72, rawMaterial: 56, labor: 70 } },
  { id: 'r3', name: '河流沿岸工业带', tags: ['用水便利', '适合重工业'], x: 72, y: 46, scores: { market: 62, transport: 82, environment: 60, agglomeration: 75, rawMaterial: 88, labor: 58 } },
  { id: 'r4', name: '近郊综合片区', tags: ['地价适中', '兼顾市场'], x: 30, y: 63, scores: { market: 76, transport: 70, environment: 74, agglomeration: 68, rawMaterial: 52, labor: 75 } },
  { id: 'r5', name: '生态保护缓冲区外缘', tags: ['环境要求高', '限制污染'], x: 83, y: 72, scores: { market: 40, transport: 52, environment: 90, agglomeration: 45, rawMaterial: 42, labor: 44 } },
  { id: 'r6', name: '高新区', tags: ['创新资源', '技术密集'], x: 58, y: 70, scores: { market: 84, transport: 78, environment: 85, agglomeration: 92, rawMaterial: 30, labor: 88 } },
];

export const submissions = [
  { student: '陈子昂', className: '高一（3）班', region: '近郊综合片区', factoryType: '食品厂', score: 82, submittedAt: '2026-03-18 14:20', status: '待批阅' },
  { student: '黄芷晴', className: '高一（3）班', region: '铁路枢纽区', factoryType: '钢铁厂', score: 87, submittedAt: '2026-03-18 15:02', status: '已批阅' },
  { student: '李浩然', className: '高一（5）班', region: '城镇中心', factoryType: '化工厂', score: 58, submittedAt: '2026-03-18 16:10', status: '需关注' },
];

export const teachingStats = {
  classCompletion: 78,
  avgScore: 81,
  riskyChoices: 9,
  bestRegion: '近郊综合片区',
  regionDistribution: [
    { name: '城镇中心', value: 12 },
    { name: '铁路枢纽区', value: 18 },
    { name: '河流沿岸工业带', value: 10 },
    { name: '近郊综合片区', value: 25 },
    { name: '高新区', value: 15 },
  ],
};

export const demoRecords = [
  { name: '工业区位选择公开课', mode: '实景地图', teacher: '王老师', time: '2026-03-15 09:00', participants: 46 },
  { name: '反向推荐课堂演示', mode: '抽象地图', teacher: '李老师', time: '2026-03-17 14:00', participants: 39 },
];

export const prompts = [
  { name: '区位分析报告生成', scene: '学生端', status: '启用', version: 'v1.2.0' },
  { name: '学情分析总结', scene: '教师端', status: '启用', version: 'v1.0.3' },
  { name: '反向推荐解释器', scene: '学生端', status: '草稿', version: 'v0.9.1' },
];

export const modules = [
  { name: '工业区位选择', code: 'geo-location', status: '启用', owner: '教学产品组' },
  { name: '案例库管理', code: 'case-library', status: '启用', owner: '内容运营组' },
  { name: 'Prompt 配置', code: 'prompt-center', status: '测试中', owner: 'AI 平台组' },
];

export const factorLabels = {
  market: '市场',
  transport: '交通',
  environment: '环境',
  agglomeration: '集聚',
  rawMaterial: '原料',
  labor: '劳动力',
} as const;

export const taskFocusOptions = Object.values(factorLabels);

export const caseLibrary = [
  { name: '沿海城市食品厂布局', grade: '高一', type: '食品厂', mode: '实景地图', status: '启用' },
  { name: '资源型地区钢铁厂选址', grade: '高一', type: '钢铁厂', mode: '抽象地图', status: '启用' },
  { name: '科技园区高新技术厂比较', grade: '高二', type: '高新技术厂', mode: '实景地图', status: '草稿' },
];

export function getAnalysis(factoryType: keyof typeof factoryProfiles, regionId: string) {
  const profile = factoryProfiles[factoryType];
  const region = regions.find((item) => item.id === regionId) ?? regions[0];
  const weighted = Object.entries(profile).reduce((sum, [key, weight]) => {
    const score = region.scores[key as keyof typeof region.scores];
    return sum + score * weight;
  }, 0);

  const score = Math.round(weighted);
  const profit = Math.round(score - 55);
  const transportCost = Math.max(100 - region.scores.transport, 8);
  const agglomeration = region.scores.agglomeration;
  const environmentRisk = 100 - region.scores.environment;

  const summary =
    score >= 85
      ? '选址非常合适，区位条件与产业偏好高度匹配。'
      : score >= 70
        ? '选址基本可行，但仍可针对成本和环境进一步优化。'
        : '当前选址存在明显短板，建议重新评估交通、环境或市场条件。';

  const suggestions = [
    region.scores.transport < 70 ? '可增加物流节点或优先选择临近铁路/干道的地块。' : '交通条件较好，可重点优化配送与仓储布局。',
    region.scores.environment < 65 ? '环境约束较强，需加强污染防控与环保说明。' : '环境条件较优，可作为课堂讲解中的正向示例。',
    region.scores.market < 70 ? '市场辐射能力一般，建议结合下游销售半径做补充分析。' : '市场条件较强，适合强调“靠近消费市场”的区位逻辑。',
  ];

  const comparePlans = regions
    .map((item) => ({ region: item.name, score: Math.round(Object.entries(profile).reduce((sum, [key, weight]) => sum + item.scores[key as keyof typeof item.scores] * weight, 0)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { region, score, profit, transportCost, agglomeration, environmentRisk, summary, suggestions, comparePlans };
}
