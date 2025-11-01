import { IEvent, Event } from '../database';
import mongoose from 'mongoose'; // <-- CRITICAL: Import Mongoose here
import dbConnect from './mongodb';

export const eventsSeedData: Partial<IEvent>[] = [
  {
    title: "ReactDev Hackathon 2026",
    description: "Join the largest React hackathon where developers worldwide compete to build innovative applications in 48 hours. With $50,000 in prizes, mentorship from React core team members, and opportunities to showcase your projects to leading tech companies.",
    overview: "48-hour hackathon focusing on building next-generation React applications with emphasis on performance and user experience.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    venue: "TechSpace Hub",
    location: "Austin, TX",
    date: "2026-02-15",
    time: "09:00",
    mode: "hybrid",
    audience: "React Developers, Frontend Engineers, Full-stack Developers",
    agenda: [
      "Team Formation & Project Ideation",
      "Kickoff & Technical Workshop",
      "48-Hour Coding Sprint",
      "Project Submissions",
      "Demo Day & Judging",
      "Awards Ceremony"
    ],
    organizer: "ReactDev Community",
    tags: ["Hackathon", "React", "JavaScript", "Frontend", "DevConnect"]
  },
  {
    title: "Cloud Native DevOps Summit",
    description: "Master modern DevOps practices through hands-on workshops covering containerization, CI/CD pipelines, infrastructure as code, and cloud-native technologies. Learn from industry experts and implement best practices in real-time.",
    overview: "Intensive three-day workshop series focused on practical DevOps implementation and cloud infrastructure management.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    venue: "Cloud Innovation Center",
    location: "Seattle, WA",
    date: "2026-03-20",
    time: "08:30",
    mode: "offline",
    audience: "DevOps Engineers, System Administrators, Platform Engineers",
    agenda: [
      "Docker & Kubernetes Deep Dive",
      "Building Robust CI/CD Pipelines",
      "Infrastructure as Code with Terraform",
      "Monitoring & Observability",
      "Security in DevOps",
      "Hands-on Labs"
    ],
    organizer: "DevOps Alliance",
    tags: ["DevOps", "Cloud", "Kubernetes", "Docker", "DevConnect"]
  },
  {
    title: "Web3 Builders Conference",
    description: "Explore the future of web development with Web3 technologies. Deep dive into blockchain development, smart contracts, DeFi protocols, and decentralized applications. Network with leading Web3 developers and founders.",
    overview: "Premier conference for Web3 developers featuring cutting-edge blockchain development topics and emerging standards.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    venue: "Blockchain Center",
    location: "Miami, FL",
    date: "2026-04-10",
    time: "10:00",
    mode: "hybrid",
    audience: "Blockchain Developers, Smart Contract Engineers, Web3 Enthusiasts",
    agenda: [
      "State of Web3 Development",
      "Smart Contract Security",
      "DeFi Protocol Development",
      "NFT Platform Building",
      "Scaling Solutions Workshop",
      "Web3 Security Best Practices"
    ],
    organizer: "Web3 Builders Alliance",
    tags: ["Web3", "Blockchain", "Smart Contracts", "DeFi", "DevConnect"]
  },
  {
    title: "AI & ML Developer Conference",
    description: "Join leading AI researchers and ML engineers for an intensive conference on practical machine learning development. From neural networks to deployment strategies, gain hands-on experience with the latest AI tools and frameworks.",
    overview: "Deep technical conference focused on practical AI/ML development and deployment strategies.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    venue: "Innovation Campus",
    location: "Boston, MA",
    date: "2026-05-12",
    time: "09:00",
    mode: "hybrid",
    audience: "ML Engineers, Data Scientists, AI Researchers, Software Engineers",
    agenda: [
      "Deep Learning Architecture Design",
      "MLOps Best Practices",
      "Large Language Models Workshop",
      "AI Model Optimization",
      "Responsible AI Development",
      "Model Deployment Strategies"
    ],
    organizer: "AI Developers Association",
    tags: ["AI", "Machine Learning", "Deep Learning", "MLOps", "DevConnect"]
  },
  {
    title: "Backend Engineering Summit",
    description: "Comprehensive conference covering modern backend development practices, from microservices architecture to scalable database solutions. Learn about performance optimization, security, and maintaining high-availability systems.",
    overview: "In-depth technical conference for backend developers focusing on scalability, performance, and modern architectures.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    venue: "Tech Convention Center",
    location: "Portland, OR",
    date: "2026-06-18",
    time: "08:30",
    mode: "offline",
    audience: "Backend Developers, System Architects, Database Engineers",
    agenda: [
      "Microservices Architecture Patterns",
      "Database Scaling Strategies",
      "API Design Best Practices",
      "Performance Optimization",
      "Security Implementation",
      "High Availability Systems"
    ],
    organizer: "Backend Dev Community",
    tags: ["Backend", "Microservices", "Databases", "System Design", "DevConnect"]
  },
  {
    title: "Mobile Dev Experience",
    description: "The ultimate mobile development conference covering iOS, Android, and cross-platform development. Focus on performance, user experience, and the latest mobile technologies with hands-on workshops and coding sessions.",
    overview: "Comprehensive mobile development conference bringing together iOS, Android, and cross-platform developers.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    venue: "Mobile Tech Center",
    location: "San Diego, CA",
    date: "2026-07-22",
    time: "09:30",
    mode: "hybrid",
    audience: "Mobile Developers, UX Engineers, App Architects",
    agenda: [
      "Native vs Cross-platform Development",
      "Mobile Performance Optimization",
      "App Security Workshop",
      "UI/UX Best Practices",
      "State Management Patterns",
      "App Store Optimization"
    ],
    organizer: "Mobile Developers Guild",
    tags: ["Mobile", "iOS", "Android", "Cross-platform", "DevConnect"]
  }
];

// Export seed function
export const seedEvents = async () => {
	console.log('--- Starting Database Seeding ---');

	try {
		// 1. CONNECT
		await dbConnect();
		console.log('Connected to MongoDB.');

		// 2. CLEAR (Optional but recommended for repeatable seeds)
		await Event.deleteMany({});
		console.log('Cleared existing data.');

		// 3. INSERT
		// await Event.insertMany(eventsSeedData);
		// Create an array of promises, one for each document.save() call
		const insertionPromises = eventsSeedData.map(data => {
			// 1. Create a new document instance
			const eventDoc = new Event(data);

			// 2. Return the save() promise, which triggers the pre('save') middleware
			return eventDoc.save();
		});

		// Execute all save promises concurrently
		const insertedRecords = await Promise.all(insertionPromises);

		console.log(
			`Successfully inserted ${insertedRecords.length} records, with slugs generated.`
		);
	} catch (error) {
		console.error('Seeding failed:', error);
		process.exit(1); // Exit with error code
	} finally {
		// 4. DISCONNECT
		// Note: When running a standalone script, manually close the connection
		await mongoose.connection.close();
		console.log('Connection closed.');
		console.log('--- Database Seeding Complete ---');
		process.exit(0);
	}
};

seedEvents();

/* 
Add a seed script to your package.json to simplify execution:

"scripts": {
  ...
  "seed": "node scripts/seed.js" 
  // If using TypeScript: "seed": "ts-node scripts/seed.ts"
}
B. Execute the Script
Make sure your environment variables (especially MONGODB_URI) are loaded and accessible, then run the script from your terminal:

npm run seed

*/
