import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Flex bg='white' height='44px' padding='6px 12px'>
      <Flex align='center'>
        <Image src='/images/redditFace.svg' height='30px' alt='Logo' />
        <Image
          src='/images/redditText.svg'
          height='46px'
          alt='reddit'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {/* <Directory /> */}
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
