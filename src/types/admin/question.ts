export type Question = {
  id: number;
  question_name: string;
  question_link: string;
  topic_id: number;
  platform: 'LEETCODE' | 'GFG' | 'INTERVIEWBIT' | 'OTHER';
  level: 'EASY' | 'MEDIUM' | 'HARD';
  // type removed - now in QuestionVisibility
  topic?: {
    topic_name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type CreateQuestionData = {
  question_name: string;
  question_link: string;
  topic_id: number;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
  // type removed - set during assignment to class
};

export type UpdateQuestionData = Partial<CreateQuestionData>;

// New type for assigned questions with visibility info
export type AssignedQuestion = Question & {
  visibility_id: number;
  type: 'HOMEWORK' | 'CLASSWORK';
  assigned_at: string;
};

export type QuestionsResponse = {
  data: Question[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
