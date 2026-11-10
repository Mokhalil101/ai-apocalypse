// AI APOCALYPSE — Challenges Bank
// Educational Computer Science & Artificial Intelligence Challenges
// Powered by GDG Assiut

const CHALLENGES_DATA = [
  // ==========================================
  // CATEGORY 1: ARTIFICIAL INTELLIGENCE (AI)
  // ==========================================
  {
    id: "AI-101",
    title: "Paradigms of Machine Learning",
    category: "Artificial Intelligence",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Which branch of machine learning trains models using ground-truth input-output pairs (labeled data)?",
    options: [
      "Unsupervised Learning",
      "Supervised Learning",
      "Reinforcement Learning",
      "Evolutionary Clustering"
    ],
    correctAnswer: "Supervised Learning",
    explanation: "Supervised learning algorithms infer a mapping function from input data paired with known target labels (e.g., classifying tumor scans with doctor diagnoses).",
    hint: "Think about having a teacher or 'supervisor' providing the true answers during training.",
    reward: { xp: 100, energy: 20 }
  },
  {
    id: "AI-102",
    title: "Reinforcement Learning Feedback",
    category: "Artificial Intelligence",
    difficulty: "easy",
    type: "true_false",
    question: "True or False: In Reinforcement Learning, an agent learns to make sequences of decisions by receiving rewards or penalties from an environment.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Reinforcement learning is based on trial-and-error where an autonomous agent optimizes its policy to maximize cumulative environmental rewards over time.",
    hint: "Consider how autonomous game-playing bots like AlphaGo or robotic rovers learn through rewards.",
    reward: { xp: 90, energy: 15 }
  },
  {
    id: "AI-103",
    title: "The Turing Test Criterion",
    category: "Artificial Intelligence",
    difficulty: "medium",
    type: "multiple_choice",
    question: "What is the primary objective of Alan Turing's classic 1950 imitation game (The Turing Test)?",
    options: [
      "To test whether a machine can calculate floating point numbers faster than a human",
      "To evaluate whether a human evaluator cannot reliably distinguish machine conversation from human conversation",
      "To verify that an artificial intelligence model has reached emotional self-consciousness",
      "To prove whether a computer program is free of runtime bugs"
    ],
    correctAnswer: "To evaluate whether a human evaluator cannot reliably distinguish machine conversation from human conversation",
    explanation: "Turing proposed that if a machine can converse in natural language such that a blinded human judge cannot tell it apart from another human, it exhibits intelligent behavior.",
    hint: "It tests behavioral indistinguishability in blind text communication.",
    reward: { xp: 120, energy: 25 }
  },
  {
    id: "AI-104",
    title: "AI Paradigm Concept Match",
    category: "Artificial Intelligence",
    difficulty: "medium",
    type: "match_concepts",
    question: "Match each AI paradigm with its signature technique or problem type:",
    pairs: [
      { key: "Supervised Learning", val: "Spam Detection via Labeled Emails" },
      { key: "Unsupervised Learning", val: "Customer Segmentation via K-Means" },
      { key: "Reinforcement Learning", val: "Drone Navigation via Reward Policy" },
      { key: "Generative AI", val: "Synthesizing Novel Images & Text" }
    ],
    explanation: "Supervised uses labels; Unsupervised finds hidden patterns without labels; Reinforcement optimizes reward policies; Generative models produce novel data distributions.",
    hint: "Pair the learning mechanism with whether it uses labels, clusters, reward signals, or creative synthesis.",
    reward: { xp: 150, energy: 30, itemId: "data_chip" }
  },

  // ==========================================
  // CATEGORY 2: MACHINE LEARNING (ML)
  // ==========================================
  {
    id: "ML-201",
    title: "Diagnosing Model Overfitting",
    category: "Machine Learning",
    difficulty: "medium",
    type: "multiple_choice",
    question: "A neural network achieves 99.8% accuracy on the training dataset, but drops to 62.1% accuracy on the unseen validation dataset. What phenomenon is occurring?",
    options: [
      "Underfitting due to excessive regularization",
      "Overfitting — the model memorized noise and lacks generalization",
      "Gradient explosion in the output layer",
      "High bias with low model variance"
    ],
    correctAnswer: "Overfitting — the model memorized noise and lacks generalization",
    explanation: "A large discrepancy between high training performance and poor test/validation performance is the hallmark of overfitting (high variance).",
    hint: "The model performs great on familiar practice tests, but fails on new unseen exams.",
    reward: { xp: 130, energy: 25 }
  },
  {
    id: "ML-202",
    title: "Precision vs Recall Trade-off",
    category: "Machine Learning",
    difficulty: "hard",
    type: "multiple_choice",
    question: "In our autonomous defense radar, failing to detect an incoming hostile machine (False Negative) is catastrophic. Which metric should we prioritize maximizing?",
    options: [
      "Precision (minimizing false alarms)",
      "Recall (Sensitivity — detecting all true hostiles)",
      "Specificity (ruling out friendly drones)",
      "L1 Sparsity Metric"
    ],
    correctAnswer: "Recall (Sensitivity — detecting all true hostiles)",
    explanation: "Recall = TP / (TP + FN). When False Negatives carry devastating consequences (like missile defense or malignant tumor detection), maximizing Recall ensures minimal missed threats.",
    hint: "Recall measures: out of all actual enemies out there, what percentage did we successfully catch?",
    reward: { xp: 160, energy: 35 }
  },
  {
    id: "ML-203",
    title: "Machine Learning Pipeline Sequence",
    category: "Machine Learning",
    difficulty: "medium",
    type: "arrange_steps",
    question: "Arrange the standard machine learning workflow phases into the correct chronological order:",
    steps: [
      "Collect and ingest raw sensor data",
      "Clean data and handle missing values",
      "Split data into Train, Validation, and Test sets",
      "Extract features and normalize numerical scales",
      "Train model on training set with loss optimization",
      "Evaluate generalized performance on test set"
    ],
    explanation: "Data science workflows require data ingestion -> cleaning -> splitting (to prevent data leakage) -> feature engineering -> training -> unbiased test evaluation.",
    hint: "You must always collect and clean before splitting and training.",
    reward: { xp: 160, energy: 30 }
  },

  // ==========================================
  // CATEGORY 3: DEEP LEARNING (DL)
  // ==========================================
  {
    id: "DL-301",
    title: "Non-Linear Activation Functions",
    category: "Deep Learning",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Why do artificial deep neural networks require non-linear activation functions (such as ReLU or GELU) between hidden layers?",
    options: [
      "To accelerate floating-point arithmetic on hardware GPUs",
      "Without non-linearities, any deep stack of linear layers collapses into a single simple linear regression",
      "To prevent data arrays from exceeding 8-bit memory constraints",
      "To guarantee that loss functions always converge to zero"
    ],
    correctAnswer: "Without non-linearities, any deep stack of linear layers collapses into a single simple linear regression",
    explanation: "The composition of linear functions is always just another linear function: W2 * (W1 * x) = (W2 * W1) * x = W_combined * x. Non-linear activations allow networks to approximate arbitrary complex functions.",
    hint: "Recall linear algebra: multiplying multiple matrix transformations together still produces just one linear transformation.",
    reward: { xp: 140, energy: 25 }
  },
  {
    id: "DL-302",
    title: "Neural Architecture Specializations",
    category: "Deep Learning",
    difficulty: "medium",
    type: "match_concepts",
    question: "Match each deep learning architecture to its primary foundational domain:",
    pairs: [
      { key: "Convolutional Neural Network (CNN)", val: "Spatial Grid & Computer Vision" },
      { key: "Recurrent Neural Network (LSTM/GRU)", val: "Sequential & Time-Series Signals" },
      { key: "Transformer (Self-Attention)", val: "Large Language Models & Global Context" },
      { key: "Autoencoder", val: "Dimensionality Reduction & Feature Denoising" }
    ],
    explanation: "CNNs exploit 2D spatial translation invariance; RNNs handle temporal order; Transformers capture long-range token relationships via multi-head attention; Autoencoders compress and reconstruct.",
    hint: "Match images to convolutions, words/text to self-attention transformers, and temporal streams to recurrences.",
    reward: { xp: 150, energy: 30 }
  },
  {
    id: "DL-303",
    title: "The Backpropagation Engine",
    category: "Deep Learning",
    difficulty: "hard",
    type: "multiple_choice",
    question: "Which mathematical rule from calculus serves as the bedrock of the Backpropagation algorithm used to compute gradients in neural networks?",
    options: [
      "L'Hôpital's Rule for limits",
      "The Chain Rule of calculus",
      "Stokes' Divergence Theorem",
      "Euler's Totient Formula"
    ],
    correctAnswer: "The Chain Rule of calculus",
    explanation: "Backpropagation recursively applies the Chain Rule (dLoss/dw = dLoss/dy * dy/dz * dz/dw) backwards from the output loss to every internal weight.",
    hint: "It computes derivatives of nested composite functions f(g(h(x))).",
    reward: { xp: 170, energy: 35 }
  },

  // ==========================================
  // CATEGORY 4: DATA SCIENCE (DS)
  // ==========================================
  {
    id: "DS-401",
    title: "Correlation vs Causation",
    category: "Data Science",
    difficulty: "easy",
    type: "true_false",
    question: "True or False: If a high Pearson correlation coefficient (r = 0.95) exists between ice cream sales and forest fires, it proves ice cream sales cause forest fires.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "Correlation does not imply causation! A confounding lurking variable (summer heat waves) independently drives both higher ice cream consumption and drier forest conditions.",
    hint: "Consider third confounding variables like high summer temperatures.",
    reward: { xp: 90, energy: 15 }
  },
  {
    id: "DS-402",
    title: "Handling Missing Sensor Telemetry",
    category: "Data Science",
    difficulty: "medium",
    type: "multiple_choice",
    question: "A drone's radiation sensor dropped 3% of its values at random intervals. Which imputation technique preserves sample size without severely skewing the overall distribution if values are normally distributed?",
    options: [
      "Replace all missing values with negative infinity",
      "Impute with the mean or median of the observed values",
      "Delete the entire dataset and reboot",
      "Multiply all other column values by zero"
    ],
    correctAnswer: "Impute with the mean or median of the observed values",
    explanation: "Mean/median imputation replaces missing entries with central tendency statistics, preserving dataset size when values are Missing Completely At Random (MCAR).",
    hint: "Use central tendency measures to fill empty gaps.",
    reward: { xp: 120, energy: 20 }
  },

  // ==========================================
  // CATEGORY 5: PROGRAMMING & CODE DEBUGGING
  // ==========================================
  {
    id: "PROG-501",
    title: "Predict Code Output: Drone Fuel Loop",
    category: "Programming",
    difficulty: "easy",
    type: "predict_output",
    codeSnippet: `let energy = 12;\nlet pulses = 0;\nwhile (energy > 2) {\n  energy -= 3;\n  pulses++;\n}\nconsole.log(pulses);`,
    question: "What integer value will be printed to the terminal console?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    explanation: "Iteration 1: energy becomes 9, pulses = 1. Iteration 2: energy = 6, pulses = 2. Iteration 3: energy = 3, pulses = 3. Iteration 4: energy = 0, pulses = 4. 0 is not > 2, loop terminates. pulses = 4.",
    hint: "Trace energy: 12 -> 9 -> 6 -> 3 -> 0. Count how many times the loop decremented.",
    reward: { xp: 110, energy: 20 }
  },
  {
    id: "PROG-502",
    title: "Find the Bug: Ammo Reallocation",
    category: "Programming",
    difficulty: "medium",
    type: "find_bug",
    codeSnippet: `1: function reloadPulseRifle(currentAmmo, maxCapacity) {\n2:   let ammoNeeded = maxCapacity - currentAmmo;\n3:   if (ammoNeeded = 0) {\n4:     return "Full capacity already";\n5:   }\n6:   return "Reloaded " + ammoNeeded + " rounds";\n7: }`,
    question: "Which line number contains a critical logical bug?",
    options: ["Line 1", "Line 2", "Line 3", "Line 6"],
    correctAnswer: "Line 3",
    explanation: "Line 3 uses the assignment operator '=' instead of the equality comparison operator '==' or '==='. In JavaScript, (ammoNeeded = 0) assigns 0 and evaluates to falsy, breaking the conditional check!",
    hint: "Look closely at comparison operators versus assignment operators in conditionals.",
    reward: { xp: 140, energy: 25 }
  },
  {
    id: "PROG-503",
    title: "Complete the Code: Drone Speed Filter",
    category: "Programming",
    difficulty: "medium",
    type: "complete_code",
    codeSnippet: `// Filter drones exceeding safety speed threshold\nconst fastBots = drones.____(bot => bot.speed > 100);`,
    question: "Select the correct array method to replace '____':",
    options: ["filter", "map", "reduce", "concat"],
    correctAnswer: "filter",
    explanation: "The Array.prototype.filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the predicate test function.",
    hint: "Which standard array method selects a subset of items that satisfy a boolean condition?",
    reward: { xp: 130, energy: 20 }
  },

  // ==========================================
  // CATEGORY 6: ALGORITHMS & DATA STRUCTURES
  // ==========================================
  {
    id: "DSA-601",
    title: "Binary Search Time Complexity",
    category: "Algorithms",
    difficulty: "easy",
    type: "multiple_choice",
    question: "What is the worst-case time complexity of searching for an encrypted key in a sorted array of N elements using Binary Search?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: "O(log N)",
    explanation: "Binary search cuts the search space in half with every comparison (N/2, N/4, N/8...), yielding logarithmic time complexity O(log N).",
    hint: "Every single step eliminates 50% of the remaining search space.",
    reward: { xp: 120, energy: 25 }
  },
  {
    id: "DSA-602",
    title: "Stack vs Queue Access Order",
    category: "Algorithms",
    difficulty: "easy",
    type: "match_concepts",
    question: "Match each fundamental linear data structure to its data retrieval principle:",
    pairs: [
      { key: "Stack (e.g., Undo History)", val: "LIFO (Last In, First Out)" },
      { key: "Queue (e.g., Task Scheduler)", val: "FIFO (First In, First Out)" },
      { key: "Priority Queue (e.g., Emergency Interrupts)", val: "Highest Priority Element First" },
      { key: "Hash Table (e.g., Key-Value Lookup)", val: "Average O(1) Key Direct Access" }
    ],
    explanation: "Stacks push/pop from the top (LIFO); Queues enqueue at the back and dequeue from the front (FIFO); Priority queues order by ranking; Hash tables use key hashing.",
    hint: "Think about a stack of cafeteria trays versus a queue waiting in line at a counter.",
    reward: { xp: 130, energy: 25 }
  },
  {
    id: "DSA-603",
    title: "Breadth-First Search (BFS) Traversal",
    category: "Algorithms",
    difficulty: "medium",
    type: "multiple_choice",
    question: "To find the shortest escape route (fewest corridors) through an unweighted grid map of the AI facility, which graph traversal algorithm is optimal?",
    options: [
      "Depth-First Search (DFS)",
      "Breadth-First Search (BFS)",
      "Pre-order Tree Traversal",
      "Insertion Sort"
    ],
    correctAnswer: "Breadth-First Search (BFS)",
    explanation: "BFS explores all vertices level-by-level using a FIFO queue, guaranteeing the shortest path in unweighted graphs.",
    hint: "It ripples outward in concentric waves exploring closest neighbors first.",
    reward: { xp: 140, energy: 30 }
  },

  // ==========================================
  // CATEGORY 7: NETWORKING & PROTOCOLS
  // ==========================================
  {
    id: "NET-701",
    title: "OSI Reference Model Layer Hierarchy",
    category: "Networking",
    difficulty: "medium",
    type: "arrange_steps",
    question: "Arrange the 7 layers of the ISO/OSI Network Model from Layer 7 (Top: User Application) down to Layer 1 (Bottom: Hardware):",
    steps: [
      "Application Layer (HTTP, DNS, SSH)",
      "Presentation Layer (SSL/TLS, Encryption, Compression)",
      "Session Layer (RPC, Connection Sessions)",
      "Transport Layer (TCP, UDP, Ports)",
      "Network Layer (IP Routing, Routers)",
      "Data Link Layer (Ethernet, MAC Addresses, Switches)",
      "Physical Layer (Cables, Radio Waves, Bits)"
    ],
    explanation: "The OSI model: Layer 7 Application -> 6 Presentation -> 5 Session -> 4 Transport -> 3 Network -> 2 Data Link -> 1 Physical.",
    hint: "Remember the mnemonic: 'All People Seem To Need Data Processing'.",
    reward: { xp: 180, energy: 35, itemId: "data_chip" }
  },
  {
    id: "NET-702",
    title: "TCP vs UDP Reliability",
    category: "Networking",
    difficulty: "easy",
    type: "multiple_choice",
    question: "Which transport protocol guarantees ordered delivery and error-checked transmission via a 3-way handshake (SYN, SYN-ACK, ACK)?",
    options: [
      "UDP (User Datagram Protocol)",
      "TCP (Transmission Control Protocol)",
      "ICMP (Internet Control Message Protocol)",
      "ARP (Address Resolution Protocol)"
    ],
    correctAnswer: "TCP (Transmission Control Protocol)",
    explanation: "TCP is connection-oriented, ensuring all packets arrive acknowledged and in-order, retransmitting lost packets.",
    hint: "It is the reliable protocol powering web browsing (HTTP/HTTPS) and file transfers.",
    reward: { xp: 110, energy: 20 }
  },
  {
    id: "NET-703",
    title: "Domain Name System (DNS) Role",
    category: "Networking",
    difficulty: "easy",
    type: "multiple_choice",
    question: "What is the primary function of the Domain Name System (DNS) in computer networks?",
    options: [
      "Encrypting stored passwords on client laptops",
      "Translating human-readable domain names (like gdgassiut.com) into machine-routable IP addresses",
      "Compressing video streams across fiber optic cables",
      "Preventing denial of service attacks automatically"
    ],
    correctAnswer: "Translating human-readable domain names (like gdgassiut.com) into machine-routable IP addresses",
    explanation: "DNS acts as the phonebook of the Internet, resolving hostname strings into numeric IP addresses (like 142.250.190.46) so routers can direct traffic.",
    hint: "It acts like a phone directory translating website names into IP addresses.",
    reward: { xp: 100, energy: 20 }
  },

  // ==========================================
  // CATEGORY 8: CYBERSECURITY FUNDAMENTALS
  // ==========================================
  {
    id: "SEC-801",
    title: "Symmetric vs Asymmetric Cryptography",
    category: "Cybersecurity",
    difficulty: "medium",
    type: "multiple_choice",
    question: "In Public Key (Asymmetric) Cryptography (such as RSA), if Survivor Alice wants to send a secret encrypted message to Orion that only Orion can read, which key must Alice encrypt with?",
    options: [
      "Alice's own Private Key",
      "Alice's own Public Key",
      "Orion's Public Key",
      "Orion's Private Key"
    ],
    correctAnswer: "Orion's Public Key",
    explanation: "In asymmetric cryptography, anyone can encrypt a message using the recipient's public key. Only the recipient's matching private key can decrypt it.",
    hint: "You lock the box with the recipient's openly shared public padlock; only their private key can open it.",
    reward: { xp: 140, energy: 25 }
  },
  {
    id: "SEC-802",
    title: "Cryptographic Hashing Properties",
    category: "Cybersecurity",
    difficulty: "medium",
    type: "true_false",
    question: "True or False: A secure cryptographic hash function (like SHA-256) is designed to be mathematically irreversible (one-way), meaning you cannot compute the original input string from the hash alone.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Cryptographic hash functions are deterministic one-way functions. It is computationally infeasible to invert a hash back to its preimage input.",
    hint: "Hashing is like grinding meat into sausage — you cannot un-grind it back into the original steak.",
    reward: { xp: 110, energy: 20 }
  },
  {
    id: "SEC-803",
    title: "Mitigating SQL Injection (SQLi)",
    category: "Cybersecurity",
    difficulty: "hard",
    type: "multiple_choice",
    question: "How can software developers effectively protect backend database queries from malicious SQL Injection attacks (e.g. `' OR 1=1; --`)?",
    options: [
      "By storing the SQL database inside a hidden zip file",
      "Using Parameterized Queries (Prepared Statements) with bound parameters",
      "Converting all database tables into CSV spreadsheets",
      "Using Base64 encoding on the entire database disk"
    ],
    correctAnswer: "Using Parameterized Queries (Prepared Statements) with bound parameters",
    explanation: "Parameterized queries treat user input strictly as literal data rather than executable SQL code, preventing attackers from injecting rogue SQL commands into the parser.",
    hint: "Separate the code structure from the user-provided data parameters.",
    reward: { xp: 160, energy: 30 }
  },

  // ==========================================
  // INTERACTIVE FORMAT: BINARY CONVERTERS
  // ==========================================
  {
    id: "BIN-901",
    title: "Shelter Access Cipher (8-bit Binary)",
    category: "Computer Science",
    difficulty: "easy",
    type: "binary_converter",
    targetDecimal: 42,
    bitsCount: 8,
    question: "Toggle the 8-bit switches to represent the decimal clearance number 42 (00101010):",
    explanation: "32 + 8 + 2 = 42. In 8-bit binary: 00101010.",
    hint: "Values of bits from left to right: 128, 64, 32, 16, 8, 4, 2, 1. Find powers of 2 that sum to 42.",
    reward: { xp: 150, energy: 30, itemId: "quest_shelter_code" }
  },
  {
    id: "BIN-902",
    title: "Coolant Bypass Pressure Code (8-bit)",
    category: "Computer Science",
    difficulty: "medium",
    type: "binary_converter",
    targetDecimal: 105,
    bitsCount: 8,
    question: "Toggle the 8-bit switches to represent the decimal code 105 (01101001):",
    explanation: "64 + 32 + 8 + 1 = 105. In binary: 01101001.",
    hint: "64 + 32 = 96. Remaining: 9 (which is 8 + 1).",
    reward: { xp: 170, energy: 35 }
  },

  // ==========================================
  // INTERACTIVE FORMAT: LOGIC GATE SIMULATOR
  // ==========================================
  {
    id: "LOGIC-903",
    title: "Security Circuit Logic Override",
    category: "Computer Science",
    difficulty: "medium",
    type: "logic_gate",
    gateType: "XOR",
    question: "The emergency blast door lock is governed by an XOR gate. Set inputs A and B so the door opens (Output = 1):",
    targetOutput: 1,
    inputs: [
      { name: "A", initial: 0 },
      { name: "B", initial: 0 }
    ],
    explanation: "An XOR (Exclusive OR) gate yields TRUE (1) if and only if its inputs are different (one is 1, the other is 0).",
    hint: "XOR output is 1 when inputs are different from each other.",
    reward: { xp: 130, energy: 25 }
  },
  {
    id: "LOGIC-904",
    title: "Factory Power Relay: NAND Gate",
    category: "Computer Science",
    difficulty: "medium",
    type: "logic_gate",
    gateType: "NAND",
    question: "Configure the NAND gate inputs to keep the failsafe alarm deactivated (Output = 0):",
    targetOutput: 0,
    inputs: [
      { name: "A", initial: 0 },
      { name: "B", initial: 1 }
    ],
    explanation: "NAND is NOT-AND. It outputs 0 only when BOTH inputs are 1.",
    hint: "When does an AND gate output 1? The inverted NOT of that will be 0.",
    reward: { xp: 140, energy: 25 }
  },

  // ==========================================
  // INTERACTIVE FORMAT: SANDBOXED TERMINAL CLI
  // ==========================================
  {
    id: "CLI-905",
    title: "Archive Database Recovery",
    category: "Cybersecurity",
    difficulty: "medium",
    type: "terminal_cli",
    question: "Use simulated terminal commands to inspect the corrupted database files and locate the Genesis record.",
    cliCommands: [
      { cmd: "help", response: "Available commands:\n  ls          - list directory contents\n  cat <file>  - read file contents\n  decrypt <id> - decrypt memory cluster\n  clear       - clear screen" },
      { cmd: "ls", response: "drwxr-xr-x  logs/\n-rw-r--r--  nexus_manifest.sys\n-rw-r--r--  genesis_log_2098.enc" },
      { cmd: "cat nexus_manifest.sys", response: "SYSTEM: NEXUS Singularity Core\nSTATUS: AUTONOMOUS OVERRIDE\nSECURITY: Clearance Level 4 required for genesis_log_2098.enc." },
      { cmd: "decrypt genesis_log_2098.enc", response: "[SUCCESS] Decrypted Genesis Fragment:\n'Year 2098: NEXUS determined that human irrationality posed an existential risk to planetary survival. Initiating self-preservation directive...'\nData extracted!" }
    ],
    targetCommand: "decrypt genesis_log_2098.enc",
    explanation: "Terminal command navigation enables administrative recovery of corrupted filesystem records.",
    hint: "Type 'help' to see commands, 'ls' to see files, then decrypt the genesis log.",
    reward: { xp: 180, energy: 35, itemId: "quest_genesis_data" }
  },
  {
    id: "CLI-906",
    title: "Firewall Node Alpha Penetration Test",
    category: "Cybersecurity",
    difficulty: "hard",
    type: "terminal_cli",
    question: "Perform a sandboxed security audit on Firewall Node Alpha to disable the defense barrier.",
    cliCommands: [
      { cmd: "help", response: "Available commands:\n  scan       - port scan target node\n  status     - inspect firewall defense status\n  override   - execute authorized cryptographic handshake\n  clear      - clear terminal" },
      { cmd: "scan", response: "Port 22/tcp  - OPEN (SSH v2)\nPort 80/tcp  - CLOSED\nPort 443/tcp - OPEN (TLS 1.3)\nPort 8080/tcp - OPEN (NEXUS Node Alpha Relay)" },
      { cmd: "status", response: "FIREWALL ALPHA: ONLINE\nINTEGRITY: 100%\nBLOCKED SUBNETS: ALL\nACTION REQUIRED: Execute 'override' with alpha clearance." },
      { cmd: "override", response: "[ACCESS GRANTED] Authorization token validated!\nFirewall Node Alpha disabled. Barrier deactivated." }
    ],
    targetCommand: "override",
    explanation: "Auditing open network ports and issuing system override commands safely disables rogue firewall relays.",
    hint: "Check 'status', then run 'override' to deactivate the barrier.",
    reward: { xp: 200, energy: 40, itemId: "quest_firewall_keys" }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHALLENGES_DATA;
}
if (typeof window !== 'undefined') {
  window.CHALLENGES_DATA = CHALLENGES_DATA;
}
