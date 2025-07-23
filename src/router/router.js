import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

import Logout from '@/views/Logout.vue';
import Home from '@/views/Home.vue';
import Contact from '@/views/Contact.vue';
import Errorr from '@/components/pages/Errorr.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import AddProduct from '@/views/AddProduct.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import AllProducts from "../views/AllProducts.vue";
import AdminUsers from '@/views/admin/Users.vue'
import ProductsDashboard from '@/views/admin/AdminProducts.vue'; 
import CategoriesManager from '@/views/admin/CategoriesManager.vue';
import RentalDashboard from '@/views/admin/RentalDashboard.vue';
import UserRentals from '@/views/admin/UserRentals.vue';
import AdminReviews from '@/views/admin/AdminReviews.vue';

const routes = [
  // Fixed: Remove the circular redirect and add proper Contact route
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: false } // Adjust auth requirements as needed
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
  // Admin routes
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { layout: 'admin' }
  },
  {
    path: '/admin/products',
    name: 'ProductsDashboard',
    component: ProductsDashboard,
    meta: { layout: 'admin' }
  },
  {
    path: '/admin/categories',
    name: 'Categories',
    component: CategoriesManager,
    meta: { layout: 'admin' }
  },
  {
    path: '/rentals',
    name: 'Rentals',
    component: RentalDashboard,
    meta: { layout: 'admin' }
  },
  {
    path: '/admin/user/:userId/rentals',
    name: 'UserRentals',   
    component: UserRentals,
    meta: { layout: 'admin' }
  },
  {
    path: '/admin/reviews',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { layout: 'admin' }
  },
  // Error route should be last
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

router.beforeEach((to, from, next) => {
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

  checkAuth()
    .then((user) => {
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

      next();
    })
    .catch((error) => {
      console.error('Auth state error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'An error occurred while checking your authentication status. Please try again.',
        showConfirmButton: true,
      });
      next('/login');
    });
});

export default router;