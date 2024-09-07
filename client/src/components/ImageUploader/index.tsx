import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const CLOUDINARY_UPLOAD_PRESET = "sd1xay79";
const CLOUDINARY_CLOUD_NAME = "dlxtcvj93";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const PhotosUploader = ({
  addedPhotos,
  onChange,
  maxPhotos = 5,
}: {
  addedPhotos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadSingleImage = async (file: any) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
      withCredentials: false,
    });

    return res.data.secure_url;
  };

  const validateFiles = (files: any) => {
    const MAX_PHOTOS = maxPhotos;
    const MAX_FILE_SIZE = 7 * 1024 * 1024;

    if (files.length + addedPhotos.length > MAX_PHOTOS) {
      throw new Error(`You can only upload ${MAX_PHOTOS} photos`);
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        throw new Error("File size should not exceed 7MB");
      }
      if (!files[i].type.startsWith("image/")) {
        throw new Error("Uploaded file is not an image");
      }
    }
  };

  const compressImage = async (file: any) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error occurred while compressing image", error);
      return file;
    }
  };

  const handleImageUpload = async (e: any) => {
    setIsUploading(true);
    try {
      const files = e.target.files;

      validateFiles(files);

      const compressedFiles = await Promise.all(
        Array.from(files).map(compressImage)
      );

      const urls = await Promise.all(compressedFiles.map(uploadSingleImage));

      toast.success("Upload completed successfully");
      // @ts-ignore
      onChange((prev) => [...prev, ...urls]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  async function removePhoto(ev: any, filename: string) {
    ev.preventDefault();
    if (isUploading) {
      alert("Are you sure you want to delete this photo?");
      return;
    }
    onChange([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function selectAsMainPhoto(ev: any, filename: string) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }

  return (
    <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-1">
      {addedPhotos.length > 0 &&
        addedPhotos.map((link) => (
          <div className="h-32 flex w-full relative" key={link}>
            <img
              className="rounded-2xl  w-full object-cover"
              src={link}
              alt=""
            />
            <button
              type="button"
              onClick={(ev) => removePhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(ev) => selectAsMainPhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
            >
              {link === addedPhotos[0] && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {link !== addedPhotos[0] && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      {addedPhotos.length < maxPhotos && (
        <label
          className={`h-32 min-w-full cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-lg text-gray-600 ${isUploading ? "animate-pulse" : ""
            }`}
        >
          <input
            type="file"
            multiple
            disabled={isUploading}
            className="hidden"
            onChange={handleImageUpload}
          />
          {!isUploading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          )}
          {isUploading ? "Uploading..." : "Upload"}
        </label>
      )}
    </div>
  );
};

export default PhotosUploader;
