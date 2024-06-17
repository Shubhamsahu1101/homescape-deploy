import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Header from './components/Header'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import MyListings from './pages/MyListings'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

const App = () => {
  return (
    <div>
      <Header />
      <Toaster />
      <Routes>
        <Route path="/homescape-deploy" element={<Home />} />
        <Route path="/homescape-deploy/about" element={<About />} />
        <Route path="/homescape-deploy/signup" element={<SignUp />} />
        <Route path="/homescape-deploy/login" element={<Login />} />
        <Route path='/homescape-deploy/search' element={<Search />} />
        <Route path="/homescape-deploy/create-listing" element={<CreateListing />} />
        <Route path="/homescape-deploy/my-listings" element={<MyListings />} />
        <Route path="/homescape-deploy/profile" element={<Profile />} />
        
        <Route element={<PrivateRoute />} >
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>

        <Route path="/homescape-deploy/listing/:listingId" element={<Listing />} />

      </Routes>
    </div>
  )
}

export default App