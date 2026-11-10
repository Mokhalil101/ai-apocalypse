// AI APOCALYPSE — Player Controller & Input Handler (Desktop & Mobile)
// Powered by GDG Assiut

class PlayerController {
  constructor() {
    this.keys = {};
    this.mouse = {
      screenX: 0,
      screenY: 0,
      worldX: 0,
      worldY: 0,
      isDown: false,
      rightDown: false
    };

    // Virtual Touch Joystick
    this.touchJoystick = {
      active: false,
      identifier: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      radius: 60
    };

    // Virtual touch action buttons state
    this.touchActions = {
      attack: false,
      sprint: false,
      interact: false
    };

    this.isTouchDevice = false;
    this.initEventListeners();
  }

  initEventListeners() {
    // Keyboard Down
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      // Handle direct key triggers
      if (e.key === "e" || e.key === "E") {
        if (window.Events) window.Events.emit("interact_pressed");
      } else if (e.key === "i" || e.key === "I") {
        if (window.Events) window.Events.emit("toggle_inventory");
      } else if (e.key === "m" || e.key === "M") {
        if (window.Events) window.Events.emit("toggle_map");
      } else if (e.key === "q" || e.key === "Q") {
        if (window.Events) window.Events.emit("quick_use_pressed");
      } else if (e.key === "Escape") {
        if (window.Events) window.Events.emit("pause_pressed");
      } else if (e.key === "1") {
        if (window.PlayerInventory) window.PlayerInventory.equipWeapon("weapon_blaster");
      } else if (e.key === "2") {
        if (window.PlayerInventory && window.PlayerInventory.unlockedWeapons.includes("weapon_emp")) {
          window.PlayerInventory.equipWeapon("weapon_emp");
        }
      } else if (e.key === "3") {
        if (window.PlayerInventory && window.PlayerInventory.unlockedWeapons.includes("weapon_pulse_rifle")) {
          window.PlayerInventory.equipWeapon("weapon_pulse_rifle");
        }
      } else if (e.key === "4") {
        if (window.PlayerInventory && window.PlayerInventory.unlockedWeapons.includes("weapon_shock_tool")) {
          window.PlayerInventory.equipWeapon("weapon_shock_tool");
        }
      }
    });

    // Keyboard Up
    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    // Mouse Move
    window.addEventListener("mousemove", (e) => {
      this.mouse.screenX = e.clientX;
      this.mouse.screenY = e.clientY;
    });

    // Mouse Down
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.mouse.isDown = true;
      } else if (e.button === 2) {
        this.mouse.rightDown = true;
      }
    });

    // Mouse Up
    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.mouse.isDown = false;
      } else if (e.button === 2) {
        this.mouse.rightDown = false;
      }
    });

    // Detect touch capability
    window.addEventListener("touchstart", () => {
      this.isTouchDevice = true;
    }, { once: true });
  }

  // Update world mouse position given camera offset
  updateCamera(cameraX, cameraY) {
    this.mouse.worldX = this.mouse.screenX + cameraX;
    this.mouse.worldY = this.mouse.screenY + cameraY;
  }

  // Calculate normalized movement vector [-1 to 1]
  getMovementVector() {
    let dx = 0;
    let dy = 0;

    // Keyboard inputs: WASD or Arrow Keys
    if (this.keys["w"] || this.keys["arrowup"]) dy -= 1;
    if (this.keys["s"] || this.keys["arrowdown"]) dy += 1;
    if (this.keys["a"] || this.keys["arrowleft"]) dx -= 1;
    if (this.keys["d"] || this.keys["arrowright"]) dx += 1;

    // Apply Touch Joystick if active
    if (this.touchJoystick.active) {
      dx += this.touchJoystick.deltaX;
      dy += this.touchJoystick.deltaY;
    }

    const length = Math.hypot(dx, dy);
    if (length > 1.0) {
      dx /= length;
      dy /= length;
    }

    return { x: dx, y: dy };
  }

  isSprinting() {
    return (this.keys["shift"] || this.keys["shiftleft"] || this.keys["shiftright"] || this.touchActions.sprint);
  }

  isAttacking() {
    return this.mouse.isDown || this.touchActions.attack;
  }

  // Touch handlers for virtual joystick
  handleTouchStart(e, canvasRect) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const tx = touch.clientX - canvasRect.left;
      const ty = touch.clientY - canvasRect.top;

      // If left half of screen and joystick not active
      if (tx < canvasRect.width * 0.45 && !this.touchJoystick.active) {
        this.touchJoystick.active = true;
        this.touchJoystick.identifier = touch.identifier;
        this.touchJoystick.startX = tx;
        this.touchJoystick.startY = ty;
        this.touchJoystick.currentX = tx;
        this.touchJoystick.currentY = ty;
        this.touchJoystick.deltaX = 0;
        this.touchJoystick.deltaY = 0;
      }
    }
  }

  handleTouchMove(e, canvasRect) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.touchJoystick.identifier) {
        const tx = touch.clientX - canvasRect.left;
        const ty = touch.clientY - canvasRect.top;
        this.touchJoystick.currentX = tx;
        this.touchJoystick.currentY = ty;

        const diffX = tx - this.touchJoystick.startX;
        const diffY = ty - this.touchJoystick.startY;
        const dist = Math.hypot(diffX, diffY);
        const maxR = this.touchJoystick.radius;

        if (dist > 0) {
          const clamped = Math.min(dist, maxR);
          this.touchJoystick.deltaX = (diffX / dist) * (clamped / maxR);
          this.touchJoystick.deltaY = (diffY / dist) * (clamped / maxR);
        } else {
          this.touchJoystick.deltaX = 0;
          this.touchJoystick.deltaY = 0;
        }
      }
    }
  }

  handleTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.touchJoystick.identifier) {
        this.touchJoystick.active = false;
        this.touchJoystick.identifier = null;
        this.touchJoystick.deltaX = 0;
        this.touchJoystick.deltaY = 0;
      }
    }
  }
}

// Global instance
const InputController = new PlayerController();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PlayerController, InputController };
}
if (typeof window !== 'undefined') {
  window.PlayerController = PlayerController;
  window.InputController = InputController;
}
