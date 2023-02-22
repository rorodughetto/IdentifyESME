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
        h1 > Identify ESME < /h1> <
        div className = "button-container" >
        <
        button className = "add-image-btn"
        onClick = {
            () => document.getElementById("fileInput").click()
        } >
        Add Image <
        /button> < /
        div > <
        div className = "dropzone" > {
            image ? ( <
                img src = { image }
                alt = "uploaded" / >
            ) : ( <
                p > Drop image here or click to upload < /p>
            )
        } <
        /div> <
        input id = "fileInput"
        type = "file"
        accept = "image/*"
        onChange = { handleUpload }
        /> <
        button className = "submit-btn" > Submit < /button> </div >
    );



}

export default App;