// AI APOCALYPSE — Inventory, Crafting, Upgrades & Achievements UI Modal
// Powered by GDG Assiut

class InventoryUI {
  constructor() {
    this.container = null;
    this.activeTab = "inventory"; // 'inventory', 'crafting', 'upgrades', 'achievements'
    this.selectedItemId = null;
    this.initDOM();
  }

  initDOM() {
    let el = document.getElementById("inventory-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "inventory-overlay";
      el.className = "inventory-overlay hidden";
      document.body.appendChild(el);
    }
    this.container = el;
  }

  open(tab = "inventory") {
    this.activeTab = tab;
    this.container.classList.remove("hidden");
    this.render();
  }

  close() {
    this.container.classList.add("hidden");
    if (window.GameStateManager && window.GameStateManager.currentState === window.GAME_STATES.INVENTORY) {
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="inv-modal">
        <div class="inv-header">
          <div class="inv-tabs">
            <button class="inv-tab-btn ${this.activeTab === 'inventory' ? 'active' : ''}" data-tab="inventory">🎒 INVENTORY</button>
            <button class="inv-tab-btn ${this.activeTab === 'crafting' ? 'active' : ''}" data-tab="crafting">⚙️ CRAFTING</button>
            <button class="inv-tab-btn ${this.activeTab === 'upgrades' ? 'active' : ''}" data-tab="upgrades">⚡ UPGRADES</button>
            <button class="inv-tab-btn ${this.activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">🏆 ACHIEVEMENTS</button>
          </div>
          <button id="inv-close-btn" class="term-icon-btn">✕</button>
        </div>

        <div class="inv-content">
          ${this.renderActiveTab()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActiveTab() {
    switch (this.activeTab) {
      case "inventory": return this.renderInventoryTab();
      case "crafting": return this.renderCraftingTab();
      case "upgrades": return this.renderUpgradesTab();
      case "achievements": return this.renderAchievementsTab();
      default: return "";
    }
  }

  renderInventoryTab() {
    const inv = window.PlayerInventory;
    if (!inv) return "<div>No inventory loaded</div>";

    const slots = inv.slots || [];
    const capacity = inv.getCapacity();
    const selectedItem = this.selectedItemId && window.ITEMS_DATA ? window.ITEMS_DATA[this.selectedItemId] : null;

    let gridHTML = "";
    for (let i = 0; i < capacity; i++) {
      const slot = slots[i];
      if (slot) {
        const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[slot.itemId] : null;
        const isEquipped = (inv.equippedWeaponId === slot.itemId || inv.equippedArmorId === slot.itemId);
        gridHTML += `
          <div class="inv-slot filled ${this.selectedItemId === slot.itemId ? 'selected-slot' : ''}" data-item-id="${slot.itemId}">
            <div class="slot-qty">x${slot.qty}</div>
            <div class="slot-name">${itemData ? itemData.name : slot.itemId}</div>
            ${isEquipped ? `<div class="slot-equipped-badge">EQUIPPED</div>` : ''}
          </div>
        `;
      } else {
        gridHTML += `<div class="inv-slot empty"></div>`;
      }
    }

    return `
      <div class="inv-split-layout">
        <div class="inv-grid-section">
          <div class="section-sub-header">SLOTS USED: ${slots.length} / ${capacity}</div>
          <div class="inv-grid">
            ${gridHTML}
          </div>
        </div>

        <div class="inv-details-panel">
          ${selectedItem ? `
            <div class="item-detail-header">
              <h3>${selectedItem.name}</h3>
              <span class="category-badge">${selectedItem.category.toUpperCase()}</span>
            </div>
            <p class="item-desc">${selectedItem.description}</p>
            ${selectedItem.damage ? `<div class="stat-row">Damage: <strong>${selectedItem.damage}</strong></div>` : ''}
            ${selectedItem.defense ? `<div class="stat-row">Damage Absorption: <strong>${selectedItem.defense}%</strong></div>` : ''}
            ${selectedItem.energyCost !== undefined ? `<div class="stat-row">Energy Cost: <strong>${selectedItem.energyCost} EN</strong></div>` : ''}

            <div class="item-actions">
              ${selectedItem.category === 'consumable' ? `<button id="btn-use-item" class="terminal-btn submit-btn" data-id="${selectedItem.id}">USE CONSUMABLE</button>` : ''}
              ${selectedItem.category === 'equipment' && selectedItem.slot === 'weapon' ? `<button id="btn-equip-weapon" class="terminal-btn submit-btn" data-id="${selectedItem.id}">EQUIP WEAPON</button>` : ''}
              ${selectedItem.category === 'equipment' && selectedItem.slot === 'armor' ? `<button id="btn-equip-armor" class="terminal-btn submit-btn" data-id="${selectedItem.id}">EQUIP ARMOR</button>` : ''}
            </div>
          ` : `
            <div class="empty-detail-prompt">Select an item from your pack to view technical specs and actions.</div>
          `}
        </div>
      </div>
    `;
  }

  renderCraftingTab() {
    const crafter = window.Crafter;
    const inv = window.PlayerInventory;
    if (!crafter || !inv) return "";

    const recipes = crafter.getRecipes();

    return `
      <div class="crafting-layout">
        <div class="section-sub-header">FIELD SYNTHESIS BENCH // BLUEPRINTS</div>
        <div class="recipes-list">
          ${recipes.map(rec => {
            const canCraft = crafter.canCraft(rec.id);
            const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[rec.outputItemId] : null;

            return `
              <div class="recipe-card ${canCraft ? 'recipe-available' : 'recipe-locked'}">
                <div class="recipe-info">
                  <h4>${rec.name} <span class="recipe-cat">[${rec.category.toUpperCase()}]</span></h4>
                  <p>${rec.description}</p>
                  <div class="ingredients-row">
                    ${rec.ingredients.map(ing => {
                      const have = inv.getItemCount(ing.itemId);
                      const reqItem = window.ITEMS_DATA ? window.ITEMS_DATA[ing.itemId] : null;
                      const hasEnough = have >= ing.qty;
                      return `
                        <span class="ing-badge ${hasEnough ? 'ing-met' : 'ing-missing'}">
                          ${reqItem ? reqItem.name : ing.itemId}: ${have}/${ing.qty}
                        </span>
                      `;
                    }).join("")}
                  </div>
                </div>
                <div class="recipe-action">
                  <button class="terminal-btn craft-btn ${canCraft ? 'submit-btn' : 'disabled'}" data-recipe-id="${rec.id}" ${canCraft ? '' : 'disabled'}>
                    SYNTHESIZE (x${rec.outputQty})
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  renderUpgradesTab() {
    const stats = window.Stats;
    const xp = window.PlayerXP;
    if (!stats || !xp) return "";

    const upgradesList = [
      { id: "weaponDamageTier", name: "Plasma Coil Overdrive", desc: "+20% Weapon Damage across all weapons", maxTier: 4, cost: 1 },
      { id: "armorDefenseTier", name: "Ballistic Nanoweave Plating", desc: "+8% Damage Absorption per tier", maxTier: 4, cost: 1 },
      { id: "scannerRangeTier", name: "LIDAR Radar Range", desc: "+180px Minimap & Vision Scanning Range", maxTier: 3, cost: 1 },
      { id: "energyCapacityTier", name: "Superconducting Battery Cells", desc: "+25 Max Energy Capacity", maxTier: 4, cost: 1 },
      { id: "healthCapacityTier", name: "Biomechanical Cellular Enhancer", desc: "+25 Max Health Capacity", maxTier: 4, cost: 1 },
      { id: "movementSpeedTier", name: "Hydraulic Exoskeleton Servos", desc: "+12% Movement & Sprint Velocity", maxTier: 3, cost: 1 },
      { id: "inventoryCapacityTier", name: "Tactical Modular Rig", desc: "+4 Extra Inventory Storage Slots", maxTier: 3, cost: 1 }
    ];

    return `
      <div class="upgrades-layout">
        <div class="upgrades-status-bar">
          <div>AVAILABLE SKILL POINTS: <strong class="points-val">${xp.skillPoints}</strong></div>
          <div>CURRENT TITLE: <strong class="title-val">${xp.getTitle()} (Level ${xp.level})</strong></div>
        </div>

        <div class="upgrades-grid">
          ${upgradesList.map(up => {
            const curTier = stats.upgrades[up.id] || 0;
            const isMax = curTier >= up.maxTier;
            const canAfford = xp.skillPoints >= up.cost && !isMax;

            return `
              <div class="upgrade-card ${isMax ? 'upgrade-maxed' : ''}">
                <div class="upgrade-info">
                  <h4>${up.name}</h4>
                  <div class="tier-indicator">TIER: ${curTier} / ${up.maxTier}</div>
                  <p>${up.desc}</p>
                </div>
                <div class="upgrade-action">
                  <button class="terminal-btn ${canAfford ? 'submit-btn' : 'disabled'}" data-upgrade-id="${up.id}" ${canAfford ? '' : 'disabled'}>
                    ${isMax ? 'MAX TIER' : `UPGRADE (-${up.cost} PT)`}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  renderAchievementsTab() {
    const achManager = window.Achievements;
    if (!achManager) return "";

    const all = achManager.getAll();
    const unlockedCount = all.filter(a => a.unlocked).length;

    return `
      <div class="achievements-layout">
        <div class="section-sub-header">COMMUNITY MILESTONES // UNLOCKED: ${unlockedCount} / ${all.length}</div>
        <div class="achievements-list">
          ${all.map(a => `
            <div class="ach-card ${a.unlocked ? 'ach-unlocked' : 'ach-locked'}">
              <div class="ach-badge">${a.unlocked ? '🏆' : '🔒'}</div>
              <div class="ach-info">
                <h4>${a.title}</h4>
                <p>${a.description}</p>
              </div>
              <div class="ach-reward">+${a.xpReward} XP</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Close button
    const closeBtn = document.getElementById("inv-close-btn");
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Tab buttons
    this.container.querySelectorAll(".inv-tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
        this.render();
      };
    });

    // Slot click
    this.container.querySelectorAll(".inv-slot.filled").forEach(slot => {
      slot.onclick = () => {
        this.selectedItemId = slot.dataset.itemId;
        if (window.AudioManager) window.AudioManager.playSfx("terminal_key");
        this.render();
      };
    });

    // Use consumable
    const useBtn = document.getElementById("btn-use-item");
    if (useBtn) {
      useBtn.onclick = () => {
        const id = useBtn.dataset.id;
        if (window.PlayerInventory) {
          window.PlayerInventory.useItem(id);
          this.render();
        }
      };
    }

    // Equip weapon
    const equipWepBtn = document.getElementById("btn-equip-weapon");
    if (equipWepBtn) {
      equipWepBtn.onclick = () => {
        const id = equipWepBtn.dataset.id;
        if (window.PlayerInventory) {
          window.PlayerInventory.equipWeapon(id);
          this.render();
        }
      };
    }

    // Equip armor
    const equipArmBtn = document.getElementById("btn-equip-armor");
    if (equipArmBtn) {
      equipArmBtn.onclick = () => {
        const id = equipArmBtn.dataset.id;
        if (window.PlayerInventory) {
          window.PlayerInventory.equipArmor(id);
          this.render();
        }
      };
    }

    // Craft button
    this.container.querySelectorAll(".craft-btn").forEach(btn => {
      btn.onclick = () => {
        const recId = btn.dataset.recipeId;
        if (window.Crafter) {
          window.Crafter.craft(recId);
          this.render();
        }
      };
    });

    // Upgrade button
    this.container.querySelectorAll("[data-upgrade-id]").forEach(btn => {
      btn.onclick = () => {
        const upId = btn.dataset.upgradeId;
        const xp = window.PlayerXP;
        const stats = window.Stats;
        if (xp && stats && xp.spendSkillPoint()) {
          stats.upgrades[upId] = (stats.upgrades[upId] || 0) + 1;
          stats.recalculateCaps();
          if (window.AudioManager) window.AudioManager.playSfx("success");
          this.render();
        }
      };
    });
  }
}

// Global instance
const GameInventoryUI = new InventoryUI();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InventoryUI, GameInventoryUI };
}
if (typeof window !== 'undefined') {
  window.InventoryUI = InventoryUI;
  window.GameInventoryUI = GameInventoryUI;
}
