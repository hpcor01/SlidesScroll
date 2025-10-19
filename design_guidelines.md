# Design Guidelines: Slides Management Application

## Design Approach
**Selected Approach:** Design System (Productivity-Focused)  
**Primary References:** Linear, Notion, Asana  
**Justification:** This is a utility-focused content management tool requiring efficiency, clarity, and consistent patterns for managing slides data.

## Core Design Principles
- **Efficiency First:** Every interaction optimized for quick slide management
- **Information Clarity:** Dense content displayed with excellent readability
- **Consistent Patterns:** Predictable UI for repetitive tasks
- **Minimal Cognitive Load:** Clear visual hierarchy and straightforward workflows

## Color Palette

**Dark Mode (Primary):**
- Background Primary: 220 15% 10%
- Background Secondary: 220 13% 14%
- Background Elevated: 220 12% 18%
- Text Primary: 220 10% 95%
- Text Secondary: 220 8% 70%
- Border Subtle: 220 10% 25%
- Border Interactive: 220 15% 35%

**Accent Colors:**
- Primary Action: 210 100% 55% (vibrant blue for CTAs)
- Success: 142 71% 45% (duplicate detection match indicators)
- Warning: 38 92% 50% (similarity warnings)
- Danger: 0 84% 60% (delete actions)

**Light Mode:**
- Background Primary: 0 0% 100%
- Background Secondary: 220 13% 98%
- Text Primary: 220 10% 15%
- Border Subtle: 220 10% 88%

## Typography
**Font Stack:** System fonts via Tailwind's font-sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)

**Type Scale:**
- Display: text-2xl font-semibold (slide titles, page headers)
- Body Large: text-base font-normal (slide content)
- Body: text-sm font-normal (metadata, labels)
- Caption: text-xs font-medium (pagination info, timestamps)
- Code: font-mono text-sm (similarity scores, IDs)

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16  
**Container:** max-w-6xl mx-auto px-6  
**Vertical Rhythm:** Section spacing py-8, component spacing gap-4

**Grid Structure:**
- Single column layout for slide list
- Responsive padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Consistent card spacing: gap-4 between items

## Component Library

### Header Bar
- Fixed top navigation with app title, search, and add new slide button
- Height: h-16, backdrop blur for elevated feel
- Primary action (Add Slide): Prominent button, right-aligned

### Slide Card Component
- Rounded corners (rounded-lg), subtle border, hover state with elevated shadow
- Content structure: Title (font-semibold), truncated body text, metadata row
- Actions: Edit, delete icons (right-aligned, subtle until hover)
- Expand/collapse: "ver mais"/"ver menos" links in primary accent color

### Text Truncation UI
- Default: Show 5 lines with `line-clamp-5`
- Toggle link styled as inline button (text-sm, accent color, underline on hover)
- Smooth height transition (transition-all duration-200)
- Clear visual indicator when truncated (subtle gradient fade at bottom edge)

### Duplicate Detection Panel
- Appears as dismissible alert banner above form when similarities detected
- Shows similarity percentage with progress bar visualization
- Lists matching slides with titles and similarity scores
- Action buttons: "Continuar mesmo assim" (proceed) or "Cancelar" (cancel)

### Pagination Controls
- Centered below slide list
- Page numbers with current page highlighted (background accent, rounded-full)
- Previous/Next buttons with chevron icons
- Disabled state for boundary pages (opacity-50, cursor-not-allowed)
- Show range info: "Mostrando 1-10 de 47 slides"

### Form Components
- Input fields: Dark background, subtle border, focus ring in accent color
- Textarea: Minimum height h-32, auto-resize capability
- Labels: text-sm font-medium, mb-2
- Validation errors: text-xs text-red-400 below inputs

### Empty States
- Centered content with icon, heading, description
- "Nenhum slide encontrado" message with suggestion to add first slide

## Animations
**Minimal, Purposeful Only:**
- Card hover: translate-y-[-2px] with subtle shadow increase
- Modal/drawer entry: slide-in from right (translate-x-full to translate-x-0)
- Text expand/collapse: smooth height transition
- Pagination: fade between page loads (optional, very subtle)

## Specific UI Patterns

**Slide List View:**
- Each slide as interactive card with clear touch targets
- Alternating subtle background tones for easier scanning (optional)
- Sticky header during scroll for context retention

**Duplicate Detection Flow:**
- Real-time check triggers as user types in textarea (debounced)
- Visual feedback: Highlight percentage match with color coding (>80% red, 60-80% yellow, <60% green)
- Non-blocking: User can proceed despite warnings

**Responsive Behavior:**
- Mobile: Single column, full-width cards, bottom sheet for forms
- Tablet: Same layout, increased padding
- Desktop: Optimal 800px content width for readability

## Accessibility
- All interactive elements meet 44px minimum touch target
- Color contrast ratios meet WCAG AA standards
- Focus indicators clearly visible in dark mode
- Semantic HTML with proper heading hierarchy
- Screen reader labels for icon-only buttons