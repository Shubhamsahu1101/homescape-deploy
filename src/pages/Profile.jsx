import React from 'react'
import { useSelector } from 'react-redux'
import { userUpdated, userDeleted, userLoggedOut } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [formData, setFormData] = React.useState({
    // username: currentUser.username,
    // email: currentUser.email,
    // password: currentUser.password,
    // avatar: currentUser.avatar,
    username: 'user1',
    email: 'user1@gmail.com',
    password: '',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/mern-estate-app-2c62a.appspot.com/o/profilepictures%2F1715950886868-pfp1.jpeg?alt=media&token=bb6d792b-eae2-48b7-bd48-bd49e27ad8dc',
  });
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newAvatar, setNewAvatar] = React.useState(undefined);
  const fileRef = React.useRef(null);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = `${Date.now()}-${image.name}`;
      const storageRef = ref(storage, `profilepictures/${filename}`);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      var newurl;

      if (newAvatar) {
        let promise = storeImage(newAvatar);
        await toast.promise(promise, {
          loading: 'Uploading...',
          success: 'Image uploaded',
          error: 'An error occurred',
        }).then((url) => {
          newurl = url;
        }).catch((error) => {
          console.log(error);
          toast.error('An error occurred (Max 2mb per Image)');
        });
      }

      var updatedFormData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        avatar: newAvatar ? newurl : formData.avatar,
      }

      // if (updatedFormData.username === currentUser.username) {
      //   delete updatedFormData.username;
      // }
      // if (updatedFormData.email === currentUser.email) {
      //   delete updatedFormData.email;
      // }
      // if (updatedFormData.password === '' || formData.password === currentUser.password) {
      //   delete updatedFormData.password;
      // }
      // if (updatedFormData.avatar === currentUser.avatar) {
      //   delete updatedFormData.avatar;
      // }

      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedFormData),
        }
      )
      const data = await res.json();

      if (data.message) {
        toast.error(data.message);
      }
      else {
        toast.success('User updated successfully');
        dispatch(userUpdated(data));
        navigate('/homescape-deploy/profile');
      }

    } catch (error) {
      console.log(error);
      toast.error('User could not be updated');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout');
      const data = await res.json();
      if (data.message) {
        toast.error(data.message);
      }
      else {
        toast.success('User logged out successfully');
        dispatch(userLoggedOut(data));
      }
    } catch (error) {
      console.log(error);
      toast.error('User could not be logged out');
    }
  }

  const deleteDialog = async () => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      } else {
        return toast.error('User not deleted');
      }
    });
  }

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      )
      const data = await res.json();

      if (data.message) {
        toast.error(data.message);
      }
      else {
        toast.success('User deleted successfully');
        dispatch(userDeleted(data));
      }

    } catch (error) {
      console.log(error);
      toast.error('User could not be deleted');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font font-semibold text-center mt-8'>Profile</h1>

      <div className='flex flex-col gap-4 mt-4'>
        <img src={newAvatar ? URL.createObjectURL(newAvatar) : formData.avatar} onClick={() => fileRef.current.click()} alt="avatar" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type='file' ref={fileRef} onChange={(f) => setNewAvatar(f.target.files[0])} accept='image/*' />
      </div>

      <hr className='border-t-2 border-gray-300 my-8' />

      <form onSubmit={handleUpdate} className='flex flex-col gap-4 mt-4'>
        <input type="text" onChange={handleChange} id='username' placeholder='username' value={formData.username} className='border p-3 rounded-lg' />
        <input type="email" onChange={handleChange} id='email' placeholder='email' value={formData.email} className='border p-3 rounded-lg' />
        <input type="password" onChange={handleChange} id='password' placeholder='new password?' className='border p-3 rounded-lg' />
        <button type='submit' disabled={loading} className='bg-stone-700 text-white p-3 rounded-lg hover:opacity-95'>{loading ? "Loading..." : "Update"}</button>
      </form>

      <hr className='border-t-2 border-gray-300 my-8' />

      <div className='flex gap-4 mt-4'>
        <Link to='/homescape-deploy/my-listings' className='bg-green-600 flex flex-1 text-white p-3 rounded-lg hover:opacity-95 justify-center' >
          <button disabled={loading} >My Listings</button>
        </Link>
        <button disabled={loading} onClick={handleLogout} className='bg-red-600 flex-1 text-white p-3 rounded-lg hover:opacity-95'>Logout</button>
        <button disabled={loading} onClick={deleteDialog} className='bg-stone-800 flex-1 text-white p-3 rounded-lg hover:opacity-95'>Delete Account</button>
      </div>
    </div>
  )
}

export default Profile