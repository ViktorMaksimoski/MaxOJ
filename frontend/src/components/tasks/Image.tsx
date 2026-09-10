import { useEffect, useState } from "react";

export const Image = ({ id, txt }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        // setImage("baba");
        const getImage = async () => {
            const [pid, name] = id.split("/")
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/images/${pid}?name=${name}`;

            const res = await fetch(url)
            const data = await res.json();
            setImage(data.imageUrl)
        } 

        getImage()
    }, [id])

    return (
        <div>
            {image !== "NotFound" && image != null && image !== "" && (
                <div>
                    <img src={image} className="w-[95%] sm:w-[70%] mx-auto mt-4
                    h-72 border-4 border-blue-400 cursor-pointer" alt="" />

                    {txt !== "" && (
                        <div className="flex items-center justify-center mt-1">
                            <p className="text-sm text-blue-400 italic">{txt}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}