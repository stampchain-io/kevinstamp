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
    id: 'kevsurf-original',
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
    id: 'walking-corridor',
    title: 'WALKING DOWN CORRIDOR',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/76088736b758ae1ff2a0491606bfb751/thumbnails/thumbnail.jpg',
    videoUrl: '76088736b758ae1ff2a0491606bfb751',
    description: 'Kevin walking down corridor',
    category: 'Animation'
  },
  {
    id: 'tv-interference',
    title: 'TV INTERFERENCE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/6c0d7bf82b62c624bd5394007c1fe446/thumbnails/thumbnail.jpg',
    videoUrl: '6c0d7bf82b62c624bd5394007c1fe446',
    description: 'TV interference glitch',
    category: 'Glitch Art'
  },
  {
    id: 'glitch-animation',
    title: 'GLITCH ANIMATION',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/21f715769ff485c16e4472bcac52e917/thumbnails/thumbnail.jpg',
    videoUrl: '21f715769ff485c16e4472bcac52e917',
    description: 'Image glitch animation',
    category: 'Glitch Art'
  },
  {
    id: 'animated-kevin',
    title: 'ANIMATED KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/711ed784622153f0bba353c3c6f6fb34/thumbnails/thumbnail.jpg',
    videoUrl: '711ed784622153f0bba353c3c6f6fb34',
    description: 'Kevin animation',
    category: 'Animation'
  },
  {
    id: 'kevin-video-1',
    title: 'KEVIN MOMENT',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/1ad15edb6d2dd5fbf1a38ba052d3686f/thumbnails/thumbnail.jpg',
    videoUrl: '1ad15edb6d2dd5fbf1a38ba052d3686f',
    description: 'Kevin video moment',
    category: 'Entertainment'
  },
  {
    id: 'laughing-kevin',
    title: 'LAUGHING KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/e84162f743e8d66a8d48e0390791d36e/thumbnails/thumbnail.jpg',
    videoUrl: 'e84162f743e8d66a8d48e0390791d36e',
    description: 'They are laughing',
    category: 'Comedy'
  },
  {
    id: 'confident-kevin',
    title: 'CONFIDENT KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/e699c2ab362b7f6028c4852c110124fe/thumbnails/thumbnail.jpg',
    videoUrl: 'e699c2ab362b7f6028c4852c110124fe',
    description: 'Feeling very confident',
    category: 'Attitude'
  },
  {
    id: 'smug-kevin',
    title: 'SMUG KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/9dcffd9a177e1b4f8d4fc0dab08f7a97/thumbnails/thumbnail.jpg',
    videoUrl: '9dcffd9a177e1b4f8d4fc0dab08f7a97',
    description: 'Looking smug',
    category: 'Attitude'
  },
  {
    id: 'magic-spell',
    title: 'MAGIC SPELL',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/33534063b48b3d20164d7decbd864d15/thumbnails/thumbnail.jpg',
    videoUrl: '33534063b48b3d20164d7decbd864d15',
    description: 'Working magic spell while portal opens',
    category: 'Magic'
  },
  {
    id: 'running-kevin',
    title: 'RUNNING KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/ac402aaf365d76b78a392ecbe1553f7d/thumbnails/thumbnail.jpg',
    videoUrl: 'ac402aaf365d76b78a392ecbe1553f7d',
    description: 'Kevin running',
    category: 'Action'
  },
  {
    id: 'alien-abduction',
    title: 'ALIEN ABDUCTION',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/4db2359b0246ceda88ba4057e967fb9b/thumbnails/thumbnail.jpg',
    videoUrl: '4db2359b0246ceda88ba4057e967fb9b',
    description: 'Abducted by aliens',
    category: 'Sci-Fi'
  },
  {
    id: 'kevin-video-2',
    title: 'KEVIN ACTION',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/361f2b0ad3acd320d765c73266de781f/thumbnails/thumbnail.jpg',
    videoUrl: '361f2b0ad3acd320d765c73266de781f',
    description: 'Kevin in action',
    category: 'Action'
  },
  {
    id: 'glitch-kevin-2',
    title: 'GLITCH KEVIN 2',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/5f3c1f6aed0630286ee76f64b8572ee8/thumbnails/thumbnail.jpg',
    videoUrl: '5f3c1f6aed0630286ee76f64b8572ee8',
    description: 'Glitch animation',
    category: 'Glitch Art'
  },
  {
    id: 'eating-popcorn',
    title: 'EATING POPCORN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/8893e491e93bdc9d3cf027746ec57519/thumbnails/thumbnail.jpg',
    videoUrl: '8893e491e93bdc9d3cf027746ec57519',
    description: 'Eating popcorn and enjoying',
    category: 'Entertainment'
  },
  {
    id: 'feeling-cold',
    title: 'FEELING COLD',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/398acea0a6b4475b8bd97062cad9ac84/thumbnails/thumbnail.jpg',
    videoUrl: '398acea0a6b4475b8bd97062cad9ac84',
    description: 'Feeling cold',
    category: 'Emotion'
  },
  {
    id: 'feeling-unbeatable',
    title: 'FEELING UNBEATABLE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/7fae7aaea0729ab940ce63fe7a803a31/thumbnails/thumbnail.jpg',
    videoUrl: '7fae7aaea0729ab940ce63fe7a803a31',
    description: 'Feeling unbeatable with swagger',
    category: 'Attitude'
  },
  {
    id: 'typing-keyboard',
    title: 'TYPING ON KEYBOARD',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/9f450d62cc607ad71ff6460088b76c6e/thumbnails/thumbnail.jpg',
    videoUrl: '9f450d62cc607ad71ff6460088b76c6e',
    description: 'Typing on the keyboard',
    category: 'Tech'
  },
  {
    id: 'levitating-kevin',
    title: 'LEVITATING KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/60e9fd7f1ec2b6fc5541f615e7ea3072/thumbnails/thumbnail.jpg',
    videoUrl: '60e9fd7f1ec2b6fc5541f615e7ea3072',
    description: 'Levitating and giving off energy',
    category: 'Magic'
  },
  {
    id: 'alien-abduction-2',
    title: 'ALIEN ABDUCTION 2',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/19a46048b00ac15cbfed2926c722b937/thumbnails/thumbnail.jpg',
    videoUrl: '19a46048b00ac15cbfed2926c722b937',
    description: 'Abducted by aliens',
    category: 'Sci-Fi'
  },
  {
    id: 'money-rain',
    title: 'MONEY RAIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/a1c8b11771d4bc008cfaf5491a1df0e7/thumbnails/thumbnail.jpg',
    videoUrl: 'a1c8b11771d4bc008cfaf5491a1df0e7',
    description: 'Money raining down',
    category: 'Finance'
  },
  {
    id: 'kevin-video-3',
    title: 'KEVIN SEQUENCE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/2878a16fb325ffc4f8a8cecd050bfc13/thumbnails/thumbnail.jpg',
    videoUrl: '2878a16fb325ffc4f8a8cecd050bfc13',
    description: 'Kevin video sequence',
    category: 'Entertainment'
  },
  {
    id: 'incredible-magic',
    title: 'INCREDIBLE MAGIC',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/d47e6e85526ab8187930fef4a09b7967/thumbnails/thumbnail.jpg',
    videoUrl: 'd47e6e85526ab8187930fef4a09b7967',
    description: 'Incredible magic is happening',
    category: 'Magic'
  },
  {
    id: 'nightmare-kevin',
    title: 'NIGHTMARE KEVIN',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/75b8d65cf6b2fa0a22fbf6b5c9b78fad/thumbnails/thumbnail.jpg',
    videoUrl: '75b8d65cf6b2fa0a22fbf6b5c9b78fad',
    description: 'Living in a nightmare',
    category: 'Drama'
  },
  {
    id: 'boss-attitude',
    title: 'BOSS ATTITUDE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/ea1ac8dd2e9c705ad6628a9a7f261a4e/thumbnails/thumbnail.jpg',
    videoUrl: 'ea1ac8dd2e9c705ad6628a9a7f261a4e',
    description: 'The boss attitude',
    category: 'Attitude'
  },
  {
    id: 'james-bond-credits',
    title: 'JAMES BOND CREDITS',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/a6f64bab755c465ca1d0ebe6753a49bf/thumbnails/thumbnail.jpg',
    videoUrl: 'a6f64bab755c465ca1d0ebe6753a49bf',
    description: 'James Bond opening credits',
    category: 'Movies'
  },
  {
    id: 'offering-business',
    title: 'OFFERING BUSINESS',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/442e0d542d4664c51e36eecd05da0c2a/thumbnails/thumbnail.jpg',
    videoUrl: '442e0d542d4664c51e36eecd05da0c2a',
    description: 'Walking around offering business',
    category: 'Business'
  },
  {
    id: 'running-from-dino',
    title: 'RUNNING FROM DINO',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/02ef13744bd564ef7ac107c3eda8548b/thumbnails/thumbnail.jpg',
    videoUrl: '02ef13744bd564ef7ac107c3eda8548b',
    description: 'Running away from the dinosaur',
    category: 'Action'
  },
  {
    id: 'action-movie',
    title: 'ACTION MOVIE STYLE',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/180fcef43b97093ff2d332111465e105/thumbnails/thumbnail.jpg',
    videoUrl: '180fcef43b97093ff2d332111465e105',
    description: 'Action movie style',
    category: 'Action'
  },
  {
    id: 'walking-sheep',
    title: 'WALKING THE SHEEP',
    type: 'video',
    imageUrl: 'https://customer-hls7a0n7rbjgz9uk.cloudflarestream.com/6d49e973e05cf3df2ac9bac64a018414/thumbnails/thumbnail.jpg',
    videoUrl: '6d49e973e05cf3df2ac9bac64a018414',
    description: 'Walking the sheep',
    category: 'Animals'
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
    id: 'kevin-4-president',
    title: 'KEVIN 4 PRESIDENT',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/0914e9a8-d29b-423b-a633-38b5c1bc3700/width=400',
    description: 'Presidential Campaign',
    category: 'Politics'
  },
  {
    id: 'kevsurf',
    title: 'KEVSURF',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f07d3377-921a-49ea-9a99-6f50e2505200/width=400',
    description: 'Kevin Surfing',
    category: 'Sports'
  },
  {
    id: 'jaguar-bond',
    title: 'JAGUAR BOND',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/56c35540-04c1-4cbf-8e20-34297ca43b00/width=400',
    description: 'Secret Agent Kevin',
    category: 'Action'
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
    id: 'img-0881',
    title: 'KEVIN PORTRAIT',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f6a33821-c039-4164-bc58-9af890e24f00/width=400',
    description: 'Portrait Style',
    category: 'Art'
  },
  {
    id: 'kevin-4-president-2',
    title: 'KEVIN 4 PRESIDENT 2',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/2e072512-45cc-4bab-1211-5b302731b700/width=400',
    description: 'Campaign Design 2',
    category: 'Politics'
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
    id: 'francis-chester',
    title: 'FRANCIS CHESTER',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a33ce6b3-2fca-4db4-cb51-5979e83a4500/width=400',
    description: 'Black Sheep Character',
    category: 'Characters'
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
    id: 'screenshot-kevin',
    title: 'KEVIN SCREENSHOT',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/32661ae9-451f-462f-96b0-7d9ac1278f00/width=400',
    description: 'Screen Capture',
    category: 'Tech'
  },
  {
    id: 'devin-pie',
    title: 'DEVIN PIE',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/2cb142cc-80a2-49c6-61d5-0a6717edc100/width=400',
    description: 'Pie Chart Kevin',
    category: 'Food'
  },
  {
    id: 'mandy',
    title: 'MANDY',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/d11f393e-1c3b-4020-ead0-6556eef59600/width=400',
    description: 'Mandy Character',
    category: 'Characters'
  },
  {
    id: 'amandao',
    title: 'AMANDAO',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/0388c6e6-0ac5-4eef-86ca-39ed0cdbf700/width=400',
    description: 'Amanda Character',
    category: 'Characters'
  },
  {
    id: 'img-4621',
    title: 'KEVIN IMAGE',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/165b79b1-287d-4345-80a0-70059851a200/width=400',
    description: 'Kevin Portrait',
    category: 'Art'
  },
  {
    id: 'kevin-campbell',
    title: 'KEVIN CAMPBELL',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/bf44c12f-05dd-4c04-c41a-4fc37f269800/width=400',
    description: 'Campbell Kevin',
    category: 'Art'
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
    id: 'giant-book',
    title: 'GIANT BOOK',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/3d57717e-06e8-4d0b-e8c8-5bc41ad6fb00/width=400',
    description: 'Kevin with Giant Book',
    category: 'Education'
  },
  {
    id: 'sammy-woods',
    title: 'SAMMY WOODS',
    type: 'image',
    imageUrl: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/022a90dc-f3f0-4341-a982-9bc27882bd00/width=400',
    description: 'Historical Character',
    category: 'Historical'
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
