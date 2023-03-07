import React, {useState, useEffect} from 'react';
import './App.css'
import {Photo} from "./Photo";

function App() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [limit] = useState<number>(6);
    const [start, setStart] = useState<number>(0);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const loadMore = () => {
        setStart(start + limit);
    };

    useEffect(() => {
        setIsMounted(true);
        fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}&_start=${start}`)
            .then((response) => response.json())
            .then((newPhotos: Photo[]) => {
                if (isMounted) {
                    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
                }
            })
            .catch((error) => console.log(error));
    }, [start, limit, isMounted]);

    const handleClick = (photo: Photo) => {
        setSelectedPhoto(photo);
    };

    const handleClose = () => {
        setSelectedPhoto(null);
    };

    return (
        <>
            <div className="photo-list-container">
                <h1>Photos</h1>
                <ul className="photo-list">
                    {photos.map((photo) => (
                        <li key={photo.id} className="photo-item" onClick={() => handleClick(photo)}>
                            <img src={photo.thumbnailUrl} alt={photo.title} className="photo-thumbnail"/>
                            <p className="photo-title">{photo.title}</p>
                        </li>
                    ))}
                </ul>
                <button className="load-more-button" onClick={() => loadMore()}>
                    Load More
                </button>
            </div>
            {selectedPhoto && (
                <div className="modal" data-testid={'modal-' + selectedPhoto.id}>
                    <div className="modal-content">
                        <span data-testid={'close-button-' + selectedPhoto.id} className="close"
                              onClick={handleClose}>&times;</span>
                        <img src={selectedPhoto.url} alt={selectedPhoto.title}/>
                        <p>{selectedPhoto.title}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
