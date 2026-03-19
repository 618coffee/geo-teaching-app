import { FormEvent, useState } from 'react';

type ModuleStatus = '已上架' | '已下架';
type ModuleIcon = 'agriculture' | 'planning' | 'population' | 'transport' | 'ecology' | 'industry';

interface ModuleCard {
  id: string;
  name: string;
  version: string;
  summary: string;
  status: ModuleStatus;
  icon: ModuleIcon;
}

type ModuleDraft = Omit<ModuleCard, 'id'> & { id?: string };

const initialModules: ModuleCard[] = [
  { id: 'module-1', name: '农业区位', version: '版本 1.0', summary: '农业区位选择与分析', status: '已下架', icon: 'agriculture' },
  { id: 'module-2', name: '城镇规划', version: '版本 1.0', summary: '城镇规划与发展', status: '已下架', icon: 'planning' },
  { id: 'module-3', name: '人口分布', version: '版本 1.0', summary: '人口分布与迁移', status: '已下架', icon: 'population' },
  { id: 'module-4', name: '交通运输', version: '版本 1.0', summary: '交通运输布局', status: '已下架', icon: 'transport' },
  { id: 'module-5', name: '环境保护', version: '版本 1.0', summary: '环境保护与治理', status: '已下架', icon: 'ecology' },
  { id: 'module-6', name: '工业区位', version: '版本 1.0', summary: '工业区位选择与分析', status: '已上架', icon: 'industry' },
];

const emptyDraft: ModuleDraft = {
  name: '',
  version: '版本 1.0',
  summary: '',
  status: '已下架',
  icon: 'industry',
};

function ModuleGlyph({ icon }: { icon: ModuleIcon }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'agriculture':
      return (
        <svg {...props}>
          <path d="M12 21c0-5.5 3.5-9.5 8-11-1 5-3.5 10-8 11Z" />
          <path d="M12 21c0-5.5-3.5-9.5-8-11 1 5 3.5 10 8 11Z" />
          <path d="M12 21V8" />
        </svg>
      );
    case 'planning':
      return (
        <svg {...props}>
          <path d="M4 20V9" />
          <path d="M10 20V4" />
          <path d="M16 20v-8" />
          <path d="M22 20v-5" />
          <path d="M2 20h20" />
        </svg>
      );
    case 'population':
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M14 19a4.5 4.5 0 0 1 7 0" />
        </svg>
      );
    case 'transport':
      return (
        <svg {...props}>
          <path d="M5 17h13l1-4-4-5H8L4 12l1 5Z" />
          <path d="M6 17h11" />
          <circle cx="8" cy="18" r="1" />
          <circle cx="16" cy="18" r="1" />
        </svg>
      );
    case 'ecology':
      return (
        <svg {...props}>
          <path d="M12 3v4" />
          <path d="m7 6 2 3" />
          <path d="m17 6-2 3" />
          <path d="M5 13a7 7 0 1 0 14 0c0-2.5-1.2-4.4-3-5.5A7.4 7.4 0 0 1 12 15a7.4 7.4 0 0 1-4-7.5C6.2 8.6 5 10.5 5 13Z" />
        </svg>
      );
    case 'industry':
      return (
        <svg {...props}>
          <path d="M3 21h18" />
          <path d="M5 21V9l6 4V9l8 4v8" />
          <path d="M9 21v-4" />
          <path d="M13 17h2" />
          <path d="M13 13h2" />
        </svg>
      );
  }
}

export function AdminModulesPage() {
  const [moduleCards, setModuleCards] = useState(initialModules);
  const [draft, setDraft] = useState<ModuleDraft | null>(null);
  const [draftMode, setDraftMode] = useState<'create' | 'edit'>('create');

  const openCreate = () => {
    setDraftMode('create');
    setDraft(emptyDraft);
  };

  const openEdit = (card: ModuleCard) => {
    setDraftMode('edit');
    setDraft(card);
  };

  const closeDraft = () => {
    setDraft(null);
  };

  const toggleStatus = (id: string) => {
    setModuleCards((current) => current.map((item) => (
      item.id === id
        ? { ...item, status: item.status === '已上架' ? '已下架' : '已上架' }
        : item
    )));
  };

  const updateDraft = <Key extends keyof ModuleDraft>(key: Key, value: ModuleDraft[Key]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft) {
      return;
    }

    const normalizedName = draft.name.trim();
    const normalizedSummary = draft.summary.trim();

    if (!normalizedName || !normalizedSummary) {
      return;
    }

    if (draftMode === 'create') {
      const nextModule: ModuleCard = {
        id: `module-${Date.now()}`,
        name: normalizedName,
        version: draft.version.trim() || '版本 1.0',
        summary: normalizedSummary,
        status: draft.status,
        icon: draft.icon,
      };

      setModuleCards((current) => [nextModule, ...current]);
    } else {
      setModuleCards((current) => current.map((item) => (
        item.id === draft.id
          ? {
              id: item.id,
              name: normalizedName,
              version: draft.version.trim() || '版本 1.0',
              summary: normalizedSummary,
              status: draft.status,
              icon: draft.icon,
            }
          : item
      )));
    }

    closeDraft();
  };

  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>模块管理</h2>
          <p className="admin-page__subtitle">管理知识点模块</p>
        </div>
        <button type="button" className="admin-button admin-button--primary" onClick={openCreate}>创建模块</button>
      </section>

      <section className="admin-module-grid">
        {moduleCards.map((item) => {
          const isLive = item.status === '已上架';

          return (
            <article key={item.id} className="admin-module-card">
              <div className="admin-module-card__top">
                <div className="admin-module-card__title-row">
                  <span className="admin-module-card__icon">
                    <ModuleGlyph icon={item.icon} />
                  </span>
                  <div>
                    <h3>{item.name}</h3>
                    <div className="admin-module-card__version">{item.version}</div>
                  </div>
                </div>
                <span className={`status-pill ${isLive ? 'status-pill--live' : 'status-pill--offline'}`}>{item.status}</span>
              </div>

              <p className="admin-module-card__summary">{item.summary}</p>

              <div className="admin-module-card__footer">
                <button
                  type="button"
                  className={`admin-switch ${isLive ? 'active' : ''}`}
                  onClick={() => toggleStatus(item.id)}
                  aria-pressed={isLive}
                >
                  <span className="admin-switch__track" />
                  <span className="admin-switch__label">{isLive ? '上架' : '下架'}</span>
                </button>

                <button type="button" className="admin-button admin-button--ghost admin-button--sm" onClick={() => openEdit(item)}>
                  编辑
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {draft && (
        <section className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>{draftMode === 'create' ? '创建模块' : '编辑模块'}</h3>
              <p className="admin-panel__subtitle">配置模块名称、说明和上架状态，当前仅保存在示例前端状态中。</p>
            </div>
          </div>

          <form className="admin-form-grid" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="module-name">模块名称</label>
              <input id="module-name" value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} placeholder="例如：水资源管理" />
            </div>

            <div className="admin-field">
              <label htmlFor="module-version">版本</label>
              <input id="module-version" value={draft.version} onChange={(event) => updateDraft('version', event.target.value)} placeholder="版本 1.0" />
            </div>

            <div className="admin-field admin-field--full">
              <label htmlFor="module-summary">模块说明</label>
              <textarea id="module-summary" value={draft.summary} onChange={(event) => updateDraft('summary', event.target.value)} placeholder="填写模块简介和教学目标" />
            </div>

            <div className="admin-field">
              <label htmlFor="module-icon">图标类型</label>
              <select id="module-icon" value={draft.icon} onChange={(event) => updateDraft('icon', event.target.value as ModuleIcon)}>
                <option value="agriculture">农业主题</option>
                <option value="planning">规划主题</option>
                <option value="population">人口主题</option>
                <option value="transport">交通主题</option>
                <option value="ecology">生态主题</option>
                <option value="industry">工业主题</option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="module-status">状态</label>
              <select id="module-status" value={draft.status} onChange={(event) => updateDraft('status', event.target.value as ModuleStatus)}>
                <option value="已下架">已下架</option>
                <option value="已上架">已上架</option>
              </select>
            </div>

            <div className="admin-form-actions admin-field--full">
              <button type="button" className="admin-button admin-button--ghost" onClick={closeDraft}>取消</button>
              <button type="submit" className="admin-button admin-button--primary">{draftMode === 'create' ? '创建并保存' : '保存修改'}</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
