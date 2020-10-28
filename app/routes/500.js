import React from 'react'

export function meta() {
  return {title: 'Oh no!'}
}

export default function FiveHundred() {
  return (
    <div className="server-error">
      <h1>500</h1>
    </div>
  )
}
