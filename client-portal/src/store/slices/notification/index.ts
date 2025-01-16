import { INotification } from "@interfaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export type NotificationType = {
  created_at: string;
  description: string;
  id: string;
  is_enabled: boolean;
  name: string;
  updated_at: string;
};
export interface NotificationSliceState {
  notificationList: NotificationType[];
  notificationsLoading: boolean;
}

const initialState: NotificationSliceState = {
  notificationList: [],
  notificationsLoading: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationList: (state, action: PayloadAction<NotificationType[]>) => {
      state.notificationList = action.payload;
      return state;
    },
    setNotificationLoading: (state, action: PayloadAction<boolean>) => {
      state.notificationsLoading = action.payload;
      return state;
    },
    updateNotificationList: (state, action: PayloadAction<INotification>) => {
      let newNotificationData = [...state.notificationList];
      let newData: any = newNotificationData.map((obj: INotification) => {
        if (obj.id === action?.payload?.id) {
          return action?.payload;
        }
        return obj;
      });
      state = {
        ...state,
        notificationList: newData,
      };
      return state;
    },
  },
});

export const {
  setNotificationList,
  setNotificationLoading,
  updateNotificationList,
} = notificationSlice.actions;

export default notificationSlice.reducer;
