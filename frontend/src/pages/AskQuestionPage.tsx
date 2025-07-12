import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionStore } from '../store/questionStore';
import { useTagStore } from '../store/tagStore';
import { XIcon, SparklesIcon, InfoIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Define validation schema
const askQuestionSchema = z.object({
  title: z.string().min(15, 'Title must be at least 15 characters').max(150, 'Title must be less than 150 characters'),
  content: z.string().min(30, 'Content must be at least 30 characters'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag').max(5, 'Maximum 5 tags allowed')
});
type FormData = z.infer<typeof askQuestionSchema>;
export const AskQuestionPage = () => {
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    createQuestion
  } = useQuestionStore();
  const {
    tags,
    fetchTags
  } = useTagStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: []
    }
  });
  const selectedTags = watch('tags');
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.length > 1) {
      const filtered = tags.filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()) && !selectedTags.includes(tag.name)).map(tag => tag.name).slice(0, 5);
      setSuggestedTags(filtered);
    } else {
      setSuggestedTags([]);
    }
  };
  const addTag = (tag: string) => {
    if (tag.trim() !== '' && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setValue('tags', [...selectedTags, tag]);
      setTagInput('');
      setSuggestedTags([]);
    }
  };
  const removeTag = (tag: string) => {
    setValue('tags', selectedTags.filter(t => t !== tag));
  };
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const question = await createQuestion(data.title, data.content, data.tags);
      toast.success('Question posted successfully!');
      navigate(`/question/${question.id}`);
    } catch (error) {
      toast.error('Failed to post question');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="py-6">
      <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>
      <motion.div initial={{
      y: 20,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.1
    }} className="glass-card p-6 mb-6">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Writing a good question
            </h2>
            <div className="text-sm text-text-muted space-y-2">
              <p>
                You're ready to ask a programming question and this form will
                help guide you through the process.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Summarize your problem in a one-line title</li>
                <li>Describe your problem in detail</li>
                <li>Add "what you've tried" to solve it</li>
                <li>
                  Add tags which help surface your question to members of the
                  community
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="glass-card p-6 mb-6">
          <div className="mb-6">
            <label htmlFor="title" className="block font-medium mb-2">
              Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-text-muted mb-2">
              Be specific and imagine you're asking a question to another person
            </p>
            <Controller name="title" control={control} render={({
            field
          }) => <input {...field} id="title" type="text" placeholder="e.g., How to center a div with Tailwind CSS?" className={`w-full bg-background-dark bg-opacity-50 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} />} />
            {errors.title && <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>}
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block font-medium mb-2">
              What are the details of your problem?
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-text-muted mb-2">
              Introduce the problem and expand on what you put in the title.
              Minimum 30 characters.
            </p>
            <Controller name="content" control={control} render={({
            field
          }) => <ReactQuill {...field} theme="snow" placeholder="Describe your problem in detail. Include code snippets if relevant." modules={{
            toolbar: [[{
              header: [1, 2, 3, false]
            }], ['bold', 'italic', 'underline', 'strike'], [{
              list: 'ordered'
            }, {
              list: 'bullet'
            }], ['link', 'code-block'], ['clean']]
          }} className="bg-background-dark rounded-lg text-text-light" />} />
            {errors.content && <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>}
          </div>
          <div>
            <label htmlFor="tags" className="block font-medium mb-2">
              Tags
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-text-muted mb-2">
              Add up to 5 tags to describe what your question is about
            </p>
            <div className={`flex flex-wrap items-center gap-2 p-2 bg-background-dark bg-opacity-50 border ${errors.tags ? 'border-red-500' : 'border-white/10'} rounded-lg focus-within:ring-2 focus-within:ring-primary`}>
              {selectedTags.map(tag => <Badge key={tag} variant="primary" className="flex items-center">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full hover:bg-primary/30">
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>)}
              <input id="tags" type="text" value={tagInput} onChange={handleTagInput} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent border-none outline-none text-sm min-w-[120px]" placeholder={selectedTags.length === 0 ? 'e.g., react, javascript, tailwind' : ''} />
            </div>
            {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>}
            {suggestedTags.length > 0 && <div className="mt-2 bg-background-dark border border-white/10 rounded-lg p-2">
                <p className="text-xs text-text-muted mb-1">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map(tag => <Badge key={tag} variant="default" className="cursor-pointer hover:bg-background-medium" onClick={() => addTag(tag)}>
                      {tag}
                    </Badge>)}
                </div>
              </div>}
          </div>
        </motion.div>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="px-6" disabled={isSubmitting} icon={<SparklesIcon className="h-4 w-4" />}>
            {isSubmitting ? 'Posting...' : 'Post Your Question'}
          </Button>
        </motion.div>
      </form>
    </motion.div>;
};