import dynamic from 'next/dynamic'
import React from 'react'

const FlipbookViewer = dynamic(() => import('@/app/_components/ui/flipbook-viewer/flipbook-viewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-white">Loading Viewer...</div>
})

const Page = () => {
  return (
    <div className="h-screen flex items-center justify-center pt-16 md:pt-0">
      <FlipbookViewer pdfUrl='/demo.pdf' />
    </div>
  )
}

export default Page