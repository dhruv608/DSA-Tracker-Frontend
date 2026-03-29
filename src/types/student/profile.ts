// types/student/profile.ts
export interface StudentProfile {
    id: number;
    username: string;
    name: string;
    photo_url?: string;
    profileImageUrl?: string;
    github?: string;
    linkedin?: string;
    leetcode_id?: string;
    leetcode?: string;
    gfg_id?: string;
    gfg?: string;
    enrollment_id?: string;
    enrollmentId?: string;
    batch?: string;
    year?: string;
    city?: string;
    stats?: StudentStats;
}
export interface StudentStats {
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    streak?: number;
    rank?: number;
}

export interface ProfileEditForm {
    name: string;
    github: string;
    linkedin: string;
    leetcode: string;
    gfg: string;
}

export interface UsernameForm {
    username: string;
}

// Add to types/student/profile.ts
export interface ProfileUpdateData {
    github?: string;
    linkedin?: string;
    name?: string;
    leetcode_id?: string;
    gfg_id?: string;
    username?: string;
}

export interface UsernameUpdateData {
    username: string;
}

export interface TopicProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId?: number;
    username?: string;
}



// Add to types/student/profile.ts
export interface ProfileUpdateResponse {
    message: string;
    student: StudentProfile;
}

export interface UsernameUpdateResponse {
    message: string;
    username: string;
}


// Heatmap data structure
export interface HeatmapData {
    date: string;
    count: number;
    day: number;
    month: number;
    year: number;
}

// Activity data structure  
export interface RecentActivity {
    id: number;
    question_name: string;
    question_link?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    platform: string;
    solvedAt: string;
}

// Error response structure
export interface ApiError {
    response?: {
        status?: number;
        data?: {
            error?: string;
            message?: string;
        };
    };
    message?: string;
}

// Coding statistics structure
export interface CodingStats {
    totalSolved?: number;
    easy: {
        solved: number;
        assigned: number;
    };
    medium: {
        solved: number;
        assigned: number;
    };
    hard: {
        solved: number;
        assigned: number;
    };
}

// Leaderboard data structure
export interface LeaderboardData {
    globalRank?: number;
    cityRank?: number;
    batchRank?: number;
}
export interface StreakData {
    maxStreak?: number;
    currentStreak?: number;
    lastSolvedDate?: string;
    count?: number;
    hasQuestion?: boolean;
}

// API Response wrapper types
export interface ProfileResponse {
    student: StudentProfile;
    stats?: StudentStats;
    codingStats?: CodingStats;
    heatmap?: HeatmapData[];
    recentActivity?: RecentActivity[];
    leaderboard?: LeaderboardData;
    streak?: StreakData;
}

export interface CurrentUserResponse {
    data: StudentProfile;
    // May also have error property for auth failures
    error?: string;
}

// Update the main profile page state types
export type ProfileDataState = ProfileResponse | null;
export type CurrentUserState = CurrentUserResponse | null;
