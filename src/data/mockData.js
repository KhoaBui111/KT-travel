/* ============================================
   MOCK DATA - KT Travel
   Dữ liệu mẫu cho toàn bộ ứng dụng
   ============================================ */

// Danh sách tour du lịch
export const tours = [
  {
    id: 1,
    name: 'Châu Âu (Pháp - Thụy Sĩ - Liechtenstein - Đức)',
    duration: '12 ngày 11 đêm',
    durationDays: 12,
    price: 100000000,
    departure: 'TP.HCM',
    airline: 'VietJet',
    country: 'Đức',
    region: 'international',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1527259222730-2a71e03bd5fd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
    ],
    dates: ['31/10/2024', '11/11/2024', '21/11/2024'],
    description: 'Khám phá những điểm đến hấp dẫn nhất Châu Âu với hành trình xuyên qua Pháp, Thụy Sĩ, Liechtenstein và Đức. Tham quan tháp Eiffel, hồ Lucerne, lâu đài Neuschwanstein và nhiều danh lam thắng cảnh nổi tiếng.',
    highlights: [
      'Tham quan tháp Eiffel, bảo tàng Louvre',
      'Du thuyền trên sông Seine',
      'Khám phá thành phố Lucerne, Thụy Sĩ',
      'Tham quan lâu đài Neuschwanstein, Đức',
      'Mua sắm tại các trung tâm thương mại lớn'
    ],
    maxPeople: 30,
    currentBookings: 18
  },
  {
    id: 2,
    name: 'Châu Âu (Pháp - Đức - Hà Lan - Bỉ)',
    duration: '10 ngày 9 đêm',
    durationDays: 10,
    price: 70000000,
    departure: 'TP.HCM',
    airline: 'Vietnam Airlines',
    country: 'Pháp',
    region: 'international',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
    ],
    dates: ['31/10/2024', '11/11/2024', '21/11/2024'],
    description: 'Hành trình khám phá Tây Âu với các thành phố nổi tiếng Paris, Berlin, Amsterdam, Brussels.',
    highlights: [
      'Tham quan tháp Eiffel',
      'Khám phá cổng Brandenburg, Berlin',
      'Du thuyền kênh đào Amsterdam',
      'Thưởng thức chocolate Bỉ'
    ],
    maxPeople: 25,
    currentBookings: 12
  },
  {
    id: 3,
    name: 'Châu Âu (Tây Ban Nha - Bồ Đào Nha)',
    duration: '9 ngày 8 đêm',
    durationDays: 9,
    price: 65000000,
    departure: 'Hà Nội',
    airline: 'VietJet',
    country: 'Tây Ban Nha',
    region: 'international',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop',
    ],
    dates: ['05/11/2024', '15/11/2024'],
    description: 'Khám phá bán đảo Iberia với những kiến trúc độc đáo và ẩm thực tuyệt vời.',
    highlights: [
      'Tham quan nhà thờ Sagrada Familia',
      'Khám phá cung điện Alhambra',
      'Thưởng thức Paella truyền thống',
      'Tham quan tháp Belem, Lisbon'
    ],
    maxPeople: 20,
    currentBookings: 8
  },
  {
    id: 4,
    name: 'Thanh Hóa - Sầm Sơn - Bỉm Sơn',
    duration: '4 ngày 3 đêm',
    durationDays: 4,
    price: 5500000,
    departure: 'Hà Nội',
    airline: 'Xe khách',
    country: 'Việt Nam',
    region: 'domestic',
    area: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    ],
    dates: ['20/10/2024', '01/11/2024', '15/11/2024'],
    description: 'Khám phá vẻ đẹp thiên nhiên và văn hóa Thanh Hóa với bãi biển Sầm Sơn nổi tiếng.',
    highlights: [
      'Tắm biển Sầm Sơn',
      'Tham quan thành nhà Hồ',
      'Khám phá suối cá thần Cẩm Lương',
      'Thưởng thức đặc sản nem chua'
    ],
    maxPeople: 40,
    currentBookings: 25
  },
  {
    id: 5,
    name: 'Thụy Sĩ - Ý - Vatican',
    duration: '11 ngày 10 đêm',
    durationDays: 11,
    price: 85000000,
    departure: 'TP.HCM',
    airline: 'Vietnam Airlines',
    country: 'Thụy Sĩ',
    region: 'international',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1527259222730-2a71e03bd5fd?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1527259222730-2a71e03bd5fd?w=800&h=600&fit=crop',
    ],
    dates: ['10/11/2024', '25/11/2024'],
    description: 'Hành trình lãng mạn qua Thụy Sĩ và Ý với núi Alps hùng vĩ và thành Rome cổ kính.',
    highlights: [
      'Lên đỉnh Jungfraujoch',
      'Tham quan đấu trường Colosseum',
      'Viếng thành Vatican',
      'Du thuyền hồ Geneva'
    ],
    maxPeople: 25,
    currentBookings: 15
  },
  {
    id: 6,
    name: 'Đà Nẵng - Hội An - Bà Nà Hills',
    duration: '5 ngày 4 đêm',
    durationDays: 5,
    price: 8500000,
    departure: 'TP.HCM',
    airline: 'VietJet',
    country: 'Việt Nam',
    region: 'domestic',
    area: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    ],
    dates: ['25/10/2024', '08/11/2024', '22/11/2024'],
    description: 'Khám phá miền Trung Việt Nam với bãi biển Mỹ Khê, phố cổ Hội An và Bà Nà Hills.',
    highlights: [
      'Tham quan Cầu Vàng Bà Nà Hills',
      'Dạo phố cổ Hội An',
      'Tắm biển Mỹ Khê',
      'Thưởng thức mì Quảng, bún bò Huế'
    ],
    maxPeople: 35,
    currentBookings: 20
  }
];

// Danh sách user
export const users = [
  {
    id: 1,
    name: 'Bùi Solo Quản Trị Viên',
    email: 'buisolodmid@gmail.com',
    password: '676767',
    phone: '0901234567',
    role: 'admin',
    status: 'active',
    avatar: null
  }
];

// Danh sách giao dịch (transactions / bookings)
export const transactions = [
  {
    id: 'GD001',
    ticketCode: 'VE001',
    tourId: 1,
    tourName: 'Châu Âu (Pháp - Thụy Sĩ - Liechtenstein - Đức)',
    customerName: 'Trần Thị Bình',
    gender: 'Nữ',
    phone: '0912345678',
    email: 'binh.tran@gmail.com',
    nationality: 'Việt Nam',
    price: 100000000,
    duration: '12 ngày 11 đêm',
    quantity: 2,
    totalPrice: 200000000,
    transport: 'VietJet',
    bookingDate: '15/10/2024',
    departureDate: '31/10/2024',
    status: 'completed',
    country: 'Đức',
    flag: '🇩🇪'
  },
  {
    id: 'GD002',
    ticketCode: 'VE002',
    tourId: 2,
    tourName: 'Châu Âu (Pháp - Đức - Hà Lan - Bỉ)',
    customerName: 'Lê Hoàng Cường',
    gender: 'Nam',
    phone: '0923456789',
    email: 'cuong.le@gmail.com',
    nationality: 'Việt Nam',
    price: 70000000,
    duration: '10 ngày 9 đêm',
    quantity: 1,
    totalPrice: 70000000,
    transport: 'Vietnam Airlines',
    bookingDate: '20/10/2024',
    departureDate: '11/11/2024',
    status: 'completed',
    country: 'Pháp',
    flag: '🇫🇷'
  },
  {
    id: 'GD003',
    ticketCode: 'VE003',
    tourId: 4,
    tourName: 'Thanh Hóa - Sầm Sơn - Bỉm Sơn',
    customerName: 'Hoàng Thị Hà',
    gender: 'Nữ',
    phone: '0945678901',
    email: 'ha.hoang@gmail.com',
    nationality: 'Việt Nam',
    price: 5500000,
    duration: '4 ngày 3 đêm',
    quantity: 3,
    totalPrice: 16500000,
    transport: 'Xe khách',
    bookingDate: '22/10/2024',
    departureDate: '01/11/2024',
    status: 'pending',
    country: 'Việt Nam',
    flag: '🇻🇳'
  },
  {
    id: 'GD004',
    ticketCode: 'VE004',
    tourId: 5,
    tourName: 'Thụy Sĩ - Ý - Vatican',
    customerName: 'Trần Thị Bình',
    gender: 'Nữ',
    phone: '0912345678',
    email: 'binh.tran@gmail.com',
    nationality: 'Việt Nam',
    price: 85000000,
    duration: '11 ngày 10 đêm',
    quantity: 2,
    totalPrice: 170000000,
    transport: 'Vietnam Airlines',
    bookingDate: '25/10/2024',
    departureDate: '10/11/2024',
    status: 'completed',
    country: 'Thụy Sĩ',
    flag: '🇨🇭'
  }
];

// Dữ liệu dropdown menu cho tour
export const tourMenuData = {
  domestic: {
    label: 'Tour trong nước',
    regions: [
      {
        name: 'MIỀN TRUNG',
        destinations: ['Thanh Hóa', 'Đà Nẵng', 'Hội An', 'Huế']
      },
      {
        name: 'MIỀN NAM',
        destinations: ['Phú Quốc', 'Đà Lạt', 'Nha Trang']
      },
      {
        name: 'MIỀN BẮC',
        destinations: ['Hà Giang', 'Sapa', 'Ninh Bình']
      }
    ]
  },
  international: {
    label: 'Tour ngoài nước',
    regions: [
      {
        name: 'CHÂU ÂU',
        destinations: ['Pháp', 'Đức', 'Thụy Sĩ', 'Tây Ban Nha', 'Bồ Đào Nha']
      },
      {
        name: 'CHÂU Á',
        destinations: ['Nhật Bản', 'Hàn Quốc', 'Thái Lan']
      }
    ]
  }
};

// Dữ liệu thống kê Dashboard
export const dashboardStats = {
  weeklyRevenue: 456500000,
  weeklyOrders: 24,
  onlineUsers: 128,
  chartData: [
    { name: 'T2', revenue: 45000000 },
    { name: 'T3', revenue: 62000000 },
    { name: 'T4', revenue: 78000000 },
    { name: 'T5', revenue: 55000000 },
    { name: 'T6', revenue: 89000000 },
    { name: 'T7', revenue: 95000000 },
    { name: 'CN', revenue: 32500000 }
  ]
};

// Destinations cho trang chủ
export const destinations = [
  { id: 1, name: 'Từ Cẩm Thành', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=200&fit=crop' },
  { id: 2, name: 'Núi Phú Sĩ', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=300&h=200&fit=crop' },
  { id: 3, name: 'Bình Nhưỡng', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=300&h=200&fit=crop' },
  { id: 4, name: 'Thanh Hóa', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=200&fit=crop' }
];

// Format tiền VND
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};
