import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useQuestionStore } from '../../store/questionStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
type VoteType = 'up' | 'down';
interface VoteButtonsProps {
  type: 'question' | 'answer';
  id: string;
  upvotes: number;
  downvotes: number;
  userVote?: VoteType | null;
  vertical?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export const VoteButtons: React.FC<VoteButtonsProps> = ({
  type,
  id,
  upvotes,
  downvotes,
  userVote = null,
  vertical = true,
  size = 'md'
}) => {
  const {
    isAuthenticated
  } = useAuthStore();
  const {
    voteQuestion,
    voteAnswer
  } = useQuestionStore();
  const voteCount = upvotes - downvotes;
  const handleVote = async (voteType: VoteType) => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      if (type === 'question') {
        await voteQuestion(id, voteType);
      } else {
        await voteAnswer(id, voteType);
      }
      toast.success(`Vote recorded`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };
  const sizeClasses = {
    sm: {
      button: 'p-1',
      icon: 'h-4 w-4',
      count: 'text-sm'
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
      count: 'text-base'
    },
    lg: {
      button: 'p-3',
      icon: 'h-6 w-6',
      count: 'text-lg'
    }
  };
  if (vertical) {
    return <div className="flex flex-col items-center">
        <motion.button whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.95
      }} onClick={() => handleVote('up')} disabled={!isAuthenticated} className={`${sizeClasses[size].button} rounded-full hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'up' ? 'text-primary' : ''}`}>
          <ArrowUpIcon className={sizeClasses[size].icon} />
        </motion.button>
        <span className={`${sizeClasses[size].count} font-semibold my-1 ${voteCount > 0 ? 'text-primary' : voteCount < 0 ? 'text-red-400' : ''}`}>
          {voteCount}
        </span>
        <motion.button whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.95
      }} onClick={() => handleVote('down')} disabled={!isAuthenticated} className={`${sizeClasses[size].button} rounded-full hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'down' ? 'text-red-400' : ''}`}>
          <ArrowDownIcon className={sizeClasses[size].icon} />
        </motion.button>
      </div>;
  }
  return <div className="flex items-center space-x-2">
      <motion.button whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.95
    }} onClick={() => handleVote('up')} disabled={!isAuthenticated} className={`${sizeClasses[size].button} rounded-full hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'up' ? 'text-primary' : ''}`}>
        <ArrowUpIcon className={sizeClasses[size].icon} />
      </motion.button>
      <span className={`${sizeClasses[size].count} font-semibold ${voteCount > 0 ? 'text-primary' : voteCount < 0 ? 'text-red-400' : ''}`}>
        {voteCount}
      </span>
      <motion.button whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.95
    }} onClick={() => handleVote('down')} disabled={!isAuthenticated} className={`${sizeClasses[size].button} rounded-full hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${userVote === 'down' ? 'text-red-400' : ''}`}>
        <ArrowDownIcon className={sizeClasses[size].icon} />
      </motion.button>
    </div>;
};