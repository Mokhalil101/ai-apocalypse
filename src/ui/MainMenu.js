// AI APOCALYPSE — Main Menu, Game Modes & Settings System
// Powered by GDG Assiut

class MainMenu {
  constructor() {
    this.container = null;
    this.initDOM();
  }

  initDOM() {
    let el = document.getElementById("main-menu-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "main-menu-overlay";
      el.className = "main-menu-overlay";
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show() {
    this.container.classList.remove("hidden");
    this.render();
  }

  hide() {
    this.container.classList.add("hidden");
  }

  render() {
    const hasSave = window.StorageManager ? window.StorageManager.hasSave() : false;
    const save = window.StorageManager ? window.StorageManager.load() : null;
    const curLevel = save ? save.currentStoryLevel : 1;

    this.container.innerHTML = `
      <div class="menu-backdrop">
        <div class="menu-content-card">
          <!-- GDG Assiut Brand Banner -->
          <div class="menu-gdg-pill">
            <span class="gdg-dot blue"></span>
            <span class="gdg-dot red"></span>
            <span class="gdg-dot yellow"></span>
            <span class="gdg-dot green"></span>
            <span class="gdg-label">GOOGLE DEVELOPER GROUPS // GDG ASSIUT</span>
          </div>

          <!-- Title -->
          <h1 class="game-main-title">AI APOCALYPSE</h1>
          <p class="game-tagline">THINK. ADAPT. SURVIVE.</p>

          <div class="menu-buttons-list">
            ${hasSave ? `
              <button id="btn-continue" class="menu-btn primary-btn">
                <span class="btn-icon">▶</span> CONTINUE CAMPAIGN (SECTOR ${curLevel})
              </button>
            ` : ''}

            <button id="btn-story" class="menu-btn ${!hasSave ? 'primary-btn' : ''}">
              <span class="btn-icon">⚡</span> STORY CAMPAIGN (6 SECTORS)
            </button>

            <button id="btn-survival" class="menu-btn">
              <span class="btn-icon">💀</span> ENDLESS SURVIVAL MODE
            </button>

            <button id="btn-challenge" class="menu-btn">
              <span class="btn-icon">🧠</span> CS & AI CHALLENGE ACADEMY
            </button>

            <button id="btn-daily" class="menu-btn">
              <span class="btn-icon">📅</span> DAILY SURVIVAL CHALLENGE
            </button>

            <button id="btn-sandbox" class="menu-btn">
              <span class="btn-icon">🛠️</span> SANDBOX TESTING ARENA
            </button>

            <button id="btn-achievements" class="menu-btn">
              <span class="btn-icon">🏆</span> ACHIEVEMENTS & STATS
            </button>

            <button id="btn-settings" class="menu-btn">
              <span class="btn-icon">⚙️</span> SETTINGS & CONTROLS
            </button>

            <button id="btn-credits" class="menu-btn">
              <span class="btn-icon">ℹ️</span> GDG ASSIUT & CREDITS
            </button>
          </div>

          <div class="menu-footer">
            <span>Powered by <strong>GDG Assiut</strong> &bull; Version 1.0 Production</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Audio unlock on click
    this.container.onclick = () => {
      if (window.AudioManager) window.AudioManager.unlockAudio();
    };

    // Continue
    const contBtn = document.getElementById("btn-continue");
    if (contBtn) {
      contBtn.onclick = () => {
        this.hide();
        if (window.GameInstance) {
          const save = window.StorageManager.load();
          window.GameInstance.startCampaign(save.currentStoryLevel || 1);
        }
      };
    }

    // Story Campaign
    const storyBtn = document.getElementById("btn-story");
    if (storyBtn) {
      storyBtn.onclick = () => {
        this.hide();
        if (window.GameInstance) {
          window.GameInstance.startCampaign(1);
        }
      };
    }

    // Survival Mode
    const survBtn = document.getElementById("btn-survival");
    if (survBtn) {
      survBtn.onclick = () => {
        this.hide();
        if (window.GameInstance) {
          window.GameInstance.startSurvivalMode();
        }
      };
    }

    // Challenge Academy
    const chalBtn = document.getElementById("btn-challenge");
    if (chalBtn) {
      chalBtn.onclick = () => {
        this.openChallengeAcademy();
      };
    }

    // Daily Challenge
    const dailyBtn = document.getElementById("btn-daily");
    if (dailyBtn) {
      dailyBtn.onclick = () => {
        this.hide();
        if (window.GameInstance) {
          window.GameInstance.startDailyChallenge();
        }
      };
    }

    // Sandbox
    const sandBtn = document.getElementById("btn-sandbox");
    if (sandBtn) {
      sandBtn.onclick = () => {
        this.hide();
        if (window.GameInstance) {
          window.GameInstance.startSandboxMode();
        }
      };
    }

    // Achievements
    const achBtn = document.getElementById("btn-achievements");
    if (achBtn) {
      achBtn.onclick = () => {
        if (window.GameInventoryUI) {
          window.GameInventoryUI.open("achievements");
        }
      };
    }

    // Settings
    const setBtn = document.getElementById("btn-settings");
    if (setBtn) {
      setBtn.onclick = () => {
        this.openSettingsModal();
      };
    }

    // Credits
    const credBtn = document.getElementById("btn-credits");
    if (credBtn) {
      credBtn.onclick = () => {
        this.openCreditsModal();
      };
    }
  }

  openChallengeAcademy() {
    const challenges = window.CHALLENGES_DATA || [];
    const categories = Array.from(new Set(challenges.map(c => c.category)));

    const modal = document.createElement("div");
    modal.className = "custom-dialog-backdrop";
    modal.innerHTML = `
      <div class="custom-dialog-card wide-dialog">
        <div class="dialog-header">
          <h2>🧠 CS & AI CHALLENGE ACADEMY</h2>
          <button class="term-icon-btn close-dialog-btn">✕</button>
        </div>
        <div class="dialog-body">
          <p class="academy-subtitle">Master Computer Science, AI, and Cybersecurity concepts to earn XP and rewards.</p>
          <div class="academy-grid">
            ${challenges.map(c => {
              const solved = window.Challenges && window.Challenges.isSolved(c.id);
              return `
                <div class="academy-card ${solved ? 'academy-solved' : ''}" data-ch-id="${c.id}">
                  <div class="academy-card-header">
                    <span class="academy-cat">${c.category}</span>
                    <span class="diff-badge badge-${c.difficulty}">${c.difficulty.toUpperCase()}</span>
                  </div>
                  <h4>${c.title}</h4>
                  <p>${c.question.substr(0, 85)}...</p>
                  <div class="academy-card-footer">
                    <span>${solved ? '✓ SOLVED' : '+ ' + (c.reward ? c.reward.xp : 100) + ' XP'}</span>
                    <button class="terminal-btn academy-launch-btn">LAUNCH ➔</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-dialog-btn").onclick = () => modal.remove();

    modal.querySelectorAll(".academy-card").forEach(card => {
      card.onclick = () => {
        const id = card.dataset.chId;
        modal.remove();
        if (window.Challenges) {
          window.Challenges.startChallenge(id);
        }
      };
    });
  }

  openSettingsModal() {
    const save = window.StorageManager ? window.StorageManager.load() : { settings: {} };
    const s = save.settings || {};

    const modal = document.createElement("div");
    modal.className = "custom-dialog-backdrop";
    modal.innerHTML = `
      <div class="custom-dialog-card">
        <div class="dialog-header">
          <h2>⚙️ SETTINGS & DATA MANAGEMENT</h2>
          <button class="term-icon-btn close-dialog-btn">✕</button>
        </div>
        <div class="dialog-body">
          <div class="setting-item">
            <label>Master Volume (${Math.round((s.masterVolume || 0.8) * 100)}%)</label>
            <input type="range" id="setting-master" min="0" max="1" step="0.05" value="${s.masterVolume || 0.8}" />
          </div>

          <div class="setting-item">
            <label>Sound Effects (${Math.round((s.sfxVolume || 0.8) * 100)}%)</label>
            <input type="range" id="setting-sfx" min="0" max="1" step="0.05" value="${s.sfxVolume || 0.8}" />
          </div>

          <div class="setting-item">
            <label>Music Volume (${Math.round((s.musicVolume || 0.5) * 100)}%)</label>
            <input type="range" id="setting-music" min="0" max="1" step="0.05" value="${s.musicVolume || 0.5}" />
          </div>

          <div class="setting-item-toggle">
            <label>Always Display Virtual Touch Controls</label>
            <input type="checkbox" id="setting-touch" ${s.touchControlsAlways ? 'checked' : ''} />
          </div>

          <hr class="dialog-divider" />

          <h4>DATA MANAGEMENT</h4>
          <div class="data-actions-row">
            <button id="btn-export-save" class="terminal-btn hint-btn">EXPORT SAVE (JSON)</button>
            <button id="btn-reset-save" class="terminal-btn btn-danger">RESET ALL PROGRESS</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-dialog-btn").onclick = () => modal.remove();

    // Volume sliders
    const masterSlider = modal.querySelector("#setting-master");
    const sfxSlider = modal.querySelector("#setting-sfx");
    const musicSlider = modal.querySelector("#setting-music");
    const touchCheck = modal.querySelector("#setting-touch");

    const updateAudioSettings = () => {
      s.masterVolume = parseFloat(masterSlider.value);
      s.sfxVolume = parseFloat(sfxSlider.value);
      s.musicVolume = parseFloat(musicSlider.value);
      s.touchControlsAlways = touchCheck.checked;

      if (window.AudioManager) {
        window.AudioManager.setVolumes(s.masterVolume, s.sfxVolume, s.musicVolume);
      }
      if (window.StorageManager) {
        save.settings = s;
        window.StorageManager.save(save);
      }
    };

    masterSlider.oninput = updateAudioSettings;
    sfxSlider.oninput = updateAudioSettings;
    musicSlider.oninput = updateAudioSettings;
    touchCheck.onchange = updateAudioSettings;

    // Export save
    modal.querySelector("#btn-export-save").onclick = () => {
      if (window.StorageManager) {
        const json = window.StorageManager.exportJSON();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `AI_APOCALYPSE_SAVE_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    // Reset progress
    modal.querySelector("#btn-reset-save").onclick = () => {
      if (confirm("Are you sure you want to reset all campaign progress, inventory, and achievements? This cannot be undone.")) {
        if (window.StorageManager) {
          window.StorageManager.resetProgress();
          alert("Progress reset to factory state.");
          modal.remove();
          this.render();
        }
      }
    };
  }

  openCreditsModal() {
    const modal = document.createElement("div");
    modal.className = "custom-dialog-backdrop";
    modal.innerHTML = `
      <div class="custom-dialog-card">
        <div class="dialog-header">
          <h2>GOOGLE DEVELOPER GROUPS // GDG ASSIUT</h2>
          <button class="term-icon-btn close-dialog-btn">✕</button>
        </div>
        <div class="dialog-body credits-body">
          <div class="credits-logo-pill">
            <span class="gdg-dot blue"></span>
            <span class="gdg-dot red"></span>
            <span class="gdg-dot yellow"></span>
            <span class="gdg-dot green"></span>
            <strong>GDG ASSIUT GAMING EXPERIENCE</strong>
          </div>
          <p><strong>AI APOCALYPSE: SURVIVE THE MACHINES</strong> was engineered specifically for Google Developer Groups Assiut community events, university hackathons, and AI educational programs.</p>

          <h4>CORE MISSION</h4>
          <p>To fuse intense survival action gameplay with rigorous, practical Computer Science, Machine Learning, Deep Learning, and Cybersecurity education.</p>

          <h4>SPECIAL THANKS & ATTRIBUTIONS</h4>
          <ul>
            <li><strong>GDG Assiut Leads & Core Team</strong> &bull; Community guidance & support</li>
            <li><strong>Google Developers Community</strong> &bull; Technology ecosystem</li>
            <li><strong>Modern Web Technologies</strong> &bull; HTML5 Canvas, Web Audio API, ES6+ Modular JS</li>
          </ul>

          <div class="credits-footer-motto">
            "Think. Adapt. Survive. Powered by GDG Assiut."
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector(".close-dialog-btn").onclick = () => modal.remove();
  }
}

// Global instance
const GameMainMenu = new MainMenu();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MainMenu, GameMainMenu };
}
if (typeof window !== 'undefined') {
  window.MainMenu = MainMenu;
  window.GameMainMenu = GameMainMenu;
}
