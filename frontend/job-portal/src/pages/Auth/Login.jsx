import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react'
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false, // Fixed typo: showPassorwd -> showPassword
    success: false,
  });

  // Validate Functions
  const validatePassword = (password) => {
    if (!password) return 'Password is Required';
    return '';
  };

  // Handling input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing again
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setFormState(prev => ({ ...prev, loading: true, errors: {} }));

    try {
      // Login API integration
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      console.log('Login response:', response.data);
      const { token, role } = response.data;
      
      if (token) {
        // Login user first
        login(response.data, token);
        
        // Set success state
        setFormState(prev => ({
          ...prev,
          loading: false,
          success: true,
          errors: {}
        }));

        // Redirect after showing success message
        setTimeout(() => {
          const redirectPath = role === 'employer' ? '/employer' : '/find-jobs';
          console.log('Redirecting to:', redirectPath);
          
          // Use window.location for reliable redirect if navigate fails
          try {
            navigate(redirectPath, { replace: true });
          } catch (navError) {
            console.log('Navigate failed, using window.location');
            window.location.href = redirectPath;
          }
        }, 1500); // Reduced timeout for faster UX
      } else {
        throw new Error('No token received');
      }

    } catch (error) {
      console.error('Login error:', error);
      setFormState(prev => ({
        ...prev, 
        loading: false,
        success: false,
        errors: {
          submit: error.response?.data?.message || 'Login failed. Please check your email and password.'
        }
      }));
    }
  };

  if (formState.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} // Fixed animation values
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'
        >
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome Back!
          </h2>
          <p className='text-gray-600 mb-4'>
            You have successfully logged in.
          </p>
          <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto' />
          <p className='text-sm text-gray-500 mt-2'>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'
      >
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome Back
          </h2>
          <p className='text-gray-600'>
            Sign in to your JobPortal account
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email' // Fixed: was 'name', should be 'email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder='Enter Your Email'
              />
            </div>
            {formState.errors.email && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={formState.showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder='Enter Your Password'
              />
              <button
                type='button'
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {formState.errors.password && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-red-700 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2' />
                {formState.errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={formState.loading}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
          >
            {formState.loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin' />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Sign Up Link */}
          <div className='text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <a href="/signup" className='text-blue-600 hover:text-blue-700 font-medium'>
                Create New Account
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;