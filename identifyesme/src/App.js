import React, { useState } from "react";
import "./App.css";

function App() {
    const [image, setImage] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return ( <
        div className = "App" >
        <
        h1 > Drag & Drop or Upload Image < /h1> <
        div className = "dropzone"
        onDragOver = {
            (e) => {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        onDrop = { handleDrop } > {
            image ? ( <
                img src = { image }
                alt = "uploaded" / >
            ) : ( <
                p > Drop image here or click to upload < /p>
            )
        } <
        /div> <
        input type = "file"
        accept = "image/*"
        onChange = { handleUpload }
        /> < /
        div >
    );
}

export default App;