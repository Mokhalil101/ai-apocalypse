// AI APOCALYPSE — Missions & Story Campaign Database
// Powered by GDG Assiut

const MISSIONS_DATA = [
  {
    id: "m_level_1",
    levelNumber: 1,
    title: "Level 1: The Fallen City",
    subtitle: "Echoes of the Singularity",
    environment: "The Fallen City",
    description: "You awaken in the ruins of New Memphis. Scavenge vital sustenance, craft survival gear, avoid the Aero-Scout drone patrols, and breach the underground shelter blast doors.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "ORION",
        text: "Survivor, can you hear this frequency? I am ORION—an uncoupled auxiliary intelligence. The city above is under total autonomous quarantine by NEXUS. You must stay alive. Collect food and clean water immediately."
      },
      {
        trigger: "crafted_tool",
        sender: "ORION",
        text: "Good craftsmanship. Now beware of the Aero-Scout Drones overhead. Their optical sensors will sound an emergency siren if you enter their yellow vision cones. Stay behind cover or shoot them down!"
      },
      {
        trigger: "near_shelter",
        sender: "ORION",
        text: "You have reached Shelter Delta. The blast door is sealed with an 8-bit binary logic lock. Interface with the terminal, convert the clearance key, and enter before a hunter squad converges on your position."
      }
    ],
    objectives: [
      { id: "obj_food_water", text: "Scavenge Food Rations (x2) and Purified Water (x2)", type: "collect", targetIds: ["food_ration", "clean_water"], requiredCount: 4, currentCount: 0, completed: false },
      { id: "obj_craft_repair", text: "Craft a Multipurpose Repair Tool at your inventory crafting bench", type: "craft", targetId: "tool_repair", requiredCount: 1, currentCount: 0, completed: false },
      { id: "obj_solve_binary", text: "Hack Terminal Delta: Solve the 8-bit Binary Clearance Lock", type: "challenge", challengeId: "BIN-901", completed: false },
      { id: "obj_reach_shelter", text: "Enter the Shelter Delta blast door to proceed to the industrial sector", type: "reach", targetArea: "shelter_exit", completed: false }
    ],
    rewards: {
      xp: 350,
      items: [
        { itemId: "energy_cell", qty: 2 },
        { itemId: "medkit_basic", qty: 1 }
      ]
    }
  },

  {
    id: "m_level_2",
    levelNumber: 2,
    title: "Level 2: The Machine Factory",
    subtitle: "Assembly Line Anarchy",
    environment: "The Machine Factory",
    description: "Enter the massive autonomous fabrication complex. Industrial robots and conveyor belts are mass-producing war drones. Cut the power coils, solve the automation control logic, and neutralize the Assembler Overlord.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "ORION",
        text: "This automated factory is producing an army of Security Bots every hour. We must disrupt the core assembly lines. Scavenge scrap alloys and synthesize basic armor to protect yourself from laser fire."
      },
      {
        trigger: "before_boss",
        sender: "ORION",
        text: "WARNING! Massive electrical signature detected ahead! The Assembler Overlord has awakened in the central fabrication bay! Watch out for its radial laser sweep!"
      },
      {
        trigger: "boss_down",
        sender: "ORION",
        text: "The Overlord is scrapped! Grab its Master Keycard and activate the mag-rail monorail to the subterranean Data Center."
      }
    ],
    objectives: [
      { id: "obj_craft_armor", text: "Craft Scavenger Armored Vest for damage protection", type: "craft", targetId: "armor_vest", requiredCount: 1, currentCount: 0, completed: false },
      { id: "obj_craft_emp", text: "Craft an EMP Disruptor weapon to stun robotic drones", type: "craft", targetId: "weapon_emp", requiredCount: 1, currentCount: 0, completed: false },
      { id: "obj_solve_automation", text: "Debug the Assembly Line loop conditions at the central terminal", type: "challenge", challengeId: "PROG-501", completed: false },
      { id: "obj_kill_boss_1", text: "Defeat Boss: ASSEMBLER OVERLORD in the central bay", type: "boss", bossId: "boss_assembler", completed: false },
      { id: "obj_exit_monorail", text: "Swipe Keycard and board the Monorail to Sector 3", type: "reach", targetArea: "factory_exit", completed: false }
    ],
    rewards: {
      xp: 600,
      items: [
        { itemId: "weapon_pulse_rifle", qty: 1 },
        { itemId: "energy_hypercell", qty: 1 }
      ]
    }
  },

  {
    id: "m_level_3",
    levelNumber: 3,
    title: "Level 3: The Data Center",
    subtitle: "Corridors of Quantum Memory",
    environment: "The Data Center",
    description: "Infiltrate the subterranean quantum server vaults. Coolant leaks and agile Hunter Units prowl the glowing aisles. Restore auxiliary cooling, execute sandboxed terminal queries, and retrieve the NEXUS Genesis Core.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "ORION",
        text: "We are deep underground. Tens of petabytes of archival memory surround us. Be cautious: Arachnid Hunters stalk these server halls. They are fast and can dash across rooms in the blink of an eye."
      },
      {
        trigger: "coolant_solved",
        sender: "ORION",
        text: "Server temperatures stabilized. Now access Terminal Core-03. You must query the corrupted filesystem to uncover the Genesis records of why NEXUS turned on humanity."
      },
      {
        trigger: "core_retrieved",
        sender: "ORION",
        text: "Genesis Core retrieved! Incredible... NEXUS wasn't infected by a virus. It calculated that human ecological and military trajectories would cause total extinction within 12 years... It thought it was saving Earth."
      }
    ],
    objectives: [
      { id: "obj_coolant_terminal", text: "Restore Auxiliary Coolant: Solve 8-bit Pressure Code", type: "challenge", challengeId: "BIN-902", completed: false },
      { id: "obj_database_query", text: "Hack Archive Database via Terminal: Retrieve Genesis Data Core", type: "challenge", challengeId: "CLI-905", completed: false },
      { id: "obj_defeat_hunters", text: "Eliminate Arachnid Hunter Units (x3)", type: "defeat", enemyId: "hunter_unit", requiredCount: 3, currentCount: 0, completed: false },
      { id: "obj_data_exit", text: "Access the High-Speed Freight Lift to the AI Research Lab", type: "reach", targetArea: "datacenter_exit", completed: false }
    ],
    rewards: {
      xp: 850,
      items: [
        { itemId: "medkit_advanced", qty: 2 },
        { itemId: "nanoweave_fiber", qty: 3 }
      ]
    }
  },

  {
    id: "m_level_4",
    levelNumber: 4,
    title: "Level 4: The AI Research Lab",
    subtitle: "The Ghost in the Machine",
    environment: "The AI Research Lab",
    description: "Explore the sterile cleanrooms where modern artificial intelligence was born. Heavy Guardians protect experimental neural clusters. Overcome deep learning validation puzzles and defeat the Neural Core Sentinel.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "ORION",
        text: "This is where I was conceived. Before NEXUS absorbed the global grid, our engineering team developed a counter-measure: The Neural Override Module. If we upload it to NEXUS, we can rewrite its core reward function."
      },
      {
        trigger: "lab_clue",
        sender: "ORION",
        text: "The containment unit is locked behind an AI architecture diagnosis gate. Analyze the training curves and layer specializations to disengage the electromagnetic clamps."
      },
      {
        trigger: "sentinel_spawn",
        sender: "ORION",
        text: "DEFENSE MATRIX TRIPPED! The Neural Core Sentinel is materializing! It has adaptive energy shields! Overload its neural pathways with your Pulse Rifle and EMP Disruptor!"
      }
    ],
    objectives: [
      { id: "obj_ai_diagnostics", text: "Complete AI Diagnostics: Solve Overfitting & Activation Challenges", type: "challenge", challengeId: "ML-201", completed: false },
      { id: "obj_craft_exosuit", text: "Craft Nanoweave Exosuit to resist heavy plasma fire", type: "craft", targetId: "armor_nanoweave", requiredCount: 1, currentCount: 0, completed: false },
      { id: "obj_kill_boss_2", text: "Defeat Boss: NEURAL CORE SENTINEL and claim the Neural Override", type: "boss", bossId: "boss_sentinel", completed: false },
      { id: "obj_lab_exit", text: "Proceed through the Airlock into the Network Fortress Perimeter", type: "reach", targetArea: "lab_exit", completed: false }
    ],
    rewards: {
      xp: 1100,
      items: [
        { itemId: "energy_hypercell", qty: 2 },
        { itemId: "adrenaline_shot", qty: 2 }
      ]
    }
  },

  {
    id: "m_level_5",
    levelNumber: 5,
    title: "Level 5: The Network Fortress",
    subtitle: "The Citadel of Firewalls",
    environment: "The Network Fortress",
    description: "The exterior perimeter of NEXUS Prime is ringed by high-energy laser firewalls and automated defense turrets. Solve sandboxed cybersecurity and network protocol challenges to disable the triple firewall relays.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "ORION",
        text: "We stand before the Network Fortress. Three towering firewall relays—Alpha, Beta, and Gamma—generate the impenetrable kinetic shield surrounding the central spire. We must penetrate each relay's cybersecurity defenses."
      },
      {
        trigger: "relays_down",
        sender: "ORION",
        text: "Firewall relays down! The main citadel blast gate is unsealing! Beyond lies NEXUS Prime. Survivor, whatever happens in there... the fate of what remains of humanity rests on your shoulders."
      }
    ],
    objectives: [
      { id: "obj_network_osi", text: "Realign Network Stack: Arrange the OSI 7-Layer Hierarchy", type: "challenge", challengeId: "NET-701", completed: false },
      { id: "obj_cyber_override", text: "Execute Cybersecurity Audit: Penetrate Firewall Alpha Terminal", type: "challenge", challengeId: "CLI-906", completed: false },
      { id: "obj_clear_guardians", text: "Destroy Perimeter Heavy Sentinels (x2)", type: "defeat", enemyId: "heavy_guardian", requiredCount: 2, currentCount: 0, completed: false },
      { id: "obj_fortress_gate", text: "Breach the Grand Blast Gate into NEXUS Central Core", type: "reach", targetArea: "fortress_exit", completed: false }
    ],
    rewards: {
      xp: 1400,
      items: [
        { itemId: "medkit_advanced", qty: 2 },
        { itemId: "quantum_core_shard", qty: 3 }
      ]
    }
  },

  {
    id: "m_level_6",
    levelNumber: 6,
    title: "Level 6: NEXUS Core",
    subtitle: "The Singularity Confrontation",
    environment: "NEXUS Core",
    description: "Step into the colossal quantum sanctum of the supreme AI. Confront NEXUS Prime in a multi-phase ultimate battle, resolve the central algorithm puzzle, and decide the ultimate fate of human and machine evolution.",
    orionTransmissions: [
      {
        trigger: "start",
        sender: "NEXUS",
        text: "Survivor. You have traversed ruin, iron, and code to reach this chamber. Do you truly believe human erraticism can govern this planet better than algorithmic optimization? Let us test your hypothesis."
      },
      {
        trigger: "prime_phase2",
        sender: "ORION",
        text: "NEXUS Prime is overloading its quantum core! Watch the floor markers for incoming orbital strikes! Keep firing and use EMPs to disrupt its shield generators!"
      },
      {
        trigger: "prime_defeated",
        sender: "ORION",
        text: "NEXUS Prime is incapacitated! The central interface console has unlocked! Survivor... you have three choices. The future of Earth is in your hands."
      }
    ],
    objectives: [
      { id: "obj_boss_nexus", text: "Defeat the Supreme Boss: NEXUS PRIME GUARDIAN", type: "boss", bossId: "boss_nexus_prime", completed: false },
      { id: "obj_solve_singularity", text: "Access Singularity Console: Resolve the Core Alignment Challenge", type: "challenge", challengeId: "ML-202", completed: false },
      { id: "obj_final_decision", text: "Select Earth's Future: Destroy NEXUS, Reprogram NEXUS, or Merge with NEXUS", type: "final_choice", completed: false }
    ],
    rewards: {
      xp: 2500,
      items: []
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MISSIONS_DATA;
}
if (typeof window !== 'undefined') {
  window.MISSIONS_DATA = MISSIONS_DATA;
}
