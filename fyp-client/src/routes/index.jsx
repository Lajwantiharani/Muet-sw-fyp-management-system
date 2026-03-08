import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoutes, AuthGuard } from "@components";
import { AuthLayout, DashboardLayout } from "@layouts";
import { Signup, Signin, NotFound, Unauthorized, ForgotPassword, Dashboard, ManageAccounts, ProfileSettings, MyIdeas, ManageProposals, ManageProjects, ManagePresentations, MyProject, ManageMeetings, MyPresentations, MyMeetings, PastProjects, ConfirmAccount, ResetPassword, Signout } from "@pages";
import { confirmAccountLoader, dashboardLoader, pitchIdeaButtonLoader, projectLoader } from "@loaders";

const router = createBrowserRouter([
  /** auth routes */
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/signup", element: <Signup /> },
          { path: "/signin", element: <Signin /> },
          {
            path: "/account-confirmation",
            loader: confirmAccountLoader,
            element: <ConfirmAccount />
          },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      }
    ]
  },

  /** protected routes */
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, loader: dashboardLoader, element: <Dashboard /> },
          { path: "/profile", element: <ProfileSettings /> },
          {
            path: "/previous-projects", children: [
              { index: true, element: <PastProjects status="past" key="past" /> },
              { path: "my-supervised", element: <PastProjects status="supervised" key="supervised" /> }
            ]
          },
        ],
      },
      { path: "signout/:token", element: <Signout /> },
    ],
  },

  /**  role-base access control routes (admin, supervisor) */
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={["admin", "supervisor"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/projects",
            children: [
              { index: true, element: <ManageProjects status="all" key="all" /> },
              { path: 'initialized', element: <ManageProjects status="initialized" key="initialized" /> },
              { path: 'under-development', element: <ManageProjects status="underDevelopment" key="underDevelopment" /> },
              { path: 'completed', element: <ManageProjects status="completed" key="completed" /> },
            ]
          },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/presentations",
            children: [
              { index: true, element: <ManagePresentations status="all" key="all" /> },
              { path: 'pending-review', element: <ManagePresentations status="pendingReview" key="pendingReview" /> },
              { path: 'approved', element: <ManagePresentations status="approved" key="approved" /> },
              { path: 'rejected', element: <ManagePresentations status="rejected" key="rejected" /> },
            ]
          },
        ],
      },
    ]
  },

  /** role-base access control routes (admin only) */
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/accounts",
            children: [
              { path: 'admins', element: <ManageAccounts roleOrStatus="admin" key="admin" /> },
              { path: 'supervisors', element: <ManageAccounts roleOrStatus="supervisor" key="supervisor" /> },
              { path: 'students', element: <ManageAccounts roleOrStatus="student" key="student" /> },
              { path: 'pending', element: <ManageAccounts roleOrStatus="approvalPending" key="pending" /> },
              { path: 'rejected', element: <ManageAccounts roleOrStatus="rejected" key="rejected" /> },
            ]
          },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/proposals",
            children: [
              { index: true, element: <ManageProposals status="all" key="all" /> },
              { path: 'accepted', element: <ManageProposals status="accepted" key="accepted" /> },
              { path: 'conditionally-accepted', element: <ManageProposals status="conditionallyAccepted" key="conditionallyAccepted" /> },
              { path: 'pending', element: <ManageProposals status="pending" key="pending" /> },
              { path: 'rejected', element: <ManageProposals status="rejected" key="rejected" /> },
            ]
          },
        ],
      },
    ],
  },

  /** role-base access control routes (supervisor only) */
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={["supervisor"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/meetings",
            children: [
              { index: true, element: <ManageMeetings status="all" key="all" /> },
              { path: 'past', element: <ManageMeetings status="past" key="past" /> },
              { path: 'scheduled', element: <ManageMeetings status="scheduled" key="scheduled" /> },
            ]
          },
        ],
      },
    ],
  },

  /** role-base access control routes (student only) */
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={["student"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/my-ideas", loader: pitchIdeaButtonLoader, element: <MyIdeas /> },
          { path: "/my-project", loader: projectLoader, element: <MyProject /> },
          { path: "/my-presentations", loader: projectLoader, element: <MyPresentations /> },
          { path: "/my-meetings", loader: projectLoader, element: <MyMeetings /> },
        ],
      },
    ],
  },

  /** unknown routes */
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> }
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
