'use client'

import './index.css'

const AnimatedBackground = () => {
  return (
    <div className="sds-ambient-background" aria-hidden="true">
      <div className="sds-ambient-grid" />
      <div className="sds-ambient-glow sds-ambient-glow-top" />
      <div className="sds-ambient-glow sds-ambient-glow-center" />
      <div className="sds-ambient-column sds-ambient-column-left" />
      <div className="sds-ambient-column sds-ambient-column-right" />
      <div className="sds-ambient-noise" />
    </div>
  )
}

export default AnimatedBackground
