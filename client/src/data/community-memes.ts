// Community memes from Kevin Depot
export interface CommunityMeme {
  id: string;
  title: string;
  type: 'image' | 'video' | 'gif';
  imageUrl: string;
  videoUrl?: string; // For MP4 videos
  description: string;
  category: string;
}

export const communityMemes: CommunityMeme[] = [
  {
    id: 'kevin-president',
    title: 'KEVIN 4 PRESIDENT',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/0914e9a8-d29b-423b-a633-38b5c1bc3700/width=400',
    description: 'Political Campaign',
    category: 'Politics'
  },
  {
    id: 'kevsurf',
    title: 'KEVSURF',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f07d3377-921a-49ea-9a99-6f50e2505200/width=400',
    description: 'Radical Surfing',
    category: 'Sports'
  },
  {
    id: 'james-bond-kevin',
    title: 'AGENT 007 KEVIN',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/56c35540-04c1-4cbf-8e20-34297ca43b00/width=400',
    description: 'Secret Agent',
    category: 'Movies'
  },
  {
    id: 'kevin-jumping',
    title: 'KEVIN JUMPS',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/7208efb8d4e98aab066f26800c1e01a8/thumbnails/thumbnail.jpg',
    videoUrl: '7208efb8d4e98aab066f26800c1e01a8',
    description: 'Animated Kevin',
    category: 'Animation'
  },
  {
    id: 'kaleidoscope',
    title: 'KALEIDOSCOPE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/6040ad1a8cb0059d318c1d339e738528/thumbnails/thumbnail.jpg',
    videoUrl: '6040ad1a8cb0059d318c1d339e738528',
    description: 'Trippy Effects',
    category: 'Art'
  },
  {
    id: 'glitch-kevin',
    title: 'GLITCH KEVIN',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/71ec197f-88a5-4706-4cab-f976f4fcf500/width=400',
    description: 'Digital Corruption',
    category: 'Glitch Art'
  },
  {
    id: 'kevin-sailing',
    title: 'KEVIN SAILING',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/c79866af-ece2-4999-054b-d757dc0f4200/width=400',
    description: 'Ocean Adventure',
    category: 'Adventure'
  },
  {
    id: 'shep1',
    title: 'SHEP1',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/87d41a64-7af4-421d-fd62-7e6bc4a10500/width=400',
    description: 'Kevin Shepherd',
    category: 'Animals'
  },
  {
    id: 's2cash',
    title: 'S2CASH',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/30c796dc-57c4-4152-9772-ab7556303e00/width=400',
    description: 'Cash Money Kevin',
    category: 'Finance'
  },
  {
    id: 'prisoner-kevin',
    title: 'KEVIN PRISONER',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/37c1ab01-87ca-4dc9-bdf4-10681ab62100/width=400',
    description: 'Orange Jumpsuit',
    category: 'Drama'
  },
  {
    id: 'kevin-pixel-gif',
    title: 'PIXEL KEVIN ANIMATION',
    type: 'gif',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/kevin-pixel-animation/width=400',
    description: 'Animated Pixel Art',
    category: 'Animation'
  },
  {
    id: 'kevin-spinning',
    title: 'SPINNING KEVIN',
    type: 'gif',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/kevin-spinning/width=400',
    description: 'Kevin Spins Forever',
    category: 'Animation'
  },
  {
    id: 'kevin-glitch-gif',
    title: 'GLITCH KEVIN GIF',
    type: 'gif',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/kevin-glitch-animation/width=400',
    description: 'Digital Glitch Effects',
    category: 'Glitch Art'
  },
  {
    id: 'kevin-typing',
    title: 'KEVIN CODING',
    type: 'gif',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/kevin-typing/width=400',
    description: 'Kevin Programming',
    category: 'Tech'
  }
];

export const getRandomMemes = (count: number) => {
  const shuffled = [...communityMemes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const filterMemesByType = (type: string) => {
  if (type === 'all') return communityMemes;
  return communityMemes.filter(meme => meme.type === type);
};
