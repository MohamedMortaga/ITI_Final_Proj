import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config'; // Ensure this matches your setup
import Swal from 'sweetalert2';

import Logout from '@/views/Logout.vue';
import Home from '@/views/Home.vue';
import Contact from '@/views/Contact.vue';
import Errorr from '@/components/pages/Errorr.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import AddProduct from '@/views/AddProduct.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import AllProducts from '../views/AllProducts.vue';
import AdminUsers from '@/views/admin/Users.vue';
import ProductsDashboard from '@/views/admin/AdminProducts.vue';
import CategoriesManager from '@/views/admin/CategoriesManager.vue';
import RentalDashboard from '@/views/admin/RentalDashboard.vue';
import UserRentals from '@/views/admin/UserRentals.vue';
import AdminReviews from '@/views/admin/AdminReviews.vue';
import Overview from '@/views/Overview.vue';
import Features from '@/views/Features.vue';
import Pricing from '@/views/Pricing.vue';
import Careers from '@/views/Careers.vue';
import Help from '@/views/Help.vue';
import Privacy from '@/views/Privacy.vue';
import Terms from '@/views/Terms.vue';
import Cookies from '@/views/Cookies.vue';

const routes = [
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: false }
  },
  { 
    path: '/', 
    redirect: '/home' 
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { hideNavbar: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNavbar: true },
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home,
    meta: { requiresAuth: false, requiresVerifiedEmail: false },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: { requiresAuth: true },
  },
  {
    path: '/addProduct',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, requiresVerifiedEmail: true },
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: true, requiresVerifiedEmail: true },
  },
  { 
    path: '/all-products', 
    name: 'AllProducts', 
    component: AllProducts 
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
    meta: { requiresAuth: false }
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: { requiresAuth: false }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing,
    meta: { requiresAuth: false }
  },
  {
    path: '/careers',
    name: 'Careers',
    component: Careers,
    meta: { requiresAuth: false }
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: false }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    meta: { requiresAuth: false }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
    meta: { requiresAuth: false }
  },
  {
    path: '/cookies',
    name: 'Cookies',
    component: Cookies,
    meta: { requiresAuth: false }
  },
  // Admin routes
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'ProductsDashboard',
    component: ProductsDashboard,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'Categories',
    component: CategoriesManager,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/rentals',
    name: 'Rentals',
    component: RentalDashboard,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/user/:userId/rentals',
    name: 'UserRentals',   
    component: UserRentals,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reviews',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: Errorr,
    meta: { hideNavbar: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();

  const checkAuth = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          unsubscribe();
          resolve(user);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  };

  try {
    const user = await checkAuth();

    // Redirect authenticated users from auth pages
    if ((to.name === 'Login' || to.name === 'Signup') && user && user.emailVerified) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'You are already logged in',
        showConfirmButton: false,
        timer: 1500,
      });
      return next('/home');
    }

    // Handle auth requirements
    if (to.meta.requiresAuth && !user) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to access this page.',
        timer: 2000,
        showConfirmButton: false,
      });
      return next('/login');
    }

    // Handle email verification requirements
    if (to.meta.requiresVerifiedEmail && user && !user.emailVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Verification Required',
        text: 'Please verify your email address to access this page.',
        timer: 3000,
        showConfirmButton: true,
      });
      return next('/login');
    }

    // Handle admin role requirement
    if (to.meta.requiresAdmin && user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("User UID:", user.uid, "Role:", role); // Debug log
        if (role !== "admin") {
          Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You do not have permission to access this page.',
            timer: 2000,
            showConfirmButton: false,
          });
          return next('/home');
        }
      } else {
        console.log("No user document found for UID:", user.uid); // Debug log
        Swal.fire({
          icon: 'warning',
          title: 'Access Denied',
          text: 'User profile not found.',
          timer: 2000,
          showConfirmButton: false,
        });
        return next('/home');
      }
    }

    next();
  } catch (error) {
    console.error('Auth or role check error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: 'An error occurred while checking your authentication status. Please try again.',
      showConfirmButton: true,
    });
    next('/login');
  }
});

export default router;