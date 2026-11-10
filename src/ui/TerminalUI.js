// AI APOCALYPSE — Interactive Cyber Terminal UI (10 Formats)
// Powered by GDG Assiut

class TerminalUI {
  constructor() {
    this.container = null;
    this.challenge = null;
    this.currentSubmission = null;
    this.cliHistory = [];
    this.initDOM();
  }

  initDOM() {
    let el = document.getElementById("terminal-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "terminal-overlay";
      el.className = "terminal-overlay hidden";
      document.body.appendChild(el);
    }
    this.container = el;
  }

  open(challenge) {
    this.challenge = challenge;
    this.currentSubmission = null;
    this.cliHistory = [];

    // Pre-initialize format submissions
    if (challenge.type === "binary_converter") {
      this.currentSubmission = "00000000";
    } else if (challenge.type === "logic_gate") {
      this.currentSubmission = { A: 0, B: 0 };
    } else if (challenge.type === "arrange_steps") {
      // Shuffle initial steps
      this.currentSubmission = [...challenge.steps].sort(() => Math.random() - 0.5);
    } else if (challenge.type === "match_concepts") {
      this.currentSubmission = {};
      this.selectedKey = null;
    }

    this.container.classList.remove("hidden");
    this.render();
  }

  close() {
    this.container.classList.add("hidden");
    if (window.Challenges) {
      window.Challenges.closeChallenge();
    }
  }

  render() {
    if (!this.challenge) return;
    const ch = this.challenge;

    const diffBadgeCol = {
      easy: "#34A853",
      medium: "#4285F4",
      hard: "#FBBC04",
      expert: "#EA4335"
    }[ch.difficulty] || "#4285F4";

    let bodyHTML = "";

    switch (ch.type) {
      case "multiple_choice":
      case "true_false":
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="terminal-options-grid">
            ${ch.options.map((opt, idx) => `
              <button class="terminal-btn option-btn ${this.currentSubmission === opt ? 'selected' : ''}" data-val="${opt}">
                <span class="opt-num">[${idx + 1}]</span> ${opt}
              </button>
            `).join("")}
          </div>
        `;
        break;

      case "predict_output":
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <pre class="terminal-code"><code>${this.escapeHTML(ch.codeSnippet)}</code></pre>
          <div class="terminal-options-grid">
            ${ch.options.map(opt => `
              <button class="terminal-btn option-btn ${this.currentSubmission === opt ? 'selected' : ''}" data-val="${opt}">
                ${opt}
              </button>
            `).join("")}
          </div>
        `;
        break;

      case "find_bug":
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <pre class="terminal-code clickable-code"><code>${this.escapeHTML(ch.codeSnippet)}</code></pre>
          <div class="terminal-options-grid">
            ${ch.options.map(opt => `
              <button class="terminal-btn option-btn ${this.currentSubmission === opt ? 'selected' : ''}" data-val="${opt}">
                ${opt}
              </button>
            `).join("")}
          </div>
        `;
        break;

      case "complete_code":
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <pre class="terminal-code"><code>${this.escapeHTML(ch.codeSnippet)}</code></pre>
          <div class="terminal-options-grid">
            ${ch.options.map(opt => `
              <button class="terminal-btn option-btn ${this.currentSubmission === opt ? 'selected' : ''}" data-val="${opt}">
                ${opt}
              </button>
            `).join("")}
          </div>
        `;
        break;

      case "binary_converter":
        const bits = (this.currentSubmission || "00000000").split("");
        const decVal = parseInt(bits.join(""), 2);
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="binary-toggles-container">
            ${bits.map((b, idx) => {
              const placeVal = Math.pow(2, 7 - idx);
              return `
                <div class="bit-card">
                  <div class="bit-label">2<sup>${7 - idx}</sup> (${placeVal})</div>
                  <button class="bit-toggle-btn ${b === '1' ? 'bit-on' : 'bit-off'}" data-bit-idx="${idx}">
                    ${b}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
          <div class="binary-readout">
            Current Decimal Sum: <span class="readout-val ${decVal === ch.targetDecimal ? 'readout-match' : ''}">${decVal}</span> / Target: <span class="readout-target">${ch.targetDecimal}</span>
          </div>
        `;
        break;

      case "match_concepts":
        const pairs = ch.pairs || [];
        const leftKeys = pairs.map(p => p.key);
        const rightVals = [...pairs.map(p => p.val)].sort(() => 0.5 - Math.random());
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="match-concepts-container">
            <div class="match-col">
              <h4>CONCEPTS</h4>
              ${leftKeys.map(k => `
                <div class="concept-item ${this.selectedKey === k ? 'concept-selected' : ''}" data-key="${k}">
                  ${k} ${this.currentSubmission[k] ? `➔ <span class="linked-val">${this.currentSubmission[k]}</span>` : ''}
                </div>
              `).join("")}
            </div>
            <div class="match-col">
              <h4>DEFINITIONS</h4>
              ${rightVals.map(v => `
                <div class="definition-item" data-val="${v}">
                  ${v}
                </div>
              `).join("")}
            </div>
          </div>
        `;
        break;

      case "arrange_steps":
        const steps = this.currentSubmission || ch.steps;
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="arrange-steps-list">
            ${steps.map((st, idx) => `
              <div class="step-card">
                <span class="step-num">[${idx + 1}]</span>
                <span class="step-text">${st}</span>
                <div class="step-btns">
                  <button class="step-move-btn" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
                  <button class="step-move-btn" data-dir="down" data-idx="${idx}" ${idx === steps.length - 1 ? 'disabled' : ''}>▼</button>
                </div>
              </div>
            `).join("")}
          </div>
        `;
        break;

      case "logic_gate":
        const inputs = this.currentSubmission || { A: 0, B: 0 };
        const output = (ch.gateType === "XOR") ? (inputs.A ^ inputs.B) : (!(inputs.A && inputs.B) ? 1 : 0);
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="logic-circuit-board">
            <div class="gate-inputs">
              <button class="logic-input-btn ${inputs.A === 1 ? 'logic-high' : 'logic-low'}" data-input="A">
                INPUT A: ${inputs.A}
              </button>
              <button class="logic-input-btn ${inputs.B === 1 ? 'logic-high' : 'logic-low'}" data-input="B">
                INPUT B: ${inputs.B}
              </button>
            </div>
            <div class="gate-symbol">
              [ ${ch.gateType} GATE ]
            </div>
            <div class="gate-output ${output === ch.targetOutput ? 'output-match' : 'output-fail'}">
              OUTPUT: ${output} (Target: ${ch.targetOutput})
            </div>
          </div>
        `;
        break;

      case "terminal_cli":
        bodyHTML = `
          <div class="terminal-question">${ch.question}</div>
          <div class="cli-console">
            <div class="cli-output">
              <div class="cli-line">NEXUS SECURE SHELL v4.19 (GDG ASSIUT OS)</div>
              <div class="cli-line">Type 'help' to inspect authorized terminal commands.</div>
              ${this.cliHistory.map(h => `<div class="cli-line ${h.type || ''}">${this.escapeHTML(h.text)}</div>`).join("")}
            </div>
            <form id="cli-form" class="cli-input-form">
              <span class="cli-prompt">nexus@operator:~$</span>
              <input type="text" id="cli-input" class="cli-input-field" autofocus autocomplete="off" />
              <button type="submit" class="terminal-btn cli-submit-btn">RUN</button>
            </form>
          </div>
        `;
        break;
    }

    this.container.innerHTML = `
      <div class="terminal-modal crt">
        <div class="terminal-header">
          <div class="term-title-group">
            <span class="term-status-dot"></span>
            <span class="term-title">TERMINAL // ${ch.title}</span>
            <span class="term-category">[${ch.category}]</span>
          </div>
          <div class="term-header-actions">
            <span class="diff-badge" style="background:${diffBadgeCol}">${ch.difficulty.toUpperCase()}</span>
            <button id="term-close-btn" class="term-icon-btn">✕</button>
          </div>
        </div>

        <div class="terminal-body">
          ${bodyHTML}
        </div>

        <div id="term-feedback" class="terminal-feedback hidden"></div>

        <div class="terminal-footer">
          <div class="footer-left">
            <button id="term-hint-btn" class="terminal-btn hint-btn">💡 REQUEST HINT (-10 EN)</button>
          </div>
          <div class="footer-right">
            ${ch.type !== 'terminal_cli' ? `<button id="term-submit-btn" class="terminal-btn submit-btn">⚡ EXECUTE OVERRIDE</button>` : ''}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = document.getElementById("term-close-btn");
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Hint button
    const hintBtn = document.getElementById("term-hint-btn");
    if (hintBtn) {
      hintBtn.onclick = () => {
        if (window.Challenges) {
          const res = window.Challenges.requestHint();
          this.showFeedback(res.success ? `[ORION ADVICE]: ${res.hint}` : res.message, res.success ? "hint" : "error");
        }
      };
    }

    // Submit button
    const submitBtn = document.getElementById("term-submit-btn");
    if (submitBtn) {
      submitBtn.onclick = () => this.submit();
    }

    // Option buttons (Multiple choice, true/false, predict output, complete code, find bug)
    this.container.querySelectorAll(".option-btn").forEach(btn => {
      btn.onclick = () => {
        this.currentSubmission = btn.dataset.val;
        this.container.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
      };
    });

    // Binary toggle buttons
    this.container.querySelectorAll(".bit-toggle-btn").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.bitIdx, 10);
        const bits = (this.currentSubmission || "00000000").split("");
        bits[idx] = bits[idx] === "1" ? "0" : "1";
        this.currentSubmission = bits.join("");
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
        this.render();
      };
    });

    // Match concepts clicks
    this.container.querySelectorAll(".concept-item").forEach(el => {
      el.onclick = () => {
        this.selectedKey = el.dataset.key;
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
        this.render();
      };
    });
    this.container.querySelectorAll(".definition-item").forEach(el => {
      el.onclick = () => {
        if (this.selectedKey) {
          this.currentSubmission[this.selectedKey] = el.dataset.val;
          this.selectedKey = null;
          if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
          this.render();
        }
      };
    });

    // Arrange steps buttons
    this.container.querySelectorAll(".step-move-btn").forEach(btn => {
      btn.onclick = () => {
        const dir = btn.dataset.dir;
        const idx = parseInt(btn.dataset.idx, 10);
        const steps = [...this.currentSubmission];
        const swapIdx = dir === "up" ? idx - 1 : idx + 1;
        if (swapIdx >= 0 && swapIdx < steps.length) {
          const temp = steps[idx];
          steps[idx] = steps[swapIdx];
          steps[swapIdx] = temp;
          this.currentSubmission = steps;
          if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
          this.render();
        }
      };
    });

    // Logic gate buttons
    this.container.querySelectorAll(".logic-input-btn").forEach(btn => {
      btn.onclick = () => {
        const inp = btn.dataset.input;
        this.currentSubmission[inp] = this.currentSubmission[inp] === 1 ? 0 : 1;
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
        this.render();
      };
    });

    // Terminal CLI form
    const cliForm = document.getElementById("cli-form");
    if (cliForm) {
      cliForm.onsubmit = (e) => {
        e.preventDefault();
        const inputField = document.getElementById("cli-input");
        const val = inputField.value.trim();
        if (!val) return;
        inputField.value = "";

        this.handleCliCommand(val);
      };
    }
  }

  handleCliCommand(cmd) {
    this.cliHistory.push({ text: `nexus@operator:~$ ${cmd}`, type: "command" });

    if (cmd.toLowerCase() === "clear") {
      this.cliHistory = [];
      this.render();
      return;
    }

    const ch = this.challenge;
    let foundCmd = null;

    if (ch.cliCommands) {
      foundCmd = ch.cliCommands.find(c => c.cmd.toLowerCase() === cmd.toLowerCase());
    }

    if (foundCmd) {
      this.cliHistory.push({ text: foundCmd.response, type: "response" });
    } else {
      this.cliHistory.push({ text: `bash: ${cmd}: command not found. Type 'help' for available commands.`, type: "error" });
    }

    if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
    this.render();

    // Check if target goal command
    if (cmd.toLowerCase() === ch.targetCommand.toLowerCase()) {
      this.submit(cmd);
    }
  }

  submit(overrideVal = null) {
    const val = overrideVal || this.currentSubmission;
    if (val === null || val === undefined) {
      this.showFeedback("Please configure or select your solution first.", "error");
      return;
    }

    if (window.Challenges) {
      const res = window.Challenges.validateAnswer(val);
      if (res.success) {
        this.showFeedback(`[SUCCESS] ${res.message}\n\nEXPLANATION:\n${res.explanation}`, "success");
        setTimeout(() => {
          this.close();
        }, 3200);
      } else {
        this.showFeedback(`[ERROR] ${res.message}`, "error");
      }
    }
  }

  showFeedback(text, type = "info") {
    const fb = document.getElementById("term-feedback");
    if (!fb) return;
    fb.className = `terminal-feedback ${type}`;
    fb.innerText = text;
    fb.classList.remove("hidden");
  }

  escapeHTML(str) {
    return (str || "").replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

// Global instance
const GameTerminalUI = new TerminalUI();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TerminalUI, GameTerminalUI };
}
if (typeof window !== 'undefined') {
  window.TerminalUI = TerminalUI;
  window.GameTerminalUI = GameTerminalUI;
}
