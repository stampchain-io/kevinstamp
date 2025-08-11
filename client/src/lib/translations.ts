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
  };
  
  // Footer
  footer: {
    tagline: string;
    links: string;
    disclaimer: string;
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
      heroDescription: "Kevin is not just a meme - he's a digital legend born from the Bitcoin blockchain itself. When a simple portrait stamp began self-replicating across 91 mysterious duplicates, it sparked the creation of the first SRC-20 token and became the stuff of crypto folklore.",
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
      title: "THE KEVIN SAGA",
      subtitle: "Origins • Mystery • Legend",
      origins: {
        title: "🌟 ORIGINS: THE BIRTH OF BITCOIN ART",
        description: "Bitcoin Stamps emerged from the Counterparty protocol, where many of the original Bitcoin pioneers gathered from 2016 onwards to create art and tokens on Bitcoin."
      },
      ghostMachine: {
        title: "👻 THE GHOST IN THE MACHINE",
        original: "Stamp #4258: The Original",
        manifestation: "🔥 THE KEVIN MANIFESTATION 🔥",
        duplicates: "All byte-perfect duplicates, yet each one unique and legendary",
        description: "To this day, nobody knows what caused these stamps to start minting themselves, and nobody knows why they stopped. This was a unique moment - the birth of a ghost in the machine.",
        quote: "Kevin is a feature, not a bug. Kevin is the ghost in the machine."
      },
      token: {
        title: "🪙 KEVIN: THE FIRST SRC-20 TOKEN",
        description: "When development began on the SRC-20 protocol, creating tokens wasn't initially a priority. The team was merely investigating the technology, experimenting to discover what was possible.",
        intervention: "⚡ THE BLOCKCHAIN GODS INTERVENE ⚡",
        details: "TOKEN DETAILS",
        marketStats: "MARKET STATS"
      },
      legend: {
        title: "🎬 THE LEGEND CONTINUES",
        description: "KEVIN has evolved into a global meme. A digital celebrity was created - one who embodies the best of what we can all be, that Satoshi within ourselves.",
        television: "KEVIN ON TELEVISION"
      }
    },
    stamps: {
      title: "91 KEVIN STAMPS",
      subtitle: "The complete collection of mysterious self-replicating stamps",
      description: "Between stamps #4258 and #18430, Kevin manifested himself 91 times on the Bitcoin blockchain.",
      anomaly: "> THE_ANOMALY.DAT"
    },
    community: {
      title: "COMMUNITY GALLERY", 
      subtitle: "Wild creativity from Kevin believers worldwide",
      highlights: "> FEATURED_HIGHLIGHTS.LOG"
    },
    token: {
      title: "KEVIN TOKEN",
      subtitle: "The First SRC-20 Token on Bitcoin",
      description: "Born from mystery, Kevin became the first SRC-20 token ever deployed on the Bitcoin blockchain."
    },
    footer: {
      tagline: "The Ghost in the Machine\nFeature, not a bug\nLiving legend on Bitcoin",
      links: "LINKS",
      disclaimer: "This website is for entertainment and educational purposes only."
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
      subtitle: "机器幽灵 • 比特币传说 • 首个SRC-20代币",
      heroDescription: "凯文不只是一个表情包——他是从比特币区块链本身诞生的数字传说。当一个简单的肖像邮票开始在91个神秘副本中自我复制时，它引发了第一个SRC-20代币的创造，并成为了加密货币民间传说的素材。",
      featuresTitle: "传说",
      mysterySelfReplication: "神秘自我复制",
      firstSrc20Token: "首个SRC-20代币",
      legendaryStatus: "传奇地位",
      exclusiveInquiry: "独家凯文邮票咨询",
      exclusiveDescription: "拥有比特币历史的一部分。提交您的咨询以获得独家凯文邮票收购机会。",
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
        description: "比特币邮票起源于Counterparty协议，许多原始比特币先驱从2016年开始聚集在这里，在比特币上创作艺术和代币。"
      },
      ghostMachine: {
        title: "👻 机器中的幽灵",
        original: "邮票 #4258：原版",
        manifestation: "🔥 凯文显现 🔥",
        duplicates: "所有字节完美副本，但每一个都是独特且传奇的",
        description: "直到今天，没有人知道是什么导致这些邮票开始自我铸造，也没有人知道它们为什么停止。这是一个独特的时刻——机器中幽灵的诞生。",
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
      title: "91个凯文邮票",
      subtitle: "神秘自我复制邮票的完整收藏",
      description: "在邮票#4258和#18430之间，凯文在比特币区块链上显现了91次。",
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
      description: "诞生于神秘，凯文成为了比特币区块链上第一个部署的SRC-20代币。"
    },
    footer: {
      tagline: "机器中的幽灵\n功能，不是错误\n比特币上的活传说",
      links: "链接",
      disclaimer: "本网站仅用于娱乐和教育目的。"
    }
  }
};

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations.en;
}