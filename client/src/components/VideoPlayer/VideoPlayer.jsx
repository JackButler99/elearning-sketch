import React, {useEffect, useRef} from 'react'
import videojs from 'video.js'

import 'video.js/dist/video-js.css';

// City
import '@videojs/themes/dist/city/index.css';

// Fantasy
import '@videojs/themes/dist/fantasy/index.css';

// Forest
import '@videojs/themes/dist/forest/index.css';

// Sea
import '@videojs/themes/dist/sea/index.css';


const VideoPlayer = ({options, themeName='Sea'}) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(()=>{ 
    const player = playerRef.current
    if (!player) {
      const videoElement = videoRef.current      
      videoElement.load()
      if (!videoElement) return
      
      playerRef.current = videojs(videoElement, options)
 
    }
    return ()=>{
      if (player){
        // player.dispose()
        playerRef.current=null
      }
    }
  }, [options, videoRef, playerRef])
  
  return (
    <div data-vjs-player  >
    <video id='videoPlayer' ref={videoRef} preload="true" className={`z-0 video-js vjs-big-play-centered w-[480px] h-[360px] md:w-[720px] md:h-[480px] lg:w-[1080px] lg:h-[640px] vjs-theme-${themeName}`}/>
    </div>
  )
}

export default VideoPlayer