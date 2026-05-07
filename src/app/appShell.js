export const appShellTemplate = String.raw`<div class="app-shell">
    <aside class="sidebar" aria-label="主导航">
      <a class="brand" href="/overview" data-section-jump="overview" aria-label="ClashCube OS 首页">
        <span class="brand-mark" aria-hidden="true">OC</span>
        <span>
          <strong>ClashCube OS</strong>
          <small>AI工作流平台</small>
        </span>
      </a>

      <nav class="nav-list">
        <button class="nav-item active" type="button" data-section="overview">
          <span class="nav-icon" aria-hidden="true"></span>
          仪表盘
        </button>
        <button class="nav-item" type="button" data-section="projects">
          <span class="nav-icon" aria-hidden="true"></span>
          我的项目
        </button>
        <button class="nav-item" type="button" data-section="workflow">
          <span class="nav-icon" aria-hidden="true"></span>
          工作模版
        </button>
        <button class="nav-item" type="button" data-section="skills">
          <span class="nav-icon" aria-hidden="true"></span>
          行业技能
        </button>
        <button class="nav-item" type="button" data-section="knowledge">
          <span class="nav-icon" aria-hidden="true"></span>
          知识库
        </button>
        <button class="nav-item" type="button" data-section="config">
          <span class="nav-icon" aria-hidden="true"></span>
          节点配置
        </button>
      </nav>

      <div class="tenant-card">
        <div class="tenant-card-summary">
          <span>当前订阅</span>
          <strong id="sidebar-plan">Free</strong>
          <small id="sidebar-quota">每日 Token 加载中</small>
        </div>
        <button class="button ghost tenant-card-action" type="button" data-section-jump="subscription">订阅服务</button>
      </div>
    </aside>

    <main class="workspace">
      <section id="overview" class="module-panel active" data-module-panel="overview">
        <div class="hero-section">
          <div class="hero-copy">
            <div id="connection-status" class="status-line">正在连接控制器</div>
            <h2>AI工作台</h2>
            <p>在这里查看节点数量、行业数量、工作流次数和 Token。</p>
            <div class="hero-actions">
              <button class="button primary" type="button" data-section-jump="config">节点配置</button>
              <button class="button ghost" type="button" data-section-jump="subscription">订阅服务</button>
            </div>
          </div>
          <div class="hero-board" aria-label="数据看板">
            <div class="board-row">
              <span class="board-row-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="6.5" cy="12" r="2.5"></circle>
                  <circle cx="17.5" cy="7" r="2.5"></circle>
                  <circle cx="17.5" cy="17" r="2.5"></circle>
                  <path d="M8.7 10.9 15 8"></path>
                  <path d="M8.7 13.1 15 16"></path>
                </svg>
                <span>节点</span>
              </span>
              <strong id="metric-nodes">0</strong>
            </div>
            <div class="board-row">
              <span class="board-row-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3 4 7v5c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V7l-8-4Z"></path>
                  <path d="M9.5 12 11 13.5 14.8 9.8"></path>
                </svg>
                <span>行业</span>
              </span>
              <strong id="metric-industries">0</strong>
            </div>
            <div class="board-row">
              <span class="board-row-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="5" width="6" height="4" rx="1.5"></rect>
                  <rect x="14" y="15" width="6" height="4" rx="1.5"></rect>
                  <rect x="14" y="5" width="6" height="4" rx="1.5"></rect>
                  <path d="M10 7h2.5a2 2 0 0 1 2 2v0"></path>
                  <path d="M10 7h2.5a2 2 0 0 0 2-2v0"></path>
                  <path d="M12 7v10h2"></path>
                </svg>
                <span>工作流</span>
              </span>
              <strong id="metric-executions">0</strong>
            </div>
            <div class="board-row">
              <span class="board-row-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"></path>
                  <path d="M4 9h16"></path>
                  <circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none"></circle>
                </svg>
                <span>Token</span>
              </span>
              <strong id="metric-quota">0 / 0</strong>
            </div>
          </div>
        </div>

        <div class="panel overview-charts">
          <div class="section-head compact-head">
            <div>
              <h2>执行趋势与节点分布</h2>
            </div>
          </div>
          <div class="overview-chart-grid">
            <article class="chart-card">
              <div class="chart-head">
                <strong>近 7 日工作流趋势</strong>
              </div>
              <div id="workflow-trend-chart" class="bar-chart"></div>
            </article>
            <article class="chart-card">
              <div class="chart-head">
                <strong>最近执行</strong>
                <a class="chart-head-link" href="/projects" data-section-jump="projects">查看更多</a>
              </div>
              <div id="workflow-project-chart" class="workflow-project-chart"></div>
            </article>
          </div>
        </div>

        <div class="panel">
          <div class="section-head">
            <div>
              <h2>节点</h2>
            </div>
          </div>
          <div id="node-grid" class="node-grid"></div>
        </div>
      </section>

      <section id="projects" class="module-panel" data-module-panel="projects">
        <div class="panel">
          <div class="section-head">
            <div>
              <h2>项目执行记录</h2>
            </div>
            <strong id="workflow-runs-count">0 条记录</strong>
          </div>
          <div class="workflow-runs-layout">
            <div id="workflow-runs-list" class="workflow-runs-list"></div>
            <div id="workflow-runs-detail" class="workflow-runs-detail"></div>
          </div>
        </div>
      </section>

      <section id="workflow" class="module-panel" data-module-panel="workflow">
        <div class="panel workflow-panel">
          <div class="section-head">
            <div>
              <h2>全行业工作流模版</h2>
            </div>
          </div>

          <div class="workflow-overview">
            <div class="template-board">
              <div class="template-toolbar">
                <div class="template-toolbar-main">
                  <div class="industry-toolbar">
                    <div id="industry-custom-select" class="custom-select industry-only-control">
                      <button id="industry-select-trigger" class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
                        <span>全部行业</span>
                        <i aria-hidden="true">⌄</i>
                      </button>
                      <div id="industry-select-menu" class="custom-select-menu" role="listbox" aria-label="行业切换"></div>
                      <select id="industry-select" class="native-select-hidden" aria-label="行业切换"></select>
                    </div>
                  </div>
                  <div class="segmented compact" aria-label="模板筛选">
                    <button class="segment active" type="button" data-template-filter="platform">平台模版</button>
                    <button class="segment" type="button" data-template-filter="mine">个人模版</button>
                  </div>
                </div>
                <button id="create-workflow-button" class="button small secondary" type="button">新建工作流模版</button>
              </div>
              <div id="template-list" class="template-grid"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" class="module-panel" data-module-panel="skills">
        <div class="panel skills-inline-panel">
          <div class="section-head">
            <div>
              <h2>行业技能管理</h2>
            </div>
            <label class="select-control compact-search">
              <div id="skills-industry-custom-select" class="custom-select">
                <button id="skills-industry-select-trigger" class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
                  <span>全部行业</span>
                  <i aria-hidden="true">⌄</i>
                </button>
                <div id="skills-industry-select-menu" class="custom-select-menu" role="listbox" aria-label="技能模块行业切换"></div>
                <select id="skills-industry-select" class="native-select-hidden" aria-label="技能模块行业切换"></select>
              </div>
            </label>
          </div>
          <div class="skills-kpi-row">
            <article class="skills-kpi-card">
              <span>技能总数</span>
              <strong id="skills-total-count">0</strong>
            </article>
            <article class="skills-kpi-card">
              <span>已开启</span>
              <strong id="skills-enabled-count">0</strong>
            </article>
            <article class="skills-kpi-card">
              <span>已关闭</span>
              <strong id="skills-disabled-count">0</strong>
            </article>
          </div>
          <div id="skills-module-list" class="skills-module-list"></div>
        </div>
      </section>

      <section id="knowledge" class="module-panel" data-module-panel="knowledge">
        <div class="panel knowledge-panel">
          <div class="section-head">
            <div>
              <h2>知识库</h2>
            </div>
            <strong id="knowledge-count">0 条资料</strong>
          </div>

          <div class="knowledge-kpi-row">
            <article class="knowledge-kpi-card">
              <span>资料总数</span>
              <strong id="knowledge-total-count">0</strong>
            </article>
            <article class="knowledge-kpi-card">
              <span>覆盖行业</span>
              <strong id="knowledge-industry-count">0</strong>
            </article>
            <article class="knowledge-kpi-card">
              <span>标签数量</span>
              <strong id="knowledge-tag-count">0</strong>
            </article>
          </div>

          <form id="knowledge-form" class="knowledge-form">
            <div class="knowledge-form-head">
              <strong>新增知识库</strong>
            </div>
            <label>
              <span>标题</span>
              <input name="title" placeholder="例如：短视频脚本审核规范">
            </label>
            <label>
              <span>行业切换</span>
              <select id="knowledge-industry-select" name="industry" aria-label="知识库行业切换"></select>
            </label>
            <label>
              <span>标签</span>
              <input name="tags" placeholder="用逗号分隔，例如：审核,脚本,合规">
            </label>
            <label>
              <span>上传文件</span>
              <div class="knowledge-file-field">
                <input id="knowledge-attachment-input" class="knowledge-file-input" name="attachment" type="file" accept=".pdf,.doc,.docx,.txt,.csv,.json,.md,.png,.jpg,.jpeg,.webp">
                <button id="knowledge-attachment-upload-btn" class="button small secondary" type="button">上传文件</button>
                <span id="knowledge-attachment-name" class="knowledge-file-name">未选择文件</span>
                <button id="knowledge-attachment-clear-btn" class="button small ghost knowledge-file-clear" type="button" hidden aria-label="移除已选文件">×</button>
              </div>
            </label>
            <label class="knowledge-form-wide">
              <span>摘要</span>
              <textarea name="summary" rows="3" placeholder="写入这条知识资料的用途、适用场景和关键结论。"></textarea>
            </label>
            <label class="knowledge-form-wide">
              <span>正文</span>
              <textarea name="content" rows="5" placeholder="补充详细规则、示例、注意事项或操作步骤。"></textarea>
            </label>
            <button class="button primary" type="submit">保存到知识库</button>
          </form>

          <div class="knowledge-toolbar knowledge-toolbar--industry" aria-label="知识库行业切换区">
            <div class="knowledge-toolbar-head">
              <span>行业切换</span>
            </div>
            <div id="knowledge-industry-filter" class="segmented compact knowledge-filter knowledge-filter--full" aria-label="知识库行业切换"></div>
          </div>

          <div class="knowledge-layout">
            <div id="knowledge-list" class="knowledge-list" aria-label="知识资料列表"></div>
            <article id="knowledge-detail" class="knowledge-detail"></article>
          </div>
        </div>
      </section>

      <section id="config" class="module-panel" data-module-panel="config">
        <div class="panel">
          <div class="section-head">
            <div>
              <h2>节点配置</h2>
            </div>
          </div>
          <form id="config-form" class="config-form">
            <label>
              <span>节点名称</span>
              <input name="node_name" placeholder="planner-01">
            </label>
            <label>
              <span>机器 IP</span>
              <input name="machine_ip" placeholder="192.168.5.101">
            </label>
            <label>
              <span>用户名</span>
              <input name="username" placeholder="root">
            </label>
            <label>
              <span>密码</span>
              <input name="password" type="password" placeholder="请输入密码" autocomplete="new-password">
            </label>
            <fieldset class="config-ai-link-group" aria-labelledby="config-ai-link-legend">
              <legend id="config-ai-link-legend" class="config-ai-link-legend">AI 模型设置</legend>
              <label>
                <span>AI 模型</span>
                <select name="ai_model" id="config-ai-model" required>
                  <option value="maxmini">Maxmini</option>
                  <option value="qwen" selected>Qwen</option>
                </select>
              </label>
              <div id="config-model-api-key-wrap" class="config-model-api-key-wrap config-model-api-key-wrap--hidden" aria-hidden="true">
                <label>
                  <span>API Key</span>
                  <input name="model_api_key" type="password" placeholder="请输入 API Key" autocomplete="off">
                </label>
              </div>
            </fieldset>
            <button class="button primary" type="submit">提交</button>
          </form>
        </div>
      </section>

      <section id="subscription" class="module-panel" data-module-panel="subscription">
        <div class="panel">
          <div class="section-head">
            <div>
              <span>订阅方案</span>
              <h2>按开放行业与 Token 分层</h2>
            </div>
            <strong id="active-plan-label">Free</strong>
          </div>
          <div id="plan-list" class="plan-grid"></div>
        </div>
      </section>

    </main>

    <aside class="action-dock" aria-label="操作区">
      <div class="dock-head">
        <div>
          <h2>操作区</h2>
        </div>
      </div>

      <div class="segmented dock-tabs" role="tablist" aria-label="操作类型">
        <button class="segment active" type="button" data-workflow-tab="dialogue">指令</button>
        <button class="segment" type="button" data-workflow-tab="collaboration">工作流</button>
        <button class="segment" type="button" data-workflow-tab="discussion">讨论</button>
      </div>

      <form id="dialogue-form" class="workflow-form active" data-workflow-panel="dialogue">
        <label>
          <span>执行风格</span>
          <select name="execution_style">
            <option value="fast" selected>快速模式</option>
            <option value="balanced">标准模式</option>
            <option value="strict">深度模式</option>
            <option value="creative">创意模式</option>
          </select>
        </label>
        <label>
          <span>输入指令</span>
          <textarea name="message" rows="6" placeholder="输入指令内容，系统会返回执行结果。"></textarea>
        </label>
        <button class="button primary" type="submit">发送</button>
      </form>

      <form id="collaboration-form" class="workflow-form collaboration-dock-form" data-workflow-panel="collaboration">
        <label>
          <span>选择行业</span>
          <select id="collaboration-industry-select" name="collaboration_industry" aria-label="工作流行业"></select>
        </label>
        <fieldset id="collaboration-gated-fields" class="collaboration-gated-fieldset" disabled aria-disabled="true">
          <div class="dock-field-block">
            <div class="field-label">模版</div>
            <input type="hidden" name="template_source" id="collaboration-template-source" value="platform">
            <div class="segmented compact dock-collab-template-source" role="group" aria-label="模版类型">
              <button class="segment active" type="button" data-collab-template-source="platform">平台模版</button>
              <button class="segment" type="button" data-collab-template-source="mine">个人模版</button>
            </div>
            <label>
              <span>选择模版</span>
              <select id="collaboration-template-select" name="workflow_template" aria-label="选择具体模版"></select>
            </label>
          </div>
          <label>
            <span>执行风格</span>
            <select name="execution_style">
              <option value="fast" selected>快速模式</option>
              <option value="balanced">标准模式</option>
              <option value="strict">深度模式</option>
              <option value="creative">创意模式</option>
            </select>
          </label>
          <label>
            <span>项目名称</span>
            <input name="project_name" placeholder="例如：新品发布短视频">
          </label>
          <label>
            <span>完成目标</span>
            <textarea name="objective" rows="5" placeholder="输入项目目标、交付要求和关键约束。"></textarea>
          </label>
          <button class="button primary" type="submit">发送</button>
        </fieldset>
      </form>

      <form id="discussion-form" class="workflow-form discussion-dock-form" data-workflow-panel="discussion">
        <label>
          <span>讨论话题</span>
          <textarea name="topic" rows="5" placeholder="输入需要多个节点共同讨论的问题。"></textarea>
        </label>
        <div class="dock-field-block discussion-nodes-block">
          <div class="field-label" id="discussion-node-field-label">参与节点</div>
          <div id="discussion-node-picker" class="discussion-node-picker" role="group" aria-label="输入参与讨论节点代表的职业角色"></div>
        </div>
        <label>
          <span>讨论次数</span>
          <input name="rounds" type="number" min="1" max="6" value="2">
        </label>
        <button class="button primary" type="submit">发起讨论</button>
      </form>
    </aside>
  </div>

  <div id="confirm-modal" class="modal" aria-hidden="true">
    <div class="modal-backdrop" data-close-modal></div>
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div class="modal-head">
        <h2 id="confirm-title">确认操作</h2>
        <button class="icon-button" type="button" data-close-modal aria-label="关闭">×</button>
      </div>
      <p id="confirm-body"></p>
      <pre id="confirm-payload" class="payload-preview"></pre>
      <div class="modal-actions">
        <button class="button ghost" type="button" data-close-modal>取消</button>
        <button id="confirm-submit" class="button primary" type="button">确认执行</button>
      </div>
    </section>
  </div>

  <div id="template-detail-modal" class="modal" aria-hidden="true">
    <div class="modal-backdrop" data-close-template-detail></div>
    <section class="modal-card template-detail-card" role="dialog" aria-modal="true" aria-labelledby="template-detail-title">
      <div class="modal-head">
        <h2 id="template-detail-title">模板详情</h2>
        <button class="icon-button" type="button" data-close-template-detail aria-label="关闭">×</button>
      </div>
      <div id="template-detail-icon-slot" class="template-detail-icon-slot" aria-hidden="true"></div>
      <p id="template-detail-desc" class="template-detail-desc"></p>
      <div id="template-detail-steps" class="template-detail-steps"></div>
    </section>
  </div>

  <div id="create-workflow-modal" class="modal" aria-hidden="true">
    <div class="modal-backdrop" data-close-create-workflow></div>
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-workflow-title">
      <div class="modal-head">
        <h2 id="create-workflow-title">新建工作流</h2>
      </div>
      <form id="create-workflow-form" class="create-workflow-form">
        <label>
          <span>选择行业</span>
          <div id="create-industry-custom-select" class="custom-select">
            <button id="create-industry-select-trigger" class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span>全部行业</span>
              <i aria-hidden="true">⌄</i>
            </button>
            <div id="create-industry-select-menu" class="custom-select-menu" role="listbox" aria-label="新建工作流行业切换"></div>
            <select id="create-workflow-industry" class="native-select-hidden" name="industry"></select>
          </div>
        </label>
        <label>
          <span>工作流标题</span>
          <input name="title" placeholder="请输入工作流标题">
        </label>
        <label>
          <span>工作流描述</span>
          <textarea name="description" rows="3" placeholder="输入这个工作流的目标、适用场景和交付要求。"></textarea>
        </label>
        <div class="create-workflow-icon-field">
          <span>工作流图标</span>
          <div class="create-workflow-icon-row">
            <div id="create-workflow-icon-preview" class="create-workflow-icon-preview" aria-hidden="true">
              <img id="create-workflow-icon-img" alt="" width="48" height="48" hidden>
              <div id="create-workflow-icon-placeholder" class="create-workflow-icon-placeholder"></div>
            </div>
            <div class="create-workflow-icon-actions">
              <input type="file" id="create-workflow-icon-file" class="create-workflow-icon-file-input" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="上传工作流图标">
              <button type="button" class="button small secondary" id="create-workflow-icon-upload-btn">上传图标</button>
              <button type="button" class="button small ghost" id="create-workflow-icon-clear">使用默认</button>
            </div>
          </div>
          <small class="create-workflow-icon-hint">支持 PNG / JPG / WebP / GIF，建议正方形，最大 512KB。不上传则使用默认个人图标。</small>
        </div>
        <div class="create-steps-head">
          <span>工作流步骤（名称 + 描述；每步可上传附件）</span>
          <button id="add-create-step" class="button small secondary" type="button">增加流程</button>
        </div>
        <div id="create-steps-list" class="create-steps-list"></div>
        <div class="modal-actions">
          <button class="button ghost" type="button" data-close-create-workflow>取消</button>
          <button class="button primary" type="submit">提交保存</button>
        </div>
      </form>
    </section>
  </div>

  <div id="toast-region" class="toast-region" aria-live="polite"></div>`;
