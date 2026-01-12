
import { collection, getDocs, writeBatch, Firestore, doc, Timestamp, getDoc } from 'firebase/firestore';
import { mockTrainUpdates, mockMetroUpdates, mockBusUpdates, mockDirectoryListings, mockForumPosts, mockForumReplies, mockEvents, mockNotices, mockSchemes, mockAlerts } from './mock-data';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Auth } from 'firebase/auth';

async function isCollectionEmpty(db: Firestore, collectionName: string): Promise<boolean> {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.empty;
}

export async function seedFirestore(db: Firestore, auth: Auth) {
  if (!auth.currentUser) {
    console.log("User not authenticated, skipping seed.");
    return;
  }
  const userId = auth.currentUser.uid;
  console.log("Checking if seeding is necessary...");

  const collectionsToSeed: { [key: string]: { data: any[], transform?: (item: any, userId?: string) => any } } = {
    trainUpdates: { data: mockTrainUpdates },
    metroUpdates: { data: mockMetroUpdates },
    busUpdates: { data: mockBusUpdates },
    localServices: { data: mockDirectoryListings },
    forumThreads: {
      data: mockForumPosts,
      transform: (item, userId) => ({ ...item, userId })
    },
    events: { data: mockEvents, transform: (event: any) => ({ ...event, date: Timestamp.fromDate(event.date) }) },
    publicNotices: { data: mockNotices },
    governmentSchemes: { data: mockSchemes },
    emergencyAlerts: { data: mockAlerts }
  };

  for (const collectionName in collectionsToSeed) {
    if (await isCollectionEmpty(db, collectionName)) {
      console.log(`Seeding ${collectionName}...`);
      const collectionRef = collection(db, collectionName);
      const { data, transform } = collectionsToSeed[collectionName];
      data.forEach((item) => {
        const finalItem = transform ? transform(item, userId) : item;
        addDocumentNonBlocking(collectionRef, finalItem);
      });
      console.log(`${collectionName} seeded.`);
    } else {
      console.log(`${collectionName} is not empty, skipping seed.`);
    }
  }

  // Handle subcollections like forum replies
  const forumThreadsExist = !(await isCollectionEmpty(db, 'forumThreads'));

  if(forumThreadsExist) {
    // This logic is complex because we need to get the newly created IDs.
    // For a simple seed, we might need a different strategy if IDs are not predictable.
    // Assuming for now that we can re-query to find the posts and then add replies.
    console.log("Checking if forum replies need seeding...");
    const forumThreadsSnapshot = await getDocs(collection(db, 'forumThreads'));

    for(const threadDoc of forumThreadsSnapshot.docs) {
        const postData = threadDoc.data() as { originalId?: string };
        const repliesCollectionRef = collection(db, `forumThreads/${threadDoc.id}/forumPosts`);
        const repliesSnapshot = await getDocs(repliesCollectionRef);

        if (repliesSnapshot.empty && postData.originalId && mockForumReplies[postData.originalId]) {
            console.log(`Seeding replies for post ${threadDoc.id}`);
            const repliesToSeed = mockForumReplies[postData.originalId];
            repliesToSeed.forEach(reply => {
                const replyWithTimestamp = { ...reply, userId: userId, timestamp: Timestamp.now() };
                addDocumentNonBlocking(repliesCollectionRef, replyWithTimestamp);
            });
        }
    }
  }

  // Seed user profile if it doesn't exist
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    console.log(`Seeding user profile for ${userId}`);
    setDocumentNonBlocking(userDocRef, {
      email: 'user@mumbailifelink.com',
      neighborhood: 'Mumbai',
      username: 'Mumbaikar'
    }, { merge: true });
  } else {
     console.log(`User profile for ${userId} already exists.`);
  }
}
