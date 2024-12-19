import React, { useState } from 'react'
import axios from 'axios';

export default function CreateListing() {

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(null)
    const [uploading, setUploading] = useState(false);

    const storeImage = async (file) => {
        const cloudinaryUrl = "https://api.cloudinary.com/v1_1/diievnipd/image/upload";
        const uploadPreset = "mern_estate";

        const formDataObject = new FormData();
        formDataObject.append("file", file);
        formDataObject.append("upload_preset", uploadPreset);

        try {
            const res = await axios.post(cloudinaryUrl, 
                formDataObject,
                {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                    }
                }
            );

            return res.data.secure_url;
        } catch (error) {
            console.log("Erreur lors de l'upload sur Cloudinary :", error);
            throw error;
        }
    };

    const handleImageSubmit = async (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            const promises = Array.from(files).map((file) => storeImage(file)); // Parce que file est un FileList recupéré de puis le input de type file et ne possede pas la methode .map. Grace à Array, on repasse à un vrai tableau.

            try{
                setUploading(true);

                const urls = await Promise.all(promises); // Avec ca, urls contient une promesse qui se resout uniquement si toutes les promies sont resolues. Cette promesse combine toutes les autres promises.
                setFormData((prev) => ({
                    ...prev,
                    imageUrls: prev.imageUrls.concat(urls), // concat permettra d'avoir une liste d'URLS, et non une chaine de caractere comme le nom le fait penser.
                }));

                setUploading(false);
    
            }
            catch(error){
                setImageUploadError( "Erreur de telechargement");
                console.log(error);
            }
        }
        else{
            setImageUploadError("6 images maximum par listing");
        }
    }

    const handleDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => (
                i !== index
            )) 
    })
        
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form className='flex flex-col sm:flex-row gap-4'>

            <div className='flex flex-col gap-4 flex-1'>
                <input 
                type="text" 
                placeholder='Name' 
                className='p-3 rounded-lg border border-gray-300' 
                id="name" 
                maxLength="62" 
                minLength="10" 
                required/>

                <textarea 
                type="text" 
                placeholder='description' 
                className='p-3 rounded-lg border border-gray-300' 
                id="description"  
                required/>

                <input 
                type="text" 
                placeholder='Address' 
                className='p-3 rounded-lg border border-gray-300' 
                id="address" 
                required/>

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5'/>
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5'/>
                        <span>Rent</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5'/>
                        <span>Parking Spot</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5'/>
                        <span>Offer</span>
                    </div>
                    
                    
                </div>

                <div className='flex flex-wrap gap-6'>
                    
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg'
                        type="number" 
                        id ="bedrooms"
                        min="1" 
                        max="10" 
                        required/>
                        <p>Beds</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg'
                        type="number" 
                        id ="bathrooms"
                        min="1" 
                        max="10" 
                        required/>
                        <p>Baths</p>

                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg'
                        type="number" 
                        id ="regularPrice"
                        min="1" 
                        max="10" 
                        required/>

                        <div className='flex flex-col items-center'>
                        <p>Regular price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>

                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg'
                        type="number" 
                        id ="discountPrice"
                        min="1" 
                        max="10" 
                        required/>

                        <div className='flex flex-col items-center'>
                            <p>Discouted price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>

                    </div>

                </div>


            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>
                    Images: 
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover(max 6)</span>
                </p>


                <div className='flex gap-4'>
                    <input 
                    onChange={(e) => setFiles(e.target.files)}
                    className='p-3 border border-gray-300 rounded w-full'
                    type="file"
                    id='images'
                    accept='image/*'
                    multiple/>


                    <button 
                    onClick={handleImageSubmit}
                    disabled = {uploading}
                    type="button"
                    className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        {uploading ? "UPLOADING..." : "UPLOAD"}
                    </button>
                </div>

                <p className="text-red-700 text-sm">{imageUploadError}</p>

            <button 
            disabled = {uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>

            
        {
            (formData.imageUrls.length > 0) && formData.imageUrls.map((url, index) => (
                <div 
                className="flex justify-between p-3 border items-center"
                key={url}
                >
                    <img 
                    src={url} 
                    alt="listing image" 
                    className="w-28 h-28 object-contain rounded-lg"/>

                    <button 
                    type ="button"
                    onClick={() => handleDelete(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                </div>
                
            ))
        }

            </div>

        </form>
    </main> 
  )
}
