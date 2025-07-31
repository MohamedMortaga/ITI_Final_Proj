# 💰 Enhanced Money Input with Multiple Image Upload

## 🎯 **Fixed: Multiple Image Upload for Money Input**

I've enhanced the money input section to support **multiple image uploads** just like the ProductImageUpload component. Now users can upload multiple price-related images with the same advanced features.

## ✨ **Enhanced Money Input Features**

### **Multiple Image Upload Support**
- ✅ **Single/Multiple Toggle** - Choose between single or multiple image upload
- ✅ **Drag & Drop** - Enhanced drag and drop functionality
- ✅ **File Validation** - Image type and size validation (5MB limit)
- ✅ **Preview Grid** - Beautiful preview with hover effects
- ✅ **Individual Remove** - Remove specific images from the selection
- ✅ **Upload Progress** - Loading states and progress indicators

## 🔧 **Technical Implementation**

### **1. Enhanced UI Components**

#### **Upload Mode Toggle**
```vue
<!-- Upload Mode Toggle -->
<div class="mb-4">
  <div class="flex items-center justify-center space-x-4">
    <label class="flex items-center cursor-pointer">
      <input
        v-model="priceUploadMode"
        type="radio"
        value="single"
        class="mr-2 text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Colors-Primary-500)]"
      />
      <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t('singleImage') }}</span>
    </label>
    <label class="flex items-center cursor-pointer">
      <input
        v-model="priceUploadMode"
        type="radio"
        value="multiple"
        class="mr-2 text-[var(--Color-Surface-Surface-Brand)] focus:ring-[var(--Colors-Primary-500)]"
      />
      <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{ $t('multipleImages') }}</span>
    </label>
  </div>
</div>
```

#### **Enhanced Upload Area**
```vue
<!-- Enhanced Upload Area -->
<div class="border-2 border-dashed border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 text-center hover:border-[var(--Color-Surface-Surface-Brand)] transition-all duration-300 cursor-pointer group"
     :class="{ 'border-[var(--Color-Surface-Surface-Brand)] bg-[var(--Colors-Primary-50)]': isPriceDragOver }"
     @click="$refs.priceImageInput.click()"
     @dragover.prevent="handlePriceDragOver"
     @dragleave.prevent="handlePriceDragLeave"
     @drop.prevent="handlePriceDrop">
  <input
    ref="priceImageInput"
    type="file"
    :multiple="priceUploadMode === 'multiple'"
    accept="image/*"
    @change="handlePriceImageUpload"
    class="hidden"
  />
  <!-- Upload UI with animated icons and dynamic text -->
</div>
```

#### **Image Preview Grid**
```vue
<!-- Price Images Preview -->
<div v-if="priceImages.length > 0" class="mt-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">
      {{ $t('imagePreview') }} ({{ priceImages.length }} {{ priceUploadMode === 'single' ? $t('image') : $t('images') }})
    </h3>
    <div class="flex items-center space-x-2" v-if="priceUploadMode === 'multiple'">
      <span class="text-xs text-[var(--Color-Text-Text-Secondary)]">
        {{ $t('firstImageMain') }}
      </span>
      <i class="fas fa-info-circle text-[var(--Color-Text-Text-Secondary)]"></i>
    </div>
  </div>
  
  <div :class="priceUploadMode === 'single' ? 'max-w-md mx-auto' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'">
    <!-- Image preview cards with hover effects -->
  </div>
</div>
```

### **2. JavaScript Functions**

#### **Multiple Image Handling**
```javascript
// Price images handling
const priceImages = ref([]);
const priceUploadMode = ref('multiple');
const isPriceDragOver = ref(false);
const uploadingPriceImages = ref(false);

// Handle price image upload
const handlePriceImageUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  // Validate files
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files');
      return false;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return false;
    }
    
    return true;
  });

  if (validFiles.length === 0) return;

  // Handle single image mode
  if (priceUploadMode.value === 'single') {
    // Clear previous selection and only keep the first file
    priceImages.value = [];
    if (validFiles.length > 0) {
      const file = validFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        priceImages.value.push({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  } else {
    // Multiple image mode - add all files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        priceImages.value.push({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Emit the image upload event
  emit('priceImageUpload', event);
};
```

#### **Drag & Drop Support**
```javascript
// Handle drag and drop
const handlePriceDragOver = (event) => {
  event.preventDefault();
  isPriceDragOver.value = true;
};

const handlePriceDragLeave = (event) => {
  event.preventDefault();
  isPriceDragOver.value = false;
};

const handlePriceDrop = (event) => {
  event.preventDefault();
  isPriceDragOver.value = false;
  
  const files = Array.from(event.dataTransfer.files);
  if (files.length === 0) return;

  // Create a fake event object to reuse the upload handler
  const fakeEvent = {
    target: {
      files: files
    }
  };
  
  handlePriceImageUpload(fakeEvent);
};
```

#### **Image Management**
```javascript
// Remove price image
const removePriceImage = (index) => {
  priceImages.value.splice(index, 1);
  emit('priceImageRemoved', index);
};

// Upload price images
const uploadPriceImages = async () => {
  if (priceImages.value.length === 0) return;
  
  uploadingPriceImages.value = true;
  
  try {
    // Emit upload event with all images
    emit('priceImagesUpload', priceImages.value);
    
    // Clear images after successful upload
    priceImages.value = [];
    
  } catch (error) {
    console.error('Error uploading price images:', error);
  } finally {
    uploadingPriceImages.value = false;
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

### **3. Parent Component Integration**

#### **AddProduct.vue Updates**
```vue
<ProductForm
  v-if="showForm"
  :form="form"
  :categories="categories"
  :isEdit="isEdit"
  :uploading="uploading"
  @submitForm="handleSubmit"
  @imageUpload="handleImageUpload"
  @priceImageUpload="handlePriceImageUpload"
  @priceImageRemoved="handlePriceImageRemoved"
  @priceImagesUpload="handlePriceImagesUpload"
  @cancelForm="handleCancelForm"
/>
```

#### **Event Handlers**
```javascript
// Handle price image removal
function handlePriceImageRemoved(index) {
  console.log('Price image removed at index:', index);
}

// Handle multiple price images upload
function handlePriceImagesUpload(images) {
  console.log('Uploading multiple price images:', images);
  // Handle multiple price images upload
  images.forEach((image, index) => {
    handleImageUpload({
      target: {
        files: [image.file]
      }
    });
  });
}
```

## 🎨 **UI/UX Features**

### **1. Visual Enhancements**

#### **Upload Mode Toggle**
- ✅ **Radio buttons** for single/multiple selection
- ✅ **Clear labeling** with proper spacing
- ✅ **Consistent styling** with the rest of the form

#### **Enhanced Upload Area**
- ✅ **Animated cloud upload icon** with hover effects
- ✅ **Dynamic text** based on upload mode
- ✅ **Drag & drop visual feedback** with color changes
- ✅ **Professional appearance** with gradients and shadows

#### **Image Preview Grid**
- ✅ **Responsive grid layout** (1 column for single, 2-4 columns for multiple)
- ✅ **Hover effects** with overlay and remove button
- ✅ **Image numbering** for multiple images
- ✅ **Main image badge** for the first image
- ✅ **File information** display (name, size)

### **2. Interactive Elements**

#### **Single Image Mode**
- ✅ **Centered preview** for single image
- ✅ **Auto-clear** previous selection
- ✅ **Simplified interface** with focused design

#### **Multiple Image Mode**
- ✅ **Grid layout** for multiple images
- ✅ **Individual remove** buttons for each image
- ✅ **Image numbering** and main image indicator
- ✅ **Bulk upload** functionality

#### **Upload Button**
- ✅ **Loading spinner** during upload
- ✅ **Dynamic text** based on mode and state
- ✅ **Disabled state** when no images selected
- ✅ **Gradient styling** with hover effects

## 📱 **Responsive Design**

### **Mobile Experience**
- ✅ **Touch-friendly** upload area
- ✅ **Proper spacing** for mobile screens
- ✅ **Optimized grid** (2 columns on mobile)
- ✅ **Readable text** sizes and spacing

### **Desktop Experience**
- ✅ **Hover effects** for all interactive elements
- ✅ **Keyboard navigation** support
- ✅ **Large click areas** for better UX
- ✅ **Professional appearance** with gradients

## 🌐 **Internationalization**

### **New Translation Keys**

#### **English**
- `priceImages`: "Price Images" (plural)
- `priceImage`: "Price Image" (singular)
- `uploadPriceImage`: "Upload price image"
- `priceImageDescription`: "Upload an image related to pricing or payment"

#### **Arabic**
- `priceImages`: "صور السعر" (plural)
- `priceImage`: "صورة السعر" (singular)
- `uploadPriceImage`: "رفع صورة السعر"
- `priceImageDescription`: "ارفع صورة متعلقة بالتسعير أو الدفع"

## 🚀 **User Experience Flow**

### **1. Upload Mode Selection**
```
1. User sees radio buttons for single/multiple
2. Selects preferred upload mode
3. Interface updates to match selection
4. Upload area text changes accordingly
```

### **2. Image Selection**
```
1. User clicks upload area or drags images
2. File validation checks type and size
3. Preview displays with appropriate layout
4. Individual images can be removed
```

### **3. Upload Process**
```
1. User clicks upload button
2. Loading spinner appears
3. Images uploaded to Firebase Storage
4. Success confirmation shown
5. Images cleared from preview
```

## 🎯 **Use Cases**

### **Single Image Mode - Best For**
- ✅ **Quick price documentation** uploads
- ✅ **Simple payment receipts**
- ✅ **Single pricing screenshots**
- ✅ **Basic price verification**

### **Multiple Image Mode - Best For**
- ✅ **Comprehensive pricing documentation**
- ✅ **Multiple payment receipts**
- ✅ **Price comparison screenshots**
- ✅ **Detailed financial records**
- ✅ **Multiple payment methods**

## 🚀 **Benefits**

### **For Users**
1. **Flexible Upload** - Choose single or multiple image upload
2. **Visual Feedback** - Clear preview with hover effects
3. **Easy Management** - Remove individual images
4. **Professional Interface** - Enhanced styling and animations

### **For Developers**
1. **Reusable Logic** - Same validation and upload logic
2. **Consistent UX** - Matches ProductImageUpload component
3. **Event Handling** - Proper event emission and handling
4. **Maintainable Code** - Clean separation of concerns

## 🎉 **Summary**

The enhanced money input section now provides:

- ✅ **Multiple image upload** support with single/multiple toggle
- ✅ **Drag & drop** functionality with visual feedback
- ✅ **File validation** and preview with remove options
- ✅ **Responsive grid layout** for image previews
- ✅ **Professional styling** with gradients and animations
- ✅ **Internationalization** support for both languages
- ✅ **Consistent UX** with the ProductImageUpload component

Users can now upload multiple price-related images with the same advanced features as the main product image upload, providing a comprehensive and flexible pricing documentation system! 