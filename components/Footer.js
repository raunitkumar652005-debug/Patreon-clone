import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white flex items-center justify-center px-4 h-16'>
      <div>
        <p className='text-center'>
          Copyright &copy; {new Date().getFullYear()} Patreon Clone - All rights reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer

