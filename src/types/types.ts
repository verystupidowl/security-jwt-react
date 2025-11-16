export interface EventRq {
  title: string;
  description: string;
  eventDate: string; // можно string в формате ISO, например "2025-12-12T15:00"
  location: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  participantsCount: number;
}
