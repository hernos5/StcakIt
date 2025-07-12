import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { EditProfileModal } from '../components/EditProfileModal';
import {
  UserIcon,
  SettingsIcon,
  MessageSquareIcon,
  BookmarkIcon,
  TagIcon,
  BadgeCheckIcon,
  CheckIcon,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('questions');
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = user?.username === username;

  const profileData = {
    name: user?.name || 'User',
    username: user?.username || '',
    avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio:
      user?.bio ||
      'Full-stack developer passionate about React, TypeScript, and cloud technologies. Always learning and sharing knowledge.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinDate: 'January 2023',
    reputation: user?.reputation || 1243,
    badges: {
      gold: 3,
      silver: 12,
      bronze: 24,
    },
    stats: {
      questions: 15,
      answers: 42,
      reached: '~10k',
      accepted: 18,
    },
  };

  const questions = [
    {
      id: '1',
      title: 'How to implement JWT authentication in React?',
      votes: 24,
      answers: 3,
      views: 142,
      date: '2023-08-15',
      tags: ['React', 'JWT', 'Authentication'],
    },
    {
      id: '2',
      title: 'Understanding TypeScript generics with React hooks',
      votes: 31,
      answers: 5,
      views: 203,
      date: '2023-08-14',
      tags: ['TypeScript', 'React', 'Hooks'],
    },
  ];

  const answers = [
    {
      id: 'a1',
      questionTitle: 'How to handle API errors in React?',
      votes: 18,
      accepted: true,
      date: '2023-08-10',
      preview:
        'You can use try/catch blocks with async/await to handle API errors elegantly...',
    },
    {
      id: 'a2',
      questionTitle: 'What is the best way to manage global state in React?',
      votes: 42,
      accepted: false,
      date: '2023-08-05',
      preview:
        'For simple applications, React Context API might be sufficient. For more complex state...',
    },
  ];

  return (
    <div className="py-6">
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-text-muted">@{profileData.username}</p>
              </div>
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 md:mt-0"
                  onClick={() => setShowEditModal(true)}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button variant="primary" size="sm" className="mt-2 md:mt-0">
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
            <p className="mb-4">{profileData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
              <div>
                <UserIcon className="h-4 w-4 inline mr-1" />
                Member since {profileData.joinDate}
              </div>
              {profileData.location && (
                <div>📍 {profileData.location}</div>
              )}
              {profileData.website && (
                <div>
                  🌐{' '}
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    {profileData.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
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

      {/* Tabs Section */}
      <div className="mb-6">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8">
            {['questions', 'answers', 'badges', 'bookmarks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-light'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'questions' &&
            questions.map((q) => (
              <div
                key={q.id}
                className="glass-card p-4 mb-4 hover:shadow-glow transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{q.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {q.tags.map((tag) => (
                    <Badge key={tag} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <div>
                    {q.votes} votes • {q.answers} answers • {q.views} views
                  </div>
                  <div>Asked on {q.date}</div>
                </div>
              </div>
            ))}

          {activeTab === 'answers' &&
            answers.map((a) => (
              <div
                key={a.id}
                className="glass-card p-4 mb-4 hover:shadow-glow transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {a.questionTitle}
                </h3>
                <p className="text-text-muted mb-3">{a.preview}</p>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-text-muted">{a.votes} votes</span>
                    {a.accepted && (
                      <span className="ml-2 text-secondary flex items-center">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Accepted
                      </span>
                    )}
                  </div>
                  <div className="text-text-muted">Answered on {a.date}</div>
                </div>
              </div>
            ))}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['Gold', 'Silver', 'Bronze'].map((type, idx) => (
                <div key={type} className="glass-card p-4">
                  <div className="flex items-center mb-2">
                    <div
                      className={`h-8 w-8 rounded-full mr-2 flex items-center justify-center ${
                        type === 'Gold'
                          ? 'bg-yellow-500'
                          : type === 'Silver'
                          ? 'bg-gray-400'
                          : 'bg-amber-700'
                      }`}
                    >
                      <BadgeCheckIcon className="h-5 w-5 text-background-dark" />
                    </div>
                    <h3 className="font-semibold">{type} Badges</h3>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {profileData.badges[type.toLowerCase() as 'gold' | 'silver' | 'bronze']}{' '}
                    {type.toLowerCase()} badges earned
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Example Badge</span>
                      <span className="text-xs text-text-muted">Aug 5, 2023</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="glass-card p-6 text-center">
              <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
              <p className="text-text-muted mb-4">
                You haven't bookmarked any questions yet.
              </p>
              <Button variant="outline">Browse questions</Button>
            </div>
          )}
        </div>
      </div>

      {/* 🔧 Edit Modal */}
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
};
