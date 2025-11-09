/**
 * Real-world demo: Project Setup Wizard
 * 
 * This demonstrates a practical use case for the StepPage component
 */

import * as React from "react"
import {
  StepPage,
  StepPageHeader,
  StepPages,
  StepPageContent,
  StepItem,
  StepPageFooter,
  type StepItemData,
} from "@/components/ui/step-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderOpen, Settings, Rocket } from "lucide-react"

interface ProjectData {
  name: string
  description: string
  type: string
  features: string[]
}

export function ProjectSetupWizard() {
  const [projectData, setProjectData] = React.useState<ProjectData>({
    name: "",
    description: "",
    type: "",
    features: [],
  })

  const steps: StepItemData[] = [
    {
      title: "Project Details",
      description: "Name and description",
      icon: <FolderOpen className="size-4" />,
    },
    {
      title: "Configuration",
      description: "Setup options",
      icon: <Settings className="size-4" />,
    },
    {
      title: "Review",
      description: "Ready to launch",
      icon: <Rocket className="size-4" />,
    },
  ]

  const handleNext = async () => {
    // Simulate API call or validation
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Validated:", projectData)
  }

  const handleSubmit = () => {
    console.log("Creating project:", projectData)
    // Handle final submission
  }

  return (
    <div className="h-screen w-full">
      <StepPage defaultStep={1}>
        <StepPageHeader className="py-6">
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Create New Project</h1>
              <p className="text-muted-foreground">
                Follow these steps to set up your project
              </p>
            </div>
            <StepPages steps={steps} />
          </div>
        </StepPageHeader>

        <StepPageContent className="max-w-2xl mx-auto py-8">
          {/* Step 1: Project Details */}
          <StepItem step={1}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Project Details</h2>
                <p className="text-muted-foreground">
                  Let's start with the basic information about your project.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome Project"
                    value={projectData.name}
                    onChange={(e) =>
                      setProjectData({ ...projectData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe what your project does..."
                    rows={4}
                    value={projectData.description}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </StepItem>

          {/* Step 2: Configuration */}
          <StepItem step={2}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
                <p className="text-muted-foreground">
                  Choose your project type and features.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Web App", "Mobile App", "Desktop App", "API"].map(
                      (type) => (
                        <Button
                          key={type}
                          variant={
                            projectData.type === type ? "default" : "outline"
                          }
                          className="justify-start"
                          onClick={() =>
                            setProjectData({ ...projectData, type })
                          }
                        >
                          {type}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Authentication",
                      "Database",
                      "API Integration",
                      "File Upload",
                    ].map((feature) => (
                      <Button
                        key={feature}
                        variant={
                          projectData.features.includes(feature)
                            ? "default"
                            : "outline"
                        }
                        className="justify-start"
                        onClick={() => {
                          const features = projectData.features.includes(
                            feature
                          )
                            ? projectData.features.filter((f) => f !== feature)
                            : [...projectData.features, feature]
                          setProjectData({ ...projectData, features })
                        }}
                      >
                        {feature}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </StepItem>

          {/* Step 3: Review */}
          <StepItem step={3}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Review & Create
                </h2>
                <p className="text-muted-foreground">
                  Review your project configuration before creating it.
                </p>
              </div>

              <div className="space-y-4 rounded-lg border p-6">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    PROJECT NAME
                  </h3>
                  <p className="text-lg">{projectData.name || "Not set"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    DESCRIPTION
                  </h3>
                  <p className="text-sm">
                    {projectData.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    PROJECT TYPE
                  </h3>
                  <p>{projectData.type || "Not selected"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    FEATURES
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {projectData.features.length > 0 ? (
                      projectData.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No features selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
              >
                <Rocket className="mr-2 size-4" />
                Create Project
              </Button>
            </div>
          </StepItem>
        </StepPageContent>

        <StepPageFooter
          onNext={handleNext}
          nextLabel="Continue"
          prevLabel="Back"
        />
      </StepPage>
    </div>
  )
}
