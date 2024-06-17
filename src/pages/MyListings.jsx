import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

const MyListings = () => {
    const [userListings, setUserListings] = React.useState([]);
    const [fetching, setFetching] = React.useState(true);
    const currentUser = useSelector((state) => state.user.currentUser);

    const offlineListings =
        [
            {
                "_id": "664472ef99de58ccec5b8129",
                "title": "Bungalow in Silent Meadows",
                "description": "A 3 BHK bungalow in the silent meadows, completely silent neighborhood plus school, malls nearby, medical facilities just 12 minutes away.",
                "address": "Readow, Silent Meadows Pune",
                "price": 9300000,
                "bathrooms": 4,
                "bedrooms": 3,
                "furnished": true,
                "parking": true,
                "type": "sale",
                "imageUrls": [
                    "https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/images%2F1715761833545-houseout2.jpeg?alt=media&token=d2845ea8-acd2-4142-b4d3-32c26143a036",
                    "https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/images%2F1715761840149-housein2.jpeg?alt=media&token=e9e33594-7e1f-4c87-a2ca-d6e6dec3bc10"
                ],
                "userRef": "6644691b99de58ccec5b8107",
                "contact": "user1@gmail.com",
                "createdAt": "2024-05-15T08:31:43.026Z",
                "updatedAt": "2024-05-15T08:31:43.026Z",
                "__v": 0
            },
            {
                "_id": "66446e1999de58ccec5b8110",
                "title": "2 BHK Riverside Society Pune",
                "description": "A spacious 2 BHK for a comfortable life for your family, spacious and airy, with plenty of sunlight.",
                "address": "101 A wing Riverside Society Pune",
                "price": 16000,
                "bathrooms": 2,
                "bedrooms": 2,
                "furnished": true,
                "parking": true,
                "type": "rent",
                "imageUrls": [
                    "https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/images%2F1715760888426-houseout.jpeg?alt=media&token=e73a821a-0e1f-45f0-b0ba-8111777a5894",
                    "https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/images%2F1715760896470-housein.jpeg?alt=media&token=3d28699d-322e-4ea4-8b88-6afe674e4152"
                ],
                "userRef": "6644691b99de58ccec5b8107",
                "contact": "user1@gmail.com",
                "createdAt": "2024-05-15T08:11:05.068Z",
                "updatedAt": "2024-05-15T08:15:03.842Z",
                "__v": 0
            }
        ]

    const getUserListings = async () => {
        setUserListings(offlineListings);
        setFetching(false);
        return;
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
                    <Link to={`/homescape-deploy/listing/${listing._id}`} className='hover:opacity-95 bg-stone-100 border rounded-lg p-3 flex flex-auto justify-between items-center gap-4'>

                        <img src={listing.imageUrls[0]} alt='listing cover' className='h-20 object-contain rounded-md' />

                        <div className='text-stone-700 font-semibold truncate flex-1' >
                            <p>{listing.title}</p>
                        </div>

                    </Link>
                    <div className='flex flex-col gap-2'>
                        <Link to={`/homescape-deploy/update-listing/${listing._id}`} className='hover:opacity-95 bg-green-600 w-32 border rounded-lg p-3 flex justify-center items-center gap-4' >
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