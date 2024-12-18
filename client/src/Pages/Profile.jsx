import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadPercent, setUploadPercent] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);

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
      setFileUploadError(false);
      setFile(null);
      setFormData({...formData, avatar: response.data.secure_url});
      setTimeout(
        () => {
          setUploadPercent(0);
        }, 2000
      );
    } catch (error) {
      return setFileUploadError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
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
        

        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />

        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg" />

        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          UPDATE
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
