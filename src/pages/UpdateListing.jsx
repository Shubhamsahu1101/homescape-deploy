import React from 'react'
import toast from 'react-hot-toast'
import { app } from '../../firebase';
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CreateListing = () => {
  const params = useParams();
  const [files, setFiles] = React.useState([]);
  const [formData, setFormData] = React.useState({
    imageUrls: [],
    title: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 0,
    bathrooms: 0,
    price: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(formData);

  React.useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);


  const handleChange = (e) => {

    if (e.target.id === 'sale') {
      setFormData({
        ...formData,
        type: 'sale',
      });
    }
    else if (e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: 'rent',
      });
    }
    else if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    else if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return toast.error('You must upload at least one image');
      }

      setLoading(true);
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();

      if (data.message) {
        toast.error(data.message);
      }
      else navigate(`/homescape-deploy/listing/${data._id}`);

    } catch (error) {
      console.log(error.message);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    if (files.length < 1) {
      return toast.error('You must select at least one image');
    }
    else if (formData.imageUrls.length + files.length > 6) {
      return toast.error('You can only upload a maximum of 6 images');
    }
    setUploading(true);
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }
    for (let i = 0; i < promises.length; i++) {
      toast.promise(promises[i], {
        loading: 'Uploading...',
        success: 'Image uploaded',
        error: 'An error occurred',
      }).then((url) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(url),
        });
      }).catch((error) => {
        console.log(error);
        toast.error('An error occurred (Max 2mb per Image)');
      }).finally(() => {
        if (i == promises.length - 1) setUploading(false);
      });
    }
  }

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = `${Date.now()}-${image.name}`;
      const storageRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        });
    })
  }

  const handleRemoveImage = (index) => {
    const newImages = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imageUrls: newImages,
    });
  }

  return (
    <main className='p-3 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='title'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />


          <div className='flex gap-2'>
            <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type == 'sale'} /> <span>Sale</span>
            <input type='checkbox' id='rent' className='w-5 ml-4' onChange={handleChange} checked={formData.type == 'rent'} /> <span>Rent</span>
            <input type='checkbox' id='parking' className='w-5 ml-4' onChange={handleChange} checked={formData.parking} /> <span>Parking Spot</span>
            <input type='checkbox' id='furnished' className='w-5 ml-4' onChange={handleChange} checked={formData.furnished} /> <span>Furnished</span>
          </div>


          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='price'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.price}
              />
              <div className='flex flex-col items-center'>
                <p>Price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>Rs/month</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 flex-1'>
          <div className='flex'>
            <p className='font-semibold mr-2'> Images </p>
            <span>The First Image will be the cover (Max 6)</span>
          </div>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-grey-300 rounded-lg w-full' type="file" id='images' accept='image/*' multiple />
            <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded-lg hover:opacity-80 disabled-opacity-50'>{uploading ? 'Uploding...' : 'Upload'}</button>
          </div>
          <div>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between p-3 border items-center'
                >
                  <img
                    src={url}
                    alt='listing image'
                    className='h-40 object-contain rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button disabled={uploading} className='p-3 bg-green-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80'>
            Update Listing
          </button>
        </div>
      </form>
    </ main>
  )
}

export default CreateListing