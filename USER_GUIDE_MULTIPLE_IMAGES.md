# 📸 How to Add Multiple Images to Your Products

## 🎯 **Where to Add Multiple Images**

### **Primary Location: Product Edit Form**

**Step-by-Step Instructions:**

1. **Go to your dashboard**
   - Login to your Rento account
   - Navigate to `/addProduct` page

2. **Find your product**
   - Look for your product in the list
   - Click the **"Edit"** button

3. **Add multiple images**
   - Scroll down to find **"Add More Images"** section
   - Click **"Click to upload images"**
   - Select multiple images from your device
   - Preview the images
   - Click **"Upload Images"**

## 📱 **Visual Guide**

### **Step 1: Access Edit Form**
```
┌─────────────────────────────────────┐
│  Your Items                        │
│                                     │
│  [Product Name] [Edit] [Delete]    │
│  [Product Name] [Edit] [Delete]    │
│  [Product Name] [Edit] [Delete]    │
└─────────────────────────────────────┘
```

### **Step 2: Find Upload Section**
```
┌─────────────────────────────────────┐
│  Edit Product                      │
│                                     │
│  [Product Title]                   │
│  [Category]                        │
│  [Price]                           │
│  [Location]                        │
│                                     │
│  ────────────────────────────────── │
│  Add More Images                   │
│  Upload additional images to       │
│  showcase your product from        │
│  different angles                  │
└─────────────────────────────────────┘
```

### **Step 3: Upload Interface**
```
┌─────────────────────────────────────┐
│  📁 Click to upload images         │
│                                     │
│  Upload multiple images for your    │
│  product (max 5MB each)            │
└─────────────────────────────────────┘
```

### **Step 4: Preview & Upload**
```
┌─────────────────────────────────────┐
│  Image Preview (3 images)          │
│                                     │
│  [IMG1] [IMG2] [IMG3]             │
│   Main   Del   Del                │
│                                     │
│  [Upload Images] [Clear Selection] │
└─────────────────────────────────────┘
```

## ✅ **What You Can Do**

### **Upload Features**
- ✅ **Select multiple images** at once
- ✅ **Preview images** before uploading
- ✅ **Upload to Firebase Storage** automatically
- ✅ **Progress tracking** with progress bar
- ✅ **Delete unwanted images** before upload

### **Management Features**
- ✅ **View current images** in your product
- ✅ **Delete individual images** from your product
- ✅ **Automatic main image** (first image becomes main)
- ✅ **Image organization** by upload order

## 📋 **File Requirements**

### **Supported Formats**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)

### **Size Limits**
- **Maximum per file**: 5MB
- **Recommended**: 1-3MB for best performance
- **Total images**: Up to 10 images per product

## 🔍 **Where Images Are Displayed**

### **1. Product Listings**
- Main image shows in product cards
- Grid view displays primary image

### **2. Product Details Page**
- Main image prominently displayed
- Additional images in gallery view
- Users can browse all images

### **3. Search Results**
- Main image appears in search results
- Thumbnail generation for performance

## 🛠 **Troubleshooting**

### **Common Issues**

**❌ Upload Fails**
- **Check**: File size under 5MB
- **Check**: Internet connection
- **Check**: File is an image format

**❌ Images Not Showing**
- **Try**: Refresh the page
- **Check**: Wait for upload to complete
- **Check**: Firebase permissions

**❌ Slow Upload**
- **Solution**: Compress images before upload
- **Check**: Image file size
- **Check**: Internet speed

## 🎯 **Best Practices**

### **For Better Results**
1. **Use high-quality images** (1200x800 pixels minimum)
2. **Compress images** to 1-3MB before upload
3. **Include multiple angles** of your product
4. **Put your best image first** (it becomes the main image)
5. **Use descriptive filenames** for organization

### **Image Tips**
- **Product photos**: Use good lighting
- **Multiple angles**: Show different sides
- **Close-ups**: Highlight important features
- **Action shots**: Show product in use
- **Background**: Use clean, simple backgrounds

## 🚀 **Quick Start**

1. **Login** to your Rento account
2. **Go to** `/addProduct` page
3. **Click "Edit"** on any product
4. **Scroll down** to "Add More Images"
5. **Click upload area** and select images
6. **Preview** and click "Upload Images"
7. **Done!** Your images are now saved

## 📞 **Need Help?**

- **Email**: support@rento.com
- **Live Chat**: Available on website
- **Help Center**: `/help` page
- **Documentation**: Check this guide

---

## 🎉 **Summary**

**Users can add multiple images in the Product Edit Form:**

1. **Location**: `/addProduct` → Edit Product
2. **Section**: "Add More Images" (appears when editing)
3. **Features**: Multiple upload, preview, progress tracking
4. **Storage**: Firebase Storage under `products/{productId}/`
5. **Display**: Main image + gallery view on product pages

The multiple image upload feature is now fully integrated into your Rento application! 