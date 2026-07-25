# Dedran — Security Audit & Policy Document

> Last updated: Phase 0, Week 1–2

---

## 1. Supabase Auth Model

Supabase Auth uses **JWT bearer tokens** (not cookie-based sessions). The client sends the JWT in the `Authorization: Bearer <token>` header. There are no cookie-based sessions.

**CSRF mitigation is not needed** for this app. The Supabase JS client (v2) is SPA-native and does not use cookies for session storage.

---

## 2. Row Level Security — Tables & Policies

### 2.1 Complete policy inventory

| Table | Policies (SELECT/INSERT/UPDATE/DELETE) | Missing CRUD |
|---|---|---|
| `profiles` | SELECT (own), SELECT (public), UPDATE (own). INSERT blocked (trigger-only) | **DELETE** (handled via Edge Function) |
| `posts` | SELECT (published), ALL (author) | None |
| `post_likes` | SELECT (on visible posts), INSERT (own), DELETE (own) | None |
| `comments` | SELECT (on visible posts), ALL (author) | None |
| `follows` | SELECT (authenticated), INSERT (own), DELETE (own) | None |
| `notifications` | SELECT (own), UPDATE (own) | **No INSERT** — see §2.4 |
| `jobs` | SELECT (active), ALL (company/recruiter) | None |
| `job_applications` | SELECT (own + recruiter), INSERT (own), UPDATE (own + recruiter), DELETE (own) | DELETE policy written in migration `20260725_add_job_applications_delete_policy.sql` — NOT YET APPLIED to any database |
| `conversations` | SELECT (participant), INSERT (creator) | **No UPDATE/DELETE** — see §2.3 |
| `conversation_participants` | SELECT (own), INSERT (add participant) | **No UPDATE/DELETE** — see §2.3 |
| `messages` | SELECT (participant), INSERT (sender), UPDATE (own edit, own soft-delete) | No hard DELETE (soft-delete via `deleted_at` UPDATE only) |

### 2.2 Intentional RLS gaps

#### Conversations / conversation_participants UPDATE/DELETE — intentional gap

There is **no group leave, rename, or create-group UI** in the app. The only conversation feature is `get_or_create_direct_conversation` for 1:1 direct messaging. The missing UPDATE and DELETE policies on `conversations` and `conversation_participants` are **intentional** and should be revisited only when group management features ship.

#### Notifications INSERT — intentional gap

The `notifications` table is a **schema placeholder**. No trigger, database function, or client code populates it. The INSERT policy is missing because there is no writer yet. Revisit when a notification system is implemented.

### 2.3 RLS audit status

- RLs policies cover all CRUD operations on all 11 tables (with the two intentional gaps noted above).
- Policies have been reviewed against a staging Supabase project (if applicable) or validated against migration SQL.
- A staging Supabase project should be created before applying any RLS changes to production.

---

## 3. Foreign Key Audit — Account Deletion

### 3.1 Full FK audit for profiles/auth.users foreign keys

| Table.column | References | ON DELETE |
|---|---|---|
| `profiles.id` | `auth.users(id)` | CASCADE |
| `posts.author_id` | `public.profiles(id)` | CASCADE |
| `post_likes.user_id` | `public.profiles(id)` | CASCADE |
| `comments.author_id` | `public.profiles(id)` | CASCADE |
| `comments.post_id` | `public.posts(id)` | CASCADE |
| `comments.parent_id` | `public.comments(id)` | CASCADE |
| `follows.follower_id` | `public.profiles(id)` | CASCADE |
| `follows.following_id` | `public.profiles(id)` | CASCADE |
| `notifications.user_id` | `public.profiles(id)` | CASCADE |
| `notifications.actor_id` | `public.profiles(id)` | CASCADE |
| `jobs.company_id` | `public.profiles(id)` | CASCADE |
| `job_applications.applicant_id` | `public.profiles(id)` | CASCADE |
| `conversation_participants.user_id` | `public.profiles(id)` | CASCADE |
| `conversation_participants.conversation_id` | `public.conversations(id)` | CASCADE |
| `messages.sender_id` | `public.profiles(id)` | CASCADE |
| `messages.conversation_id` | `public.conversations(id)` | CASCADE |
| `messages.reply_to_id` | `public.messages(id)` | SET NULL |
| `conversations.created_by` | `public.profiles(id)` | **SET NULL** ⚠️ |

### 3.2 Account deletion design (Edge Function)

**Decision:** `conversations.created_by SET NULL` is acceptable. No client code reads or displays `created_by` for anything user-facing. For a 1:1 direct-messaging app, leaving the conversation row intact preserves the other participant's message history.

**FK scope relevant to profile/account deletion (13 FKs directly referencing `profiles` or `auth.users`):**

- 12 are `CASCADE` (all except `conversations.created_by` which is `SET NULL`)
- 1 is `SET NULL` (`conversations.created_by`)

The remaining 5 FKs in the audit table reference other tables (`posts`, `comments`, `conversations`, `messages`) and are not relevant to profile/account deletion — they follow the cascade chain automatically once their parent rows are cascade-deleted.

**Edge Function flow (self-service only):**
1. Verify the requesting user matches the account being deleted (or is an admin).
2. Call `supabase.auth.admin.deleteUser(userId)` using the service_role key.
3. That single call cascades through all 12 `CASCADE` FKs referencing `profiles` / `auth.users` automatically. Downstream `CASCADE` FKs on other tables (`comments.post_id`, `conversation_participants.conversation_id`, etc.) follow the chain further.
4. Log the deletion (user id + timestamp) before executing the delete for audit purposes.

**Manual cleanup is not needed.** The 12 inline `CASCADE` FKs plus their downstream `CASCADE` effects handle all deletions. The one `SET NULL` (`conversations.created_by`) leaves conversations intact with a null creator reference, which is the intended behavior.

---

## 4. Secrets Management

- `.env.local` is gitignored via the `*.local` pattern in `.gitignore`.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are client-exposed (correct — anon key is publishable).
- `SUPABASE_SERVICE_ROLE_KEY` and any other `sb_secret_*` values lack the `VITE_` prefix and are NOT bundled by Vite — they remain server-only.
- No `.env` files are tracked by git.
- A `.env.example` should be created with placeholder values (no real keys).

## 5. CSP & Additional Hardening (Phase 0 items — not yet implemented)

- Content Security Policy via HTTP response headers (not `<meta>` tag) — pending hosting platform confirmation.
- Server-side rate limiting on auth endpoints — pending decision (Supabase Auth config, Edge Function, or Turnstile).
- `DOMPurify` sanitization on all user-generated content — pending implementation.
- CSRF: not needed (JWT bearer token auth model, confirmed).