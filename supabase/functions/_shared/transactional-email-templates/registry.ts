/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface EditableField {
  key: string
  label: string
  type: 'text' | 'textarea'
}

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
  editableFields?: EditableField[]
  defaults?: Record<string, any>
}

import { template as newsletterWelcome } from './newsletter-welcome.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'newsletter-welcome': newsletterWelcome,
}
