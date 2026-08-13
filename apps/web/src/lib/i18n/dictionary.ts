/**
 * Landing-page copy in both languages. Scoped to the marketing page
 * (src/app/page.tsx and src/components/landing/**) — the authenticated app
 * (dashboard, forms, admin) is English-only for now; extend this dictionary
 * and lib/i18n/use-t.ts's usages there if that's needed later.
 */

const dictionary = {
  bn: {
    nav: {
      howItWorks: "কিভাবে কাজ করে",
      features: "সুবিধা",
      support: "সাপোর্ট",
      login: "লগইন",
      register: "অ্যাকাউন্ট খুলুন",
      openMenu: "মেনু খুলুন",
      closeMenu: "মেনু বন্ধ করুন",
    },
    hero: {
      eyebrow: "🇧🇩 বাংলাদেশের ডিজিটাল গোল্ড ওয়ালেট",
      headingLine1: "নিরাপদে সোনা কিনুন ও বিক্রি করুন,",
      headingLine2: "প্রতিটি লেনদেন লেজারে সুরক্ষিত",
      body: "অ্যাকাউন্ট খুলুন, KYC সম্পন্ন করুন, এবং গ্রাম হিসেবে সোনা কেনাবেচা করুন — স্বচ্ছ রেট, নিরাপদ ওয়ালেট এবং সম্পূর্ণ অডিট ট্রেইল সহ।",
      ctaPrimary: "এখনই অ্যাকাউন্ট খুলুন",
      ctaSecondary: "লগইন করুন",
      cardBadge: "৯৯৯.৯ ফাইন",
      cardRateLabel: "বর্তমান গোল্ড রেট",
      cardRateUnit: "প্রতি গ্রাম",
      cardLive: "লাইভ",
      rateNotSet: "সেট করা হয়নি",
    },
    why: {
      tabAsset: "কেন গোল্ড?",
      tabPlatform: "কেন Gold BD?",
      asset: {
        heading: "কেন গোল্ডে সঞ্চয় করবেন?",
        intro: "নগদ টাকার মূল্য সময়ের সাথে কমে, কিন্তু সোনা ঐতিহাসিকভাবে সম্পদ সংরক্ষণের একটি নির্ভরযোগ্য মাধ্যম।",
        points: [
          { title: "মূল্যস্ফীতি প্রতিরোধী", description: "বাজার অস্থিতিশীল হলেও সোনা দীর্ঘমেয়াদে মূল্য ধরে রাখে।" },
          { title: "সহজে তারল্যযোগ্য", description: "যেকোনো সময় বাজার রেটে বিক্রি করে সাথে সাথে নগদ পেতে পারেন।" },
          { title: "ভগ্নাংশে কেনার সুযোগ", description: "পুরো ভরি না কিনে যত ইচ্ছা গ্রাম পরিমাণে শুরু করতে পারেন।" },
        ],
      },
      platform: {
        heading: "কেন Gold BD বেছে নেবেন?",
        intro: "প্রতিটি ফিচার তৈরি হয়েছে স্বচ্ছতা, নিরাপত্তা এবং সহজ ব্যবহারযোগ্যতাকে কেন্দ্র করে।",
        points: [
          { title: "লেজার-ব্যাকড লেনদেন", description: "প্রতিটি কেনা-বেচা ডাবল-এন্ট্রি লেজারে রেকর্ড হয়, সম্পূর্ণ অডিট ট্রেইলসহ।" },
          { title: "যাচাইকৃত KYC", description: "NID ভেরিফিকেশনের মাধ্যমে প্রতিটি অ্যাকাউন্ট নিরাপদ রাখা হয়।" },
          { title: "রিয়েল-টাইম রেট", description: "সবসময় হালনাগাদ রেট অনুযায়ী কেনাবেচা, কোনো লুকানো চার্জ ছাড়াই।" },
        ],
      },
    },
    rateHistory: {
      heading: "গোল্ড রেট ও ক্যালকুলেটর",
      subheading: "এই প্ল্যাটফর্মে অ্যাডমিন যে রেট সেট করেছেন তার প্রকৃত ইতিহাস — কোনো বাহ্যিক মার্কেট ডেটা নয়।",
      chartCardTitle: "সময়ের সাথে রেট",
      loading: "লোড হচ্ছে…",
      noData: "এখনো কোনো রেট সেট করা হয়নি।",
      singlePointLabel: "বর্তমান রেট",
      singlePointHint: "চার্ট দেখতে আরও রেট পয়েন্ট দরকার — অ্যাডমিন নতুন রেট সেট করলে এখানে যোগ হবে।",
      tableShow: "টেবিল হিসেবে দেখুন",
      tableHide: "টেবিল লুকান",
      tableDate: "তারিখ",
      tablePrice: "প্রতি গ্রাম",
      calcTitle: "গোল্ড ক্যালকুলেটর",
      calcCurrentRate: "বর্তমান রেট",
      calcPerGram: "/ গ্রাম",
      calcAmountLabel: "টাকার পরিমাণ (৳)",
      calcResultLabel: "আনুমানিক পরিমাণ",
    },
    features: {
      heading: "প্ল্যাটফর্মের সুবিধাসমূহ",
      subheading: "প্রতিটি ফিচার তৈরি হয়েছে স্বচ্ছতা ও নিরাপত্তাকে কেন্দ্র করে।",
      items: [
        { title: "লেজার-ব্যাকড লেনদেন", description: "প্রতিটি কেনা-বেচা ডাবল-এন্ট্রি লেজারে রেকর্ড হয় — কোনো ব্যালেন্স হারিয়ে যাওয়ার সুযোগ নেই।" },
        { title: "যাচাইকৃত KYC", description: "NID ভেরিফিকেশনের মাধ্যমে প্রতিটি অ্যাকাউন্ট নিরাপদ ও সুরক্ষিত রাখা হয়।" },
        { title: "রিয়েল-টাইম রেট", description: "সবসময় হালনাগাদ গোল্ড রেট অনুযায়ী কিনুন ও বিক্রি করুন, কোনো লুকানো চার্জ ছাড়াই।" },
        { title: "সার্বক্ষণিক ওয়ালেট অ্যাক্সেস", description: "নগদ ও গোল্ড ব্যালেন্স একসাথে দেখুন, যেকোনো সময় ডিপোজিট বা উইথড্র করুন।" },
      ],
    },
    howItWorks: {
      heading: "কিভাবে কাজ করে",
      subheading: "চারটি সহজ ধাপে সোনা কেনাবেচা শুরু করুন।",
      steps: [
        { step: "১", title: "অ্যাকাউন্ট খুলুন", description: "মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে রেজিস্টার করুন, OTP দিয়ে ভেরিফাই করুন।" },
        { step: "২", title: "KYC সম্পন্ন করুন", description: "NID নম্বর ও প্রয়োজনীয় ডকুমেন্ট জমা দিন — যাচাই শেষে অ্যাকাউন্ট সক্রিয় হবে।" },
        { step: "৩", title: "ওয়ালেটে টাকা যোগ করুন", description: "ডিপোজিট করে ক্যাশ ব্যালেন্স রাখুন, যেকোনো সময় উইথড্র করতে পারবেন।" },
        { step: "৪", title: "কিনুন বা বিক্রি করুন", description: "লাইভ রেট দেখে গ্রাম হিসেবে সোনা কিনুন বা বিক্রি করুন — সাথে সাথে ওয়ালেট আপডেট হবে।" },
      ],
      phoneBrand: "GOLD BD",
      phoneGoldBalance: "গোল্ড ব্যালেন্স",
      phoneCashBalance: "ক্যাশ ব্যালেন্স",
      phoneBuy: "কিনুন",
      phoneSell: "বিক্রি",
    },
    trust: {
      heading: "নিরাপত্তা যেভাবে নিশ্চিত করি",
      subheading: "কোনো তৃতীয় পক্ষের দাবি নয় — এই প্ল্যাটফর্মের নিরাপত্তা যেভাবে বাস্তবে কাজ করে।",
      badges: [
        { title: "ডাবল-এন্ট্রি লেজার", description: "প্রতিটি লেনদেন অডিটযোগ্য — কোনো ব্যালেন্স পরিবর্তন লেজারের বাইরে হয় না।" },
        { title: "এনক্রিপ্টেড সেশন", description: "পাসওয়ার্ড হ্যাশড ও httpOnly সেশন কুকির মাধ্যমে সুরক্ষিত।" },
        { title: "NID-ভিত্তিক KYC", description: "প্রতিটি অ্যাকাউন্ট যাচাই করা হয় জাতীয় পরিচয়পত্রের ভিত্তিতে।" },
        { title: "রেট-লিমিটেড API", description: "অস্বাভাবিক ট্রাফিক ও অপব্যবহার থেকে সুরক্ষা।" },
      ],
    },
    tagline: {
      words: ["সহজ", "নিরাপদ", "স্বচ্ছ"],
      body: "প্রতিটি গ্রাম, প্রতিটি লেনদেন — লেজারে রেকর্ড করা, যেকোনো সময় যাচাইযোগ্য।",
    },
    faq: {
      heading: "সাধারণ জিজ্ঞাসা",
      subheading: "যা জানা দরকার শুরু করার আগে।",
      items: [
        { question: "সর্বনিম্ন কত গ্রাম সোনা কেনা যায়?", answer: "কোনো নির্দিষ্ট সর্বনিম্ন সীমা নেই — আপনার ওয়ালেটের ব্যালেন্স অনুযায়ী যেকোনো পরিমাণ গ্রামে কিনতে পারবেন।" },
        { question: "KYC ছাড়া কি ট্রেড করা যাবে?", answer: "না। কেনাবেচা শুরু করার আগে NID ভিত্তিক KYC ভেরিফিকেশন সম্পন্ন করতে হবে, যা /kyc পেজ থেকে জমা দেওয়া যায়।" },
        { question: "গোল্ড রেট কে নির্ধারণ করে?", answer: "অ্যাডমিন প্যানেল থেকে রেট আপডেট করা হয় এবং তা সাথে সাথে সব ইউজারের জন্য কার্যকর হয়।" },
        { question: "টাকা তোলা কতটা নিরাপদ?", answer: "প্রতিটি ডিপোজিট ও উইথড্র লেজার এন্ট্রি হিসেবে রেকর্ড হয়, তাই যেকোনো সময় লেনদেনের ইতিহাস যাচাই করা যায়।" },
      ],
    },
    footer: {
      tagline: "লেজার-ব্যাকড ডিজিটাল গোল্ড ওয়ালেট — স্বচ্ছ রেট, নিরাপদ লেনদেন।",
      productHeading: "প্রোডাক্ট",
      supportHeading: "সাপোর্ট",
      copyright: "এটি একটি ডেমো/স্ক্যাফোল্ড প্রজেক্ট।",
    },
    ctaBand: {
      heading: "আজই আপনার গোল্ড ওয়ালেট খুলুন",
      body: "মাত্র কয়েক মিনিটে অ্যাকাউন্ট খুলুন এবং সোনা কেনাবেচা শুরু করুন।",
      cta: "শুরু করুন",
    },
  },
  en: {
    nav: {
      howItWorks: "How it works",
      features: "Features",
      support: "Support",
      login: "Log in",
      register: "Create account",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "🇧🇩 Bangladesh's digital gold wallet",
      headingLine1: "Buy and sell gold safely,",
      headingLine2: "every transaction secured on a ledger",
      body: "Open an account, complete KYC, and trade gold by the gram — a transparent rate, a secure wallet, and a complete audit trail.",
      ctaPrimary: "Create your account",
      ctaSecondary: "Log in",
      cardBadge: "999.9 fine",
      cardRateLabel: "Current gold rate",
      cardRateUnit: "per gram",
      cardLive: "Live",
      rateNotSet: "Not set yet",
    },
    why: {
      tabAsset: "Why gold?",
      tabPlatform: "Why Gold BD?",
      asset: {
        heading: "Why save in gold?",
        intro: "Cash loses value over time, but gold has historically been a reliable way to preserve wealth.",
        points: [
          { title: "Inflation-resistant", description: "Gold holds its value over the long run even when markets are volatile." },
          { title: "Easy to liquidate", description: "Sell at the market rate any time and receive cash instantly." },
          { title: "Buy in fractions", description: "No need to buy a full bhori — start with as many grams as you like." },
        ],
      },
      platform: {
        heading: "Why choose Gold BD?",
        intro: "Every feature is built around transparency, security, and ease of use.",
        points: [
          { title: "Ledger-backed transactions", description: "Every trade is recorded as a double-entry ledger posting, with a complete audit trail." },
          { title: "Verified KYC", description: "Every account is secured through NID-based verification." },
          { title: "Real-time rate", description: "Trade at the always-current rate — no hidden fees." },
        ],
      },
    },
    rateHistory: {
      heading: "Gold rate & calculator",
      subheading: "This is the actual history of rates this platform's admin has set — not external market data.",
      chartCardTitle: "Rate over time",
      loading: "Loading…",
      noData: "No rate has been set yet.",
      singlePointLabel: "Current rate",
      singlePointHint: "A chart needs a few more rate points — it'll appear here as the admin sets new rates.",
      tableShow: "View as table",
      tableHide: "Hide table",
      tableDate: "Date",
      tablePrice: "Per gram",
      calcTitle: "Gold calculator",
      calcCurrentRate: "Current rate",
      calcPerGram: "/ gram",
      calcAmountLabel: "Amount (৳)",
      calcResultLabel: "Estimated amount",
    },
    features: {
      heading: "Platform features",
      subheading: "Every feature is built around transparency and security.",
      items: [
        { title: "Ledger-backed transactions", description: "Every trade is recorded on a double-entry ledger — no balance can ever go missing." },
        { title: "Verified KYC", description: "Every account is kept safe and secure through NID verification." },
        { title: "Real-time rate", description: "Buy and sell at the always-current gold rate, with no hidden fees." },
        { title: "Wallet, anytime", description: "See your cash and gold balances together, and deposit or withdraw whenever you like." },
      ],
    },
    howItWorks: {
      heading: "How it works",
      subheading: "Start trading gold in four simple steps.",
      steps: [
        { step: "1", title: "Create an account", description: "Register with your mobile number and password, then verify with an OTP." },
        { step: "2", title: "Complete KYC", description: "Submit your NID number and the required documents — your account activates once verified." },
        { step: "3", title: "Fund your wallet", description: "Deposit to build a cash balance, and withdraw whenever you need to." },
        { step: "4", title: "Buy or sell", description: "Trade gold by the gram at the live rate — your wallet updates instantly." },
      ],
      phoneBrand: "GOLD BD",
      phoneGoldBalance: "Gold balance",
      phoneCashBalance: "Cash balance",
      phoneBuy: "Buy",
      phoneSell: "Sell",
    },
    trust: {
      heading: "How security actually works here",
      subheading: "Not a third-party claim — this is how this platform's security actually works.",
      badges: [
        { title: "Double-entry ledger", description: "Every transaction is auditable — no balance ever changes outside the ledger." },
        { title: "Encrypted sessions", description: "Passwords are hashed, and sessions are secured with httpOnly cookies." },
        { title: "NID-based KYC", description: "Every account is verified against a national ID." },
        { title: "Rate-limited API", description: "Protection against abusive or abnormal traffic." },
      ],
    },
    tagline: {
      words: ["Easy", "Secure", "Transparent"],
      body: "Every gram, every transaction — recorded on the ledger, verifiable any time.",
    },
    faq: {
      heading: "Frequently asked questions",
      subheading: "What you need to know before you start.",
      items: [
        { question: "What's the minimum amount of gold I can buy?", answer: "There's no fixed minimum — you can buy any amount in grams your wallet balance allows." },
        { question: "Can I trade without KYC?", answer: "No. NID-based KYC verification is required before trading, submitted from the /kyc page." },
        { question: "Who sets the gold rate?", answer: "An admin updates the rate from the admin panel, and it takes effect for every user immediately." },
        { question: "How safe is withdrawing money?", answer: "Every deposit and withdrawal is recorded as a ledger entry, so transaction history can be verified at any time." },
      ],
    },
    footer: {
      tagline: "A ledger-backed digital gold wallet — transparent rates, secure transactions.",
      productHeading: "Product",
      supportHeading: "Support",
      copyright: "This is a demo/scaffold project.",
    },
    ctaBand: {
      heading: "Open your gold wallet today",
      body: "Create an account in a few minutes and start trading gold.",
      cta: "Get started",
    },
  },
} as const;

export type Locale = keyof typeof dictionary;
// Union (not "bn"'s literal shape) — both locales must be structurally identical,
// but their string literal values differ, so the type has to admit either.
export type Dictionary = (typeof dictionary)[Locale];

export default dictionary;
