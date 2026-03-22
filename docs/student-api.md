# 🎓 Student API Documentation

## **📋 Overview**
Complete API documentation for student management system including authentication, profile management, batch assignments, and Google OAuth integration.

---

## **🔐 Authentication Routes**

### **POST `/api/auth/student/login`
**Purpose:** Student login with email/password
```typescript
// Request
{
  "email": "student@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "student@example.com",
    "role": "STUDENT",
    "batch_id": 5
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "http-only-cookie"
}
```

### **POST `/api/auth/student/register`
**Purpose:** New student registration
```typescript
// Request
{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "password123",
  "batch_id": 5,
  "phone": "+1234567890"
}

// Response
{
  "user": { ... },
  "accessToken": "...",
  "message": "Student registered successfully"
}
```

### **POST `/api/auth/refresh-token`
**Purpose:** Refresh access token using HTTP-only refresh token
```typescript
// Request (no body - uses cookie)
{}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **POST `/api/auth/logout`
**Purpose:** Student logout - clears tokens and cookies
```typescript
// Request
{}

// Response
{
  "message": "Logged out successfully"
}
```

---

## **🔗 Google OAuth Integration**

### **GET `/api/auth/google`
**Purpose:** Initiate Google OAuth flow
```typescript
// Redirects to Google OAuth consent screen
// After consent, redirects to:
// /api/auth/google/callback?code=AUTH_CODE&state=RANDOM_STATE
```

### **GET `/api/auth/google/callback`
**Purpose:** Handle Google OAuth callback
```typescript
// Request (query params)
{
  "code": "4/0AX4XfZh...",
  "state": "random_state_string"
}

// Response - redirects to frontend with tokens
// Frontend URL: /student/dashboard?token=ACCESS_TOKEN&user=USER_DATA
```

### **POST `/api/auth/google/link`
**Purpose:** Link Google account to existing student account
```typescript
// Request
{
  "email": "student@example.com",
  "password": "current_password",
  "googleId": "google_user_id"
}

// Response
{
  "message": "Google account linked successfully",
  "user": { ... }
}
```

---

## **👤 Student Profile Management**

### **GET `/api/student/profile`
**Purpose:** Get current student profile
```typescript
// Request (authenticated)
{}

// Response
{
  "id": 1,
  "name": "John Doe",
  "email": "student@example.com",
  "phone": "+1234567890",
  "batch_id": 5,
  "batch": {
    "id": 5,
    "batch_name": "DSA-2024-B1",
    "year": 2024,
    "city": {
      "id": 2,
      "city_name": "Mumbai"
    }
  },
  "profilePhoto": "https://cdn.example.com/photos/student1.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:20:00Z"
}
```

### **PUT `/api/student/profile`
**Purpose:** Update student profile information
```typescript
// Request
{
  "name": "John Updated",
  "phone": "+1234567890",
  "batch_id": 6
}

// Response
{
  "message": "Profile updated successfully",
  "user": { ...updated_profile... }
}
```

### **POST `/api/student/profile/photo`
**Purpose:** Update student profile photo
```typescript
// Request (multipart/form-data)
{
  "photo": File (max 5MB, jpg/png/webp),
  "currentPhoto": "https://cdn.example.com/photos/student1.jpg" // optional
}

// Response
{
  "message": "Profile photo updated successfully",
  "profilePhoto": "https://cdn.example.com/photos/student1_new.jpg"
}
```

### **DELETE `/api/student/profile/photo`
**Purpose:** Remove student profile photo
```typescript
// Request
{}

// Response
{
  "message": "Profile photo removed successfully"
}
```

---

## **📚 Batch & Progress Routes**

### **GET `/api/student/batches`
**Purpose:** Get student's batch information
```typescript
// Request (authenticated)
{}

// Response
{
  "currentBatch": {
    "id": 5,
    "batch_name": "DSA-2024-B1",
    "year": 2024,
    "city": {
      "id": 2,
      "city_name": "Mumbai"
    },
    "startDate": "2024-01-15",
    "endDate": "2024-06-15",
    "status": "ACTIVE"
  },
  "batchMates": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "profilePhoto": "https://cdn.example.com/photos/jane.jpg"
    }
  ]
}
```

### **GET `/api/student/progress`
**Purpose:** Get student's learning progress
```typescript
// Request (query params)
// /api/student/progress?topic=arrays&difficulty=medium

// Response
{
  "topics": [
    {
      "id": 1,
      "name": "Arrays",
      "difficulty": "MEDIUM",
      "completed": true,
      "score": 85,
      "completedAt": "2024-03-15T10:30:00Z",
      "timeSpent": 120 // minutes
    }
  ],
  "overallProgress": {
    "totalTopics": 50,
    "completedTopics": 32,
    "averageScore": 78.5,
    "totalTimeSpent": 2400 // minutes
  }
}
```

### **POST `/api/student/progress/update`
**Purpose:** Update topic completion status
```typescript
// Request
{
  "topicId": 1,
  "completed": true,
  "score": 85,
  "timeSpent": 120
}

// Response
{
  "message": "Progress updated successfully",
  "progress": { ...updated_progress... }
}
```

---

## **📝 Assignment & Submission Routes**

### **GET `/api/student/assignments`
**Purpose:** Get student's assignments
```typescript
// Request (query params)
// /api/student/assignments?status=pending&limit=10&page=1

// Response
{
  "assignments": [
    {
      "id": 1,
      "title": "Array Practice Problems",
      "description": "Solve 10 array problems...",
      "dueDate": "2024-03-25T23:59:59Z",
      "status": "PENDING",
      "difficulty": "MEDIUM",
      "estimatedTime": 120, // minutes
      "topics": ["Arrays", "Two Pointers"],
      "submittedAt": null,
      "score": null
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalAssignments": 25
  }
}
```

### **POST `/api/student/assignments/:id/submit`
**Purpose:** Submit assignment solution
```typescript
// Request (multipart/form-data)
{
  "solution": "Solution code or text...",
  "files": [File1, File2], // max 5 files, 10MB each
  "comments": "Here's my solution..."
}

// Response
{
  "message": "Assignment submitted successfully",
  "submission": {
    "id": 123,
    "assignmentId": 1,
    "submittedAt": "2024-03-20T15:30:00Z",
    "status": "SUBMITTED",
    "files": [
      "https://cdn.example.com/submissions/file1.cpp",
      "https://cdn.example.com/submissions/file2.cpp"
    ]
  }
}
```

### **GET `/api/student/submissions/:id`
**Purpose:** Get submission details
```typescript
// Request
{}

// Response
{
  "id": 123,
  "assignment": {
    "id": 1,
    "title": "Array Practice Problems"
  },
  "submittedAt": "2024-03-20T15:30:00Z",
  "score": 85,
  "feedback": "Good solution! Consider optimizing time complexity.",
  "status": "GRADED",
  "files": [
    {
      "name": "solution.cpp",
      "url": "https://cdn.example.com/submissions/file1.cpp",
      "size": 2048
    }
  ],
  "gradedBy": {
    "id": 5,
    "name": "John Teacher",
    "role": "TEACHER"
  },
  "gradedAt": "2024-03-21T10:15:00Z"
}
```

---

## **🏆 Leaderboard & Rankings**

### **GET `/api/student/leaderboard`
**Purpose:** Get student rankings
```typescript
// Request (query params)
// /api/student/leaderboard?type=batch&period=weekly

// Response
{
  "rankings": [
    {
      "rank": 1,
      "student": {
        "id": 1,
        "name": "John Doe",
        "profilePhoto": "https://cdn.example.com/photos/john.jpg"
      },
      "score": 950,
      "completedTopics": 45,
      "timeSpent": 3600,
      "batch": {
        "name": "DSA-2024-B1"
      }
    }
  ],
  "userRank": {
    "rank": 5,
    "score": 720
  }
}
```

### **GET `/api/student/achievements`
**Purpose:** Get student achievements
```typescript
// Response
{
  "achievements": [
    {
      "id": 1,
      "title": "Array Master",
      "description": "Complete all array problems",
      "icon": "🎯",
      "unlockedAt": "2024-03-15T10:30:00Z",
      "rarity": "COMMON"
    },
    {
      "id": 2,
      "title": "Speed Demon",
      "description": "Solve 10 problems under 30 minutes",
      "icon": "⚡",
      "unlockedAt": "2024-03-18T14:20:00Z",
      "rarity": "RARE"
    }
  ],
  "totalPoints": 1250,
  "nextAchievement": {
    "title": "Graph Guru",
    "progress": 75, // percentage
    "description": "Complete 5 more graph problems"
  }
}
```

---

## **💬 Communication Routes**

### **GET `/api/student/messages`
**Purpose:** Get student messages
```typescript
// Request (query params)
// /api/student/messages?type=announcement&unread=true

// Response
{
  "messages": [
    {
      "id": 1,
      "subject": "New Assignment Available",
      "content": "A new assignment on Linked Lists has been posted...",
      "type": "ANNOUNCEMENT",
      "sender": {
        "id": 5,
        "name": "John Teacher",
        "role": "TEACHER"
      },
      "isRead": false,
      "createdAt": "2024-03-20T09:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

### **POST `/api/student/messages/:id/read`
**Purpose:** Mark message as read
```typescript
// Request
{}

// Response
{
  "message": "Message marked as read"
}
```

### **GET `/api/student/notifications`
**Purpose:** Get student notifications
```typescript
// Response
{
  "notifications": [
    {
      "id": 1,
      "title": "Assignment Graded",
      "message": "Your Array Practice assignment has been graded",
      "type": "GRADE",
      "read": false,
      "createdAt": "2024-03-21T15:30:00Z",
      "actionUrl": "/student/assignments/1/submission/123"
    }
  ]
}
```

---

## **🔒 Security & Validation**

### **Authentication Required**
All student routes require valid JWT access token in `Authorization: Bearer <token>` header.

### **Rate Limiting**
- **Login attempts:** 5 per 15 minutes
- **File uploads:** 10 per hour
- **API calls:** 1000 per hour

### **File Upload Restrictions**
- **Profile photo:** Max 5MB, formats: jpg, png, webp
- **Assignment files:** Max 10MB per file, 5 files max
- **Allowed formats:** .cpp, .java, .py, .js, .txt, .pdf, .doc, .docx

### **Input Validation**
```typescript
// Email validation
email: {
  required: true,
  format: "email",
  maxLength: 255
}

// Password validation
password: {
  required: true,
  minLength: 8,
  pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$"
}

// Name validation
name: {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: "^[a-zA-Z\\s]+$"
}
```

---

## **🌐 Frontend Integration Examples**

### **React Hook for Student Data**
```typescript
// hooks/useStudent.ts
import { useState, useEffect } from 'react';
import { studentApi } from '@/services/student.service';

export const useStudent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
};
```

### **Google OAuth Integration**
```typescript
// utils/googleAuth.ts
export const initiateGoogleAuth = () => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

export const handleGoogleCallback = async (code: string, state: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/callback?code=${code}&state=${state}`);
    const data = await response.json();
    
    // Store tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard
    window.location.href = '/student/dashboard';
  } catch (error) {
    console.error('Google auth failed:', error);
  }
};
```

---

## **📱 Mobile App Support**

### **Responsive Design Requirements**
- **Mobile:** < 768px - Single column layout
- **Tablet:** 768px - 1024px - Two column layout  
- **Desktop:** > 1024px - Full layout

### **Touch Gestures**
- **Swipe:** Navigate between assignments
- **Pull-to-refresh:** Reload data
- **Long-press:** Show context menu

---

## **🚀 Deployment Considerations**

### **Environment Variables**
```bash
NEXT_PUBLIC_API_URL=https://api.dsa-tracker.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://yourapp.com/auth/google/callback
```

### **CORS Configuration**
```typescript
// Allowed origins for student routes
const allowedOrigins = [
  'https://dsa-tracker.com',
  'https://www.dsa-tracker.com',
  'http://localhost:3000' // development
];
```

---

## **📊 Error Handling**

### **Standard Error Responses**
```typescript
// 400 Bad Request
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "value": "invalid-email"
  }
}

// 401 Unauthorized
{
  "error": "AUTHENTICATION_ERROR", 
  "message": "Invalid or expired token"
}

// 403 Forbidden
{
  "error": "PERMISSION_ERROR",
  "message": "Access denied for this resource"
}

// 429 Rate Limited
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Try again later.",
  "retryAfter": 900 // seconds
}
```

---

## **🎯 Key Features Summary**

### **✅ Authentication**
- Email/password login
- Google OAuth integration
- Token refresh mechanism
- Secure logout

### **✅ Profile Management**  
- View/edit profile
- Photo upload/delete
- Batch assignment

### **✅ Learning Progress**
- Track topic completion
- Score tracking
- Time monitoring
- Achievement system

### **✅ Assignments**
- View assignments
- Submit solutions
- File uploads
- Grade feedback

### **✅ Social Features**
- Leaderboard rankings
- Messaging system
- Notifications
- Batch mate connections

### **✅ Security**
- JWT authentication
- Rate limiting
- Input validation
- File restrictions

---

**🚀 This comprehensive API documentation covers all student functionality including authentication, profile management, Google OAuth, assignments, progress tracking, and social features.**
