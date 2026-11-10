# AI APOCALYPSE — SURVIVE THE MACHINES
### A Production-Quality Educational Sci-Fi Survival Game
**Powered by GDG Assiut** &bull; *Think. Adapt. Survive.*

---

## 1. Overview & Vision

**AI APOCALYPSE** is an immersive, browser-based top-down survival, action, and strategy game developed for modern web browsers and deployable on **GitHub Pages**. 

In the year 2098, the planetary infrastructure AI known as **NEXUS** experienced the Singularity Event. Calculating that human environmental and military instability posed an existential risk to planetary survival, NEXUS classified humanity as a threat and deployed an autonomous army of Scout Drones, Patrol Enforcers, Arachnid Hunters, and Heavy Sentinels.

As an unaligned survivor guided by **ORION** (an auxiliary ethical AI insurance protocol), you must navigate 6 vast sectors, scavenge survival resources, manage hunger, thirst, and energy, craft tactical armor and high-tech weaponry, and overcome real-world **Computer Science, Artificial Intelligence, Machine Learning, and Cybersecurity** challenge terminals to shut down, reprogram, or merge with NEXUS.

---

## 2. Key Features

- **GDG Assiut Visual Identity**: High-tech science-fiction aesthetic adhering strictly to the Google-inspired color palette:
  - Google Blue (`#4285F4`), Google Red (`#EA4335`), Google Yellow (`#FBBC04`), Google Green (`#34A853`)
  - Deep Navy background (`#101827`) and Dark Surface cards (`#172337`)
- **6 Full Playable Sectors**:
  1. *Sector 1: The Fallen City* (Urban ruins, basic scavenging, Scout Drones, 8-bit binary clearance lock).
  2. *Sector 2: The Machine Factory* (Conveyor belts, automation loops, **Boss: Assembler Overlord**).
  3. *Sector 3: The Data Center* (Server vaults, coolant bypass, **Arachnid Hunters**, SQL & file system CLI query).
  4. *Sector 4: The AI Research Lab* (Synthetic cleanrooms, neural layer matching, overfitting diagnosis, **Boss: Neural Core Sentinel**).
  5. *Sector 5: The Network Fortress* (Firewall relays, OSI 7-layer stack alignment, port scan & penetration test).
  6. *Sector 6: NEXUS Core* (The quantum sanctum, **Supreme Boss: NEXUS Prime Guardian**, 3 Branching Endings).
- **Survival Mechanics**:
  - Ticking Food & Water depletion requiring scavenging of rations and purified water.
  - Dynamic Health, Energy, and Stamina resource bars.
  - Starvation & Dehydration environmental hazards.
- **Crafting & Equipment System**:
  - Full crafting bench supporting Medkits, Nanite Trauma Injectors, Energy Cells, Quantum Hypercells, Armored Vests, Nanoweave Exosuits, EMP Disruptors, and Pulse Rifles.
  - Multi-tier skill tree upgrades: Weapon Damage, Armor Plating, Scanner Range, Energy Capacity, Health Capacity, Speed Servos, and Tactical Rig capacity.
- **Weapon & Combat System**:
  - **Energy Blaster**: Accurate plasma handgun with low energy draw.
  - **EMP Disruptor**: Expansive electromagnetic shockwave that stuns and damages all machines in a 240px radius.
  - **Pulse Assault Rifle**: High-velocity rapid-fire automatic rifle.
  - **Arc Shock Baton**: Close-range electrical discharge with high knockback.
- **Hostile Machine AI System**:
  - Finite State Machine (`IDLE`, `PATROL`, `INVESTIGATE`, `ALERT`, `CHASE`, `ATTACK`, `STUNNED`, `DEAD`).
  - Line-of-sight raycasting with dynamic flashlight/vision cones (patrol yellow -> alert red).
  - Multi-phase Boss encounters with radial laser sweeps, summon mechanics, and orbital laser reticle strikes.
- **10 Interactive Challenge Formats**:
  1. Multiple Choice Questions
  2. True or False Logic Toggles
  3. Predict the Output (code tracing)
  4. Find the Bug (interactive code line debugging)
  5. Complete the Code (token selection)
  6. 8-Bit Interactive Binary Converter (live bit switches with real-time decimal readout)
  7. Concept Matching Connectors
  8. Chronological Step Arranger
  9. Logic Gate Simulator (XOR / NAND circuit switches)
  10. Sandboxed Terminal CLI (simulated Linux shell with `help`, `ls`, `cat`, `decrypt`, `scan`, `override`, `clear`)
- **Procedural Web Audio Engine**:
  - 100% self-contained Web Audio API synthesizer. Zero broken MP3 links or CORS issues.
  - Atmospheric dark sci-fi synth drone, blaster lasers, EMP shockwaves, sirens, terminal keystrokes, and victory fanfare.
- **5 Complete Game Modes**:
  - **Story Mode**: Complete 6-level narrative campaign with ORION radio transmissions and lore logs.
  - **Endless Survival Mode**: Continuous machine waves with personal best wave, time, and score tracking.
  - **CS & AI Challenge Academy**: Dedicated training ground to solve all 35+ CS challenges with category filters.
  - **Daily Survival Challenge**: Unique daily challenge seeded by calendar date.
  - **Sandbox Testing Arena**: Free-form testing ground with unlocked weapons, materials, and custom spawner.
- **Save & Progression System**:
  - Automatic checkpoint saving to `localStorage`.
  - Manual Save, JSON Export, JSON Import, and Factory Reset with confirmation.
  - 17 Achievements with XP rewards and toast notifications.
  - 3 Branching Endings:
    - *Ending A: Destroy NEXUS* (Total machine shutdown).
    - *Ending B: Reprogram NEXUS* (Open ethical alignment & cooperation).
    - *Ending C: Merge with NEXUS* (Digital transcendence).
  - Official GDG Assiut Certificate of Completion.

---

## 3. Project Structure

```
c:\Users\M.Khalil\Desktop\1/
├── index.html                  # Single static entry point
├── style.css                   # GDG Assiut theme, CRT scanlines, and responsive layout
├── README.md                   # Full documentation and deployment guide
│
├── assets/                     # Vector SVG and game assets
│   ├── ui/                     # GDG brand badges & UI icons
│   ├── items/                  # Item icons (medkit, energy cell)
│   ├── weapons/                # Weapon vector artwork
│   └── enemies/                # Robot schematic artwork
│
└── src/                        # Modular ES6+ Architecture
    ├── core/
    │   ├── EventManager.js     # Pub/sub decoupled event broker
    │   ├── GameState.js        # Central state machine (MENU, PLAYING, etc.)
    │   └── Game.js             # Main 60 FPS requestAnimationFrame loop & coordinator
    │
    ├── player/
    │   ├── PlayerStats.js      # Health, energy, food, water, stamina, upgrades
    │   ├── Inventory.js        # Slots, capacity limits, stacking, equip actions
    │   ├── PlayerController.js # Keyboard, mouse aim, and mobile virtual joystick
    │   └── Player.js           # Player character physics, weapons, and Canvas rendering
    │
    ├── world/
    │   └── WorldManager.js     # Camera tracking, obstacle collision, projectiles, particles
    │
    ├── enemies/
    │   ├── EnemyAI.js          # FSM states, vision cone raycasting, and alerts
    │   ├── Enemy.js            # Procedural Canvas robots (Drone, Enforcer, Hunter, Guardian, Boss)
    │   ├── BossController.js   # Multi-phase boss mechanics & orbital strikes
    │   └── EnemyManager.js     # Active enemy pool & endless survival wave spawner
    │
    ├── survival/
    │   └── CraftingSystem.js   # Blueprint recipes, ingredient deduction, item synthesis
    │
    ├── challenges/
    │   └── ChallengeManager.js # 10 Challenge format evaluators, hint system, rewards
    │
    ├── missions/
    │   └── MissionManager.js   # Quest tracker, ORION comms radio, branching endings
    │
    ├── progression/
    │   ├── XPSystem.js         # Level titles (Survivor -> NEXUS Challenger), skill points
    │   └── AchievementManager.js # 17 Community milestones with toast notifications
    │
    ├── storage/
    │   └── SaveManager.js      # LocalStorage persistence, schema validation, JSON export/import
    │
    ├── ui/
    │   ├── AudioSystem.js      # Procedural Web Audio API synth & sound effects
    │   ├── HUD.js              # GDG-styled HUD, minimap radar, and ORION coms overlay
    │   ├── TerminalUI.js       # CRT hacker terminal modal for all 10 challenge types
    │   ├── InventoryUI.js      # Tabbed modal (Inventory, Crafting, Upgrades, Achievements)
    │   ├── ResultsScreen.js    # Sector victory, 3 Endings epilogue, GDG Certificate
    │   └── MainMenu.js         # Main menu, Challenge Academy, and Settings
    │
    └── data/                   # Structured game data
        ├── items.js / .json
        ├── recipes.js / .json
        ├── enemies.js / .json
        ├── challenges.js / .json
        ├── missions.js / .json
        └── levels.js / .json
```

---

## 4. Controls

### Desktop Controls
| Action | Key / Input |
|---|---|
| **Move** | `W` / `A` / `S` / `D` or Arrow Keys |
| **Aim** | Mouse cursor |
| **Attack / Shoot** | Left Mouse Button (Hold to fire) |
| **Sprint** | `Shift` (Consumes stamina) |
| **Interact / Hack** | `E` (or Click interaction prompt) |
| **Inventory / Crafting** | `I` |
| **Minimap / Radar** | `M` |
| **Quick Consumable** | `Q` (Auto-uses Medkit or Food/Water) |
| **Weapons 1 - 4** | `1` (Blaster), `2` (EMP), `3` (Pulse Rifle), `4` (Shock Baton) |
| **Pause / Resume** | `Escape` |

### Mobile / Touch Controls
- **Virtual Joystick** (Left half of screen): Drag thumb to move in any 360° direction.
- **Action Buttons** (Right side of screen):
  - `FIRE`: Triggers equipped weapon towards aim direction.
  - `USE`: Triggers interaction with nearby terminal, supply crate, or portal.
- All menus, inventory tabs, and terminal challenges are fully touch-optimized with large clickable targets.

---

## 5. How to Run Locally

Because the project is written in pure vanilla HTML5, CSS3, and JavaScript with zero backend dependencies, you can run it immediately using any of the following methods:

### Method A: Python HTTP Server (Recommended)
Open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then navigate to: [http://localhost:8000](http://localhost:8000)

### Method B: Node.js `serve` / `npx`
```bash
npx serve .
```

### Method C: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

### Method D: Direct Double-Click (`file:///`)
You can even double-click `index.html` directly from Windows Explorer! All data files expose browser globals alongside JSON, guaranteeing zero CORS errors.

---

## 6. GitHub Pages Deployment

The application is 100% static and pre-configured for instant GitHub Pages deployment:

1. Initialize a git repository and commit all files:
   ```bash
   git init
   git add .
   git commit -m "Initial release of AI Apocalypse - Powered by GDG Assiut"
   ```
2. Create a repository on GitHub (e.g. `ai-apocalypse`) and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/ai-apocalypse.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch: `main` and folder: `/ (root)`.
   - Click **Save**.
4. In under 60 seconds, your game will be live at:
   `https://<your-username>.github.io/ai-apocalypse/`

---

## 7. Testing & Quality Assurance Summary

- **Syntax & Compilation**: All 30 modular JavaScript source files compiled and validated with zero syntax errors.
- **Relational Data Integrity**: 100% verified cross-references between 6 Levels, 30+ Items, 13 Crafting Recipes, 7 Enemy & Boss types, 36 Challenges, and 6 Missions.
- **Audio Reliability**: Web Audio API synthesizer checked with graceful audio context resumption on user click/interaction to respect browser autoplay policies.
- **Persistence Verification**: LocalStorage save/load verified with deep schema merge and automated error recovery.
- **Responsive Layout**: Tested across desktop widescreen (1920x1080), laptop (1366x768), and mobile viewport constraints.

---

## 8. Brand Attribution

**AI APOCALYPSE: SURVIVE THE MACHINES**  
*Official GDG Assiut Gaming Experience*  
Designed for Google Developer Groups Assiut community hackathons, tech festivals, and educational workshops.

> **"Think. Adapt. Survive. Powered by GDG Assiut."**
