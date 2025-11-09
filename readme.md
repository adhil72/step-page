# StepPage Component

A fully reusable, accessible, and customizable step/wizard page component for React applications.

## Features

✨ **Flexible API** - Use controlled or uncontrolled mode
🎨 **Fully Customizable** - Override any part with your own components
♿ **Accessible** - Built with semantic HTML and ARIA labels
🎯 **TypeScript** - Full type safety
🔄 **Step Navigation** - Click on completed steps to go back
✅ **Progress Indicators** - Visual feedback with checkmarks
🎭 **Icons Support** - Add custom icons to each step
⚡ **Async Support** - Handle async validation before navigation

## Basic Usage

```tsx
import {
  StepPage,
  StepPageHeader,
  StepPages,
  StepPageContent,
  StepItem,
  StepPageFooter,
  type StepItemData,
} from "@/components/ui/step-page"

function MyWizard() {
  const steps: StepItemData[] = [
    { title: "Personal Info", description: "Basic details" },
    { title: "Contact", description: "Email and phone" },
    { title: "Review", description: "Confirm details" },
  ]

  return (
    <StepPage>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>

      <StepPageContent>
        <StepItem step={1}>
          <h2>Step 1 Content</h2>
        </StepItem>
        <StepItem step={2}>
          <h2>Step 2 Content</h2>
        </StepItem>
        <StepItem step={3}>
          <h2>Step 3 Content</h2>
        </StepItem>
      </StepPageContent>

      <StepPageFooter />
    </StepPage>
  )
}
```

## Component API

### `<StepPage>`

The root container component that manages step state.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components (Header, Content, Footer) |
| `defaultStep` | `number` | `1` | Initial step in uncontrolled mode |
| `currentStep` | `number` | - | Current step in controlled mode |
| `onStepChange` | `(step: number) => void` | - | Callback when step changes (controlled mode) |
| `className` | `string` | - | Additional CSS classes |

#### Example: Controlled Mode

```tsx
function ControlledWizard() {
  const [step, setStep] = useState(1)
  
  return (
    <StepPage currentStep={step} onStepChange={setStep}>
      {/* ... */}
    </StepPage>
  )
}
```

### `<StepPageHeader>`

Container for the step navigation header.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Usually contains `<StepPages>` |
| `className` | `string` | - | Additional CSS classes |

### `<StepPages>`

Renders the step navigation indicators.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItemData[]` | - | Array of step configurations |
| `className` | `string` | - | Additional CSS classes |

#### StepItemData Interface

```tsx
interface StepItemData {
  title: string           // Step title (required)
  description?: string    // Optional subtitle
  icon?: ReactNode       // Optional custom icon
}
```

#### Example: Steps with Icons

```tsx
import { User, Mail, Check } from "lucide-react"

const steps: StepItemData[] = [
  {
    title: "Account",
    description: "Create account",
    icon: <User className="size-4" />,
  },
  {
    title: "Verify",
    description: "Email verification",
    icon: <Mail className="size-4" />,
  },
  {
    title: "Complete",
    icon: <Check className="size-4" />,
  },
]
```

### `<StepPageContent>`

Container for the main content area.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Usually contains `<StepItem>` components |
| `className` | `string` | - | Additional CSS classes |

### `<StepItem>`

Renders content for a specific step. Only the current step is shown.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number` | - | Step number (1-indexed) |
| `children` | `ReactNode` | - | Content to show for this step |
| `className` | `string` | - | Additional CSS classes |

### `<StepPageFooter>`

Navigation footer with default or custom actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom footer content |
| `className` | `string` | - | Additional CSS classes |
| `showDefaultActions` | `boolean` | `true` | Show default Previous/Next buttons |
| `nextLabel` | `string` | `"Next"` | Label for next button |
| `prevLabel` | `string` | `"Previous"` | Label for previous button |
| `onNext` | `() => void \| Promise<void>` | - | Callback before navigating to next step |
| `onPrev` | `() => void \| Promise<void>` | - | Callback before navigating to previous step |

#### Example: Async Validation

```tsx
<StepPageFooter
  onNext={async () => {
    await validateCurrentStep()
  }}
  nextLabel="Continue"
  prevLabel="Go Back"
/>
```

#### Example: Custom Footer

```tsx
<StepPageFooter showDefaultActions={false}>
  <div className="flex justify-between">
    <Button onClick={handleCustomAction}>Custom Action</Button>
  </div>
</StepPageFooter>
```

### `useStepPage()` Hook

Access step state and navigation methods from any child component.

#### Returns

```tsx
interface StepPageContextValue {
  currentStep: number       // Current active step
  totalSteps: number        // Total number of steps
  goToStep: (step: number) => void  // Navigate to specific step
  nextStep: () => void      // Go to next step
  prevStep: () => void      // Go to previous step
  canGoNext: boolean        // Whether next step is available
  canGoPrev: boolean        // Whether previous step is available
}
```

#### Example: Custom Navigation

```tsx
function CustomStepControls() {
  const { currentStep, totalSteps, nextStep, prevStep, canGoNext } = useStepPage()
  
  return (
    <div>
      <p>Step {currentStep} of {totalSteps}</p>
      <Button onClick={prevStep}>Back</Button>
      <Button onClick={nextStep} disabled={!canGoNext}>
        Next
      </Button>
    </div>
  )
}
```

## Advanced Examples

### Form Validation

```tsx
function FormWizard() {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const handleNext = async () => {
    const validationErrors = await validateStep(currentStep, formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      throw new Error("Validation failed") // Prevents navigation
    }
  }

  return (
    <StepPage>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>
      <StepPageContent>
        {/* Form fields */}
      </StepPageContent>
      <StepPageFooter onNext={handleNext} />
    </StepPage>
  )
}
```

### Progress Dots

```tsx
function CustomFooterWithDots() {
  const { currentStep, totalSteps, nextStep, prevStep } = useStepPage()
  
  return (
    <StepPageFooter showDefaultActions={false}>
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" onClick={prevStep}>Back</Button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i + 1 === currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        
        <Button onClick={nextStep}>Continue</Button>
      </div>
    </StepPageFooter>
  )
}
```

### Conditional Step Display

```tsx
function ConditionalSteps() {
  const [showOptionalStep, setShowOptionalStep] = useState(false)
  
  const steps: StepItemData[] = [
    { title: "Required Step 1" },
    ...(showOptionalStep ? [{ title: "Optional Step" }] : []),
    { title: "Final Step" },
  ]
  
  return (
    <StepPage>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>
      {/* ... */}
    </StepPage>
  )
}
```

## Styling

The component uses Tailwind CSS and follows your project's design system. All components accept `className` props for customization.

### Example: Custom Styling

```tsx
<StepPage className="h-screen bg-gradient-to-b from-background to-muted">
  <StepPageHeader className="border-none shadow-lg">
    <StepPages steps={steps} className="max-w-4xl mx-auto" />
  </StepPageHeader>
  <StepPageContent className="max-w-2xl mx-auto">
    {/* Content */}
  </StepPageContent>
  <StepPageFooter className="border-none shadow-lg" />
</StepPage>
```

## Accessibility

- Proper semantic HTML structure
- ARIA labels for progress navigation
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Best Practices

1. **Keep steps focused** - Each step should have a single, clear purpose
2. **Show progress** - Always use `<StepPages>` to show users where they are
3. **Validate before navigation** - Use `onNext` to validate data
4. **Provide feedback** - Show loading states during async operations
5. **Allow going back** - Users should be able to review and edit previous steps
6. **Clear labels** - Use descriptive titles and descriptions for each step

## License

MIT
