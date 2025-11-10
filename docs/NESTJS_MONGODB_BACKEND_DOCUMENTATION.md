# AREP Backend Documentation - NestJS + MongoDB

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [MongoDB Schema Design](#mongodb-schema-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Endpoints](#api-endpoints)
7. [Real-time Features](#real-time-features)
8. [File Upload & Storage](#file-upload--storage)
9. [Validation & Error Handling](#validation--error-handling)
10. [Security Configuration](#security-configuration)
11. [Deployment Guide](#deployment-guide)

---

## System Overview

AREP (Advanced Requirements Engineering Platform) is a collaborative requirements management system built with NestJS backend and MongoDB database, featuring real-time collaboration, impact analysis, and comprehensive review workflows.

### Core Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Multi-project management
- Requirements lifecycle management
- Change request and impact analysis
- Traceability matrix
- Real-time collaborative reviews (WebSocket)
- Push notifications
- Audit logging
- Kanban-style elicitation boards

---

## Technology Stack

### Backend
- **Framework**: NestJS 10.x (Node.js)
- **Language**: TypeScript 5.x
- **Database**: MongoDB 7.x
- **ODM**: Mongoose 8.x
- **Authentication**: Passport JWT
- **Real-time**: Socket.IO
- **Validation**: class-validator, class-transformer
- **File Storage**: AWS S3 or local storage (Multer)
- **Email**: Nodemailer or SendGrid
- **Caching**: Redis (optional)
- **Testing**: Jest

### Development Tools
- **API Documentation**: Swagger/OpenAPI
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
- **Environment**: dotenv

---

## Project Structure

```
arep-backend/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root module
│   │
│   ├── common/                      # Shared utilities
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── ws-jwt.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── interfaces/
│   │       └── response.interface.ts
│   │
│   ├── config/                      # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── multer.config.ts
│   │
│   ├── auth/                        # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   │
│   ├── users/                       # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── schemas/
│   │   │   ├── user.schema.ts
│   │   │   └── user-role.schema.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── assign-role.dto.ts
│   │
│   ├── projects/                    # Projects module
│   │   ├── projects.module.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   ├── schemas/
│   │   │   ├── project.schema.ts
│   │   │   └── project-member.schema.ts
│   │   └── dto/
│   │       ├── create-project.dto.ts
│   │       ├── update-project.dto.ts
│   │       └── add-member.dto.ts
│   │
│   ├── requirements/                # Requirements module
│   │   ├── requirements.module.ts
│   │   ├── requirements.controller.ts
│   │   ├── requirements.service.ts
│   │   ├── schemas/
│   │   │   ├── requirement.schema.ts
│   │   │   └── requirement-attachment.schema.ts
│   │   └── dto/
│   │       ├── create-requirement.dto.ts
│   │       ├── update-requirement.dto.ts
│   │       └── filter-requirement.dto.ts
│   │
│   ├── change-requests/             # Change requests module
│   │   ├── change-requests.module.ts
│   │   ├── change-requests.controller.ts
│   │   ├── change-requests.service.ts
│   │   ├── schemas/
│   │   │   ├── change-request.schema.ts
│   │   │   └── impact-analysis.schema.ts
│   │   └── dto/
│   │
│   ├── traceability/                # Traceability module
│   │   ├── traceability.module.ts
│   │   ├── traceability.controller.ts
│   │   ├── traceability.service.ts
│   │   ├── schemas/
│   │   │   └── traceability-link.schema.ts
│   │   └── dto/
│   │
│   ├── reviews/                     # Reviews module
│   │   ├── reviews.module.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   ├── schemas/
│   │   │   ├── review.schema.ts
│   │   │   └── review-comment.schema.ts
│   │   └── dto/
│   │
│   ├── review-sessions/             # Review sessions module
│   │   ├── review-sessions.module.ts
│   │   ├── review-sessions.controller.ts
│   │   ├── review-sessions.service.ts
│   │   ├── review-sessions.gateway.ts  # WebSocket gateway
│   │   ├── schemas/
│   │   │   ├── review-session.schema.ts
│   │   │   └── session-vote.schema.ts
│   │   └── dto/
│   │
│   ├── notifications/               # Notifications module
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   ├── schemas/
│   │   │   ├── notification.schema.ts
│   │   │   └── notification-preference.schema.ts
│   │   └── dto/
│   │
│   ├── elicitation/                 # Elicitation board module
│   │   ├── elicitation.module.ts
│   │   ├── elicitation.controller.ts
│   │   ├── elicitation.service.ts
│   │   ├── elicitation.gateway.ts   # WebSocket for real-time cards
│   │   ├── schemas/
│   │   │   └── elicitation-card.schema.ts
│   │   └── dto/
│   │
│   ├── validation-rules/            # Validation rules module
│   │   ├── validation-rules.module.ts
│   │   ├── validation-rules.controller.ts
│   │   ├── validation-rules.service.ts
│   │   ├── schemas/
│   │   │   └── validation-rule.schema.ts
│   │   └── dto/
│   │
│   ├── audit/                       # Audit logging module
│   │   ├── audit.module.ts
│   │   ├── audit.controller.ts
│   │   ├── audit.service.ts
│   │   ├── schemas/
│   │   │   └── audit-log.schema.ts
│   │   └── dto/
│   │
│   └── uploads/                     # File uploads module
│       ├── uploads.module.ts
│       ├── uploads.controller.ts
│       └── uploads.service.ts
│
├── test/                            # E2E tests
├── .env.example                     # Environment variables template
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── nest-cli.json                    # NestJS CLI configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies

```

---

## MongoDB Schema Design

### 1. Users Collection

#### User Schema
```typescript
// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string; // Hashed with bcrypt

  @Prop({ required: true })
  fullName: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ default: 'system', enum: ['light', 'dark', 'system'] })
  theme: string;

  @Prop()
  lastLogin?: Date;

  @Prop()
  refreshToken?: string; // Hashed refresh token

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ fullName: 'text' }); // Full-text search
```

#### User Roles Schema
```typescript
// src/users/schemas/user-role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AppRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project-manager',
  BUSINESS_ANALYST = 'business-analyst',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  STAKEHOLDER = 'stakeholder',
  REVIEWER = 'reviewer',
  VIEWER = 'viewer',
}

export type UserRoleDocument = UserRole & Document;

@Schema({ timestamps: true })
export class UserRole {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(AppRole) })
  role: AppRole;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedBy?: Types.ObjectId;

  @Prop()
  assignedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

// Compound unique index
UserRoleSchema.index({ userId: 1, role: 1 }, { unique: true });
UserRoleSchema.index({ userId: 1 });
```

---

### 2. Projects Collection

#### Project Schema
```typescript
// src/projects/schemas/project.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  ON_HOLD = 'on-hold',
}

export enum ProjectTemplate {
  BLANK = 'blank',
  SOFTWARE_DEV = 'software-dev',
  MOBILE_APP = 'mobile-app',
  ENTERPRISE = 'enterprise',
  API = 'api',
}

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true })
  key: string; // e.g., "ECP", "MAR"

  @Prop()
  description?: string;

  @Prop({ required: true, enum: Object.values(ProjectTemplate), default: ProjectTemplate.BLANK })
  template: ProjectTemplate;

  @Prop({ required: true, enum: Object.values(ProjectStatus), default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  teamMembers: Types.ObjectId[];

  @Prop({ default: 0 })
  requirementCount: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Indexes
ProjectSchema.index({ key: 1 }, { unique: true });
ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ teamMembers: 1 });
ProjectSchema.index({ name: 'text', description: 'text' });
```

---

### 3. Requirements Collection

#### Requirement Schema
```typescript
// src/requirements/schemas/requirement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RequirementType {
  FUNCTIONAL = 'functional',
  NON_FUNCTIONAL = 'non-functional',
  CONSTRAINT = 'constraint',
  BUSINESS_RULE = 'business-rule',
}

export enum RequirementStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IMPLEMENTED = 'implemented',
  VERIFIED = 'verified',
  CLOSED = 'closed',
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Schema({ _id: false })
export class Attachment {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  fileSize?: number;

  @Prop()
  mimeType?: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

@Schema({ _id: false })
export class VersionHistory {
  @Prop({ required: true })
  version: number;

  @Prop({ type: Object, required: true })
  changes: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  modifiedBy: Types.ObjectId;

  @Prop({ default: Date.now })
  modifiedAt: Date;
}

export type RequirementDocument = Requirement & Document;

@Schema({ timestamps: true })
export class Requirement {
  @Prop({ required: true })
  reqId: string; // e.g., "ECP-001"

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(RequirementType) })
  type: RequirementType;

  @Prop({ required: true, enum: Object.values(RequirementStatus), default: RequirementStatus.DRAFT })
  status: RequirementStatus;

  @Prop({ required: true, enum: Object.values(Priority), default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ type: [String], default: [] })
  acceptanceCriteria: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assigneeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];

  @Prop({ type: [VersionHistory], default: [] })
  versionHistory: VersionHistory[];

  @Prop({ type: [String], default: [] })
  validationWarnings: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RequirementSchema = SchemaFactory.createForClass(Requirement);

// Indexes
RequirementSchema.index({ projectId: 1, reqId: 1 }, { unique: true });
RequirementSchema.index({ projectId: 1, status: 1 });
RequirementSchema.index({ projectId: 1, priority: 1 });
RequirementSchema.index({ assigneeId: 1 });
RequirementSchema.index({ tags: 1 });
RequirementSchema.index({ title: 'text', description: 'text' }); // Full-text search
RequirementSchema.index({ createdAt: -1 });
```

---

### 4. Change Requests Collection

#### Change Request Schema
```typescript
// src/change-requests/schemas/change-request.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ChangeRequestType {
  ENHANCEMENT = 'enhancement',
  BUG_FIX = 'bug-fix',
  SCOPE_CHANGE = 'scope-change',
  TECHNICAL = 'technical',
}

export enum ChangeRequestStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IMPLEMENTED = 'implemented',
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum Urgency {
  IMMEDIATE = 'immediate',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export type ChangeRequestDocument = ChangeRequest & Document;

@Schema({ timestamps: true })
export class ChangeRequest {
  @Prop({ required: true })
  crId: string; // e.g., "CR-001"

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(ChangeRequestType) })
  type: ChangeRequestType;

  @Prop({ required: true, enum: Object.values(ChangeRequestStatus), default: ChangeRequestStatus.PENDING })
  status: ChangeRequestStatus;

  @Prop({ required: true, enum: Object.values(Priority), default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ required: true, enum: Object.values(Urgency) })
  urgency: Urgency;

  @Prop({ required: true })
  businessJustification: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Requirement' }], default: [] })
  targetRequirements: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requestedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  rejectionReason?: string;

  @Prop()
  implementationNotes?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChangeRequestSchema = SchemaFactory.createForClass(ChangeRequest);

// Indexes
ChangeRequestSchema.index({ projectId: 1, crId: 1 }, { unique: true });
ChangeRequestSchema.index({ projectId: 1, status: 1 });
ChangeRequestSchema.index({ requestedBy: 1 });
```

#### Impact Analysis Schema (Embedded in ChangeRequest or separate)
```typescript
// src/change-requests/schemas/impact-analysis.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class AffectedRequirement {
  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirementId: Types.ObjectId;

  @Prop({ required: true, enum: ['direct', 'indirect'] })
  impactType: string;

  @Prop({ required: true })
  changeDescription: string;
}

@Schema({ _id: false })
export class ImpactedArtifact {
  @Prop({ required: true, enum: ['test', 'code', 'doc', 'design'] })
  artifactType: string;

  @Prop({ required: true })
  artifactId: string;

  @Prop({ required: true })
  artifactName: string;

  @Prop()
  estimatedEffort?: number; // hours
}

@Schema({ _id: false })
export class Risk {
  @Prop({ required: true, enum: ['technical', 'schedule', 'dependency', 'resource'] })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(RiskLevel) })
  level: RiskLevel;

  @Prop({ required: true })
  mitigation: string;
}

@Schema({ _id: false })
export class Recommendation {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(Priority) })
  priority: Priority;
}

@Schema({ _id: false })
export class EffortEstimation {
  @Prop({ default: 0 })
  analysis: number;

  @Prop({ default: 0 })
  development: number;

  @Prop({ default: 0 })
  testing: number;

  @Prop({ default: 0 })
  documentation: number;

  @Prop({ default: 0 })
  total: number;
}

export type ImpactAnalysisDocument = ImpactAnalysis & Document;

@Schema({ timestamps: true })
export class ImpactAnalysis {
  @Prop({ type: Types.ObjectId, ref: 'ChangeRequest', required: true })
  changeRequestId: Types.ObjectId;

  @Prop({ type: [AffectedRequirement], default: [] })
  affectedRequirements: AffectedRequirement[];

  @Prop({ type: [ImpactedArtifact], default: [] })
  impactedArtifacts: ImpactedArtifact[];

  @Prop({ default: 0 })
  dependencyCount: number;

  @Prop({ type: EffortEstimation })
  effortEstimation: EffortEstimation;

  @Prop({ type: [Risk], default: [] })
  risks: Risk[];

  @Prop({ type: [Recommendation], default: [] })
  recommendations: Recommendation[];

  @Prop({ required: true, enum: Object.values(ImpactLevel) })
  overallImpact: ImpactLevel;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  analyzedBy: Types.ObjectId;

  @Prop({ default: Date.now })
  analyzedAt: Date;
}

export const ImpactAnalysisSchema = SchemaFactory.createForClass(ImpactAnalysis);

ImpactAnalysisSchema.index({ changeRequestId: 1 }, { unique: true });
```

---

### 5. Traceability Links Collection

```typescript
// src/traceability/schemas/traceability-link.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ArtifactType {
  TEST = 'test',
  CODE = 'code',
  DOC = 'doc',
  DESIGN = 'design',
}

export enum LinkType {
  VERIFIES = 'verifies',
  IMPLEMENTS = 'implements',
  DESCRIBES = 'describes',
  DERIVES_FROM = 'derives-from',
  DEPENDS_ON = 'depends-on',
}

export enum LinkStatus {
  ACTIVE = 'active',
  BROKEN = 'broken',
  OUTDATED = 'outdated',
}

export type TraceabilityLinkDocument = TraceabilityLink & Document;

@Schema({ timestamps: true })
export class TraceabilityLink {
  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirementId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(ArtifactType) })
  artifactType: ArtifactType;

  @Prop({ required: true })
  artifactId: string;

  @Prop({ required: true })
  artifactName: string;

  @Prop()
  artifactUrl?: string;

  @Prop({ required: true, enum: Object.values(LinkType) })
  linkType: LinkType;

  @Prop({ required: true, enum: Object.values(LinkStatus), default: LinkStatus.ACTIVE })
  status: LinkStatus;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TraceabilityLinkSchema = SchemaFactory.createForClass(TraceabilityLink);

TraceabilityLinkSchema.index({ requirementId: 1 });
TraceabilityLinkSchema.index({ requirementId: 1, artifactType: 1 });
TraceabilityLinkSchema.index({ artifactId: 1 });
```

---

### 6. Reviews Collection

```typescript
// src/reviews/schemas/review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum ReviewDecision {
  APPROVE = 'approve',
  REJECT = 'reject',
  DEFER = 'defer',
}

export enum ReviewType {
  INDIVIDUAL = 'individual',
  FACILITATED_SESSION = 'facilitated-session',
}

@Schema({ _id: false })
export class Reviewer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: Object.values(ReviewDecision) })
  decision?: ReviewDecision;

  @Prop()
  completedAt?: Date;
}

@Schema({ _id: false })
export class ReviewChecklist {
  @Prop({ default: false })
  clearAndUnambiguous: boolean;

  @Prop({ default: false })
  testable: boolean;

  @Prop({ default: false })
  feasible: boolean;

  @Prop({ default: false })
  complete: boolean;

  @Prop({ default: false })
  consistent: boolean;
}

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirementId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(ReviewType) })
  type: ReviewType;

  @Prop({ required: true, enum: Object.values(ReviewStatus), default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Prop({ type: [Reviewer], default: [] })
  reviewers: Reviewer[];

  @Prop()
  dueDate?: Date;

  @Prop({ type: ReviewChecklist })
  checklist?: ReviewChecklist;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ requirementId: 1 });
ReviewSchema.index({ 'reviewers.userId': 1 });
ReviewSchema.index({ status: 1 });
```

#### Review Comments Schema
```typescript
// src/reviews/schemas/review-comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewCommentDocument = ReviewComment & Document;

@Schema({ timestamps: true })
export class ReviewComment {
  @Prop({ type: Types.ObjectId, ref: 'Review', required: true })
  reviewId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'ReviewComment' })
  parentId?: Types.ObjectId; // For threaded replies

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ReviewCommentSchema = SchemaFactory.createForClass(ReviewComment);

ReviewCommentSchema.index({ reviewId: 1, createdAt: -1 });
ReviewCommentSchema.index({ parentId: 1 });
```

---

### 7. Review Sessions Collection

```typescript
// src/review-sessions/schemas/review-session.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum VoteType {
  APPROVE = 'approve',
  REJECT = 'reject',
  NEEDS_DISCUSSION = 'needs-discussion',
}

@Schema({ _id: false })
export class Participant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  lastSeen?: Date;
}

@Schema({ _id: false })
export class RequirementReview {
  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirementId: Types.ObjectId;

  @Prop({ enum: ['approved', 'rejected', 'deferred'] })
  finalDecision?: string;

  @Prop()
  reviewedAt?: Date;
}

export type ReviewSessionDocument = ReviewSession & Document;

@Schema({ timestamps: true })
export class ReviewSession {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(SessionStatus), default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Requirement' }], default: [] })
  requirementIds: Types.ObjectId[];

  @Prop({ default: 0 })
  currentRequirementIndex: number;

  @Prop({ type: [Participant], default: [] })
  participants: Participant[];

  @Prop({ type: [RequirementReview], default: [] })
  reviews: RequirementReview[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  scheduledAt?: Date;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ReviewSessionSchema = SchemaFactory.createForClass(ReviewSession);

ReviewSessionSchema.index({ projectId: 1 });
ReviewSessionSchema.index({ status: 1 });
ReviewSessionSchema.index({ 'participants.userId': 1 });
```

#### Session Votes Schema
```typescript
// src/review-sessions/schemas/session-vote.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionVoteDocument = SessionVote & Document;

@Schema({ timestamps: true })
export class SessionVote {
  @Prop({ type: Types.ObjectId, ref: 'ReviewSession', required: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Requirement', required: true })
  requirementId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(VoteType) })
  voteType: VoteType;

  @Prop()
  comment?: string;

  @Prop()
  createdAt: Date;
}

export const SessionVoteSchema = SchemaFactory.createForClass(SessionVote);

SessionVoteSchema.index({ sessionId: 1, requirementId: 1 });
SessionVoteSchema.index({ userId: 1 });
```

---

### 8. Notifications Collection

```typescript
// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  REVIEW_ASSIGNMENT = 'review-assignment',
  MENTION = 'mention',
  CHANGE_REQUEST_UPDATE = 'change-request-update',
  DUE_DATE_REMINDER = 'due-date-reminder',
  STATUS_CHANGE = 'status-change',
  COMMENT_REPLY = 'comment-reply',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: Object.values(NotificationPriority), default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  actionUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  readAt?: Date;

  @Prop()
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
```

#### Notification Preferences Schema
```typescript
// src/notifications/schemas/notification-preference.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum EmailDigestFrequency {
  REAL_TIME = 'real-time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({ timestamps: true })
export class NotificationPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Email preferences
  @Prop({ default: true })
  emailEnabled: boolean;

  @Prop({ default: true })
  emailReviewAssignments: boolean;

  @Prop({ default: true })
  emailMentions: boolean;

  @Prop({ default: true })
  emailChangeRequests: boolean;

  @Prop({ default: true })
  emailDueDates: boolean;

  @Prop({ default: true })
  emailStatusChanges: boolean;

  @Prop({ enum: Object.values(EmailDigestFrequency), default: EmailDigestFrequency.REAL_TIME })
  emailDigestFrequency: EmailDigestFrequency;

  // Push preferences
  @Prop({ default: true })
  pushEnabled: boolean;

  @Prop({ default: true })
  pushReviewAssignments: boolean;

  @Prop({ default: true })
  pushMentions: boolean;

  @Prop({ default: true })
  pushChangeRequests: boolean;

  @Prop({ default: true })
  pushDueDates: boolean;

  @Prop({ default: true })
  pushStatusChanges: boolean;

  // Quiet hours
  @Prop({ default: false })
  quietHoursEnabled: boolean;

  @Prop()
  quietHoursStart?: string; // e.g., "22:00"

  @Prop()
  quietHoursEnd?: string; // e.g., "08:00"

  @Prop()
  updatedAt: Date;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference);

NotificationPreferenceSchema.index({ userId: 1 }, { unique: true });
```

---

### 9. Elicitation Cards Collection

```typescript
// src/elicitation/schemas/elicitation-card.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ElicitationColumn {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done',
}

export type ElicitationCardDocument = ElicitationCard & Document;

@Schema({ timestamps: true })
export class ElicitationCard {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: Object.values(ElicitationColumn), default: ElicitationColumn.BACKLOG })
  column: ElicitationColumn;

  @Prop({ required: true })
  position: number;

  @Prop({ required: true, enum: Object.values(Priority), default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ElicitationCardSchema = SchemaFactory.createForClass(ElicitationCard);

ElicitationCardSchema.index({ projectId: 1, column: 1, position: 1 });
ElicitationCardSchema.index({ assignedTo: 1 });
```

---

### 10. Validation Rules Collection

```typescript
// src/validation-rules/schemas/validation-rule.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ValidationRuleType {
  REQUIRED_FIELD = 'required-field',
  FORMAT_CHECK = 'format-check',
  DEPENDENCY = 'dependency',
  BUSINESS_LOGIC = 'business-logic',
  CUSTOM = 'custom',
}

export enum AppliesTo {
  REQUIREMENT = 'requirement',
  CHANGE_REQUEST = 'change-request',
  REVIEW = 'review',
  ALL = 'all',
}

export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

@Schema({ _id: false })
export class ValidationCondition {
  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  operator: string; // 'equals', 'not-equals', 'contains', etc.

  @Prop({ type: Object })
  value?: any;
}

export type ValidationRuleDocument = ValidationRule & Document;

@Schema({ timestamps: true })
export class ValidationRule {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(ValidationRuleType) })
  ruleType: ValidationRuleType;

  @Prop({ required: true, enum: Object.values(AppliesTo) })
  appliesTo: AppliesTo;

  @Prop({ required: true })
  field: string;

  @Prop({ type: [ValidationCondition], required: true })
  conditions: ValidationCondition[];

  @Prop({ required: true, enum: Object.values(ValidationSeverity) })
  severity: ValidationSeverity;

  @Prop({ required: true })
  errorMessage: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: 0 })
  executionCount: number;

  @Prop({ default: 0 })
  violationCount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ValidationRuleSchema = SchemaFactory.createForClass(ValidationRule);

ValidationRuleSchema.index({ appliesTo: 1, enabled: 1 });
```

---

### 11. Audit Logs Collection

```typescript
// src/audit/schemas/audit-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  STATUS_CHANGE = 'status-change',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum EntityType {
  REQUIREMENT = 'requirement',
  CHANGE_REQUEST = 'change-request',
  REVIEW = 'review',
  USER = 'user',
  PROJECT = 'project',
  VALIDATION_RULE = 'validation-rule',
  TRACEABILITY_LINK = 'traceability-link',
}

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: false })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(AuditAction) })
  action: AuditAction;

  @Prop({ required: true, enum: Object.values(EntityType) })
  entityType: EntityType;

  @Prop({ required: true })
  entityId: string;

  @Prop()
  entityName?: string;

  @Prop({ type: Object })
  changes?: Record<string, any>;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ action: 1 });
```

---

## Authentication & Authorization

### 1. JWT Strategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 2. JWT Refresh Strategy

```typescript
// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { userId: payload.sub, refreshToken };
  }
}
```

### 3. Auth Service

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    await this.usersService.updateLastLogin(user._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }
}
```

### 4. Role-Based Guards

```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole } from '../../users/schemas/user-role.schema';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const userRoles = await this.usersService.getUserRoles(userId);
    
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
```

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AppRole } from '../../users/schemas/user-role.schema';

export const Roles = (...roles: AppRole[]) => SetMetadata('roles', roles);
```

---

## API Endpoints

### Base Configuration

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AREP API')
    .setDescription('Advanced Requirements Engineering Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

### 1. Authentication Endpoints

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Req() req) {
    return this.authService.refreshTokens(req.user.userId, req.user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
}
```

**DTO Examples:**
```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;
}
```

**API Examples:**

**Register:**
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}

Response (201):
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Login:**
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Projects Endpoints

```typescript
// src/projects/projects.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppRole } from '../users/schemas/user-role.schema';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.projectsService.findUserProjects(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles(AppRole.ADMIN, AppRole.PROJECT_MANAGER)
  async create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create({ ...createProjectDto, ownerId: user.userId });
  }

  @Patch(':id')
  @Roles(AppRole.ADMIN, AppRole.PROJECT_MANAGER)
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(AppRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/members')
  @Roles(AppRole.ADMIN, AppRole.PROJECT_MANAGER)
  async addMember(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.projectsService.addMember(id, body.userId);
  }

  @Delete(':id/members/:userId')
  @Roles(AppRole.ADMIN, AppRole.PROJECT_MANAGER)
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeMember(id, userId);
  }
}
```

**API Examples:**

```
GET /projects
Authorization: Bearer {access_token}

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "E-Commerce Platform",
    "key": "ECP",
    "description": "New e-commerce platform development",
    "template": "software-dev",
    "status": "active",
    "ownerId": {
      "_id": "507f191e810c19729de860ea",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "teamMembers": [...],
    "requirementCount": 45,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-10T00:00:00.000Z"
  }
]
```

---

### 3. Requirements Endpoints

```typescript
// src/requirements/requirements.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppRole } from '../users/schemas/user-role.schema';
import { RequirementsService } from './requirements.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { FilterRequirementDto } from './dto/filter-requirement.dto';

@Controller('requirements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequirementsController {
  constructor(private requirementsService: RequirementsService) {}

  @Get()
  async findAll(@Query() filterDto: FilterRequirementDto) {
    return this.requirementsService.findAll(filterDto);
  }

  @Get('search')
  async search(@Query('projectId') projectId: string, @Query('q') query: string) {
    return this.requirementsService.searchText(projectId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requirementsService.findOne(id);
  }

  @Post()
  @Roles(AppRole.BUSINESS_ANALYST, AppRole.PROJECT_MANAGER, AppRole.ADMIN)
  async create(@Body() createRequirementDto: CreateRequirementDto, @CurrentUser() user: any) {
    return this.requirementsService.create({ ...createRequirementDto, createdBy: user.userId });
  }

  @Patch(':id')
  @Roles(AppRole.BUSINESS_ANALYST, AppRole.PROJECT_MANAGER, AppRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateRequirementDto: UpdateRequirementDto, @CurrentUser() user: any) {
    return this.requirementsService.update(id, updateRequirementDto, user.userId);
  }

  @Delete(':id')
  @Roles(AppRole.ADMIN, AppRole.PROJECT_MANAGER)
  async remove(@Param('id') id: string) {
    return this.requirementsService.remove(id);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    return this.requirementsService.addAttachment(id, file, user.userId);
  }

  @Delete(':id/attachments/:attachmentId')
  async removeAttachment(@Param('id') id: string, @Param('attachmentId') attachmentId: string) {
    return this.requirementsService.removeAttachment(id, attachmentId);
  }
}
```

**API Examples:**

```
GET /requirements?projectId=507f1f77bcf86cd799439011&status=draft,in-review&priority=high
Authorization: Bearer {access_token}

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "reqId": "ECP-001",
    "projectId": "507f1f77bcf86cd799439011",
    "title": "User login functionality",
    "description": "Users should be able to log in with email and password",
    "type": "functional",
    "status": "in-review",
    "priority": "high",
    "acceptanceCriteria": [
      "User can enter email and password",
      "Invalid credentials show error message"
    ],
    "tags": ["authentication", "security"],
    "assigneeId": {...},
    "createdBy": {...},
    "attachments": [...],
    "createdAt": "2025-01-05T10:00:00.000Z",
    "updatedAt": "2025-01-10T11:00:00.000Z"
  }
]
```

```
POST /requirements
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439011",
  "title": "Password reset flow",
  "description": "Users should be able to reset forgotten passwords via email",
  "type": "functional",
  "priority": "high",
  "acceptanceCriteria": [
    "User clicks 'Forgot Password' link",
    "System sends reset email",
    "User can set new password via link"
  ],
  "tags": ["authentication", "email"]
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439013",
  "reqId": "ECP-002",
  "status": "draft",
  ...
}
```

---

### 4. Change Requests Endpoints

```typescript
// src/change-requests/change-requests.controller.ts
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppRole } from '../users/schemas/user-role.schema';
import { ChangeRequestsService } from './change-requests.service';

@Controller('change-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChangeRequestsController {
  constructor(private changeRequestsService: ChangeRequestsService) {}

  @Get()
  async findAll(@Query('projectId') projectId: string) {
    return this.changeRequestsService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.changeRequestsService.findOne(id);
  }

  @Post()
  async create(@Body() createChangeRequestDto: any, @CurrentUser() user: any) {
    return this.changeRequestsService.create({ ...createChangeRequestDto, requestedBy: user.userId });
  }

  @Patch(':id/approve')
  @Roles(AppRole.PROJECT_MANAGER, AppRole.ADMIN)
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.changeRequestsService.approve(id, user.userId);
  }

  @Patch(':id/reject')
  @Roles(AppRole.PROJECT_MANAGER, AppRole.ADMIN)
  async reject(@Param('id') id: string, @Body() body: { reason: string }, @CurrentUser() user: any) {
    return this.changeRequestsService.reject(id, body.reason, user.userId);
  }

  @Post(':id/impact-analysis')
  @Roles(AppRole.BUSINESS_ANALYST, AppRole.PROJECT_MANAGER, AppRole.ADMIN)
  async createImpactAnalysis(@Param('id') id: string, @Body() impactAnalysisDto: any, @CurrentUser() user: any) {
    return this.changeRequestsService.createImpactAnalysis(id, impactAnalysisDto, user.userId);
  }
}
```

---

### 5. Reviews & Sessions Endpoints

Similar pattern with controllers, services, and proper guards/decorators.

---

## Real-time Features

### WebSocket Gateway for Review Sessions

```typescript
// src/review-sessions/review-sessions.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class ReviewSessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeSessions = new Map<string, Set<string>>(); // sessionId -> Set of socketIds

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove from all sessions
    this.activeSessions.forEach((sockets, sessionId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.activeSessions.delete(sessionId);
      }
    });
  }

  @SubscribeMessage('join-session')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string; userName: string },
  ) {
    client.join(`session:${data.sessionId}`);
    
    if (!this.activeSessions.has(data.sessionId)) {
      this.activeSessions.set(data.sessionId, new Set());
    }
    this.activeSessions.get(data.sessionId).add(client.id);

    // Notify others
    this.server.to(`session:${data.sessionId}`).emit('user-joined', {
      userId: data.userId,
      userName: data.userName,
    });

    // Send current participants
    const participantCount = this.activeSessions.get(data.sessionId).size;
    this.server.to(`session:${data.sessionId}`).emit('participant-count', participantCount);
  }

  @SubscribeMessage('leave-session')
  handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string },
  ) {
    client.leave(`session:${data.sessionId}`);
    
    if (this.activeSessions.has(data.sessionId)) {
      this.activeSessions.get(data.sessionId).delete(client.id);
    }

    this.server.to(`session:${data.sessionId}`).emit('user-left', {
      userId: data.userId,
    });
  }

  @SubscribeMessage('cast-vote')
  handleVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; requirementId: string; vote: any },
  ) {
    // Broadcast to all in session
    this.server.to(`session:${data.sessionId}`).emit('vote-cast', data);
  }

  @SubscribeMessage('add-comment')
  handleComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; requirementId: string; comment: any },
  ) {
    this.server.to(`session:${data.sessionId}`).emit('comment-added', data);
  }

  @SubscribeMessage('next-requirement')
  handleNextRequirement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; index: number },
  ) {
    this.server.to(`session:${data.sessionId}`).emit('requirement-changed', data);
  }

  // Server-side method to emit from service
  emitToSession(sessionId: string, event: string, data: any) {
    this.server.to(`session:${sessionId}`).emit(event, data);
  }
}
```

### WebSocket JWT Guard

```typescript
// src/common/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## File Upload & Storage

### Multer Configuration

```typescript
// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|doc|docx)$/)) {
      return callback(new Error('Only image and document files are allowed!'), false);
    }
    callback(null, true);
  },
};
```

### AWS S3 Upload (Production)

```typescript
// src/uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async deleteFromS3(fileUrl: string): Promise<void> {
    const key = fileUrl.split('.com/')[1];
    await this.s3.deleteObject({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
    }).promise();
  }
}
```

---

## Validation & Error Handling

### Global Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
```

### DTO Validation Examples

```typescript
// src/requirements/dto/create-requirement.dto.ts
import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, MinLength, MaxLength } from 'class-validator';
import { RequirementType, Priority } from '../schemas/requirement.schema';

export class CreateRequirementDto {
  @IsMongoId()
  projectId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(RequirementType)
  type: RequirementType;

  @IsEnum(Priority)
  priority: Priority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  acceptanceCriteria?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsMongoId()
  @IsOptional()
  assigneeId?: string;
}
```

---

## Security Configuration

### Environment Variables

```bash
# .env.example
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/arep
MONGODB_TEST_URI=mongodb://localhost:27017/arep-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Frontend
FRONTEND_URL=http://localhost:3000

# AWS S3 (Production)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=arep-uploads

# Email (SendGrid/Nodemailer)
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=notifications@arep.app

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Helmet & Rate Limiting

```typescript
// src/main.ts additions
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // ... rest of configuration
}
```

---

## Deployment Guide

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: arep

  redis:
    image: redis:alpine
    ports:
      - '6379:6379'

  backend:
    build: .
    ports:
      - '3000:3000'
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/arep
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis

volumes:
  mongodb_data:
```

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up MongoDB indexes
- [ ] Configure AWS S3 for file storage
- [ ] Set up email service (SendGrid)
- [ ] Enable MongoDB authentication
- [ ] Use Redis for sessions/caching
- [ ] Set up logging (Winston/Pino)
- [ ] Configure PM2 for process management
- [ ] Set up monitoring (Datadog/New Relic)
- [ ] Enable HTTPS
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

---

## Additional Utilities

### Audit Logging Interceptor

```typescript
// src/common/interceptors/audit-logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    return next.handle().pipe(
      tap(() => {
        if (['POST', 'PATCH', 'DELETE'].includes(method)) {
          this.auditService.log({
            userId: user?.userId,
            action: method,
            entityType: this.extractEntityType(url),
            entityId: this.extractEntityId(url, body),
            changes: body,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }

  private extractEntityType(url: string): string {
    const parts = url.split('/');
    return parts[1]; // e.g., /requirements/123 -> requirements
  }

  private extractEntityId(url: string, body: any): string {
    const parts = url.split('/');
    return parts[2] || body?.id || 'unknown';
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-10  
**Stack**: NestJS + MongoDB + Mongoose  
**Maintainer**: Development Team
