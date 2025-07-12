import { create } from 'zustand';
import { api } from '../services/api';
export type Question = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  tags: string[];
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
  updatedAt: string;
};
export type Answer = {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
  updatedAt: string;
};
type QuestionState = {
  questions: Question[];
  currentQuestion: Question | null;
  answers: Answer[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (filter?: string) => Promise<void>;
  fetchQuestionById: (id: string) => Promise<void>;
  fetchAnswers: (questionId: string) => Promise<void>;
  createQuestion: (title: string, content: string, tags: string[]) => Promise<void>;
  createAnswer: (questionId: string, content: string) => Promise<void>;
  voteQuestion: (questionId: string, voteType: 'up' | 'down') => Promise<void>;
  voteAnswer: (answerId: string, voteType: 'up' | 'down') => Promise<void>;
  acceptAnswer: (answerId: string) => Promise<void>;
};
export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  currentQuestion: null,
  answers: [],
  isLoading: false,
  error: null,
  fetchQuestions: async filter => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const questions = await api.questions.getAll(filter);
      set({
        questions,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch questions',
        isLoading: false
      });
    }
  },
  fetchQuestionById: async id => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const question = await api.questions.getById(id);
      set({
        currentQuestion: question,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch question',
        isLoading: false
      });
    }
  },
  fetchAnswers: async questionId => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const answers = await api.answers.getByQuestionId(questionId);
      set({
        answers,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch answers',
        isLoading: false
      });
    }
  },
  createQuestion: async (title, content, tags) => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const question = await api.questions.create(title, content, tags);
      set(state => ({
        questions: [question, ...state.questions],
        isLoading: false
      }));
      return question;
    } catch (error) {
      set({
        error: 'Failed to create question',
        isLoading: false
      });
      throw error;
    }
  },
  createAnswer: async (questionId, content) => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const answer = await api.answers.create(questionId, content);
      set(state => ({
        answers: [...state.answers, answer],
        isLoading: false
      }));
      // Update answer count in question
      if (get().currentQuestion && get().currentQuestion.id === questionId) {
        set(state => ({
          currentQuestion: state.currentQuestion ? {
            ...state.currentQuestion,
            answers: state.currentQuestion.answers + 1
          } : null
        }));
      }
      return answer;
    } catch (error) {
      set({
        error: 'Failed to create answer',
        isLoading: false
      });
      throw error;
    }
  },
  voteQuestion: async (questionId, voteType) => {
    try {
      // Optimistic update
      set(state => {
        const updatedQuestions = state.questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              upvotes: voteType === 'up' ? q.upvotes + 1 : q.upvotes,
              downvotes: voteType === 'down' ? q.downvotes + 1 : q.downvotes
            };
          }
          return q;
        });
        const updatedCurrentQuestion = state.currentQuestion && state.currentQuestion.id === questionId ? {
          ...state.currentQuestion,
          upvotes: voteType === 'up' ? state.currentQuestion.upvotes + 1 : state.currentQuestion.upvotes,
          downvotes: voteType === 'down' ? state.currentQuestion.downvotes + 1 : state.currentQuestion.downvotes
        } : state.currentQuestion;
        return {
          questions: updatedQuestions,
          currentQuestion: updatedCurrentQuestion
        };
      });
      // Actual API call
      await api.questions.vote(questionId, voteType);
    } catch (error) {
      // Revert optimistic update on error
      set({
        error: 'Failed to vote on question'
      });
      throw error;
    }
  },
  voteAnswer: async (answerId, voteType) => {
    try {
      // Optimistic update
      set(state => {
        const updatedAnswers = state.answers.map(a => {
          if (a.id === answerId) {
            return {
              ...a,
              upvotes: voteType === 'up' ? a.upvotes + 1 : a.upvotes,
              downvotes: voteType === 'down' ? a.downvotes + 1 : a.downvotes
            };
          }
          return a;
        });
        return {
          answers: updatedAnswers
        };
      });
      // Actual API call
      await api.answers.vote(answerId, voteType);
    } catch (error) {
      // Revert optimistic update on error
      set({
        error: 'Failed to vote on answer'
      });
      throw error;
    }
  },
  acceptAnswer: async answerId => {
    try {
      // Optimistic update
      set(state => {
        const updatedAnswers = state.answers.map(a => ({
          ...a,
          isAccepted: a.id === answerId
        }));
        return {
          answers: updatedAnswers
        };
      });
      // Actual API call
      await api.answers.accept(answerId);
    } catch (error) {
      // Revert optimistic update on error
      set({
        error: 'Failed to accept answer'
      });
      throw error;
    }
  }
}));