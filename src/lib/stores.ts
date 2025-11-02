export type Store = {
  id: number
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  lat: number
  lon: number
  hours: {
    weekday: string
    saturday: string
    sunday: string
  }
  services: string[]
}

export const STORES: Store[] = [
  {
    id: 1,
    name: 'MG Road Branch',
    address: '123 MG Road, Central',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 80 1234 5678',
    email: 'mgroad@washland.com',
    lat: 12.9715987,
    lon: 77.5945627,
    hours: {
      weekday: '7:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM'
    },
    services: ['Dry Cleaning', 'Laundry', 'Alterations', 'Shoe Cleaning']
  },
  {
    id: 2,
    name: 'Uptown Location',
    address: '456 Oak Avenue, Uptown',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 22 2345 6789',
    email: 'uptown@washland.com',
    lat: 19.076090,
    lon: 72.877426,
    hours: {
      weekday: '6:30 AM - 9:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '9:00 AM - 6:00 PM'
    },
    services: ['Dry Cleaning', 'Laundry', 'Alterations', 'Wedding Dress Care']
  },
  {
    id: 3,
    name: 'Westside Store',
    address: '789 Pine Road, Westside',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    phone: '+91 44 3456 7890',
    email: 'westside@washland.com',
    lat: 13.082680,
    lon: 80.270718,
    hours: {
      weekday: '7:00 AM - 7:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    services: ['Dry Cleaning', 'Laundry', 'Comforter Cleaning']
  },
  {
    id: 4,
    name: 'Hitech City Store',
    address: 'Plot 12, Hitech City Road, Near Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    phone: '+91 40 1234 5678',
    email: 'hitech@washland.com',
    lat: 17.4474,
    lon: 78.3910,
    hours: {
      weekday: '7:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM'
    },
    services: ['Dry Cleaning', 'Laundry', 'Alterations', 'Comforter Cleaning']
  }
]

