'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export function FilterControls() {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Success', label: 'Success' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search certificates..."
            className="pl-10"
          />
        </div>
        
        <Select
          options={statusOptions}
          placeholder="Filter by status"
        />
        
        <Input
          type="date"
          placeholder="Start date"
        />
        
        <Input
          type="date"
          placeholder="End date"
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filters applied</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Clear Filters
          </Button>
          <Button size="sm">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
