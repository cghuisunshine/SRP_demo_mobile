# Strata Reserve Planning (SRP) - Design System & Style Guide

**Project:** Jeremy Gravel's Depreciation Report Portal  
**Version:** 1.0  
**Last Updated:** January 2026

---

## 📦 Technology Stack

### **Core Framework**
- **React** - Functional components with hooks (useState, useEffect)
- **TypeScript** - Type-safe component props and interfaces
- **Tailwind CSS v4** - Utility-first styling framework
- **Vite** - Build tool and dev server

### **UI Component Library**
- **shadcn/ui** - Accessible, customizable components built on Radix UI primitives
  - `@radix-ui/react-accordion@1.2.3`
  - `@radix-ui/react-slot@1.1.2`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-select`
  - And many more Radix primitives

### **Icons**
- **lucide-react@0.487.0** - Beautiful, consistent icon library
  - Example: `import { Upload, Calendar, Bell } from 'lucide-react@0.487.0'`

### **Utility Libraries**
- **class-variance-authority@0.7.1** - CVA for component variants
- **react-day-picker@8.10.1** - Calendar/date picker
- **sonner@2.0.3** - Toast notifications
- **react-hook-form@7.55.0** - Form management

---

## 🎨 Color Palette

### **Brand Colors (Jeremy's Green Palette)**

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Primary Green** | `#6B8E5F` | `--brand-primary` | Primary buttons, active states, links |
| **Primary Dark** | `#5a7850` | `--brand-primary-dark` | Hover states, accents |
| **Primary Light** | `#8fa882` | `--brand-primary-light` | Subtle backgrounds, charts |
| **Secondary Green** | `#4a6343` | `--brand-secondary` | Gradients, depth |
| **Accent Green** | `#a4c297` | `--brand-accent` | Highlights, badges, notifications |
| **Surface** | `#f5f7f4` | `--brand-surface` | Card backgrounds, subtle containers |

### **Semantic Colors**

| Purpose | Hex Code | CSS Variable | Usage |
|---------|----------|--------------|-------|
| **Background** | `#fafaf9` | `--background` | Page background |
| **Foreground** | `#1c1917` | `--foreground` | Primary text color |
| **Card** | `#ffffff` | `--card` | Card backgrounds |
| **Muted** | `#f5f5f4` | `--muted` | Disabled states, secondary elements |
| **Muted Foreground** | `#78716c` | `--muted-foreground` | Secondary text |
| **Border** | `#e7e5e4` | `--border` | Component borders |
| **Destructive** | `#dc2626` | `--destructive` | Error states, delete buttons |

### **Chart Colors**
```css
--chart-1: #6B8E5F;  /* Primary green */
--chart-2: #8fa882;  /* Light green */
--chart-3: #4a6343;  /* Dark green */
--chart-4: #a4c297;  /* Accent green */
--chart-5: #5a7850;  /* Medium green */
```

### **Dark Mode** (For Admin Command Center)
Dark mode uses OKLCH color space for consistent perception:
- Background: `oklch(0.145 0 0)` - Very dark gray
- Foreground: `oklch(0.985 0 0)` - Almost white
- Card: `oklch(0.145 0 0)` - Matching dark background

---

## 🔤 Typography

### **Font Family**
- **System Font Stack** (default browser fonts - no custom fonts loaded)
- Uses the default sans-serif system fonts for optimal performance and readability

### **Font Sizes**
```css
--font-size: 16px; /* Base size for accessibility */
```

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **h1** | `2xl` | `500` | `1.5` | Page titles |
| **h2** | `xl` | `500` | `1.5` | Section headings |
| **h3** | `lg` | `500` | `1.5` | Subsection headings |
| **h4** | `base` | `500` | `1.5` | Card titles |
| **body** | `base` | `400` | `1.5` | Body text |
| **label** | `base` | `500` | `1.5` | Form labels |
| **button** | `base` | `500` | `1.5` | Button text |
| **input** | `base` | `400` | `1.5` | Input fields |

### **Font Weights**
```css
--font-weight-normal: 400;  /* Body text, inputs */
--font-weight-medium: 500;  /* Headings, labels, buttons */
```

### **Senior-Friendly Typography Principles**
- **Minimum font size:** 16px (never below)
- **High contrast:** Dark text on light backgrounds
- **Generous line-height:** 1.5 for readability
- **Clear hierarchy:** Bold headings, regular body text
- **No ALL CAPS paragraphs** (only badges/labels)

---

## 📐 Spacing & Layout

### **Border Radius**
```css
--radius: 0.5rem; /* 8px - default */
--radius-sm: 4px;   /* Small elements */
--radius-md: 6px;   /* Medium elements */
--radius-lg: 8px;   /* Large elements */
--radius-xl: 12px;  /* Extra large cards */
```

**Common Rounded Classes:**
- `rounded-md` - Buttons, inputs (0.375rem / 6px)
- `rounded-lg` - Cards, containers (0.5rem / 8px)
- `rounded-xl` - Large cards, modals (0.75rem / 12px)
- `rounded-full` - Badges, avatars, circular buttons

### **Spacing Scale (Tailwind Default)**
- **Gap/Padding:** `gap-2` (0.5rem), `gap-4` (1rem), `gap-6` (1.5rem), `gap-8` (2rem)
- **Margins:** `mb-2` (0.5rem), `mb-4` (1rem), `mb-6` (1.5rem), `mb-8` (2rem)

### **Container Widths**
- **Max content width:** `max-w-6xl` (72rem / 1152px)
- **Form width:** `max-w-md` (28rem / 448px)
- **Card padding:** `p-6` (1.5rem) or `p-8` (2rem)

---

## 🧩 Component Library (shadcn/ui)

### **Button Component**

**Variants:**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="secondary">Muted Action</Button>
<Button variant="ghost">Subtle Action</Button>
<Button variant="link">Text Link</Button>
```

**Sizes:**
```tsx
<Button size="sm">Small (h-8)</Button>
<Button size="default">Default (h-9)</Button>
<Button size="lg">Large (h-10)</Button>
<Button size="icon">Icon Only (size-9)</Button>
```

**Custom Green Buttons (Brand Override):**
```tsx
<Button className="bg-[#6B8E5F] hover:bg-[#5a7850] h-12 w-full">
  Sign In
</Button>
```

### **Card Component**

**Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Action Button</CardAction>
  </CardHeader>
  <CardContent>
    Main content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Styling:**
- White background (`bg-card`)
- Border (`border`)
- Rounded corners (`rounded-xl`)
- Padding: `px-6 pt-6` in header, `px-6 pb-6` in footer

### **Input Component**

**Senior-Friendly Inputs:**
```tsx
<Input
  type="text"
  className="w-full h-12 px-4 border-2 border-gray-200 
             focus:border-[#6B8E5F] focus:ring-[#6B8E5F] 
             rounded-lg"
  placeholder="Enter your username"
/>
```

**Key Features:**
- **Height:** `h-12` (48px) - easy to tap
- **Border:** `border-2` - visible boundaries
- **Focus state:** Green ring matching brand
- **Large padding:** `px-4` for text spacing

### **Badge Component**

```tsx
<Badge variant="default">New</Badge>
<Badge variant="secondary">Complete</Badge>
<Badge variant="destructive">Urgent</Badge>
<Badge variant="outline">Draft</Badge>
```

**Custom Badge:**
```tsx
<span className="bg-[#6B8E5F] text-white text-xs font-medium 
               px-3 py-1 rounded-full">
  RECOMMENDED
</span>
```

### **Alert Component**

```tsx
<Alert>
  <AlertTitle>Attention Required</AlertTitle>
  <AlertDescription>Your AGM date is approaching.</AlertDescription>
</Alert>
```

---

## 🎯 Design Patterns

### **1. Dashboard Layout**

**Structure:**
```
┌─────────────────────────────────────────┐
│ Logo    Strata ID    User    [Bell] [?] │ ← Header (60px height)
├─────────┬───────────────────────────────┤
│         │                               │
│ Sidebar │    Main Content Area          │
│         │    (max-w-6xl, p-8)           │
│ (240px) │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

**Sidebar:**
- Width: `w-60` (240px)
- Background: White
- Border-right: Gray
- Logo at top (80px x 80px)
- Scrollable navigation

**Main Content:**
- Max width: `max-w-6xl`
- Padding: `p-8` (2rem)
- Centered: `mx-auto`

### **2. Card-Based Layouts**

**Grid of Action Cards:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

**Responsive Breakpoints:**
- Mobile: `grid-cols-1` (single column)
- Tablet: `md:grid-cols-2` (2 columns)
- Desktop: `md:grid-cols-3` (3 columns)

### **3. Progress Indicators**

**Progress Bar:**
```tsx
<div className="w-full bg-gray-200 rounded-full h-3">
  <div className="bg-[#6B8E5F] h-3 rounded-full" 
       style={{ width: '68%' }}></div>
</div>
```

**Progress Ring (Circular):**
```tsx
<div className="text-4xl font-bold text-[#6B8E5F]">68%</div>
<p className="text-sm text-gray-600">Complete</p>
```

### **4. Form Layouts**

**Vertical Form:**
```tsx
<form className="space-y-6">
  <div>
    <Label htmlFor="field" className="text-sm font-medium mb-2 block">
      Field Label
    </Label>
    <Input id="field" className="w-full h-12" />
  </div>
  <Button type="submit" className="w-full h-12">Submit</Button>
</form>
```

**Key Principles:**
- Vertical stacking (easier for seniors)
- Large touch targets (h-12 / 48px minimum)
- Clear labels above inputs
- Full-width buttons
- Ample spacing (`space-y-6`)

### **5. Empty States**

```tsx
<div className="text-center py-12">
  <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    No documents uploaded yet
  </h3>
  <p className="text-gray-600 mb-6">
    Get started by uploading your first document
  </p>
  <Button>Upload Document</Button>
</div>
```

### **6. Loading States**

**Skeleton Loading:**
```tsx
import { Skeleton } from './ui/skeleton';

<Skeleton className="h-12 w-full" />
<Skeleton className="h-8 w-3/4" />
```

**Spinner Loading:**
```tsx
<div className="flex items-center justify-center py-8">
  <div className="animate-spin rounded-full h-8 w-8 
                  border-b-2 border-[#6B8E5F]"></div>
</div>
```

---

## 🖼️ Visual Design Principles

### **Senior-Friendly Design**
1. **Large Click Targets:** Minimum 48px height for buttons/inputs
2. **High Contrast:** WCAG AAA compliance (7:1 ratio)
3. **Clear Visual Hierarchy:** Bold headings, ample whitespace
4. **Generous Spacing:** Never cramped layouts
5. **Simple Navigation:** Max 2 levels deep
6. **Consistent Patterns:** Same layout for similar tasks
7. **Error Prevention:** Confirmation dialogs for destructive actions
8. **Clear Feedback:** Toast notifications for all actions

### **Color Usage Guidelines**

**Primary Green (#6B8E5F):**
- Primary CTAs (Call-to-Action buttons)
- Active navigation items
- Progress bars
- Icons for positive actions
- Links

**Accent Green (#a4c297):**
- Badges ("NEW", "RECOMMENDED")
- Notification dots
- Highlights
- Secondary CTAs

**Surface (#f5f7f4):**
- Card backgrounds for subtle elevation
- Secondary button backgrounds
- Input backgrounds (disabled state)
- Notice backgrounds

**Destructive Red (#dc2626):**
- Delete buttons
- Error messages
- Warning states
- Form validation errors

### **Shadows & Elevation**

```css
/* Card hover effect */
shadow-md hover:shadow-xl transition-shadow

/* Modal/Dialog */
shadow-2xl

/* Button press */
active:shadow-none
```

**Elevation Layers:**
- **Level 0:** Page background (no shadow)
- **Level 1:** Cards (`shadow-md`)
- **Level 2:** Hover state (`shadow-lg`)
- **Level 3:** Active state (`shadow-xl`)
- **Level 4:** Modals/Dialogs (`shadow-2xl`)

---

## 🎭 Interactive States

### **Button States**

```tsx
// Default state
bg-[#6B8E5F] text-white

// Hover state
hover:bg-[#5a7850]

// Active/Pressed state
active:bg-[#4a6343]

// Disabled state
disabled:opacity-50 disabled:pointer-events-none

// Focus state (keyboard navigation)
focus-visible:ring-[#6B8E5F] focus-visible:ring-2
```

### **Input States**

```tsx
// Default
border-2 border-gray-200

// Focus
focus:border-[#6B8E5F] focus:ring-[#6B8E5F] focus:ring-2

// Error
aria-invalid:ring-destructive/20 aria-invalid:border-destructive

// Disabled
disabled:bg-gray-100 disabled:cursor-not-allowed
```

### **Transitions**

```css
/* Standard transition */
transition-colors duration-200

/* Shadow transition */
transition-shadow duration-300

/* Transform transition */
transition-transform duration-200

/* All properties */
transition-all duration-200
```

---

## 📱 Responsive Design

### **Breakpoints (Tailwind Default)**
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### **Responsive Patterns**

**Navigation:**
- Desktop: Full sidebar (w-60 / 240px)
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu (though not primary target)

**Cards:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Typography:**
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

**Padding:**
```tsx
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## 🎨 Brand Assets

### **Logo Usage**
- **File:** `figma:asset/96367897cc8743fa1a0e515d1031e47990169db4.png`
- **Size:** 80px x 80px (standard)
- **Size:** 20px x 20px (small/favicon)
- **Background:** Transparent PNG
- **Placement:** Top-left of sidebar, center of login page

### **Logo Implementation:**
```tsx
import logo from 'figma:asset/96367897cc8743fa1a0e515d1031e47990169db4.png';

<img src={logo} alt="Strata Reserve Planning" 
     className="h-20 w-20 rounded-lg shadow-md" />
```

---

## 🔔 Notifications & Feedback

### **Toast Notifications (Sonner)**

```tsx
import { toast } from 'sonner@2.0.3';

// Success
toast.success('Progress saved!');

// Error
toast.error('Upload failed. Please try again.');

// Info
toast.info('Your AGM date is approaching.');

// Loading
toast.loading('Uploading document...');
```

**Positioning:** Bottom-right of screen  
**Duration:** 3-5 seconds (auto-dismiss)  
**Style:** Matches brand colors

### **Notification Badge**

```tsx
<div className="relative">
  <Bell className="h-6 w-6" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-[#dc2626] 
                     text-white text-xs rounded-full 
                     h-5 w-5 flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</div>
```

---

## ♿ Accessibility

### **WCAG Compliance**
- **Level:** AA minimum (targeting AAA for seniors)
- **Contrast Ratio:** 7:1 for text
- **Focus Indicators:** Visible keyboard focus states
- **Screen Reader Support:** Proper ARIA labels

### **Keyboard Navigation**
```tsx
// Focus visible states
focus-visible:ring-2 focus-visible:ring-[#6B8E5F]

// Tab order
tabIndex={0}

// ARIA labels
aria-label="Close dialog"
aria-describedby="help-text"
```

### **Semantic HTML**
- Use `<button>` for clickable actions (not `<div>`)
- Use `<a>` for navigation links
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels associated with inputs

---

## 📝 Code Style & Conventions

### **Component Structure**
```tsx
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload } from 'lucide-react@0.487.0';

interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [state, setState] = useState('');
  
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </Card>
  );
}
```

### **Naming Conventions**
- **Components:** PascalCase (`LoginPage`, `WelcomeHub`)
- **Files:** PascalCase matching component (`LoginPage.tsx`)
- **Props:** camelCase (`onNavigate`, `userName`)
- **CSS Variables:** kebab-case (`--brand-primary`)
- **Tailwind Classes:** As-is (`bg-[#6B8E5F]`)

### **Import Order**
1. React imports
2. UI components
3. Icons
4. Assets (images, logos)
5. Types/interfaces

---

## 🚀 Performance Best Practices

### **Image Optimization**
- Use `figma:asset` scheme for raster images
- SVGs imported as components
- Lazy load images below the fold
- Provide alt text for accessibility

### **Code Splitting**
- Component-based routing
- Dynamic imports for heavy libraries
- Lazy load admin features (not needed for strata users)

### **Bundle Size**
- Import only needed icons: `import { Upload } from 'lucide-react'`
- Use specific Radix packages: `@radix-ui/react-dialog@1.x.x`
- Avoid importing entire libraries

---

## 📚 Component Examples

### **Full Page Layout**
```tsx
export function MyPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Page Title
        </h1>
        <p className="text-lg text-gray-600">
          Subtitle description
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="font-bold text-xl mb-4">Section 1</h2>
          <p className="text-gray-600">Content here</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Button className="bg-[#6B8E5F] hover:bg-[#5a7850]">
          Primary Action
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
```

### **Form with Validation**
```tsx
export function ContactForm() {
  const [errors, setErrors] = useState({});
  
  return (
    <form className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          className="w-full h-12"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">
            {errors.email}
          </p>
        )}
      </div>
      
      <Button type="submit" className="w-full h-12">
        Submit
      </Button>
    </form>
  );
}
```

### **Progress Card**
```tsx
export function ProgressCard({ percentage }: { percentage: number }) {
  return (
    <div className="bg-gradient-to-br from-[#6B8E5F] to-[#5a7850] 
                    rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Progress</h2>
          <p className="text-green-100">You're making great progress!</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{percentage}%</div>
          <div className="text-sm text-green-100">Complete</div>
        </div>
      </div>
      <div className="w-full bg-green-900/30 rounded-full h-3">
        <div 
          className="bg-white h-3 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 🎯 Quick Reference

### **Common Color Classes**
```css
/* Primary green */
bg-[#6B8E5F] text-white
hover:bg-[#5a7850]

/* Surface */
bg-[#f5f7f4] text-gray-900

/* Accent */
bg-[#a4c297] text-gray-900

/* Destructive */
bg-destructive text-white
hover:bg-destructive/90
```

### **Common Spacing**
```css
/* Padding */
p-4 p-6 p-8

/* Margin */
mb-2 mb-4 mb-6 mb-8

/* Gap */
gap-2 gap-4 gap-6 gap-8

/* Space between */
space-y-4 space-y-6
```

### **Common Sizes**
```css
/* Buttons/Inputs */
h-12 w-full

/* Icons */
h-6 w-6 (standard)
h-8 w-8 (large)

/* Cards */
rounded-xl p-6

/* Max widths */
max-w-md max-w-6xl
```

---

## 🔧 Development Setup

### **Install shadcn/ui Components**
Components are already installed and configured in `/components/ui/`

### **Adding New Icons**
```tsx
import { IconName } from 'lucide-react@0.487.0';
```
Browse available icons: https://lucide.dev/icons/

### **Custom Color Usage**
Always use Jeremy's brand colors for primary actions:
```tsx
className="bg-[#6B8E5F] hover:bg-[#5a7850] text-white"
```

---

## 📋 Checklist for New Components

- [ ] Uses brand colors (#6B8E5F primary)
- [ ] Senior-friendly sizing (h-12 buttons/inputs)
- [ ] Proper TypeScript interfaces
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Responsive (mobile-first with md: breakpoints)
- [ ] Consistent spacing (p-6, gap-4, etc.)
- [ ] Loading and error states
- [ ] Hover/focus states with transitions
- [ ] Proper semantic HTML
- [ ] Toast notifications for actions

---

**End of Style Guide**  