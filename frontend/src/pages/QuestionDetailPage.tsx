import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionStore } from '../store/questionStore';
import { useAuthStore } from '../store/authStore';
import { MessageSquareIcon, EyeIcon, CheckCircleIcon, SparklesIcon, LinkIcon, BookmarkIcon, ShareIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { VoteButtons } from '../components/questions/VoteButtons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export const QuestionDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentQuestion,
    answers,
    fetchQuestionById,
    fetchAnswers,
    createAnswer,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    isLoading
  } = useQuestionStore();
  const {
    user,
    isAuthenticated
  } = useAuthStore();
  useEffect(() => {
    if (id) {
      fetchQuestionById(id);
      fetchAnswers(id);
    }
  }, [id, fetchQuestionById, fetchAnswers]);
  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await acceptAnswer(answerId);
      toast.success('Answer accepted');
    } catch (error) {
      toast.error('Failed to accept answer');
    }
  };
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      toast.error('Answer cannot be empty');
      return;
    }
    setIsSubmitting(true);
    try {
      await createAnswer(id!, answerContent);
      setAnswerContent('');
      toast.success('Answer posted successfully');
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };
  if (isLoading || !currentQuestion) {
    return <div className="py-6">
        <div className="glass-card p-6">
          <div className="h-10 bg-background-medium bg-opacity-70 rounded w-4/5 mb-4"></div>
          <div className="flex items-center text-sm text-text-muted mb-4 space-x-4">
            <div className="h-5 bg-background-medium bg-opacity-70 rounded w-20"></div>
            <div className="h-5 bg-background-medium bg-opacity-70 rounded w-24"></div>
            <div className="h-5 bg-background-medium bg-opacity-70 rounded w-32"></div>
          </div>
          <div className="h-4 bg-background-medium bg-opacity-70 rounded w-full mb-2"></div>
          <div className="h-4 bg-background-medium bg-opacity-70 rounded w-full mb-2"></div>
          <div className="h-4 bg-background-medium bg-opacity-70 rounded w-full mb-2"></div>
          <div className="h-4 bg-background-medium bg-opacity-70 rounded w-4/5 mb-2"></div>
          <div className="h-4 bg-background-medium bg-opacity-70 rounded w-3/4 mb-6"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 bg-background-medium bg-opacity-70 rounded-full w-16"></div>
            <div className="h-6 bg-background-medium bg-opacity-70 rounded-full w-20"></div>
            <div className="h-6 bg-background-medium bg-opacity-70 rounded-full w-18"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="py-6">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="glass-card p-6 mb-8">
        <div className="flex gap-4">
          {/* Voting */}
          <div className="flex flex-col items-center">
            <VoteButtons type="question" id={currentQuestion.id} upvotes={currentQuestion.upvotes} downvotes={currentQuestion.downvotes} size="lg" />
          </div>
          {/* Question content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">{currentQuestion.title}</h1>
            <div className="flex items-center text-sm text-text-muted mb-4 space-x-4">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{currentQuestion.views} views</span>
              </div>
              <div className="flex items-center">
                <MessageSquareIcon className="h-4 w-4 mr-1" />
                <span>{currentQuestion.answers} answers</span>
              </div>
              <div>
                Asked {new Date(currentQuestion.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="prose prose-invert max-w-none mb-6 bg-background-dark bg-opacity-30 p-4 rounded-lg" dangerouslySetInnerHTML={{
            __html: currentQuestion.content
          }} />
            <div className="flex flex-wrap gap-2 mb-6">
              {currentQuestion.tags.map(tag => <Badge key={tag} variant="primary">
                  {tag}
                </Badge>)}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center bg-background-dark p-2 rounded-lg">
                <img src={currentQuestion.author.avatar} alt={currentQuestion.author.name} className="h-10 w-10 rounded-full mr-3 border-2 border-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {currentQuestion.author.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {currentQuestion.author.reputation} reputation
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink} icon={<LinkIcon className="h-4 w-4" />}>
                  Share
                </Button>
                <Button variant="outline" size="sm" icon={<BookmarkIcon className="h-4 w-4" />}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        <AnimatePresence>
          {answers.map((answer, index) => <motion.div key={answer.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }} className={`glass-card p-6 mb-4 ${answer.isAccepted ? 'border-2 border-secondary' : ''}`} id={`answer-${answer.id}`}>
              <div className="flex gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center">
                  <VoteButtons type="answer" id={answer.id} upvotes={answer.upvotes} downvotes={answer.downvotes} />
                  {answer.isAccepted && <div className="mt-2 text-secondary">
                      <CheckCircleIcon className="h-6 w-6" />
                    </div>}
                </div>
                {/* Answer content */}
                <div className="flex-1">
                  <div className="prose prose-invert max-w-none mb-6 bg-background-dark bg-opacity-30 p-4 rounded-lg" dangerouslySetInnerHTML={{
                __html: answer.content
              }} />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-text-muted">
                      Answered {new Date(answer.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center bg-background-dark p-2 rounded-lg">
                      <img src={answer.author.avatar} alt={answer.author.name} className="h-8 w-8 rounded-full mr-2 border border-white/10" />
                      <div>
                        <p className="text-sm font-medium">
                          {answer.author.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {answer.author.reputation} reputation
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Accept answer button - only visible to question author */}
                  {isAuthenticated && user?.id === currentQuestion.author.id && !answer.isAccepted && <div className="mt-4 flex justify-end">
                        <Button variant="secondary" size="sm" onClick={() => handleAcceptAnswer(answer.id)} icon={<CheckCircleIcon className="h-4 w-4" />}>
                          Accept this answer
                        </Button>
                      </div>}
                </div>
              </div>
            </motion.div>)}
        </AnimatePresence>
      </div>
      {/* Post answer form */}
      {isAuthenticated ? <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <ReactQuill value={answerContent} onChange={setAnswerContent} theme="snow" placeholder="Write your answer here..." modules={{
            toolbar: [[{
              header: [1, 2, 3, false]
            }], ['bold', 'italic', 'underline', 'strike'], [{
              list: 'ordered'
            }, {
              list: 'bullet'
            }], ['link', 'code-block'], ['clean']]
          }} className="bg-background-dark rounded-lg text-text-light" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting} icon={<SparklesIcon className="h-4 w-4" />}>
                {isSubmitting ? 'Posting...' : 'Post Your Answer'}
              </Button>
            </div>
          </form>
        </motion.div> : <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="glass-card p-6 text-center">
          <p className="mb-4">
            You need to be logged in to answer this question.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/login'}>
            Log in to answer
          </Button>
        </motion.div>}
    </div>;
};