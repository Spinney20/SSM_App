import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Incident, ApiResponse } from '../types';

const db = firebase.firestore();
const incidentsCollection = db.collection('incidents');
const storage = firebase.storage();

/**
 * Obține toate incidentele din baza de date
 */
export const getIncidents = async (): Promise<Incident[]> => {
  try {
    const snapshot = await incidentsCollection.orderBy('date', 'desc').get();
    return snapshot.docs.map((doc: firebase.firestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Incident));
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

/**
 * Obține un incident specific după ID
 */
export const getIncidentById = async (id: string): Promise<Incident> => {
  try {
    const doc = await incidentsCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Incident not found');
    }
    return { id: doc.id, ...doc.data() } as Incident;
  } catch (error) {
    console.error(`Error fetching incident with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Adaugă un nou incident în baza de date
 */
export const addIncident = async (incident: Omit<Incident, 'id'>): Promise<string> => {
  try {
    const docRef = await incidentsCollection.add({
      ...incident,
      date: incident.date || new Date().toISOString(),
      status: incident.status || 'open',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding incident:', error);
    throw error;
  }
};

/**
 * Actualizează un incident existent
 */
export const updateIncident = async (id: string, data: Partial<Incident>): Promise<void> => {
  try {
    await incidentsCollection.doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating incident with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualizează statusul unui incident
 */
export const updateIncidentStatus = async (id: string, status: string): Promise<void> => {
  try {
    await incidentsCollection.doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating status for incident with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Șterge un incident
 */
export const deleteIncident = async (id: string): Promise<void> => {
  try {
    await incidentsCollection.doc(id).delete();
  } catch (error) {
    console.error(`Error deleting incident with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Încarcă o imagine pentru un incident
 */
export const uploadIncidentImage = async (uri: string, incidentId: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `incidents/${incidentId}/${Date.now()}`;
    const storageRef = storage.ref().child(filename);
    
    await storageRef.put(blob);
    const downloadUrl = await storageRef.getDownloadURL();
    
    // Actualizează incidentul cu URL-ul imaginii
    await incidentsCollection.doc(incidentId).update({
      imageUrl: downloadUrl,
    });
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading incident image:', error);
    throw error;
  }
};

/**
 * Obține incidentele raportate de un anumit utilizator
 */
export const getUserIncidents = async (userId: string): Promise<Incident[]> => {
  try {
    const snapshot = await incidentsCollection
      .where('reporterId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    
    return snapshot.docs.map((doc: firebase.firestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Incident));
  } catch (error) {
    console.error(`Error fetching incidents for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Adaugă o acțiune la un incident
 */
export const addIncidentAction = async (incidentId: string, action: { description: string, performedBy: string }): Promise<void> => {
  try {
    const actionData = {
      id: Date.now().toString(),
      description: action.description,
      performedBy: action.performedBy,
      date: new Date().toISOString(),
    };
    
    await incidentsCollection.doc(incidentId).update({
      actions: firebase.firestore.FieldValue.arrayUnion(actionData),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error adding action to incident ${incidentId}:`, error);
    throw error;
  }
}; 