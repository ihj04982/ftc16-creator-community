export interface Mission {
  id: string;
  week: number; // 0-6 (0주차부터 6주차까지)
  title: string;
  description: string;
  missionUrl: string; // 미션 링크 URL
  isActive: boolean; // 활성화 여부
  startDate: Date; // 미션 시작일
  endDate: Date; // 미션 마감일
  createdAt: Date;
  updatedAt: Date;
}

// 사용자별 미션 진행 상황 (효율적인 구조)
export interface UserMissionProgress {
  id: string;
  userId: string;
  completedMissions: Record<string, MissionCompletion>; // missionId -> completion info
  totalCompleted: number;
  lastUpdated: Date;
  createdAt: Date;
}

// 개별 미션 완료 정보
export interface MissionCompletion {
  completedAt: Date;
  week: number;
  missionId: string;
}

// UserMissionProgress 생성 데이터
export interface CreateUserMissionProgressData {
  userId: string;
  completedMissions?: Record<string, MissionCompletion>;
}

// UserMissionProgress 업데이트 데이터
export interface UpdateUserMissionProgressData {
  completedMissions?: Record<string, MissionCompletion>;
  totalCompleted?: number;
  lastUpdated?: Date;
}

export interface CreateMissionData {
  week: number;
  title: string;
  description: string;
  missionUrl: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface UpdateMissionData {
  title?: string;
  description?: string;
  missionUrl?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// 개별 미션의 완료 상태 (UI 표시용)
export interface MissionProgressStatus {
  id: string;
  userId: string;
  missionId: string;
  week: number;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// 미션 센터에서 사용할 미션과 진행상황을 결합한 타입
export interface MissionWithProgress {
  mission: Mission;
  progress?: MissionProgressStatus;
}

// 전체 진행 상황 요약
export interface MissionProgressSummary {
  totalMissions: number;
  completedMissions: number;
  completionRate: number;
  currentWeek: number;
}
