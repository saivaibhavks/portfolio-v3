export const METADATA = {
  title: "Portfolio | K S Saivaibhav",
  description:
    "I bridge the gap between design and development. I take responsibility to craft an aesthetic user experience using modern frontend architecture.",
  siteUrl: "https://ayushsingh.net/",
};

export const MENULINKS = [
  {
    name: "Home",
    ref: "home",
  },
  {
    name: "Works",
    ref: "works",
  },
  {
    name: "Skills",
    ref: "skills",
  },
  {
    name: "Experience",
    ref: "timeline",
  },
  {
    name: "Contact",
    ref: "contact",
  },
];

export const TYPED_STRINGS = [
  "Crafting seamless UIs",
  "Bringing designs to life",
  "Creating fluid interfaces",
  "Elevating user journeys",
  "Interactive, intuitive, impactful",
  "Building scalable UIs",
];

export const EMAIL = "saivaibhavks2022@gmail.com";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/saivaibhav-k-s-5b28821a3/",
  github: "https://github.com/saivaibhavks",
  twitter: "https://x.com/KsSaivaibhav",
  gmail: "saivaibhavks2022@gmail.com",
};

export interface IProject {
  name: string;
  image: string;
  blurImage: string;
  description: string;
  gradient: [string, string];
  url: string;
  tech: string[];
}

export const PROJECTS: IProject[] = [
  {
    name: "Hirrd - Job Finding Application",
    image: "/projects/hirrd.png",
    blurImage: "/projects/blur/figgen-blur.jpg",
    description: "Employer dashboard with real-time job application tracking.",
    gradient: ["#1F6582", "#1ABCFE"],
    url: "https://hirrd.vercel.app/",
    tech: ["typescript", "figma", "tailwind"],
  },
  {
    name: "covid19 Tracker",
    image: "/projects/covid19.png",
    blurImage: "/projects/blur/myokr-blur.jpg",
    description: "Real-time alerts for COVID-19 exposure based on proximity.",
    gradient: ["#153BB9", "#0E2C8B"],
    url: "https://www.huminos.com/",
    tech: ["react", "next", "gsap", "tailwind"],
  },
  {
    name: "DLT Labs Website",
    image: "/projects/dlt-website.jpg",
    blurImage: "/projects/blur/dlt-website-blur.jpg",
    description: "Marketing site with an Internal CMS from scratch",
    gradient: ["#245B57", "#004741"],
    url: "https://www.dltlabs.com/",
    tech: ["figma", "angular", "gsap"],
  },
  {
    name: "ngx-quill-upload",
    image: "/projects/ngx-quill-upload.jpg",
    blurImage: "/projects/blur/ngx-quill-upload-blur.jpg",
    description: "NPM Package for Quill JS uploads from Angular",
    gradient: ["#3A0000", "#771E1E"],
    url: "https://www.npmjs.com/package/ngx-quill-upload",
    tech: ["npm", "angular", "typescript"],
  },
];

export const SKILLS = {
  frontend: [
    "javascript",
    "react",
    "redux",
    "next",
    "angular",
    "gsap",
    "tailwind",
    "sass",
    "svg",
    "html",
    "css",
  ],
  userInterface: ["figma", "sketch", "illustrator", "photoshop"],
  other: ["git", "webpack", "gulp", "lightroom", "aftereffects"],
};

export enum Branch {
  LEFT = "leftSide",
  RIGHT = "rightSide",
}

export enum NodeTypes {
  CONVERGE = "converge",
  DIVERGE = "diverge",
  CHECKPOINT = "checkpoint",
}

export enum ItemSize {
  SMALL = "small",
  LARGE = "large",
}

export const TIMELINE: Array<TimelineNodeV2> = [
  {
    type: NodeTypes.CHECKPOINT,
    title: "2025",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "SDE @CARS24",
    size: ItemSize.SMALL,
    subtitle: `Part of the Platform Team (New Business), driving development across Insight360, Incentives, User Management, and Payments. Also built DevSpace—our internal developer workspace for streamlined support.`,
    image: "/timeline/cars24.jpg",
    slideImage: "/timeline/cars24.jpg",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "2022",
    size: ItemSize.LARGE,
    image: "/timeline/juspay.png",
    slideImage: "/timeline/juspay.png",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Technical Product Analyst @Juspay",
    size: ItemSize.SMALL,
    subtitle: `Worked on the UPI Dashboard team for Juspay, contributing to modules like Orders, Refunds, and Merchant Onboarding. Also played a key role in building the Namma Yatri project.`,
    image: "/timeline/juspay.png",
    slideImage: "/timeline/juspay.png",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
];

export type TimelineNodeV2 = CheckpointNode | BranchNode;

export interface CheckpointNode {
  type: NodeTypes.CHECKPOINT;
  title: string;
  subtitle?: string;
  size: ItemSize;
  image?: string;
  slideImage?: string;
  shouldDrawLine: boolean;
  alignment: Branch;
}

export interface BranchNode {
  type: NodeTypes.CONVERGE | NodeTypes.DIVERGE;
}

export const GTAG = "UA-163844688-1";
