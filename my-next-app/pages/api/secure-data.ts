// pages/api/secure-data.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { adminAuth } from '@/lib/firebase-admin';
// import { prisma } from '@/lib/prisma'; // This is your PostgreSQL client

import { adminAuth } from '../../lib/firebase-admin';
import { prisma } from '../../lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await adminAuth.verifyIdToken(token); // ✅ validate Firebase ID token
    const firebaseUid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseId: firebaseUid },
    });

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
