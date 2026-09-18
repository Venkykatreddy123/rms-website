export interface Band {
  id: string;
  number: string;
  name: string;
  genre: string;
  origin: string;
  image: string;
  headline: string;
  quote: string;
  members: string[];
  trackTitle?: string;
  audioPreview?: string;
}

export interface CompetitionStage {
  number: string;
  title: string;
  subtitle: string;
  timeline: string;
  accent: 'offwhite' | 'subtle-red' | 'strong-red' | 'bold-red' | 'red-gold' | 'gold';
  description: string;
  criteria: string[];
  venue: string;
}

export interface VideoItem {
  id: string;
  title: string;
  artist: string;
  category: 'LIVE' | 'BAND STORIES' | 'BACKSTAGE' | 'MOMENTS';
  duration: string;
  thumbnail: string;
  location: string;
  year: string;
  videoUrl?: string;
}
