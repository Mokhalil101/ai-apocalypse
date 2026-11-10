// AI APOCALYPSE — Global Event Manager
// Decoupled Publish/Subscribe Architecture
// Powered by GDG Assiut

class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, filtered);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    for (let i = 0; i < callbacks.length; i++) {
      try {
        callbacks[i](data);
      } catch (err) {
        console.error(`[EventManager] Error in listener for event '${event}':`, err);
      }
    }
  }

  clear() {
    this.listeners.clear();
  }
}

// Global instance
const Events = new EventManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EventManager, Events };
}
if (typeof window !== 'undefined') {
  window.EventManager = EventManager;
  window.Events = Events;
}
