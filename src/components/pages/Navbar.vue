<template>
    <div>
       <Disclosure as="nav" class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button -->
                    <DisclosureButton class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span class="sr-only">Open main menu</span>
                        <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>
                <div class="flex flex-1 items-center justify-end sm:justify-end">
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <router-link to="/" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" :class="{ 'bg-gray-900 text-white': $route.path === '/' }" aria-current="page">Home</router-link>
                            <router-link to="/products" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" :class="{ 'bg-gray-900 text-white': $route.path === '/products' }">Products</router-link>
                            <router-link to="/modify" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" :class="{ 'bg-gray-900 text-white': $route.path === '/modify' }">Add Product</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DisclosurePanel class="sm:hidden">
            <div class="space-y-1 px-2 pt-2 pb-3">
                <DisclosureButton as="router-link" to="/" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" :class="{ 'bg-gray-900 text-white': $route.path === '/' }" aria-current="page">Home</DisclosureButton>
                <DisclosureButton as="router-link" to="/products" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" :class="{ 'bg-gray-900 text-white': $route.path === '/products' }">Products</DisclosureButton>
                <DisclosureButton as="router-link" to="/modify" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" :class="{ 'bg-gray-900 text-white': $route.path === '/modify' }">Add Product</DisclosureButton>
            </div>
        </DisclosurePanel>
    </Disclosure>
    </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
</script>

<style lang="less" scoped>
</style>