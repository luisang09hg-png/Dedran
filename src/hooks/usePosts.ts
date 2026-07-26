import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { apiService } from "../api/posts"; 

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await apiService.posts.getAll()
      return response.data
    },
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiService.posts.create(data)
      return response.data
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const previousPosts = queryClient.getQueryData(['posts'])

      queryClient.setQueryData(['posts'], (old: any) => [
        {
          id: Date.now(),
          content: newPost.content,
          createdAt: new Date().toISOString(),
          author: {
            id: 'current-user',
            name: 'Current User',
            avatar: null,
          },
          ...newPost,
        },
        ...(old || []),
      ])

      return { previousPosts }
    },
    onError: (_err, _newPost, context: any) => {
      queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
