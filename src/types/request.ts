export interface PostResponse {
  data: {
    id: number;
    rowStatus: string;
    creatorId: number;
    createdTs: number;
    updatedTs: number;
    content: string;
    visibility: string;
    pinned: boolean;
    displayTs: number;
    creator: {
      id: number;
      rowStatus: string;
      createdTs: number;
      updatedTs: number;
      username: string;
      role: string;
      email: string;
      nickname: string;
      openId: string;
      userSettingList: null;
    };
    resourceList: [];
  };
}

export interface TagResponse {
  data: string[];
}

export enum ROLE {
  HOST = "HOST",
  USER = "USER",
}

export interface MeResponse {
  data: {
    id: number;
    rowStatus: "NORMAL";
    createdTs: number;
    updatedTs: number;
    username: string;
    role: ROLE;
    email: string;
    nickname: string;
    openId: string;
    userSettingList: [
      {
        UserID: number;
        key: string;
        value: string;
      }
    ];
  };
}
