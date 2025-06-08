'use client'

import { axiosApiInstance, notify } from '@/app/library/helper'
import React from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function Delete({ id, type }) {
  const router = useRouter()

  const deletehandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${type}/delete/${id}` // dynamically sets the URL like "brand/delete/123"

        axiosApiInstance.delete(url)
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success"
            })
            notify(res.data.msg, res.data.flag)
            router.refresh()
          })
          .catch((err) => {
            console.error(err)
            notify('Something went wrong', 0)
          })
      }
    })
  }

  return (
    <button
      onClick={deletehandler}
      className="px-4 py-1 cursor-pointer text-white bg-red-600 rounded-md hover:bg-red-700 transition"
    >
      Delete
    </button>
  )
}

