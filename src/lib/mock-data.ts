import { TransitUpdate, DirectoryListing, ForumPost, ForumReply, LocalEvent, SafetyAlert, Amenity } from './types';

export const mockTrainUpdates: Omit<TransitUpdate, 'id'>[] = [
  { line: 'Western Line (C.G-V.T)', status: 'On Time', eta: '5 min', currentStation: 'Dadar' },
  { line: 'Central Line (K-CST)', status: 'Delayed', eta: '15 min', currentStation: 'Kurla' },
  { line: 'Harbour Line (P-CST)', status: 'Crowded', eta: '8 min', currentStation: 'Wadala Road' },
  { line: 'Trans-Harbour (T-V)', status: 'On Time', eta: '12 min', currentStation: 'Thane' },
  { line: 'Western Line (V.T-C.G)', status: 'On Time', eta: '3 min', currentStation: 'Mumbai Central' },
  { line: 'Central Line (CST-K)', status: 'On Time', eta: '9 min', currentStation: 'Ghatkopar' },
];

export const mockMetroUpdates: Omit<TransitUpdate, 'id'>[] = [
  { line: 'Line 1 (V-G)', status: 'On Time', eta: '4 min', currentStation: 'Andheri' },
  { line: 'Line 2A (D.N-D)', status: 'On Time', eta: '7 min', currentStation: 'Dahisar' },
  { line: 'Line 7 (D.E-A.E)', status: 'Crowded', eta: '6 min', currentStation: 'Gundavali' },
  { line: 'Line 1 (G-V)', status: 'Delayed', eta: '12 min', currentStation: 'Sakinaka' },
];

export const mockBusUpdates: Omit<TransitUpdate, 'id'>[] = [
  { line: 'A-115', status: 'Crowded', eta: '10 min', currentStation: 'CSMT' },
  { line: 'C-42', status: 'Delayed', eta: '20 min', currentStation: 'Chembur' },
  { line: '27', status: 'On Time', eta: '5 min', currentStation: 'Worli Depot' },
  { line: '33', status: 'On Time', eta: '8 min', currentStation: 'Backbay Depot' },
];

export const mockDirectoryListings: Omit<DirectoryListing, 'id'>[] = [
  { name: 'Aqua Plumbers', category: 'Plumbers', rating: 4.5, reviews: 120, contact: '9876543210', description: '24/7 plumbing services for all your needs.', image: 'plumber-1' },
  { name: 'Flow-Right Services', category: 'Plumbers', rating: 4.8, reviews: 95, contact: '9876543211', description: 'Expert solutions for leaks and blocks.', image: 'plumber-2' },
  { name: 'Pipe Masters', category: 'Plumbers', rating: 4.3, reviews: 80, contact: '9876543220', description: 'Affordable and reliable plumbing.', image: 'plumber-1' },
  { name: 'Drain Doctors', category: 'Plumbers', rating: 4.6, reviews: 110, contact: '9876543221', description: 'Specialists in drain cleaning and repair.', image: 'plumber-2' },
  { name: 'Spark Electricals', category: 'Electricians', rating: 4.7, reviews: 250, contact: '9876543212', description: 'Certified electricians for homes and offices.', image: 'electrician-1' },
  { name: 'Watt-A-Choice', category: 'Electricians', rating: 4.6, reviews: 180, contact: '9876543213', description: 'Safe and reliable electrical work.', image: 'electrician-2' },
  { name: 'Live Wire Experts', category: 'Electricians', rating: 4.8, reviews: 300, contact: '9876543222', description: 'Emergency electrical services.', image: 'electrician-1' },
  { name: 'FuseBoxx', category: 'Electricians', rating: 4.5, reviews: 150, contact: '9876543223', description: 'All kinds of wiring and fixture installations.', image: 'electrician-2' },
  { name: 'Dr. Anjali Mehta', category: 'Doctors', rating: 4.9, reviews: 400, contact: '9876543214', description: 'General Physician with 15 years of experience.', image: 'doctor-1' },
  { name: 'City Care Clinic', category: 'Doctors', rating: 4.8, reviews: 320, contact: '9876543215', description: 'Multi-speciality clinic in the heart of the city.', image: 'doctor-2' },
  { name: 'Dr. Rahul Verma', category: 'Doctors', rating: 4.7, reviews: 280, contact: '9876543224', description: 'Pediatrician and child specialist.', image: 'doctor-1' },
  { name: 'Wellness First Polyclinic', category: 'Doctors', rating: 4.8, reviews: 350, contact: '9876543225', description: 'Comprehensive healthcare services.', image: 'doctor-2' },
  { name: 'Ghar Ka Khana', category: 'Tiffin', rating: 4.6, reviews: 500, contact: '9876543216', description: 'Homely and healthy meals delivered to your doorstep.', image: 'tiffin-1' },
  { name: 'Mumbai Dabbawala', category: 'Tiffin', rating: 4.9, reviews: 1200, contact: '9876543217', description: 'The legendary tiffin service of Mumbai.', image: 'tiffin-2' },
  { name: 'Healthy Bites', category: 'Tiffin', rating: 4.5, reviews: 450, contact: '9876543226', description: 'Calorie-counted meals for the health-conscious.', image: 'tiffin-1' },
  { name: 'Tummy Full Tiffins', category: 'Tiffin', rating: 4.7, reviews: 600, contact: '9876543227', description: 'Authentic regional cuisines.', image: 'tiffin-2' },
  { name: 'QuickFix Repairs', category: 'Repair Shops', rating: 4.4, reviews: 88, contact: '9876543218', description: 'Mobile and electronics repair.', image: 'plumber-1' },
  { name: 'Appliance Care', category: 'Repair Shops', rating: 4.6, reviews: 150, contact: '9876543219', description: 'Home appliance repair services.', image: 'plumber-2' },
  { name: 'Gadget Gurus', category: 'Repair Shops', rating: 4.7, reviews: 200, contact: '9876543228', description: 'Expert repair for laptops and smartphones.', image: 'plumber-1' },
  { name: 'Restore It', category: 'Repair Shops', rating: 4.5, reviews: 130, contact: '9876543229', description: 'Furniture and upholstery repair.', image: 'plumber-2' },
];

export const mockForumPosts: Omit<ForumPost, 'id' | 'timestamp'>[] = [
  { originalId: '1', title: 'Best Vada Pav in Bandra?', author: 'FoodieG', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', replies: 2, content: 'Looking for recommendations for the best vada pav stalls in Bandra West. I\'ve tried a few but want to know the local favorites!', upvotes: 25, downvotes: 1 },
  { originalId: '2', title: 'Weekend cycling group', author: 'CycleFan', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', replies: 1, content: 'Anyone interested in forming a weekend cycling group? We could explore routes around Sanjay Gandhi National Park. Beginners welcome!', upvotes: 15, downvotes: 0 },
  { originalId: '3', title: 'Power cut in Andheri East', author: 'CitizenX', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', replies: 0, content: 'Is anyone else experiencing a power cut in the Mahakali Caves area? It\'s been over an hour now.', upvotes: 5, downvotes: 3 },
  { originalId: '4', title: 'Need help with a stray dog', author: 'AnimalLover', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', replies: 0, content: 'There is a very friendly stray dog in my society, looks injured. Can anyone from an NGO help?', upvotes: 50, downvotes: 0 },
];

export const mockForumReplies: { [key: string]: Omit<ForumReply, 'id' | 'timestamp'>[] } = {
  '1': [
    { author: 'BandraLocal', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', content: 'You have to try Ashok Vada Pav near Kirti College. It\'s iconic!', upvotes: 10, downvotes: 0 },
    { author: 'StreetEats', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', content: 'Seconding Ashok! Also, the one outside Bandra station is pretty good for a quick bite.', upvotes: 8, downvotes: 1 },
  ],
  '2': [
    { author: 'TrailBlazer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', content: 'I am in! What time are you guys planning to meet?', upvotes: 5, downvotes: 0 },
  ],
  '3': [],
  '4': [],
};


export const mockEvents: Omit<LocalEvent, 'id'>[] = [
  { title: 'Live Music Night at The Finch', date: new Date(new Date().setDate(new Date().getDate() + 3)), location: 'Andheri', category: 'Music', description: 'An evening of soulful Sufi music.', image: 'event-music' },
  { title: 'Street Food Festival', date: new Date(new Date().setDate(new Date().getDate() + 5)), location: 'Bandra', category: 'Food', description: 'Explore the diverse street food of Mumbai all in one place.', image: 'event-food' },
  { title: 'Kala Ghoda Art Fair', date: new Date(new Date().setDate(new Date().getDate() + 7)), location: 'Fort', category: 'Art', description: 'Annual art festival showcasing various artists.', image: 'event-art' },
  { title: 'Marine Drive Cleanup', date: new Date(new Date().setDate(new Date().getDate() + 10)), location: 'Marine Drive', category: 'Community', description: 'Join us for a community-driven cleanup of our beloved promenade.', image: 'map-mumbai' },
  { title: 'Yoga in the Park', date: new Date(new Date().setDate(new Date().getDate() + 4)), location: 'Juhu', category: 'Community', description: 'Morning yoga session at Juhu Beach.', image: 'event-food' },
];

export const mockNotices: { id: string; title: string; date: string; content: string }[] = [
    { id: 'n1', title: 'Water supply disruption in Zone 4', date: '2024-08-15', content: 'Planned maintenance will cause water supply disruption...'},
    { id: 'n2', title: 'Property Tax Deadline Extension', date: '2024-08-12', content: 'The deadline for property tax payment has been extended...'},
    { id: 'n3', title: 'New Metro Line 5 trial runs', date: '2024-08-10', content: 'Trial runs for the new Metro Line 5 will commence...'},
    { id: 'n4', title: 'Road closure for festival', date: '2024-08-20', content: 'MG Road will be closed for the upcoming festival procession.'},
];

export const mockSchemes: { id: string; title: string; description: string }[] = [
    { id: 's1', title: 'Senior Citizen Health Scheme', description: 'Provides health benefits and discounts for senior citizens.' },
    { id: 's2', title: 'Student Education Loan Program', description: 'Subsidized education loans for higher studies.' },
    { id: 's3', title: 'Small Business Support Fund', description: 'Financial aid and resources for new small businesses.' },
    { id: 's4', title: 'Affordable Housing Initiative', description: 'Schemes for first-time home buyers in the city.' },
];

export const mockAlerts: Omit<SafetyAlert, 'id'>[] = [
  { title: 'Water Logging', severity: 'High', location: 'Hindmata, Dadar', time: '45 mins ago', description: 'Heavy water logging reported at Hindmata junction. Avoid the area.' },
  { title: 'Train Delay', severity: 'Medium', location: 'Central Line', time: '15 mins ago', description: 'Signal failure near Kurla causing delays of up to 20 minutes.' },
  { title: 'Roadwork Advisory', severity: 'Low', location: 'Western Express Highway', time: '2 hours ago', description: 'Planned roadwork near the airport flyover. Expect minor traffic congestion.' },
  { title: 'Gas Leak Reported', severity: 'High', location: 'Chembur', time: '5 mins ago', description: 'Gas leak reported from a pipeline. Emergency services at the scene.' },
];

export const mockAmenities: Amenity[] = [
    { id: 1, name: 'Gateway of India', type: 'Interest', position: { top: '85%', left: '70%' } },
    { id: 2, name: 'City Hospital', type: 'Amenity', position: { top: '40%', left: '50%' } },
    { id: 3, name: 'Local Market', type: 'Business', position: { top: '60%', left: '30%' } },
    { id: 4, name: 'Central Park', type: 'Amenity', position: { top: '25%', left: '65%' } },
    { id: 5, name: 'BKC Business Hub', type: 'Business', position: { top: '55%', left: '80%' } },
    { id: 6, name: 'Museum', type: 'Interest', position: { top: '75%', left: '55%' } },
    { id: 7, name: 'Public Library', type: 'Amenity', position: { top: '35%', left: '20%' } },
];
