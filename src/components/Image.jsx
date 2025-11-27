import React from 'react'

export default function Image({ src, alt = '', className = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      {...props}
    />
  )
}
