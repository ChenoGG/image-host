import React, { useState } from 'react';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    setUploadedImages(result.filePaths);
  };

  return (
    <div>
      <h2>Upload Images</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>

      {/* Display uploaded images */}
      <div>
        {uploadedImages.length > 0 && <h3>Uploaded Images</h3>}
        {uploadedImages.map((imagePath, index) => (
          <img
            key={index}
            src={`http://localhost:5000${imagePath}`}
            alt={`Uploaded #${index}`}
            style={{ width: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
