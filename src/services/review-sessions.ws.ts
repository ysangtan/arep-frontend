// src/services/review-sessions.ws.ts
import { io, Socket } from 'socket.io-client';

/**
 * ---- Overview ----------------------------------------------------------
 * - Connects to your NestJS WebSocketGateway protected by WsJwtGuard
 * - Sends: join-session, leave-session, cast-vote, add-comment, next-requirement
 * - Receives: user-joined, user-left, participant-count, vote-cast, comment-added, requirement-changed
 * - Single shared socket with auto-reconnect + auth header
 * ------------------------------------------------------------------------
 */

/** Adjust this to however you store/retrieve your JWT */
function getAccessToken(): string | null {
  return localStorage.getItem('access_token') || null;
}

const WS_BASE_URL =
  // If you expose a dedicated WS URL, prefer it:
  import.meta?.env?.VITE_WS_URL ??
  // Otherwise reuse your API URL; socket.io uses HTTP(S) URL (not ws://) for handshake
  import.meta?.env?.VITE_API_URL ??
  // Fallback to same origin
  `${window.location.origin}`;

/** All gateway events used by the backend */
export type ReviewGatewayEvents =
  | 'user-joined'
  | 'user-left'
  | 'participant-count'
  | 'vote-cast'
  | 'comment-added'
  | 'requirement-changed';

export type VoteType = string; // e.g. 'approve' | 'reject' | 'abstain' — keep as string if backend enum is flexible

/** Payload shapes matching backend @MessageBody() contracts */
export interface JoinSessionPayload {
  sessionId: string;
  userId: string;
  userName: string;
}

export interface LeaveSessionPayload {
  sessionId: string;
  userId: string;
}

export interface CastVotePayload {
  sessionId: string;
  requirementId: string;
  voteType: VoteType;
  comment?: string;
}

export interface AddCommentPayload {
  sessionId: string;
  requirementId: string;
  comment: any; // keep wide; you can tighten to { text: string } if desired
}

export interface NextRequirementPayload {
  sessionId: string;
  index: number;
}

/** Event payloads received from the server */
export interface UserJoinedEvent {
  userId: string;
  userName: string;
}

export interface UserLeftEvent {
  userId: string;
}

export type ParticipantCountEvent = number;

export interface VoteCastEvent extends CastVotePayload {
  userId: string; // server includes the actual userId that cast the vote
}

export type CommentAddedEvent = AddCommentPayload;

export type RequirementChangedEvent = NextRequirementPayload;

type AnyHandler = (...args: any[]) => void;

/**
 * A small singleton wrapper around socket.io-client for this gateway.
 */
class ReviewSessionsWS {
  private socket: Socket | null = null;
  private listeners: Array<{ event: ReviewGatewayEvents | 'connect' | 'disconnect'; handler: AnyHandler }> = [];

  /** Connect (or reuse connection). Ensures JWT is sent to WsJwtGuard. */
  async connect(force = false): Promise<Socket> {
    if (this.socket && this.socket.connected && !force) {
      return this.socket;
    }

    if (this.socket && force) {
      try {
        this.socket.disconnect();
      } catch {/* noop */}
      this.socket = null;
    }

    const token = getAccessToken();
    this.socket = io(WS_BASE_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      timeout: 10000,
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
      // If your guard reads the token from query instead:
      // query: token ? { token } : undefined,
    });

    // Optional: log basic lifecycle
    this.socket.on('connect', () => {
      // console.log('[WS] connected', this.socket?.id);
    });
    this.socket.on('disconnect', (reason) => {
      // console.log('[WS] disconnected:', reason);
    });
    this.socket.on('connect_error', (err) => {
      // console.error('[WS] connect_error:', err);
    });

    return new Promise((resolve) => {
      if (this.socket?.connected) return resolve(this.socket);
      this.socket?.once('connect', () => resolve(this.socket as Socket));
    });
  }

  /** Disconnect and remove listeners */
  disconnect() {
    if (!this.socket) return;
    try {
      this.listeners.forEach(({ event, handler }) => this.socket?.off(event, handler));
      this.listeners = [];
      this.socket.disconnect();
    } finally {
      this.socket = null;
    }
  }

  /** Utility: ensure connection before emitting */
  private async ensure(): Promise<Socket> {
    return this.connect();
  }

  // ---- Emits (match backend @SubscribeMessage names) --------------------

  async joinSession(payload: JoinSessionPayload) {
    const s = await this.ensure();
    s.emit('join-session', payload);
  }

  async leaveSession(payload: LeaveSessionPayload) {
    const s = await this.ensure();
    s.emit('leave-session', payload);
  }

  async castVote(payload: CastVotePayload) {
    const s = await this.ensure();
    s.emit('cast-vote', payload);
  }

  async addComment(payload: AddCommentPayload) {
    const s = await this.ensure();
    s.emit('add-comment', payload);
  }

  async nextRequirement(payload: NextRequirementPayload) {
    const s = await this.ensure();
    s.emit('next-requirement', payload);
  }

  // ---- Subscriptions (on/once/off helpers) ------------------------------

  onUserJoined(handler: (e: UserJoinedEvent) => void) {
    this.on('user-joined', handler);
  }

  onUserLeft(handler: (e: UserLeftEvent) => void) {
    this.on('user-left', handler);
  }

  onParticipantCount(handler: (count: ParticipantCountEvent) => void) {
    this.on('participant-count', handler);
  }

  onVoteCast(handler: (e: VoteCastEvent) => void) {
    this.on('vote-cast', handler);
  }

  onCommentAdded(handler: (e: CommentAddedEvent) => void) {
    this.on('comment-added', handler);
  }

  onRequirementChanged(handler: (e: RequirementChangedEvent) => void) {
    this.on('requirement-changed', handler);
  }

  onConnect(handler: () => void) {
    this.on('connect', handler);
  }

  onDisconnect(handler: (reason: string) => void) {
    this.on('disconnect', handler);
  }

  /** Low-level: register a listener and remember to remove it on disconnect() */
  public on(event: ReviewGatewayEvents | 'connect' | 'disconnect', handler: AnyHandler) {
    if (!this.socket) {
      // attach after we connect
      this.connect().then(() => {
        this.socket?.on(event, handler);
      });
    } else {
      this.socket.on(event, handler);
    }
    this.listeners.push({ event, handler });
  }

  /** Remove a specific handler (optional utility) */
  off(event: ReviewGatewayEvents | 'connect' | 'disconnect', handler: AnyHandler) {
    this.socket?.off(event, handler);
    this.listeners = this.listeners.filter((l) => !(l.event === event && l.handler === handler));
  }
}

const ReviewSessionsWSService = new ReviewSessionsWS();
export default ReviewSessionsWSService;
