import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';

import Logout from '@/views/Logout.vue';
import Home from '@/views/Home.vue';
import Errorr from '@/components/pages/Errorr.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import AddProduct from '@/views/AddProduct.vue';
import ProductDetails from '@/views/ProductDetails.vue';

const routes = [
  { path: '/', redirect: '/login' },
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
    meta: { requiresAuth: true, requiresVerifiedEmail: true },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  // Use onAuthStateChanged to ensure auth state is resolved
  onAuthStateChanged(auth, (user) => {
    if (to.meta.requiresAuth && !user) {
      // Redirect to login if authentication is required and user is not logged in
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to access this page.',
        timer: 2000,
        showConfirmButton: false,
      });
      next('/login');
    } else if (to.meta.requiresVerifiedEmail && user && !user.emailVerified) {
      // Redirect to login if email is not verified
      Swal.fire({
        icon: 'warning',
        title: 'Email Verification Required',
        text: 'Please verify your email address to access this page.',
        timer: 3000,
        showConfirmButton: true,
      });
      next('/login');
    } else {
      next();
    }
  }, (error) => {
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