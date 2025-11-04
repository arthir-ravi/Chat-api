import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FirebaseAdminService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccountPath = resolve(process.env.FIREBASE_SERVICE_ACCOUNT!);
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    this.messaging = admin.messaging();
  }

  async sendNotification(token: string, title: string, body: string) {
    try {
      await this.messaging.send({
        token,
        notification: { title, body },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              contentAvailable: true,
            },
          },
        },
      });
      console.log('Push notification sent');
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}