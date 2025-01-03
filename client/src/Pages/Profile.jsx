import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  updateFailure, 
  updateStart, 
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart
 } from '../redux/user/userSlice'; 

import {Link} from "react-router-dom";

export default function Profile() {

  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadPercent, setUploadPercent] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([])
  const [showListingLoading, setShowListingLoading] = useState(false);
  const [showListingError, setShowListingError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formDataObject = new FormData();
    formDataObject.append('file', file);
    formDataObject.append('upload_preset', 'mern_estate'); 

    try {
      setUploadPercent(0);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_STORAGE}/image/upload`,
        formDataObject,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            setUploadPercent(progress)
          }
        }
      );

      console.log('Image uploaded successfully:', response.data);
      setFormData({...formData, avatar: response.data.secure_url});
      setFileUploadError(false);
      setFile(null);
      setTimeout(
        () => {
          setUploadPercent(0);
        }, 2000
      );
    } catch (error) {
      return setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart())
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(updateFailure(data.error));
        return;
      }
      dispatch(updateSuccess(data));
      setUpdateProfileSuccess(true);
      
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {method: "DELETE"}
      );
  
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.error));
        return;
      }

      dispatch(deleteUserSuccess());

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    } 
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch("/api/auth/signout", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());

    } catch (error) {
      dispatch(signOutUserFailure());
    }
  }

  const handleShowUserListings = async () => {
    try {
      setShowListingLoading(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if(data.success === false){
        setShowListingLoading(false);
        setShowListingError(true);
        return;
      }

      setUserListings(data);
      setShowListingLoading(false);
      setShowListingError(false);

    } catch (error) {
      setShowListingLoading(false);
      setShowListingError(true);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <div className='text-sm text-center'>
        {
        fileUploadError 
        ? <p className='text-red-700'>Choisissez un fichier de moins de 2 Mb</p>
        : (uploadPercent >= 99 ? <p className='text-green-700'>Téléchargement réussi...</p> 
        : (uploadPercent > 0 && uploadPercent < 99 ? <p className='text-slate-700'>Uploading: {uploadPercent} %</p> 
        : null)
        )
        }
        </div>
        
        <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg" onChange={handleChange}/>

        <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg" onChange={handleChange}/>

        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange}/>

        <button
        type='submit'
        disabled={loading}
        className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Updating..." : "UPDATE"}
        </button>

        <Link
        className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' 
        to={"/show-listing"}>
          Create Listing
        </Link>


      </form>

      <div className="flex justify-between mt-5">
        <span
        onClick={handleDeleteUser}
        className="text-red-700 cursor-pointer">Delete account</span>

        <span
        onClick={handleSignOut}
        className="text-red-700 cursor-pointer">Sign out</span>
      </div>

        <button
        onClick={handleShowUserListings}
        className='text-green-700 w-full mt-2'>
          Show Listings
        </button>

      {error && <p>Erreur: {error}</p>}
      {updateProfileSuccess && <p className='text-green-700 mt-3'>User is updated successfully</p>}

      {
        userListings && userListings.length > 0
          && 
          <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
           { userListings.map((listing)=> (

          <div key={listing._id} className='flex border border-gray-500 rounded-lg p-3 justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img className='h-16 w-16 object-contain' src={listing.imageUrls[0]} alt="listing cover" />
            </Link>

          <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>

            <div className='flex flex-col items-center'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>

              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
        ))}
        </div>
      }
    </div>
  );
}
