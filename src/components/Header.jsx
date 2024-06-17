import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
    // const {currentUser} = useSelector((state) => state.user);
    const currentUser = true;

    return (
        <header className='bg-neutral-200 shadow-md'>
            <div className='flex justify-between items-center max-w-full mx-auto p-3 pl-6'>
                <Link to='/homescape-deploy/'>
                    <h1 className=' font-bold text-sm sm:text-4xl flex flex-wrap'>
                        <span className='text-stone-500'>Home</span>
                        <span className='text-stone-700'>Scape</span>
                    </h1>
                </Link>
                
                <ul className='flex items-center gap-6'>
                    <Link to='/homescape-deploy/search'>
                        <li className='hidden sm:inline text-stone-700 hover:opacity-75 font-semibold text-xl'>
                            View Listings
                        </li>
                    </Link>
                    <Link to='/homescape-deploy/create-listing'>
                        <li className='hidden sm:inline text-stone-700 hover:opacity-75 font-semibold text-xl'>
                            Create Listing
                        </li>
                    </Link>
                    <Link to='/homescape-deploy/'>
                        <li className='hidden sm:inline text-stone-700 hover:opacity-75 font-semibold text-xl'>
                            Home
                        </li>
                    </Link>
                    <Link to='/homescape-deploy/about'>
                        <li className='hidden sm:inline text-stone-700 hover:opacity-75 font-semibold text-xl'>
                            About
                        </li>
                    </Link>
                    <Link to='/homescape-deploy/profile'>
                        {currentUser ? (
                            <img
                                className='rounded-full h-12 w-12 object-cover mr-3'
                                src={'https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/profilepictures%2F1715950886868-pfp1.jpeg?alt=media&token=bb6d792b-eae2-48b7-bd48-bd49e27ad8dc'}
                                alt='profile'
                            />
                        ) : (
                            <li className=' text-stone-700 hover:opacity-75 font-semibold text-xl'> Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header