import React from 'react'

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Applied': 'bg-blue-100 text-blue-800',
    'In review': 'bg-yellow-100 text-yellow-800',  // Fixed: was 'InReview'
    'Accepted': 'bg-green-100 text-green-800',     // Fixed: was 'Hired'
    'Rejected': 'bg-red-100 text-red-800',
  }
  
  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
      statusConfig[status] || 'bg-gray-100 text-gray-800'
    }`}>
      {status}
    </span>
  )
}
export default StatusBadge
