export interface Event {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  time: string;
  location: string;
  category: string;
  description: string;
  tags: string[];
  spotsLeft: number;
  maxParticipants: number;
  expired: boolean;
  countdown: number;
  organizer: {
    name: string;
    avatar: string;
    id: string;
  };
  creator?: {
    id: string;
    username: string;
  };
  participants: {
    user: {
      id: string;
      username: string;
    };
    status:
      | "pending"
      | "approved"
      | "denied"
      | "checkedIn"
      | "noShow"
      | "cancelled"
      | "requestingCancellation";
  }[];
  userStatus?: string | null;
  userCancelCount?: number;
  isOrganizer: boolean;
}