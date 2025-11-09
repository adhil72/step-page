/**
 * Example usage of the StepPage component
 * 
 * This file demonstrates how to use the reusable step page component
 * with various configurations and patterns.
 */

import {
  StepPage,
  StepPageHeader,
  StepPages,
  StepPageContent,
  StepItem,
  StepPageFooter,
  useStepPage,
  type StepItemData,
} from "@/components/ui/step-page"
import { User, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ==================== Basic Example ====================

export function BasicStepPageExample() {
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <p className="text-muted-foreground">
              Please provide your basic information.
            </p>
            <Input placeholder="Full Name" />
            <Input placeholder="Age" type="number" />
          </div>
        </StepItem>

        <StepItem step={2}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <p className="text-muted-foreground">
              How can we reach you?
            </p>
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" type="tel" />
          </div>
        </StepItem>

        <StepItem step={3}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review & Submit</h2>
            <p className="text-muted-foreground">
              Please review your information before submitting.
            </p>
            <div className="rounded-lg border p-4">
              <p>Review your details here...</p>
            </div>
          </div>
        </StepItem>
      </StepPageContent>

      <StepPageFooter />
    </StepPage>
  )
}

// ==================== Example with Icons ====================

export function StepPageWithIcons() {
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
      description: "All done",
      icon: <Check className="size-4" />,
    },
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

// ==================== Controlled Example ====================

export function ControlledStepPage() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const steps: StepItemData[] = [
    { title: "Step 1" },
    { title: "Step 2" },
    { title: "Step 3" },
  ]

  return (
    <StepPage currentStep={currentStep} onStepChange={setCurrentStep}>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>

      <StepPageContent>
        <StepItem step={1}>
          <h2>Controlled Step 1</h2>
        </StepItem>
        <StepItem step={2}>
          <h2>Controlled Step 2</h2>
        </StepItem>
        <StepItem step={3}>
          <h2>Controlled Step 3</h2>
        </StepItem>
      </StepPageContent>

      <StepPageFooter />
    </StepPage>
  )
}

// ==================== Custom Footer Example ====================

export function StepPageWithCustomFooter() {
  const [isValid, setIsValid] = React.useState(false)

  const steps: StepItemData[] = [
    { title: "Input" },
    { title: "Validate" },
    { title: "Submit" },
  ]

  const handleNext = async () => {
    // Custom validation logic
    console.log("Validating before next...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <StepPage>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>

      <StepPageContent>
        <StepItem step={1}>
          <div className="space-y-4">
            <h2>Enter your data</h2>
            <Input
              placeholder="Type something..."
              onChange={(e) => setIsValid(e.target.value.length > 0)}
            />
          </div>
        </StepItem>
        <StepItem step={2}>
          <h2>Validation Step</h2>
        </StepItem>
        <StepItem step={3}>
          <h2>Final Step</h2>
        </StepItem>
      </StepPageContent>

      <StepPageFooter onNext={handleNext}>
        <CustomFooterContent isValid={isValid} />
      </StepPageFooter>
    </StepPage>
  )
}

function CustomFooterContent({ isValid }: { isValid: boolean }) {
  const { nextStep, prevStep, canGoNext, canGoPrev, currentStep, totalSteps } =
    useStepPage()

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={prevStep} disabled={!canGoPrev}>
        Back
      </Button>

      <div className="flex items-center gap-2">
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

      <Button onClick={nextStep} disabled={!canGoNext || !isValid}>
        Continue
      </Button>
    </div>
  )
}

// ==================== Without Default Footer ====================

export function StepPageWithoutFooter() {
  const steps: StepItemData[] = [
    { title: "Step 1" },
    { title: "Step 2" },
  ]

  return (
    <StepPage>
      <StepPageHeader>
        <StepPages steps={steps} />
      </StepPageHeader>

      <StepPageContent>
        <StepItem step={1}>
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <CustomNavigationButtons />
          </div>
        </StepItem>
        <StepItem step={2}>
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold">All Done!</h2>
            <CustomNavigationButtons />
          </div>
        </StepItem>
      </StepPageContent>
    </StepPage>
  )
}

function CustomNavigationButtons() {
  const { nextStep, prevStep, canGoNext, canGoPrev } = useStepPage()

  return (
    <div className="flex gap-2">
      {canGoPrev && (
        <Button variant="outline" onClick={prevStep}>
          Previous
        </Button>
      )}
      {canGoNext && <Button onClick={nextStep}>Next</Button>}
    </div>
  )
}

// Add missing import
import * as React from "react"
import { cn } from "@/lib/utils"
