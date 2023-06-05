import { Record } from "pocketbase";

// Generated by https://quicktype.io
export interface UserRecord extends Record {
    avatar: string;
    emailVisibility: boolean;
    name: string;
    username: string;
    verified: boolean;
    email: string;
}

// Generated by https://quicktype.io
export interface FriendsWithRecord extends Record {
    user1: string;
    user2: string;
}

export interface PhotosRecord extends Record {
    photo: string;
    user_id: string;
}

export interface HabitsRecord extends Record {
    name: string;
}

export interface ChallengesRecord extends Record {
    name: string;
    description: string;
    explanation: string;
    habit_id: string;
}

export interface LocalStorageChallengeEntry {
    record: ChallengesRecord;
    repetitionsGoal: number;
}