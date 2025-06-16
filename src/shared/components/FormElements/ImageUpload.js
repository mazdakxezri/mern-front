import React, { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "./Button";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const MAX_FILE_SIZE = 500000; // 500KB

const ImageUpload = ({ id, center, onInput, errorText }) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = false;
    
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      
      // Check file type
      if (!MIME_TYPE_MAP[pickedFile.type]) {
        setIsValid(false);
        onInput(id, null, false);
        return;
      }
      
      // Check file size
      if (pickedFile.size > MAX_FILE_SIZE) {
        setIsValid(false);
        onInput(id, null, false);
        return;
      }

      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg, .png, .jpeg"
        onChange={pickedImageHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
