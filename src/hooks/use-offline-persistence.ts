import { useEffect } from 'react';
import { openDB } from 'idb';
import { useApplicationStore } from '@/lib/store/use-application-store';
import { getStoredUser } from '@/lib/api';

const DB_NAME = 'unima_support_db';
const STORE_NAME = 'application_draft';

function getDraftKey(): string {
  const user = getStoredUser();
  return user?.id ? `draft_${user.id}` : 'draft_anonymous';
}

export function useOfflinePersistence() {
  const { data, updatePersonal, updateFamily, updateEducation, updateAcademics, updatePayment } = useApplicationStore();

  useEffect(() => {
    const initDB = async () => {
      try {
        const draftKey = getDraftKey();
        const db = await openDB(DB_NAME, 2, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          },
        });
        const saved = await db.get(STORE_NAME, draftKey);
        if (saved) {
          if (saved.personal) updatePersonal(saved.personal);
          if (saved.family) updateFamily(saved.family);
          if (saved.education) {
            updateEducation('primary', saved.education.primary);
            updateEducation('secondary', saved.education.secondary);
            updateEducation('tertiary', saved.education.tertiary);
          }
          if (saved.academics) updateAcademics(saved.academics);
          if (saved.payment) updatePayment(saved.payment);
          if (saved.reviewVisited) {
            useApplicationStore.getState().setReviewVisited(true);
          }
          if (saved.declarationAccepted) {
            useApplicationStore.getState().setDeclarationAccepted(true);
          }
          if (saved.currentStep) {
            useApplicationStore.getState().setStep(saved.currentStep);
          }
        }
      } catch {
        // IndexedDB unavailable (private browsing, storage quota, etc.) — silently skip
      }
    };
    initDB().catch(() => { /* IndexedDB unavailable — silently skip */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncDB = async () => {
      try {
        const draftKey = getDraftKey();
        const db = await openDB(DB_NAME, 2);
        // Don't persist File objects — strip them before saving
        const serializable = {
          personal: { ...data.personal, studentIdFile: null, nationalIdFile: null },
          family: { ...data.family, deathCertificateFile: null, guarantorNationalIdFile: null, guarantorConsentFile: null },
          education: data.education,
          academics: { ...data.academics, transcriptFile: null },
          payment: data.payment,
          currentStep: data.currentStep,
          reviewVisited: data.reviewVisited,
          declarationAccepted: data.declarationAccepted,
        };
        await db.put(STORE_NAME, serializable, draftKey);
      } catch {
        // Sync failure is non-fatal — draft is still in memory
      }
    };
    if (data.lastSaved) syncDB().catch(() => { /* Sync failure is non-fatal */ });
  }, [data]);
}

export async function clearOfflinePersistence(): Promise<void> {
  try {
    const draftKey = getDraftKey();
    const db = await openDB(DB_NAME, 2);
    await db.delete(STORE_NAME, draftKey);
  } catch {
    // Nothing to clear or IndexedDB unavailable
  }
}
