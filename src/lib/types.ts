import { Timestamp } from "firebase/firestore";

export type TransitStatus = 'On Time' | 'Delayed' | 'Crowded';

export interface TransitUpdate {
  id: string;
  line: string;
  status: TransitStatus;
  eta: string;
  currentStation: string;
}

export interface DirectoryListing {
  id: string;
  name: string;
  category: 'Plumbers' | 'Electricians' | 'Doctors' | 'Tiffin' | 'Repair Shops';
  rating: number;
  reviews: number;
  contact: string;
  description: string;
  image: string;
}

export interface ForumPost {
  id: string;
  originalId?: string; // To map replies during seeding
  userId: string;
  title: string;
  author: string;
  avatar: string;
  timestamp: Timestamp;
  replies: number;
  content: string;
  upvotes: number;
  downvotes: number;
}

export interface ForumReply {
  id: string;
  userId: string;
  author: string;
  avatar: string;
  timestamp: Timestamp;
  content: string;
  upvotes: number;
  downvotes: number;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: Date | Timestamp;
  location: string;
  category: 'Music' | 'Food' | 'Art' | 'Community';
  description: string;
  image: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  location: string;
  time: string;
  description: string;
}

export interface Amenity {
    id: number;
    name: string;
    type: 'Business' | 'Amenity' | 'Interest';
    position: { top: string; left: string };
}
