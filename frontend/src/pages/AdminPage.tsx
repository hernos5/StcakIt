import React, { useState } from 'react';
import { UsersIcon, FlagIcon, ShieldIcon, BarChart2Icon, SearchIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('flagged');
  // Mock flagged content
  const flaggedContent = [{
    id: 'f1',
    type: 'question',
    title: 'How to hack a website?',
    author: {
      name: 'Anonymous User',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    flagCount: 3,
    reason: 'Inappropriate content',
    date: '2023-08-15T10:30:00Z'
  }, {
    id: 'f2',
    type: 'answer',
    questionTitle: 'What is the best programming language?',
    content: 'This answer contains offensive language...',
    author: {
      name: 'Troll User',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    flagCount: 5,
    reason: 'Offensive language',
    date: '2023-08-14T15:45:00Z'
  }];
  // Mock users for moderation
  const users = [{
    id: 'u1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'john@example.com',
    status: 'active',
    role: 'user',
    joinDate: '2023-01-15T08:30:00Z',
    lastActive: '2023-08-15T14:20:00Z'
  }, {
    id: 'u2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'jane@example.com',
    status: 'suspended',
    role: 'user',
    joinDate: '2023-02-10T10:15:00Z',
    lastActive: '2023-07-20T09:45:00Z'
  }];
  return <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="relative">
          <input type="text" placeholder="Search..." className="bg-background-medium bg-opacity-50 border border-white/10 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-text-muted">Total Users</div>
            <div className="text-xl font-semibold">1,245</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
            <BarChart2Icon className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <div className="text-sm text-text-muted">Questions</div>
            <div className="text-xl font-semibold">3,872</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <div className="text-sm text-text-muted">Flagged Content</div>
            <div className="text-xl font-semibold">8</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
            <ShieldIcon className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <div className="text-sm text-text-muted">Suspended Users</div>
            <div className="text-xl font-semibold">3</div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8">
            <button onClick={() => setActiveTab('flagged')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'flagged' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              <FlagIcon className="h-4 w-4 inline mr-1" />
              Flagged Content
            </button>
            <button onClick={() => setActiveTab('users')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              <UsersIcon className="h-4 w-4 inline mr-1" />
              User Management
            </button>
            <button onClick={() => setActiveTab('stats')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-light'}`}>
              <BarChart2Icon className="h-4 w-4 inline mr-1" />
              Statistics
            </button>
          </nav>
        </div>
        <div className="mt-6">
          {activeTab === 'flagged' && <div className="space-y-4">
              {flaggedContent.map(item => <div key={item.id} className="glass-card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Badge variant="default" className="mr-2">
                          {item.type === 'question' ? 'Question' : 'Answer'}
                        </Badge>
                        <Badge variant="primary" className="bg-red-500/20 text-red-400">
                          {item.flagCount} flags
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {item.type === 'question' ? item.title : `Re: ${item.questionTitle}`}
                      </h3>
                      {item.type === 'answer' && <p className="text-text-muted mb-2">{item.content}</p>}
                      <div className="flex items-center mt-3">
                        <img src={item.author.avatar} alt={item.author.name} className="h-6 w-6 rounded-full mr-2" />
                        <span className="text-sm text-text-muted">
                          Posted by {item.author.name} •{' '}
                          {new Date(item.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Reason:</span>{' '}
                        {item.reason}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <Button variant="outline" size="sm" className="text-text-muted border-text-muted/30 hover:bg-text-muted/10">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Keep
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>}
          {activeTab === 'users' && <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      User
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      Role
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      Joined
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-muted">
                      Last Active
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => <tr key={user.id} className="border-b border-white/5 hover:bg-background-medium">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full mr-3" />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-text-muted">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === 'active' ? 'secondary' : 'default'} className={user.status === 'suspended' ? 'bg-red-500/20 text-red-400' : ''}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{user.role}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {user.status === 'active' ? <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                              Suspend
                            </Button> : <Button variant="outline" size="sm" className="text-secondary border-secondary/30 hover:bg-secondary/10">
                              Activate
                            </Button>}
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>}
          {activeTab === 'stats' && <div className="glass-card p-6 text-center">
              <BarChart2Icon className="h-12 w-12 mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-semibold mb-2">
                Statistics Dashboard
              </h3>
              <p className="text-text-muted mb-4">
                Detailed analytics dashboard will be implemented in the next
                phase.
              </p>
              <Button variant="outline">View basic stats</Button>
            </div>}
        </div>
      </div>
    </div>;
};