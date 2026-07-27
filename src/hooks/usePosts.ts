import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeed, createPost, toggleLike, hasUserLiked, uploadPostMedia } from '../api/posts'

const PAGE_SIZE = 10

export const usePosts = (userId) => {
  return useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam = 0 }) => getFeed(userId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined
    },
    initialPageParam: 0,
    staleTime: 1 * 60 * 1000,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      return createPost(data)
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const previousData = queryClient.getQueryData(['posts'])

      return { previousData }
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId, currentlyLiked }) =>
      toggleLike(postId, userId, currentlyLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useUploadPostMedia = () => {
  return useMutation({
    mutationFn: ({ userId, file }) => uploadPostMedia(userId, file),
  })
}
