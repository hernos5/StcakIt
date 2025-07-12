import React from 'react';
import { MessageSquareIcon, EyeIcon } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import { VoteButtons } from './VoteButtons';
interface QuestionCardProps {
  title: string;
  excerpt: string;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  tags: string[];
}
export const QuestionCard = ({
  title,
  excerpt,
  upvotes,
  downvotes,
  answers,
  views,
  author,
  tags
}: QuestionCardProps) => {
  return <motion.div className="glass-card p-5 mb-4 cursor-pointer hover:shadow-glow transition-all duration-300" whileHover={{
    scale: 1.01
  }}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-text-muted text-sm line-clamp-3 mb-4">{excerpt}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => <Badge key={tag} variant="primary">
            {tag}
          </Badge>)}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full mr-2 border border-white/10" />
          <div>
            <p className="text-xs font-medium">{author.name}</p>
            <p className="text-xs text-text-muted">{author.reputation} rep</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-text-muted">
          <VoteButtons type="question" id="preview" // This is just a preview, so we use a dummy ID
        upvotes={upvotes} downvotes={downvotes} vertical={false} size="sm" />
          <div className="flex items-center">
            <MessageSquareIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{answers}</span>
          </div>
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{views}</span>
          </div>
        </div>
      </div>
    </motion.div>;
};