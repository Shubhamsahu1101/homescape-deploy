import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

const MyListings = () => {
    const [userListings, setUserListings] = React.useState([]);
    const [fetching, setFetching] = React.useState(true);
    const currentUser = useSelector((state) => state.user.currentUser);

    const getUserListings = async () => {
        try {
            const res = await fetch(`/api/listing/user-listings/${currentUser._id}`);
            const data = await res.json();

            if (data.message) {
                toast.error(data.message);
            }
            else {
                toast.success('Fetched Succesfully');
                setUserListings(data);
            }

        } catch (error) {
            console.log(error.message);
            toast.error('An error occurred');
        } finally {
            setFetching(false);
        }
    };

    const handleListingDelete = async (id) => {
        try {
            const res = await fetch(`/api/listing/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.message) {
                toast.error(data.message);
            }
            else {
                toast.success('Listing deleted successfully');
                getUserListings();
            }

        } catch (error) {
            console.log(error);
            toast.error('An error occurred');
        }
    }

    React.useEffect(() => {
        getUserListings();
    }, [])

    if (fetching) {
        return <p>Fetching your listings...</p>
    }
    else if (userListings.length < 1) {
        return <p>You have no listings yet.</p>
    }
    return (
        <div className='flex flex-col gap-4 mx-auto max-w-xl md:max-w-2xl lg:max-w-4xl'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>
                Your Listings
            </h1>
            {userListings.map((listing) => (
                <div key={listing._id} className='flex gap-2 items-center'>
                    <Link to={`/listing/${listing._id}`} className='hover:opacity-95 bg-stone-100 border rounded-lg p-3 flex flex-auto justify-between items-center gap-4'>

                        <img src={listing.imageUrls[0]} alt='listing cover' className='h-20 object-contain rounded-md' />

                        <div className='text-stone-700 font-semibold truncate flex-1' >
                            <p>{listing.title}</p>
                        </div>

                    </Link>
                    <div className='flex flex-col gap-2'>
                        <Link to={`/update-listing/${listing._id}`} className='hover:opacity-95 bg-green-600 w-32 border rounded-lg p-3 flex justify-center items-center gap-4' >
                            <p className='text-white'>UPDATE</p>
                        </Link>
                        <div onClick={() => handleListingDelete(listing._id)} className='hover:opacity-95 bg-red-600 w-32 border rounded-lg p-3 flex justify-center items-center gap-4' >
                            <p className='text-white'>DELETE</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MyListings