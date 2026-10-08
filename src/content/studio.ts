export interface ClientConfig {
  studioName: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  foundingYear: number;
  bookingSubject: string;
}

export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  deliverables: string[];
  timeline: string;
}

export interface WorkProject {
  id: string;
  title: string;
  client: string;
  category: "all" | "product" | "editing" | "web";
  categoryLabel: string;
  year: string;
  description: string;
  image: string;
  videoUrl?: string;
  tags: string[];
  metrics?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  headline: string;
  description: string;
  highlight?: string;
}

export interface EthicPrinciple {
  number: string;
  title: string;
  summary: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  summary: string;
  deliverables: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string;
  company: string;
  projectType: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "pricing" | "process" | "delivery" | "tech";
}

export const STUDIO_CONFIG: ClientConfig = {
  studioName: "Red Studios",
  tagline: "Cinematic Visuals & High-Performance Digital Experiences",
  email: "hello@redstudios.com", // [REPLACE ME: Client primary contact email]
  phone: "+1 (555) 234-8900",    // [REPLACE ME: Client studio phone]
  location: "London / Tokyo / New York",
  foundingYear: 2021,            // [REPLACE ME: Founding year]
  bookingSubject: "Call Request – Red Studios Discovery Session",
};

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Ethics", href: "#ethics" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Brief", href: "#brief" },
];

export const TRUST_METRICS: Metric[] = [
  { value: "140+", label: "Delivered Projects", detail: "Global product shoots, edit suites & web platforms" },
  { value: "99.4%", label: "On-Time Completion", detail: "Strict adherence to agreed launch milestones" },
  { value: "5 Yrs", label: "Studio Mastery", detail: "From raw cinematography to full-stack web" },
  { value: "$42M+", label: "Client Revenue Generated", detail: "Attributable to high-converting visual direction" },
];

export const TRUST_LOGOS = [
  { name: "AURA LUXE", symbol: "✦ AURA" },
  { name: "VELOCITY GEAR", symbol: "▲ VELOCITY" },
  { name: "MONOLITH LABS", symbol: "■ MONOLITH" },
  { name: "NOVA DRINKS", symbol: "● NOVA" },
  { name: "SYNAPSE AI", symbol: "◆ SYNAPSE" },
  { name: "ECHO COLLECTIVE", symbol: "✦ ECHO" },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "product-shoots",
    title: "High-End Product Photography & Film",
    subtitle: "Precision lighting, macro kinematics & luxury art direction",
    description:
      "We design evocative visual language for physical products. From 8K macro lens tabletop captures to high-speed liquid motion, every frame is engineered to trigger visceral desire.",
    iconName: "Camera",
    deliverables: [
      "8K RAW cinematography & macro photography",
      "Dynamic robotic camera motion & fluid kinematics",
      "Studio tabletop & lifestyle set construction",
      "Multi-angle e-commerce hero assets & 360 loops",
      "Full color-grading in DaVinci Resolve",
    ],
    timeline: "2 to 3 weeks",
  },
  {
    id: "ad-editing",
    title: "Advertisement Editing & Post-Production",
    subtitle: "Rhythmic pacing, kinetic sound design & VFX compositing",
    description:
      "We turn raw footage into high-retention commercial narratives. Tailored for TikTok, Meta Ads, YouTube pre-rolls, and broadcast television with relentless hook-focused pacing.",
    iconName: "Film",
    deliverables: [
      "Multi-hook creative variation testing (9:16 & 16:9)",
      "Bespoke sound design, foley & auditory impact mixing",
      "Motion graphics, typographic animation & titles",
      "VFX cleanups, screen replacements & beauty retouches",
      "Broadcast, social & digital master deliveries",
    ],
    timeline: "1 to 2 weeks",
  },
  {
    id: "full-stack-web",
    title: "Full-Stack Website Development",
    subtitle: "Production architectures built for speed, scale & conversions",
    description:
      "We build bespoke web platforms that turn casual visitors into committed clients. Powered by Next.js, headless CMS backends, TypeScript, and rock-solid cloud infrastructure.",
    iconName: "Code2",
    deliverables: [
      "Next.js App Router & serverless cloud infrastructure",
      "Headless CMS integration (Sanity / Strapi / Payload)",
      "High-velocity page speeds with 95+ Lighthouse scores",
      "Stripe / Shopify custom checkout & cart architecture",
      "Comprehensive SEO schema & analytics telemetry",
    ],
    timeline: "3 to 6 weeks",
  },
  {
    id: "landing-pages",
    title: "Landing Page Design & Development",
    subtitle: "Award-level aesthetic direction meets rigorous CRO science",
    description:
      "Single-page conversion engines designed to launch new offerings. We orchestrateWebGL interactive shaders, smooth inertia scrolling, and persuasive editorial copy.",
    iconName: "Layout",
    deliverables: [
      "Bespoke interactive 3D / WebGL brand moments",
      "Lenis smooth inertial scroll & scroll-linked choreography",
      "Editorial conversion copywriting & structured offers",
      "Multi-step lead qualification brief forms",
      "A/B split-testing readiness & Vercel deployment",
    ],
    timeline: "1 to 2 weeks",
  },
];

export const SELECTED_WORKS: WorkProject[] = [
  {
    id: "work-1",
    title: "Aura Chronograph 01",
    client: "Aura Timepieces [PLACEHOLDER]",
    category: "product",
    categoryLabel: "Product Film & Stills",
    year: "2025",
    description: "Macro-focus cinematography spotlighting hand-finished titanium bezels and anti-reflective sapphire crystals.",
    image: "/base_cream_16_9.jpg",
    tags: ["Product Cinematography", "Lighting Design", "Color Grade"],
    metrics: "+148% Pre-order Conversion",
  },
  {
    id: "work-2",
    title: "Velocity Kinetic Pulse",
    client: "Velocity Performance [PLACEHOLDER]",
    category: "editing",
    categoryLabel: "Commercial Post-Production",
    year: "2025",
    description: "Fast-cut commercial pacing synchronized to an industrial score for athletic footwear launch across 14 markets.",
    image: "/base_dark_16_9.png",
    tags: ["Ad Editing", "Sound Design", "VFX Compositing"],
    metrics: "4.2M Organic Social Impressions",
  },
  {
    id: "work-3",
    title: "Monolith Architecture Platform",
    client: "Monolith Design Group [PLACEHOLDER]",
    category: "web",
    categoryLabel: "Full-Stack Web Platform",
    year: "2025",
    description: "Next.js architectural portfolio with real-time WebGL blueprint viewer and Sanity headless CMS backend.",
    image: "/base_cream_16_9.jpg",
    tags: ["Next.js", "TypeScript", "Interactive WebGL"],
    metrics: "99/100 Lighthouse Performance",
  },
  {
    id: "work-4",
    title: "Nova Elixir Botanical Spirits",
    client: "Nova Beverage Co. [PLACEHOLDER]",
    category: "product",
    categoryLabel: "Product Shoot & 3D Motion",
    year: "2024",
    description: "High-speed liquid splash captures and botanical atmosphere lighting for a premium zero-proof aperitif brand.",
    image: "/base_dark_16_9.png",
    tags: ["Liquid Kinematics", "Tabletop Production", "Retouching"],
    metrics: "D&AD Visual Craft Shortlist",
  },
  {
    id: "work-5",
    title: "Synapse Intelligence Rebrand",
    client: "Synapse Systems [PLACEHOLDER]",
    category: "web",
    categoryLabel: "Landing Page & Design System",
    year: "2024",
    description: "High-converting single-page landing site with interactive neural network visualization and multi-step qualification.",
    image: "/base_cream_16_9.jpg",
    tags: ["Landing Page", "Interactive Design", "CRO"],
    metrics: "3.4x Demo Request Rate",
  },
  {
    id: "work-6",
    title: "Apex Motorsport Anthem",
    client: "Apex Racing Division [PLACEHOLDER]",
    category: "editing",
    categoryLabel: "Ad Edit & Soundscape",
    year: "2024",
    description: "30-second hyper-dense commercial edit combining onboard telemetry with sound-designed exhaust acoustics.",
    image: "/base_dark_16_9.png",
    tags: ["Commercial Edit", "Foley Design", "Cinema Grade"],
    metrics: "Broadcast & Global Digital Master",
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: "2021",
    title: "Studio Conception",
    headline: "Founded on pure visual obsession",
    description:
      "Red Studios began in a 600 sq ft industrial loft with a single cinema camera rig and a relentless refusal to accept mediocre product photography.",
    highlight: "First 12 brand commercial shoots completed.",
  },
  {
    year: "2022",
    title: "The Post-Production Suite",
    headline: "Expanding into high-velocity editorial narrative",
    description:
      "We built our in-house color and sound design suite, taking commercial clients from raw production to broadcast-certified delivery under one cohesive roof.",
    highlight: "Partnered with 8 venture-backed consumer brands.",
  },
  {
    year: "2023",
    title: "The Digital Crossover",
    headline: "Why build great imagery if the website fails to convert?",
    description:
      "Frustrated by seeing our films embedded on slow, broken client websites, we hired elite full-stack engineers and united visual production with Next.js development.",
    highlight: "Launched first 15 custom headless websites.",
  },
  {
    year: "2025",
    title: "The Unified Studio",
    headline: "Taking our full offering online globally",
    description:
      "Today, Red Studios operates as a unified creative powerhouse: directing your shoots, editing your commercials, and building the digital platform that converts your audience.",
    highlight: "140+ completed commissions across 9 countries.",
  },
];

export const PHILOSOPHY_PRINCIPLES: EthicPrinciple[] = [
  {
    number: "01",
    title: "Obsessive Quality",
    summary: "Good enough is the enemy of memorable.",
    description:
      "We scrutinize every frame, every bezier curve of motion, and every millisecond of server latency. When your brand appears before millions, every pixel communicates value.",
  },
  {
    number: "02",
    title: "Radical Transparency",
    summary: "No black boxes, no surprise invoices.",
    description:
      "You receive direct access to our live staging environments, raw project timelines, and shared Slack channels. We treat your budget as if it were our own capital.",
  },
  {
    number: "03",
    title: "Deadlines Are Promises",
    summary: "Launch dates are non-negotiable commitments.",
    description:
      "Product rollouts, campaign flights, and investor demos rely on our word. Over 5 years of operation, our on-time delivery rate has never dropped below 99%.",
  },
  {
    number: "04",
    title: "Client-First Collaboration",
    summary: "We partner with visionary founders, not bureaucracy.",
    description:
      "We maintain a low client-to-lead ratio. When you work with Red Studios, you deal directly with senior directors and engineers, never junior account managers.",
  },
  {
    number: "05",
    title: "Strategy Before Aesthetics",
    summary: "Visual spectacle without conversion is useless art.",
    description:
      "Before lighting a scene or writing a line of code, we analyze your customer acquisition funnel, product positioning, and conversion architecture.",
  },
  {
    number: "06",
    title: "Honest, Fixed Pricing",
    summary: "Clear scopes with milestone-anchored deliverables.",
    description:
      "No vague hourly retainers that drag out indefinitely. You receive a comprehensive, itemized project brief with a guaranteed ceiling before kickoff.",
  },
];

export const FOUNDER_QUOTE = {
  quote:
    "We built Red Studios because we were tired of seeing brands split their identity between a detached video agency and a disconnected web developer. When visual cinematic excellence and full-stack engineering speak the exact same language, magic happens.",
  author: "Creative Direction Team",
  role: "Founders, Red Studios",
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Creative Blueprint",
    duration: "Week 1",
    summary:
      "We unpack your business objectives, target buyer psychology, and brand aesthetics. We produce a comprehensive storyboard, mood boards, and technical scope.",
    deliverables: ["Creative Direction Deck", "Technical Architecture Scope", "Milestone Roadmap"],
  },
  {
    step: "02",
    title: "Concept Art & Prototypes",
    duration: "Week 1 - 2",
    summary:
      "For shoots, we build set dressings and lighting diagrams. For digital, we create high-fidelity interactive Figma prototypes and motion previews.",
    deliverables: ["Set & Lighting Blueprints", "Interactive Prototype", "Script & Shot Lists"],
  },
  {
    step: "03",
    title: "Production & Engineering",
    duration: "Week 2 - 4",
    summary:
      "Cameras roll on our sound stages. Simultaneously, our full-stack engineers build responsive Next.js architectures with clean TypeScript and Tailwind.",
    deliverables: ["8K RAW Footage Master", "Live Staging Website", "Full-Stack Codebase"],
  },
  {
    step: "04",
    title: "Review & Precision Refinement",
    duration: "Week 4 - 5",
    summary:
      "Two structured review rounds via Frame.io for video and live staging previews for web. We calibrate color grades, sound cues, and sub-pixel interactions.",
    deliverables: ["Color-Graded Passes", "Sound Design Mixes", "Performance Audits"],
  },
  {
    step: "05",
    title: "Delivery & Global Launch",
    duration: "Week 5",
    summary:
      "We deploy to Vercel global edge networks, transfer RAW archival video masters in all formats, and conduct a full live handoff training session.",
    deliverables: ["Vercel Edge Deployment", "Master Media Vault", "Post-Launch Warranty"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Red Studios handled both our hero product film and our Next.js e-commerce relaunch. Our conversion rate jumped by 86% within the first month. They are in a league of their own.",
    clientName: "Julian Vance [PLACEHOLDER]",
    clientRole: "Founder & CEO",
    company: "Aura Timepieces",
    projectType: "Product Shoot + Web",
    avatar: "✦",
  },
  {
    id: "t2",
    quote:
      "The ad edits they delivered for our paid acquisition channels cut our customer acquisition cost in half. Fast, communicative, and utterly uncompromising on visual quality.",
    clientName: "Elena Rostova [PLACEHOLDER]",
    clientRole: "Head of Growth",
    company: "Velocity Gear",
    projectType: "Commercial Ad Editing",
    avatar: "▲",
  },
  {
    id: "t3",
    quote:
      "Rarely do you find a team that understands both cinematic photography and clean, 100/100 Lighthouse frontend code. They took our platform from looking like a template to looking like an award-winner.",
    clientName: "Marcus Sterling [PLACEHOLDER]",
    clientRole: "Design Principal",
    company: "Monolith Architecture",
    projectType: "Full-Stack Web Platform",
    avatar: "■",
  },
];

export const FAQS: FAQItem[] = [
  {
    question: "What is your typical project turnaround time?",
    answer:
      "Depending on scope, standalone product shoots and commercial ad edits typically take 1 to 3 weeks. Custom landing pages take 2 weeks, and comprehensive full-stack Next.js platforms take 3 to 6 weeks. Fast-track options are available for time-sensitive product launches.",
    category: "process",
  },
  {
    question: "How does your pricing work?",
    answer:
      "We work strictly on fixed-price project quotes tied to clear, agreed-upon deliverables. Standalone commercial video packages start at $4,500, landing page design and development starts at $6,000, and full-stack bespoke platforms start at $12,000. No surprise hourly charges.",
    category: "pricing",
  },
  {
    question: "How many revisions are included in our engagement?",
    answer:
      "Every project includes two thorough revision rounds at key milestones (initial rough cut/staging prototype, and final master). Because we align deeply during Phase 1 Discovery with moodboards and interactive wireframes, 90% of our projects are approved on round one.",
    category: "process",
  },
  {
    question: "How are final video, photo, and code files delivered?",
    answer:
      "Video and photography are delivered in high-bitrate ProRes 422 HQ, 4K/8K master files, plus compressed social-ready formats via private cloud download. Web platforms are deployed directly to your Vercel/cloud account with full GitHub repository transfer.",
    category: "delivery",
  },
  {
    question: "Can you handle both our physical product shoots and our website build?",
    answer:
      "Yes, that is our primary superpower. Unifying product photography, commercial editing, and website development under one studio eliminates creative fragmentation and ensures your digital platform showcases the exact cinematic aesthetic of your imagery.",
    category: "process",
  },
  {
    question: "What technology stack do you use for web projects?",
    answer:
      "We specialize exclusively in modern, production-grade architectures: Next.js (App Router), TypeScript, Tailwind CSS, WebGL/Three.js for interactive shaders, Framer Motion/GSAP for fluid kinetics, and serverless hosting on Vercel. We integrate with Shopify, Stripe, Sanity, and Supabase.",
    category: "tech",
  },
  {
    question: "Do you offer post-launch support and maintenance?",
    answer:
      "Yes. Every web project includes 30 days of post-launch warranty and bug-fix support. We also offer monthly retainer partnerships for ongoing video asset generation, A/B test iterations, and platform feature expansions.",
    category: "delivery",
  },
  {
    question: "What do I need to prepare before booking our discovery call?",
    answer:
      "Just your vision and current brand assets (if any). If you have product samples ready to ship or specific reference links you admire, that helps us provide a precise scope and quote during our 30-minute discovery session.",
    category: "process",
  },
];
