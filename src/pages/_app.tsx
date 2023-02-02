import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app';
import { theme } from '../chakra/theme';
import Layout from '../components/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

// https://www.youtube.com/watch?v=rCm5RVYKWVg - 13:56