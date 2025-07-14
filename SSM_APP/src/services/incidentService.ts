import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Incident } from '../types';
import { COLLECTIONS, STORAGE_PATHS } from '../config/constants';

// Raportare incident nou
export const reportIncident = async (
  incident: Omit<Incident, 'id' | 'reportedAt' | 'updatedAt' | 'status'>,
  photos: string[] = []
): Promise<string> => {
  try {
    // Adăugare incident în Firestore
    const incidentData = {
      ...incident,
      status: 'reported',
      reportedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.INCIDENTS), incidentData);
    
    // Upload fotografii (dacă există)
    if (photos.length > 0) {
      const photoURLs = await Promise.all(
        photos.map(async (photo, index) => {
          const storageRef = ref(
            storage, 
            `${STORAGE_PATHS.INCIDENT_PHOTOS}/${docRef.id}/${index}.jpg`
          );
          
          // Convertire Base64 la Blob
          const response = await fetch(photo);
          const blob = await response.blob();
          
          // Upload
          await uploadBytes(storageRef, blob);
          
          // Obținere URL
          return getDownloadURL(storageRef);
        })
      );
      
      // Actualizare incident cu URL-urile fotografiilor
      await updateDoc(docRef, {
        photos: photoURLs,
        updatedAt: serverTimestamp(),
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error reporting incident:', error);
    throw error;
  }
};

// Obținere incident după ID
export const getIncidentById = async (incidentId: string): Promise<Incident | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.INCIDENTS, incidentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Incident;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting incident:', error);
    throw error;
  }
};

// Obținere incidente după utilizator
export const getIncidentsByUser = async (userId: string): Promise<Incident[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INCIDENTS),
      where('userId', '==', userId),
      orderBy('reportedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const incidents: Incident[] = [];
    
    querySnapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data(),
      } as Incident);
    });
    
    return incidents;
  } catch (error) {
    console.error('Error getting incidents by user:', error);
    throw error;
  }
};

// Obținere incidente după proiect
export const getIncidentsByProject = async (projectId: string): Promise<Incident[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INCIDENTS),
      where('projectId', '==', projectId),
      orderBy('reportedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const incidents: Incident[] = [];
    
    querySnapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data(),
      } as Incident);
    });
    
    return incidents;
  } catch (error) {
    console.error('Error getting incidents by project:', error);
    throw error;
  }
};

// Actualizare status incident
export const updateIncidentStatus = async (
  incidentId: string,
  status: 'reported' | 'investigating' | 'resolved' | 'closed',
  actionsTaken?: string,
  preventiveMeasures?: string
): Promise<void> => {
  try {
    const updateData: Record<string, any> = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (actionsTaken) {
      updateData.actionsTaken = actionsTaken;
    }
    
    if (preventiveMeasures) {
      updateData.preventiveMeasures = preventiveMeasures;
    }
    
    if (status === 'resolved') {
      updateData.resolvedAt = serverTimestamp();
    }
    
    await updateDoc(doc(db, COLLECTIONS.INCIDENTS, incidentId), updateData);
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

// Atribuire incident unui utilizator
export const assignIncidentToUser = async (
  incidentId: string,
  userId: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.INCIDENTS, incidentId), {
      assignedTo: userId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error assigning incident:', error);
    throw error;
  }
};

// Obținere incidente recente (pentru dashboard)
export const getRecentIncidents = async (count: number = 10): Promise<Incident[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INCIDENTS),
      orderBy('reportedAt', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const incidents: Incident[] = [];
    
    querySnapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data(),
      } as Incident);
    });
    
    return incidents;
  } catch (error) {
    console.error('Error getting recent incidents:', error);
    throw error;
  }
}; 