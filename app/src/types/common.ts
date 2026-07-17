export type NodeStatus = 'Draft' | 'Internal Review' | 'Verified' | 'Published' | 'Needs Revision' | 'Archived';
export type EvidenceLevel = 'Mutawatir' | 'Sahih' | 'Hasan' | 'Consensus' | 'Majority';

export interface Reference {
  id: string;
  title: string;
  authorId?: string;
  type: string;
  volume?: string;
  page?: string;
  url?: string;
}

export interface Source {
  id: string;
  name: string;
  type: 'Primary' | 'Classical' | 'Modern';
}

export interface Media {
  id: string;
  type: 'Image' | 'Audio' | 'Video' | 'Interactive';
  url: string;
  altText: string;
  license: string;
}

export interface Translation {
  languageCode: string;
  text: string;
  translatorId?: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  parentId?: string;
}

export interface Location {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
}

export interface TimelineEvent {
  id: string;
  name: string;
  date: string;
}
