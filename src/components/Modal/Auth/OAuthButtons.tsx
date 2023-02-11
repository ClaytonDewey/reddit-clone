import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(
    auth
  );

  const createUserDocument = async (user: User) => {};

  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button
        variant='oauth'
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='/images/googlelogo.png'
          height='20px'
          alt='Google Logo'
          mr={2}
        />
        Continue with Google
      </Button>
      <Button variant='oauth'>Some Other Provider</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;

// https://www.youtube.com/watch?v=rCm5RVYKWVg
// 3:42:09
