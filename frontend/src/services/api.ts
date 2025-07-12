import axios from 'axios';
import { User } from '../store/authStore';
import { Question, Answer } from '../store/questionStore';
import { Notification } from '../store/notificationStore';
import { Tag } from '../store/tagStore';
// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'https://api.stackit.example.com/v1',
  // This would be your real API in production
  timeout: 10000
});
// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(config => {
  const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));
// Mock data for development
const mockUsers: User[] = [{
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  reputation: 1243,
  role: 'user'
}, {
  id: '2',
  name: 'Admin User',
  username: 'admin',
  email: 'admin@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  reputation: 5678,
  role: 'admin'
}];
const mockQuestions: Question[] = [{
  id: '1',
  title: 'How to implement JWT authentication in React?',
  content: `
      <p>I'm building a React application and need to implement JWT authentication. I've tried using localStorage but I'm concerned about security implications.</p>
      <p>What's the best practice for storing and refreshing JWTs in a React SPA?</p>
      <pre><code>// Current implementation
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
};
      </code></pre>
      <p>Is this secure enough or should I be using HTTP-only cookies instead?</p>
    `,
  excerpt: "I'm building a React application and need to implement JWT authentication. I've tried using localStorage but I'm concerned about security implications. What's the best practice for storing and refreshing JWTs in a React SPA?",
  upvotes: 24,
  downvotes: 2,
  answers: 3,
  views: 142,
  author: {
    id: '1',
    name: 'Alex Chen',
    username: 'alexchen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    reputation: 1243
  },
  tags: ['React', 'JWT', 'Authentication'],
  createdAt: '2023-08-15T14:30:00Z',
  updatedAt: '2023-08-15T14:30:00Z'
}, {
  id: '2',
  title: 'Understanding TypeScript generics with React hooks',
  content: `
      <p>I'm trying to create a custom hook that uses generics to provide type safety. However, I'm running into issues with type inference when using this hook in my components.</p>
      <p>Here's what I've tried:</p>
      <pre><code>function useData<T>(url: string): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, loading, error };
}</code></pre>
      <p>But when I use it like this:</p>
      <pre><code>interface User {
  id: number;
  name: string;
}
function UserProfile() {
  const { data, loading } = useData<User>('/api/user/1');
  if (loading) return <div>Loading...</div>;
  // TypeScript complains here because data might be null
  return <div>{data.name}</div>;
}</code></pre>
      <p>Can someone explain how to properly type custom hooks with generics?</p>
    `,
  excerpt: "I'm trying to create a custom hook that uses generics to provide type safety. However, I'm running into issues with type inference when using this hook in my components. Can someone explain how to properly type custom hooks with generics?",
  upvotes: 31,
  downvotes: 1,
  answers: 5,
  views: 203,
  author: {
    id: '2',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    reputation: 2891
  },
  tags: ['TypeScript', 'React', 'Hooks'],
  createdAt: '2023-08-14T09:15:00Z',
  updatedAt: '2023-08-14T09:15:00Z'
}];
const mockAnswers: Record<string, Answer[]> = {
  '1': [{
    id: 'a1',
    content: `
        <p>Using localStorage for JWT storage is convenient but has security risks, particularly vulnerability to XSS attacks.</p>
        <p>The most secure approach is to use HTTP-only cookies:</p>
        <pre><code>// Server-side (Node.js/Express example)
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});</code></pre>
        <p>With this approach:</p>
        <ul>
          <li>The cookie is not accessible via JavaScript (mitigating XSS)</li>
          <li>It's automatically sent with requests to your domain</li>
          <li>The secure flag ensures it's only sent over HTTPS in production</li>
        </ul>
        <p>For SPA architectures, you'll need to ensure your API endpoints handle cookie authentication properly and implement CSRF protection as well.</p>
      `,
    upvotes: 18,
    downvotes: 1,
    isAccepted: true,
    author: {
      id: '2',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      reputation: 2891
    },
    createdAt: '2023-08-15T15:45:00Z',
    updatedAt: '2023-08-15T15:45:00Z'
  }, {
    id: 'a2',
    content: `
        <p>If you must use localStorage, here are some mitigation strategies:</p>
        <ol>
          <li>Use short expiration times for tokens</li>
          <li>Implement a refresh token system</li>
          <li>Add fingerprinting to tokens (IP, user agent)</li>
          <li>Ensure proper Content Security Policy headers</li>
        </ol>
        <p>Example implementation with refresh tokens:</p>
        <pre><code>// Store access token in memory only (not localStorage)
let accessToken = null;
// Store refresh token in localStorage
localStorage.setItem('refreshToken', response.data.refreshToken);
// Function to get a new access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    // Redirect to login
    return;
  }
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    accessToken = response.data.accessToken;
    // Optionally update refresh token too
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return accessToken;
  } catch (error) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('refreshToken');
  }
};</code></pre>
        <p>This approach keeps the access token in memory only, reducing XSS risk.</p>
      `,
    upvotes: 12,
    downvotes: 0,
    isAccepted: false,
    author: {
      id: '1',
      name: 'Alex Chen',
      username: 'alexchen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      reputation: 1243
    },
    createdAt: '2023-08-15T16:30:00Z',
    updatedAt: '2023-08-15T16:30:00Z'
  }],
  '2': [{
    id: 'a3',
    content: `
        <p>The issue you're facing is common when working with nullable generic types. Here's how to improve your hook:</p>
        <pre><code>function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [url]);
  return { data, loading, error };
}</code></pre>
        <p>Then, when using it, you have a few options:</p>
        <ol>
          <li>Non-null assertion (if you're confident data exists):</li>
        </ol>
        <pre><code>function UserProfile() {
  const { data, loading } = useData<User>('/api/user/1');
  if (loading) return <div>Loading...</div>;
  // Use non-null assertion
  return <div>{data!.name}</div>;
}</code></pre>
        <ol start="2">
          <li>Optional chaining (safer):</li>
        </ol>
        <pre><code>return <div>{data?.name}</div>;</code></pre>
        <ol start="3">
          <li>Type guard (most explicit):</li>
        </ol>
        <pre><code>if (loading) return <div>Loading...</div>;
if (!data) return <div>No data found</div>;
return <div>{data.name}</div>;</code></pre>
        <p>The third approach is generally best practice as it handles all cases explicitly.</p>
      `,
    upvotes: 24,
    downvotes: 0,
    isAccepted: true,
    author: {
      id: '1',
      name: 'Alex Chen',
      username: 'alexchen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      reputation: 1243
    },
    createdAt: '2023-08-14T10:20:00Z',
    updatedAt: '2023-08-14T10:20:00Z'
  }]
};
const mockTags: Tag[] = [{
  id: '1',
  name: 'React',
  count: 2453,
  description: 'A JavaScript library for building user interfaces'
}, {
  id: '2',
  name: 'JavaScript',
  count: 1829,
  description: 'A high-level, interpreted programming language'
}, {
  id: '3',
  name: 'TypeScript',
  count: 1243,
  description: 'A typed superset of JavaScript that compiles to plain JavaScript'
}, {
  id: '4',
  name: 'Node.js',
  count: 987,
  description: "A JavaScript runtime built on Chrome's V8 JavaScript engine"
}, {
  id: '5',
  name: 'CSS',
  count: 756,
  description: 'Cascading Style Sheets is a style sheet language used for describing the presentation of a document'
}, {
  id: '6',
  name: 'HTML',
  count: 654,
  description: 'The standard markup language for documents designed to be displayed in a web browser'
}, {
  id: '7',
  name: 'Redux',
  count: 543,
  description: 'A predictable state container for JavaScript apps'
}, {
  id: '8',
  name: 'GraphQL',
  count: 432,
  description: 'A query language for your API'
}, {
  id: '9',
  name: 'Tailwind',
  count: 321,
  description: 'A utility-first CSS framework'
}, {
  id: '10',
  name: 'Next.js',
  count: 210,
  description: 'A React framework with hybrid static & server rendering'
}];
const mockNotifications: Notification[] = [{
  id: 'n1',
  type: 'answer',
  message: 'Sarah Johnson answered your question about JWT authentication',
  read: false,
  createdAt: '2023-08-15T15:45:00Z',
  sourceId: 'a1',
  sourceType: 'answer'
}, {
  id: 'n2',
  type: 'upvote',
  message: 'Your answer received 10 upvotes',
  read: true,
  createdAt: '2023-08-14T10:30:00Z',
  sourceId: 'a3',
  sourceType: 'answer'
}, {
  id: 'n3',
  type: 'mention',
  message: 'Alex Chen mentioned you in a comment',
  read: false,
  createdAt: '2023-08-13T09:15:00Z',
  sourceId: 'c1',
  sourceType: 'comment'
}, {
  id: 'n4',
  type: 'accept',
  message: 'Your answer was accepted as the solution',
  read: false,
  createdAt: '2023-08-12T14:20:00Z',
  sourceId: 'a3',
  sourceType: 'answer'
}, {
  id: 'n5',
  type: 'system',
  message: 'Welcome to StackIt! Complete your profile to get started.',
  read: true,
  createdAt: '2023-08-10T08:00:00Z'
}];
// Mock API implementation
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate authentication
      const user = mockUsers.find(u => u.email === email);
      if (!user || password !== 'password') {
        // In a real app, you'd hash passwords
        throw new Error('Invalid credentials');
      }
      return {
        user,
        token: 'mock-jwt-token'
      };
    },
    register: async (name: string, email: string, password: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      // Create new user (in a real app, this would be saved to a database)
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        username: email.split('@')[0],
        email,
        reputation: 1,
        role: 'user'
      };
      // In a real app, you'd add the user to the database
      // mockUsers.push(newUser)
      return {
        user: newUser,
        token: 'mock-jwt-token'
      };
    }
  },
  questions: {
    getAll: async (filter?: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return questions, optionally filtered
      if (filter) {
        return mockQuestions.filter(q => q.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) || q.title.toLowerCase().includes(filter.toLowerCase()));
      }
      return mockQuestions;
    },
    getById: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      const question = mockQuestions.find(q => q.id === id);
      if (!question) {
        throw new Error('Question not found');
      }
      return question;
    },
    create: async (title: string, content: string, tags: string[]) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Get user from auth store
      const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state;
      if (!authData?.user) {
        throw new Error('You must be logged in to create a question');
      }
      // Create new question
      const newQuestion: Question = {
        id: String(mockQuestions.length + 1),
        title,
        content,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        upvotes: 0,
        downvotes: 0,
        answers: 0,
        views: 0,
        tags,
        author: {
          id: authData.user.id,
          name: authData.user.name,
          username: authData.user.username,
          avatar: authData.user.avatar || '',
          reputation: authData.user.reputation
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // In a real app, you'd save this to a database
      // mockQuestions.push(newQuestion)
      return newQuestion;
    },
    vote: async (questionId: string, voteType: 'up' | 'down') => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd update the database
      return {
        success: true
      };
    }
  },
  answers: {
    getByQuestionId: async (questionId: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAnswers[questionId] || [];
    },
    create: async (questionId: string, content: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Get user from auth store
      const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state;
      if (!authData?.user) {
        throw new Error('You must be logged in to create an answer');
      }
      // Create new answer
      const newAnswer: Answer = {
        id: `a${Date.now()}`,
        content,
        upvotes: 0,
        downvotes: 0,
        isAccepted: false,
        author: {
          id: authData.user.id,
          name: authData.user.name,
          username: authData.user.username,
          avatar: authData.user.avatar || '',
          reputation: authData.user.reputation
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // In a real app, you'd save this to a database
      // if (!mockAnswers[questionId]) {
      //   mockAnswers[questionId] = []
      // }
      // mockAnswers[questionId].push(newAnswer)
      return newAnswer;
    },
    vote: async (answerId: string, voteType: 'up' | 'down') => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd update the database
      return {
        success: true
      };
    },
    accept: async (answerId: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // In a real app, you'd update the database
      return {
        success: true
      };
    }
  },
  tags: {
    getAll: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTags;
    },
    getPopular: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockTags.slice(0, 5);
    },
    getUserTags: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd get the user's followed tags from the database
      return mockTags.slice(0, 3).map(tag => ({
        ...tag,
        isFollowing: true
      }));
    },
    follow: async (tagId: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd update the database
      return {
        success: true
      };
    },
    unfollow: async (tagId: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd update the database
      return {
        success: true
      };
    }
  },
  notifications: {
    getAll: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNotifications;
    },
    markAsRead: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, you'd update the database
      return {
        success: true
      };
    },
    markAllAsRead: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // In a real app, you'd update the database
      return {
        success: true
      };
    }
  }
};