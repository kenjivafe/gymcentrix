## 1. Research & UX

- [x] 1.1 Confirm mobile breakpoint (e.g. below Tailwind `lg` / 1024px) for collapsible behavior.
- [x] 1.2 Confirm UX: sidebar hidden by default on mobile vs visible; overlay vs push layout when open; hamburger placement (header vs floating).

## 2. Implementation

- [x] 2.1 Add toggle state (e.g. `sidebarOpen`) for mobile sidebar visibility; default closed on mobile, N/A on desktop.
- [x] 2.2 Add hamburger/toggle button visible only on mobile (or below lg breakpoint) that opens/closes the sidebar.
- [x] 2.3 On mobile: render sidebar as overlay or slide-out drawer; hide when closed; show when toggle is pressed.
- [x] 2.4 On desktop (lg+): keep sidebar always visible; hide toggle button.
- [x] 2.5 Optionally: close sidebar when a nav link is clicked on mobile (for overlay/drawer UX).
- [x] 2.6 Ensure focus management and accessibility (e.g. trap focus in drawer when open, ESC to close).

## 3. Validation & Docs

- [x] 3.1 Manually verify sidebar collapses on mobile and opens via toggle; desktop unchanged.
- [x] 3.2 Run lint/tests/build and `openspec validate add-collapsible-sidebar-mobile --strict --no-interactive`.
