import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import SearchIcon from '@mui/icons-material/Search'
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    Stack,
    Switch,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

import { MANAGEMENT_PERMISSIONS } from '../../../security/permissions.ts'
import type { AdminPermission } from '../../../security/permissions.ts'
import {
    createAdminUser,
    getAdminUsers,
    reissueAdminUserInvitation,
    updateAdminUser,
} from '../../../service/network/adminUsers.ts'
import type {
    AdminUser,
    AdminUserInvitation,
    CreateAdminUser,
} from '../../../service/network/adminUsers.ts'
import { AppSnackbar } from '../../components/AppSnackbar.tsx'
import { PageLayout } from '../../components/PageLayout.tsx'
import { PageState } from '../../components/PageState.tsx'

type UserDraft = Pick<AdminUser, 'active' | 'permissions'>

const emptyUser: CreateAdminUser = {
    userID: '',
    nickname: '',
    email: '',
    phone: '',
    permissions: [],
}

const sameDraft = (user: AdminUser, draft: UserDraft) =>
    user.active === draft.active &&
    [...user.permissions].sort().join(',') === [...draft.permissions].sort().join(',')

const statusPresentation = (status: AdminUser['status']) => {
    switch (status) {
    case 'PENDING_SETUP': return { label: '가입 대기', color: 'warning' as const }
    case 'INVITATION_EXPIRED': return { label: '초대 만료', color: 'default' as const }
    case 'ACTIVE': return { label: '활성', color: 'success' as const }
    case 'INACTIVE': return { label: '비활성', color: 'default' as const }
    }
}

const invitationLink = (token: string) =>
    `${window.location.origin}/account-setup#token=${encodeURIComponent(token)}`

export default function AdminUsers() {
    const theme = useTheme()
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))
    const [users, setUsers] = useState<AdminUser[]>([])
    const [drafts, setDrafts] = useState<Record<string, UserDraft>>({})
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingUser, setSavingUser] = useState<string | null>(null)
    const [reissuingUser, setReissuingUser] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [notice, setNotice] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newUser, setNewUser] = useState<CreateAdminUser>(emptyUser)
    const [invitation, setInvitation] = useState<AdminUserInvitation | null>(null)

    const syncUsers = (result: AdminUser[]) => {
        setUsers(result)
        setDrafts(Object.fromEntries(result.map((user) => [
            user.username,
            { active: user.active, permissions: [...user.permissions] },
        ])))
    }

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await getAdminUsers()
            syncUsers(response.data.result)
            setError(null)
        } catch {
            setError('관리자 계정 목록을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void loadUsers() }, [])

    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase()
        if (!normalizedQuery) return users
        return users.filter((user) =>
            [user.username, user.nickname, user.email]
                .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)))
    }, [query, users])

    const updateDraft = (username: string, update: Partial<UserDraft>) => {
        setDrafts((current) => ({
            ...current,
            [username]: { ...current[username], ...update },
        }))
    }

    const togglePermission = (username: string, permission: AdminPermission) => {
        const current = drafts[username]
        const next = current.permissions.includes(permission)
            ? current.permissions.filter((item) => item !== permission)
            : [...current.permissions, permission]
        updateDraft(username, { permissions: next })
    }

    const toggleNewUserPermission = (permission: AdminPermission) => {
        setNewUser((current) => ({
            ...current,
            permissions: current.permissions.includes(permission)
                ? current.permissions.filter((item) => item !== permission)
                : [...current.permissions, permission],
        }))
    }

    const replaceUser = (user: AdminUser) => {
        setUsers((current) => {
            const exists = current.some((item) => item.username === user.username)
            return exists
                ? current.map((item) => item.username === user.username ? user : item)
                : [...current, user].sort((left, right) => left.nickname.localeCompare(right.nickname))
        })
        setDrafts((current) => ({
            ...current,
            [user.username]: { active: user.active, permissions: [...user.permissions] },
        }))
    }

    const saveUser = async (user: AdminUser) => {
        const draft = drafts[user.username]
        setSavingUser(user.username)
        try {
            const response = await updateAdminUser(user.username, draft)
            replaceUser(response.data)
            setError(null)
            setNotice('사용자 권한을 저장했습니다.')
        } catch (requestError: unknown) {
            const messageCode = axios.isAxiosError<{ message?: string }>(requestError)
                ? requestError.response?.data?.message
                : undefined
            setError(messageCode === 'LAST_SUPER_ADMIN_REQUIRED'
                ? '활성화된 최고 관리자는 최소 한 명 이상 필요합니다.'
                : messageCode === 'USER_SETUP_REQUIRED'
                    ? '가입 대기 사용자는 비밀번호 설정을 완료해야 활성화됩니다.'
                    : '권한 변경을 저장하지 못했습니다.')
        } finally {
            setSavingUser(null)
        }
    }

    const handleCreate = async () => {
        setCreating(true)
        try {
            const response = await createAdminUser(newUser)
            replaceUser(response.data.user)
            setInvitation(response.data)
            setCreateOpen(false)
            setNewUser(emptyUser)
            setError(null)
        } catch (requestError: unknown) {
            const messageCode = axios.isAxiosError<{ message?: string }>(requestError)
                ? requestError.response?.data?.message
                : undefined
            setError(messageCode === 'DUPLICATE_USER_ID'
                ? '이미 사용 중인 아이디입니다.'
                : messageCode === 'DUPLICATE_EMAIL'
                    ? '이미 등록된 이메일입니다.'
                    : '사용자를 초대하지 못했습니다.')
        } finally {
            setCreating(false)
        }
    }

    const handleReissue = async (user: AdminUser) => {
        setReissuingUser(user.username)
        try {
            const response = await reissueAdminUserInvitation(user.username)
            replaceUser(response.data.user)
            setInvitation(response.data)
            setError(null)
        } catch {
            setError('초대 링크를 재발급하지 못했습니다.')
        } finally {
            setReissuingUser(null)
        }
    }

    const copyInvitation = async () => {
        if (!invitation) return
        try {
            await navigator.clipboard.writeText(invitationLink(invitation.token))
            setNotice('초대 링크를 클립보드에 복사했습니다.')
        } catch {
            setError('초대 링크를 복사하지 못했습니다. 아래 링크를 직접 복사해 주세요.')
        }
    }

    const canCreate = Boolean(newUser.userID.trim() && newUser.nickname.trim() && newUser.email.trim())

    return (
        <PageLayout
            title='사용자 및 권한'
            description='관리자를 초대하고 담당할 관리 영역을 지정합니다.'
            icon={<AdminPanelSettingsOutlinedIcon />}
            actions={(
                <Button variant='contained' startIcon={<AddOutlinedIcon />} onClick={() => setCreateOpen(true)}>
                    사용자 초대
                </Button>
            )}>
            <Alert severity='info' sx={{ mb: 3 }}>
                새 사용자는 초대 링크에서 비밀번호를 만든 뒤 활성화됩니다. 최고 관리자는 모든 영역을 관리할 수 있습니다.
            </Alert>
            {error && <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
            <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                label='사용자 검색'
                placeholder='이름, 아이디 또는 이메일'
                fullWidth
                sx={{ mb: 3, maxWidth: 520 }}
                slotProps={{ input: { startAdornment: <InputAdornment position='start'><SearchIcon /></InputAdornment> } }}
            />
            {loading ? (
                <PageState loading label='관리자 계정 불러오는 중' />
            ) : filteredUsers.length === 0 ? (
                <PageState label='검색 결과가 없습니다.' icon={<PersonOffOutlinedIcon sx={{ fontSize: 48 }} />} />
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                    {filteredUsers.map((user) => {
                        const draft = drafts[user.username]
                        const pendingSetup = user.status === 'PENDING_SETUP' || user.status === 'INVITATION_EXPIRED'
                        const status = statusPresentation(user.status)
                        return (
                            <Card key={user.username} variant='outlined' sx={{ borderRadius: 3 }}>
                                <CardHeader
                                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user.nickname.slice(0, 1)}</Avatar>}
                                    title={user.nickname}
                                    subheader={`${user.username} · ${user.email}`}
                                    action={<Chip label={status.label} color={status.color} size='small' sx={{ mt: 1 }} />}
                                />
                                <CardContent sx={{ pt: 0 }}>
                                    {pendingSetup ? (
                                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                                            <Typography variant='body2' color='text.secondary'>
                                                비밀번호 설정 전에는 로그인하거나 계정을 활성화할 수 없습니다.
                                            </Typography>
                                            <Button
                                                variant='outlined'
                                                startIcon={reissuingUser === user.username
                                                    ? <CircularProgress size={18} color='inherit' />
                                                    : <RefreshOutlinedIcon />}
                                                disabled={reissuingUser === user.username}
                                                onClick={() => handleReissue(user)}>
                                                초대 링크 재발급
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <FormControlLabel
                                            sx={{ minHeight: 48, mx: 0, width: '100%' }}
                                            control={(
                                                <Switch
                                                    checked={draft.active}
                                                    onChange={(event) => updateDraft(user.username, { active: event.target.checked })}
                                                    slotProps={{ input: { 'aria-label': `${user.nickname} 계정 활성화` } }}
                                                />
                                            )}
                                            label='로그인 및 관리 기능 사용 허용'
                                        />
                                    )}
                                    <Divider sx={{ my: 2 }} />
                                    <PermissionFields
                                        permissions={draft.permissions}
                                        onToggle={(permission) => togglePermission(user.username, permission)}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            variant='contained'
                                            startIcon={savingUser === user.username
                                                ? <CircularProgress size={18} color='inherit' />
                                                : <SaveOutlinedIcon />}
                                            disabled={savingUser === user.username || sameDraft(user, draft)}
                                            onClick={() => saveUser(user)}>
                                            저장
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Box>
            )}

            <Dialog fullScreen={fullScreenDialog} open={createOpen} onClose={() => !creating && setCreateOpen(false)} fullWidth maxWidth='sm'>
                <DialogTitle>새 사용자 초대</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2.5} sx={{ pt: 0.5 }}>
                        <Alert severity='info'>비밀번호는 사용자가 초대 링크에서 직접 설정합니다.</Alert>
                        <TextField label='아이디' required value={newUser.userID} inputProps={{ maxLength: 20 }} onChange={(e) => setNewUser({ ...newUser, userID: e.target.value })} />
                        <TextField label='이름' required value={newUser.nickname} inputProps={{ maxLength: 20 }} onChange={(e) => setNewUser({ ...newUser, nickname: e.target.value })} />
                        <TextField label='이메일' required type='email' value={newUser.email} inputProps={{ maxLength: 50 }} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        <TextField label='전화번호' value={newUser.phone} inputProps={{ maxLength: 15 }} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                        <PermissionFields permissions={newUser.permissions} onToggle={toggleNewUserPermission} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCreateOpen(false)} disabled={creating}>취소</Button>
                    <Button variant='contained' onClick={handleCreate} disabled={creating || !canCreate}>
                        {creating ? '초대 생성 중' : '초대 생성'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog fullScreen={fullScreenDialog} open={invitation !== null} onClose={() => setInvitation(null)} fullWidth maxWidth='sm'>
                <DialogTitle>초대 링크가 준비되었습니다</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Alert severity='warning'>이 링크는 창을 닫으면 다시 확인할 수 없습니다. 필요한 전달 채널에 지금 복사하세요.</Alert>
                        <TextField
                            label='24시간 동안 유효한 초대 링크'
                            value={invitation ? invitationLink(invitation.token) : ''}
                            multiline
                            minRows={3}
                            fullWidth
                            slotProps={{ input: { readOnly: true } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setInvitation(null)}>닫기</Button>
                    <Button variant='contained' startIcon={<ContentCopyOutlinedIcon />} onClick={copyInvitation}>링크 복사</Button>
                </DialogActions>
            </Dialog>

            <AppSnackbar message={notice} onClose={() => setNotice('')} />
        </PageLayout>
    )
}

function PermissionFields({
    permissions,
    onToggle,
}: {
    permissions: AdminPermission[],
    onToggle: (permission: AdminPermission) => void,
}) {
    const isSuperAdmin = permissions.includes('SUPER_ADMIN')
    return (
        <FormControl component='fieldset' fullWidth>
            <FormLabel component='legend' sx={{ mb: 1, color: 'text.primary', fontWeight: 700 }}>권한 수준</FormLabel>
            <FormControlLabel
                sx={{ minHeight: 48, mx: 0 }}
                control={<Checkbox checked={isSuperAdmin} onChange={() => onToggle('SUPER_ADMIN')} />}
                label='최고 관리자'
            />
            <FormLabel component='legend' sx={{ mt: 2, mb: 1, color: 'text.primary', fontWeight: 700 }}>관리 영역</FormLabel>
            <FormGroup sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 0.5 }}>
                {MANAGEMENT_PERMISSIONS.map(({ value, label }) => (
                    <FormControlLabel
                        key={value}
                        sx={{ minHeight: 48, mx: 0, opacity: isSuperAdmin ? 0.65 : 1 }}
                        control={(
                            <Checkbox
                                checked={isSuperAdmin || permissions.includes(value)}
                                disabled={isSuperAdmin}
                                onChange={() => onToggle(value)}
                            />
                        )}
                        label={label}
                    />
                ))}
            </FormGroup>
        </FormControl>
    )
}
