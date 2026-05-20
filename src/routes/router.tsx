import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { SuspenseWrapper } from '@/components/common//SuspenseWrapper'
import ErrorPage from '@/pages/ErrorPage'
import { HomePage } from '@/features/home/pages/HomePage'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const CategoriesPage = lazy(
  () => import('@/features/categories/pages/CategoriesPage')
)
const TagsPage = lazy(() => import('@/features/categories/pages/TagsPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const AuthorsPage = lazy(() => import('@/features/authors/pages/AuthorsPage'))
const StoriesPage = lazy(() => import('@/features/stories/pages/StoriesPage'))
const StoryDetailPage = lazy(
  () => import('@/features/stories/pages/StoryDetailPage')
)
const CreateStoryPage = lazy(
  () => import('@/features/stories/pages/CreateStoryPage')
)
const EditStoryPage = lazy(
  () => import('@/features/stories/pages/EditStoryPage')
)
const ChaptersPage = lazy(
  () => import('@/features/chapters/pages/ChaptersPage')
)
const CreateChapterPage = lazy(
  () => import('@/features/chapters/pages/CreateChapterPage')
)
const EditChapterPage = lazy(
  () => import('@/features/chapters/pages/EditChapterPage')
)
const ChapterDetailPage = lazy(
  () => import('@/features/chapters/pages/ChapterDetailPage')
)

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          {
            path: '/login',
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            path: '/home',
            element: (
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/',
            element: <Navigate to="/home" replace />,
          },
          {
            path: '/content',
            children: [
              {
                path: 'categories',
                element: (
                  <SuspenseWrapper>
                    <CategoriesPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'tags',
                element: (
                  <SuspenseWrapper>
                    <TagsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'authors',
                element: (
                  <SuspenseWrapper>
                    <AuthorsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories',
                element: (
                  <SuspenseWrapper>
                    <StoriesPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:id',
                element: (
                  <SuspenseWrapper>
                    <StoryDetailPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/create',
                element: (
                  <SuspenseWrapper>
                    <CreateStoryPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:id/edit',
                element: (
                  <SuspenseWrapper>
                    <EditStoryPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:storyId/chapters',
                element: (
                  <SuspenseWrapper>
                    <ChaptersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:storyId/chapters/:id',
                element: (
                  <SuspenseWrapper>
                    <ChapterDetailPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:storyId/chapters/create',
                element: (
                  <SuspenseWrapper>
                    <CreateChapterPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stories/:storyId/chapters/:id/edit',
                element: (
                  <SuspenseWrapper>
                    <EditChapterPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <SuspenseWrapper>
        <UnauthorizedPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/404',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])
