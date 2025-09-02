import { createContext, useContext } from 'react';

export type Language = 'en' | 'zh';

export interface Translation {
  // Navigation
  nav: {
    home: string;
    lore: string;
    stamps: string;
    community: string;
    token: string;
  };
  
  // Home page
  home: {
    title: string;
    subtitle: string;
    heroDescription: string;
    originDescription: string;
    machineEvolution: string;
    storyDetails: string;
    mysteryQuote: string;
    ghostBorn: string;
    originsTitle: string;
    originsSub: string;
    mysteryTitle: string;
    mysterySub: string;
    legendSub: string;
    featuresTitle: string;
    mysterySelfReplication: string;
    firstSrc20Token: string;
    legendaryStatus: string;
    exclusiveInquiry: string;
    exclusiveDescription: string;
    contactForm: {
      name: string;
      email: string;
      message: string;
      submit: string;
      placeholder: {
        name: string;
        email: string;
        message: string;
      };
    };
  };
  
  // Lore page
  lore: {
    title: string;
    subtitle: string;
          origins: {
        title: string;
        description: string;
        secretCabal: string;
      };
    ghostMachine: {
      title: string;
      original: string;
      manifestation: string;
      duplicates: string;
      description: string;
      quote: string;
    };
    token: {
      title: string;
      description: string;
      intervention: string;
      details: string;
      marketStats: string;
    };
    legend: {
      title: string;
      description: string;
      television: string;
    };
  };
  
  // Stamps page
  stamps: {
    title: string;
    subtitle: string;
    description: string;
    anomaly: string;
  };
  
  // Community page
  community: {
    title: string;
    subtitle: string;
    highlights: string;
  };

  // Token page
  token: {
    title: string;
    subtitle: string;
    description: string;
    marketCap: string;
    holders: string;
    volume: string;
    queryProtocol: string;
    loadingData: string;
    protocolStatus: string;
    deployStatus: string;
    marketStatus: string;
    loading: string;
    connecting: string;
    error: string;
    errorDesc: string;
    totalSupply: string;
    marketCapLabel: string;
    holdersLabel: string;
    wallets: string;
    totalVolumeLabel: string;
    deploymentStamp: string;
    perMintLimit: string;
    fairLaunchStatus: string;
    minted: string;
    protocol: string;
  };

  // Footer
  footer: {
    tagline: string;
    links: string;
    disclaimer: string;
  };
  
  // Buttons and actions
  buttons: {
    viewOriginal: string;
    tradeToken: string;
    viewStamps: string;
    viewMoreArt: string;
    viewMoreVideos: string;
    tradeOnOpenstamp: string;
    tradeOnSuperex: string;
    playVideo: string;
    viewGif: string;
    viewImage: string;
    submitRsvp: string;
    submitting: string;
    lazyKevinsSoon: string;
    legendaryComplete: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      home: "Home",
      lore: "Lore",
      stamps: "Stamps",
      community: "Community",
      token: "Token"
    },
    home: {
      title: "THE KEVIN SAGA",
      subtitle: "Ghost in the Machine • Bitcoin Legend • First SRC-20 Token",
      heroDescription: "ORIGIN_STORY.LOG",
      originDescription: "When stampchain.io launched, Arwyn created stamp #4258 - a portrait of Kevin as a commemorative gift.",
      machineEvolution: "But the machine had other ideas...",
      storyDetails: "The stamp machine began printing Kevin repeatedly, creating 104 byte-perfect duplicates between stamps #4258 to #18430.",
      mysteryQuote: "No one knows why it started. No one knows why it stopped.",
      ghostBorn: "> GHOST_IN_THE_MACHINE.EXE",
      originsTitle: "Origins",
      originsSub: "From secret cabal of Bitcoin art pioneers to immutable data storage birth",
      mysteryTitle: "Mystery",
      mysterySub: "104 self-replicating stamps, no explanation, only legend",
      legendSub: "First SRC-20 token, global meme, digital celebrity",
      featuresTitle: "THE LEGEND",
      mysterySelfReplication: "Mystery Self-Replication",
      firstSrc20Token: "First SRC-20 Token",
      legendaryStatus: "Legendary Status",
      exclusiveInquiry: "Exclusive Kevin Stamp Inquiry",
      exclusiveDescription: "Own a piece of Bitcoin history. Submit your inquiry for exclusive Kevin stamp acquisition opportunities.",
      contactForm: {
        name: "Name",
        email: "Email", 
        message: "Message",
        submit: "Submit Inquiry",
        placeholder: {
          name: "Your name",
          email: "your.email@example.com",
          message: "Tell us about your interest in Kevin stamps..."
        }
      }
    },
    lore: {
      title: "The Kevin Saga",
      subtitle: "Origins • Mystery • Legend",
      origins: {
        title: "🌟 Origins: Birth of Bitcoin Art",
        description: "Bitcoin Stamps originated from the Counterparty protocol, where many original Bitcoin pioneers have been gathering since 2016, creating art and tokens on Bitcoin.",
        secretCabal: "Secret cabal of Bitcoin art pioneers"
      },
      ghostMachine: {
        title: "👻 Ghost in the Machine",
        original: "Stamp #4258: The Original",
        manifestation: "🔥 KEVIN MANIFESTS 🔥",
        duplicates: "All byte-perfect copies, yet each one unique and legendary",
        description: "To this day, no one knows what caused these stamps to start self-minting, and no one knows why they stopped. It was a unique moment - the birth of a ghost in the machine.",
        quote: "Kevin is a feature, not a bug. Kevin is the ghost in the machine."
      },
      token: {
        title: "🪙 Kevin: First SRC-20 Token",
        description: "When the SRC-20 protocol began development, creating tokens was not initially a priority. The team was just researching the technology, experimenting to discover what was possible.",
        intervention: "⚡ The Blockchain Gods Intervened ⚡",
        details: "Token Details",
        marketStats: "Market Stats"
      },
      legend: {
        title: "🎬 The Legend Continues",
        description: "Kevin has evolved into a global meme. A digital celebrity has been created - one who embodies the best of what we can all be, the Satoshi within us all.",
        television: "Kevin on Television"
      }
    },
    stamps: {
      title: "104 Kevin Stamps",
      subtitle: "Complete collection of mysterious self-replicating stamps",
      description: "Between stamps #4258 and #18430, Kevin manifested 104 times on the Bitcoin blockchain.",
      anomaly: "> ANOMALY.DAT"
    },
    community: {
      title: "Community Gallery",
      subtitle: "Wild creations from Kevin believers worldwide",
      highlights: "> FEATURED_HIGHLIGHTS.LOG"
    },
    token: {
      title: "Kevin Token",
      subtitle: "First SRC-20 Token on Bitcoin",
      description: "Born from mystery, Kevin became the first SRC-20 token deployed on the Bitcoin blockchain.",
      marketCap: "BTC Market Cap",
      holders: "Holders",
      volume: "Total Volume",
      queryProtocol: "Querying Protocol...",
      loadingData: "Loading market data...",
      protocolStatus: "Protocol Status",
      deployStatus: "Deployment Status",
      marketStatus: "Market Status",
      loading: "LOADING...",
      connecting: "Connecting to Bitcoin network...",
      error: "ERROR",
      errorDesc: "Unable to load token data",
      totalSupply: "Total Supply",
      marketCapLabel: "Market Cap",
      holdersLabel: "Holders",
      wallets: "Wallets",
      totalVolumeLabel: "Total Volume",
      deploymentStamp: "Deployment Stamp",
      perMintLimit: "Per Mint Limit",
      fairLaunchStatus: "Fair Launch Status",
      minted: "Minted",
      protocol: "Protocol"
    },
    footer: {
      tagline: "Ghost in the Machine\nFeature, Not a Bug\nLiving Legend on Bitcoin",
      links: "Links",
      disclaimer: "This website is for entertainment and educational purposes only."
    },
    buttons: {
      viewOriginal: "🎯 VIEW ORIGINAL #4258",
      tradeToken: "💰 TRADE KEVIN TOKEN",
      viewStamps: "VIEW 104 STAMPS",
      viewMoreArt: "VIEW MORE ART",
      viewMoreVideos: "VIEW MORE VIDEOS",
      tradeOnOpenstamp: "TRADE ON OPENSTAMP",
      tradeOnSuperex: "TRADE ON SUPEREX",
      playVideo: "PLAY VIDEO",
      viewGif: "VIEW GIF",
      viewImage: "VIEW IMAGE",
      submitRsvp: "🎯 SUBMIT RSVP REQUEST",
      submitting: "🔄 SUBMITTING...",
      lazyKevinsSoon: "🚀 LAZY KEVINS SOON",
      legendaryComplete: "Status: LEGENDARY COLLECTION COMPLETE"
    }
  },
  zh: {
    nav: {
      home: "首页",
      lore: "传说",
      stamps: "邮票",
      community: "社区",
      token: "代币"
    },
    home: {
      title: "凯文传奇",
      subtitle: "机器中的幽灵 • 比特币传说 • 首个 SRC-20 代币",
      heroDescription: "起源故事.LOG",
      originDescription: "当stampchain.io推出时，Arwyn创建了邮票#4258 - 一幅凯文的肖像作为纪念礼品。",
      machineEvolution: "但机器有了自己的想法...",
      storyDetails: "邮票机开始重复打印凯文，在邮票#4258到#18430之间创建了104个字节完美的副本。",
      mysteryQuote: "没有人知道它为什么开始。没有人知道它为什么停止。",
      ghostBorn: "机器中的幽灵诞生了",
      originsTitle: "起源",
      originsSub: "从比特币艺术先驱的秘密组织到不可变数据存储的诞生",
      mysteryTitle: "神秘",
      mysterySub: "104个自我复制的邮票，没有解释，只有传说",
      legendSub: "第一个SRC-20代币，全球模因，数字名人",
      featuresTitle: "传说",
      mysterySelfReplication: "神秘自我复制",
      firstSrc20Token: "首个 SRC-20 代币",
      legendaryStatus: "传奇地位",
      exclusiveInquiry: "独家凯文邮票咨询",
      exclusiveDescription: "拥有比特币历史的一部分。提交您的独家凯文邮票收购机会咨询。",
      contactForm: {
        name: "姓名",
        email: "邮箱",
        message: "留言",
        submit: "提交咨询",
        placeholder: {
          name: "您的姓名",
          email: "your.email@example.com",
          message: "告诉我们您对凯文邮票的兴趣..."
        }
      }
    },
    lore: {
      title: "凯文传奇",
      subtitle: "起源 • 神秘 • 传说",
      origins: {
        title: "🌟 起源：比特币艺术的诞生",
        description: "比特币邮票起源于Counterparty协议，许多原始比特币先驱从2016年开始聚集在这里，在比特币上创作艺术和代币。",
        secretCabal: "比特币艺术先驱的秘密组织"
      },
      ghostMachine: {
        title: "👻 机器中的幽灵",
        original: "邮票 #4258：原版",
        manifestation: "🔥 凯文显现 🔥",
        duplicates: "所有字节完美副本，但每一个都是独特且传奇的",
        description: "直到今天，没有人知道是什么导致这些邮票开始自我铸造，也没有人知道它们为什么停止。这是一个独特的时刻——机器中幽灵的诞生",
        quote: "凯文是一个功能，不是错误。凯文是机器中的幽灵。"
      },
      token: {
        title: "🪙 凯文：首个SRC-20代币",
        description: "当SRC-20协议开始开发时，创建代币最初并不是优先考虑的事项。团队只是在研究技术，实验发现什么是可能的。",
        intervention: "⚡ 区块链之神介入 ⚡",
        details: "代币详情",
        marketStats: "市场统计"
      },
      legend: {
        title: "🎬 传说延续",
        description: "凯文已经演变成一个全球表情包。一个数字名人被创造出来——他体现了我们所有人能成为的最好状态，那个在我们内心的中本聪。",
        television: "凯文上电视"
      }
    },
    stamps: {
      title: "104个凯文邮票",
      subtitle: "神秘自我复制邮票的完整收藏",
      description: "在邮票#4258和#18430之间，凯文在比特币区块链上显现了104次。",
      anomaly: "> 异常现象.DAT"
    },
    community: {
      title: "社区画廊",
      subtitle: "来自全世界凯文信徒的狂野创意",
      highlights: "> 精选亮点.LOG"
    },
    token: {
      title: "凯文代币",
      subtitle: "比特币上首个SRC-20代币",
      description: "诞生于神秘之中，凯文成为了部署在比特币区块链上的第一个SRC-20代币。",
      marketCap: "BTC市值",
      holders: "持有者",
      volume: "总交易量",
      queryProtocol: "查询协议中...",
      loadingData: "加载市场数据...",
      protocolStatus: "协议状态",
      deployStatus: "部署状态",
      marketStatus: "市场状态",
      loading: "加载中...",
      connecting: "连接比特币网络...",
      error: "错误",
      errorDesc: "无法加载代币数据",
      totalSupply: "总供应量",
      marketCapLabel: "市值",
      holdersLabel: "持有者",
      wallets: "钱包",
      totalVolumeLabel: "总交易量",
      deploymentStamp: "部署邮票",
      perMintLimit: "每次铸造限制",
      fairLaunchStatus: "公平启动状态",
      minted: "已铸造",
      protocol: "协议"
    },
    footer: {
      tagline: "机器中的幽灵\n功能，不是错误\n比特币上的活传说",
      links: "链接",
      disclaimer: "本网站仅用于娱乐和教育目的。"
    },
    buttons: {
      viewOriginal: "🎯 查看原始邮票 #4258",
      tradeToken: "💰 交易凯文代币",
      viewStamps: "查看104个邮票",
      viewMoreArt: "查看更多艺术作品",
      viewMoreVideos: "查看更多视频",
      tradeOnOpenstamp: "在OPENSTAMP交易",
      tradeOnSuperex: "在SUPEREX交易",
      playVideo: "播放视频",
      viewGif: "查看GIF",
      viewImage: "查看图片",
      submitRsvp: "🎯 提交预约请求",
      submitting: "🔄 提交中...",
      lazyKevinsSoon: "🚀 懒惰凯文即将到来",
      legendaryComplete: "状态：传奇收藏已完成"
    }
  }
};

// Default to English
export const defaultLanguage: Language = 'en';