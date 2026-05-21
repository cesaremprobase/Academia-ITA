# Security Specification and Threat Model

## Data Invariants
1. **Separation of Roles**: Users are divided into "admin" and "student". Admins have full read/write privileges for courses. Students have strictly read-only access to courses.
2. **Self-Ownership of Progress**: Only the student owning the uid can view or edit their study progress document `/progress/{uid}`.
3. **Protected Auth Profiling**: Users can read other user profiles (for community display name/avatar), but can only write/modify their own profile `/users/{uid}`. They cannot escalate themselves to `'admin'`.
4. **Author Integrity**: For all community postings `/posts/{postId}` and `/posts/{postId}/comments/{commentId}`, the author IDs must strictly match the authenticated user Uid.
5. **Like Array Constraints**: Likes can only be customized via an updated state check, validating that students cannot reset or hijack everyone's like stamps.
6. **No Blanket Queries**: Query scraping without filters must be blocked.

---

## The "Dirty Dozen" Malicious Payloads

### 1. Self-Promote to Admin (ID & Role Spoof)
*   **Target**: `/admins/malicious_uid`
*   **Payload**: `{ "uid": "malicious_uid", "email": "hacker@gmail.com" }`
*   **Vector**: Attempting to write into `/admins/` to hijack system rights.

### 2. Escalation in User Profiles (Privilege Escalation)
*   **Target**: `/users/student_uid`
*   **Payload**: `{ "role": "admin", "displayName": "Sneaky Student" }` (on update)
*   **Vector**: Student trying to change their own role state from `'student'` to `'admin'`.

### 3. Rogue Course Creation (Student bypassing read-only limits)
*   **Target**: `/courses/new-course`
*   **Payload**: `{ "id": "new-course", "title": "Free A+ Grades", "lessons": [] }`
*   **Vector**: Unauthorized creation of study content.

### 4. Course Vandalism (Tampering)
*   **Target**: `/courses/vida-abundante`
*   **Payload**: `{ "videoUrl": "https://youtube.com/watch?v=malicious" }` (attempted update by Student)
*   **Vector**: Student editing official courses or changing lesson items.

### 5. Progress Snooping (PII Leak)
*   **Target**: `/progress/victim_uid`
*   **Operation**: `GET` (by `attacker_uid`)
*   **Vector**: Student accessing private grades/answers of other classmates.

### 6. Grade Tampering (Orphaned Progress Write)
*   **Target**: `/progress/victim_uid`
*   **Payload**: `{ "answers": { "guia-1": { "q1": ["Sumisión"] } }, "scores": { "guia-1": { "score": 100, "total": 100 } } }` (written by `attacker_uid`)
*   **Vector**: Forcing answers/grades on another user's behalf.

### 7. Fake Author Post (Identity Spoofing)
*   **Target**: `/posts/evil-post-1`
*   **Payload**: `{ "id": "evil-post-1", "authorId": "victim_uid", "authorName": "Victim User", "content": "I am bad...", "createdAt": "request.time" }`
*   **Vector**: Publishing posts on behalf of another student.

### 8. Thread Deletion / Hijack
*   **Target**: `/posts/victim-post-abc`
*   **Operation**: `DELETE` or `UPDATE` (by `attacker_uid`)
*   **Vector**: Deleting or editing another student's community post.

### 9. Denials of Wallet via Giant Post ID Space (Poisoning)
*   **Target**: `/posts/very_long_garbage_id_of_length_1000`
*   **Payload**: `{ "id": "very_long_garbage_id_of_length_1000", ... }`
*   **Vector**: Exhausting key sizes in Firestore.

### 10. Hijacking All Likes (Array Poisoning)
*   **Target**: `/posts/post-xyz`
*   **Payload**: `{ "likes": ["victim_uid", "attacker_uid", "random_extra"] }`
*   **Vector**: Student resetting or populating likes array arbitrarily instead of append/remove of self.

### 11. Hijacking Comment Identity (Comment Impersonation)
*   **Target**: `/posts/post-xyz/comments/comment-abc`
*   **Payload**: `{ "id": "comment-abc", "postId": "post-xyz", "authorId": "victim_uid", "content": "Fake comment!" }`
*   **Vector**: Student writing a comment pretending to be a victim.

### 12. List Scraping Attack (Blanket query scraping)
*   **Target**: `/users` or `/progress`
*   **Operation**: Unsecured `list` retrieval without filters.
*   **Vector**: Compiling the database roster of emails/identities.

---

## Test Verification Plans
Every command and payload listed here must yield `PERMISSION_DENIED` under strict Firestore access rules. We map these guards in `firestore.rules`.
