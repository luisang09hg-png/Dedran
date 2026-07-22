import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardNav } from '@/components/dashboard-nav'
import { CreatePostForm } from '@/components/create-post-form'
import { PostsList } from '@/components/posts-list'
import { getPosts } from '@/app/actions/posts'

export default async function PostsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const allPosts = await getPosts()

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-secondary">Share your achievements and connect with other professionals</p>
        </div>

        {/* Create Post Form */}
        <CreatePostForm />

        {/* Posts List */}
        <PostsList posts={allPosts} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
