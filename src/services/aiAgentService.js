/**
 * AI Agent Architecture for Academic Project Mentor
 * Implements the 8 core AI Agent services:
 * 1. Idea Evaluation Agent
 * 2. Scope Definition Agent
 * 3. Technology Recommendation Agent
 * 4. Project Roadmap Agent
 * 5. Task Generation Agent
 * 6. Daily Planning Agent
 * 7. Risk Assessment Agent
 * 8. Blueprint & Documentation Generator
 * 9. AI Mentor Agent
 */

// Domain-specific technology matrices for adaptive recommendations
const TECH_KNOWLEDGE_BASE = {
  'Artificial Intelligence': {
    frontend: { tech: 'React.js + TailwindCSS / Vite', purpose: 'Interactive AI dashboard and real-time visualization UI', why: 'Component-based architecture suitable for live telemetry, model metrics, and responsive charts.' },
    backend: { tech: 'FastAPI (Python 3.11)', purpose: 'High-performance asynchronous inference API gateway', why: 'Native Python ecosystem compatibility for ML pipelines with low latency async request handling.' },
    database: { tech: 'PostgreSQL + pgvector', purpose: 'Relational data persistence with vector embeddings', why: 'Industry-standard relational integrity coupled with native vector indexing for semantic search and feature embeddings.' },
    aiFramework: { tech: 'PyTorch / YOLOv8 / HuggingFace', purpose: 'Core model training, fine-tuning, and inference engine', why: 'State-of-the-art architectures with extensive community support, CUDA acceleration, and ONNX / TensorRT export.' },
    apis: { tech: 'WebSocket + RESTful Endpoints', purpose: 'Bidirectional streaming for real-time bounding boxes and model telemetry', why: 'Low-overhead real-time event streaming for interactive AI vision pipelines.' },
    deployment: { tech: 'Docker + NVIDIA Container Toolkit (Edge / Cloud)', purpose: 'Containerized execution environment', why: 'Guarantees reproducible CUDA driver dependencies and isolated GPU resource allocation.' }
  },
  'Machine Learning': {
    frontend: { tech: 'React + Chart.js / D3.js', purpose: 'Model performance and dataset distribution dashboard', why: 'High-speed canvas rendering for ROC curves, confusion matrices, and feature importance.' },
    backend: { tech: 'FastAPI / Flask', purpose: 'Predictive endpoint serving and batch processing', why: 'Lightweight WSGI/ASGI service optimized for scikit-learn and PyTorch model payloads.' },
    database: { tech: 'PostgreSQL / TimescaleDB', purpose: 'Feature store and historical training metrics', why: 'Robust time-series tracking of metric drift and tabular training records.' },
    aiFramework: { tech: 'Scikit-learn + XGBoost + PyTorch', purpose: 'Model engineering and gradient-boosted ensembles', why: 'Comprehensive machine learning algorithms optimized for tabular and structured data.' },
    apis: { tech: 'RESTful API with OpenAPI Specification', purpose: 'Standardized model inference endpoints', why: 'Seamless integration with client applications and external validation suites.' },
    deployment: { tech: 'Docker + AWS EC2 / On-premise Server', purpose: 'Production model serving', why: 'Scalable container deployment with automated health checks.' }
  },
  'Web Development': {
    frontend: { tech: 'React.js + Modern Vanilla CSS', purpose: 'Client-side presentation layer and user interface', why: 'Ultra-fast DOM rendering, modular state management, and full component flexibility.' },
    backend: { tech: 'Node.js + Express / NestJS', purpose: 'Business logic, authentication, and REST API controller', why: 'Event-driven, non-blocking I/O ideal for scalable data-driven web applications.' },
    database: { tech: 'PostgreSQL + Prisma ORM', purpose: 'Relational schema persistence and type-safe querying', why: 'ACID compliance, strict relational constraints, and automated schema migrations.' },
    aiFramework: { tech: 'OpenAI API / Local LLM Integration', purpose: 'Smart assistance, auto-completion, and text analytics', why: 'Effortless integration of intelligent conversational features into web workflows.' },
    apis: { tech: 'RESTful API + JWT Bearer Auth', purpose: 'Secure client-server communication', why: 'Stateless, scalable token-based authorization and clean resource modeling.' },
    deployment: { tech: 'Vercel / Netlify (Frontend) + Render / Railway (Backend)', purpose: 'Continuous deployment hosting', why: 'Zero-configuration Git integration, edge routing, and automated SSL provisioning.' }
  },
  'Data Science': {
    frontend: { tech: 'Streamlit / React Dashboard', purpose: 'Exploratory data visualization and KPI metrics', why: 'Rapid interactive dashboard creation with integrated analytical components.' },
    backend: { tech: 'FastAPI (Python)', purpose: 'Data extraction, transformation, and analytics pipeline', why: 'Native Pandas, Polars, and NumPy interoperability with fast serialization.' },
    database: { tech: 'PostgreSQL / ClickHouse', purpose: 'Analytical data warehouse and aggregation store', why: 'Columnar storage optimization for high-speed analytical aggregate queries.' },
    aiFramework: { tech: 'Pandas + NumPy + Scikit-Learn + Seaborn', purpose: 'Data wrangling, statistical modeling, and hypothesis testing', why: 'The definitive data science Python ecosystem for reproducible quantitative analysis.' },
    apis: { tech: 'REST API + Parquet / Arrow Data Exports', purpose: 'Data interchange and batch export protocols', why: 'Memory-efficient columnar data serialization.' },
    deployment: { tech: 'Docker + JupyterHub / Cloud VM', purpose: 'Reproducible computational environment', why: 'Isolated runtime environments for analytical notebooks and scheduled jobs.' }
  },
  'IoT': {
    frontend: { tech: 'React Web Dashboard + Mobile Responsive UI', purpose: 'Sensor monitoring and device command center', why: 'Real-time telemetry feeds and remote actuator toggle controls.' },
    backend: { tech: 'Node.js / Go + MQTT Broker (EMQX / Mosquitto)', purpose: 'High-throughput lightweight message ingestion', why: 'Publish-subscribe protocol engineered for low-bandwidth, battery-constrained devices.' },
    database: { tech: 'InfluxDB / TimescaleDB', purpose: 'Time-series sensor telemetry storage', why: 'Optimized downsampling and retention policies for high-frequency sensor readings.' },
    aiFramework: { tech: 'TensorFlow Lite / Edge Impulse / MicroPython', purpose: 'On-device edge inference and anomaly detection', why: 'Quantized neural networks running directly on microcontrollers and embedded microprocessors.' },
    apis: { tech: 'MQTT + WebSockets + REST API', purpose: 'Device-to-cloud and cloud-to-dashboard communications', why: 'Minimal packet overhead and real-time live device state synchronization.' },
    deployment: { tech: 'Raspberry Pi / ESP32 + AWS IoT Core', purpose: 'Embedded edge hardware and IoT cloud gateway', why: 'Industry-standard embedded hardware platforms with rich sensor peripheral support.' }
  },
  'Cybersecurity': {
    frontend: { tech: 'React Security Command Center UI', purpose: 'Threat detection dashboard and network event log viewer', why: 'Rapid filtering of large log streams and real-time threat alerts.' },
    backend: { tech: 'Python (FastAPI) / Go', purpose: 'Packet inspection, log parser, and rule evaluation engine', why: 'High memory safety, multi-threading performance, and rich networking libraries.' },
    database: { tech: 'Elasticsearch / OpenSearch + PostgreSQL', purpose: 'Full-text log indexing and security policy store', why: 'Near-instantaneous search and aggregation over millions of SIEM event records.' },
    aiFramework: { tech: 'Scikit-learn / Isolation Forests / Autoencoders', purpose: 'Unsupervised anomaly and intrusion detection', why: 'Detects zero-day anomalous network signatures without labeled attack training sets.' },
    apis: { tech: 'Syslog + REST API + Webhooks', purpose: 'Security log ingestion and automated alerting', why: 'Standardized security protocol integration with firewalls and endpoint agents.' },
    deployment: { tech: 'Hardened Linux Container (Ubuntu LTS / Alpine)', purpose: 'Secure isolated execution environment', why: 'Minimal attack surface with strict SELinux / AppArmor security profiles.' }
  },
  'Cloud Computing': {
    frontend: { tech: 'React + Cloud Resource Monitor UI', purpose: 'Multi-cloud resource management and billing dashboard', why: 'Componentized representation of virtual instances, buckets, and microservices.' },
    backend: { tech: 'Go / Node.js + Express', purpose: 'Cloud orchestrator and microservice controller', why: 'Ultra-low memory footprint and native concurrency for cloud resource lifecycle management.' },
    database: { tech: 'PostgreSQL + Redis Cache', purpose: 'Configuration metadata and session state cache', why: 'Fast sub-millisecond caching combined with ACID persistent state.' },
    aiFramework: { tech: 'Prophet / ARIMA / Scikit-learn', purpose: 'Cloud workload demand forecasting and auto-scaling', why: 'Predictive time-series modeling to minimize idle cloud provisioning costs.' },
    apis: { tech: 'gRPC + REST API', purpose: 'High-speed inter-service microservice RPC protocol', why: 'Binary protocol buffers delivering 10x throughput over traditional HTTP/JSON.' },
    deployment: { tech: 'Kubernetes (K8s) + Terraform (IaC)', purpose: 'Automated container orchestration and infrastructure as code', why: 'Declarative, self-healing cluster infrastructure management.' }
  }
};

/**
 * 1. IDEA EVALUATION AGENT
 * Analyzes problem clarity, feasibility, technical complexity, strengths, weaknesses, and academic recommendations.
 */
export const evaluateProjectIdea = (projectName, projectDescription, domain = 'Artificial Intelligence') => {
  const text = `${projectName} ${projectDescription}`.toLowerCase();
  
  const hasMethodology = text.includes('using') || text.includes('algorithm') || text.includes('model') || text.includes('pipeline') || text.includes('architecture') || text.includes('system');
  const hasMetrics = text.includes('fps') || text.includes('accuracy') || text.includes('latency') || text.includes('real-time') || text.includes('throughput') || text.includes('dataset');
  const hasHardwareOrPlatform = text.includes('embedded') || text.includes('web') || text.includes('cloud') || text.includes('gpu') || text.includes('jetson') || text.includes('mobile');
  
  let clarityScore = 70;
  if (hasMethodology) clarityScore += 15;
  if (hasMetrics) clarityScore += 10;
  if (hasHardwareOrPlatform) clarityScore += 5;
  clarityScore = Math.min(98, clarityScore);

  let feasibility = 'High';
  if (text.includes('quantum') || text.includes('satellite') || text.includes('custom silicon') || text.length > 500) {
    feasibility = 'Challenging';
  } else if (text.length < 50) {
    feasibility = 'Medium';
  }

  let complexity = 'High';
  if (text.includes('deep learning') || text.includes('tracking') || text.includes('edge') || text.includes('quantization') || text.includes('distributed')) {
    complexity = 'Advanced';
  } else if (text.includes('crud') || text.includes('simple') || text.includes('basic')) {
    complexity = 'Moderate';
  }

  const strengths = [
    `Strong problem alignment in the domain of ${domain}`,
    hasMethodology ? 'Concrete architectural methodology indicated in description' : 'Clear target domain application with practical impact',
    hasMetrics ? 'Quantifiable performance targets mentioned (latency/accuracy/throughput)' : 'Well-scoped objective suitable for academic evaluation'
  ];

  const potentialPitfalls = [
    'Data acquisition bottlenecks: Ensure dataset curation is completed early in Phase 1.',
    complexity === 'Advanced' ? 'Hardware compute limits: Plan model quantization (FP16/INT8) to avoid memory saturation.' : 'Scope creep: Maintain strict separation between core requirements and stretch features.',
    'Evaluation bias: Use standardized benchmark datasets with strict stratified splits.'
  ];

  const recommendations = [
    `Structure your Software Requirements Specification (SRS) around 4-5 measurable functional requirements.`,
    `Establish a baseline benchmark in Sprint 1 before applying advanced optimizations.`,
    `Schedule periodic supervisor checkpoints with mentor feedback documented at every milestone.`
  ];

  return {
    clarityScore,
    problemClarity: clarityScore >= 85 ? 'High - Well-formulated problem and target outcome' : 'Good - Clear problem definition with room for metric refinement',
    feasibilityLevel: feasibility,
    technicalComplexity: complexity,
    strengths,
    potentialPitfalls,
    recommendations,
    overallEvaluation: `The proposed project "${projectName}" is technically sound and academically rigorous. The project scope is well-matched for undergraduate/postgraduate defense.`
  };
};

/**
 * 2. SCOPE DEFINITION AGENT
 * Extracts In-Scope, Out-of-Scope, Core Features, Optional Features, and Deliverables.
 */
export const defineProjectScope = (projectName, projectDescription, domain = 'Artificial Intelligence') => {
  const text = `${projectName} ${projectDescription}`.toLowerCase();

  const isCV = text.includes('drone') || text.includes('yolo') || text.includes('vision') || text.includes('image') || text.includes('detection') || text.includes('tracking') || text.includes('video');
  const isNLP = text.includes('nlp') || text.includes('text') || text.includes('chat') || text.includes('language') || text.includes('llm') || text.includes('sentiment');
  const isWeb = text.includes('web') || text.includes('portal') || text.includes('platform') || text.includes('management') || text.includes('app');

  let inScope = [];
  let outOfScope = [];
  let coreFeatures = [];
  let optionalFeatures = [];

  if (isCV) {
    inScope = [
      'Custom dataset curation, annotation, and data augmentation pipeline',
      'Model architecture selection, training, and loss function tuning',
      'Real-time object detection and trajectory tracking integration',
      'Hardware inference benchmarking (FPS, memory, latency) on target deployment hardware',
      'IEEE standard academic thesis documentation and viva presentation deck'
    ];
    outOfScope = [
      'Proprietary military radar or live satellite uplink integration',
      'Custom silicon ASIC / FPGA hardware tape-out manufacturing',
      'Active counter-UAV kinetic disruption systems'
    ];
    coreFeatures = [
      'Real-time object detection with bounding box coordinates',
      'Continuous multi-target ID tracking across occlusions',
      'Telemetry streaming API for live inference coordinates',
      'Automated audit logging of per-frame latency'
    ];
    optionalFeatures = [
      'Multi-camera synchronized stereo vision depth estimation',
      'Thermal infrared sensor fusion'
    ];
  } else if (isNLP) {
    inScope = [
      'Text corpus preprocessing, tokenization, and vector embedding pipeline',
      'Model fine-tuning / prompt engineering on domain-specific dataset',
      'Semantic search / retrieval-augmented generation (RAG) backend',
      'Web-based interactive user interface with streaming text responses',
      'Quantitative evaluation using standard BLEU / ROUGE / accuracy benchmarks'
    ];
    outOfScope = [
      'Training multi-billion parameter foundation models from scratch',
      'Multi-lingual real-time speech synthesis hardware',
      'Proprietary closed-source enterprise database integration'
    ];
    coreFeatures = [
      'Natural language query ingestion and intent extraction',
      'Context retrieval from local vector knowledge store',
      'Streaming conversational response generation',
      'Citation and source attribution metadata'
    ];
    optionalFeatures = [
      'Voice input transcription with Whisper',
      'Automated PDF report summarizer'
    ];
  } else {
    inScope = [
      'System requirements analysis and database schema architecture',
      'Core business logic and secure RESTful API service development',
      'Responsive component-based web client interface',
      'Automated unit testing, integration tests, and error handling',
      'Academic project documentation (SRS/SDS, UML models, Viva deck)'
    ];
    outOfScope = [
      'Multi-region global high-availability cloud infrastructure',
      'Third-party commercial banking payment gateway contracts',
      'Native iOS/Android hardware device driver development'
    ];
    coreFeatures = [
      'Secure authentication and role-based access control',
      'Interactive data visualization and management dashboard',
      'Deterministic state persistence and audit trail logging',
      'Report generation and export module'
    ];
    optionalFeatures = [
      'Dark / light mode theme customization',
      'Real-time collaborative editing via WebSockets'
    ];
  }

  const functionalRequirements = [
    `FR-01: ${coreFeatures[0] || 'Execute primary algorithmic pipeline within defined latency limits'}`,
    `FR-02: ${coreFeatures[1] || 'Maintain state consistency across interactive user transactions'}`,
    `FR-03: ${coreFeatures[2] || 'Provide real-time visualization and telemetry via dashboard UI'}`,
    `FR-04: ${coreFeatures[3] || 'Generate audit logs and exportable reports according to academic standards'}`
  ];

  const nonFunctionalRequirements = [
    'NFR-01: Low latency execution (sub-100ms response / >30 FPS throughput where applicable)',
    'NFR-02: Peak memory footprint constrained to standard workstation / edge device limits',
    'NFR-03: High reliability with graceful exception handling and 99%+ uptime during testing'
  ];

  const deliverables = [
    { id: 'del_01', title: 'Architecture SRS / SDS Specification Document', format: 'PDF & Markdown', dueDate: 'Sprint 2', status: 'Completed' },
    { id: 'del_02', title: 'Core Pipeline Execution Codebase & Model Weights', format: 'Source Repo & Engine', dueDate: 'Sprint 4', status: 'In Progress' },
    { id: 'del_03', title: 'Empirical Benchmark Evaluation Report', format: 'CSV & PDF Analysis', dueDate: 'Sprint 5', status: 'Upcoming' },
    { id: 'del_04', title: '10-Slide Academic Viva Defense Presentation Deck', format: 'Slide Deck Outline', dueDate: 'Sprint 6', status: 'Upcoming' }
  ];

  return {
    inScope,
    outOfScope,
    coreFeatures,
    optionalFeatures,
    functionalRequirements,
    nonFunctionalRequirements,
    deliverables
  };
};

/**
 * 3. TECHNOLOGY RECOMMENDATION AGENT
 * Recommends optimal technologies based on project description and domain with purpose & justification.
 */
export const recommendTechnologyStack = (projectName, projectDescription, domain = 'Artificial Intelligence', userPreferences = {}) => {
  const base = TECH_KNOWLEDGE_BASE[domain] || TECH_KNOWLEDGE_BASE['Artificial Intelligence'];
  const text = `${projectName} ${projectDescription}`.toLowerCase();

  const customStack = { ...base };

  // Adjust for specific keywords in user description
  if (text.includes('jetson') || text.includes('edge')) {
    customStack.deployment = {
      tech: 'NVIDIA Jetson Xavier / Orin + TensorRT',
      purpose: 'Edge compute acceleration and hardware deployment',
      why: 'Hardware-accelerated deep learning inference with FP16/INT8 precision directly on embedded UAV/IoT hardware.'
    };
  }

  if (text.includes('yolo') || text.includes('detection')) {
    customStack.aiFramework = {
      tech: 'Ultralytics YOLOv8 + PyTorch + TensorRT',
      purpose: 'Object detection backbone and quantization engine',
      why: 'Industry-leading balance between mAP accuracy and high FPS throughput with seamless ONNX export.'
    };
  }

  if (text.includes('deepsort') || text.includes('tracking')) {
    customStack.aiFramework = {
      tech: 'YOLOv8 + DeepSORT / ByteTrack',
      purpose: 'Detection and multi-object Kalman filter trajectory tracking',
      why: 'Provides persistent target identity management across visual occlusions with low computational overhead.'
    };
  }

  if (userPreferences?.preferredTech) {
    customStack.frontend = {
      tech: userPreferences.preferredTech,
      purpose: 'Custom requested framework',
      why: 'Configured according to student/lab preference.'
    };
  }

  return customStack;
};

/**
 * 4. PROJECT ROADMAP AGENT
 * Generates an adaptive, stage-by-stage project roadmap.
 */
export const generateProjectRoadmap = (projectName, projectDescription, domain, startDate, targetDate, progress = 0) => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 86400000);
  const totalDays = Math.max(30, Math.round((end - start) / 86400000));

  const addDays = (d, count) => {
    const res = new Date(d);
    res.setDate(res.getDate() + count);
    return res.toISOString().split('T')[0];
  };

  const stages = [
    {
      id: 'stg_1',
      name: 'Project Understanding & Literature Survey',
      description: 'Review state-of-the-art papers, formulate problem scope, and define benchmark criteria.',
      targetDate: addDays(start, Math.round(totalDays * 0.15)),
      status: progress >= 15 ? 'Completed' : progress > 0 ? 'Current' : 'Current',
      progress: Math.min(100, Math.round((progress / 15) * 100))
    },
    {
      id: 'stg_2',
      name: 'Requirements & Architecture Specification',
      description: 'Design modular system architecture, data flow diagrams, and compile IEEE SRS document.',
      targetDate: addDays(start, Math.round(totalDays * 0.30)),
      status: progress >= 35 ? 'Completed' : progress >= 15 ? 'Current' : 'Upcoming',
      progress: progress >= 35 ? 100 : Math.max(0, Math.round(((progress - 15) / 20) * 100))
    },
    {
      id: 'stg_3',
      name: 'Dataset Engineering & Baseline Implementation',
      description: 'Curate dataset splits, configure loss functions, and establish baseline model pipeline.',
      targetDate: addDays(start, Math.round(totalDays * 0.50)),
      status: progress >= 55 ? 'Completed' : progress >= 35 ? 'Current' : 'Upcoming',
      progress: progress >= 55 ? 100 : Math.max(0, Math.round(((progress - 35) / 20) * 100))
    },
    {
      id: 'stg_4',
      name: 'Core Development & Optimization',
      description: 'Implement tracking, model quantization (FP16/TensorRT), and integration with application layer.',
      targetDate: addDays(start, Math.round(totalDays * 0.70)),
      status: progress >= 75 ? 'Completed' : progress >= 55 ? 'Current' : 'Upcoming',
      progress: progress >= 75 ? 100 : Math.max(0, Math.round(((progress - 55) / 20) * 100))
    },
    {
      id: 'stg_5',
      name: 'Empirical Testing & Hardware Benchmarking',
      description: 'Conduct stress testing, latency profiling, error margin analysis, and edge field validation.',
      targetDate: addDays(start, Math.round(totalDays * 0.85)),
      status: progress >= 90 ? 'Completed' : progress >= 75 ? 'Current' : 'Upcoming',
      progress: progress >= 90 ? 100 : Math.max(0, Math.round(((progress - 75) / 15) * 100))
    },
    {
      id: 'stg_6',
      name: 'Final Thesis Synthesis & Viva Defense',
      description: 'Finalize bound thesis document, prepare 10-slide presentation deck, and present defense before panel.',
      targetDate: addDays(start, totalDays),
      status: progress >= 100 ? 'Completed' : progress >= 90 ? 'Current' : 'Upcoming',
      progress: progress >= 100 ? 100 : Math.max(0, Math.round(((progress - 90) / 10) * 100))
    }
  ];

  return stages;
};

/**
 * 5. TASK GENERATION AGENT
 * Automatically breaks down the project into 15-20 dependency-linked, structured AI tasks.
 */
export const generateProjectTasks = (projectName, projectDescription, domain = 'Artificial Intelligence', startDate, targetDate) => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 86400000);
  const totalDays = Math.max(30, Math.round((end - start) / 86400000));

  const addDays = (d, count) => {
    const res = new Date(d);
    res.setDate(res.getDate() + count);
    return res.toISOString().split('T')[0];
  };

  const text = `${projectName} ${projectDescription}`.toLowerCase();
  const isCV = text.includes('drone') || text.includes('yolo') || text.includes('vision') || text.includes('image') || text.includes('detection') || text.includes('tracking');

  let rawTasks = [];

  if (isCV) {
    rawTasks = [
      {
        name: 'Literature Review of State-of-the-Art Aerial Detection',
        description: 'Analyze recent IEEE/CVPR research on YOLO, SSD, and transformer-based aerial object detection.',
        priority: 'High',
        estimatedDuration: '6 hours',
        estimatedMinutes: 360,
        dayOffset: Math.round(totalDays * 0.08),
        phase: 'Project Understanding & Literature Survey',
        dependencies: []
      },
      {
        name: 'Curate & Annotate 5,000 High-Resolution UAV Frames',
        description: 'Collect aerial footage across varied altitudes and lighting conditions; annotate with bounding boxes.',
        priority: 'High',
        estimatedDuration: '8 hours',
        estimatedMinutes: 480,
        dayOffset: Math.round(totalDays * 0.18),
        phase: 'Dataset Engineering & Baseline Implementation',
        dependencies: ['Literature Review of State-of-the-Art Aerial Detection']
      },
      {
        name: 'Implement Synthetic Data Augmentation Pipeline',
        description: 'Apply synthetic atmospheric fog, rain, glare, and optical vibration blur to simulate challenging flight environments.',
        priority: 'Medium',
        estimatedDuration: '4 hours',
        estimatedMinutes: 240,
        dayOffset: Math.round(totalDays * 0.25),
        phase: 'Dataset Engineering & Baseline Implementation',
        dependencies: ['Curate & Annotate 5,000 High-Resolution UAV Frames']
      },
      {
        name: 'Design System Architecture & Data Flow Specification',
        description: 'Construct multi-tier pipeline model detailing frame ingestion, inference queue, and tracking state.',
        priority: 'High',
        estimatedDuration: '5 hours',
        estimatedMinutes: 300,
        dayOffset: Math.round(totalDays * 0.32),
        phase: 'Requirements & Architecture Specification',
        dependencies: ['Literature Review of State-of-the-Art Aerial Detection']
      },
      {
        name: 'Configure Custom YOLOv8 Loss Functions & Anchor Scales',
        description: 'Calibrate CIoU regression loss and multi-scale feature pyramids for small-object aerial targets.',
        priority: 'High',
        estimatedDuration: '5 hours',
        estimatedMinutes: 300,
        dayOffset: Math.round(totalDays * 0.40),
        phase: 'Core Development & Optimization',
        dependencies: ['Implement Synthetic Data Augmentation Pipeline', 'Design System Architecture & Data Flow Specification']
      },
      {
        name: 'Train Baseline YOLOv8 Model Weights',
        description: 'Execute 300-epoch distributed training with cosine annealing learning rate scheduler on GPU cluster.',
        priority: 'High',
        estimatedDuration: '10 hours',
        estimatedMinutes: 600,
        dayOffset: Math.round(totalDays * 0.48),
        phase: 'Core Development & Optimization',
        dependencies: ['Configure Custom YOLOv8 Loss Functions & Anchor Scales']
      },
      {
        name: 'Compile TensorRT FP16 / INT8 Quantization Engine',
        description: 'Export PyTorch weights to ONNX and build optimized execution engine to maximize FPS on edge hardware.',
        priority: 'High',
        estimatedDuration: '6 hours',
        estimatedMinutes: 360,
        dayOffset: Math.round(totalDays * 0.58),
        phase: 'Core Development & Optimization',
        dependencies: ['Train Baseline YOLOv8 Model Weights']
      },
      {
        name: 'Integrate DeepSORT Multi-Target Kalman Tracking',
        description: 'Combine bounding box detections with cosine appearance embeddings for continuous ID persistence across occlusions.',
        priority: 'Medium',
        estimatedDuration: '6 hours',
        estimatedMinutes: 360,
        dayOffset: Math.round(totalDays * 0.65),
        phase: 'Core Development & Optimization',
        dependencies: ['Compile TensorRT FP16 / INT8 Quantization Engine']
      },
      {
        name: 'Benchmark Real-Time Inference FPS & Latency on Hardware',
        description: 'Measure sustained frame rates (>45 FPS), memory bandwidth, and thermal dissipation under continuous inference.',
        priority: 'High',
        estimatedDuration: '5 hours',
        estimatedMinutes: 300,
        dayOffset: Math.round(totalDays * 0.75),
        phase: 'Empirical Testing & Hardware Benchmarking',
        dependencies: ['Integrate DeepSORT Multi-Target Kalman Tracking']
      },
      {
        name: 'Draft Software Requirements & Design Specification (SRS/SDS)',
        description: 'Compile IEEE Std 830-1998 compliant architecture diagrams, data flow models, and test matrices.',
        priority: 'Medium',
        estimatedDuration: '7 hours',
        estimatedMinutes: 420,
        dayOffset: Math.round(totalDays * 0.85),
        phase: 'Final Thesis Synthesis & Viva Defense',
        dependencies: ['Benchmark Real-Time Inference FPS & Latency on Hardware']
      },
      {
        name: 'Prepare 10-Slide Academic Viva Defense Slide Deck',
        description: 'Create concise viva presentation with experimental tables, error analysis, and candidate speaker notes.',
        priority: 'Medium',
        estimatedDuration: '4 hours',
        estimatedMinutes: 240,
        dayOffset: Math.round(totalDays * 0.95),
        phase: 'Final Thesis Synthesis & Viva Defense',
        dependencies: ['Draft Software Requirements & Design Specification (SRS/SDS)']
      }
    ];
  } else {
    rawTasks = [
      {
        name: 'Academic Literature Survey & Feasibility Formulation',
        description: 'Analyze state-of-the-art approaches, open source libraries, and formulate concrete project milestones.',
        priority: 'High',
        estimatedDuration: '5 hours',
        estimatedMinutes: 300,
        dayOffset: Math.round(totalDays * 0.10),
        phase: 'Project Understanding & Literature Survey',
        dependencies: []
      },
      {
        name: 'System Architecture & Database Schema Design',
        description: 'Design relational database entity-relationship models, API endpoints, and data contract specifications.',
        priority: 'High',
        estimatedDuration: '6 hours',
        estimatedMinutes: 360,
        dayOffset: Math.round(totalDays * 0.22),
        phase: 'Requirements & Architecture Specification',
        dependencies: ['Academic Literature Survey & Feasibility Formulation']
      },
      {
        name: 'Implement Backend Business Logic & API Layer',
        description: 'Develop secure endpoints, input validation schemas, and database ORM transactions.',
        priority: 'High',
        estimatedDuration: '8 hours',
        estimatedMinutes: 480,
        dayOffset: Math.round(totalDays * 0.38),
        phase: 'Core Development & Optimization',
        dependencies: ['System Architecture & Database Schema Design']
      },
      {
        name: 'Develop Interactive Frontend Client Components',
        description: 'Construct responsive user interfaces, dashboard views, and real-time state management.',
        priority: 'High',
        estimatedDuration: '8 hours',
        estimatedMinutes: 480,
        dayOffset: Math.round(totalDays * 0.52),
        phase: 'Core Development & Optimization',
        dependencies: ['Implement Backend Business Logic & API Layer']
      },
      {
        name: 'Integration & Automated Test Suite Execution',
        description: 'Execute end-to-end integration tests, edge-case validation, and performance benchmark profiling.',
        priority: 'Medium',
        estimatedDuration: '6 hours',
        estimatedMinutes: 360,
        dayOffset: Math.round(totalDays * 0.68),
        phase: 'Empirical Testing & Hardware Benchmarking',
        dependencies: ['Develop Interactive Frontend Client Components']
      },
      {
        name: 'Compile IEEE Standard Thesis & Documentation',
        description: 'Draft comprehensive SRS/SDS report, system manuals, and prepare viva defense slide deck.',
        priority: 'Medium',
        estimatedDuration: '7 hours',
        estimatedMinutes: 420,
        dayOffset: Math.round(totalDays * 0.88),
        phase: 'Final Thesis Synthesis & Viva Defense',
        dependencies: ['Integration & Automated Test Suite Execution']
      }
    ];
  }

  // Format into rich task objects
  return rawTasks.map((t, idx) => ({
    id: `tsk_ai_${String(idx + 1).padStart(2, '0')}`,
    name: t.name,
    description: t.description,
    priority: t.priority,
    estimatedDuration: t.estimatedDuration,
    estimatedMinutes: t.estimatedMinutes,
    deadline: addDays(start, t.dayOffset),
    phase: t.phase,
    dependencies: t.dependencies,
    status: 'To Do',
    isAIGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

/**
 * 6. DAILY PLANNING AGENT ("Today's AI Plan")
 * Selects 2-3 highest-leverage tasks for today based on dependencies, deadlines, and focus history.
 */
export const generateDailyPlan = (project, tasks = [], focusStats = {}, milestones = [], progress = 0) => {
  if (!tasks || tasks.length === 0) {
    return {
      date: new Date().toISOString().split('T')[0],
      items: [],
      rationale: 'No project tasks currently registered. Generate tasks or create a project to receive daily AI planning.',
      focusGoalMinutes: 45
    };
  }

  const completedTaskNames = new Set(
    tasks.filter((t) => t.status === 'Completed').map((t) => t.name)
  );

  // Filter tasks that are unblocked (all dependencies satisfied)
  const unblockedIncomplete = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    if (!t.dependencies || t.dependencies.length === 0) return true;
    return t.dependencies.every((depName) => completedTaskNames.has(depName));
  });

  // Sort unblocked tasks by:
  // 1. High Priority first
  // 2. In Progress first
  // 3. Deadline proximity
  const todayStr = new Date().toISOString().split('T')[0];
  unblockedIncomplete.sort((a, b) => {
    if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
    if (b.status === 'In Progress' && a.status !== 'In Progress') return 1;

    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const pDiff = (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2);
    if (pDiff !== 0) return pDiff;

    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    return 0;
  });

  // Pick top 2-3 unblocked tasks
  const selectedTasks = unblockedIncomplete.slice(0, 3);

  if (selectedTasks.length === 0) {
    // All available tasks completed or blocked
    const anyIncomplete = tasks.filter((t) => t.status !== 'Completed');
    if (anyIncomplete.length === 0) {
      return {
        date: todayStr,
        items: [],
        rationale: '🎉 All project deliverables are 100% completed! Your next step is finalizing your Thesis Report in the Documentation Hub.',
        focusGoalMinutes: 30
      };
    }
    // Blocked by dependencies
    return {
      date: todayStr,
      items: anyIncomplete.slice(0, 1).map((t) => ({
        task: t,
        estimatedTime: t.estimatedDuration || '2 hours',
        order: 1,
        why: `Prerequisites required: ${t.dependencies?.join(', ')}`
      })),
      rationale: `Prioritize resolving prerequisite dependencies for "${anyIncomplete[0].name}".`,
      focusGoalMinutes: 45
    };
  }

  const items = selectedTasks.map((t, idx) => ({
    task: t,
    estimatedTime: t.estimatedDuration || '2 hours',
    order: idx + 1,
    why: idx === 0
      ? `Highest priority unblocked deliverable for the current milestone.`
      : `Subsequent logical step once previous task is completed.`
  }));

  const rationale = items.length > 0
    ? `Focus on "${items[0].task.name}" first because its prerequisites are satisfied and it advances your active sprint milestone.`
    : 'Maintain a steady 25-45 minute focus session today to build consistency.';

  return {
    date: todayStr,
    items,
    rationale,
    focusGoalMinutes: focusStats?.currentStreak >= 3 ? 60 : 45
  };
};

/**
 * 7. NEXT RECOMMENDED TASK SELECTOR
 * Resolves dependencies, priorities, deadlines, and returns the single next best action.
 */
export const getNextRecommendedTask = (tasks = [], milestones = []) => {
  if (!tasks || tasks.length === 0) return null;

  const completedNames = new Set(
    tasks.filter((t) => t.status === 'Completed').map((t) => t.name)
  );

  // Unblocked incomplete tasks
  const unblocked = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    if (!t.dependencies || t.dependencies.length === 0) return true;
    return t.dependencies.every((dep) => completedNames.has(dep));
  });

  if (unblocked.length === 0) {
    const incomplete = tasks.filter((t) => t.status !== 'Completed');
    if (incomplete.length === 0) return null;
    return {
      task: incomplete[0],
      why: `Prerequisite dependency check required: [${incomplete[0].dependencies?.join(', ')}]`,
      isBlocked: true
    };
  }

  // Priority sort
  unblocked.sort((a, b) => {
    if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
    if (b.status === 'In Progress' && a.status !== 'In Progress') return 1;

    const pWeight = { High: 3, Medium: 2, Low: 1 };
    const pDiff = (pWeight[b.priority] || 2) - (pWeight[a.priority] || 2);
    if (pDiff !== 0) return pDiff;

    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    return 0;
  });

  const best = unblocked[0];
  return {
    task: best,
    why: best.status === 'In Progress'
      ? 'Currently in progress. Complete this task to unblock downstream roadmap phases.'
      : best.priority === 'High'
      ? 'Highest leverage architectural priority with all prerequisite dependencies satisfied.'
      : 'Next scheduled deliverable in your active roadmap sprint.',
    isBlocked: false
  };
};

/**
 * 8. AI RISK ASSESSMENT AGENT
 * Analyzes project complexity, deadlines, incomplete tasks, and focus behavior.
 */
export const evaluateProjectRisks = (project, tasks = [], milestones = [], overdueTasks = [], focusMinutesThisWeek = 0) => {
  const risksList = [];
  const today = new Date().toISOString().split('T')[0];

  // Risk 1: Overdue deliverables
  if (overdueTasks.length > 0) {
    risksList.push({
      id: 'rsk_ai_overdue',
      name: `${overdueTasks.length} Deliverables Past Target Deadline`,
      probability: 'High',
      impact: 'High',
      severity: 'Critical',
      reason: `Tasks [${overdueTasks.map(t => t.name).slice(0, 2).join(', ')}] have passed their scheduled completion date.`,
      recommendedAction: 'Reschedule deadlines or break overdue tasks into smaller 48-hour sprints.'
    });
  }

  // Risk 2: Milestone proximity vs incomplete tasks
  milestones.forEach((m) => {
    if (m.status !== 'Completed' && m.endDate) {
      const daysLeft = Math.round((new Date(m.endDate) - new Date(today)) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 7) {
        risksList.push({
          id: `rsk_ai_milestone_${m.id}`,
          name: `Faculty Milestone "${m.name}" Approaching in ${daysLeft} Days`,
          probability: 'High',
          impact: 'High',
          severity: 'High',
          reason: `Milestone deadline is ${m.endDate}. Ensure deliverables are prepared for faculty review.`,
          recommendedAction: 'Dedicate today’s focus sessions exclusively to milestone deliverables.'
        });
      }
    }
  });

  // Risk 3: Low focus activity
  if (tasks.length > 0 && tasks.some(t => t.status !== 'Completed') && focusMinutesThisWeek < 20) {
    risksList.push({
      id: 'rsk_ai_low_focus',
      name: 'Low Weekly Focus Work (<20 mins logged)',
      probability: 'Medium',
      impact: 'Medium',
      severity: 'Moderate',
      reason: 'Consistency momentum is low this week, which increases the risk of pre-deadline cramming.',
      recommendedAction: 'Launch a 25-minute Pomodoro session in Focus Mode today.'
    });
  }

  // Fallback domain default risks if no dynamic risks triggered
  if (risksList.length === 0) {
    risksList.push({
      id: 'rsk_ai_default_1',
      name: 'Computational Resource Saturation during Extended Runs',
      probability: 'Medium',
      impact: 'Medium',
      severity: 'Moderate',
      reason: 'Model quantization or memory allocation may bottleneck without half-precision optimizations.',
      recommendedAction: 'Profile GPU/CPU memory bandwidth during Sprint 4.'
    });
  }

  return risksList;
};

/**
 * 9. AI BLUEPRINT GENERATOR
 * Generates an end-to-end system architecture blueprint derived from project requirements.
 */
export const generateProjectBlueprint = (project, scope, techStack) => {
  return {
    systemOverview: `The ${project.name} system is engineered as a decoupled multi-tier architecture with distinct presentation, service orchestration, persistence, and specialized compute pipelines.`,
    modules: [
      {
        name: 'Client Interface Layer',
        tech: techStack.frontend?.tech || 'React.js',
        responsibility: 'Telemetry display, task sprint board, real-time metrics visualizer, and user command dispatcher.',
        inputs: 'User interactions, focus timer triggers, form submissions',
        outputs: 'State mutations, REST/WebSocket API payloads'
      },
      {
        name: 'Service Orchestration & API Gateway',
        tech: techStack.backend?.tech || 'FastAPI / Node.js',
        responsibility: 'Request validation, authentication verification, business logic processing, and event logging.',
        inputs: 'Client API calls, streaming sensor/video payloads',
        outputs: 'Structured JSON responses, audit log entries, message queue events'
      },
      {
        name: 'Core Compute & Algorithm Engine',
        tech: techStack.aiFramework?.tech || 'PyTorch / YOLOv8 / TensorRT',
        responsibility: 'Model inference, feature extraction, quantization, and mathematical calculation routines.',
        inputs: 'Preprocessed data frames, batch tensors, input embeddings',
        outputs: 'Bounding boxes, classification labels, confidence scores'
      },
      {
        name: 'Persistence & Feature Store Layer',
        tech: techStack.database?.tech || 'PostgreSQL + LocalStorage',
        responsibility: 'Deterministic state persistence, relational entity relationships, and time-series focus telemetry.',
        inputs: 'Normalized database transactions, user session tokens',
        outputs: 'Persisted records, query result sets, audit trails'
      }
    ],
    dataFlow: [
      '1. Client triggers action or streams input data to the API Gateway.',
      '2. API Gateway validates request parameters and forwards payload to Core Compute Engine.',
      '3. Core Compute Engine executes optimized vectorized inference pipeline.',
      '4. Output metrics and telemetry are persisted to Database and broadcasted live to UI.'
    ],
    mermaidCode: `graph TD
    A[Client Presentation UI] -->|REST / WebSocket| B[Service API Gateway]
    B --> C[Core ${project.domain} Engine]
    C --> D[Quantized Model / Inference Pipeline]
    B --> E[Persistence & Storage Layer]
    D -->|Telemetry| A`
  };
};
