import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

import Logout from '@/views/Logout.vue';
import Home from '@/views/Home.vue';
import Errorr from '@/components/pages/Errorr.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import AddProduct from '@/views/AddProduct.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import AllProducts from "../views/AllProducts.vue";
import AdminUsers from '@/views/admin/Users.vue'
import ProductsDashboard from '@/views/admin/AdminProducts.vue'; 
import CategoriesManager from '@/views/admin/CategoriesManager.vue';





const routes = [
  { path: '/', redirect: '/home' }, // Redirect to /home for unauthenticated access
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
    meta: { requiresAuth: false, requiresVerifiedEmail: false }, // Allow access without auth
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
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: Errorr,
    meta: { hideNavbar: true },
  },
  { path: "/all-products", name: "AllProducts", component: AllProducts },
  //admin
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  // Create a promise to handle the auth state
  const checkAuth = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          unsubscribe(); // Unsubscribe to prevent memory leaks
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
      // Redirect authenticated and email-verified users from login/signup to homepage
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

      // If route requires auth and user is not logged in
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

      // If route requires email verification and user is not verified
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

      // Proceed to the requested route
      next();
    })
    .catch((error) => {
      // Handle Firebase auth errors (e.g., network issues)
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