import neuronalCover from "./assets/books/goodreads/21192738.jpg";
import principlesCover from "./assets/books/goodreads/826396.jpg";
import theoreticalCover from "./assets/books/goodreads/170015.jpg";
import digitalDesignCover from "./assets/books/goodreads/2558730.jpg";
import madonnaCover from "./assets/books/goodreads/27793819.jpg";

export const profile = {
  name: "Nijat Mahmudov",
  intro: "This is where I share what I’ve been working on and what I’ve learned.",
  secondary: "Start with my projects, or take a look at my literature notes.",
  current: "Currently building a personal archive.",
  location: "Baku, Azerbaijan",
  email: "nicatmahmudov1440@gmail.com",
};

export const updates = [
  { title: "Projects section updated with recent research work", date: "Jul 2026", targetPage: "projects" },
  { title: "Literature Review updated with foundational paper notes", date: "Jun 2026", targetPage: "reviews" },
  { title: "Travel Map updated with new locations and visits", date: "May 2026", targetPage: "map" },
];

export const books = [
  { title: "Neuronal Dynamics", cover: neuronalCover },
  { title: "Principles of Neural Science", cover: principlesCover },
  { title: "Theoretical Neuroscience", cover: theoreticalCover },
  { title: "Digital Design & Computer Architecture", cover: digitalDesignCover },
  { title: "Madonna in a Fur Coat", cover: madonnaCover },
];

export const goals = [
  "Box for 3+ months",
  "Earn $2,000+/month",
  "Choose a good university for my master's",
  "Buy a watch",
  "Finish 5+ books",
  "Remember birthdays",
];

export const quests = [
  { title: "Launch the first version of this website", date: "2026" },
  { title: "Complete an independent research project", date: "2025" },
  { title: "Organize a collaborative workshop", date: "2025" },
  { title: "Create a twelve-poster collection", date: "2024" },
];

export const projects = [
  {
    number: "01",
    title: "Neural Population Dynamics in the Mouse Visual Cortex",
    kind: "Computational Neuroscience",
    year: "2026",
    description: "Engineered a Poisson GLM in Python to analyze 25 visual cortex neurons at 1 ms resolution, modeling temporal dependencies and inter-neuron interactions.",
  },
  {
    number: "02",
    title: "CLANE — Spatiotemporal Action Recognition on Neuromorphic Hardware",
    kind: "Neuromorphic Computing",
    year: "2025",
    description: "Developed an end-to-end SCNN + CLP-SNN spiking pipeline on Loihi 2 for online class-incremental learning from event cameras, achieving 16× lower latency and energy vs Jetson Orin.",
  },
  {
    number: "03",
    title: "EEG-Based Brain-Body Interface for GVS Control",
    kind: "Neuroengineering & BCI",
    year: "2024",
    description: "Built a real-time BBI classifying EEG motor imagery (left/right) and converting output into galvanic vestibular stimulation (GVS) via wireless UDP with sub-300ms latency.",
  },
];

export const posters = [
  { title: "After the Image", year: "2026", color: "#bf4d31" },
  { title: "No Fixed Address", year: "2025", color: "#466b57" },
  { title: "Open Until Late", year: "2025", color: "#caa54a" },
  { title: "A Room for Ideas", year: "2024", color: "#49688a" },
];

export const literatureCategories = [
  {
    title: "Computational & Theoretical Neuroscience",
    subtitle: "Readings focused on understanding neural population dynamics, encoding schemes, and biological modeling.",
    papers: [
      {
        id: "dayan-abbott-2001",
        number: "01",
        title: "Dayan & Abbott (2001) – Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems",
        authors: "Peter Dayan and L.F. Abbott",
        publication: "MIT Press (2001)",
        kind: "Theoretical Neuroscience",
        year: "2001",
        url: "https://mitpress.mit.edu/9780262541855/theoretical-neuroscience/",
        details: {
          whyReading: "When I first reached out to Prof. Giacomo Indiveri about the NSC program, one of his immediate recommendations was to build a firmer grounding in theoretical neuroscience, specifically pointing to Dayan & Abbott. Coming from an electrical engineering background, I knew how to implement spiking models in SystemVerilog, but I wanted to understand the mathematical and statistical theory behind neural coding rather than just treating spikes as digital pulses.",
          concepts: [
            {
              heading: "Neural Encoding & Spike Statistics",
              text: "Moving beyond simple rate coding to model firing rates as stochastic point processes (Poisson processes)."
            },
            {
              heading: "Receptive Field Modeling & GLMs",
              text: "How linear-nonlinear-Poisson (LNP) cascades and Generalized Linear Models (GLMs) estimate spike probabilities based on stimulus history and spike-train memory."
            },
            {
              heading: "Adaptation & Plasticity",
              text: "Mathematical formulations of how single-neuron thresholds adapt over time and how synaptic weights evolve under activity-dependent rules."
            }
          ],
          connection: "This book directly shaped how I approached my independent project on Neural Population Dynamics in the Mouse Visual Cortex. Instead of just counting spikes, I built Python pipelines to fit Poisson GLMs on 25 visual cortex neurons, using discrete and continuous log-likelihood metrics to evaluate temporal dependencies. It completely changed how I think about designing event-driven hardware: neural hardware isn't just about routing pulses; it's about preserving the statistical structure of spike timing."
        }
      },
      {
        id: "pillow-2008",
        number: "02",
        title: "Pillow et al. (2008) – Spatio-temporal correlations and visual signaling in a complete neuronal population",
        authors: "Jonathan W. Pillow, Jonathon Shlens, Liam Paninski, Alexander Sher, Alan M. Litke, E.J. Chichilnisky & Eero P. Simoncelli",
        publication: "Nature (2008)",
        kind: "Theoretical Neuroscience",
        year: "2008",
        url: "https://www.nature.com/articles/nature07240",
        details: {
          whyReading: "I stumbled upon Pillow et al.'s work while trying to figure out how to model interactions between neighboring neurons rather than treating each cell as an isolated unit. I wanted to see how coupled neural populations encode sensory information and whether accounting for inter-neuron correlations actually improves prediction accuracy.",
          concepts: [
            {
              heading: "Coupled GLM Framework",
              text: "Extends traditional single-cell GLMs by incorporating coupling filters between neurons, allowing the model to capture multi-neuron spike correlations."
            },
            {
              heading: "Information Decoding",
              text: "Demonstrates that ignoring spike-timing correlations across a population results in losing a significant amount of sensory information."
            },
            {
              heading: "Functional Connectivity",
              text: "Showcases how statistical dependencies extracted from multi-electrode recordings can reveal the functional network topology without needing explicit anatomical wiring diagrams."
            }
          ],
          connection: "This paper was a major reference when I was setting up my multi-neuronal spike-train analysis pipeline. It inspired me to include auto-regressive history filters and cross-correlation metrics when analyzing the mouse visual cortex dataset. From a hardware engineering perspective, Pillow’s findings reinforce why neuromorphic architectures need efficient on-chip interconnects (like AER mesh routing): biological computation relies heavily on real-time spatial and temporal correlations across neural ensembles."
        }
      },
    ],
  },
  {
    title: "SNN Learning Algorithms & Hardware Plasticity",
    subtitle: "Exploring biologically plausible learning, STDP, and on-chip learning constraints.",
    papers: [
      {
        id: "hwang-2021",
        number: "03",
        title: "Hwang, Kim & Park (2021) – Quantized STDP Weight Transfer for Hardware SNNs",
        authors: "Yong-Tae Hwang, Young-Mook Kim, and Jong-Sun Park",
        publication: "IEEE Access / MDPI Applied Sciences (2021)",
        kind: "SNN Learning & Plasticity",
        year: "2021",
        url: "https://ieeexplore.ieee.org/document/9664273",
        details: {
          whyReading: "While designing my undergraduate thesis project—a custom SystemVerilog LIF-SNN accelerator—one of my biggest bottlenecks was figure out how to handle synaptic weight resolution inside FPGA memory (BRAM). Floating-point weights are too expensive for low-power digital substrates, so I started digging into literature on quantized weight transfer and hardware-friendly STDP rules to see how others solved this on-chip memory constraint.",
          concepts: [
            {
              heading: "Offline Training to Quantized Transfer",
              text: "Trains an SNN offline using continuous weights and transfers them to a low-bit-width discrete hardware representation without catastrophic accuracy loss."
            },
            {
              heading: "STDP-Guided Fine-Tuning",
              text: "Uses a modified, quantized Spike-Timing-Dependent Plasticity (STDP) rule to fine-tune discrete synaptic weights directly on hardware."
            },
            {
              heading: "Memory vs. Accuracy Trade-off",
              text: "Proves that 8-bit to 16-bit fixed-point weight quantization offers the optimal sweet spot between BRAM resource utilization and classification accuracy."
            }
          ],
          connection: "This paper was directly relevant when I was implementing the 64-channel LIF-SNN processor on the Xilinx Zynq platform. It validated my decision to use a 16-bit fixed-point arithmetic pipeline for distance processing units and helped me design runtime-configurable configuration registers for neuron parameters. It’s a great example of hardware–algorithm co-design in action."
        }
      },
      {
        id: "fremaux-2016",
        number: "04",
        title: "Frémaux & Gerstner (2016) – Neuromodulated STDP & Three-Factor Learning Rules",
        authors: "Nicolas Frémaux and Wulfram Gerstner",
        publication: "Frontiers in Neural Circuits (2016)",
        kind: "SNN Learning & Plasticity",
        year: "2016",
        url: "https://www.frontiersin.org/articles/10.3389/fncir.2016.00036/full",
        details: {
          whyReading: "Standard pair-based STDP is great for unsupervised feature extraction, but it struggles with goal-directed reinforcement learning because it lacks a global feedback signal. I read Frémaux & Gerstner’s work to understand how biological brains bridge local synaptic plasticity with global reward signals through neuromodulation (dopamine), and how we can translate this into neuromorphic algorithms.",
          concepts: [
            {
              heading: "Three-Factor Learning Framework",
              text: "Combines pre-synaptic activity (Factor 1), post-synaptic activity (Factor 2), and a global neuromodulatory/reward signal (Factor 3) to update synaptic weights."
            },
            {
              heading: "Eligibility Traces",
              text: "Introduces the concept of temporary memory traces at the synapse that wait for a delayed reward signal before applying weight changes."
            },
            {
              heading: "Biological Plausibility & Hardware Alignment",
              text: "Explains how local eligibility traces resolve the temporal credit assignment problem without needing global backpropagation passes."
            }
          ],
          connection: "This paper gave me a much clearer theoretical framework when setting up the Continual Learning Plasticity (CLP-SNN) head for my CLANE project on Intel’s Loihi 2 chip. Loihi’s programmable synaptic microcode allows custom plasticity rules, and understanding three-factor learning showed me how to implement online class-incremental learning without suffering from catastrophic forgetting."
        }
      },
      {
        id: "huh-2018",
        number: "05",
        title: "Huh & Sejnowski (2018) – Gradient Descent for Spiking Neural Networks",
        authors: "Dongsung Huh and Terrence J. Sejnowski",
        publication: "arXiv / Salk Institute (2018)",
        kind: "SNN Learning & Plasticity",
        year: "2018",
        url: "https://arxiv.org/abs/1706.04698",
        details: {
          whyReading: "One of the fundamental challenges in SNNs is the non-differentiable nature of the spiking threshold function (the derivative of a step function is zero everywhere except at the threshold, where it's undefined). I read Huh & Sejnowski's paper to understand how surrogate gradient descent methods overcome this \"dead neuron\" problem during supervised training.",
          concepts: [
            {
              heading: "Surrogate Gradient Methods",
              text: "Replaces the non-differentiable step function in the backward pass with a continuous, smooth approximation (like a fast sigmoid or Gaussian derivative)."
            },
            {
              heading: "Recurrent SNN Dynamics",
              text: "Formulates gradient descent specifically for recurrent spiking networks, enabling them to learn complex temporal dynamics and sequence generation."
            },
            {
              heading: "Phase-Space Optimization",
              text: "Shows how network state transitions can be optimized directly in continuous state space before discrete spikes are emitted."
            }
          ],
          connection: "This paper formed the backbone of my PyTorch training pipelines for SNN models. Before deploying architectures onto FPGAs or Loihi 2, I train them offline using surrogate gradient descent. Understanding Sejnowski’s mathematical formulation helped me build reproducible evaluation pipelines across multiple random seeds, ensuring high accuracy before converting models to fixed-point hardware representations."
        }
      },
    ],
  },
  {
    title: "Bio-Signal Decoding & Neural Interfaces",
    subtitle: "Bridging biological motor intent with real-time hardware execution and closed-loop control.",
    papers: [
      {
        id: "del-vecchio-2020",
        number: "06",
        title: "Del Vecchio et al. (2020) – HD-sEMG Motor Unit Discharge Analysis",
        authors: "Alessandro Del Vecchio, et al.",
        publication: "IEEE Transactions on Biomedical Engineering (2020)",
        kind: "Bio-Signal Decoding & BCIs",
        year: "2020",
        url: "https://ieeexplore.ieee.org/document/9146380",
        details: {
          whyReading: "My long-term goal is to build hardware that decodes human motor intent to control prosthetics and neural interfaces in real time. To do that, I needed to understand what the biological signals (specifically high-density surface EMG) actually represent at the motor unit level, rather than treating raw muscle electrical activity as random noise.",
          concepts: [
            {
              heading: "Motor Unit Decompositions",
              text: "How HD-sEMG arrays allow us to extract individual motor unit action potential trains (MUAPTs) non-invasively using blind source separation algorithms."
            },
            {
              heading: "Firing Rate & Force Encoding",
              text: "Explains the relationship between motor unit discharge rates, recruitment thresholds, and force generation in skeletal muscles."
            },
            {
              heading: "Signal Quality & Spatial Sampling",
              text: "Highlights the importance of spatial resolution (electrode density and channel counts) in avoiding cross-talk between neighboring muscle groups."
            }
          ],
          connection: "This paper provided the physiological rationale when I was designing the front-end for my undergraduate thesis. It inspired my custom 64-channel threshold-based spike encoder, which converts raw analog bio-signals (EEG/EMG) into discrete spike streams before feeding them into my SystemVerilog LIF-SNN hardware accelerator. Understanding motor unit firing characteristics helped me set appropriate spike-encoding thresholds."
        }
      },
      {
        id: "leroux-2023",
        number: "07",
        title: "Leroux, Finkbeiner & Neftci (2023) – Online Spiking Transformers for Prosthetics",
        authors: "Timothée Leroux, Bernd Finkbeiner, and Emre O. Neftci",
        publication: "Frontiers in Neuroscience (2023)",
        kind: "Bio-Signal Decoding & BCIs",
        year: "2023",
        url: "https://www.frontiersin.org/articles/10.3389/fnins.2023.1171888/full",
        details: {
          whyReading: "Emre Neftci's lab at Jülich/Aachen does incredible work at the intersection of spiking neural networks and low-latency prosthetic control. I read this paper to see how modern attention mechanisms (Transformers) could be adapted to run on spiking neuron dynamics for ultra-fast, real-time myoelectric decoding.",
          concepts: [
            {
              heading: "Spiking Attention Mechanisms",
              text: "Replaces standard matrix-multiplication attention with event-driven, spike-based attention logic to reduce computational latency and dynamic power."
            },
            {
              heading: "Online Streaming Inference",
              text: "Formulates the transformer model to process continuous streaming EMG data without needing future context windows, enabling sub-50ms control loops."
            },
            {
              heading: "Prosthetic Hand Control",
              text: "Demonstrates robust proportional control over multiple finger degrees of freedom with significantly reduced energy footprints."
            }
          ],
          connection: "This paper heavily influenced two major parts of my work: first, my EEG-Based Brain-Body Interface project, where achieving sub-300ms system latency for GVS control was critical; and second, my current internship at Imperial College London (Kozlov Lab), where I’m developing hybrid CNN–ViT architectures with biologically-inspired gating mechanisms. It's a prime example of combining modern AI architectures with bio-inspired execution."
        }
      },
    ],
  },
  {
    title: "Neuromorphic Computing & Hardware",
    subtitle: "Architectures, AER protocols, and event-driven silicon execution.",
    papers: [
      {
        id: "davies-2018",
        number: "08",
        title: "Davies et al. (Intel Labs, 2018) – Intel Loihi Neuromorphic Processor",
        authors: "Mike Davies, Narayan Srinivasa, Lin-Hsiao Lin, Gautham Chinya, Yongqiang Cao, Sri H. Joshi, Andrew Lines, et al.",
        publication: "IEEE Micro (2018)",
        kind: "Neuromorphic Hardware",
        year: "2018",
        url: "https://ieeexplore.ieee.org/document/8259423",
        details: {
          whyReading: "When I began working on Intel's Loihi 2 chip for my CLANE project, I needed to thoroughly understand the architectural principles behind Intel's neuromorphic research processors—specifically how asynchronous mesh routing, programmable microcode, and digital neurocores operate together without a central clock.",
          concepts: [
            {
              heading: "Asynchronous Manycore Architecture",
              text: "Uses a network-on-chip (NoC) to connect independent neuromorphic cores that communicate purely through event-driven spike messages."
            },
            {
              heading: "Programmable Synaptic Microcode",
              text: "Allows researchers to program custom local learning rules (like STDP variants and reward-modulated plasticity) directly inside the synaptic memory of each core."
            },
            {
              heading: "Energy & Latency Benchmarks",
              text: "Demonstrates orders-of-magnitude energy efficiency improvements over traditional CPUs and GPUs for sparse, temporal workload execution."
            }
          ],
          connection: "This paper served as the reference architecture manual during my development of the CLANE (Spatiotemporal Action Recognition) pipeline on Loihi 2. Understanding Loihi’s mesh routing and core allocation allowed me to optimize an end-to-end spiking pipeline combining a 2D SCNN with a CLP-SNN head, achieving a 5 mJ/sample energy footprint and 16× lower latency compared to an NVIDIA Jetson Orin Nano baseline."
        }
      },
      {
        id: "indiveri-2011",
        number: "09",
        title: "Indiveri et al. (2011) – Neuromorphic Silicon Neuron Circuits",
        authors: "Giacomo Indiveri, Bernabe Linares-Barranco, Tara Julia Hamilton, Afordanyi van Schaik, Ralph Etienne-Cummings, Tobi Delbruck, Shih-Chii Liu, and Rodney Douglas",
        publication: "Frontiers in Neuroscience (2011)",
        kind: "Neuromorphic Hardware",
        year: "2011",
        url: "https://www.frontiersin.org/articles/10.3389/fnneu.2011.00073/full",
        details: {
          whyReading: "This is the foundational landmark paper written by Prof. Giacomo Indiveri, Tobi Delbruck, Shih-Chii Liu, and the pioneers at INI Zurich. I read it to understand the origin of bio-inspired silicon design—how subthreshold analog circuits and Address-Event Representation (AER) protocols emulate real biological ion channels and synapses.",
          concepts: [
            {
              heading: "Analog Subthreshold Physics",
              text: "Exploits the exponential current-voltage relationship of MOSFETs in the subthreshold regime to physical emulate channel conductance and membrane potential dynamics."
            },
            {
              heading: "Address-Event Representation (AER)",
              text: "A time-multiplexed digital bus protocol that allows thousands of continuous analog neurons to transmit asynchronous spikes across chip boundaries using binary addresses."
            },
            {
              heading: "Silicon Neuron Topologies",
              text: "Compares different circuit implementations of Integrate-and-Fire, Adaptive Exponential, and Conductance-Based silicon neurons."
            }
          ],
          connection: "Reading Indiveri’s foundational work gave me deep appreciation for the history of INI Zurich. On the practical side, understanding AER protocols was essential during my research assistantship at the ITU VLSI CAD Design Lab, where I designed real-time FPGA pipelines for 128×128 DVS (Dynamic Vision Sensor) event cameras, decoding AER streams into time surfaces for gesture recognition."
        }
      },
    ],
  },
];

export const literatureReviews = literatureCategories.flatMap((cat) => cat.papers);
export const reviews = literatureReviews;

export const researchDetailFPGA = {
  id: "fpga-biosignal-processing",
  number: "01",
  title: "FPGA-Based Event-Driven Biosignal Processing Platform",
  subtitle: "Custom Spiking Neural Network Accelerator in SystemVerilog",
  type: "Undergraduate Thesis & Poster Presentation",
  location: "Istanbul Technical University (ITU), Turkey",
  hardware: "Xilinx Zynq SoC (100 MHz)",
  year: "2026",
  color: "#bf4d31",
  sections: {
    problem: {
      title: "The Problem I Wanted to Solve",
      paragraphs: [
        "When you try to process bio-signals like EEG or EMG on edge devices (think wearable prosthetics or real-time brain-computer interfaces), traditional microcontrollers hit a hard wall: power consumption and execution latency.",
        "If you try to run continuous floating-point neural networks on a small battery-powered wearable, the chip heats up, drains the battery in hours, and introduces lag that makes real-time motor control feel unnatural.",
        "In my undergraduate thesis, I wanted to tackle this exact hardware bottleneck head-on. My goal wasn't just to train another software model in Python, but to design a custom, low-power Spiking Neural Network (SNN) hardware accelerator in SystemVerilog from scratch and deploy it onto a Xilinx Zynq FPGA."
      ]
    },
    hypothesis: {
      title: "Why Event-Driven Hardware? (The Hypothesis)",
      paragraphs: [
        "WELL... basically, biological brains don't compute by crunching continuous matrices of numbers at a fixed clock speed :D",
        "Instead, they operate asynchronously using discrete spikes—meaning neurons only fire and consume energy when meaningful change happens.",
        "To bring this biological efficiency to silicon:"
      ],
      bulletPoints: [
        "I designed a 64-channel threshold-based spike encoder right at the front-end.",
        "It converts raw bio-signal streams (EEG/EMG) into discrete spike events before passing them to the SNN cores.",
        "When the input signal is quiet or static, the hardware pipeline isn't burning dynamic power processing useless zeros."
      ]
    },
    architecture: {
      title: "What's Under the Hood? (Hardware Architecture)",
      intro: "Building this required balancing strict FPGA resource limits with high-speed timing closure at 100 MHz:",
      items: [
        {
          heading: "LIF-SNN Accelerator Core",
          text: "Fully custom Leaky Integrate-and-Fire (LIF) neuron processing units written in SystemVerilog."
        },
        {
          heading: "Dual-Port BRAM & Spike FIFO",
          text: "Optimized dual-port BRAM allocation for instant neuron state and weight retrieval, coupled with a 64-channel spike FIFO to queue asynchronous event bursts without losing data."
        },
        {
          heading: "Runtime Reconfigurability",
          text: "Designed dedicated configuration registers so parameters like neuron firing thresholds and decay rates can be updated on-the-fly without needing to re-synthesize the FPGA bitstream."
        }
      ]
    },
    findings: {
      title: "Key Benchmarks & Findings",
      intro: "We benchmarked the entire hardware pipeline on the Xilinx Zynq platform at 100 MHz:",
      items: [
        {
          heading: "Sub-millisecond Latency",
          text: "Achieved real-time spike encoding and classification latency, essential for closed-loop motor interfaces."
        },
        {
          heading: "Low Dynamic Power",
          text: "Drastically reduced power consumption compared to conventional continuous-sampling FPGA datapaths by leveraging event-driven sparsity."
        },
        {
          heading: "Hardware Verification",
          text: "Validated fixed-point arithmetic precision, timing closure, and resource utilization across synthetic and recorded bio-signal streams."
        }
      ]
    },
    abstract: {
      title: "Poster Abstract",
      paragraphs: [
        "Myoelectric and brain-computer interfaces require real-time, low-latency processing of multi-channel bio-signals within tight energy budgets. Traditional continuous-sampling architectures suffer from high dynamic power consumption and memory bandwidth bottlenecks. This project presents an event-driven hardware platform featuring a custom 64-channel LIF-SNN accelerator implemented in SystemVerilog on a Xilinx Zynq FPGA at 100 MHz.",
        "The platform integrates a threshold-based front-end spike encoder, dual-port BRAM state memory, and a 64-channel spike FIFO to achieve sparse, energy-efficient bio-signal processing. Experimental results demonstrate real-time execution with sub-millisecond latency and significant reductions in dynamic power, offering a scalable hardware foundation for wearable neuroprosthetic controllers."
      ]
    }
  }
};
