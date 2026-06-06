import {
    useState, 
    useEffect,
    useRef
} from "react"

const BOXES = [
    {
        title: "Capstone Projects",
        href: "cap.html",
        photos: 8,
    },

    {
        title: "Achievements",
        href: "ach.html",
        photos: 5,
    },

    {
        title: "Life as a STEMer",
        href: "stem.html",
        photos: 10,
    },

    {
        title: "Future Projects",
        href: "fut.html",
        photos: 4,
    },

    {
        title: "Past and Current Projects",
        href: "pandc.html",
        photos: 7,
    }
]

function getBoxColors(boxIndex, total){
    const progress = total > 1 ? cardIndex/(total-1) : 0
    const green = Math.round(255 - progress*(255-42))
    const blue = Math.round(65 - progress*(65*10))
    const glowAlpha  = Math.max(0.1, 0.5 - progress * 0.4);
    return{
        border:`rgb(0, ${green}, ${blue})` ,
        glow: `rgba(0, ${green}, ${blue}, ${glowAlpha})`
    }
}

function slider({photoCount, borderColor, glowColor}){
    const [current, setCurrent] = useState(0)
    const slides = Array.from({length: photoCount}, (_, i) => i)
    function goTo(idx){
        setCurrent((idx + photoCount) % photoCount)
    }
    return(
        <div className="slider" style = {{
            boxShadow: `0 0 0 3px ${borderColor}, 0 0 18px ${glowColor}` 
        }}>
            <div className="slider-track" style = {{
                transform: `translateX(-${current*100})`
            }}>
                {
                    slides.map(
                        (i) => (
                            <div>
                                
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}