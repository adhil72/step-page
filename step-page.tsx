import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

// ==================== Context ====================

interface StepPageContextValue {
  currentStep: number
  totalSteps: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: boolean
  canGoPrev: boolean
}

const StepPageContext = React.createContext<StepPageContextValue | undefined>(
  undefined
)

function useStepPage() {
  const context = React.useContext(StepPageContext)
  if (!context) {
    throw new Error("Step components must be used within StepPage")
  }
  return context
}

// ==================== Root Component ====================

interface StepPageProps {
  children: React.ReactNode
  defaultStep?: number
  currentStep?: number
  onStepChange?: (step: number) => void
  className?: string
}

function StepPage({
  children,
  defaultStep = 1,
  currentStep: controlledStep,
  onStepChange,
  className,
}: StepPageProps) {
  const [internalStep, setInternalStep] = React.useState(defaultStep)

  const isControlled = controlledStep !== undefined
  const currentStep = isControlled ? controlledStep : internalStep

  const [totalSteps, setTotalSteps] = React.useState(0)

  const goToStep = React.useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) return
      if (isControlled) {
        onStepChange?.(step)
      } else {
        setInternalStep(step)
      }
    },
    [isControlled, onStepChange, totalSteps]
  )

  const nextStep = React.useCallback(() => {
    goToStep(currentStep + 1)
  }, [currentStep, goToStep])

  const prevStep = React.useCallback(() => {
    goToStep(currentStep - 1)
  }, [currentStep, goToStep])

  const value = React.useMemo(
    () => ({
      currentStep,
      totalSteps,
      goToStep,
      nextStep,
      prevStep,
      canGoNext: currentStep < totalSteps,
      canGoPrev: currentStep > 1,
    }),
    [currentStep, totalSteps, goToStep, nextStep, prevStep]
  )

  return (
    <StepPageContext.Provider value={value}>
      <div className={cn("flex h-full w-full flex-col", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              setTotalSteps,
            })
          }
          return child
        })}
      </div>
    </StepPageContext.Provider>
  )
}

// ==================== Header Component ====================

interface StepPageHeaderProps {
  children?: React.ReactNode
  className?: string
}

function StepPageHeader({ children, className }: StepPageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full border-b bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      {children}
    </div>
  )
}

// ==================== Steps Component ====================

interface StepItemData {
  title: string
  description?: string
  icon?: React.ReactNode
}

interface StepPagesProps {
  steps: StepItemData[]
  className?: string
  setTotalSteps?: (total: number) => void
}

function StepPages({ steps, className, setTotalSteps }: StepPagesProps) {
  const { currentStep, goToStep } = useStepPage()

  React.useEffect(() => {
    setTotalSteps?.(steps.length)
  }, [steps.length, setTotalSteps])

  return (
    <nav
      aria-label="Progress"
      className={cn("flex items-center justify-center", className)}
    >
      <ol className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isClickable = stepNumber <= currentStep

          return (
            <React.Fragment key={stepNumber}>
              <li className="flex items-center">
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(stepNumber)}
                  disabled={!isClickable}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                    isActive && "bg-accent/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      isActive &&
                        "border-primary bg-background text-primary shadow-sm",
                      !isActive &&
                        !isCompleted &&
                        "border-muted-foreground/30 bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-5" />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      stepNumber
                    )}
                  </span>
                  <div className="flex flex-col items-start text-left">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive && "text-foreground",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                    {step.description && (
                      <span className="text-xs text-muted-foreground">
                        {step.description}
                      </span>
                    )}
                  </div>
                </button>
              </li>
              {stepNumber < steps.length && (
                <li className="flex items-center" aria-hidden="true">
                  <div
                    className={cn(
                      "h-0.5 w-8 transition-colors",
                      stepNumber < currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

// ==================== Content Component ====================

interface StepPageContentProps {
  children: React.ReactNode
  className?: string
}

function StepPageContent({ children, className }: StepPageContentProps) {
  return (
    <div className={cn("flex-1 overflow-auto px-6 py-6", className)}>
      {children}
    </div>
  )
}

// ==================== Step Item Component ====================

interface StepItemProps {
  step: number
  children: React.ReactNode
  className?: string
}

function StepItem({ step, children, className }: StepItemProps) {
  const { currentStep } = useStepPage()

  if (currentStep !== step) return null

  return <div className={cn("h-full", className)}>{children}</div>
}

// ==================== Footer Component ====================

interface StepPageFooterProps {
  children?: React.ReactNode
  className?: string
  showDefaultActions?: boolean
  nextLabel?: string
  prevLabel?: string
  onNext?: () => void | Promise<void>
  onPrev?: () => void | Promise<void>
}

function StepPageFooter({
  children,
  className,
  showDefaultActions = true,
  nextLabel = "Next",
  prevLabel = "Previous",
  onNext,
  onPrev,
}: StepPageFooterProps) {
  const { nextStep, prevStep, canGoNext, canGoPrev, currentStep, totalSteps } =
    useStepPage()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    try {
      await onNext?.()
      nextStep()
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrev = async () => {
    setIsLoading(true)
    try {
      await onPrev?.()
      prevStep()
    } finally {
      setIsLoading(false)
    }
  }

  const isLastStep = currentStep === totalSteps

  return (
    <div
      className={cn(
        "w-full border-t bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      {children ? (
        children
      ) : showDefaultActions ? (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev || isLoading}
          >
            {prevLabel}
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
          <Button onClick={handleNext} disabled={!canGoNext || isLoading}>
            {isLastStep ? "Finish" : nextLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

// ==================== Exports ====================

export {
  StepPage,
  StepPageHeader,
  StepPages,
  StepPageContent,
  StepItem,
  StepPageFooter,
  useStepPage,
  type StepPageProps,
  type StepPageHeaderProps,
  type StepPagesProps,
  type StepItemData,
  type StepPageContentProps,
  type StepItemProps,
  type StepPageFooterProps,
}
