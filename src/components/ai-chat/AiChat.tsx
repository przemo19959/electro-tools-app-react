import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, IconButton, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import {
    addUserAndPendingAiMessage,
    aiChatMessages,
    appendToLastPendingAiMessage,
    clearMessages,
    finalizeLastPendingAiMessage,
} from "./ai-chat-slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import dayjs from "dayjs";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// import { GoogleGenAI } from "@google/genai";

// Temporarily disabled for testing:
// const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

type MockChunk = {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
};

const MOCK_WORDS = [
    'electro', 'stream', 'mock', 'random', 'delta', 'signal', 'voltage', 'current',
    'transform', 'dataset', 'context', 'chunk', 'response', 'testing', 'preview', 'ok',
    'sync', 'async', 'generator', 'iteration', 'pipeline', 'status', 'ready', 'update',
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomText = () => {
    const wordsCount = randomInt(1, 4);
    return Array.from({ length: wordsCount }, () => MOCK_WORDS[randomInt(0, MOCK_WORDS.length - 1)]).join(' ') + ' ';
};

async function* mockContentStream(): AsyncGenerator<MockChunk> {
    const totalChunks = randomInt(8, 16);
    for (let i = 0; i < totalChunks; i += 1) {
        await wait(randomInt(120, 420));
        yield {
            candidates: [
                {
                    content: {
                        parts: [{ text: randomText() }],
                    },
                },
            ],
        };
    }
}

export const AiChat = () => {
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState<boolean>(false);
    const messages = useAppSelector(aiChatMessages);
    const [query, setQuery] = useState<string>('');
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollAfterNextMessageRef = useRef<boolean>(false);
    const autoScrollActiveRef = useRef<boolean>(false);
    const lastUserMessageRef = useRef<HTMLDivElement | null>(null);

    const updateScrollButtonVisibility = () => {
        const element = contentRef.current;

        if (!element || !expanded) {
            setShowScrollButton(false);
            return;
        }

        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        setShowScrollButton(distanceFromBottom > 24);
    };

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        const element = contentRef.current;

        if (!element) {
            return;
        }

        element.scrollTo({ top: element.scrollHeight, behavior });
    };

    useEffect(() => {
        if (!expanded) {
            setShowScrollButton(false);
            return;
        }

        const frameId = requestAnimationFrame(() => {
            if (shouldScrollAfterNextMessageRef.current) {
                scrollToBottom();
                shouldScrollAfterNextMessageRef.current = false;
            } else if (autoScrollActiveRef.current) {
                const container = contentRef.current;
                const lastUserMsg = lastUserMessageRef.current;

                if (container && lastUserMsg) {
                    const containerTop = container.getBoundingClientRect().top;
                    const msgTop = lastUserMsg.getBoundingClientRect().top;

                    if (msgTop - 16 > containerTop) {
                        container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
                    } else {
                        autoScrollActiveRef.current = false;
                    }
                }
            }

            updateScrollButtonVisibility();
        });

        return () => cancelAnimationFrame(frameId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, messages]);

    const sendMessage = async (message: string) => {
        shouldScrollAfterNextMessageRef.current = true;
        autoScrollActiveRef.current = true;
        dispatch(addUserAndPendingAiMessage(message));
        setQuery('');

        try {
            // Gemini stream temporarily replaced by local async generator for UI testing.
            // const response = await ai.models.generateContentStream({
            //     model: "gemini-3-flash-preview",
            //     contents: message,
            // });
            const response = mockContentStream();

            for await (const chunk of response) {
                // console.log('Received mock chunk:', chunk);
                const aiResponse = chunk.candidates?.[0].content?.parts?.map((v) => v.text).join('') || '';
                dispatch(appendToLastPendingAiMessage(aiResponse));
            }

            dispatch(finalizeLastPendingAiMessage());
        } finally {
            autoScrollActiveRef.current = false;
        }
    };

    return (
        <StyledContainer expanded={expanded} onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
        }}>
            <StyledRow>
                {autoScrollActiveRef.current ? <StyledSmartToyIcon /> : <SmartToyIcon />}
                {expanded && <div>AI Chat</div>}
                <div style={{ flex: 1 }} />
                {expanded && messages.length > 0 && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(clearMessages());
                        }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}
            </StyledRow>
            <StyledContent ref={contentRef} expanded={expanded} onScroll={updateScrollButtonVisibility}>
                <StyledCol>
                    {messages.map((v) => (
                        <StyledMessage
                            key={v.id}
                            sender={v.sender}
                            ref={v.sender === 'user' ? lastUserMessageRef : null}
                        >
                            <div><strong>{v.sender === 'user' ? 'You' : 'AI'}:</strong> {v.content}</div>
                            {!v.pending && <StyledTimestamp>{dayjs(v.timestamp).format('YYYY-MM-DD HH:mm:ss')}</StyledTimestamp>}
                        </StyledMessage>
                    ))}
                    {messages.length === 0 && <div style={{ fontStyle: 'italic', color: '#888' }}>No messages yet. Start the conversation!</div>}
                </StyledCol>
                <StyledBottomContainer>
                    <StyledTextField
                        onClick={e => e.stopPropagation()}
                        multiline
                        disabled={autoScrollActiveRef.current}
                        maxRows={4}
                        variant="standard"
                        placeholder={autoScrollActiveRef.current ? 'Waiting for AI response...' : 'Ask me anything...'}
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (query.trim() === '') return;
                                sendMessage(query);
                            }
                        }}
                        inputRef={input => input && expanded && input.focus()}

                    />
                    <StyledScrollButton
                        visible={showScrollButton}
                        variant="outlined"
                        startIcon={<ArrowDownwardIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            scrollToBottom();
                        }}
                        size="small"
                    >
                        Scroll to bottom
                    </StyledScrollButton>
                </StyledBottomContainer>
            </StyledContent>
        </StyledContainer>
    );
};

const StyledContainer = styled.div<{ expanded: boolean }>`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${({ theme }) => css`
        background-color: ${theme.palette.background.paper};
        border: 1px solid ${theme.palette.divider};
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem;
    `}

    z-index: 1;
    width: ${({ expanded }) => (expanded ? '500px' : '58px')};
    transition: width 400ms ease;
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
`;

const StyledSmartToyIcon = styled(SmartToyIcon)`
    @keyframes swing {
        0%   { transform: translateY(0px); }
        50%  { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
    }

    animation: swing 0.75s cubic-bezier(0.45, 0, 0.55, 1) infinite;
`;

const StyledTimestamp = styled.div`
    font-size: 0.65rem;
    opacity: 0.65;
    text-align: right;
    margin-top: 0.2rem;
`;

const StyledMessage = styled.div<{ sender: 'user' | 'ai' }>`
    padding: 0.4rem 0.65rem;
    border-radius: 6px;
    align-self: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
    display: flex;
    flex-direction: column;
    max-width: 80%;
    word-break: break-word;

    ${({ theme, sender }) => css`
        background-color: ${sender === 'user'
            ? theme.palette.primary.main
            : theme.palette.action.hover};
        color: ${sender === 'user'
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary};
    `}
`;

const StyledContent = styled.div<{ expanded: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    width: 100%;
    height: ${({ expanded }) => (expanded ? '400px' : '0')};
    margin-top: ${({ expanded }) => (expanded ? '0.75rem' : '0')};
    opacity: ${({ expanded }) => (expanded ? 1 : 0)};
    transform: translateY(${({ expanded }) => (expanded ? '0' : '-0.35rem')});
    pointer-events: ${({ expanded }) => (expanded ? 'auto' : 'none')};
    transition: height 400ms ease, margin-top 400ms ease, opacity 400ms ease,
        transform 400ms ease;
`;

const StyledCol = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    flex-direction: column;
    gap: 0.25rem;
`;

const StyledBottomContainer = styled.div`
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    
    ${({ theme }) => css`
        background: linear-gradient(
            to top,
            ${theme.palette.background.paper} 0%,
            ${theme.palette.background.paper} 55%,
            ${alpha(theme.palette.background.paper, 0.85)} 75%,
            ${alpha(theme.palette.background.paper, 0)} 100%
        );
    `}
`;

const StyledScrollButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'visible',
}) <{ visible: boolean }>`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    z-index: 2;

    ${({ theme, visible }) => css`
        background-color: ${alpha(theme.palette.background.paper, 0.92)};
        border-color: ${alpha(theme.palette.divider, 0.9)};
        box-shadow: 0 10px 24px ${alpha(theme.palette.common.black, 0.18)};
        opacity: ${visible ? 1 : 0};
        pointer-events: ${visible ? 'auto' : 'none'};
        transform: translate(-50%, ${visible ? '-2rem' : '0'}) scale(${visible ? 1 : 0.96});
        transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms ease;

        &:hover {
            background-color: ${theme.palette.background.paper};
            border-color: ${theme.palette.divider};
            box-shadow: 0 14px 28px ${alpha(theme.palette.common.black, 0.22)};
        }
    `}
`;

const StyledTextField = styled(TextField)`
    z-index: 1;
`;