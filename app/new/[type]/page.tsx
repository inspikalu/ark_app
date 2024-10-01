'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import PaoCreationForm from '@/components/new/PAOCreation'
import SortitionCreationForm from '@/components/new/SortitionCreationForm'
import { GovernanceType } from '@/components/create/DashboardSearch'
import ConvictionCreationForm from '@/components/new/ConvictionCreationForm'
import MilJuntaCreationForm from '@/components/new/MilitaryCreationForm'
// import PolycentricCreationForm from '@/components/new/PolycentricCreationForm'
import SociocracyCreationForm from '@/components/new/SociocracyCreationForm'
import FlatDaoCreationForm from '@/components/new/FlatCreationForm'

const validGovernanceTypes: GovernanceType[] = [
  'absolute-monarchy',
  'sortition',
  'conviction',
  'polycentric',
  'sociocracy',
  'military-junta',
  'flat-dao'
  // Add other valid governance types here as they are implemented
]

const PaoCreationPage: React.FC = () => {
  const params = useParams<{ type?: string }>()
  const governanceType = (params.type as GovernanceType) || 'absolute-monarchy'

  if (!validGovernanceTypes.includes(governanceType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-700 to-teal-900">
        <h1 className="text-3xl font-bold text-white">Invalid governance type</h1>
      </div>
    )
  }

  const renderForm = () => {
    switch (governanceType) {
      case 'absolute-monarchy':
        return <PaoCreationForm governanceType={governanceType} />
      case 'sortition':
        return <SortitionCreationForm governanceType={governanceType} />
      case 'conviction':
        return <ConvictionCreationForm governanceType={governanceType} />
      case 'military-junta':
        return <MilJuntaCreationForm governanceType={governanceType} />
      // case 'polycentric':
      //   return <PolycentricCreationForm governanceType={governanceType} />
      case 'sociocracy':
        return <SociocracyCreationForm governanceType={governanceType} />
      case 'flat-dao':
        return <FlatDaoCreationForm governanceType={governanceType} />
      // Add cases for other governance types as they are implemented
      default:
        return <div>Unsupported governance type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-700 to-teal-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8 capitalize">
        Create new {governanceType.replace('-', ' ')} PAO
      </h1>
      {renderForm()}
    </div>
  )
}

export default PaoCreationPage