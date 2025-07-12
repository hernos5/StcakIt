import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/questions/QuestionCard';
import { Button } from '../components/ui/Button';
import { PlusIcon, SparklesIcon, FilterIcon } from 'lucide-react';
import { useQuestionStore } from '../store/questionStore';
import { useTagStore } from '../store/tagStore';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const {
    questions,
    fetchQuestions,
    isLoading
  } = useQuestionStore();
  const {
    popularTags,
    fetchPopularTags
  } = useTagStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const sort = searchParams.get('sort') || 'latest';
  const filter = searchParams.get('filter') || '';
  useEffect(() => {
    fetchQuestions(filter);
    fetchPopularTags();
  }, [fetchQuestions, fetchPopularTags, filter, sort]);
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const filteredQuestions = questions.filter(question => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => question.tags.includes(tag));
  });
  // Sort questions based on URL parameter
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sort === 'trending') {
      return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    } else if (sort === 'top') {
      return b.views - a.views;
    } else {
      // Default: latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  return <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore Questions</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)} icon={<FilterIcon className="h-4 w-4" />}>
            Filter
          </Button>
          <Link to="/?sort=latest">
            <Button variant={sort === 'latest' || !sort ? 'primary' : 'outline'} size="sm">
              Latest
            </Button>
          </Link>
          <Link to="/?sort=trending">
            <Button variant={sort === 'trending' ? 'primary' : 'outline'} size="sm">
              Trending
            </Button>
          </Link>
          <Link to="/?filter=unanswered">
            <Button variant={filter === 'unanswered' ? 'primary' : 'outline'} size="sm">
              Unanswered
            </Button>
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {filterOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="glass-card p-4 mb-6 overflow-hidden">
            <h3 className="text-sm font-semibold mb-3">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => <Badge key={tag.id} variant={selectedTags.includes(tag.name) ? 'primary' : 'default'} onClick={() => toggleTag(tag.name)} className="cursor-pointer">
                  {tag.name}
                </Badge>)}
            </div>
          </motion.div>}
      </AnimatePresence>
      {isLoading ? <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="glass-card p-5">
              <div className="h-7 bg-background-medium bg-opacity-70 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-background-medium bg-opacity-70 rounded w-full mb-2"></div>
              <div className="h-4 bg-background-medium bg-opacity-70 rounded w-full mb-2"></div>
              <div className="h-4 bg-background-medium bg-opacity-70 rounded w-3/4 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-background-medium bg-opacity-70 rounded-full w-16"></div>
                <div className="h-6 bg-background-medium bg-opacity-70 rounded-full w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-background-medium bg-opacity-70 rounded-full mr-2"></div>
                  <div>
                    <div className="h-3 bg-background-medium bg-opacity-70 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-background-medium bg-opacity-70 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-background-medium bg-opacity-70 rounded w-10"></div>
                  <div className="h-4 bg-background-medium bg-opacity-70 rounded w-10"></div>
                  <div className="h-4 bg-background-medium bg-opacity-70 rounded w-10"></div>
                </div>
              </div>
            </div>)}
        </div> : <div className="space-y-4">
          {sortedQuestions.length === 0 ? <div className="glass-card p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-text-muted mb-4">
                {selectedTags.length > 0 ? 'Try removing some filters or ask a question yourself!' : 'Be the first to ask a question!'}
              </p>
              <Button variant="primary" onClick={() => navigate('/ask')} icon={<PlusIcon className="h-4 w-4" />}>
                Ask a Question
              </Button>
            </div> : sortedQuestions.map(question => <motion.div key={question.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
                <Link to={`/question/${question.id}`}>
                  <QuestionCard title={question.title} excerpt={question.excerpt} upvotes={question.upvotes} downvotes={question.downvotes} answers={question.answers} views={question.views} author={question.author} tags={question.tags} />
                </Link>
              </motion.div>)}
        </div>}
      {/* Floating Ask Question Button */}
      <motion.div className="fixed bottom-6 right-6" whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} animate={{
      y: [0, -10, 0],
      boxShadow: ['0 0 15px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.7)', '0 0 15px rgba(168, 85, 247, 0.5)']
    }} transition={{
      y: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      },
      boxShadow: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    }}>
        <Button variant="primary" size="lg" className="shadow-glow" onClick={() => navigate('/ask')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          <span>Ask Question</span>
          <SparklesIcon className="h-4 w-4 ml-2 animate-pulse" />
        </Button>
      </motion.div>
    </div>;
};