import { collection, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { Post, postState, PostVote } from '../atoms/postsAtom';
import { auth, firestore, storage } from '../firebase/clientApp';

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    // check for a user => if not, open auth modal

    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post }; // create copies of state, and modify copies
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      //New vote
      if (!existingVote) {
        // create a new postVote document
        const postVoteRef = doc(
          collection(firestore, 'users', `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        // add/subtract 1 to/from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      // Existing vote - they have voted on the post before
      else {
        const postVoteRef = doc(
          firestore,
          'users',
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // Removing their vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === vote) {
          // add/subtract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          // delete the postVote document
          batch.delete(postVoteRef);

          voteChange *= -1;
        }

        // Flipping their vote (up -> down or down => up)
        else {
          // add/subtract 2 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };

          // updating the existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }

      // update our post document
      const postRef = doc(firestore, 'posts', post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      // update state with updated values
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error) {
      console.error('onVote error', error);
    }
  };

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if image, delete if exists
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post document from firestore
      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
