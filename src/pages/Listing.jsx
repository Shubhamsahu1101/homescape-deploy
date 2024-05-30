import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaEnvelope,
    FaMapMarkerAlt,
    FaParking,
    FaTag,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.message) {
                    toast.error(data.message);
                }
                else setListing(data);
            } catch (error) {
                console.log(error.message);
                toast.error('An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    if (loading) return <p className='text-center my-7 text-2xl'>Loading...</p>
    else if (!listing) return <p className='text-center my-7 text-2xl'>Listing not found</p>
    return (
        <main>
            <div>
                <div className="swiper-container w-11/12 md:w-4/6 mx-auto">
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation
                        className='mt-4'
                    >
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[32rem] rounded-md'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='flex flex-col w-11/12 md:w-3/5 mx-auto p-3 my-4 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.title}
                    </p>


                    <div className='flex gap-4 mt-3'>
                        <p className='bg-stone-700 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                    </div>


                    <p className='flex items-center mt-3 gap-2 text-stone-600  text-lg'>
                        <FaTag className='text-green-500' />
                        {listing.price.toLocaleString('en-IN')} Rs {listing.type === 'rent' && ' / month'}
                    </p>


                    <p className='flex items-center mt-3 gap-2 text-stone-600  text-lg'>
                        <FaMapMarkerAlt className='text-blue-500' />
                        {listing.address}
                    </p>


                    <ul className='text-green-900 font-semibold text-lg mt-3 flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg' />
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds `
                                : `${listing.bedrooms} bed `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths `
                                : `${listing.bathrooms} bath `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                            {listing.parking ? 'Parking spot' : 'No Parking'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg' />
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </li>
                    </ul>


                    <p className='text-stone-800 mt-3'>
                        <span className='font-semibold text-black'>Description - </span>
                        {listing.description}
                    </p>


                    <p className='flex items-center mt-3 gap-2 text-stone-600  text-lg'>
                        <FaEnvelope className='text-blue-500' />
                        {listing.contact}
                    </p>

                </div>
            </div>
        </main>
    );
}