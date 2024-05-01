// import React, { useState, useEffect } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import axios from 'axios';
// import Video from './Video';

// function VideoList() {
//     const [videos, setVideos] = useState([]);
//     const [hasMore, setHasMore] = useState(true);
//     const [page, setPage] = useState(0);

//     useEffect(() => {
//         loadMoreVideos();
//     }, []);

//     const loadMoreVideos = async () => {
//         try {
//             const res = await axios.get(`/api/videos?page=${page}`);
//             const newVideos = res.data;
//             if (newVideos.length === 0) {
//                 setHasMore(false);
//             } else {
//                 setVideos(videos => [...videos, ...newVideos]);
//                 setPage(page + 1);
//             }
//         } catch (error) {
//             console.error('Failed to fetch videos:', error);
//             setHasMore(false); // stop trying if there's an error
//         }
//     };

//     return (
//         <InfiniteScroll
//             dataLength={videos.length}
//             next={loadMoreVideos}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p style={{ textAlign: 'center' }}>
//                 <b>Yay! You have seen it all</b>
//             </p>}
//         >
//             {videos.map(video => (
//                 <Video key={video._id} src={video.url} />
//             ))}
//         </InfiniteScroll>
//     );
// }

// export default VideoList;


import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Video from './Video';
import v1 from '../../videos/video.mp4'

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    // Dummy video data
    const dummyVideos = [
        { _id: '1', url: v1 },
        { _id: '2', url: v1 },
        { _id: '3', url: v1 },
        { _id: '4', url: v1 },
        { _id: '5', url: v1 },
    ];

    useEffect(() => {
        loadMoreVideos();
    }, []);

    const loadMoreVideos = async () => {
        try {
            // Simulate API call delay
            setTimeout(() => {
                const startIndex = page * 2; // load 2 videos at a time
                const newVideos = dummyVideos.slice(startIndex, startIndex + 2);
                if (newVideos.length === 0) {
                    setHasMore(false);
                } else {
                    setVideos(videos => [...videos, ...newVideos]);
                    setPage(page + 1);
                }
            }, 500);
        } catch (error) {
            console.error('Failed to load videos:', error);
            setHasMore(false); // stop trying if there's an error
        }
    };

    return (
        <div className="container">
            {videos.map(video => (
                <div key={video._id} className={"videoItem"}>
                    <Video src={video.url} />
                </div>
            ))}
        </div>
    );
}

export default VideoList;
