# 📸 Single Image Upload Option

## 🎯 **New Feature: Single vs Multiple Image Upload**

I've added a **toggle option** that allows users to choose between uploading a **single image** or **multiple images** for their products.

## ✨ **How It Works**

### **1. Upload Mode Toggle**

Users now see a **radio button selection** at the top of the upload area:

```
┌─────────────────────────────────────┐
│  ○ Single Image  ● Multiple Images │
└─────────────────────────────────────┘
```

### **2. Single Image Mode**

When **"Single Image"** is selected:

#### **Interface Changes**
- ✅ **Label changes** to "Product Image" (singular)
- ✅ **Upload text** changes to "Click to upload image"
- ✅ **Description** changes to "Upload a single image for your product"
- ✅ **File input** disables multiple selection
- ✅ **Preview** shows single image in center
- ✅ **No main image badge** (since there's only one)
- ✅ **Upload button** says "Upload Image"

#### **Behavior Changes**
- ✅ **Only one image** can be selected at a time
- ✅ **Previous selection** is cleared when new image is chosen
- ✅ **Drag & drop** works for single image
- ✅ **File validation** still applies (5MB limit, image formats)

### **3. Multiple Images Mode**

When **"Multiple Images"** is selected (default):

#### **Interface Changes**
- ✅ **Label changes** to "Product Images" (plural)
- ✅ **Upload text** changes to "Click to upload images"
- ✅ **Description** changes to "Upload multiple images for your product"
- ✅ **File input** enables multiple selection
- ✅ **Preview** shows grid of images
- ✅ **Main image badge** shows on first image
- ✅ **Upload button** says "Upload Images"

## 🎨 **Visual Differences**

### **Single Image Mode**
```
┌─────────────────────────────────────┐
│  Product Image                      │
│                                     │
│  🎯 Click to upload image          │
│  Upload a single image for your     │
│  product (max 5MB)                  │
│                                     │
│  [Single Image Preview]             │
│                                     │
│  [Upload Image] [Clear Selection]   │
└─────────────────────────────────────┘
```

### **Multiple Images Mode**
```
┌─────────────────────────────────────┐
│  Product Images                     │
│                                     │
│  🎯 Click to upload images         │
│  Upload multiple images for your    │
│  product (max 5MB each)            │
│                                     │
│  [IMG1] [IMG2] [IMG3]             │
│   ⭐Main  🗑️Del  🗑️Del            │
│                                     │
│  [Upload Images] [Clear Selection]  │
└─────────────────────────────────────┘
```

## 🚀 **User Experience**

### **For Single Image Upload**
1. **Select "Single Image"** radio button
2. **Click upload area** or drag single image
3. **Preview single image** in center
4. **Click "Upload Image"** to upload
5. **Success** - Single image saved

### **For Multiple Image Upload**
1. **Select "Multiple Images"** radio button (default)
2. **Click upload area** or drag multiple images
3. **Preview all images** in grid
4. **Click "Upload Images"** to upload
5. **Success** - Multiple images saved

## 📱 **Responsive Design**

### **Mobile Experience**
- ✅ **Touch-friendly** radio buttons
- ✅ **Single image** takes full width on mobile
- ✅ **Multiple images** stack vertically on small screens
- ✅ **Optimized spacing** for touch interaction

### **Desktop Experience**
- ✅ **Hover effects** on radio buttons
- ✅ **Single image** centered with max-width
- ✅ **Multiple images** in responsive grid
- ✅ **Keyboard navigation** support

## 🔧 **Technical Implementation**

### **New Reactive Variables**
```javascript
const uploadMode = ref('multiple') // 'single' or 'multiple'
```

### **Conditional File Input**
```vue
<input
  :multiple="uploadMode === 'multiple'"
  @change="handleFileSelect"
/>
```

### **Dynamic Text Content**
```vue
{{ uploadMode === 'single' ? $t('productImage') : $t('productImages') }}
{{ uploadMode === 'single' ? $t('clickToUploadSingle') : $t('clickToUpload') }}
```

### **File Processing Logic**
```javascript
if (uploadMode.value === 'single') {
  // Clear previous selection and only keep first file
  selectedFiles.value = []
  if (sizeValidFiles.length > 0) {
    selectedFiles.value.push(sizeValidFiles[0])
  }
} else {
  // Multiple mode - add all files
  sizeValidFiles.forEach(file => selectedFiles.value.push(file))
}
```

## 📋 **Translation Keys Added**

### **English**
- `singleImage`: "Single Image"
- `multipleImages`: "Multiple Images"
- `clickToUploadSingle`: "Click to upload image"
- `uploadSingleImageDescription`: "Upload a single image for your product (max 5MB)"
- `orDragAndDropSingle`: "or drag and drop"
- `uploadImage`: "Upload Image"
- `image`: "image"

### **Arabic**
- `singleImage`: "صورة واحدة"
- `multipleImages`: "صور متعددة"
- `clickToUploadSingle`: "انقر لرفع صورة"
- `uploadSingleImageDescription`: "ارفع صورة واحدة لمنتجك (الحد الأقصى 5 ميجابايت)"
- `orDragAndDropSingle`: "أو اسحب وأفلت"
- `uploadImage`: "رفع صورة"
- `image`: "صورة"

## 🎯 **Use Cases**

### **Single Image Mode - Best For**
- ✅ **Simple products** with one main photo
- ✅ **Quick uploads** when you only have one image
- ✅ **Mobile users** who want faster upload
- ✅ **Basic listings** that don't need multiple angles
- ✅ **Testing** the upload functionality

### **Multiple Images Mode - Best For**
- ✅ **Detailed products** with multiple angles
- ✅ **Professional listings** with comprehensive photos
- ✅ **Desktop users** who want to showcase products
- ✅ **Complex items** that need multiple views
- ✅ **Marketing** products with various shots

## 🚀 **Benefits**

### **For Users**
1. **Flexibility** - Choose upload mode based on needs
2. **Simplicity** - Single image mode is faster and simpler
3. **Control** - Clear indication of what mode is active
4. **Efficiency** - No need to upload multiple images when only one is needed

### **For Developers**
1. **Reusable component** - Same component handles both modes
2. **Clean code** - Conditional logic based on mode
3. **Maintainable** - Easy to add more modes in future
4. **Consistent UX** - Same validation and error handling

## 🎉 **Summary**

The new **Single Image Upload** option provides:

- ✅ **Toggle between single and multiple** image upload
- ✅ **Dynamic interface** that adapts to selected mode
- ✅ **Consistent validation** for both modes
- ✅ **Responsive design** for all devices
- ✅ **Internationalization** support for both languages
- ✅ **Enhanced user experience** with clear mode indication

Users can now choose the upload mode that best fits their needs, making the image upload process more flexible and user-friendly! 