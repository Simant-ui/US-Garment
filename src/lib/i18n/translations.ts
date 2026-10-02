export type Language = 'en' | 'ne';

export interface Translations {
  topBar: {
    announcement: string;
    whatsappUs: string;
    callUs: string;
    location: string;
  };
  nav: {
    home: string;
    women: string;
    schoolUniform: string;
    houseDress: string;
    tShirts: string;
    dresses: string;
    trackSuits: string;
    customOrders: string;
    wholesale: string;
    account: string;
    login: string;
    myAccount: string;
    wishlist: string;
    cart: string;
    shop: string;
    about: string;
    contact: string;
    services: string;
    faq: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    shopCollection: string;
    customOrderBtn: string;
    wholesaleBtn: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    popularCategories: string;
    exploreCategories: string;
    featuredProducts: string;
    handpickedCollection: string;
    viewAllProducts: string;
    customTailoringBannerTitle: string;
    customTailoringBannerDesc: string;
    orderCustomNow: string;
    wholesaleBannerTitle: string;
    wholesaleBannerDesc: string;
    requestWholesaleQuote: string;
    whyChooseUs: string;
    whyChooseUsDesc: string;
    trustBadgeTitle: string;
    trustBadgeDesc: string;
  };
  shop: {
    title: string;
    subtitle: string;
    shop: string;
    products: string;
    categories: string;
    allProducts: string;
    searchProducts: string;
    searchPlaceholder: string;
    filter: string;
    sortBy: string;
    sortNewest: string;
    sortPriceLowHigh: string;
    sortPriceHighLow: string;
    sortPopular: string;
    price: string;
    size: string;
    color: string;
    quantity: string;
    available: string;
    inStock: string;
    outOfStock: string;
    addToCart: string;
    buyNow: string;
    addToWishlist: string;
    removeFromWishlist: string;
    productDetails: string;
    description: string;
    reviews: string;
    relatedProducts: string;
    quickView: string;
    noProductsFound: string;
    clearFilters: string;
    showingResults: string;
    categoryFilterAll: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    applyFilter: string;
    resetFilter: string;
    reviewsCount: string;
    noReviews: string;
    writeReview: string;
    rating: string;
    yourReview: string;
    submitReview: string;
  };
  cart: {
    shoppingCart: string;
    yourCart: string;
    product: string;
    price: string;
    quantity: string;
    subtotal: string;
    remove: string;
    continueShopping: string;
    orderSummary: string;
    discount: string;
    shipping: string;
    total: string;
    proceedToCheckout: string;
    emptyCart: string;
    emptyCartMsg: string;
    startShopping: string;
    clearCart: string;
    couponCode: string;
    applyCoupon: string;
    freeShippingTag: string;
  };
  checkout: {
    checkout: string;
    shippingAddress: string;
    fullName: string;
    phone: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
    area: string;
    street: string;
    landmark: string;
    paymentMethod: string;
    cod: string;
    esewa: string;
    bankTransfer: string;
    placeOrder: string;
    orderTotal: string;
    notes: string;
    selectProvince: string;
    selectDistrict: string;
    backToCart: string;
    processingOrder: string;
  };
  auth: {
    login: string;
    loginTitle: string;
    register: string;
    registerTitle: string;
    fullName: string;
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    forgotPassword: string;
    rememberMe: string;
    logout: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginNow: string;
    registerNow: string;
    resetPassword: string;
    sendResetLink: string;
    createAccount: string;
  };
  emailOtp: {
    verifyTitle: string;
    verifySubtitle: string;
    codeLabel: string;
    codePlaceholder: string;
    verifyButton: string;
    didntReceive: string;
    resendCode: string;
    expiresIn: string;
    invalidCode: string;
    verifiedSuccess: string;
  };
  customTailoring: {
    title: string;
    orderTitle: string;
    subtitle: string;
    garmentType: string;
    selectGarment: string;
    measurements: string;
    chest: string;
    waist: string;
    hip: string;
    shoulder: string;
    sleeveLength: string;
    dressLength: string;
    fabricPreference: string;
    colorPreference: string;
    designDescription: string;
    uploadReference: string;
    submitRequest: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
  };
  wholesale: {
    title: string;
    orderTitle: string;
    subtitle: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
    requiredQuantity: string;
    garmentCategory: string;
    message: string;
    requestQuote: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
  };
  account: {
    myAccount: string;
    myProfile: string;
    myOrders: string;
    wishlist: string;
    savedAddresses: string;
    accountSettings: string;
    editProfile: string;
    saveChanges: string;
    orderHistory: string;
    orderDetails: string;
    viewDetails: string;
    noOrders: string;
    noWishlist: string;
    noAddresses: string;
    addNewAddress: string;
  };
  orderStatus: {
    PENDING: string;
    CONFIRMED: string;
    PROCESSING: string;
    SHIPPED: string;
    DELIVERED: string;
    CANCELLED: string;
    PAID: string;
    UNPAID: string;
  };
  common: {
    save: string;
    update: string;
    edit: string;
    delete: string;
    cancel: string;
    confirm: string;
    submit: string;
    continue: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    view: string;
    viewAll: string;
    search: string;
    clear: string;
    apply: string;
    loading: string;
    rs: string;
  };
  systemMessages: {
    addedToCart: string;
    removedFromCart: string;
    cartCleared: string;
    orderPlaced: string;
    somethingWentWrong: string;
    pleaseTryAgain: string;
    requiredField: string;
    invalidEmail: string;
    passwordMismatch: string;
    noProductsFound: string;
    noOrdersFound: string;
    addedToWishlist: string;
    removedFromWishlist: string;
  };
  footer: {
    brandDesc: string;
    quickLinks: string;
    categories: string;
    customerService: string;
    contactInfo: string;
    rightsReserved: string;
    developedWith: string;
  };
  location: {
    title: string;
    subtitle: string;
    addressTitle: string;
    addressText: string;
    getDirections: string;
    gettingDirections: string;
    viewOnGoogleMaps: string;
    iframeTitle: string;
  };
  pages: {
    about: {
      title: string;
      subtitle: string;
      storyTitle: string;
      storyDesc: string;
      missionTitle: string;
      missionDesc: string;
    };
    contact: {
      title: string;
      subtitle: string;
      getInTouch: string;
      addressTitle: string;
      addressDesc: string;
      phoneTitle: string;
      emailTitle: string;
      workingHours: string;
      workingHoursValue: string;
      sendMessage: string;
      yourName: string;
      yourEmail: string;
      yourMessage: string;
      sendButton: string;
      messageSent: string;
    };
    faq: {
      title: string;
      subtitle: string;
    };
    privacy: {
      title: string;
    };
    terms: {
      title: string;
    };
    return: {
      title: string;
    };
    shipping: {
      title: string;
    };
    notFound: {
      title: string;
      desc: string;
      backHome: string;
    };
  };
  categories: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    topBar: {
      announcement: 'Quality Clothing, Our Pride is Your Trust | School Uniform • House Dress • Ladies Wear • Wholesale',
      whatsappUs: 'WhatsApp Us',
      callUs: 'Call Us',
      location: 'Hetauda, Nepal',
    },
    nav: {
      home: 'Home',
      women: 'Women',
      schoolUniform: 'School Uniform',
      houseDress: 'House Dress',
      tShirts: 'T-Shirts',
      dresses: 'Dresses',
      trackSuits: 'Track Suits',
      customOrders: 'Custom Orders',
      wholesale: 'Wholesale',
      account: 'Account',
      login: 'Login',
      myAccount: 'My Account',
      wishlist: 'Wishlist',
      cart: 'Cart',
      shop: 'Shop',
      about: 'About Us',
      contact: 'Contact',
      services: 'Services',
      faq: 'FAQ',
    },
    home: {
      heroBadge: 'US DRESSES & GARMENT UDYOG • HETAUDA, NEPAL',
      heroTitle: 'Quality Clothing,\nOur Pride is Your Trust',
      heroSubtitle: 'Premier garment manufacturer and retail store in Hetauda, Nepal. Specializing in high quality school uniforms, house dresses, custom tailoring, and wholesale supplies.',
      shopCollection: 'Shop Collection',
      customOrderBtn: 'Custom Tailoring Order',
      wholesaleBtn: 'Wholesale Inquiry',
      feature1Title: 'Premium Quality',
      feature1Desc: 'Best fabric & stitching',
      feature2Title: 'Custom Orders',
      feature2Desc: 'Tailored to your needs',
      feature3Title: 'Wholesale Support',
      feature3Desc: 'For schools & businesses',
      feature4Title: 'Hetauda, Nepal',
      feature4Desc: 'Local & trusted',
      popularCategories: 'Popular Categories',
      exploreCategories: 'Explore Categories',
      featuredProducts: 'Featured Products',
      handpickedCollection: 'Handpicked Collection',
      viewAllProducts: 'View All Products',
      customTailoringBannerTitle: 'Need Custom Tailoring?',
      customTailoringBannerDesc: 'Get your clothing customized to your exact measurements and design preferences.',
      orderCustomNow: 'Order Custom Stitching',
      wholesaleBannerTitle: 'Wholesale & Bulk Orders',
      wholesaleBannerDesc: 'Special rates for schools, organizations, and businesses.',
      requestWholesaleQuote: 'Request Wholesale Quote',
      whyChooseUs: 'Why Choose US Dresses?',
      whyChooseUsDesc: 'Decades of experience delivering quality garments across Makwanpur and Nepal.',
      trustBadgeTitle: '100% Quality Guaranteed',
      trustBadgeDesc: 'Finest fabric materials, durable stitching, and perfect fitting guaranteed.',
    },
    shop: {
      title: 'Shop Products',
      subtitle: 'Explore our wide range of garments, uniforms, and dresses',
      shop: 'Shop',
      products: 'Products',
      categories: 'Categories',
      allProducts: 'All Products',
      searchProducts: 'Search Products',
      searchPlaceholder: 'Search kurtha, uniform, t-shirts...',
      filter: 'Filter',
      sortBy: 'Sort By',
      sortNewest: 'Newest',
      sortPriceLowHigh: 'Price: Low to High',
      sortPriceHighLow: 'Price: High to Low',
      sortPopular: 'Popularity',
      price: 'Price',
      size: 'Size',
      color: 'Color',
      quantity: 'Quantity',
      available: 'Available',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      productDetails: 'Product Details',
      description: 'Description',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
      quickView: 'Quick View',
      noProductsFound: 'No products found',
      clearFilters: 'Clear Filters',
      showingResults: 'Showing {count} products',
      categoryFilterAll: 'All Categories',
      priceRange: 'Price Range',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      applyFilter: 'Apply Filter',
      resetFilter: 'Reset',
      reviewsCount: '{count} Reviews',
      noReviews: 'No reviews yet',
      writeReview: 'Write a Review',
      rating: 'Rating',
      yourReview: 'Your Review',
      submitReview: 'Submit Review',
    },
    cart: {
      shoppingCart: 'Shopping Cart',
      yourCart: 'Your Cart',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      remove: 'Remove',
      continueShopping: 'Continue Shopping',
      orderSummary: 'Order Summary',
      discount: 'Discount',
      shipping: 'Delivery Fee',
      total: 'Total Amount',
      proceedToCheckout: 'Proceed to Checkout',
      emptyCart: 'Your Cart is Empty',
      emptyCartMsg: "Looks like you haven't added any garments to your cart yet.",
      startShopping: 'Start Shopping',
      clearCart: 'Clear Cart',
      couponCode: 'Coupon Code',
      applyCoupon: 'Apply',
      freeShippingTag: 'Free Shipping on orders over Rs. 3,000',
    },
    checkout: {
      checkout: 'Checkout',
      shippingAddress: 'Shipping Address',
      fullName: 'Full Name',
      phone: 'Phone Number',
      province: 'Province',
      district: 'District',
      municipality: 'Municipality',
      ward: 'Ward',
      area: 'Area / Tole',
      street: 'Street Address',
      landmark: 'Landmark',
      paymentMethod: 'Payment Method',
      cod: 'Cash on Delivery',
      esewa: 'eSewa / Khalti Digital Payment',
      bankTransfer: 'Direct Bank Transfer',
      placeOrder: 'Place Order',
      orderTotal: 'Order Total',
      notes: 'Order Notes (Optional)',
      selectProvince: 'Select Province',
      selectDistrict: 'Select District',
      backToCart: 'Back to Cart',
      processingOrder: 'Processing Order...',
    },
    auth: {
      login: 'Login',
      loginTitle: 'Login to Your Account',
      register: 'Register',
      registerTitle: 'Create an Account',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      logout: 'Logout',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      loginNow: 'Login Now',
      registerNow: 'Register Now',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Password Reset Link',
      createAccount: 'Create Account',
    },
    emailOtp: {
      verifyTitle: 'Verify Your Email',
      verifySubtitle: 'We sent a 6-digit verification code to your email.',
      codeLabel: 'Verification Code',
      codePlaceholder: 'Enter the 6-digit code',
      verifyButton: 'Verify Email',
      didntReceive: "Didn't receive the code?",
      resendCode: 'Resend Code',
      expiresIn: 'Code expires in',
      invalidCode: 'Invalid verification code',
      verifiedSuccess: 'Email verified successfully',
    },
    customTailoring: {
      title: 'Custom Tailoring',
      orderTitle: 'Custom Tailoring Order',
      subtitle: 'Order custom made dresses, school uniforms, and garments made to your exact size.',
      garmentType: 'Garment Type',
      selectGarment: 'Select Garment Type',
      measurements: 'Measurements',
      chest: 'Chest (inches)',
      waist: 'Waist (inches)',
      hip: 'Hip (inches)',
      shoulder: 'Shoulder (inches)',
      sleeveLength: 'Sleeve Length (inches)',
      dressLength: 'Dress Length (inches)',
      fabricPreference: 'Fabric Preference',
      colorPreference: 'Color Preference',
      designDescription: 'Design Description / Special Instructions',
      uploadReference: 'Upload Reference Image',
      submitRequest: 'Submit Custom Stitching Request',
      submitting: 'Submitting...',
      successTitle: 'Custom Stitching Request Sent!',
      successDesc: 'Our tailoring team in Hetauda will review your details and contact you shortly.',
    },
    wholesale: {
      title: 'Wholesale & Bulk Supplies',
      orderTitle: 'Wholesale Inquiry',
      subtitle: 'Bulk garment manufacturing and supply for schools, colleges, institutions, and retailers across Nepal.',
      businessName: 'Business / School / Organization Name',
      contactPerson: 'Contact Person Name',
      phone: 'Phone Number',
      email: 'Email Address',
      requiredQuantity: 'Required Quantity (Pcs)',
      garmentCategory: 'Garment Category',
      message: 'Detailed Message / Specifications',
      requestQuote: 'Request Quote',
      submitting: 'Sending Inquiry...',
      successTitle: 'Wholesale Inquiry Submitted!',
      successDesc: 'Thank you for reaching out. Our wholesale department will contact you within 24 hours.',
    },
    account: {
      myAccount: 'My Account',
      myProfile: 'My Profile',
      myOrders: 'My Orders',
      wishlist: 'Wishlist',
      savedAddresses: 'Saved Addresses',
      accountSettings: 'Account Settings',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      orderHistory: 'Order History',
      orderDetails: 'Order Details',
      viewDetails: 'View Details',
      noOrders: 'No orders found',
      noWishlist: 'Your wishlist is empty',
      noAddresses: 'No saved addresses',
      addNewAddress: 'Add New Address',
    },
    orderStatus: {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
      PAID: 'Paid',
      UNPAID: 'Payment Pending',
    },
    common: {
      save: 'Save',
      update: 'Update',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      view: 'View',
      viewAll: 'View All',
      search: 'Search',
      clear: 'Clear',
      apply: 'Apply',
      loading: 'Loading...',
      rs: 'Rs.',
    },
    systemMessages: {
      addedToCart: 'Added to cart successfully',
      removedFromCart: 'Item removed from cart',
      cartCleared: 'Cart cleared',
      orderPlaced: 'Order placed successfully',
      somethingWentWrong: 'Something went wrong',
      pleaseTryAgain: 'Please try again',
      requiredField: 'Required field',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Password does not match',
      noProductsFound: 'No products found',
      noOrdersFound: 'No orders found',
      addedToWishlist: 'Added to wishlist',
      removedFromWishlist: 'Removed from wishlist',
    },
    footer: {
      brandDesc: 'Premier garment manufacturer and retail store in Hetauda, Nepal. Offering premium school uniforms, house dresses, custom tailoring, and wholesale garments.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      customerService: 'Customer Service',
      contactInfo: 'Contact Information',
      rightsReserved: 'All Rights Reserved',
      developedWith: 'US Dresses & Garment Udyog • Hetauda, Makwanpur, Nepal',
    },
    pages: {
      about: {
        title: 'About US Dresses & Garment Udyog',
        subtitle: 'Delivering quality garments and trusted tailoring in Hetauda, Nepal',
        storyTitle: 'Our Journey',
        storyDesc: 'Established in Hetauda, Makwanpur, US Dresses & Garment Udyog has grown from a humble local tailoring shop into a premier garment manufacturing hub serving schools, institutions, and families across Nepal.',
        missionTitle: 'Our Mission',
        missionDesc: 'To provide durable, comfortable, and affordable garments with flawless fitting and superior stitching quality.',
      },
      contact: {
        title: 'Contact Us',
        subtitle: "We'd love to hear from you. Visit our store or reach out online.",
        getInTouch: 'Get In Touch',
        addressTitle: 'Our Location',
        addressDesc: 'Hetauda-4, Main Road, Makwanpur, Bagmati Province, Nepal',
        phoneTitle: 'Phone & WhatsApp',
        emailTitle: 'Email Address',
        workingHours: 'Working Hours',
        workingHoursValue: 'Sun - Fri: 8:00 AM - 7:00 PM (Saturday Closed)',
        sendMessage: 'Send Us a Message',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        yourMessage: 'Message',
        sendButton: 'Send Message',
        messageSent: 'Message sent successfully!',
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find quick answers to common questions about our products, sizing, and orders.',
      },
      privacy: {
        title: 'Privacy Policy',
      },
      terms: {
        title: 'Terms & Conditions',
      },
      return: {
        title: 'Return & Exchange Policy',
      },
      shipping: {
        title: 'Shipping & Delivery Policy',
      },
      notFound: {
        title: 'Page Not Found (404)',
        desc: 'The page you are looking for does not exist or has been moved.',
        backHome: 'Back to Home',
      },
    },
    categories: {
      'women': 'Women',
      'school-uniform': 'School Uniform',
      'house-dress': 'House Dress',
      't-shirts': 'T-Shirts',
      'dresses': 'Dresses',
      'track-suits': 'Track Suits',
      'ladies-kurtha': 'Ladies Kurtha',
      'best-sellers': 'Best Sellers',
      'new-arrivals': 'New Arrivals',
      'sale': 'Sale',
    },
    location: {
      title: 'Our Location',
      subtitle: 'Visit our store or get directions using Google Maps.',
      addressTitle: 'US Dresses & Garment Udyog',
      addressText: 'Hetauda, Bagmati Province, Nepal',
      getDirections: 'Get Directions',
      gettingDirections: 'Locating...',
      viewOnGoogleMaps: 'View on Google Maps',
      iframeTitle: 'US Dresses & Garment Udyog Google Maps Location',
    },
  },

  ne: {
    topBar: {
      announcement: 'गुणस्तरीय पोशाक, विश्वास हाम्रो शान | विद्यालय पोशाक • घरायसी पोशाक • महिला पहिरन • थोक बिक्री',
      whatsappUs: 'व्हाट्सएप सन्देश',
      callUs: 'हामीलाई सम्पर्क गर्नुहोस्',
      location: 'हेटौंडा, नेपाल',
    },
    nav: {
      home: 'गृहपृष्ठ',
      women: 'महिला',
      schoolUniform: 'विद्यालय पोशाक',
      houseDress: 'घरायसी पोशाक',
      tShirts: 'टी-सर्ट',
      dresses: 'पोशाक',
      trackSuits: 'ट्र्याकसुट',
      customOrders: 'कस्टम अर्डर',
      wholesale: 'थोक बिक्री',
      account: 'खाता',
      login: 'लगइन',
      myAccount: 'मेरो खाता',
      wishlist: 'इच्छासूची',
      cart: 'कार्ट',
      shop: 'पसल',
      about: 'हाम्रो बारेमा',
      contact: 'सम्पर्क',
      services: 'सेवाहरू',
      faq: 'प्रश्नोत्तरी',
    },
    home: {
      heroBadge: 'यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग • हेटौंडा, नेपाल',
      heroTitle: 'गुणस्तरीय पोशाक,\nविश्वास हाम्रो शान',
      heroSubtitle: 'हेटौंडा, नेपालको प्रमुख गार्मेन्ट उद्योग। विद्यालय पोशाक, घरायसी कपडा, कस्टम सिलाइ र थोक आपूर्तिमा विशेष expertise।',
      shopCollection: 'सङ्ग्रह हेर्नुहोस्',
      customOrderBtn: 'कस्टम सिलाइ अर्डर',
      wholesaleBtn: 'थोक बिक्री सोधपुछ',
      feature1Title: 'उत्कृष्ट गुणस्तर',
      feature1Desc: 'उत्कृष्ट कपडा र सिलाइ',
      feature2Title: 'कस्टम अर्डर',
      feature2Desc: 'तपाईंको आवश्यकता अनुसार',
      feature3Title: 'थोक बिक्री सेवा',
      feature3Desc: 'विद्यालय तथा व्यवसायका लागि',
      feature4Title: 'हेटौंडा, नेपाल',
      feature4Desc: 'स्थानीय र विश्वसनीय',
      popularCategories: 'लोकप्रिय श्रेणीहरू',
      exploreCategories: 'श्रेणीहरू हेर्नुहोस्',
      featuredProducts: 'विशेष उत्पादनहरू',
      handpickedCollection: 'छनोट गरिएका उत्पादनहरू',
      viewAllProducts: 'सबै उत्पादनहरू हेर्नुहोस्',
      customTailoringBannerTitle: 'के तपाईंलाई कस्टम सिलाइ चाहिन्छ?',
      customTailoringBannerDesc: 'तपाईंको आवश्यकता र नाप अनुसार उत्कृष्ट डिजाइनमा कपडा सिलाइ गराउनुहोस्।',
      orderCustomNow: 'अहिले सिलाइ अर्डर गर्नुहोस्',
      wholesaleBannerTitle: 'थोक बिक्री तथा ठूलो परिमाणको अर्डर',
      wholesaleBannerDesc: 'विद्यालय, संस्था तथा व्यवसायहरूका लागि विशेष छुट र आकर्षक दर।',
      requestWholesaleQuote: 'मूल्य प्रस्ताव माग्नुहोस्',
      whyChooseUs: 'किन यूएस ड्रेसेस रोज्ने?',
      whyChooseUsDesc: 'मकवानपुर र नेपालभरि गुणस्तरीय पोशाक उपलब्ध गराउने लामो अनुभव र भरोसा।',
      trustBadgeTitle: '१००% गुणस्तरको ग्यारेन्टी',
      trustBadgeDesc: 'उत्कृष्ट कपडा, टिकाउ सिलाइ र मिलाएर बनाइएको पहिरन।',
    },
    shop: {
      title: 'उत्पादनहरू',
      subtitle: 'हाम्रा विविध पोशाक, युनिफर्म र कपडाहरू हेर्नुहोस्',
      shop: 'पसल',
      products: 'उत्पादनहरू',
      categories: 'श्रेणीहरू',
      allProducts: 'सबै उत्पादनहरू',
      searchProducts: 'उत्पादन खोज्नुहोस्',
      searchPlaceholder: 'कुर्ता, युनिफर्म, टी-सर्ट खोज्नुहोस्...',
      filter: 'फिल्टर',
      sortBy: 'क्रमबद्ध गर्नुहोस्',
      sortNewest: 'नयाँ',
      sortPriceLowHigh: 'मूल्य: कम देखि बढी',
      sortPriceHighLow: 'मूल्य: बढी देखि कम',
      sortPopular: 'लोकप्रियता',
      price: 'मूल्य',
      size: 'साइज',
      color: 'रङ',
      quantity: 'परिमाण',
      available: 'उपलब्ध',
      inStock: 'स्टकमा उपलब्ध',
      outOfStock: 'स्टक सकिएको',
      addToCart: 'कार्टमा थप्नुहोस्',
      buyNow: 'अहिले किन्नुहोस्',
      addToWishlist: 'इच्छासूचीमा थप्नुहोस्',
      removeFromWishlist: 'इच्छासूचीबाट हटाउनुहोस्',
      productDetails: 'उत्पादन विवरण',
      description: 'विवरण',
      reviews: 'समीक्षाहरू',
      relatedProducts: 'सम्बन्धित उत्पादनहरू',
      quickView: 'त्वरित हेराइ',
      noProductsFound: 'कुनै उत्पादन भेटिएन',
      clearFilters: 'फिल्टर हटाउनुहोस्',
      showingResults: '{count} वटा उत्पादनहरू देखाउँदै',
      categoryFilterAll: 'सबै श्रेणीहरू',
      priceRange: 'मूल्य दायरा',
      minPrice: 'न्यूनतम मूल्य',
      maxPrice: 'अधिकतम मूल्य',
      applyFilter: 'लागू गर्नुहोस्',
      resetFilter: 'रिसेट गर्नुहोस्',
      reviewsCount: '{count} समीक्षाहरू',
      noReviews: 'अझै कुनै समीक्षा छैन',
      writeReview: 'समीक्षा लेख्नुहोस्',
      rating: 'मूल्याङ्कन',
      yourReview: 'तपाईंको समीक्षा',
      submitReview: 'समीक्षा पेश गर्नुहोस्',
    },
    cart: {
      shoppingCart: 'किनमेल कार्ट',
      yourCart: 'तपाईंको कार्ट',
      product: 'उत्पादन',
      price: 'मूल्य',
      quantity: 'परिमाण',
      subtotal: 'जम्मा',
      remove: 'हटाउनुहोस्',
      continueShopping: 'किनमेल जारी राख्नुहोस्',
      orderSummary: 'अर्डर सारांश',
      discount: 'छुट',
      shipping: 'डेलिभरी शुल्क',
      total: 'कुल रकम',
      proceedToCheckout: 'चेकआउटमा जानुहोस्',
      emptyCart: 'तपाईंको कार्ट खाली छ',
      emptyCartMsg: 'तपाईंले कार्टमा कुनै कपडा थप्नुभएको छैन जस्तो देखिन्छ।',
      startShopping: 'किनमेल सुरु गर्नुहोस्',
      clearCart: 'कार्ट खाली गर्नुहोस्',
      couponCode: 'कुपन कोड',
      applyCoupon: 'लागू गर्नुहोस्',
      freeShippingTag: 'रु. ३,००० भन्दा माथिको अर्डरमा नि:शुल्क डेलिभरी',
    },
    checkout: {
      checkout: 'चेकआउट',
      shippingAddress: 'डेलिभरी ठेगाना',
      fullName: 'पूरा नाम',
      phone: 'फोन नम्बर',
      province: 'प्रदेश',
      district: 'जिल्ला',
      municipality: 'नगरपालिका',
      ward: 'वडा',
      area: 'क्षेत्र / टोल',
      street: 'सडक ठेगाना',
      landmark: 'नजिकको चिनारी',
      paymentMethod: 'भुक्तानी विधि',
      cod: 'डेलिभरीमा नगद भुक्तानी',
      esewa: 'ईसेवा / खल्ती डिजिटल भुक्तानी',
      bankTransfer: 'डायरेक्ट बैंक ट्रान्सफर',
      placeOrder: 'अर्डर गर्नुहोस्',
      orderTotal: 'कुल अर्डर रकम',
      notes: 'अर्डर नोट (ऐच्छिक)',
      selectProvince: 'प्रदेश छान्नुहोस्',
      selectDistrict: 'जिल्ला छान्नुहोस्',
      backToCart: 'कार्टमा फर्कनुहोस्',
      processingOrder: 'अर्डर प्रक्रियामा छ...',
    },
    auth: {
      login: 'लगइन',
      loginTitle: 'तपाईंको खातामा लगइन गर्नुहोस्',
      register: 'दर्ता',
      registerTitle: 'खाता बनाउनुहोस्',
      fullName: 'पूरा नाम',
      email: 'इमेल ठेगाना',
      password: 'पासवर्ड',
      newPassword: 'नयाँ पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
      forgotPassword: 'पासवर्ड बिर्सनुभयो?',
      rememberMe: 'मलाई सम्झनुहोस्',
      logout: 'लगआउट',
      alreadyHaveAccount: 'पहिले नै खाता छ?',
      dontHaveAccount: 'खाता छैन?',
      loginNow: 'अहिले लगइन गर्नुहोस्',
      registerNow: 'अहिले दर्ता गर्नुहोस्',
      resetPassword: 'पासवर्ड रिसेट गर्नुहोस्',
      sendResetLink: 'पासवर्ड रिसेट लिङ्क पठाउनुहोस्',
      createAccount: 'खाता बनाउनुहोस्',
    },
    emailOtp: {
      verifyTitle: 'तपाईंको इमेल प्रमाणित गर्नुहोस्',
      verifySubtitle: 'हामीले तपाईंको इमेलमा ६ अङ्कको प्रमाणीकरण कोड पठाएका छौँ।',
      codeLabel: 'प्रमाणीकरण कोड',
      codePlaceholder: '६ अङ्कको कोड प्रविष्ट गर्नुहोस्',
      verifyButton: 'इमेल प्रमाणित गर्नुहोस्',
      didntReceive: 'कोड प्राप्त भएन?',
      resendCode: 'कोड पुनः पठाउनुहोस्',
      expiresIn: 'कोडको समय सकिन बाँकी',
      invalidCode: 'प्रमाणीकरण कोड गलत छ',
      verifiedSuccess: 'इमेल सफलतापूर्वक प्रमाणित भयो',
    },
    customTailoring: {
      title: 'कस्टम सिलाइ',
      orderTitle: 'कस्टम सिलाइ अर्डर',
      subtitle: 'तपाईंको नाप अनुसार कस्टम पोशाक, विद्यालय युनिफर्म र कपडा सिलाइ अर्डर गर्नुहोस्।',
      garmentType: 'पोशाकको प्रकार',
      selectGarment: 'पोशाकको प्रकार छान्नुहोस्',
      measurements: 'नाप',
      chest: 'छाती (इन्च)',
      waist: 'कम्मर (इन्च)',
      hip: 'हिप (इन्च)',
      shoulder: 'काँध (इन्च)',
      sleeveLength: 'बाहुलाको लम्बाइ (इन्च)',
      dressLength: 'पोशाकको लम्बाइ (इन्च)',
      fabricPreference: 'कपडाको रोजाइ',
      colorPreference: 'रङको रोजाइ',
      designDescription: 'डिजाइन विवरण / विशेष निर्देशन',
      uploadReference: 'नमुना तस्बिर अपलोड गर्नुहोस्',
      submitRequest: 'अनुरोध पठाउनुहोस्',
      submitting: 'पठाउँदैछ...',
      successTitle: 'कस्टम सिलाइ अनुरोध पठाइयो!',
      successDesc: 'हेटौंडास्थित हाम्रो सिलाइ टोलीले तपाईंको विवरण हेरेर छिट्टै सम्पर्क गर्नेछ।',
    },
    wholesale: {
      title: 'थोक बिक्री',
      orderTitle: 'थोक बिक्री सोधपुछ',
      subtitle: 'नेपालभरिका विद्यालय, कलेज, संस्था र खुद्रा बिक्रेताहरूका लागि ठूलो परिमाणको कपडा उत्पादन तथा आपूर्ति।',
      businessName: 'व्यवसाय / विद्यालय / संस्थाको नाम',
      contactPerson: 'सम्पर्क व्यक्तिको नाम',
      phone: 'फोन नम्बर',
      email: 'इमेल ठेगाना',
      requiredQuantity: 'आवश्यक परिमाण (थान)',
      garmentCategory: 'कपडाको वर्ग',
      message: 'विस्तृत सन्देश / विवरण',
      requestQuote: 'मूल्य प्रस्ताव माग्नुहोस्',
      submitting: 'पठाउँदैछ...',
      successTitle: 'थोक सोधपुछ दर्ता भयो!',
      successDesc: 'सम्पर्क गर्नुभएकोमा धन्यवाद। हाम्रो थोक बिक्री विभागले २४ घण्टाभित्र सम्पर्क गर्नेछ।',
    },
    account: {
      myAccount: 'मेरो खाता',
      myProfile: 'मेरो प्रोफाइल',
      myOrders: 'मेरा अर्डरहरू',
      wishlist: 'इच्छासूची',
      savedAddresses: 'सुरक्षित ठेगानाहरू',
      accountSettings: 'खाता सेटिङ',
      editProfile: 'प्रोफाइल सम्पादन',
      saveChanges: 'परिवर्तन सुरक्षित गर्नुहोस्',
      orderHistory: 'अर्डर इतिहास',
      orderDetails: 'अर्डर विवरण',
      viewDetails: 'विवरण हेर्नुहोस्',
      noOrders: 'कुनै अर्डर भेटिएन',
      noWishlist: 'तपाईंको इच्छासूची खाली छ',
      noAddresses: 'कुनै सुरक्षित ठेगाना छैन',
      addNewAddress: 'नयाँ ठेगाना थप्नुहोस्',
    },
    orderStatus: {
      PENDING: 'विचाराधीन',
      CONFIRMED: 'पुष्टि भएको',
      PROCESSING: 'प्रक्रियामा',
      SHIPPED: 'पठाइएको',
      DELIVERED: 'डेलिभरी भएको',
      CANCELLED: 'रद्द गरिएको',
      PAID: 'भुक्तानी भएको',
      UNPAID: 'भुक्तानी बाँकी',
    },
    common: {
      save: 'सुरक्षित गर्नुहोस्',
      update: 'अद्यावधिक गर्नुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      confirm: 'पुष्टि गर्नुहोस्',
      submit: 'पठाउनुहोस्',
      continue: 'जारी राख्नुहोस्',
      back: 'पछाडि',
      next: 'अर्को',
      previous: 'अघिल्लो',
      close: 'बन्द गर्नुहोस्',
      view: 'हेर्नुहोस्',
      viewAll: 'सबै हेर्नुहोस्',
      search: 'खोज्नुहोस्',
      clear: 'खाली गर्नुहोस्',
      apply: 'लागू गर्नुहोस्',
      loading: 'लोड हुँदैछ...',
      rs: 'रु.',
    },
    systemMessages: {
      addedToCart: 'कार्टमा सफलतापूर्वक थपियो।',
      removedFromCart: 'कार्टबाट वस्तु हटाइयो।',
      cartCleared: 'कार्ट खाली गरियो।',
      orderPlaced: 'अर्डर सफलतापूर्वक गरिएको छ।',
      somethingWentWrong: 'केही समस्या भयो।',
      pleaseTryAgain: 'कृपया पुनः प्रयास गर्नुहोस्।',
      requiredField: 'यो विवरण आवश्यक छ।',
      invalidEmail: 'इमेल ठेगाना मान्य छैन।',
      passwordMismatch: 'पासवर्ड मिलेन।',
      noProductsFound: 'कुनै उत्पादन भेटिएन।',
      noOrdersFound: 'कुनै अर्डर भेटिएन।',
      addedToWishlist: 'इच्छासूचीमा थपियो।',
      removedFromWishlist: 'इच्छासूचीबाट हटाइयो।',
    },
    footer: {
      brandDesc: 'हेटौंडा, नेपालको प्रमुख गार्मेन्ट उद्योग। उत्कृष्ट विद्यालय पोशाक, घरायसी कपडा, कस्टम सिलाइ र थोक आपूर्ति।',
      quickLinks: 'छिटो लिङ्कहरू',
      categories: 'श्रेणीहरू',
      customerService: 'ग्राहक सेवा',
      contactInfo: 'सम्पर्क जानकारी',
      rightsReserved: 'सर्वाधिकार सुरक्षित',
      developedWith: 'यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग • हेटौंडा, मकवानपुर, नेपाल',
    },
    pages: {
      about: {
        title: 'हाम्रो बारेमा - यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग',
        subtitle: 'हेटौंडा, नेपालमा गुणस्तरीय पोशाक र विश्वसनीय सिलाइ सेवा',
        storyTitle: 'हाम्रो यात्रा',
        storyDesc: 'हेटौंडा, मकवानपुरमा स्थापित यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योगले सानो सिलाइ पसलबाट सुरु भई आज नेपालभरिका विद्यालय, संस्था र परिवारहरूलाई गुणस्तरीय कपडा उपलब्ध गराउँदै आएको छ।',
        missionTitle: 'हाम्रो लक्ष्य',
        missionDesc: 'टिकाउ, आरामदायी र किफायती कपडाहरू उत्कृष्ट सिलाइ र मिलाएर उपलब्ध गराउनु।',
      },
      contact: {
        title: 'हामीलाई सम्पर्क गर्नुहोस्',
        subtitle: 'तपाईंको जिज्ञासा वा सुझावका लागि हामीलाई सम्पर्क गर्नुहोस्।',
        getInTouch: 'सम्पर्कमा रहनुहोस्',
        addressTitle: 'हाम्रो ठेगाना',
        addressDesc: 'हेटौंडा-४, मेन रोड, मकवानपुर, बागमती प्रदेश, नेपाल',
        phoneTitle: 'फोन तथा व्हाट्सएप',
        emailTitle: 'इमेल ठेगाना',
        workingHours: 'खुल्ने समय',
        workingHoursValue: 'आइतबार - शुक्रबार: बिहान ८:०० - बेलुका ७:०० (शनिबार बन्द)',
        sendMessage: 'हामीलाई सन्देश पठाउनुहोस्',
        yourName: 'तपाईंको नाम',
        yourEmail: 'तपाईंको इमेल',
        yourMessage: 'सन्देश',
        sendButton: 'सन्देश पठाउनुहोस्',
        messageSent: 'सन्देश सफलतापूर्वक पठाइयो!',
      },
      faq: {
        title: 'प्रश्नोत्तरी (FAQ)',
        subtitle: 'हाम्रा उत्पादन, नाप र अर्डरसम्बन्धी जिज्ञासाको उत्तर यहाँ पाउनुहोस्।',
      },
      privacy: {
        title: 'गोपनीयता नीति',
      },
      terms: {
        title: 'नियम तथा शर्तहरू',
      },
      return: {
        title: 'फिर्ता तथा साट्ने नीति',
      },
      shipping: {
        title: 'डेलिभरी नीति',
      },
      notFound: {
        title: 'पृष्ठ भेटिएन (४०४)',
        desc: 'तपाईंले खोज्नुभएको पृष्ठ भेटिएन वा सारिएको छ।',
        backHome: 'गृहपृष्ठमा फर्कनुहोस्',
      },
    },
    categories: {
      'women': 'महिला',
      'school-uniform': 'विद्यालय पोशाक',
      'house-dress': 'घरायसी पोशाक',
      't-shirts': 'टी-सर्ट',
      'dresses': 'पोशाक',
      'track-suits': 'ट्र्याकसुट',
      'ladies-kurtha': 'महिला कुर्ता',
      'best-sellers': 'सर्वाधिक बिक्री',
      'new-arrivals': 'नयाँ उत्पादनहरू',
      'sale': 'छुट',
    },
    location: {
      title: 'हाम्रो स्थान',
      subtitle: 'हाम्रो स्टोरमा आउनुहोस् वा Google Maps मार्फत दिशा हेर्नुहोस्।',
      addressTitle: 'यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग',
      addressText: 'हेटौंडा, बागमती प्रदेश, नेपाल',
      getDirections: 'दिशा हेर्नुहोस्',
      gettingDirections: 'स्थान खोज्दैछ...',
      viewOnGoogleMaps: 'Google Maps मा हेर्नुहोस्',
      iframeTitle: 'यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग Google Maps स्थान',
    },
  },
};

export function getBilingualText(
  field: any,
  lang: Language,
  fallback: string = ''
): string {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field[lang] || field.en || field.ne || fallback;
  }
  return String(field);
}
