'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { SecurityAnalysisDialog } from "./SecurityAnalysisDialog";

interface SecurityIssue {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  recommendation: string
  example?: string
  learnMoreUrl?: string
}

interface SecurityCategory {
  id: string
  name: string
  description: string
  issues: SecurityIssue[]
}

export function SecurityAnalysis() {
  return (
    <div className="flex justify-end p-2">
      <SecurityAnalysisDialog />
    </div>
  );
} 