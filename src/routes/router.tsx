import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { RoleRoute } from './RoleRoute'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { SuspenseWrapper } from '@/components/common/SuspenseWrapper'
import ErrorPage from '@/pages/ErrorPage'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const HomePage = lazy(() => import('@/features/home/pages/HomePage'))

// ── Contributor+ ──────────────────────────────────────────────────────────────
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
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const SettingsPage = lazy(
  () => import('@/features/settings/pages/SettingsPage')
)

// ── Admin+ ────────────────────────────────────────────────────────────────────
const CategoriesPage = lazy(
  () => import('@/features/categories/pages/CategoriesPage')
)
const TagsPage = lazy(() => import('@/features/categories/pages/TagsPage'))
const AuthorsPage = lazy(() => import('@/features/authors/pages/AuthorsPage'))
const AffiliateLinksPage = lazy(
  () => import('@/features/affiliate/pages/AffiliateLinksPage')
)
const AffiliateLinkDetailPage = lazy(
  () => import('@/features/affiliate/pages/AffiliateLinkDetailPage')
)
const AffiliateReportsPage = lazy(
  () => import('@/features/affiliate/pages/AffiliateReportsPage')
)
const CreateAffiliateLinkPage = lazy(
  () => import('@/features/affiliate/pages/CreateAffiliateLinkPage')
)
const EditAffiliateLinkPage = lazy(
  () => import('@/features/affiliate/pages/EditAffiliateLinkPage')
)
const AnalyticsDashboardPage = lazy(
  () => import('@/features/analytics/pages/AnalyticsDashboardPage')
)
const StoryAnalyticsPage = lazy(
  () => import('@/features/analytics/pages/StoryAnalyticsPage')
)
const TopChaptersPage = lazy(
  () => import('@/features/analytics/pages/TopChaptersPage')
)
const TopStoriesPage = lazy(
  () => import('@/features/analytics/pages/TopStoriesPage')
)

// ── SuperAdmin ────────────────────────────────────────────────────────────────
const StaffPage = lazy(() => import('@/features/users/pages/StaffPage'))

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  {
    element: <PublicRoute />,
    errorElement: <ErrorPage />,
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

  // ── Protected ────────────────────────────────────────────────────────────────
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: '/', element: <Navigate to="/home" replace /> },

          // /home tự redirect theo role — không nằm trong RoleRoute nào
          {
            path: '/home',
            element: (
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            ),
          },

          // ── Contributor+ — không wrap RoleRoute, mọi staff đều vào được ────
          {
            path: '/profile',
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories',
            element: (
              <SuspenseWrapper>
                <StoriesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/create',
            element: (
              <SuspenseWrapper>
                <CreateStoryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:id',
            element: (
              <SuspenseWrapper>
                <StoryDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditStoryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:storyId/chapters',
            element: (
              <SuspenseWrapper>
                <ChaptersPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:storyId/chapters/create',
            element: (
              <SuspenseWrapper>
                <CreateChapterPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:storyId/chapters/:id',
            element: (
              <SuspenseWrapper>
                <ChapterDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/content/stories/:storyId/chapters/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditChapterPage />
              </SuspenseWrapper>
            ),
          },

          // ── Admin+ ─────────────────────────────────────────────────────────
          {
            element: <RoleRoute minRole="Admin" />,
            children: [
              {
                path: '/content/categories',
                element: (
                  <SuspenseWrapper>
                    <CategoriesPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/content/tags',
                element: (
                  <SuspenseWrapper>
                    <TagsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/content/authors',
                element: (
                  <SuspenseWrapper>
                    <AuthorsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/affiliate/links',
                element: (
                  <SuspenseWrapper>
                    <AffiliateLinksPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/affiliate/links/create',
                element: (
                  <SuspenseWrapper>
                    <CreateAffiliateLinkPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/affiliate/links/:id',
                element: (
                  <SuspenseWrapper>
                    <AffiliateLinkDetailPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/affiliate/links/:id/edit',
                element: (
                  <SuspenseWrapper>
                    <EditAffiliateLinkPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/affiliate/reports',
                element: (
                  <SuspenseWrapper>
                    <AffiliateReportsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/analytics',
                element: (
                  <SuspenseWrapper>
                    <AnalyticsDashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/analytics/top-stories',
                element: (
                  <SuspenseWrapper>
                    <TopStoriesPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/analytics/top-chapters',
                element: (
                  <SuspenseWrapper>
                    <TopChaptersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/analytics/stories/:storyId',
                element: (
                  <SuspenseWrapper>
                    <StoryAnalyticsPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },

          // ── SuperAdmin ─────────────────────────────────────────────────────
          {
            element: <RoleRoute minRole="SuperAdmin" />,
            children: [
              {
                path: '/users',
                element: (
                  <SuspenseWrapper>
                    <StaffPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────
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
