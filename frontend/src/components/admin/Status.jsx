'use client'

import { axiosApiInstance, getCookies, notify } from '@/app/library/helper'
import React from 'react'
import { useRouter } from 'next/navigation'


export default function Status({ Status, statusUrl }) {


    const token = (getCookies("admin_token"))

    const router = useRouter()
    const statushandler = () => {

        axiosApiInstance.patch(statusUrl, null, {

            headers: {

                Authorization: token ?? ""

            }

        }).then(
            (response) => {

                notify(response.data.msg, response.data.flag)
                if (response.data.flag === 1) {

                    router.refresh()

                }

            }

        ).catch(

            (err) => {
                console.log(err)
                notify("something went is wrong", 0)
            }

        )

    }

    return (
        <span
            onClick={statushandler}
            className={`inline-block px-3 py-1  text-xs font-medium rounded-full cursor-pointer 
        ${Status
                    ? "bg-green-100 text-green-800 dark:bg-green-600 dark:text-white"
                    : "bg-red-100 text-red-800 dark:bg-red-600 dark:text-white"
                }`}>
            {Status ? "Active" : "Inactive"}
        </span>

    )
}
