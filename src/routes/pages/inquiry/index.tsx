import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItemButton,
    Paper,
    Skeleton,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import {
    AdminInquiryThread,
    InquiryMessage,
    InquiryThreadStatus,
    closeInquiryThread,
    getInquiryMessages,
    getInquiryThreads,
    markInquiryRead,
    replyInquiry,
    updateInquiryThread,
} from '../../../service/network/inquiry.ts'
import { PageLayout } from '../../components/PageLayout.tsx'

const POLL_INTERVAL_MS = 30000

const STREAM_URL = `${import.meta.env.VITE_APP_API_URL}/api/v1/inquiry/admin/stream`

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

const parseBackendDate = (value: string) =>
    Date.parse(value.replace(/\[[^\]]+]$/, ''))

const formatDateTime = (value: string | null) => {
    if (!value) return ''
    const timestamp = parseBackendDate(value)
    return Number.isFinite(timestamp) ? dateTimeFormatter.format(timestamp) : ''
}

const statusChipColor = (status: InquiryThreadStatus) =>
    status === 'PENDING' ? 'warning' : 'default'

const statusLabel = (status: InquiryThreadStatus) =>
    status === 'PENDING' ? '보류' : '진행 중'

export default function InquiryPage() {
    const [threads, setThreads] = useState<AdminInquiryThread[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [messages, setMessages] = useState<InquiryMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [error, setError] = useState('')
    const [replyBody, setReplyBody] = useState('')
    const [assignedOnly, setAssignedOnly] = useState(false)
    const [sending, setSending] = useState(false)
    const mountedRef = useRef(true)
    const selectedIdRef = useRef<string | null>(null)
    const assignedOnlyRef = useRef(assignedOnly)

    const loadThreads = async (assigned: boolean) => {
        try {
            const response = await getInquiryThreads(assigned)
            if (mountedRef.current) {
                setThreads(response.data.result)
                setError('')
            }
        } catch {
            if (mountedRef.current) {
                setError('문의 목록을 불러오지 못했습니다.')
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false)
            }
        }
    }

    const loadMessages = async (id: string) => {
        try {
            const response = await getInquiryMessages(id)
            if (mountedRef.current) {
                setMessages(response.data.result)
            }
        } catch {
            if (mountedRef.current) {
                setError('대화 내용을 불러오지 못했습니다.')
            }
        }
    }

    useEffect(() => {
        mountedRef.current = true
        void loadThreads(assignedOnly)
        if (selectedIdRef.current) {
            void loadMessages(selectedIdRef.current)
        }
        const intervalId = setInterval(() => {
            void loadThreads(assignedOnly)
            if (selectedIdRef.current) {
                void loadMessages(selectedIdRef.current)
            }
        }, POLL_INTERVAL_MS)
        return () => {
            mountedRef.current = false
            clearInterval(intervalId)
        }
    }, [assignedOnly])

    useEffect(() => {
        assignedOnlyRef.current = assignedOnly
    }, [assignedOnly])

    // 실시간 갱신: 서버 SSE 이벤트 수신 시 목록/대화를 즉시 새로고침한다.
    // (연결이 끊겨도 EventSource가 자동 재연결하며, 위 폴링이 폴백 역할을 한다.)
    useEffect(() => {
        const source = new EventSource(STREAM_URL, { withCredentials: true })
        const handleEvent = () => {
            void loadThreads(assignedOnlyRef.current)
            if (selectedIdRef.current) {
                void loadMessages(selectedIdRef.current)
            }
        }
        source.addEventListener('message', handleEvent)
        source.addEventListener('read', handleEvent)
        source.addEventListener('thread', handleEvent)
        return () => {
            source.close()
        }
    }, [])

    const handleSelect = async (id: string) => {
        setSelectedId(id)
        selectedIdRef.current = id
        setMessagesLoading(true)
        try {
            await markInquiryRead(id)
        } catch {
            // 읽음 처리 실패는 조용히 무시하고 대화만 표시한다.
        }
        await loadMessages(id)
        if (mountedRef.current) {
            setMessagesLoading(false)
        }
        void loadThreads(assignedOnly)
    }

    const handleReply = async () => {
        const body = replyBody.trim()
        if (!body || !selectedId) return
        setSending(true)
        try {
            await replyInquiry(selectedId, body)
            if (mountedRef.current) {
                setReplyBody('')
            }
            await loadMessages(selectedId)
            void loadThreads(assignedOnly)
        } catch {
            if (mountedRef.current) {
                setError('답변을 전송하지 못했습니다.')
            }
        } finally {
            if (mountedRef.current) {
                setSending(false)
            }
        }
    }

    const handleToggleStatus = async (thread: AdminInquiryThread) => {
        const status: InquiryThreadStatus = thread.status === 'PENDING' ? 'OPEN' : 'PENDING'
        try {
            await updateInquiryThread(thread.id, { status })
            void loadThreads(assignedOnly)
        } catch {
            if (mountedRef.current) {
                setError('상태를 변경하지 못했습니다.')
            }
        }
    }

    const handleClose = async (id: string) => {
        if (!window.confirm('이 문의를 종료할까요? 종료 후에는 목록에서 사라집니다.')) return
        try {
            await closeInquiryThread(id)
            if (mountedRef.current) {
                setThreads((prev) => prev.filter((thread) => thread.id !== id))
                setSelectedId(null)
                selectedIdRef.current = null
                setMessages([])
            }
        } catch {
            if (mountedRef.current) {
                setError('문의를 종료하지 못했습니다.')
            }
        }
    }

    const selectedThread = threads.find((thread) => thread.id === selectedId) ?? null

    const renderThreadList = () => {
        if (loading && threads.length === 0) {
            return (
                <Stack spacing={1} sx={{ p: 1.5 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" height={72} />
                    ))}
                </Stack>
            )
        }
        if (threads.length === 0) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        응대할 문의가 없습니다.
                    </Typography>
                </Box>
            )
        }
        return (
            <List disablePadding>
                {threads.map((thread) => (
                    <ListItemButton
                        key={thread.id}
                        selected={thread.id === selectedId}
                        onClick={() => void handleSelect(thread.id)}
                        sx={{
                            display: 'block',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 1.5,
                        }}
                    >
                        <Stack spacing={0.75}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {thread.subject ?? '제목 없음'}
                            </Typography>
                            <Stack
                                direction="row"
                                sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}
                            >
                                <Chip
                                    size="small"
                                    color={statusChipColor(thread.status)}
                                    label={statusLabel(thread.status)}
                                />
                                {thread.entryScreenName && (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={`${thread.entryScreenName}에서 시작`}
                                    />
                                )}
                            </Stack>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {formatDateTime(thread.lastMessageAt ?? thread.createdAt) || '시각 확인 불가'}
                            </Typography>
                        </Stack>
                    </ListItemButton>
                ))}
            </List>
        )
    }

    const renderConversation = () => {
        if (!selectedThread) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        왼쪽 목록에서 문의를 선택하세요.
                    </Typography>
                </Box>
            )
        }
        return (
            <>
                <Box sx={{ p: 2 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{ justifyContent: 'space-between', gap: 1.5 }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" component="h2" sx={{ overflowWrap: 'anywhere' }}>
                                {selectedThread.subject ?? '제목 없음'}
                            </Typography>
                            <Stack
                                direction="row"
                                sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1, alignItems: 'center' }}
                            >
                                <Chip
                                    size="small"
                                    color={statusChipColor(selectedThread.status)}
                                    label={statusLabel(selectedThread.status)}
                                />
                                <Chip size="small" variant="outlined" label={selectedThread.platform} />
                                {selectedThread.entryScreenName && (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={selectedThread.entryScreenName}
                                    />
                                )}
                                {selectedThread.entryScreen && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {selectedThread.entryScreen}
                                    </Typography>
                                )}
                                {selectedThread.contactEmail && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {selectedThread.contactEmail}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                        <Stack
                            direction="row"
                            sx={{ gap: 1, flexShrink: 0, alignItems: 'center', minHeight: 32 }}
                        >
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => void handleToggleStatus(selectedThread)}
                            >
                                {selectedThread.status === 'PENDING' ? '진행으로 전환' : '보류로 전환'}
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => void handleClose(selectedThread.id)}
                            >
                                종료
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2, minHeight: 240 }}>
                    {messagesLoading && messages.length === 0 ? (
                        <Stack spacing={1.5}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} variant="rounded" height={56} />
                            ))}
                        </Stack>
                    ) : messages.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                아직 대화가 없습니다.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={1.5}>
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                        </Stack>
                    )}
                </Box>
                <Divider />
                <Stack direction="row" spacing={1} sx={{ p: 2, alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={5}
                        size="small"
                        placeholder="답변을 입력하세요."
                        value={replyBody}
                        onChange={(event) => setReplyBody(event.target.value)}
                        disabled={sending}
                    />
                    <IconButton
                        color="primary"
                        onClick={() => void handleReply()}
                        disabled={sending || replyBody.trim().length === 0}
                        aria-label="답변 전송"
                    >
                        <SendRoundedIcon />
                    </IconButton>
                </Stack>
            </>
        )
    }

    return (
        <PageLayout
            title="문의"
            description="사용자 문의에 응대합니다."
            icon={<ForumOutlinedIcon />}
            actions={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={assignedOnly}
                                onChange={(event) => setAssignedOnly(event.target.checked)}
                            />
                        }
                        label="내 배정만"
                    />
                    <Button
                        variant="outlined"
                        startIcon={<RefreshRoundedIcon />}
                        onClick={() => void loadThreads(assignedOnly)}
                        disabled={loading}
                    >
                        새로고침
                    </Button>
                </Stack>
            }
        >
            <Stack spacing={2} sx={{ pb: 4 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        alignItems: 'stretch',
                    }}
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            width: { xs: '100%', md: 340 },
                            flexShrink: 0,
                            maxHeight: { md: 640 },
                            overflowY: 'auto',
                        }}
                    >
                        {renderThreadList()}
                    </Paper>

                    <Paper
                        variant="outlined"
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {renderConversation()}
                    </Paper>
                </Box>
            </Stack>
        </PageLayout>
    )
}

function MessageBubble({ message }: { message: InquiryMessage }) {
    if (message.senderType === 'SYSTEM') {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {message.body}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {formatDateTime(message.createdAt)}
                </Typography>
            </Box>
        )
    }
    const isAdmin = message.senderType === 'ADMIN'
    return (
        <Box sx={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ width: 'fit-content', maxWidth: 'min(80%, 520px)' }}>
                <Paper
                    variant={isAdmin ? 'elevation' : 'outlined'}
                    elevation={0}
                    sx={{
                        p: 1.25,
                        borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        bgcolor: isAdmin ? 'primary.main' : 'background.paper',
                        color: isAdmin ? 'primary.contrastText' : 'text.primary',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            textAlign: isAdmin ? 'right' : 'left',
                        }}
                    >
                        {message.body}
                    </Typography>
                </Paper>
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                        mt: 0.25,
                        justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatDateTime(message.createdAt)}
                    </Typography>
                    {isAdmin && message.readAt && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            읽음
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}
