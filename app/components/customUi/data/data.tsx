import {
    MoveDown,
    MoveRight,
    MoveUp,
    CheckCircle2,
    Circle,
    XCircle,
    HelpCircle,
    Timer,
  } from "lucide-react"
  
  export const labels = [
    {
      value: "bug",
      label: "Bug",
    },
    {
      value: "feature",
      label: "Feature",
    },
    {
      value: "documentation",
      label: "Documentation",
    },
  ]
  
  export const statuses = [
    {
      value: "backlog",
      label: "Backlog",
      icon: HelpCircle,
    },
    {
      value: "todo",
      label: "Todo",
      icon: Circle,
    },
    {
      value: "in progress",
      label: "In Progress",
      icon: Timer,
    },
    {
      value: "done",
      label: "Done",
      icon: CheckCircle2,
    },
    {
      value: "canceled",
      label: "Canceled",
      icon: XCircle,
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "low",
      icon: MoveDown,
    },
    {
      label: "Medium",
      value: "medium",
      icon: MoveRight,
    },
    {
      label: "High",
      value: "high",
      icon: MoveUp    },
  ]