# Product Image Upload Component Documentation

## Overview

The `ProductImageUpload` component is a comprehensive solution for handling multiple image uploads for specific products in the Rento application. It provides a user-friendly interface for uploading, previewing, and managing product images with Firebase Storage integration.

## Features

### ✅ Core Features
- **Multiple Image Upload**: Upload one or more images simultaneously
- **Image Preview**: Preview selected images before uploading
- **Firebase Storage Integration**: Automatic upload to Firebase Storage
- **Firestore Integration**: Save image URLs to Firestore document
- **Main Image Management**: Automatically sets the first image as main image
- **Image Deletion**: Remove individual images from current uploads
- **Progress Tracking**: Real-time upload progress with progress bar
- **Error Handling**: Comprehensive error handling with user feedback
- **Responsive Design**: Works on all device sizes

### 🔥 Advanced Features
- **File Validation**: Validates file types (images only) and sizes (max 5MB)
- **Drag & Drop Interface**: Modern upload interface with visual feedback
- **Image Management**: Delete existing images from the product
- **Real-time Updates**: Emits events when images are updated
- **Internationalization**: Full i18n support (English/Arabic)
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Component Structure

### Props
```javascript
props: {
  productId: {
    type: String,
    required: true
  }
}
```

### Events
```javascript
emits: ['imagesUpdated']
```

### Event Data Structure
```javascript
{
  imagePaths: string[],    // Array of image download URLs
  images: string[],        // Array of Firebase Storage paths
  img: string             // Main image URL (first image)
}
```

## Usage

### Basic Usage
```vue
<template>
  <ProductImageUpload
    :productId="productId"
    @imagesUpdated="handleImagesUpdated"
  />
</template>

<script setup>
import ProductImageUpload from '@/components/ProductImageUpload.vue'

const productId = 'your-product-id'

const handleImagesUpdated = (imageData) => {
  console.log('Images updated:', imageData)
  // Handle the updated image data
}
</script>
```

### Integration with Product Form
```vue
<template>
  <div class="product-form">
    <!-- Other form fields -->
    
    <!-- Image Upload Section -->
    <div class="form-section">
      <h3>Product Images</h3>
      <ProductImageUpload
        :productId="form.productId"
        @imagesUpdated="updateFormImages"
      />
    </div>
  </div>
</template>

<script setup>
import ProductImageUpload from '@/components/ProductImageUpload.vue'

const form = ref({
  productId: '',
  // other form fields
})

const updateFormImages = (imageData) => {
  form.value.imagePaths = imageData.imagePaths
  form.value.images = imageData.images
  form.value.img = imageData.img
}
</script>
```

## Firebase Storage Structure

### Storage Path
```
products/{productId}/{timestamp}_{filename}
```

### Example Paths
```
products/abc123/1703123456789_image1.jpg
products/abc123/1703123456790_image2.png
products/abc123/1703123456791_image3.webp
```

## Firestore Document Structure

### Before Upload
```javascript
{
  category: "Books",
  createdAt: (timestamp),
  details: "test",
  imagePath: "",
  imagePaths: [],
  images: [],
  img: "",
  isApproved: false,
  netProfit: 85,
  ownerName: "Rana Ahmed Abd Elfatah",
  price: 100,
  title: "test",
  userId: "Gj2whNHicCPH3yDqSm1IXOzht952"
}
```

### After Upload
```javascript
{
  category: "Books",
  createdAt: (timestamp),
  details: "test",
  imagePath: "",
  imagePaths: [
    "https://firebasestorage.googleapis.com/v0/b/test-7b62c.appspot.com/o/products%2Fabc123%2F1703123456789_image1.jpg?alt=media&token=...",
    "https://firebasestorage.googleapis.com/v0/b/test-7b62c.appspot.com/o/products%2Fabc123%2F1703123456790_image2.png?alt=media&token=..."
  ],
  images: [
    "products/abc123/1703123456789_image1.jpg",
    "products/abc123/1703123456790_image2.png"
  ],
  img: "https://firebasestorage.googleapis.com/v0/b/test-7b62c.appspot.com/o/products%2Fabc123%2F1703123456789_image1.jpg?alt=media&token=...",
  isApproved: false,
  netProfit: 85,
  ownerName: "Rana Ahmed Abd Elfatah",
  price: 100,
  title: "test",
  userId: "Gj2whNHicCPH3yDqSm1IXOzht952"
}
```

## File Validation

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### File Size Limits
- **Maximum size per file**: 5MB
- **Recommended size**: 1-3MB for optimal performance

### Validation Rules
```javascript
// File type validation
if (!file.type.startsWith('image/')) {
  error.value = `${file.name} is not an image file`
  return false
}

// File size validation
const maxSize = 5 * 1024 * 1024 // 5MB
if (file.size > maxSize) {
  error.value = `${file.name} is too large (max 5MB)`
  return false
}
```

## Error Handling

### Common Errors
1. **Invalid file type**: Non-image files are rejected
2. **File too large**: Files exceeding 5MB are rejected
3. **Upload failure**: Network or Firebase errors
4. **Product not found**: Invalid product ID
5. **Permission denied**: Firebase security rules

### Error Messages
```javascript
// File validation errors
"file.jpg is not an image file"
"file.jpg is too large (max 5MB)"

// Upload errors
"Failed to upload images. Please try again."
"Failed to delete image. Please try again."

// Network errors
"Network error. Please check your connection."
```

## Styling

### CSS Variables Used
```css
--Color-Text-Text-Primary
--Color-Text-Text-Secondary
--Color-Surface-Surface-Brand
--Color-Boarder-Border-Primary
--Colors-Primary-500
--Colors-Primary-600
```

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-3 column grid
- **Desktop**: 4 column grid

## Internationalization

### English Keys
```javascript
{
  "productImages": "Product Images",
  "clickToUpload": "Click to upload images",
  "uploadImagesDescription": "Upload multiple images for your product (max 5MB each)",
  "imagePreview": "Image Preview",
  "images": "images",
  "removeImage": "Remove image",
  "mainImage": "Main",
  "uploadImages": "Upload Images",
  "uploading": "Uploading...",
  "clearSelection": "Clear Selection",
  "currentImages": "Current Images",
  "deleteImage": "Delete image",
  "uploadProgress": "Upload Progress"
}
```

### Arabic Keys
```javascript
{
  "productImages": "صور المنتج",
  "clickToUpload": "انقر لرفع الصور",
  "uploadImagesDescription": "ارفع صور متعددة لمنتجك (الحد الأقصى 5 ميجابايت لكل صورة)",
  "imagePreview": "معاينة الصور",
  "images": "صور",
  "removeImage": "إزالة الصورة",
  "mainImage": "رئيسية",
  "uploadImages": "رفع الصور",
  "uploading": "جاري الرفع...",
  "clearSelection": "مسح الاختيار",
  "currentImages": "الصور الحالية",
  "deleteImage": "حذف الصورة",
  "uploadProgress": "تقدم الرفع"
}
```

## Performance Considerations

### Optimization Features
1. **Image Compression**: Automatic compression before upload
2. **Lazy Loading**: Images load only when needed
3. **Caching**: Browser caching for uploaded images
4. **Batch Upload**: Multiple images uploaded simultaneously
5. **Progress Tracking**: Real-time upload progress

### Best Practices
1. **Image Optimization**: Compress images before upload
2. **File Naming**: Use descriptive file names
3. **Batch Size**: Limit to 10 images per upload
4. **Error Recovery**: Implement retry mechanisms
5. **User Feedback**: Clear progress and status messages

## Security Considerations

### Firebase Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.metadata.userId;
    }
  }
}
```

### Validation
1. **File Type Validation**: Only image files allowed
2. **File Size Validation**: Maximum 5MB per file
3. **User Authentication**: Only authenticated users can upload
4. **Product Ownership**: Users can only upload to their own products

## Testing

### Test Cases
1. **File Selection**: Test multiple file selection
2. **File Validation**: Test invalid file types and sizes
3. **Upload Process**: Test successful and failed uploads
4. **Image Preview**: Test preview functionality
5. **Image Deletion**: Test image removal
6. **Progress Tracking**: Test progress bar functionality
7. **Error Handling**: Test error scenarios
8. **Responsive Design**: Test on different screen sizes

### Example Test Data
```javascript
const testFiles = [
  {
    name: 'test1.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024 // 1MB
  },
  {
    name: 'test2.png',
    type: 'image/png',
    size: 2 * 1024 * 1024 // 2MB
  }
]
```

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check Firebase configuration and permissions
2. **Images Not Displaying**: Check image URLs and CORS settings
3. **Slow Upload**: Optimize image sizes before upload
4. **Permission Denied**: Check Firebase security rules
5. **Component Not Loading**: Check import path and dependencies

### Debug Information
```javascript
// Enable debug logging
console.log('Upload progress:', uploadProgress.value)
console.log('Selected files:', selectedFiles.value)
console.log('Current images:', currentImages.value)
console.log('Error:', error.value)
```

## Future Enhancements

### Planned Features
1. **Image Cropping**: Built-in image cropping tool
2. **Image Filters**: Basic image filters and effects
3. **Bulk Operations**: Select and manage multiple images
4. **Drag & Drop**: Enhanced drag and drop interface
5. **Image Optimization**: Automatic image optimization
6. **Gallery View**: Enhanced image gallery display
7. **Image Zoom**: Click to zoom functionality
8. **Keyboard Navigation**: Full keyboard accessibility

### Integration Possibilities
1. **AI Image Recognition**: Automatic image tagging
2. **Image Search**: Search within uploaded images
3. **Image Analytics**: Track image performance
4. **CDN Integration**: Use CDN for faster image delivery
5. **Image Backup**: Automatic image backup system

## Conclusion

The `ProductImageUpload` component provides a robust, user-friendly solution for managing product images in the Rento application. It handles all aspects of image upload, from file selection to Firebase integration, with comprehensive error handling and user feedback.

The component is designed to be easily integrated into existing product forms and can be customized to meet specific requirements. With its responsive design and internationalization support, it provides a consistent experience across all devices and languages. 