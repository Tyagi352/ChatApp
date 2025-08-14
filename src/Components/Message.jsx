import React from 'react'
import { HStack,Avatar,Text } from '@chakra-ui/react'
const Message = ({text,uri,user="other"}) => {
  return (
    <HStack alignSelf={user=="other"? 'flex-start': 'flex-end'} paddingX={"4"} paddingY={"2"} bg="gray.100" borderRadius={"base"} >
        {
              user ==="other" && <Avatar src={uri} />  
        }
        <Text>{text}</Text>
        {
            user ==="me" && <Avatar src={uri} />
        }
    </HStack>

   
  )
}

export default Message
