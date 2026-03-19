import { useState } from 'react';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    reviewBeforePublish: true,
    promptDualReview: true,
    syncKnowledge: false,
    enableInsightsDigest: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>系统配置</h2>
          <p className="admin-page__subtitle">管理发布流程、回归策略与运营通知</p>
        </div>
        <button type="button" className="admin-button admin-button--primary">保存配置</button>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>发布流程</h3>
              <p className="admin-panel__subtitle">上线前是否经过审批与联动同步</p>
            </div>
          </div>

          <div className="admin-setting-list">
            <button type="button" className={`admin-setting ${settings.reviewBeforePublish ? 'is-active' : ''}`} onClick={() => toggle('reviewBeforePublish')}>
              <div>
                <strong>模块发布前审批</strong>
                <p>启用后，模块创建与编辑需经运营审核后才能上架。</p>
              </div>
              <span className={`admin-switch ${settings.reviewBeforePublish ? 'active' : ''}`}>
                <span className="admin-switch__track" />
              </span>
            </button>

            <button type="button" className={`admin-setting ${settings.promptDualReview ? 'is-active' : ''}`} onClick={() => toggle('promptDualReview')}>
              <div>
                <strong>Prompt 双人复核</strong>
                <p>对学生端与教师端策略同时执行内容和模型双人复核。</p>
              </div>
              <span className={`admin-switch ${settings.promptDualReview ? 'active' : ''}`}>
                <span className="admin-switch__track" />
              </span>
            </button>
          </div>
        </article>

        <article className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>运营通知</h3>
              <p className="admin-panel__subtitle">同步知识库和日报提醒的开关状态</p>
            </div>
          </div>

          <div className="admin-setting-list">
            <button type="button" className={`admin-setting ${settings.syncKnowledge ? 'is-active' : ''}`} onClick={() => toggle('syncKnowledge')}>
              <div>
                <strong>模块上架同步知识库</strong>
                <p>自动把已上架模块同步到知识库索引和教师端可见列表。</p>
              </div>
              <span className={`admin-switch ${settings.syncKnowledge ? 'active' : ''}`}>
                <span className="admin-switch__track" />
              </span>
            </button>

            <button type="button" className={`admin-setting ${settings.enableInsightsDigest ? 'is-active' : ''}`} onClick={() => toggle('enableInsightsDigest')}>
              <div>
                <strong>开启数据洞察日报</strong>
                <p>每天 18:00 生成模块访问与课堂反馈简报。</p>
              </div>
              <span className={`admin-switch ${settings.enableInsightsDigest ? 'active' : ''}`}>
                <span className="admin-switch__track" />
              </span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}