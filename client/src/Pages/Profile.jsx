import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  updateFailure, 
  updateStart, 
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess
 } from '../redux/user/userSlice'; 

export default function Profile() {

  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadPercent, setUploadPercent] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const dispatch = useDispatch();
  
  console.log(formData.avatar);

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

      </form>

      <div className="flex justify-between mt-5">
        <span
        onClick={handleDeleteUser}
        className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      {error && <p>Erreur: {error}</p>}
      {updateProfileSuccess && <p className='text-green-700 mt-3'>User is updated successfully</p>}
    </div>
  );
}
