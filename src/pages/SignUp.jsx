import React from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if(data.message) {
        toast.error(data.message);
      }
      else {
        toast.success('Account created successfully');
        navigate('/homescape-deploy/login');
      }

    } catch (error) {
      console.log(error.message);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center mt-32'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
        <input type='text' onChange={handleChange} placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type='email' onChange={handleChange} placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type='password' onChange={handleChange} placeholder='password' id='password' className='border p-3 rounded-lg' />
        <button type='submit' disabled={loading} className='bg-stone-700 text-white p-3 rounded-lg hover:opacity-95'>
          {loading ? 'Loading...' : 'SIGN UP'}
        </button>
      </form>
      <div className='flex justify-center text-center mt-5'>
        <p>Already have an account?</p>
        <Link to='/login' className='ml-1 text-blue-700'>Login</Link>
      </div>
    </div>
  )
}

export default SignUp