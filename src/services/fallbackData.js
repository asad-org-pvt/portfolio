// Import existing bundled project screenshots
import confidantImg from "../Assets/Projects/confidant.png";
import klaimsImg from "../Assets/Projects/klaims.png";
import bulletproofImg from "../Assets/Projects/bulletproofinbox.png";
import manifestImg from "../Assets/Projects/manifestnotify.png";
import wasImg from "../Assets/Projects/wellsnsiesmic.png";
import makmanImg from "../Assets/Projects/makman.png";

// Import existing bundled certificates
import FEDevHackerrank from "../Assets/frontend_developer_react.pdf";
import JSInterHackerrank from "../Assets/js_intermediate.pdf";
import SEHackerrank from "../Assets/se.pdf";

// Import existing service icons
import feeIcon from "../Assets/fee.webp";
import beIcon from "../Assets/be.png";
import mdIcon from "../Assets/md.png";
import consultIcon from "../Assets/consult.png";

// Import existing resume
import resumePdf from "../Assets/Asad_Resume.pdf";

// Import graphics
import avatarSvg from "../Assets/avatar.svg";
import homeMainSvg from "../Assets/home-main.svg";
import aboutPng from "../Assets/about.png";
import contactPng from "../Assets/contact.png";

export const FALLBACK_PROFILE = {
  full_name: "Asad Sarwar",
  initials: "AS",
  hero_greeting: "Hi There!",
  hero_intro_title: "LET ME INTRODUCE MYSELF",
  hero_intro_body:
    "I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️ I am fluent in Javascript and Typescript. My field of Interest's are building new Web Technologies and Products. Whenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js, Angular and Next.js.",
  rotating_titles: [
    "Software Developer",
    "Freelancer",
    "MERN Stack Developer",
    "MEAN Stack Developer",
    "React Native Developer",
    "Android/IOS Developer",
  ],
  about_heading: "Know Who I'M",
  about_body:
    "Hi Everyone, I am Asad Sarwar from Pakistan. I am currently employed as a Software Engineer at Stella Technology. I have completed BS Software Engineering from the Sukkur IBA University.",
  about_quote: "Strive to build things that make a difference!",
  about_quote_author: "Asad",
  current_employer: "Stella Technology",
  education_summary: "BS Software Engineering from the Sukkur IBA University",
  hobbies: ["Travelling", "Watching Movies", "Reading Ancient History"],
  avatar_url: avatarSvg,
  hero_image_url: homeMainSvg,
  about_image_url: aboutPng,
  contact_image_url: contactPng,
  github_url: "https://github.com/asadsarwar1",
  linkedin_url: "https://www.linkedin.com/in/itsasadsarwar/",
  email: "notasadsarwar@gmail.com",
  phone: "+92-313-6100930",
  whatsapp: "+92-313-6100930",
  github_username_main: "asadsarwar1",
  github_username_alt: "asarwar-tes",
};

export const FALLBACK_PROJECTS = [
  {
    id: "fb-p1",
    title: "Confidant Health",
    description:
      "Confidant Health is both a tech platform and a network of top-notch behavioral health providers. We’re a virtual health system specializing in mental health and addiction. We combine cutting edge tech with great caregivers to help people thrive.",
    demo_url: "https://confidanthealth.com/",
    github_url: null,
    cover_image_url: confidantImg,
    is_featured: true,
    display_order: 1,
    is_published: true,
  },
  {
    id: "fb-p2",
    title: "Klaims",
    description:
      "Klaim is an award-winning fintech company based in UAE. Since 2019, we’ve been revolutionizing the healthcare industry by giving providers access to the working capital they need to grow faster and serve patients better. Our solutions are already trusted by more than 40 healthcare providers, and so far we’ve accelerated 300,000 claims and paid out 100 million AED in purchased claims",
    demo_url: "https://www.klaim.ai/",
    github_url: null,
    cover_image_url: klaimsImg,
    is_featured: false,
    display_order: 2,
    is_published: true,
  },
  {
    id: "fb-p3",
    title: "Bulletproof Inbox",
    description:
      "Bulletproof turns your open-access inbox into a permission-based one. Stop emails from unknown senders before they arrive in your inbox. It works with Gmail and Outlook.",
    demo_url: "https://www.bulletproofinbox.com/",
    github_url: null,
    cover_image_url: bulletproofImg,
    is_featured: false,
    display_order: 3,
    is_published: true,
  },
  {
    id: "fb-p4",
    title: "Manifest Notify",
    description:
      "MX Notify is a powerful, customizable tool that updates clinicians and other care providers moments after their patients are seen in the emergency department or are discharged from a hospital",
    demo_url: "https://www.manifestmedex.org/solutions/mx-notify/",
    github_url: null,
    cover_image_url: manifestImg,
    is_featured: false,
    display_order: 4,
    is_published: true,
  },
  {
    id: "fb-p5",
    title: "Wells and Siesmic",
    description:
      "Wells and Siesmic is an online data management and reporting tool for wells, siesmic and related data from Oman, Turkey and more. Data can also be exported and shared in many standards and formates.",
    demo_url: "https://was.demo.omanbidround.com",
    github_url: null,
    cover_image_url: wasImg,
    is_featured: false,
    display_order: 5,
    is_published: true,
  },
  {
    id: "fb-p6",
    title: "Makman",
    description:
      "Makman is an online open data market place, where you can access free data of wells and siesmic from Oman, Turkey and more. Data can also be purchased from there.",
    demo_url: "https://makman.om/",
    github_url: null,
    cover_image_url: makmanImg,
    is_featured: false,
    display_order: 6,
    is_published: true,
  },
];

export const FALLBACK_CERTIFICATIONS = [
  {
    id: "fb-c1",
    title: "Frontend Developer (React) Certificate",
    issuer: "HackerRank",
    description:
      "Awarded by HackerRank for successfully completing the Frontend Developer (React) Certificate. The certificate verifies that the recipient has successfully completed the Frontend Developer (React) Certificate.",
    credential_url: "https://www.hackerrank.com/certificates/c81d69157c24",
    file_url: FEDevHackerrank,
    thumbnail_url: null,
    is_pdf: true,
    display_order: 1,
    is_published: true,
  },
  {
    id: "fb-c2",
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    description:
      "Awarded by HackerRank for successfully completing the Software Engineer Certificate. The certificate verifies that the recipient has successfully completed the Software Engineer Certificate.",
    credential_url: "https://www.hackerrank.com/certificates/56fb13932891",
    file_url: SEHackerrank,
    thumbnail_url: null,
    is_pdf: true,
    display_order: 2,
    is_published: true,
  },
  {
    id: "fb-c3",
    title: "JavaScript (Intermediate) Certificate",
    issuer: "HackerRank",
    description:
      "Awarded by HackerRank for successfully completing the JavaScript (Intermediate) Certificate. The certificate verifies that the recipient has successfully completed the JavaScript (Intermediate) Certificate.",
    credential_url: "https://www.hackerrank.com/certificates/7c5552aeb986",
    file_url: JSInterHackerrank,
    thumbnail_url: null,
    is_pdf: true,
    display_order: 3,
    is_published: true,
  },
  {
    id: "fb-c4",
    title: "GCP: Core Infrastructure",
    issuer: "Google & Coursera",
    description:
      "Awarded by Google & Coursera for successfully completing the Google Cloud Platform Fundamentals: Core Infrastructure. The certificate verifies that the recipient has successfully completed the Google Cloud Platform Fundamentals: Core Infrastructure.",
    credential_url:
      "https://www.coursera.org/account/accomplishments/verify/GMTR8AY2YPRP?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
    thumbnail_url:
      "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP.jpeg",
    file_url: null,
    is_pdf: false,
    display_order: 4,
    is_published: true,
  },
  {
    id: "fb-c5",
    title: "Google IT Support Certificate",
    issuer: "Google & Coursera / Credly",
    description:
      "Awarded by Google & Coursera and authorized by Credly for successfully completing the Google IT Support Certificate. The certificate verifies that the recipient has successfully completed the Google IT Support Certificate.",
    credential_url:
      "https://www.credly.com/badges/b73c48de-d683-4d48-8f92-09fc59235554/linked_in_profile",
    thumbnail_url:
      "https://images.credly.com/size/680x680/images/ae2f5bae-b110-4ea1-8e26-77cf5f76c81e/GCC_badge_IT_Support_1000x1000.png",
    file_url: null,
    is_pdf: false,
    display_order: 5,
    is_published: true,
  },
  {
    id: "fb-c6",
    title: "Getting Started With Application Development: GCP",
    issuer: "Google & Coursera",
    description:
      "Awarded by Google & Coursera for successfully completing the Getting Started With Application Development: GCP. The certificate verifies that the recipient has successfully completed the Getting Started With Application Development: GCP.",
    credential_url:
      "https://www.coursera.org/account/accomplishments/verify/SX6KPVQHKM29?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
    thumbnail_url:
      "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29.jpeg",
    file_url: null,
    is_pdf: false,
    display_order: 6,
    is_published: true,
  },
];

export const FALLBACK_SERVICES = [
  {
    id: "fb-s1",
    title: "Frontend Development",
    description:
      "We have a team of experienced frontend developers who are proficient in React.js, Angular, and Next.js. We can build scalable and responsive web applications for you.",
    icon_url: feeIcon,
    cta_label: "Contact Us",
    cta_link: "/contact",
    display_order: 1,
    is_published: true,
  },
  {
    id: "fb-s2",
    title: "Backend Development",
    description:
      "We have a team of experienced backend developers who are proficient in Node.js, Express.js, and MongoDB. We can build scalable and secure backend for your web and mobile applications.",
    icon_url: beIcon,
    cta_label: "Contact Us",
    cta_link: "/contact",
    display_order: 2,
    is_published: true,
  },
  {
    id: "fb-s3",
    title: "Mobile Application Development",
    description:
      "We have a team of experienced React Native developers. We can build cross-platform mobile applications for you. Including the ability to build/publish mobile applications for both iOS and Android on App Store and Play Store.",
    icon_url: mdIcon,
    cta_label: "Contact Us",
    cta_link: "/contact",
    display_order: 3,
    is_published: true,
  },
  {
    id: "fb-s4",
    title: "Consultation Services",
    description:
      "We provide consultation services for your web and mobile applications. We can help you with the architecture of your application, the technology stack, and the best practices to follow.",
    icon_url: consultIcon,
    cta_label: "Contact Us",
    cta_link: "/contact",
    display_order: 4,
    is_published: true,
  },
];

export const FALLBACK_SKILLS = [
  // Technical (About page)
  { id: "fb-sk1", name: "JavaScript", category: "technical", icon_name: "DiJavascript1", display_order: 1 },
  { id: "fb-sk2", name: "React.js", category: "technical", icon_name: "DiReact", display_order: 2 },
  { id: "fb-sk3", name: "Android", category: "technical", icon_name: "DiAndroid", display_order: 3 },
  { id: "fb-sk4", name: "Apple", category: "technical", icon_name: "DiApple", display_order: 4 },
  { id: "fb-sk5", name: "Node.js", category: "technical", icon_name: "DiNodejs", display_order: 5 },
  { id: "fb-sk6", name: "Angular", category: "technical", icon_name: "DiAngularSimple", display_order: 6 },
  { id: "fb-sk7", name: "MongoDB", category: "technical", icon_name: "DiMongodb", display_order: 7 },
  { id: "fb-sk8", name: "Firebase", category: "technical", icon_name: "SiFirebase", display_order: 8 },
  { id: "fb-sk9", name: "MySQL", category: "technical", icon_name: "DiMysql", display_order: 9 },
  { id: "fb-sk10", name: "Next.js", category: "technical", icon_name: "SiNextdotjs", display_order: 10 },
  { id: "fb-sk11", name: "HTML5", category: "technical", icon_name: "DiHtml5", display_order: 11 },
  { id: "fb-sk12", name: "CSS3", category: "technical", icon_name: "DiCss3", display_order: 12 },
  { id: "fb-sk13", name: "Bootstrap", category: "technical", icon_name: "DiBootstrap", display_order: 13 },

  // Tools (About page)
  { id: "fb-t1", name: "macOS", category: "tool", icon_name: "SiMacos", display_order: 1 },
  { id: "fb-t2", name: "Xcode", category: "tool", icon_name: "SiXcode", display_order: 2 },
  { id: "fb-t3", name: "Android Studio", category: "tool", icon_name: "SiAndroidstudio", display_order: 3 },
  { id: "fb-t4", name: "VS Code", category: "tool", icon_name: "SiVisualstudiocode", display_order: 4 },
  { id: "fb-t5", name: "Postman", category: "tool", icon_name: "SiPostman", display_order: 5 },
  { id: "fb-t6", name: "Slack", category: "tool", icon_name: "SiSlack", display_order: 6 },
  { id: "fb-t7", name: "Vercel", category: "tool", icon_name: "SiVercel", display_order: 7 },
  { id: "fb-t8", name: "GitHub", category: "tool", icon_name: "DiGithub", display_order: 8 },
  { id: "fb-t9", name: "Jira", category: "tool", icon_name: "DiJira", display_order: 9 },

  // Service skills (Services page)
  { id: "fb-ss1", name: "JavaScript", category: "service", icon_name: "DiJavascript1", display_order: 1 },
  { id: "fb-ss2", name: "React.js", category: "service", icon_name: "DiReact", display_order: 2 },
  { id: "fb-ss3", name: "Express.js", category: "service", icon_name: "SiExpress", display_order: 3 },
  { id: "fb-ss4", name: "Android", category: "service", icon_name: "DiAndroid", display_order: 4 },
  { id: "fb-ss5", name: "Apple", category: "service", icon_name: "DiApple", display_order: 5 },
  { id: "fb-ss6", name: "Node.js", category: "service", icon_name: "DiNodejs", display_order: 6 },
  { id: "fb-ss7", name: "Angular", category: "service", icon_name: "DiAngularSimple", display_order: 7 },
  { id: "fb-ss8", name: "MongoDB", category: "service", icon_name: "DiMongodb", display_order: 8 },
  { id: "fb-ss9", name: "Firebase", category: "service", icon_name: "SiFirebase", display_order: 9 },
  { id: "fb-ss10", name: "MySQL", category: "service", icon_name: "DiMysql", display_order: 10 },
  { id: "fb-ss11", name: "Next.js", category: "service", icon_name: "SiNextdotjs", display_order: 11 },
  { id: "fb-ss12", name: "HTML5", category: "service", icon_name: "DiHtml5", display_order: 12 },
  { id: "fb-ss13", name: "CSS3", category: "service", icon_name: "DiCss3", display_order: 13 },
  { id: "fb-ss14", name: "Bootstrap", category: "service", icon_name: "DiBootstrap", display_order: 14 },
  { id: "fb-ss15", name: "AWS", category: "service", icon_name: "SiAmazonaws", display_order: 15 },
];

export const FALLBACK_RESUME = {
  id: "fb-r1",
  title: "Asad_Resume.pdf",
  file_url: resumePdf,
  version_label: "v1.0",
  is_active: true,
};

export const FALLBACK_CONTACT = {
  email: "notasadsarwar@gmail.com",
  phone: "+92-313-6100930",
  whatsapp: "+92-313-6100930",
  location: "Pakistan",
};

export const FALLBACK_SOCIAL_LINKS = [
  { platform: "github", url: "https://github.com/asadsarwar1", icon_name: "AiFillGithub", display_order: 1 },
  { platform: "linkedin", url: "https://www.linkedin.com/in/itsasadsarwar/", icon_name: "FaLinkedinIn", display_order: 2 },
];

export const FALLBACK_EXPERIENCE = [
  {
    id: "fb-e1",
    position: "Software Engineer",
    company: "Stella Technology",
    location: "Pakistan",
    start_date: "2022-01-01",
    end_date: null,
    is_current: true,
    description: "Full stack web and mobile development specializing in modern JavaScript/TypeScript, React, Node.js, and healthcare software solutions.",
    technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
    display_order: 1,
  },
];

export const FALLBACK_EDUCATION = [
  {
    id: "fb-ed1",
    institution: "Sukkur IBA University",
    degree: "Bachelor of Science (BS)",
    field_of_study: "Software Engineering",
    start_date: "2018-08-01",
    end_date: "2022-06-30",
    is_current: false,
    description: "BS Software Engineering from Sukkur IBA University.",
    display_order: 1,
  },
];

export const FALLBACK_SEO = {
  title: "Asad Sarwar | Portfolio",
  meta_description: "Self Developed personal website build with React.js",
  keywords: "software engineer, react developer, full stack developer, asad sarwar, portfolio",
  canonical_url: "https://asadsarwar.com",
};
