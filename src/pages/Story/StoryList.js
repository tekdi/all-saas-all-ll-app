import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import PlaceHolder from '../../assests/Images/hackthon-images/sets.png'
import kannadaPlaceholder from '../../assests/Images/hackthon-images/knCol.png'
import Header from '../Header';

const StoryList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
     fetchApi();
  }, []);
  
  const fetchApi = async () => {
    try {
      const response = await fetch(`https://telemetry-dev.theall.ai/content-service/v1/collection`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
      localStorage.setItem('selectedStoryTitle', data.title);
      localStorage.setItem('sentenceCounter',0)
      // console.log(data.title);
    } catch (error) {
      console.error(error.message);
    }
  }
  localStorage.setItem('storyTitle','')
  const selectStoryTitle = (storyTitle,lang) =>{
    localStorage.setItem('storyTitle', storyTitle);
    localStorage.setItem('apphomelang',lang)
  }
      return (
        <>
        <Header/>
        <section className='bg'>
      <div className="" style={{ margin:'55px'}}>
        <div className="row">
          {/* <h1 style={{textAlign:'center'}}>My Stories</h1> */}
          {posts?.data?.map((post,ind) => (
            <Link to={`story/${post.collectionId}`} key={ind} >
             <Box
            onClick={()=> selectStoryTitle(post.title,post.language)}
            borderWidth="1px"
            borderRadius="10px"
            width="300px"
            backgroundColor="white"
            margin= '15px'
            display={"inline-block"}
             boxShadow="md"
             _hover={{ boxShadow: "lg" }}
             >
             
             <Image src={post.image == " "? post.language === 'kn'? kannadaPlaceholder : PlaceHolder:post.image} alt={post.title} width="100%" height="auto" />
             <Box textAlign={'center'} p="4">
                 <Text fontSize="xl" fontWeight="bold" lineHeight="1.1" mb="2">
                   {post.title}
                 </Text>
             </Box>
           </Box>
            </Link>
          ))}
        </div>
      </div>
      </section>
      <Text>Session Id: {localStorage.getItem('virtualStorySessionID')}</Text>
            </>
  )
}

export default StoryList