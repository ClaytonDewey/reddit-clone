import React from 'react';
import { useRecoilState } from 'recoil';
import { directoryMenuState } from '../atoms/directoryMenuAtom';

const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(
    directoryMenuState
  );

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  return { directoryState, toggleMenuOpen };
};
export default useDirectory;
