import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  fullName: text('fullName'),
  bio: text('bio'),
  profilePictureUrl: text('profilePictureUrl'),
  backgroundImageUrl: text('backgroundImageUrl'),
  headline: text('headline'),
  location: text('location'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const qualifications = pgTable('qualifications', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  dateObtained: timestamp('dateObtained'),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  level: text('level').default('beginner'),
  endorsedCount: integer('endorsedCount').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const experience = pgTable('experience', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate'),
  description: text('description'),
  currentlyWorking: boolean('currentlyWorking').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  content: text('content').notNull(),
  type: text('type').default('regular'),
  expiresAt: timestamp('expiresAt'),
  deletedAt: timestamp('deletedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const postLikes = pgTable('post_likes', {
  id: text('id').primaryKey(),
  postId: text('postId').notNull(),
  userId: text('userId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const postComments = pgTable('post_comments', {
  id: text('id').primaryKey(),
  postId: text('postId').notNull(),
  userId: text('userId').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  level: text('level'),
  durationHours: integer('durationHours'),
  instructor: text('instructor'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const courseEnrollments = pgTable('course_enrollments', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  courseId: text('courseId').notNull(),
  progressPercentage: integer('progressPercentage').default(0),
  completedAt: timestamp('completedAt'),
  enrolledAt: timestamp('enrolledAt').notNull().defaultNow(),
})

export const cvSubmissions = pgTable('cv_submissions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  fileUrl: text('fileUrl').notNull(),
  headline: text('headline'),
  skillsSummary: text('skillsSummary'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const jobApplications = pgTable('job_applications', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  companyName: text('companyName').notNull(),
  position: text('position').notNull(),
  cvSubmissionId: text('cvSubmissionId'),
  status: text('status').default('applied'),
  appliedDate: timestamp('appliedDate').notNull().defaultNow(),
  lastUpdated: timestamp('lastUpdated').notNull().defaultNow(),
})

export const interviewSchedules = pgTable('interview_schedules', {
  id: text('id').primaryKey(),
  applicationId: text('applicationId').notNull(),
  scheduledDate: timestamp('scheduledDate').notNull(),
  durationMinutes: integer('durationMinutes').default(30),
  jitsiRoomId: text('jitsiRoomId'),
  status: text('status').default('scheduled'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
