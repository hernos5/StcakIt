import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserIcon, SettingsIcon, MessageSquareIcon, BookmarkIcon, TagIcon, BadgeCheckIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
export const ProfilePage = () => {
  const {
    username
  } = useParams<{
    username: string;
  }>();
  const {
    user
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState('questions');
  const isOwnProfile = user?.username === username;
  // Mock profile data
  const profileData = {
    name: user?.name || 'User',
    username: username || '',
    avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Full-stack developer passionate about React, TypeScript, and cloud technologies. Always learning and sharing knowledge.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinDate: 'January 2023',
    reputation: user?.reputation || 1243,
    badges: {
      gold: 3,
      silver: 12,
      bronze: 24
    },
    stats: {
      questions: 15,
      answers: 42,
      reached: '~10k',
      accepted: 18
    }
  };
  // Mock questions data
  const questions = [{
    id: '1',
    title: 'How to implement JWT authentication in React?',
    votes: 24,
    answers: 3,
    views: 142,
    date: '2023-08-15',
    tags: ['React', 'JWT', 'Authentication']
  }, {
    id: '2',
    title: 'Understanding TypeScript generics with React hooks',
    votes: 31,
    answers: 5,
    views: 203,
    date: '2023-08-14',
    tags: ['TypeScript', 'React', 'Hooks']
  }];
  // Mock answers data
  const answers = [{
    id: 'a1',
    questionTitle: 'How to handle API errors in React?',
    votes: 18,
    accepted: true,
    date: '2023-08-10',
    preview: 'You can use try/catch blocks with async/await to handle API errors elegantly...'
  }, {
    id: 'a2',
    questionTitle: 'What is the best way to manage global state in React?',
    votes: 42,
    accepted: false,
    date: '2023-08-05',
    preview: 'For simple applications, React Context API might be sufficient. For more complex state...'
  }];
  return <div className="py-6">
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-text-muted">@{profileData.username}</p>
              </div>
              {isOwnProfile ? <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button> : <Button variant="primary" size="sm" className="mt-2 md:mt-0">
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Message
                </Button>}
            </div>
            <p className="mb-4">{profileData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
              <div>
                <UserIcon className="h-4 w-4 inline mr-1" />
                Member since {profileData.joinDate}
              </div>
              {profileData.location && <div>
                  <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profileData.location}
                </div>}
              {profileData.website && <div>
                  <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    {profileData.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {profileData.stats.questions}
                </div>
                <div className="text-sm text-text-muted">Questions</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {profileData.stats.answers}
                </div>
                <div className="text-sm text-text-muted">Answers</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {profileData.reputation}
                </div>
                <div className="text-sm text-text-muted">Reputation</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {profileData.stats.reached}
                </div>
                <div className="text-sm text-text-muted">People reached</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8">
            <button onClick={() => setActiveTab('questions')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              Questions
            </button>
            <button onClick={() => setActiveTab('answers')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'answers' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              Answers
            </button>
            <button onClick={() => setActiveTab('badges')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'badges' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              Badges
            </button>
            <button onClick={() => setActiveTab('bookmarks')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookmarks' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              Bookmarks
            </button>
          </nav>
        </div>
        <div className="mt-6">
          {activeTab === 'questions' && <div>
              {questions.map(question => <div key={question.id} className="glass-card p-4 mb-4 hover:shadow-glow transition-shadow duration-300">
                  <h3 className="text-lg font-semibold mb-2">
                    {question.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map(tag => <Badge key={tag} variant="primary">
                        {tag}
                      </Badge>)}
                  </div>
                  <div className="flex justify-between items-center text-sm text-text-muted">
                    <div>
                      {question.votes} votes • {question.answers} answers •{' '}
                      {question.views} views
                    </div>
                    <div>Asked on {question.date}</div>
                  </div>
                </div>)}
            </div>}
          {activeTab === 'answers' && <div>
              {answers.map(answer => <div key={answer.id} className="glass-card p-4 mb-4 hover:shadow-glow transition-shadow duration-300">
                  <h3 className="text-lg font-semibold mb-2">
                    {answer.questionTitle}
                  </h3>
                  <p className="text-text-muted mb-3">{answer.preview}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="text-text-muted">
                        {answer.votes} votes
                      </span>
                      {answer.accepted && <span className="ml-2 text-secondary flex items-center">
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Accepted
                        </span>}
                    </div>
                    <div className="text-text-muted">
                      Answered on {answer.date}
                    </div>
                  </div>
                </div>)}
            </div>}
          {activeTab === 'badges' && <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 mr-2 flex items-center justify-center">
                      <BadgeCheckIcon className="h-5 w-5 text-background-dark" />
                    </div>
                    <h3 className="font-semibold">Gold Badges</h3>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {profileData.badges.gold} gold badges earned
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Famous Question</span>
                      <span className="text-xs text-text-muted">
                        Aug 5, 2023
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Great Answer</span>
                      <span className="text-xs text-text-muted">
                        Jul 15, 2023
                      </span>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-400 mr-2 flex items-center justify-center">
                      <BadgeCheckIcon className="h-5 w-5 text-background-dark" />
                    </div>
                    <h3 className="font-semibold">Silver Badges</h3>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {profileData.badges.silver} silver badges earned
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Good Answer</span>
                      <span className="text-xs text-text-muted">
                        Aug 10, 2023
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enthusiast</span>
                      <span className="text-xs text-text-muted">
                        Jul 25, 2023
                      </span>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-amber-700 mr-2 flex items-center justify-center">
                      <BadgeCheckIcon className="h-5 w-5 text-background-dark" />
                    </div>
                    <h3 className="font-semibold">Bronze Badges</h3>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {profileData.badges.bronze} bronze badges earned
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scholar</span>
                      <span className="text-xs text-text-muted">
                        Aug 15, 2023
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Editor</span>
                      <span className="text-xs text-text-muted">
                        Aug 2, 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'bookmarks' && <div className="glass-card p-6 text-center">
              <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
              <p className="text-text-muted mb-4">
                You haven't bookmarked any questions yet. When you do, they'll
                appear here.
              </p>
              <Button variant="outline">Browse questions</Button>
            </div>}
        </div>
      </div>
    </div>;
};