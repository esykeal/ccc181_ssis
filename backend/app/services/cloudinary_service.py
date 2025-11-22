import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv()

config = cloudinary.config(secure=True)

def upload_image(file_storage):
    """
    Uploads a file to Cloudinary and returns the secure URL.
    """
    try:
        upload_result = cloudinary.uploader.upload(
            file_storage,
            folder="student_sis/avatars" 
        )
        
        return upload_result.get("secure_url")
        
    except Exception as e:
        print(f"Cloudinary Error: {e}")
        return None