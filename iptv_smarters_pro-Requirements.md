# IPTV Smarters Pro — Comprehensive Functional & Engineering Requirements Baseline
## Research-enriched requirements specification for OppoIPTV compatibility

**Document type:** Requirements baseline / capability reference  
**Purpose:** Define the functional capability envelope that an IPTV client comparable in scope to IPTV Smarters Pro should support, while allowing OppoIPTV to implement the capabilities with its own identity, UX, architecture, terminology, and technology choices.

> **Important source classification**
>
> This document is **not an official IPTV Smarters Pro specification** and does not claim access to proprietary source code or private documentation. Requirements explicitly attributed to Smarters-style capability coverage are treated as a **capability baseline**, while Samsung/Tizen constraints are grounded in Samsung's current public developer documentation. Any feature not independently confirmed by an authoritative source is marked `DERIVED` or `UNKNOWN` rather than presented as an official product fact.

---

# 1. Scope

## 1.1 Product category

The target is a TV-first IPTV client capable of consuming legally authorized IPTV/media services supplied by the user or service operator.

The application shall provide a unified experience for:

- Live TV
- Electronic Program Guide (EPG)
- Video on Demand (VOD)
- TV series
- Favorites
- Search
- Recently watched / continue watching
- Playback controls
- Subtitles and audio tracks where supplied
- Multi-profile / multi-provider capability where supported by product policy
- Local application settings
- Provider/account management
- Error handling and diagnostics

## 1.2 Identity rule

The implementation shall **not clone proprietary branding, source code, visual identity, copyrighted assets, or private implementation details** of IPTV Smarters Pro.

OppoIPTV shall implement the required capability set as an independent product.

---

# 2. Evidence and Requirement Classification

Every requirement in the downstream OppoIPTV plan shall use one of:

- `VERIFIED` — supported by an authoritative source available to the project.
- `DERIVED` — logically necessary or strongly implied by a verified requirement.
- `MISSING` — required for a defined capability but absent from the current implementation.
- `CONFLICT` — two authoritative project requirements disagree.
- `UNKNOWN` — evidence is insufficient.

No `UNKNOWN` requirement may be silently converted into a mandatory implementation decision.

---

# 3. Samsung TV Platform Baseline

## 3.1 Target devices

Primary target:

- Samsung Smart TVs 2024 and newer.
- 2024 baseline: Tizen 8.0.
- 2025 baseline: Tizen 9.0.
- 2026 baseline: Tizen 10.0.

Samsung documents that TV OS capabilities can change with OS upgrades, so compatibility shall be capability-driven rather than based only on model year.

**Status:** `VERIFIED`

## 3.2 Resolution

The application shall support a 16:9 TV presentation.

Design baseline:

- Application coordinate space: 1920×1080.
- UHD panel output: 3840×2160 where applicable.
- UI assets shall remain crisp and appropriately scaled.
- Layouts shall not depend on a single physical panel resolution.

Samsung's guidance identifies 1920×1080 as the standard application resolution for UHD TV application design, while the physical display may be 3840×2160.

**Status:** `VERIFIED`

## 3.3 Web engine

The architecture shall remain compatible with Samsung's TV Web engine for the supported target generations.

2024 Tizen 8.0 uses Chromium M108 according to Samsung's current specification.

**Status:** `VERIFIED`

## 3.4 Tizen packaging

The project shall provide:

- `config.xml`
- Stable package/application identity
- Required privileges only
- Valid signing configuration for release
- Debug/development signing workflow
- Production signing workflow
- Repeatable WGT packaging
- Installation and launch verification

Samsung states that Tizen applications require valid certificates before installation or execution.

**Status:** `VERIFIED`

---

# 4. Core IPTV Input Methods

## 4.1 M3U / M3U8 playlist

The client shall support ingestion of authorized M3U/M3U8 playlist sources.

Capabilities:

- URL-based playlist loading
- Local/imported playlist where platform policy permits
- UTF-8 handling
- Extended M3U attributes
- Channel metadata extraction
- Group/category extraction
- Logo URL extraction
- EPG identifiers where present
- Stream URL extraction
- Robust malformed-line handling
- Duplicate detection
- Stable item identifiers

**Status:** `DERIVED / REQUIRED CAPABILITY`

## 4.2 Xtream-style account API

The client should support the common IPTV account model consisting of:

- Server/base URL
- Username
- Password
- Live categories
- Live streams
- VOD categories
- VOD items
- Series categories
- Series
- Episodes
- EPG
- Account status
- Expiration information when supplied by provider

The implementation shall not assume every provider exposes every endpoint.

**Status:** `DERIVED**

## 4.3 Provider abstraction

All provider integrations shall pass through a provider-neutral domain contract.

Example conceptual interfaces:

- `ProviderConnection`
- `LiveCatalogProvider`
- `VodCatalogProvider`
- `SeriesCatalogProvider`
- `EpgProvider`
- `PlaybackSourceProvider`
- `ProviderHealthProvider`

This prevents provider-specific assumptions from contaminating the UI.

---

# 5. Provider Onboarding

## 5.1 Add provider

User shall be able to add a provider using the supported authentication/input method.

Required fields shall be validated before connection.

## 5.2 Connection validation

The application shall:

1. Validate local input.
2. Normalize the provider URL.
3. Attempt connection.
4. Detect HTTP/network failures.
5. Validate response shape.
6. Detect authentication failures.
7. Store provider only after successful validation unless explicitly saving an offline profile.

## 5.3 Provider state

Provider states shall include at minimum:

- `NEW`
- `CONNECTING`
- `ACTIVE`
- `OFFLINE`
- `AUTH_FAILED`
- `EXPIRED`
- `INVALID_CONFIGURATION`
- `DISABLED`

---

# 6. Live TV

## 6.1 Live catalog

The client shall display:

- Categories
- Channels
- Channel names
- Logos when available
- Favorite state
- Current/next program where EPG is available
- Stream availability state where detectable

## 6.2 Channel playback

The user shall be able to:

- Start playback
- Pause where supported
- Resume where supported
- Stop
- Seek where the stream supports seeking
- Change audio track where available
- Change subtitle track where available
- View channel information
- Navigate to previous/next channel
- Add/remove favorite
- Return to catalog without losing navigation state

## 6.3 Live zapping

A TV-first client should minimize channel switching latency.

Requirements:

- Precompute lightweight channel metadata.
- Avoid reloading the entire catalog on each channel switch.
- Preserve current category/filter.
- Reuse media resources where safe.
- Show deterministic buffering state.

---

# 7. Electronic Program Guide

## 7.1 EPG ingestion

The application shall support EPG data when supplied by the provider.

Supported concepts:

- Channel identifier
- Program title
- Description
- Start time
- End time
- Duration
- Program category
- Episode/season metadata where supplied

## 7.2 Time handling

EPG processing shall:

- Normalize timestamps.
- Handle timezone offsets.
- Avoid applying device-local timezone twice.
- Handle missing timezone metadata explicitly.
- Detect stale EPG data.

## 7.3 EPG UI

The EPG shall provide:

- Current time indicator
- Channel rows
- Program blocks
- Current program emphasis
- Program details
- Navigation by remote
- Category filtering
- Channel selection
- Jump-to-current-time
- Optional timeline scaling

## 7.4 EPG performance

Large EPG datasets shall not be rendered as one unbounded DOM tree.

Use:

- Virtualization
- Windowed rendering
- Incremental data processing
- Cached normalized EPG records

---

# 8. Video on Demand

## 8.1 VOD catalog

VOD shall support:

- Categories
- Posters
- Titles
- Year
- Genre
- Rating when supplied
- Description
- Duration where supplied
- Cast/director metadata where supplied
- Favorite state
- Watch state

## 8.2 VOD detail

A title detail view should expose:

- Poster/backdrop
- Title
- Description
- Metadata
- Available audio/subtitle information
- Play action
- Resume action
- Favorite action
- Related content

---

# 9. Series

## 9.1 Series catalog

Support:

- Series categories
- Series posters
- Series metadata
- Seasons
- Episodes

## 9.2 Episode detail

Episode records should support:

- Season
- Episode number
- Title
- Plot
- Duration
- Thumbnail
- Playback source
- Watched state
- Resume position

## 9.3 Next episode

Where reliable episode ordering exists, the application should provide:

- Continue episode
- Next episode action
- Optional post-playback next episode prompt

The behavior must remain configurable and must never trap the user in automatic playback.

---

# 10. Search

Search shall cover the unified content domain:

- Live channels
- VOD
- Series
- Episodes
- EPG programs when indexed

Requirements:

- Remote-friendly input
- Debounced search
- Incremental results
- Search history
- Clear history
- Empty state
- Error state
- Result categories
- Deterministic focus behavior

---

# 11. Favorites

Favorites shall support:

- Live channels
- VOD titles
- Series
- Optional EPG programs

Requirements:

- Add
- Remove
- Persistent storage
- Deduplication
- Fast retrieval
- Provider-aware identity

A favorite from Provider A must not accidentally resolve to an identically named item from Provider B.

---

# 12. Recently Watched / Continue Watching

The client shall persist:

- Content identifier
- Provider identifier
- Playback position
- Duration
- Last watched timestamp
- Completion state

Rules:

- Resume only when a valid position exists.
- Do not resume near the natural end of content.
- Never expose corrupted resume positions.
- Provider changes must not collide identifiers.

---

# 13. Playback Engine

## 13.1 Platform strategy

For Samsung TV, the playback architecture shall use the appropriate platform capability.

Samsung documents that HTML5 media can handle common formats, while AVPlay provides additional functionality such as adaptive streaming, subtitle formats, and 4K UHD playback.

**Status:** `VERIFIED`

## 13.2 Playback state machine

Minimum states:

```text
IDLE
LOADING
READY
PLAYING
PAUSED
BUFFERING
SEEKING
STOPPING
STOPPED
ERROR
RECOVERING
RESOURCE_CONFLICT
```

Invalid state transitions shall be rejected.

## 13.3 Playback lifecycle

The engine shall implement:

- Open
- Prepare
- Play
- Pause
- Resume
- Seek
- Stop
- Close
- Suspend
- Restore
- Error
- Recovery

Resource cleanup is mandatory on:

- Route change
- Application suspension
- Playback replacement
- Fatal playback error
- Application termination

## 13.4 Recovery

Recovery shall use bounded retries.

A retry policy shall define:

- Maximum attempts
- Backoff
- Retryable errors
- Non-retryable errors
- User-visible failure state

Never retry authentication errors indefinitely.

---

# 14. Media Compatibility

The implementation shall use Samsung's target-device media compatibility matrix rather than assuming arbitrary codec support.

For 2024 Samsung TVs, Samsung documents broad support for formats including H.264, HEVC/H.265, AV1 and common containers, with model-group-specific limitations.

**Status:** `VERIFIED`

The application shall detect and report unsupported or stalled media rather than presenting an infinite loading state.

---

# 15. Subtitles

Where provider/media/platform support exists:

- External subtitle tracks
- Embedded subtitle tracks
- Subtitle enable/disable
- Track selection
- Subtitle language display
- Subtitle synchronization where technically supported

Subtitle rendering must be tested on real target hardware.

---

# 16. Audio Tracks

Where media exposes multiple audio tracks:

- Enumerate tracks
- Display language/label
- Switch track
- Persist user preference where safe

Do not assume a provider's language metadata is correct.

---

# 17. Picture-in-Picture / Multiview

These features shall be classified as capability-dependent.

The product must not advertise support merely because a similar IPTV application provides it.

For each target Samsung model/OS combination:

`SUPPORTED → ENABLE`

`UNSUPPORTED → HIDE / DISABLE`

`UNKNOWN → DO NOT CLAIM`

---

# 18. Multi-Screen / Multi-View

A multi-view experience may be implemented only if:

- Samsung platform capability permits it.
- Decoder/resource limits permit it.
- UI remains controllable with the remote.
- Performance remains within target budgets.

A four-stream layout shall not be assumed to be universally possible.

---

# 19. User Profiles

If enabled by OppoIPTV product scope:

Profiles shall have:

- Name
- Avatar
- Language
- Playback preferences
- Favorite data
- History
- Provider associations
- Parental settings where implemented

Profile data must remain isolated.

---

# 20. Parental Controls

If implemented:

- PIN protection
- Protected categories/content
- Lock state
- Session timeout
- Secure PIN storage

The PIN must never be stored in plaintext.

---

# 21. Settings

Minimum settings areas:

- Application language
- Theme
- Playback behavior
- Subtitle preference
- Audio preference
- EPG timezone behavior
- Auto-start behavior
- Buffering/recovery preferences where exposed
- Provider management
- Clear cache
- Clear history
- Diagnostics
- About
- Legal/privacy information

---

# 22. Remote-First UX

Samsung identifies the remote control as the main interaction method for TV applications.

Therefore:

- Every actionable element must be reachable by directional keys.
- Focus must always be visible.
- Focus must never disappear after Back.
- Back must return to the previous logical surface.
- Long press behavior must be defined where supported.
- Playback keys must have deterministic behavior.
- Loading must not lock the remote.
- Dialogs must trap focus correctly.
- Escape/Back must close transient UI before leaving the page.

**Status:** `VERIFIED`

---

# 23. Focus Management

The application shall implement a centralized focus/navigation model.

Requirements:

- Focus registry
- Focus restoration
- Directional navigation
- Modal focus trapping
- Route focus memory
- Grid navigation
- List navigation
- Playback overlay navigation

No screen may implement ad-hoc focus rules without documented justification.

---

# 24. Samsung UX Compliance

The UI shall be reviewed against Samsung Smart TV UX guidance.

Important requirements include:

- Clear selectable objects
- Directional navigation
- Grid alignment
- Consistent UI patterns
- Controlled motion
- Scroll indicators where required
- Correct playback controls
- Appropriate visual hierarchy

**Status:** `VERIFIED`

---

# 25. Visual Design System

OppoIPTV shall have its own design system.

Required tokens:

- Colors
- Typography
- Spacing
- Radii
- Elevation
- Focus ring
- Motion
- Component states
- Iconography

The design system shall not reproduce IPTV Smarters Pro's exact visual identity.

---

# 26. Responsive TV Layout

Support:

- 1920×1080 logical UI
- 3840×2160 physical output
- 16:9
- Safe margins
- Overscan-safe interaction
- Large readable typography
- Remote-distance readability

Samsung recommends 1920×1080 application design for UHD TV applications.

---

# 27. Accessibility

Requirements:

- Sufficient contrast
- Visible focus
- Reduced-motion mode
- No color-only status indicators
- Readable typography
- Clear error messaging
- Logical navigation order
- Large touch-independent targets suitable for remote interaction

---

# 28. Networking

The networking layer shall provide:

- Request timeout
- Retry policy
- Cancellation
- Connection status
- HTTP error classification
- JSON validation
- Rate limiting/backoff
- Cache policy
- Offline behavior
- Provider isolation

No request may hang indefinitely.

---

# 29. Caching

Cache categories:

- Provider metadata
- Categories
- Catalog pages
- EPG
- Images
- User preferences
- Resume positions

Cache entries shall define:

- TTL
- Version
- Provider scope
- Schema version
- Invalidation strategy

---

# 30. Image System

Image loading shall support:

- Lazy loading
- Placeholder
- Error fallback
- Cache
- Resolution selection
- Backdrop/poster variants
- Memory-aware eviction

Samsung's memory guidance specifically recommends careful image/graphics memory management and virtualization for TV Web applications.

**Status:** `VERIFIED`

---

# 31. Performance Requirements

Target budgets shall be established and measured.

Examples:

- Cold launch: measurable and bounded.
- Home interaction: no perceptible blocking.
- Navigation: focus transition shall remain responsive.
- Catalog rendering: virtualized for large datasets.
- Playback UI: must not cause decoder interruption.
- Memory: monitored during long sessions.

Exact numerical budgets shall be finalized through target-device profiling rather than invented as universal Samsung limits.

---

# 32. Memory Management

The application shall prevent:

- Unbounded DOM growth
- Image cache explosion
- Event listener leaks
- Timer leaks
- Media decoder leaks
- Detached component retention
- Provider cache duplication

Long-session tests are mandatory.

---

# 33. Security

Requirements:

- Never log provider passwords.
- Never expose credentials in analytics.
- Use secure storage where available.
- Validate remote content.
- Avoid arbitrary code execution.
- Avoid unsafe HTML injection.
- Restrict network permissions to required capabilities.
- Protect diagnostic exports.
- Redact credentials from logs.

---

# 34. Privacy

The product shall define:

- Data collected
- Data stored locally
- Data transmitted
- Diagnostics behavior
- Analytics behavior
- Retention
- Deletion
- User controls

No telemetry shall be introduced silently.

---

# 35. Diagnostics

Diagnostics shall provide:

- Application version
- Platform version
- Tizen version
- Device capability summary
- Provider status
- Network state
- Playback state
- Last error
- Sanitized logs

Sensitive data must be redacted.

---

# 36. Error Taxonomy

Minimum error domains:

```text
NETWORK
AUTHENTICATION
PROVIDER
CATALOG
EPG
PLAYBACK
DECODER
RESOURCE
STORAGE
PARSING
CONFIGURATION
PLATFORM
SECURITY
UNKNOWN
```

Every user-visible error should have:

- Stable error code
- Technical classification
- User-safe message
- Diagnostic context
- Recovery action where possible

---

# 37. Offline and Degraded Operation

The application shall degrade gracefully.

Examples:

- Cached catalog remains viewable when provider is temporarily offline.
- Favorites remain available.
- History remains available.
- Provider refresh failure does not corrupt local state.
- EPG failure does not block Live TV.

---

# 38. Data Model

Core entities:

- Provider
- Account
- Category
- Channel
- Program
- VodItem
- Series
- Season
- Episode
- Favorite
- WatchProgress
- Profile
- PlaybackSession
- DiagnosticEvent

Every external entity shall be normalized into an internal domain model.

---

# 39. Stable Identity

Entity IDs shall be provider-scoped.

Concept:

```text
providerId + externalId + entityType
```

Never use display name as the primary identity.

---

# 40. State Management

State shall be separated into:

- Domain state
- UI state
- Navigation state
- Playback state
- Network state
- Persistence state

Global state must not become an unbounded dumping ground.

---

# 41. Persistence

Persistence must be versioned.

Required:

- Schema version
- Migration system
- Corruption recovery
- Atomic writes where possible
- Reset capability
- Provider-scoped records

---

# 42. Localization

The product should support:

- English
- Arabic
- RTL
- Additional languages through locale resources

RTL requirements:

- Mirrored navigation where appropriate
- Correct text alignment
- Numeral handling
- EPG layout validation
- No hard-coded directional assumptions

---

# 43. Content Metadata

The domain shall tolerate missing metadata.

For every optional field:

- `present`
- `absent`
- `invalid`

must be handled explicitly.

The UI must not crash because poster, logo, plot, EPG, genre, or rating is missing.

---

# 44. Search Indexing

Search architecture should support incremental indexing.

Avoid blocking the UI while indexing large catalogs.

Potential strategies:

- Normalized in-memory index
- Worker-assisted processing where supported
- Incremental batches
- Prefix/token indexing

Implementation must be validated against Samsung Web engine constraints.

---

# 45. Catalog Pagination

Providers may return large catalogs.

The client shall support:

- Pagination
- Incremental loading
- Lazy images
- Virtualized grids
- Retry per page
- Partial failure handling

---

# 46. Provider Refresh

Refresh shall be:

- Explicitly user-triggerable
- Background where platform/product policy permits
- Cancelable
- Observable
- Non-destructive

A failed refresh must not delete a previously valid catalog.

---

# 47. Playback UX

Playback overlay should expose, where supported:

- Play/pause
- Seek
- Progress
- Audio
- Subtitles
- Channel/program information
- Favorites
- Next/previous
- Exit/back

The overlay must auto-hide without removing logical focus unexpectedly.

---

# 48. Live Playback Specifics

Live playback shall distinguish:

- Live edge
- Timeshifted playback
- VOD-like seekable live streams

The application shall not show a seek bar for genuinely non-seekable streams.

---

# 49. VOD Resume

Resume rules shall be configurable.

Recommended behavior:

- Resume if progress is meaningful.
- Offer restart.
- Clear progress after completion.
- Persist periodically without excessive storage writes.

---

# 50. Series Resume

Episode-level progress shall be independent.

The system should be able to determine:

- Current episode
- Last watched episode
- Next episode
- Completed episodes

Only when source ordering is reliable.

---

# 51. Content Sorting

Supported sort dimensions should include as applicable:

- Name
- Recently added
- Year
- Rating
- Recently watched
- Custom provider order

Sorting must be deterministic.

---

# 52. Filtering

Filtering should support applicable dimensions such as:

- Category
- Genre
- Language
- Country
- Favorites
- Watched/unwatched

Unknown metadata must not cause filters to hide valid content unexpectedly.

---

# 53. Favorites Synchronization

If provider synchronization is not available:

- Favorites remain local.

If synchronization is implemented:

- Conflict rules must be explicit.
- Local data must not be overwritten silently.

---

# 54. Application Lifecycle

Handle:

- Launch
- Resume
- Background/suspend
- Restore
- Exit
- Network changes
- Display changes where exposed
- Media resource conflicts

Samsung TV applications have platform-specific media/resource lifecycle constraints, so playback must be coordinated with application visibility.

---

# 55. Media Resource Conflicts

The playback layer shall detect and recover from decoder/resource conflicts where platform APIs expose them.

Policy:

1. Stop/pause safely.
2. Release resources.
3. Record diagnostic event.
4. Attempt bounded restoration if appropriate.
5. Show actionable error if restoration fails.

---

# 56. Testing Strategy

Testing layers:

1. Unit
2. Domain
3. Integration
4. Contract
5. Component
6. UI navigation
7. Playback
8. Performance
9. Memory
10. Security
11. Accessibility
12. Samsung device validation
13. Release package validation

---

# 57. TDD Requirements

Critical domain behavior shall have tests before or alongside implementation.

Mandatory areas:

- Playlist parser
- Provider normalization
- Entity identity
- EPG timezone handling
- Favorites
- Watch progress
- Navigation
- Playback state machine
- Error classification

---

# 58. BDD Requirements

Acceptance scenarios shall cover:

- Add provider
- Browse live channels
- Play channel
- Open EPG
- Browse VOD
- Play VOD
- Resume VOD
- Browse series
- Play episode
- Search
- Favorite
- Recover network failure
- Recover playback failure
- Return navigation

---

# 59. Samsung Device Testing

Testing shall include real target hardware.

Minimum target matrix:

- Samsung 2024 Tizen 8.0
- Samsung 2025 Tizen 9.0 where available
- Samsung 2026 Tizen 10.0 where available

Test both:

- 1920×1080 application coordinate system
- 3840×2160 physical UHD panels

Emulator testing is not a substitute for hardware validation.

---

# 60. Remote Control Acceptance

Test:

- Up
- Down
- Left
- Right
- Enter
- Back
- Exit
- Play
- Pause
- Stop
- Rewind
- Fast-forward
- Channel navigation where applicable

Samsung documents the supported remote key model and special key behavior.

---

# 61. Build System

The project shall provide:

- Reproducible install
- Dependency lockfile
- Lint
- Type check
- Unit tests
- Production build
- Tizen package
- Package validation
- Artifact hashing

---

# 62. CI/CD

CI shall execute:

```text
install
→ lint
→ typecheck
→ unit tests
→ integration tests
→ build
→ static audit
→ package validation
→ artifact generation
```

Release CI shall additionally enforce:

- Versioning
- Signing policy
- Artifact checksum
- Release notes
- Evidence archive

---

# 63. AI Engineering Automation

AI agents shall operate under:

- Constitution
- Requirements
- Specification
- Task graph
- Repository policy
- Verification gates

Agent lifecycle:

```text
Discover
→ Clarify
→ Specify
→ Plan
→ Task
→ Implement
→ Test
→ Verify
→ Repair
→ Re-verify
→ Evidence
```

AI must never mark a task complete merely because code was generated.

---

# 64. Autonomous Worker Requirements

An autonomous worker shall have:

- Repository context
- Requirements context
- Current task
- Allowed files
- Forbidden operations
- Acceptance criteria
- Verification commands
- Evidence output
- Retry budget
- Escalation rule

Unknowns must be surfaced rather than fabricated.

---

# 65. Requirement Traceability

Every major requirement must map:

```text
REQ
→ CAPABILITY
→ DOMAIN
→ SPEC
→ TASK
→ CODE AREA
→ TEST
→ EVIDENCE
```

Or explicitly record why a mapping is not currently possible.

---

# 66. Definition of Done

A requirement is complete only when:

- Implemented
- Tested
- Integrated
- Reviewed by automated checks
- Verified against acceptance criteria
- No known blocker remains
- Evidence exists
- Traceability is updated

---

# 67. Release Gates

A release is blocked by:

- Failing tests
- Type errors
- Broken package
- Invalid Tizen configuration
- Missing signing
- Critical playback failures
- Focus/navigation failures
- Memory leaks
- Credential exposure
- Severe performance regression
- Unresolved security issue

---

# 68. Observability

Production diagnostics should measure, where permitted:

- Startup timing
- Provider connection success/failure
- Catalog load timing
- Playback startup
- Playback error classes
- Recovery attempts
- Memory warnings

Telemetry must respect privacy policy.

---

# 69. Compatibility Philosophy

Do not implement feature detection as:

```text
if modelYear >= X
```

Prefer:

```text
capability = detectCapability()
```

Then select:

```text
SUPPORTED
DEGRADED
UNSUPPORTED
UNKNOWN
```

This is especially important because Samsung documents OS upgrades for supported TV generations.

---

# 70. Legal and Content Responsibility

OppoIPTV shall be a neutral playback/client application.

The product shall not:

- Provide unauthorized channels.
- Facilitate credential theft.
- Circumvent DRM.
- Circumvent provider access controls.
- Distribute copyrighted media without authorization.

User-provided/provider-provided content is outside the application's control and must be governed by applicable law and provider authorization.

---

# 71. Non-Functional Requirements

The product shall be:

- Reliable
- Maintainable
- Testable
- Observable
- Secure
- Performant
- Recoverable
- Localizable
- TV-first
- Remote-first
- Upgradeable

---

# 72. Architecture Constraints

Recommended bounded contexts:

```text
Identity
Provider
Catalog
LiveTV
EPG
VOD
Series
Search
Favorites
History
Playback
Settings
Diagnostics
Platform
```

No UI module should directly depend on provider-specific HTTP response formats.

---

# 73. Integration Contracts

External provider adapters shall normalize external responses into internal contracts.

The domain layer shall not depend on:

- Xtream response naming
- M3U attribute naming
- Provider-specific JSON casing
- Provider-specific URL patterns

Adapters absorb those differences.

---

# 74. API Reliability

Every external API operation shall define:

- Input schema
- Output schema
- Timeout
- Retryability
- Error mapping
- Cache behavior
- Cancellation
- Logging policy

---

# 75. Security of Provider Credentials

Credential requirements:

- Never include in source code.
- Never include in URLs in logs.
- Never expose through diagnostics.
- Redact before telemetry.
- Clear on account deletion.
- Encrypt/protect where platform storage supports it.

---

# 76. Upgrade and Migration

Every persisted schema change requires:

- Migration ID
- Previous schema
- New schema
- Forward migration
- Recovery strategy
- Test fixture

---

# 77. Crash Recovery

The application shall recover from:

- Failed catalog load
- Corrupt cache
- Playback crash
- Network loss
- Invalid provider response
- Unexpected route state

A single provider failure must not crash the entire application.

---

# 78. Quality Attributes

Each major feature shall define measurable:

- Correctness
- Performance
- Reliability
- Security
- Accessibility
- Maintainability
- Compatibility

---

# 79. Requirement Prioritization

Each requirement shall be classified:

- `P0` — release blocker / core product
- `P1` — important production capability
- `P2` — enhancement
- `P3` — optional/future

Priority must come from product decisions or authoritative source evidence; it must not be invented as if it came from Smarters.

---

# 80. Explicit Unknowns

The following remain `UNKNOWN` unless authoritative product documentation is supplied:

- Exact IPTV Smarters Pro internal architecture.
- Exact proprietary UI implementation.
- Exact private APIs.
- Exact feature flags by version.
- Exact commercial backend behavior.
- Exact device-specific optimizations used by Smarters.
- Exact proprietary algorithms.

These must not be reverse-engineered into asserted requirements without evidence.

---

# 81. Requirement-to-Verification Template

Every requirement record should use:

```yaml
id: REQ-XXXX
title: ""
classification: VERIFIED|DERIVED|MISSING|CONFLICT|UNKNOWN
priority: P0|P1|P2|P3
source:
  document: ""
  section: ""
  evidence: ""
capability: ""
domain: ""
specification: ""
implementation_tasks: []
verification:
  unit: []
  integration: []
  e2e: []
  hardware: []
acceptance_criteria: []
dependencies: []
risks: []
```

---

# 82. Master Acceptance Criteria

The final OppoIPTV product derived from this baseline shall:

1. Run as a Samsung Tizen TV application.
2. Navigate completely by remote control.
3. Connect to authorized IPTV providers through supported provider adapters.
4. Browse Live TV.
5. Display EPG when available.
6. Play compatible live streams.
7. Browse VOD.
8. Play VOD.
9. Resume VOD where progress is available.
10. Browse series/seasons/episodes.
11. Play episodes.
12. Search supported content.
13. Maintain favorites.
14. Maintain watch history.
15. Handle provider/network failures gracefully.
16. Handle unsupported media gracefully.
17. Preserve user state across normal restarts.
18. Maintain acceptable long-session memory behavior.
19. Pass automated quality gates.
20. Pass real Samsung hardware validation before production release.

---

# 83. Source References

The Samsung-specific platform constraints in this document should be maintained against current Samsung Developer documentation:

- Samsung General Specifications: Tizen versions, resolutions, platform capabilities.
- Samsung 2024 TV Video Specifications: codec/container constraints.
- Samsung Creating Web Applications: TV Web application development model.
- Samsung Quick-start Guide: signing, TV application characteristics and 16:9/application-resolution guidance.
- Samsung Remote Control: supported remote interaction model.
- Samsung UX Checklist: focus, grids, remote behavior, visual interaction.
- Samsung AVPlay: platform media playback lifecycle and advanced playback capability.
- Samsung Web Engine Specifications: browser engine versions.
- Samsung Web App Memory Optimization Guide: memory, DOM, image and media optimization.

These are external platform references, not IPTV Smarters Pro proprietary documentation.

---

# 84. Final Requirement Policy

This document is a **requirements/capability baseline**, not a claim that every listed capability is officially documented as a feature of IPTV Smarters Pro.

When an authoritative `iptv smarters pro-Requirements` document is supplied, it becomes the primary product-reference source for exact requirement wording and IDs.

The reconciliation process must then produce:

```text
Smarters Requirement
→ OppoIPTV Requirement
→ OppoIPTV Capability
→ Engineering Specification
→ Implementation Task
→ Test
→ Evidence
```

No requirement may disappear without an explicit disposition:

```text
IMPLEMENTED
DEFERRED
REJECTED
NOT_APPLICABLE
UNKNOWN
```

with justification.

---

# 85. Completion Standard

The requirement set is considered ready for engineering only when:

- All source requirements have stable IDs.
- Every requirement has an evidence classification.
- Every P0/P1 requirement has acceptance criteria.
- Every P0/P1 requirement maps to implementation work.
- Every P0/P1 requirement maps to verification.
- Conflicts are resolved or explicitly gated.
- Unknowns are visible.
- OppoIPTV identity remains independent.
- Samsung platform constraints are validated against current documentation.
- The resulting implementation can be audited from requirement to evidence.

**END OF REQUIREMENTS BASELINE**
