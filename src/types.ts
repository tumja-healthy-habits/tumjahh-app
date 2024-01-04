import { Record } from "pocketbase";

// Generated by https://quicktype.io
export interface UserRecord extends Record {
    avatar: string;
    emailVisibility: boolean;
    name: string;
    username: string;
    verified: boolean;
    email: string;
    lastSurvey: string;
    expand: {
        "friends_with(user1)": FriendsWithRecord[];
        "friends_with(user2)": FriendsWithRecord[];
        "friend_requests(from)": FriendRequestsRecord[];
        "friend_requests(to)": FriendRequestsRecord[];
    }
}

// Generated by https://quicktype.io
export interface FriendsWithRecord extends Record {
    user1: string;
    user2: string;
    expand: {
        user1: UserRecord;
        user2: UserRecord;
    }
}

export interface PhotosRecord extends Record {
    photo: string;
    user_id: string;
    height: number,
    width: number,
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

export interface MosaicRecord extends Record {
    name: string;
    thumbnail: string;
}

export interface MosaicMembersRecord extends Record {
    mosaic_id: string;
    user_id: string;
    expand: {
        user_id: UserRecord;
    }
}

export interface ContainsRecord extends Record {
    mosaic_id: string;
    photo_id: string;
    expand: {
        photo_id: PhotosRecord
    };
}

export interface FriendRequestsRecord extends Record {
    from: string;
    to: string;
    expand: {
        from: UserRecord;
        to: UserRecord;
    }
}

export interface SurveyAnswerRecord extends Record {
    user: UserRecord;
    challenge: ChallengesRecord;
    answer1: number;
    answer2: number;
    answer3: number;
    answer4: number;
}

export interface InitialSurveyRecord extends Record {
    user: UserRecord;

    transport_bike_public: string;
    transport_walk: boolean;
    transport_means: string;

    exercise_frequency: number;
    exercise_ambition: boolean;
    exercise_satisfaction: boolean;
    exercise_sports: string;

    diet_type: string;
    diet_reasons: string[];
    diet_criteria: string[];

    sleep_hours: number;
    sleep_variance: number;
    sleep_peace: boolean;

    mental_screentime: number;
    mental_thankfulness: boolean;
    mental_stress: boolean;
}

export interface LocalStorageChallengeEntry {
    record: ChallengesRecord;
    repetitionsGoal: number;
}

export type MosaicData = {
    [key: number]: {
        [key: number]: string
    }
}

export type ChallengeData = {
    [key: string]: LocalStorageChallengeEntry | null
}

export type FixedDimensionImage = {
    uri: string;
    width: number;
    height: number;
}