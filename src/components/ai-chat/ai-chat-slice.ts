import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import dayjs from "dayjs";

export type AiChatMessage = {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: number;
    pending: boolean;
};

type AiChatState = {
    messages: AiChatMessage[];
    lastPendingAiMessageIdx: number;
};

const initialState: AiChatState = {
    messages: [],
    lastPendingAiMessageIdx: -1,
};

const createMessage = (content: string, sender: 'user' | 'ai', pending: boolean): AiChatMessage => {
    const now = dayjs().valueOf();
    return ({
        id: `${sender}-${now}-${Math.random().toString(36).slice(2, 10)}`,
        content,
        sender,
        timestamp: now,
        pending,
    });
};

const aiChatSlice = createSlice({
    name: 'aiChat',
    initialState,
    reducers: {
        addUserAndPendingAiMessage: (state, action: PayloadAction<string>) => {
            state.messages.push(createMessage(action.payload, 'user', false));
            state.messages.push(createMessage('', 'ai', true));
            state.lastPendingAiMessageIdx = state.messages.length - 1;
        },
        appendToLastPendingAiMessage: (state, action: PayloadAction<string>) => {
            const lastPendingAi = state.lastPendingAiMessageIdx !== -1 ? state.messages[state.lastPendingAiMessageIdx] : undefined;

            if (!lastPendingAi) {
                console.error('No pending AI message found to append to.');
                return;
            }

            lastPendingAi.content += action.payload;
        },
        finalizeLastPendingAiMessage: (state) => {
            const lastPendingAi = state.lastPendingAiMessageIdx !== -1 ? state.messages[state.lastPendingAiMessageIdx] : undefined;

            if (!lastPendingAi) {
                console.error('No pending AI message found to finalize.');
                return;
            }

            lastPendingAi.pending = false;
            lastPendingAi.timestamp = dayjs().valueOf();
            state.lastPendingAiMessageIdx = -1;
        },
        clearMessages: (state) => {
            state.messages = [];
            state.lastPendingAiMessageIdx = -1;
        },
    },
});

export default aiChatSlice.reducer;

export const {
    addUserAndPendingAiMessage,
    appendToLastPendingAiMessage,
    finalizeLastPendingAiMessage,
    clearMessages,
} = aiChatSlice.actions;

export const aiChatMessages = (state: RootState) => state.aiChatSlice.messages;
