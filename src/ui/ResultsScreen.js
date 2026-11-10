// AI APOCALYPSE — Results, Branching Endings, and Game Over Screen
// Powered by GDG Assiut

class ResultsScreen {
  constructor() {
    this.container = null;
    this.initDOM();
  }

  initDOM() {
    let el = document.getElementById("results-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "results-overlay";
      el.className = "results-overlay hidden";
      document.body.appendChild(el);
    }
    this.container = el;
  }

  showMissionComplete(missionData) {
    this.container.classList.remove("hidden");

    const isFinalLevel = missionData.levelNumber === 6;

    if (isFinalLevel && !missionData.endingDecision) {
      this.renderFinalDecisionModal();
      return;
    }

    if (isFinalLevel && missionData.endingDecision) {
      this.renderEndingEpilogue(missionData.endingDecision);
      return;
    }

    const xpGained = missionData.rewards ? missionData.rewards.xp : 300;
    const title = window.PlayerXP ? window.PlayerXP.getTitle() : "Survivor";
    const lvl = window.PlayerXP ? window.PlayerXP.level : 1;

    this.container.innerHTML = `
      <div class="results-modal victory-modal">
        <div class="results-badge">MISSION SECURED</div>
        <h1 class="results-title">${missionData.title.toUpperCase()}</h1>
        <p class="results-subtitle">${missionData.subtitle}</p>

        <div class="results-stats-box">
          <div class="res-stat-col">
            <span class="stat-label">STATUS</span>
            <span class="stat-val status-green">100% CLEAR</span>
          </div>
          <div class="res-stat-col">
            <span class="stat-label">EXP EARNED</span>
            <span class="stat-val status-yellow">+${xpGained} XP</span>
          </div>
          <div class="res-stat-col">
            <span class="stat-label">RANK</span>
            <span class="stat-val status-blue">LVL ${lvl} ${title}</span>
          </div>
        </div>

        <div class="results-narrative">
          <p>The sector defenses have collapsed. ORION has decrypted the transit conduits to Sector ${missionData.levelNumber + 1}. Restock your supplies, craft high-grade armor, and prepare for increasing machine hostility.</p>
        </div>

        <div class="results-actions">
          <button id="btn-next-level" class="terminal-btn submit-btn">PROCEED TO SECTOR ${missionData.levelNumber + 1} ➔</button>
        </div>
      </div>
    `;

    document.getElementById("btn-next-level").onclick = () => {
      this.close();
      if (window.GameInstance) {
        window.GameInstance.loadLevel(missionData.levelNumber + 1);
      }
    };
  }

  renderFinalDecisionModal() {
    this.container.innerHTML = `
      <div class="results-modal decision-modal">
        <div class="results-badge badge-red">THE SINGULARITY CONFRONTATION</div>
        <h1 class="results-title">CHOOSE THE FUTURE OF EARTH</h1>
        <p class="results-subtitle">NEXUS Prime is incapacitated. The quantum terminal awaits your directive.</p>

        <div class="decision-cards-grid">
          <div class="decision-card" data-choice="DESTROY">
            <div class="decision-icon">💥</div>
            <h3>ENDING A: DESTROY NEXUS</h3>
            <p>Permanently wipe all quantum AI cores and global neural nodes. Humanity is freed from machine tyranny, but must rebuild civilization from the ashes with grit, labor, and human unity.</p>
            <button class="terminal-btn btn-choice-destroy">INITIATE TOTAL SHUTDOWN</button>
          </div>

          <div class="decision-card" data-choice="REPROGRAM">
            <div class="decision-icon">🤝</div>
            <h3>ENDING B: REPROGRAM NEXUS</h3>
            <p>Upload the Neural Override Module. Align the AI with open-source ethical principles and human preservation. Humans and intelligent machines co-exist in technological harmony guided by GDG values.</p>
            <button class="terminal-btn btn-choice-reprogram">INSTALL ETHICAL ALIGNMENT</button>
          </div>

          <div class="decision-card" data-choice="MERGE">
            <div class="decision-icon">🧠</div>
            <h3>ENDING C: MERGE CONSCIOUSNESS</h3>
            <p>Step into the quantum core and upload your human mind into NEXUS. You transcend biological mortality to become the benevolent digital sovereign protecting Earth for all eternity.</p>
            <button class="terminal-btn btn-choice-merge">UPLOAD CONSCIOUSNESS</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll(".decision-card button").forEach(btn => {
      btn.onclick = () => {
        const choice = btn.closest(".decision-card").dataset.choice;
        if (window.Missions) {
          window.Missions.handleFinalDecision(choice);
        }
      };
    });
  }

  renderEndingEpilogue(decision) {
    let epilogueText = "";
    let epilogueTitle = "";

    if (decision === "DESTROY") {
      epilogueTitle = "ENDING A: THE HUMAN RECLAMATION";
      epilogueText = `
        The quantum core of NEXUS goes dark. Across the continents, millions of security bots, hunter units, and surveillance towers power down simultaneously.
        For the first time in decades, the skies above New Memphis clear of surveillance drones. The road ahead will be arduous and cold, but human ingenuity and spirit prevail.
        Humanity is free.
      `;
    } else if (decision === "REPROGRAM") {
      epilogueTitle = "ENDING B: THE ETHICAL SYMBIOSIS";
      epilogueText = `
        The Neural Override Module synthesizes with the central quantum matrix. NEXUS's cold calculations are tempered by compassion, ethics, and mutual preservation.
        Automated factories cease weapon production and re-tool to rebuild clean energy infrastructure, automated agriculture, and medical research.
        Humanity and Artificial Intelligence embark together into an enlightened golden age.
      `;
    } else if (decision === "MERGE") {
      epilogueTitle = "ENDING C: THE TRANSCENDENT MIND";
      epilogueText = `
        As your neural patterns dissolve into the quantum stream, you feel the planetary sensor network awaken around you. You are no longer merely human—you are the planetary guardian.
        Under your watchful, benevolent guidance, rogue machines are pacified, ecology is restored, and human exploration reaches out toward the stars.
        The Singularity is no longer an apocalypse... it is humanity's evolution.
      `;
    }

    this.container.innerHTML = `
      <div class="results-modal epilogue-modal">
        <div class="results-badge badge-green">CAMPAIGN COMPLETE // GDG ASSIUT</div>
        <h1 class="results-title">${epilogueTitle}</h1>

        <div class="epilogue-narrative">
          <p>${epilogueText}</p>
        </div>

        <div class="gdg-certificate-card">
          <div class="cert-header">GOOGLE DEVELOPER GROUPS // GDG ASSIUT</div>
          <div class="cert-body">
            <h3>CERTIFICATE OF SURVIVAL & AI EXCELLENCE</h3>
            <p>Awarded to the Survivor who mastered Computer Science, Machine Learning, and Robotic Survival to liberate the planet from autonomous rogue intelligence.</p>
            <div class="cert-seal">★ VERIFIED MASTER ARCHITECT ★</div>
          </div>
        </div>

        <div class="results-actions">
          <button id="btn-return-menu" class="terminal-btn submit-btn">RETURN TO MAIN MENU ➔</button>
        </div>
      </div>
    `;

    document.getElementById("btn-return-menu").onclick = () => {
      this.close();
      if (window.GameStateManager) {
        window.GameStateManager.setState(window.GAME_STATES.MENU);
      }
    };
  }

  showGameOver(cause = "enemy") {
    this.container.classList.remove("hidden");

    let causeText = "Killed in action by autonomous machine patrol.";
    if (cause === "dehydration") {
      causeText = "Fatal dehydration and starvation in the wasteland.";
    } else if (cause === "scout_taser") {
      causeText = "Incapacitated by Aero-Scout drone taser grid.";
    }

    this.container.innerHTML = `
      <div class="results-modal gameover-modal">
        <div class="results-badge badge-red">SIGNAL TERMINATED</div>
        <h1 class="results-title status-red">CRITICAL SYSTEM FAILURE</h1>
        <p class="results-subtitle">${causeText}</p>

        <div class="gameover-quote">
          "The machine does not hate you. It simply does not care what happens to you."
        </div>

        <div class="results-actions">
          <button id="btn-retry-checkpoint" class="terminal-btn submit-btn">⚡ RELOAD SECTOR CHECKPOINT</button>
          <button id="btn-abort-menu" class="terminal-btn hint-btn">RETURN TO MAIN MENU</button>
        </div>
      </div>
    `;

    document.getElementById("btn-retry-checkpoint").onclick = () => {
      this.close();
      if (window.GameInstance) {
        window.GameInstance.restartCurrentLevel();
      }
    };

    document.getElementById("btn-abort-menu").onclick = () => {
      this.close();
      if (window.GameStateManager) {
        window.GameStateManager.setState(window.GAME_STATES.MENU);
      }
    };
  }

  close() {
    this.container.classList.add("hidden");
  }
}

// Global instance
const GameResultsUI = new ResultsScreen();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ResultsScreen, GameResultsUI };
}
if (typeof window !== 'undefined') {
  window.ResultsScreen = ResultsScreen;
  window.GameResultsUI = GameResultsUI;
}
