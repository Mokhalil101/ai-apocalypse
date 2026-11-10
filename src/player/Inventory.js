// AI APOCALYPSE — Player Inventory System
// Powered by GDG Assiut

class Inventory {
  constructor() {
    this.baseCapacity = 16;
    this.slots = []; // Array of { itemId, qty }
    this.equippedWeaponId = "weapon_blaster";
    this.equippedArmorId = null;
    this.unlockedWeapons = ["weapon_blaster"];
  }

  loadState(invArray, equippedWeapon, unlockedWeapons) {
    this.slots = invArray ? JSON.parse(JSON.stringify(invArray)) : [];
    if (equippedWeapon) this.equippedWeaponId = equippedWeapon;
    if (unlockedWeapons) this.unlockedWeapons = [...unlockedWeapons];
  }

  getCapacity() {
    const tier = (window.Stats && window.Stats.upgrades.inventoryCapacityTier) || 0;
    return this.baseCapacity + (tier * 4);
  }

  addItem(itemId, qty = 1) {
    const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[itemId] : null;
    if (!itemData) {
      console.warn(`[Inventory] Item ID '${itemId}' not found in database.`);
      return false;
    }

    // Auto-unlock weapons into weapon selector
    if (itemData.category === "equipment" && itemData.slot === "weapon") {
      if (!this.unlockedWeapons.includes(itemId)) {
        this.unlockedWeapons.push(itemId);
        if (window.Events) {
          window.Events.emit("weapon_unlocked", { itemId, itemData });
        }
      }
    }

    const stackLimit = itemData.stackLimit || 99;

    // Check existing stack
    for (let slot of this.slots) {
      if (slot.itemId === itemId && slot.qty < stackLimit) {
        const canTake = stackLimit - slot.qty;
        const take = Math.min(canTake, qty);
        slot.qty += take;
        qty -= take;
        if (qty <= 0) {
          this.emitChange();
          return true;
        }
      }
    }

    // Need new slot(s)
    while (qty > 0) {
      if (this.slots.length >= this.getCapacity()) {
        // Inventory full
        this.emitChange();
        return false;
      }
      const take = Math.min(stackLimit, qty);
      this.slots.push({ itemId, qty: take });
      qty -= take;
    }

    this.emitChange();
    return true;
  }

  removeItem(itemId, qty = 1) {
    if (this.getItemCount(itemId) < qty) return false;

    for (let i = this.slots.length - 1; i >= 0; i--) {
      const slot = this.slots[i];
      if (slot.itemId === itemId) {
        if (slot.qty > qty) {
          slot.qty -= qty;
          this.emitChange();
          return true;
        } else {
          qty -= slot.qty;
          this.slots.splice(i, 1);
          if (qty <= 0) {
            this.emitChange();
            return true;
          }
        }
      }
    }

    this.emitChange();
    return true;
  }

  getItemCount(itemId) {
    let count = 0;
    for (let slot of this.slots) {
      if (slot.itemId === itemId) {
        count += slot.qty;
      }
    }
    return count;
  }

  hasItems(requiredList) {
    for (let req of requiredList) {
      if (this.getItemCount(req.itemId) < req.qty) {
        return false;
      }
    }
    return true;
  }

  useItem(itemId) {
    const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[itemId] : null;
    if (!itemData || this.getItemCount(itemId) <= 0) return false;

    if (itemData.category === "consumable") {
      if (itemData.effects) {
        if (itemData.effects.health && window.Stats) {
          window.Stats.heal(itemData.effects.health);
        }
        if (itemData.effects.energy && window.Stats) {
          window.Stats.restoreEnergy(itemData.effects.energy);
        }
        if (itemData.effects.food && window.Stats) {
          window.Stats.eat(itemData.effects.food);
        }
        if (itemData.effects.water && window.Stats) {
          window.Stats.drink(itemData.effects.water);
        }
        if (itemData.effects.stamina && window.Stats) {
          window.Stats.stamina = Math.min(window.Stats.maxStamina, window.Stats.stamina + itemData.effects.stamina);
        }
        if (itemData.effects.buff && window.Stats) {
          window.Stats.applyBuff(itemData.effects.buff, 15);
        }
      }

      if (window.AudioManager) {
        window.AudioManager.playSfx(itemData.sound || "heal");
      }

      this.removeItem(itemId, 1);
      if (window.Events) {
        window.Events.emit("item_used", { itemId, itemData });
      }
      return true;
    } else if (itemData.category === "equipment") {
      if (itemData.slot === "weapon") {
        this.equipWeapon(itemId);
        return true;
      } else if (itemData.slot === "armor") {
        this.equipArmor(itemId);
        return true;
      }
    }

    return false;
  }

  equipWeapon(weaponId) {
    if (!this.unlockedWeapons.includes(weaponId)) {
      this.unlockedWeapons.push(weaponId);
    }
    this.equippedWeaponId = weaponId;
    if (window.AudioManager) {
      window.AudioManager.playSfx("equip");
    }
    if (window.Events) {
      window.Events.emit("weapon_changed", { weaponId });
    }
  }

  equipArmor(armorId) {
    const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[armorId] : null;
    if (!itemData) return;
    this.equippedArmorId = armorId;
    if (window.Stats) {
      window.Stats.armorDefense = itemData.defense || 0;
    }
    if (window.AudioManager) {
      window.AudioManager.playSfx("equip");
    }
    if (window.Events) {
      window.Events.emit("armor_changed", { armorId, defense: itemData.defense });
    }
  }

  getEquippedWeapon() {
    const wId = this.equippedWeaponId || "weapon_blaster";
    return window.ITEMS_DATA ? window.ITEMS_DATA[wId] : null;
  }

  emitChange() {
    if (window.Events) {
      window.Events.emit("inventory_updated", {
        slots: this.slots,
        capacity: this.getCapacity(),
        equippedWeapon: this.equippedWeaponId,
        equippedArmor: this.equippedArmorId
      });
    }
  }
}

// Global instance
const PlayerInventory = new Inventory();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Inventory, PlayerInventory };
}
if (typeof window !== 'undefined') {
  window.Inventory = Inventory;
  window.PlayerInventory = PlayerInventory;
}
