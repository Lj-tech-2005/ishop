// components/website/Pagination.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({ total, limit }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get("page")) || 1
  const totalPages = Math.ceil(total / limit)

  const goToPage = (page) => {
    const query = new URLSearchParams(searchParams.toString())
    query.set("page", page)
    router.push(`?${query.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex  justify-center mt-6 gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-3 py-1 cursor-pointer border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => {
        const page = idx + 1
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 cursor-pointer py-1 border rounded ${page === currentPage ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        )
      })}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="px-3 cursor-pointer py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
