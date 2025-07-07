import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../configs/firebaseConfigs';
import type {
  Mission,
  CreateMissionData,
  UpdateMissionData,
  MissionWithProgress,
  MissionProgressSummary,
  MissionProgressStatus,
  UserMissionProgress,
  MissionCompletion,
} from '../models/Mission';

const MISSIONS_COLLECTION = 'missions';
const USER_MISSION_PROGRESS_COLLECTION = 'userMissionProgress';

// Firestore 데이터를 Mission으로 변환
const convertFirestoreMission = (doc: QueryDocumentSnapshot<DocumentData>): Mission => {
  const data = doc.data();
  return {
    id: doc.id,
    week: data.week || 0,
    title: data.title || '',
    description: data.description || '',
    missionUrl: data.missionUrl || '',
    isActive: data.isActive || false,
    startDate: data.startDate?.toDate() || new Date(),
    endDate: data.endDate?.toDate() || new Date(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// UserMissionProgress Firestore 변환
const convertFirestoreUserMissionProgress = (doc: QueryDocumentSnapshot<DocumentData>): UserMissionProgress => {
  const data = doc.data();

  // completedMissions 객체의 각 값을 MissionCompletion으로 변환
  const completedMissions: Record<string, MissionCompletion> = {};
  if (data.completedMissions && typeof data.completedMissions === 'object') {
    Object.entries(data.completedMissions).forEach(([missionId, completion]) => {
      const comp = completion as { completedAt?: { toDate(): Date }; week?: number; missionId?: string };
      completedMissions[missionId] = {
        completedAt: comp.completedAt?.toDate() || new Date(),
        week: comp.week || 0,
        missionId: comp.missionId || missionId,
      };
    });
  }

  return {
    id: doc.id,
    userId: data.userId || '',
    completedMissions,
    totalCompleted: data.totalCompleted || 0,
    lastUpdated: data.lastUpdated?.toDate() || new Date(),
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

// =============================================================================
// 미션 관리 (관리자용)
// =============================================================================

// 미션 생성
export const createMission = async (missionData: CreateMissionData): Promise<string> => {
  try {
    const missionRef = doc(collection(db, MISSIONS_COLLECTION));
    const now = Timestamp.now();

    await setDoc(missionRef, {
      ...missionData,
      startDate: Timestamp.fromDate(missionData.startDate),
      endDate: Timestamp.fromDate(missionData.endDate),
      createdAt: now,
      updatedAt: now,
    });

    return missionRef.id;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw new Error('미션 생성 중 오류가 발생했습니다.');
  }
};

// 모든 미션 조회 (주차 순서대로)
export const getAllMissions = async (): Promise<Mission[]> => {
  try {
    const missionsRef = collection(db, MISSIONS_COLLECTION);
    const q = query(missionsRef, orderBy('week'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreMission);
  } catch (error) {
    console.error('Error getting all missions:', error);
    throw new Error('미션 목록 조회 중 오류가 발생했습니다.');
  }
};

// 활성 미션만 조회
export const getActiveMissions = async (): Promise<Mission[]> => {
  try {
    const missionsRef = collection(db, MISSIONS_COLLECTION);
    const q = query(missionsRef, where('isActive', '==', true), orderBy('week'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreMission);
  } catch (error) {
    console.error('Error getting active missions:', error);
    throw new Error('활성 미션 조회 중 오류가 발생했습니다.');
  }
};

// 특정 미션 조회
export const getMission = async (missionId: string): Promise<Mission | null> => {
  try {
    const missionRef = doc(db, MISSIONS_COLLECTION, missionId);
    const missionSnap = await getDoc(missionRef);

    if (missionSnap.exists()) {
      return convertFirestoreMission(missionSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting mission:', error);
    throw new Error('미션 조회 중 오류가 발생했습니다.');
  }
};

// 특정 주차 미션 조회
export const getMissionByWeek = async (week: number): Promise<Mission | null> => {
  try {
    const missionsRef = collection(db, MISSIONS_COLLECTION);
    const q = query(missionsRef, where('week', '==', week), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return convertFirestoreMission(querySnapshot.docs[0]);
    }
    return null;
  } catch (error) {
    console.error('Error getting mission by week:', error);
    throw new Error('주차별 미션 조회 중 오류가 발생했습니다.');
  }
};

// 미션 업데이트
export const updateMission = async (missionId: string, updateData: UpdateMissionData): Promise<void> => {
  try {
    const missionRef = doc(db, MISSIONS_COLLECTION, missionId);

    const payload = {
      ...updateData,
      updatedAt: Timestamp.now(),
      ...(updateData.startDate && { startDate: Timestamp.fromDate(updateData.startDate) }),
      ...(updateData.endDate && { endDate: Timestamp.fromDate(updateData.endDate) }),
    };

    await updateDoc(missionRef, payload);
  } catch (error) {
    console.error('Error updating mission:', error);
    throw new Error('미션 업데이트 중 오류가 발생했습니다.');
  }
};

// 미션 삭제
export const deleteMission = async (missionId: string): Promise<void> => {
  try {
    const missionRef = doc(db, MISSIONS_COLLECTION, missionId);
    await deleteDoc(missionRef);
  } catch (error) {
    console.error('Error deleting mission:', error);
    throw new Error('미션 삭제 중 오류가 발생했습니다.');
  }
};

export const getUserMissionProgress = async (userId: string): Promise<UserMissionProgress | null> => {
  try {
    const progressRef = doc(db, USER_MISSION_PROGRESS_COLLECTION, userId);
    const docSnap = await getDoc(progressRef);

    if (docSnap.exists()) {
      return convertFirestoreUserMissionProgress(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting user mission progress:', error);
    throw new Error('사용자 미션 진행 상황 조회 중 오류가 발생했습니다.');
  }
};

// 미션 완료 토글 (효율적인 구조)
export const toggleMissionCompletion = async (userId: string, missionId: string, week: number): Promise<void> => {
  try {
    const progressRef = doc(db, USER_MISSION_PROGRESS_COLLECTION, userId);
    const currentProgress = await getUserMissionProgress(userId);

    if (currentProgress) {
      // 기존 문서가 있는 경우
      const completedMissions = { ...currentProgress.completedMissions };

      if (completedMissions[missionId]) {
        // 이미 완료된 미션 -> 취소
        delete completedMissions[missionId];
      } else {
        // 미완료 미션 -> 완료
        completedMissions[missionId] = {
          completedAt: new Date(),
          week,
          missionId,
        };
      }

      const updateData = {
        completedMissions,
        totalCompleted: Object.keys(completedMissions).length,
        lastUpdated: Timestamp.now(),
      };

      await updateDoc(progressRef, updateData);
    } else {
      // 새 문서 생성 (첫 번째 미션 완료)
      const newProgressData = {
        userId,
        completedMissions: {
          [missionId]: {
            completedAt: Timestamp.now(),
            week,
            missionId,
          },
        },
        totalCompleted: 1,
        lastUpdated: Timestamp.now(),
        createdAt: Timestamp.now(),
      };

      await setDoc(progressRef, newProgressData);
    }
  } catch (error) {
    console.error('❌ [DEBUG] toggleMissionCompletion 에러:', error);
    throw new Error('미션 완료 상태 변경 중 오류가 발생했습니다.');
  }
};

// 사용자 미션과 진행상황 조회
export const getUserMissionsWithProgress = async (userId: string): Promise<MissionWithProgress[]> => {
  try {
    const [missions, userProgress] = await Promise.all([getActiveMissions(), getUserMissionProgress(userId)]);

    return missions.map((mission) => ({
      mission,
      progress: userProgress?.completedMissions[mission.id]
        ? ({
            id: `${userId}_${mission.id}`, // 가상 ID (UI 호환성용)
            userId,
            missionId: mission.id,
            week: mission.week,
            isCompleted: true,
            completedAt: userProgress.completedMissions[mission.id].completedAt,
            createdAt: userProgress.createdAt,
            updatedAt: userProgress.lastUpdated,
          } as MissionProgressStatus)
        : undefined,
    }));
  } catch (error) {
    console.error('Error getting missions with progress:', error);
    throw new Error('미션 및 진행상황 조회 중 오류가 발생했습니다.');
  }
};

// 사용자 미션 진행 요약
export const getUserMissionProgressSummary = async (userId: string): Promise<MissionProgressSummary> => {
  try {
    const [missions, userProgress] = await Promise.all([getActiveMissions(), getUserMissionProgress(userId)]);

    const totalMissions = missions.length;
    const completedMissions = userProgress?.totalCompleted || 0;
    const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    // 현재 주차 계산
    const now = new Date();
    const currentActiveMission = missions.find((m) => m.startDate <= now && m.endDate >= now);
    const currentWeek = currentActiveMission ? currentActiveMission.week : 0;

    return {
      totalMissions,
      completedMissions,
      completionRate: Math.round(completionRate),
      currentWeek,
    };
  } catch (error) {
    console.error('Error getting mission progress summary:', error);
    throw new Error('미션 진행 요약 조회 중 오류가 발생했습니다.');
  }
};
