import React from 'react'
import { DynamicHeader } from '../header/dynamic'
import { Filters } from './filters'
import { useLocation } from 'react-router-dom'
import { AdmissionFilter } from './filters/admission'

export const AdvancedSearch = () => {
  return <>{useLocation().pathname === '/admissions/search' ? <AdmissionFilter /> : <AdmissionFilter />}</>
}
