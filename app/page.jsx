import FlipbookViewer from '@/app/_components/ui/flipbook-viewer/flipbook-viewer'
import React from 'react'

const Page = () => {
  return (
    <div className="h-screen flex items-center justify-center pt-16 md:pt-0">
      <FlipbookViewer pdfUrl='/demo.pdf' />
    </div>
  )
}

export default Page