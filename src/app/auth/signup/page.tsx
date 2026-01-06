export const dynamic = "force-dynamic";
export const revalidate = 60;

import Logo from '@/components/forms/logo'
import SignupForm from '@/components/forms/Signupform'
import React from 'react'

function page() {
  return (
    <>
     <div className=" flex items-center justify-center min-h-screen bg-gray-50">
      <div className="mt-20 w-full max-w-md  rounded-2xl shadow-lg p-8">
        <Logo title='Create new Acount'/>
        <SignupForm />
      </div>
    </div>
    </>
  )
}

export default page
