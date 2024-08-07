import { useEffect, useRef, useState } from "react"
import { hightlightsSlides } from "../constants"
import gsap from "gsap"
import { pauseImg, playImg, replayImg } from "../utils"
import { useGSAP } from "@gsap/react"

interface Video{
    isEnd: boolean,
    startPlay: boolean,
    videoId:number,
    isLastVideo: boolean,
    isPlaying: boolean,        
}

const VideoCarousel = () => {
    const videoRef = useRef<HTMLVideoElement[]>([])
    const videoSpanRef=useRef<HTMLSpanElement[]>([])
    const videoDivRef=useRef<HTMLSpanElement[]>([])
    const [video, setVideo]=useState<Video>({
        isEnd: false,
        startPlay: false,
        videoId:0,
        isLastVideo: false,
        isPlaying: false,        
    })
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying}=video
    useGSAP(() => {
        // slider animation to move the video out of the screen and bring the next video in
        gsap.to("#slider", {
          transform: `translateX(${-100 * videoId}%)`,
          duration: 2,
          ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
        });
    
        // video animation to play the video when it is in the view
        gsap.to("#video", {
          scrollTrigger: {
            trigger: "#video",
            toggleActions: "restart none none none",
          },
          onComplete: () => {
            setVideo((pre) => ({
              ...pre,
              startPlay: true,
              isPlaying: true,
            }));
          },
        });
      }, [isEnd, videoId])
    const [loadedData, setLoadedData]=useState<HTMLVideoElement[]>([])
    useEffect(()=>{
        if(loadedData.length>3){
            if(!isPlaying){
                videoRef.current[videoId].pause()
            }else{
                startPlay && videoRef.current[videoId].play()
            }
        }
    },[startPlay, videoId, isPlaying, loadedData])
    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
    
        if (span[videoId]) {
          // animation to move the indicator
          let anim = gsap.to(span[videoId], {
            onUpdate: () => {
              // get the progress of the video
              const progress = Math.ceil(anim.progress() * 100);
    
              if (progress != currentProgress) {
                currentProgress = progress;
    
                // set the width of the progress bar
                gsap.to(videoDivRef.current[videoId], {
                  width:
                    window.innerWidth < 760
                      ? "10vw" // mobile
                      : window.innerWidth < 1200
                      ? "10vw" // tablet
                      : "4vw", // laptop
                });
    
                // set the background color of the progress bar
                gsap.to(span[videoId], {
                  width: `${currentProgress}%`,
                  backgroundColor: "white",
                });
              }
            },
            // when the video is ended, replace the progress bar with the indicator and change the background color
            onComplete: () => {
              if (isPlaying) {
                gsap.to(videoDivRef.current[videoId], {
                  width: "12px",
                });
                gsap.to(span[videoId], {
                  backgroundColor: "#afafaf",
                });
              }
            },
          });
    
          if (videoId == 0) {
            anim.restart();
          }
    
          // update the progress bar
          const animUpdate = () => {
            anim.progress(
              videoRef.current[videoId].currentTime /
                hightlightsSlides[videoId].videoDuration
            );
          };
    
          if (isPlaying) {
            // ticker to update the progress bar
            gsap.ticker.add(animUpdate);
          } else {
            // remove the ticker when the video is paused (progress bar is stopped)
            gsap.ticker.remove(animUpdate);
          }
        }
      }, [videoId, startPlay])
    const handleProcess=(type:string, i:number=0)=>{
        switch (type){
            case 'video-end':
                setVideo((prevVideo)=>({...prevVideo, isEnd: true, videoId: i+1}))
                break
            case 'video-last':
                setVideo((prevVideo)=>({...prevVideo, isLastVideo: true}))
                break
            case 'video-reset':
                setVideo((prevVideo)=>({...prevVideo, isLastVideo: false, videoId: 0}))
                break
            case 'play':
                setVideo((prevVideo)=>({...prevVideo, isPlaying: true }))
                break
            case 'pause':
                setVideo((prevVideo)=>({...prevVideo, isPlaying: false }))
                break
            default:
                return video
        }
    }
    const handleLoadedMetaData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        setLoadedData((prev) => [...prev, e.currentTarget]);
      }
    const handlePlay = () => {
        setVideo((prevVideo) => ({ ...prevVideo, isPlaying: true }));
      }
  return (
    <>
        <div className="flex items-center">
            {
                hightlightsSlides.map((list, i)=>(
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                        <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                        <video
                            id="video"
                            className={`${list.id===2 && 'translate-x-44'} pointer-events-none`}
                            playsInline={true}
                            preload="auto"
                            muted
                            ref={(el: HTMLVideoElement) => { if (el) videoRef.current[i] = el; }}
                            onPlay={handlePlay}
                            onEnded={()=>{
                              i !== 3 ? handleProcess('video-end', i) : handleProcess('video-last')
                            }}
                            onLoadedMetadata={(e: any) => { handleLoadedMetaData(e) }}
                            >
                            <source src={list.video} type="video/mp4" />
                        </video>
                        </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text)=>(
                                    <p key={text} className="md:text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
        <div className="relative flex-center mt-10">
            <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                {
                    videoRef.current.map((_, i)=>(
                        <span key={i} ref={(el:HTMLSpanElement)=>( videoDivRef.current[i]=el)} className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer">
                            <span className="absolute h-full w-full rounded-full" ref={(el:HTMLSpanElement)=>( videoSpanRef.current[i]=el)}></span>{/*(el:HTMLSpanElement)=>(videoSpanRef.current[i]=el) is a function that sets the i-th element of videoSpanRef.current to el, where el is the actual DOM element of the <span>.*/}
                        </span>
                    ))
                }
            </div>
            <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
        </div>
    </>
  )
}
export default VideoCarousel