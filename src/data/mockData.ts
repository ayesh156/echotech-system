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
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Helper function to generate unique 8-digit numeric serial number based on timestamp
// Uses last 8 digits of timestamp in milliseconds for uniqueness
const generateSerialNumber = () => {
  return Date.now().toString().slice(-8);
};

// Computer Shop Products
export const mockProducts: Product[] = [
  { id: '1', name: 'AMD Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 185000, stock: 12, serialNumber: '70451234', barcode: '4938271650123', createdAt: '2026-01-01T08:00:00' },
  { id: '2', name: 'Intel Core i9-14900K', category: 'Processors', brand: 'Intel', price: 195000, stock: 8, serialNumber: '70452345', barcode: '4938271650124', createdAt: '2026-01-02T09:30:00' },
  { id: '3', name: 'NVIDIA GeForce RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 620000, stock: 5, serialNumber: '70453456', barcode: '4938271650125', createdAt: '2026-01-03T10:15:00' },
  { id: '4', name: 'NVIDIA GeForce RTX 4070 Ti', category: 'Graphics Cards', brand: 'NVIDIA', price: 280000, stock: 15, serialNumber: '70454567', barcode: '4938271650126', createdAt: '2026-01-04T11:45:00' },
  { id: '5', name: 'AMD Radeon RX 7900 XTX', category: 'Graphics Cards', brand: 'AMD', price: 350000, stock: 7, serialNumber: '70455678', barcode: '4938271650127', createdAt: '2026-01-05T12:20:00' },
  { id: '6', name: 'Samsung 990 Pro 2TB NVMe SSD', category: 'Storage', brand: 'Samsung', price: 75000, stock: 30, serialNumber: '70456789', barcode: '4938271650128', createdAt: '2026-01-06T13:30:00' },
  { id: '7', name: 'WD Black SN850X 1TB', category: 'Storage', brand: 'Western Digital', price: 42000, stock: 45, serialNumber: '70457890', barcode: '4938271650129', createdAt: '2026-01-07T14:00:00' },
  { id: '8', name: 'Corsair Vengeance DDR5 32GB (2x16GB)', category: 'Memory', brand: 'Corsair', price: 48000, stock: 25, serialNumber: '70458901', barcode: '4938271650130', createdAt: '2026-01-08T15:15:00' },
  { id: '9', name: 'G.Skill Trident Z5 64GB DDR5', category: 'Memory', brand: 'G.Skill', price: 95000, stock: 10, serialNumber: '70459012', barcode: '4938271650131', createdAt: '2026-01-09T16:45:00' },
  { id: '10', name: 'ASUS ROG Maximus Z790 Hero', category: 'Motherboards', brand: 'ASUS', price: 185000, stock: 6, serialNumber: '70460123', barcode: '4938271650132', createdAt: '2026-01-10T17:00:00' },
  { id: '11', name: 'MSI MEG Z790 ACE', category: 'Motherboards', brand: 'MSI', price: 165000, stock: 8, serialNumber: '70461234', barcode: '4938271650133', createdAt: '2026-01-15T08:30:00' },
  { id: '12', name: 'Corsair RM1000x 1000W PSU', category: 'Power Supply', brand: 'Corsair', price: 55000, stock: 20, serialNumber: '70462345', barcode: '4938271650134', createdAt: '2026-01-16T09:00:00' },
  { id: '13', name: 'NZXT Kraken X73 RGB', category: 'Cooling', brand: 'NZXT', price: 75000, stock: 18, serialNumber: '70463456', barcode: '4938271650135', createdAt: '2026-01-17T10:15:00' },
  { id: '14', name: 'Lian Li O11 Dynamic EVO', category: 'Cases', brand: 'Lian Li', price: 58000, stock: 12, serialNumber: '70464567', barcode: '4938271650136', createdAt: '2026-01-20T11:30:00' },
  { id: '15', name: 'LG UltraGear 27GP950-B 4K Monitor', category: 'Monitors', brand: 'LG', price: 195000, stock: 6, serialNumber: '70465678', barcode: '4938271650137', createdAt: '2026-01-22T12:45:00' },
  { id: '16', name: 'Samsung Odyssey G9 49" Monitor', category: 'Monitors', brand: 'Samsung', price: 380000, stock: 3, serialNumber: '70466789', barcode: '4938271650138', createdAt: '2026-01-24T13:20:00' },
  { id: '17', name: 'Logitech G Pro X Superlight 2', category: 'Peripherals', brand: 'Logitech', price: 52000, stock: 35, serialNumber: '70467890', barcode: '4938271650139', createdAt: '2026-01-25T14:00:00' },
  { id: '18', name: 'Razer Huntsman V3 Pro', category: 'Peripherals', brand: 'Razer', price: 68000, stock: 20, serialNumber: '70468901', barcode: '4938271650140', createdAt: '2026-01-27T15:00:00' },
  { id: '19', name: 'SteelSeries Arctis Nova Pro', category: 'Peripherals', brand: 'SteelSeries', price: 95000, stock: 15, serialNumber: '70469012', barcode: '4938271650141', createdAt: '2026-01-28T16:30:00' },
  { id: '20', name: 'Seagate Exos 18TB HDD', category: 'Storage', brand: 'Seagate', price: 125000, stock: 8, serialNumber: '70470123', barcode: '4938271650142', createdAt: '2026-01-31T17:15:00' },
];

// Export the helper function for use in other files
export { generateSerialNumber };

// Customers
export const mockCustomers: Customer[] = [
  { id: '1', name: 'Kasun Perera', email: 'kasun@gmail.com', phone: '077-1234567', totalSpent: 580000, totalOrders: 5, lastPurchase: '2024-01-15' },
  { id: '2', name: 'Nimali Fernando', email: 'nimali@email.com', phone: '076-2345678', totalSpent: 320000, totalOrders: 3, lastPurchase: '2024-01-10' },
  { id: '3', name: 'Tech Solutions Ltd', email: 'info@techsol.lk', phone: '011-2567890', totalSpent: 2500000, totalOrders: 18, lastPurchase: '2024-01-18' },
  { id: '4', name: 'Dilshan Silva', email: 'dilshan.s@hotmail.com', phone: '078-3456789', totalSpent: 185000, totalOrders: 2, lastPurchase: '2024-01-05' },
  { id: '5', name: 'GameZone Café', email: 'contact@gamezone.lk', phone: '011-3456789', totalSpent: 3200000, totalOrders: 25, lastPurchase: '2024-01-20' },
  { id: '6', name: 'Priya Jayawardena', email: 'priya.j@yahoo.com', phone: '071-4567890', totalSpent: 95000, totalOrders: 1, lastPurchase: '2024-01-12' },
  { id: '7', name: 'Creative Studios', email: 'studio@creative.lk', phone: '011-4567891', totalSpent: 1850000, totalOrders: 12, lastPurchase: '2024-01-16' },
  { id: '8', name: 'Sanjay Mendis', email: 'sanjay.m@gmail.com', phone: '077-5678901', totalSpent: 420000, totalOrders: 4, lastPurchase: '2024-01-08' },
];

// Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-0001',
    customerId: '1',
    customerName: 'Kasun Perera',
    items: [
      { productId: '1', productName: 'AMD Ryzen 9 7950X', quantity: 1, unitPrice: 185000, total: 185000 },
      { productId: '8', productName: 'Corsair Vengeance DDR5 32GB', quantity: 2, unitPrice: 48000, total: 96000 },
    ],
    subtotal: 281000,
    tax: 42150,
    total: 323150,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-30',
  },
  {
    id: 'INV-2024-0002',
    customerId: '3',
    customerName: 'Tech Solutions Ltd',
    items: [
      { productId: '3', productName: 'NVIDIA GeForce RTX 4090', quantity: 2, unitPrice: 620000, total: 1240000 },
      { productId: '10', productName: 'ASUS ROG Maximus Z790 Hero', quantity: 2, unitPrice: 185000, total: 370000 },
      { productId: '12', productName: 'Corsair RM1000x 1000W PSU', quantity: 2, unitPrice: 55000, total: 110000 },
    ],
    subtotal: 1720000,
    tax: 258000,
    total: 1978000,
    status: 'paid',
    date: '2024-01-18',
    dueDate: '2024-02-02',
  },
  {
    id: 'INV-2024-0003',
    customerId: '5',
    customerName: 'GameZone Café',
    items: [
      { productId: '4', productName: 'NVIDIA GeForce RTX 4070 Ti', quantity: 5, unitPrice: 280000, total: 1400000 },
      { productId: '15', productName: 'LG UltraGear 27GP950-B 4K Monitor', quantity: 5, unitPrice: 195000, total: 975000 },
    ],
    subtotal: 2375000,
    tax: 356250,
    total: 2731250,
    status: 'pending',
    date: '2024-01-20',
    dueDate: '2024-02-04',
  },
  {
    id: 'INV-2024-0004',
    customerId: '2',
    customerName: 'Nimali Fernando',
    items: [
      { productId: '17', productName: 'Logitech G Pro X Superlight 2', quantity: 1, unitPrice: 52000, total: 52000 },
      { productId: '18', productName: 'Razer Huntsman V3 Pro', quantity: 1, unitPrice: 68000, total: 68000 },
    ],
    subtotal: 120000,
    tax: 18000,
    total: 138000,
    status: 'paid',
    date: '2024-01-10',
    dueDate: '2024-01-25',
  },
  {
    id: 'INV-2024-0005',
    customerId: '7',
    customerName: 'Creative Studios',
    items: [
      { productId: '16', productName: 'Samsung Odyssey G9 49" Monitor', quantity: 2, unitPrice: 380000, total: 760000 },
      { productId: '2', productName: 'Intel Core i9-14900K', quantity: 2, unitPrice: 195000, total: 390000 },
    ],
    subtotal: 1150000,
    tax: 172500,
    total: 1322500,
    status: 'overdue',
    date: '2024-01-02',
    dueDate: '2024-01-17',
  },
  {
    id: 'INV-2024-0006',
    customerId: '4',
    customerName: 'Dilshan Silva',
    items: [
      { productId: '6', productName: 'Samsung 990 Pro 2TB NVMe SSD', quantity: 1, unitPrice: 75000, total: 75000 },
      { productId: '13', productName: 'NZXT Kraken X73 RGB', quantity: 1, unitPrice: 75000, total: 75000 },
    ],
    subtotal: 150000,
    tax: 22500,
    total: 172500,
    status: 'paid',
    date: '2024-01-05',
    dueDate: '2024-01-20',
  },
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
