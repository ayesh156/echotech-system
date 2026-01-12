// Mock data for Ecotec Computer Shop

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  serialNumber: string;
  barcode?: string;
  description?: string;
  createdAt: string;
  image?: string; // Base64 or URL of product image
  warranty?: string; // Warranty period (e.g., "6 months", "1 year")
  lowStockThreshold?: number; // Custom low stock threshold (default: 10)
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalSpent: number;
  totalOrders: number;
  lastPurchase?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'unpaid' | 'fullpaid' | 'halfpay';
  paidAmount?: number; // Amount paid so far (for halfpay tracking)
  date: string;
  dueDate: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'credit';
  salesChannel?: 'on-site' | 'online';
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number; // Original price before discount
  total: number;
  warrantyDueDate?: string;
}

// Sales History for tracking product sales
export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage discount
  discountAmount: number; // calculated discount amount
  finalPrice: number; // price after discount
  total: number; // quantity * finalPrice
  saleDate: string; // ISO date with time
}

// Warranty Claim for tracking warranty issues and replacements
export interface WarrantyClaim {
  id: string;
  invoiceId: string;
  invoiceItemIndex?: number; // Index of the item in invoice items array
  productId: string;
  productName: string;
  productSerialNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  claimDate: string; // ISO date with time when claim was filed
  warrantyExpiryDate: string; // Original warranty expiry date
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'replaced' | 'repaired';
  issueDescription: string;
  issueCategory: 'defective' | 'damaged' | 'not-working' | 'performance' | 'other';
  resolution?: string;
  resolutionDate?: string; // ISO date with time when resolved
  // Replacement tracking
  isReplacement: boolean;
  replacementProductId?: string;
  replacementProductName?: string;
  replacementSerialNumber?: string;
  replacementDate?: string; // ISO date with time
  // Additional metadata
  notes?: string;
  attachments?: string[]; // URLs or file paths
  handledBy?: string; // Staff member who handled the claim
}

// Helper function to generate unique 8-digit numeric serial number based on timestamp
// Uses last 8 digits of timestamp in milliseconds for uniqueness
const generateSerialNumber = () => {
  return Date.now().toString().slice(-8);
};

// Helper function to generate unique 8-digit invoice number
export const generateInvoiceNumber = () => {
  return Date.now().toString().slice(-8);
};

// Computer Shop Products
export const mockProducts: Product[] = [
  { id: '1', name: 'AMD Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 185000, stock: 12, serialNumber: '70451234', barcode: '4938271650123', createdAt: '2026-01-01T08:00:00', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 8 },
  { id: '2', name: 'Intel Core i9-14900K', category: 'Processors', brand: 'Intel', price: 195000, stock: 8, serialNumber: '70452345', barcode: '4938271650124', createdAt: '2026-01-02T09:30:00', warranty: '3 years', lowStockThreshold: 6 },
  { id: '3', name: 'NVIDIA GeForce RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 620000, stock: 5, serialNumber: '70453456', barcode: '4938271650125', createdAt: '2026-01-03T10:15:00', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 3 },
  { id: '4', name: 'NVIDIA GeForce RTX 4070 Ti', category: 'Graphics Cards', brand: 'NVIDIA', price: 280000, stock: 15, serialNumber: '70454567', barcode: '4938271650126', createdAt: '2026-01-04T11:45:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '3 years' },
  { id: '5', name: 'AMD Radeon RX 7900 XTX', category: 'Graphics Cards', brand: 'AMD', price: 350000, stock: 7, serialNumber: '70455678', barcode: '4938271650127', createdAt: '2026-01-05T12:20:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '2 years', lowStockThreshold: 5 },
  { id: '6', name: 'Samsung 990 Pro 2TB NVMe SSD', category: 'Storage', brand: 'Samsung', price: 75000, stock: 30, serialNumber: '70456789', barcode: '4938271650128', createdAt: '2026-01-06T13:30:00', warranty: '5 years' },
  { id: '7', name: 'WD Black SN850X 1TB', category: 'Storage', brand: 'Western Digital', price: 42000, stock: 45, serialNumber: '70457890', barcode: '4938271650129', createdAt: '2026-01-07T14:00:00', warranty: '5 years' },
  { id: '8', name: 'Corsair Vengeance DDR5 32GB (2x16GB)', category: 'Memory', brand: 'Corsair', price: 48000, stock: 25, serialNumber: '70458901', barcode: '4938271650130', createdAt: '2026-01-08T15:15:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime' },
  { id: '9', name: 'G.Skill Trident Z5 64GB DDR5', category: 'Memory', brand: 'G.Skill', price: 95000, stock: 10, serialNumber: '70459012', barcode: '4938271650131', createdAt: '2026-01-09T16:45:00', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=60', warranty: 'Lifetime' },
  { id: '10', name: 'ASUS ROG Maximus Z790 Hero', category: 'Motherboards', brand: 'ASUS', price: 185000, stock: 6, serialNumber: '70460123', barcode: '4938271650132', createdAt: '2026-01-10T17:00:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4 },
  { id: '11', name: 'MSI MEG Z790 ACE', category: 'Motherboards', brand: 'MSI', price: 165000, stock: 8, serialNumber: '70461234', barcode: '4938271650133', createdAt: '2026-01-15T08:30:00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=60', warranty: '3 years' },
  { id: '12', name: 'Corsair RM1000x 1000W PSU', category: 'Power Supply', brand: 'Corsair', price: 55000, stock: 20, serialNumber: '70462345', barcode: '4938271650134', createdAt: '2026-01-16T09:00:00', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', warranty: '10 years' },
  { id: '13', name: 'NZXT Kraken X73 RGB', category: 'Cooling', brand: 'NZXT', price: 75000, stock: 18, serialNumber: '70463456', barcode: '4938271650135', createdAt: '2026-01-17T10:15:00', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=60', warranty: '6 years' },
  { id: '14', name: 'Lian Li O11 Dynamic EVO', category: 'Cases', brand: 'Lian Li', price: 58000, stock: 12, serialNumber: '70464567', barcode: '4938271650136', createdAt: '2026-01-20T11:30:00', image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=500&q=60', warranty: '2 years' },
  { id: '15', name: 'LG UltraGear 27GP950-B 4K Monitor', category: 'Monitors', brand: 'LG', price: 195000, stock: 6, serialNumber: '70465678', barcode: '4938271650137', createdAt: '2026-01-22T12:45:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 4 },
  { id: '16', name: 'Samsung Odyssey G9 49" Monitor', category: 'Monitors', brand: 'Samsung', price: 380000, stock: 3, serialNumber: '70466789', barcode: '4938271650138', createdAt: '2026-01-24T13:20:00', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60', warranty: '3 years', lowStockThreshold: 2 },
  { id: '17', name: 'Logitech G Pro X Superlight 2', category: 'Peripherals', brand: 'Logitech', price: 52000, stock: 35, serialNumber: '70467890', barcode: '4938271650139', createdAt: '2026-01-25T14:00:00', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=60', warranty: '2 years' },
  { id: '18', name: 'Razer Huntsman V3 Pro', category: 'Peripherals', brand: 'Razer', price: 68000, stock: 20, serialNumber: '70468901', barcode: '4938271650140', createdAt: '2026-01-27T15:00:00', warranty: '2 years' },
  { id: '19', name: 'SteelSeries Arctis Nova Pro', category: 'Peripherals', brand: 'SteelSeries', price: 95000, stock: 15, serialNumber: '70469012', barcode: '4938271650141', createdAt: '2026-01-28T16:30:00', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=60', warranty: '1 year' },
  { id: '20', name: 'Seagate Exos 18TB HDD', category: 'Storage', brand: 'Seagate', price: 125000, stock: 8, serialNumber: '70470123', barcode: '4938271650142', createdAt: '2026-01-31T17:15:00', warranty: '5 years' },
];

// Export the helper function for use in other files
export { generateSerialNumber };

// Customers
export const mockCustomers: Customer[] = [
  { id: '1', name: 'Kasun Perera', email: 'kasun@gmail.com', phone: '077-1234567', address: 'No. 12, Galle Road, Colombo', totalSpent: 580000, totalOrders: 5, lastPurchase: '2024-01-15' },
  { id: '2', name: 'Nimali Fernando', email: 'nimali@email.com', phone: '076-2345678', address: '12A, Kandy Rd, Kurunegala', totalSpent: 320000, totalOrders: 3, lastPurchase: '2024-01-10' },
  { id: '3', name: 'Tech Solutions Ltd', email: 'info@techsol.lk', phone: '011-2567890', address: 'No. 45, Industrial Estate, Colombo 15', totalSpent: 2500000, totalOrders: 18, lastPurchase: '2024-01-18' },
  { id: '4', name: 'Dilshan Silva', email: 'dilshan.s@hotmail.com', phone: '078-3456789', address: '78/2, Hill Street, Kandy', totalSpent: 185000, totalOrders: 2, lastPurchase: '2024-01-05' },
  { id: '5', name: 'GameZone Café', email: 'contact@gamezone.lk', phone: '011-3456789', address: 'Shop 5, Arcade Mall, Colombo', totalSpent: 3200000, totalOrders: 25, lastPurchase: '2024-01-20' },
  { id: '6', name: 'Priya Jayawardena', email: 'priya.j@yahoo.com', phone: '071-4567890', address: 'No. 7, Lake Road, Galle', totalSpent: 95000, totalOrders: 1, lastPurchase: '2024-01-12' },
  { id: '7', name: 'Creative Studios', email: 'studio@creative.lk', phone: '011-4567891', address: 'Studio 3, Art Lane, Colombo', totalSpent: 1850000, totalOrders: 12, lastPurchase: '2024-01-16' },
  { id: '8', name: 'Sanjay Mendis', email: 'sanjay.m@gmail.com', phone: '077-5678901', address: 'No. 21, Thotalanga Road, Colombo', totalSpent: 420000, totalOrders: 4, lastPurchase: '2024-01-08' },
];

// Invoices
export const mockInvoices: Invoice[] = [
  {
    id: '10240001',
    customerId: '1',
    customerName: 'Kasun Perera',
    items: [
      { productId: '1', productName: 'AMD Ryzen 9 7950X', quantity: 1, unitPrice: 185000, total: 185000, warrantyDueDate: '2027-01-15' },
      { productId: '8', productName: 'Corsair Vengeance DDR5 32GB', quantity: 2, unitPrice: 48000, total: 96000 },
    ],
    subtotal: 281000,
    tax: 42150,
    total: 323150,
    status: 'fullpaid',
    paidAmount: 323150,
    date: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMethod: 'card',
    salesChannel: 'on-site',
  },
  {
    id: '10240002',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    items: [
      { productId: '3', productName: 'NVIDIA GeForce RTX 4090', quantity: 2, unitPrice: 620000, total: 1240000, warrantyDueDate: '2027-01-18' },
      { productId: '10', productName: 'ASUS ROG Maximus Z790 Hero', quantity: 2, unitPrice: 185000, total: 370000, warrantyDueDate: '2027-01-18' },
      { productId: '12', productName: 'Corsair RM1000x 1000W PSU', quantity: 2, unitPrice: 55000, total: 110000, warrantyDueDate: '2034-01-18' },
    ],
    subtotal: 1720000,
    tax: 258000,
    total: 1978000,
    status: 'fullpaid',
    paidAmount: 1978000,
    date: '2024-01-18',
    dueDate: '2024-02-02',
    paymentMethod: 'bank_transfer',
    salesChannel: 'on-site',
  },
  {
    id: '10240003',
    customerId: '5',
    customerName: 'GameZone Café',
    items: [
      { productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', quantity: 5, unitPrice: 280000, total: 1400000, warrantyDueDate: '2027-01-20' },
      { productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', quantity: 5, unitPrice: 195000, total: 975000, warrantyDueDate: '2027-01-20' },
    ],
    subtotal: 2375000,
    tax: 356250,
    total: 2731250,
    status: 'halfpay',
    paidAmount: 1500000,
    date: '2024-01-20',
    dueDate: '2024-02-04',
    paymentMethod: 'credit',
    salesChannel: 'online',
  },
  {
    id: '10240004',
    customerId: '2',
    customerName: 'Nimali Fernando',
    items: [
      { productId: '17', productName: 'Logitech G Pro X Superlight 2', quantity: 1, unitPrice: 52000, total: 52000, warrantyDueDate: '2026-01-10' },
      { productId: '18', productName: 'Razer Huntsman V3 Pro', quantity: 1, unitPrice: 68000, total: 68000, warrantyDueDate: '2026-01-10' },
    ],
    subtotal: 120000,
    tax: 18000,
    total: 138000,
    status: 'fullpaid',
    paidAmount: 138000,
    date: '2024-01-10',
    dueDate: '2024-01-25',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  {
    id: '10240005',
    customerId: '7',
    customerName: 'Creative Studios',
    items: [
      { productId: '16', productName: 'Samsung Odyssey G9 49" Monitor', quantity: 2, unitPrice: 380000, total: 760000, warrantyDueDate: '2027-01-02' },
      { productId: '2', productName: 'Intel Core i9-14900K', quantity: 2, unitPrice: 195000, total: 390000, warrantyDueDate: '2027-01-02' },
    ],
    subtotal: 1150000,
    tax: 172500,
    total: 1322500,
    status: 'unpaid',
    paidAmount: 0,
    date: '2024-01-02',
    dueDate: '2024-01-17',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
  {
    id: '10240006',
    customerId: '4',
    customerName: 'Dilshan Silva',
    items: [
      { productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', quantity: 1, unitPrice: 75000, total: 75000, warrantyDueDate: '2029-01-05' },
      { productId: '13', productName: 'NZXT Kraken X73 RGB', quantity: 1, unitPrice: 75000, total: 75000, warrantyDueDate: '2030-01-05' },
    ],
    subtotal: 150000,
    tax: 22500,
    total: 172500,
    status: 'halfpay',
    paidAmount: 100000,
    date: '2024-01-05',
    dueDate: '2024-01-20',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  // More invoices with warranty data for testing
  {
    id: '10250007',
    customerId: '1',
    customerName: 'Kasun Perera',
    items: [
      { productId: '19', productName: 'SteelSeries Arctis Nova Pro', quantity: 1, unitPrice: 95000, total: 95000, warrantyDueDate: '2026-01-20' },
    ],
    subtotal: 95000,
    tax: 14250,
    total: 109250,
    status: 'fullpaid',
    paidAmount: 109250,
    date: '2025-01-20',
    dueDate: '2025-02-04',
    paymentMethod: 'card',
    salesChannel: 'on-site',
  },
  {
    id: '10250008',
    customerId: '8',
    customerName: 'Sanjay Mendis',
    items: [
      { productId: '5', productName: 'AMD Radeon RX 7900 XTX', quantity: 1, unitPrice: 350000, total: 350000, warrantyDueDate: '2027-02-10' },
      { productId: '7', productName: 'WD Black SN850X 1TB', quantity: 2, unitPrice: 42000, total: 84000, warrantyDueDate: '2030-02-10' },
    ],
    subtotal: 434000,
    tax: 65100,
    total: 499100,
    status: 'fullpaid',
    paidAmount: 499100,
    date: '2025-02-10',
    dueDate: '2025-02-25',
    paymentMethod: 'bank_transfer',
    salesChannel: 'online',
  },
  {
    id: '10250009',
    customerId: '6',
    customerName: 'Priya Jayawardena',
    items: [
      { productId: '14', productName: 'Lian Li O11 Dynamic EVO', quantity: 1, unitPrice: 58000, total: 58000, warrantyDueDate: '2027-03-15' },
      { productId: '9', productName: 'G.Skill Trident Z5 64GB DDR5', quantity: 1, unitPrice: 95000, total: 95000 },
    ],
    subtotal: 153000,
    tax: 22950,
    total: 175950,
    status: 'fullpaid',
    paidAmount: 175950,
    date: '2025-03-15',
    dueDate: '2025-03-30',
    paymentMethod: 'cash',
    salesChannel: 'on-site',
  },
  {
    id: '10250010',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    items: [
      { productId: '11', productName: 'MSI MEG Z790 ACE', quantity: 3, unitPrice: 165000, total: 495000, warrantyDueDate: '2028-04-20' },
      { productId: '20', productName: 'Seagate Exos 18TB HDD', quantity: 5, unitPrice: 125000, total: 625000, warrantyDueDate: '2030-04-20' },
    ],
    subtotal: 1120000,
    tax: 168000,
    total: 1288000,
    status: 'halfpay',
    paidAmount: 800000,
    date: '2025-04-20',
    dueDate: '2025-05-05',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
  {
    id: '10250011',
    customerId: '5',
    customerName: 'GameZone Café',
    items: [
      { productId: '17', productName: 'Logitech G Pro X Superlight 2', quantity: 10, unitPrice: 52000, originalPrice: 55000, total: 520000, warrantyDueDate: '2027-05-10' },
      { productId: '18', productName: 'Razer Huntsman V3 Pro', quantity: 10, unitPrice: 65000, originalPrice: 68000, total: 650000, warrantyDueDate: '2027-05-10' },
    ],
    subtotal: 1170000,
    tax: 175500,
    total: 1345500,
    status: 'fullpaid',
    paidAmount: 1345500,
    date: '2025-05-10',
    dueDate: '2025-05-25',
    paymentMethod: 'bank_transfer',
    salesChannel: 'online',
  },
  {
    id: '10250012',
    customerId: '2',
    customerName: 'Nimali Fernando',
    items: [
      { productId: '8', productName: 'Corsair Vengeance DDR5 32GB', quantity: 2, unitPrice: 45000, originalPrice: 48000, total: 90000 },
    ],
    subtotal: 90000,
    tax: 13500,
    total: 103500,
    status: 'unpaid',
    paidAmount: 0,
    date: '2025-06-01',
    dueDate: '2025-06-16',
    paymentMethod: 'credit',
    salesChannel: 'on-site',
  },
];

// Sales History - tracks all product sales with discounts
export const mockSalesHistory: SaleRecord[] = [
  // AMD Ryzen 9 7950X sales (Product ID: 1) - Many sales for scrolling demo
  { id: 'SALE-001', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0001', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-01-15T10:30:00' },
  { id: 'SALE-002', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0007', quantity: 2, unitPrice: 185000, discount: 5, discountAmount: 18500, finalPrice: 175750, total: 351500, saleDate: '2024-01-22T14:15:00' },
  { id: 'SALE-003', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0010', quantity: 1, unitPrice: 185000, discount: 3, discountAmount: 5550, finalPrice: 179450, total: 179450, saleDate: '2025-12-28T09:45:00' },
  { id: 'SALE-026', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0019', quantity: 3, unitPrice: 185000, discount: 8, discountAmount: 44400, finalPrice: 170200, total: 510600, saleDate: '2024-02-10T11:20:00' },
  { id: 'SALE-027', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0020', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-03-05T14:00:00' },
  { id: 'SALE-028', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0021', quantity: 1, unitPrice: 185000, discount: 2, discountAmount: 3700, finalPrice: 181300, total: 181300, saleDate: '2024-04-12T16:30:00' },
  { id: 'SALE-029', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0022', quantity: 5, unitPrice: 185000, discount: 12, discountAmount: 111000, finalPrice: 162800, total: 814000, saleDate: '2024-05-20T10:15:00' },
  { id: 'SALE-030', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0023', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-06-08T09:00:00' },
  { id: 'SALE-031', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0024', quantity: 2, unitPrice: 185000, discount: 5, discountAmount: 18500, finalPrice: 175750, total: 351500, saleDate: '2024-07-15T13:45:00' },
  { id: 'SALE-032', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0025', quantity: 2, unitPrice: 185000, discount: 6, discountAmount: 22200, finalPrice: 173900, total: 347800, saleDate: '2024-08-22T15:20:00' },
  { id: 'SALE-033', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0026', quantity: 1, unitPrice: 185000, discount: 3, discountAmount: 5550, finalPrice: 179450, total: 179450, saleDate: '2024-09-10T11:00:00' },
  { id: 'SALE-034', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0027', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2024-10-18T14:30:00' },
  { id: 'SALE-035', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0028', quantity: 4, unitPrice: 185000, discount: 10, discountAmount: 74000, finalPrice: 166500, total: 666000, saleDate: '2024-11-25T10:45:00' },
  { id: 'SALE-036', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0029', quantity: 2, unitPrice: 185000, discount: 7, discountAmount: 25900, finalPrice: 172050, total: 344100, saleDate: '2025-01-08T16:00:00' },
  { id: 'SALE-037', productId: '1', productName: 'AMD Ryzen 9 7950X', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0030', quantity: 1, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 185000, saleDate: '2025-02-14T12:30:00' },
  
  // Intel Core i9-14900K sales
  { id: 'SALE-004', productId: '2', productName: 'Intel Core i9-14900K', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0005', quantity: 2, unitPrice: 195000, discount: 0, discountAmount: 0, finalPrice: 195000, total: 390000, saleDate: '2024-01-02T11:20:00' },
  { id: 'SALE-005', productId: '2', productName: 'Intel Core i9-14900K', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0008', quantity: 3, unitPrice: 195000, discount: 8, discountAmount: 46800, finalPrice: 179400, total: 538200, saleDate: '2025-11-15T16:00:00' },
  
  // NVIDIA GeForce RTX 4090 sales (Product ID: 3) - Many sales for scrolling demo
  { id: 'SALE-006', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 1240000, saleDate: '2024-01-18T09:00:00' },
  { id: 'SALE-007', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0009', quantity: 1, unitPrice: 620000, discount: 10, discountAmount: 62000, finalPrice: 558000, total: 558000, saleDate: '2025-12-20T13:30:00' },
  { id: 'SALE-038', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0031', quantity: 2, unitPrice: 620000, discount: 5, discountAmount: 62000, finalPrice: 589000, total: 1178000, saleDate: '2024-02-28T10:00:00' },
  { id: 'SALE-039', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0032', quantity: 1, unitPrice: 620000, discount: 3, discountAmount: 18600, finalPrice: 601400, total: 601400, saleDate: '2024-03-15T14:45:00' },
  { id: 'SALE-040', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0033', quantity: 3, unitPrice: 620000, discount: 12, discountAmount: 223200, finalPrice: 545600, total: 1636800, saleDate: '2024-04-22T11:30:00' },
  { id: 'SALE-041', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0034', quantity: 4, unitPrice: 620000, discount: 15, discountAmount: 372000, finalPrice: 527000, total: 2108000, saleDate: '2024-05-10T16:15:00' },
  { id: 'SALE-042', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0035', quantity: 1, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 620000, saleDate: '2024-06-05T09:30:00' },
  { id: 'SALE-043', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0036', quantity: 1, unitPrice: 620000, discount: 5, discountAmount: 31000, finalPrice: 589000, total: 589000, saleDate: '2024-07-20T13:00:00' },
  { id: 'SALE-044', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0037', quantity: 2, unitPrice: 620000, discount: 8, discountAmount: 99200, finalPrice: 570400, total: 1140800, saleDate: '2024-08-12T15:45:00' },
  { id: 'SALE-045', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0038', quantity: 2, unitPrice: 620000, discount: 7, discountAmount: 86800, finalPrice: 576600, total: 1153200, saleDate: '2024-09-28T10:20:00' },
  { id: 'SALE-046', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0039', quantity: 1, unitPrice: 620000, discount: 0, discountAmount: 0, finalPrice: 620000, total: 620000, saleDate: '2024-10-15T14:10:00' },
  { id: 'SALE-047', productId: '3', productName: 'NVIDIA GeForce RTX 4090', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0040', quantity: 2, unitPrice: 620000, discount: 10, discountAmount: 124000, finalPrice: 558000, total: 1116000, saleDate: '2024-11-08T11:00:00' },
  
  // NVIDIA GeForce RTX 4070 Ti sales
  { id: 'SALE-008', productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0003', quantity: 5, unitPrice: 280000, discount: 0, discountAmount: 0, finalPrice: 280000, total: 1400000, saleDate: '2024-01-20T15:45:00' },
  { id: 'SALE-009', productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0011', quantity: 1, unitPrice: 280000, discount: 5, discountAmount: 14000, finalPrice: 266000, total: 266000, saleDate: '2025-12-05T10:20:00' },
  
  // Samsung 990 Pro 2TB sales (Product ID: 6) - Many sales for scrolling demo
  { id: 'SALE-010', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0006', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-01-05T12:00:00' },
  { id: 'SALE-011', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0012', quantity: 5, unitPrice: 75000, discount: 12, discountAmount: 45000, finalPrice: 66000, total: 330000, saleDate: '2025-11-28T14:30:00' },
  { id: 'SALE-012', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0013', quantity: 2, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 150000, saleDate: '2026-01-03T11:15:00' },
  { id: 'SALE-048', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0041', quantity: 2, unitPrice: 75000, discount: 5, discountAmount: 7500, finalPrice: 71250, total: 142500, saleDate: '2024-02-18T10:00:00' },
  { id: 'SALE-049', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0042', quantity: 4, unitPrice: 75000, discount: 8, discountAmount: 24000, finalPrice: 69000, total: 276000, saleDate: '2024-03-25T14:20:00' },
  { id: 'SALE-050', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0043', quantity: 10, unitPrice: 75000, discount: 15, discountAmount: 112500, finalPrice: 63750, total: 637500, saleDate: '2024-04-08T09:45:00' },
  { id: 'SALE-051', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0044', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-05-15T16:30:00' },
  { id: 'SALE-052', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0045', quantity: 8, unitPrice: 75000, discount: 10, discountAmount: 60000, finalPrice: 67500, total: 540000, saleDate: '2024-06-22T11:15:00' },
  { id: 'SALE-053', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0046', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-07-10T13:00:00' },
  { id: 'SALE-054', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0047', quantity: 6, unitPrice: 75000, discount: 7, discountAmount: 31500, finalPrice: 69750, total: 418500, saleDate: '2024-08-28T15:45:00' },
  { id: 'SALE-055', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0048', quantity: 3, unitPrice: 75000, discount: 5, discountAmount: 11250, finalPrice: 71250, total: 213750, saleDate: '2024-09-12T10:30:00' },
  { id: 'SALE-056', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0049', quantity: 2, unitPrice: 75000, discount: 3, discountAmount: 4500, finalPrice: 72750, total: 145500, saleDate: '2024-10-20T14:15:00' },
  { id: 'SALE-057', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0050', quantity: 5, unitPrice: 75000, discount: 8, discountAmount: 30000, finalPrice: 69000, total: 345000, saleDate: '2024-11-05T09:00:00' },
  { id: 'SALE-058', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0051', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-12-18T16:00:00' },
  { id: 'SALE-059', productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0052', quantity: 4, unitPrice: 75000, discount: 6, discountAmount: 18000, finalPrice: 70500, total: 282000, saleDate: '2025-01-10T11:30:00' },
  
  // Corsair Vengeance DDR5 sales
  { id: 'SALE-013', productId: '8', productName: 'Corsair Vengeance DDR5 32GB (2x16GB)', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0001', quantity: 2, unitPrice: 48000, discount: 0, discountAmount: 0, finalPrice: 48000, total: 96000, saleDate: '2024-01-15T10:30:00' },
  { id: 'SALE-014', productId: '8', productName: 'Corsair Vengeance DDR5 32GB (2x16GB)', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0014', quantity: 4, unitPrice: 48000, discount: 7, discountAmount: 13440, finalPrice: 44640, total: 178560, saleDate: '2025-12-10T09:00:00' },
  
  // ASUS ROG Maximus Z790 Hero sales
  { id: 'SALE-015', productId: '10', productName: 'ASUS ROG Maximus Z790 Hero', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 185000, discount: 0, discountAmount: 0, finalPrice: 185000, total: 370000, saleDate: '2024-01-18T09:00:00' },
  
  // Corsair RM1000x PSU sales
  { id: 'SALE-016', productId: '12', productName: 'Corsair RM1000x 1000W PSU', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0002', quantity: 2, unitPrice: 55000, discount: 0, discountAmount: 0, finalPrice: 55000, total: 110000, saleDate: '2024-01-18T09:00:00' },
  { id: 'SALE-017', productId: '12', productName: 'Corsair RM1000x 1000W PSU', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0015', quantity: 3, unitPrice: 55000, discount: 5, discountAmount: 8250, finalPrice: 52250, total: 156750, saleDate: '2026-01-05T16:45:00' },
  
  // NZXT Kraken X73 RGB sales
  { id: 'SALE-018', productId: '13', productName: 'NZXT Kraken X73 RGB', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0006', quantity: 1, unitPrice: 75000, discount: 0, discountAmount: 0, finalPrice: 75000, total: 75000, saleDate: '2024-01-05T12:00:00' },
  
  // LG UltraGear Monitor sales
  { id: 'SALE-019', productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0003', quantity: 5, unitPrice: 195000, discount: 0, discountAmount: 0, finalPrice: 195000, total: 975000, saleDate: '2024-01-20T15:45:00' },
  { id: 'SALE-020', productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0016', quantity: 2, unitPrice: 195000, discount: 10, discountAmount: 39000, finalPrice: 175500, total: 351000, saleDate: '2026-01-08T10:30:00' },
  
  // Samsung Odyssey G9 Monitor sales
  { id: 'SALE-021', productId: '16', productName: 'Samsung Odyssey G9 49" Monitor', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0005', quantity: 2, unitPrice: 380000, discount: 0, discountAmount: 0, finalPrice: 380000, total: 760000, saleDate: '2024-01-02T11:20:00' },
  
  // Logitech Mouse sales (Product ID: 17) - Many sales for scrolling demo
  { id: 'SALE-022', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0004', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-01-10T13:00:00' },
  { id: 'SALE-023', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0017', quantity: 10, unitPrice: 52000, discount: 15, discountAmount: 78000, finalPrice: 44200, total: 442000, saleDate: '2025-12-15T14:00:00' },
  { id: 'SALE-060', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0053', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-02-05T10:30:00' },
  { id: 'SALE-061', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0054', quantity: 3, unitPrice: 52000, discount: 5, discountAmount: 7800, finalPrice: 49400, total: 148200, saleDate: '2024-03-12T15:15:00' },
  { id: 'SALE-062', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0055', quantity: 8, unitPrice: 52000, discount: 10, discountAmount: 41600, finalPrice: 46800, total: 374400, saleDate: '2024-04-20T11:00:00' },
  { id: 'SALE-063', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0056', quantity: 5, unitPrice: 52000, discount: 8, discountAmount: 20800, finalPrice: 47840, total: 239200, saleDate: '2024-05-28T14:45:00' },
  { id: 'SALE-064', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '4', customerName: 'Dilshan Silva', invoiceId: 'INV-2024-0057', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-06-15T09:20:00' },
  { id: 'SALE-065', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '6', customerName: 'Priya Jayawardena', invoiceId: 'INV-2024-0058', quantity: 1, unitPrice: 52000, discount: 3, discountAmount: 1560, finalPrice: 50440, total: 50440, saleDate: '2024-07-22T16:30:00' },
  { id: 'SALE-066', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0059', quantity: 6, unitPrice: 52000, discount: 12, discountAmount: 37440, finalPrice: 45760, total: 274560, saleDate: '2024-08-10T12:00:00' },
  { id: 'SALE-067', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '8', customerName: 'Sanjay Mendis', invoiceId: 'INV-2024-0060', quantity: 2, unitPrice: 52000, discount: 5, discountAmount: 5200, finalPrice: 49400, total: 98800, saleDate: '2024-09-18T10:45:00' },
  { id: 'SALE-068', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '7', customerName: 'Creative Studios', invoiceId: 'INV-2024-0061', quantity: 4, unitPrice: 52000, discount: 7, discountAmount: 14560, finalPrice: 48360, total: 193440, saleDate: '2024-10-25T15:30:00' },
  { id: 'SALE-069', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '1', customerName: 'Kasun Perera', invoiceId: 'INV-2024-0062', quantity: 1, unitPrice: 52000, discount: 0, discountAmount: 0, finalPrice: 52000, total: 52000, saleDate: '2024-11-12T13:15:00' },
  { id: 'SALE-070', productId: '17', productName: 'Logitech G Pro X Superlight 2', customerId: '3', customerName: 'Tech Solutions Ltd', invoiceId: 'INV-2024-0063', quantity: 10, unitPrice: 52000, discount: 15, discountAmount: 78000, finalPrice: 44200, total: 442000, saleDate: '2024-12-05T11:00:00' },
  
  // Razer Keyboard sales
  { id: 'SALE-024', productId: '18', productName: 'Razer Huntsman V3 Pro', customerId: '2', customerName: 'Nimali Fernando', invoiceId: 'INV-2024-0004', quantity: 1, unitPrice: 68000, discount: 0, discountAmount: 0, finalPrice: 68000, total: 68000, saleDate: '2024-01-10T13:00:00' },
  { id: 'SALE-025', productId: '18', productName: 'Razer Huntsman V3 Pro', customerId: '5', customerName: 'GameZone Café', invoiceId: 'INV-2024-0018', quantity: 5, unitPrice: 68000, discount: 10, discountAmount: 34000, finalPrice: 61200, total: 306000, saleDate: '2026-01-02T11:30:00' },
];

// Categories for Computer Shop
export const productCategories = [
  'Processors',
  'Graphics Cards',
  'Motherboards',
  'Memory',
  'Storage',
  'Power Supply',
  'Cooling',
  'Cases',
  'Monitors',
  'Peripherals',
];

// Brands
export const productBrands = [
  'AMD',
  'Intel',
  'NVIDIA',
  'ASUS',
  'MSI',
  'Corsair',
  'G.Skill',
  'Samsung',
  'Western Digital',
  'Seagate',
  'NZXT',
  'Lian Li',
  'LG',
  'Logitech',
  'Razer',
  'SteelSeries',
];

// Generate 8-digit claim number
export const generateClaimNumber = (): string => {
  return Date.now().toString().slice(-8);
};

// Warranty Claims - tracks all warranty issues and replacements
export const mockWarrantyClaims: WarrantyClaim[] = [
  {
    id: '25010001',
    invoiceId: '10240001',
    invoiceItemIndex: 0,
    productId: '1',
    productName: 'AMD Ryzen 9 7950X',
    productSerialNumber: '70451234',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '077-1234567',
    claimDate: '2025-06-15T10:30:00',
    warrantyExpiryDate: '2027-01-15',
    status: 'replaced',
    issueDescription: 'Processor not booting, multiple diagnostic tests failed. System shows no POST with this CPU.',
    issueCategory: 'defective',
    resolution: 'One-to-one replacement provided. Original unit sent to AMD for RMA.',
    resolutionDate: '2025-06-18T14:45:00',
    isReplacement: true,
    replacementProductId: '1',
    replacementProductName: 'AMD Ryzen 9 7950X',
    replacementSerialNumber: '70981234',
    replacementDate: '2025-06-18T14:45:00',
    notes: 'Customer brought the original box and all accessories. Quick replacement processed.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010002',
    invoiceId: '10240002',
    invoiceItemIndex: 0,
    productId: '3',
    productName: 'NVIDIA GeForce RTX 4090',
    productSerialNumber: '70453456',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    customerPhone: '011-2567890',
    claimDate: '2025-05-20T09:15:00',
    warrantyExpiryDate: '2027-01-18',
    status: 'under-review',
    issueDescription: 'Artifacting on screen during heavy GPU load. Thermal throttling observed even with adequate cooling.',
    issueCategory: 'performance',
    isReplacement: false,
    notes: 'Sent to NVIDIA service center for evaluation. Awaiting diagnostic report.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010003',
    invoiceId: '10240003',
    invoiceItemIndex: 1,
    productId: '15',
    productName: 'LG UltraGear 27GP950-B 4K Monitor',
    customerId: '5',
    customerName: 'GameZone Café',
    customerPhone: '011-3456789',
    claimDate: '2025-04-10T11:00:00',
    warrantyExpiryDate: '2027-01-20',
    status: 'approved',
    issueDescription: 'Dead pixels appeared in the center of screen. Count exceeds acceptable limit per LG policy.',
    issueCategory: 'defective',
    resolution: 'Approved for replacement. Waiting for replacement unit from LG.',
    resolutionDate: '2025-04-12T16:30:00',
    isReplacement: false,
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010004',
    invoiceId: '10240004',
    invoiceItemIndex: 0,
    productId: '17',
    productName: 'Logitech G Pro X Superlight 2',
    customerId: '2',
    customerName: 'Nimali Fernando',
    customerPhone: '076-2345678',
    claimDate: '2025-07-05T14:20:00',
    warrantyExpiryDate: '2026-01-10',
    status: 'rejected',
    issueDescription: 'Mouse scroll wheel not working properly after 6 months of use.',
    issueCategory: 'not-working',
    resolution: 'Claim rejected - Physical damage found on scroll wheel mechanism consistent with liquid damage.',
    resolutionDate: '2025-07-08T10:00:00',
    isReplacement: false,
    notes: 'Customer admitted to accidental coffee spill. Offered repair at discounted rate.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010005',
    invoiceId: '10250008',
    invoiceItemIndex: 0,
    productId: '5',
    productName: 'AMD Radeon RX 7900 XTX',
    productSerialNumber: '70455678',
    customerId: '8',
    customerName: 'Sanjay Mendis',
    customerPhone: '077-5678901',
    claimDate: '2025-08-01T16:45:00',
    warrantyExpiryDate: '2027-02-10',
    status: 'repaired',
    issueDescription: 'Fan noise excessive, one fan not spinning at correct RPM.',
    issueCategory: 'damaged',
    resolution: 'Fan assembly replaced. Card tested and returned to customer.',
    resolutionDate: '2025-08-05T11:30:00',
    isReplacement: false,
    notes: 'Repair completed in-house. New fan assembly sourced from AMD.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010006',
    invoiceId: '10240006',
    invoiceItemIndex: 0,
    productId: '6',
    productName: 'Samsung 990 Pro 2TB NVMe SSD',
    productSerialNumber: '70456789',
    customerId: '4',
    customerName: 'Dilshan Silva',
    customerPhone: '078-3456789',
    claimDate: '2025-09-10T09:00:00',
    warrantyExpiryDate: '2029-01-05',
    status: 'pending',
    issueDescription: 'SSD showing SMART errors, health at 85% after only 8 months of normal use.',
    issueCategory: 'performance',
    isReplacement: false,
    notes: 'Waiting for customer to bring the drive for diagnostic.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010007',
    invoiceId: '10240002',
    invoiceItemIndex: 2,
    productId: '12',
    productName: 'Corsair RM1000x 1000W PSU',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    customerPhone: '011-2567890',
    claimDate: '2025-03-25T13:15:00',
    warrantyExpiryDate: '2034-01-18',
    status: 'replaced',
    issueDescription: 'PSU making clicking noise and occasionally shuts down under load.',
    issueCategory: 'defective',
    resolution: 'Immediate replacement provided due to safety concerns. Defective unit returned to Corsair.',
    resolutionDate: '2025-03-25T15:00:00',
    isReplacement: true,
    replacementProductId: '12',
    replacementProductName: 'Corsair RM1000x 1000W PSU',
    replacementSerialNumber: '70995678',
    replacementDate: '2025-03-25T15:00:00',
    notes: 'Same-day replacement due to potential fire hazard.',
    handledBy: 'Nuwan Silva',
  },
  {
    id: '25010008',
    invoiceId: '10250011',
    invoiceItemIndex: 1,
    productId: '18',
    productName: 'Razer Huntsman V3 Pro',
    customerId: '5',
    customerName: 'GameZone Café',
    customerPhone: '011-3456789',
    claimDate: '2025-10-15T10:30:00',
    warrantyExpiryDate: '2027-05-10',
    status: 'pending',
    issueDescription: 'Multiple keys (W, A, S) not registering consistently during gameplay.',
    issueCategory: 'not-working',
    isReplacement: false,
    notes: 'Customer uses keyboard in gaming café environment. Heavy daily usage.',
  },
  {
    id: '25010009',
    invoiceId: '10240001',
    invoiceItemIndex: 1,
    productId: '8',
    productName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '077-1234567',
    claimDate: '2025-11-20T14:00:00',
    warrantyExpiryDate: '2099-12-31', // Lifetime warranty
    status: 'replaced',
    issueDescription: 'One memory stick causing random BSODs and memtest86 errors.',
    issueCategory: 'defective',
    resolution: 'Full kit replaced under lifetime warranty.',
    resolutionDate: '2025-11-22T11:00:00',
    isReplacement: true,
    replacementProductId: '8',
    replacementProductName: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    replacementSerialNumber: '70998765',
    replacementDate: '2025-11-22T11:00:00',
    notes: 'Lifetime warranty - no questions asked replacement.',
    handledBy: 'Chamara Fernando',
  },
  {
    id: '25010010',
    invoiceId: '10250007',
    invoiceItemIndex: 0,
    productId: '19',
    productName: 'SteelSeries Arctis Nova Pro',
    customerId: '1',
    customerName: 'Kasun Perera',
    customerPhone: '077-1234567',
    claimDate: '2025-12-01T09:45:00',
    warrantyExpiryDate: '2026-01-20',
    status: 'under-review',
    issueDescription: 'Left ear cup audio cutting out intermittently. Cable connection seems loose.',
    issueCategory: 'not-working',
    isReplacement: false,
    notes: 'Warranty expiring soon. Prioritized for quick evaluation.',
    handledBy: 'Nuwan Silva',
  },
];
