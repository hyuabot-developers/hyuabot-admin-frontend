import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
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
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    Switch,
    TextField,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

import {
    MANAGEMENT_PERMISSIONS,
} from '../../../security/permissions.ts'
import type { AdminPermission } from '../../../security/permissions.ts'
import {
    getAdminUsers,
    updateAdminUser,
} from '../../../service/network/adminUsers.ts'
import type { AdminUser } from '../../../service/network/adminUsers.ts'
import { AppSnackbar } from '../../components/AppSnackbar.tsx'
import { PageLayout } from '../../components/PageLayout.tsx'
import { PageState } from '../../components/PageState.tsx'

type UserDraft = Pick<AdminUser, 'active' | 'permissions'>

const sameDraft = (user: AdminUser, draft: UserDraft) =>
    user.active === draft.active &&
    [...user.permissions].sort().join(',') === [...draft.permissions].sort().join(',')

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [drafts, setDrafts] = useState<Record<string, UserDraft>>({})
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingUser, setSavingUser] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await getAdminUsers()
            setUsers(response.data.result)
            setDrafts(Object.fromEntries(response.data.result.map((user) => [
                user.username,
                { active: user.active, permissions: [...user.permissions] },
            ])))
            setError(null)
        } catch {
            setError('관리자 계정 목록을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadUsers()
    }, [])

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

    const saveUser = async (user: AdminUser) => {
        const draft = drafts[user.username]
        setSavingUser(user.username)
        try {
            const response = await updateAdminUser(user.username, draft)
            setUsers((current) => current.map((item) =>
                item.username === user.username ? response.data : item))
            setDrafts((current) => ({
                ...current,
                [user.username]: {
                    active: response.data.active,
                    permissions: [...response.data.permissions],
                },
            }))
            setError(null)
            setSaved(true)
        } catch (requestError: unknown) {
            const isLastSuperAdmin = axios.isAxiosError<{ message?: string }>(requestError) &&
                requestError.response?.data?.message === 'LAST_SUPER_ADMIN_REQUIRED'
            const message = isLastSuperAdmin
                ? '활성화된 최고 관리자는 최소 한 명 이상 필요합니다.'
                : '권한 변경을 저장하지 못했습니다.'
            setError(message)
        } finally {
            setSavingUser(null)
        }
    }

    return (
        <PageLayout
            title='사용자 및 권한'
            description='계정을 활성화하고 담당할 관리 영역을 지정합니다.'
            icon={<AdminPanelSettingsOutlinedIcon />}>

            <Alert severity='info' sx={{ mb: 3 }}>
                최고 관리자는 모든 영역과 사용자 권한을 관리할 수 있습니다. 일반 관리자에게는 필요한 영역만 부여하세요.
            </Alert>

            {error && <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

            <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                label='사용자 검색'
                placeholder='이름, 아이디 또는 이메일'
                fullWidth
                sx={{ mb: 3, maxWidth: 520 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position='start'><SearchIcon /></InputAdornment>
                        ),
                    },
                }}
            />

            {loading ? (
                <PageState loading label='관리자 계정 불러오는 중' />
            ) : filteredUsers.length === 0 ? (
                <PageState
                    label='검색 결과가 없습니다.'
                    icon={<PersonOffOutlinedIcon sx={{ fontSize: 48 }} />}
                />
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                    {filteredUsers.map((user) => {
                        const draft = drafts[user.username]
                        const isSuperAdmin = draft.permissions.includes('SUPER_ADMIN')
                        const isSaving = savingUser === user.username
                        return (
                            <Card key={user.username} variant='outlined' sx={{ borderRadius: 3 }}>
                                <CardHeader
                                    avatar={(
                                        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                            {user.nickname.slice(0, 1)}
                                        </Avatar>
                                    )}
                                    title={user.nickname}
                                    subheader={`${user.username} · ${user.email}`}
                                    action={
                                        <Chip
                                            label={draft.active ? '활성' : '비활성'}
                                            color={draft.active ? 'success' : 'default'}
                                            size='small'
                                            sx={{ mt: 1 }}
                                        />
                                    }
                                />
                                <CardContent sx={{ pt: 0 }}>
                                    <FormControlLabel
                                        sx={{ minHeight: 48, mx: 0, width: '100%' }}
                                        control={
                                            <Switch
                                                checked={draft.active}
                                                onChange={(event) => updateDraft(user.username, { active: event.target.checked })}
                                                slotProps={{ input: { 'aria-label': `${user.nickname} 계정 활성화` } }}
                                            />
                                        }
                                        label='로그인 및 관리 기능 사용 허용'
                                    />
                                    <Divider sx={{ my: 2 }} />
                                    <FormControl component='fieldset' fullWidth>
                                        <FormLabel component='legend' sx={{ mb: 1, color: 'text.primary', fontWeight: 700 }}>
                                            권한 수준
                                        </FormLabel>
                                        <FormControlLabel
                                            sx={{ minHeight: 48, mx: 0 }}
                                            control={
                                                <Checkbox
                                                    checked={isSuperAdmin}
                                                    onChange={() => togglePermission(user.username, 'SUPER_ADMIN')}
                                                />
                                            }
                                            label='최고 관리자'
                                        />
                                        <FormLabel component='legend' sx={{ mt: 2, mb: 1, color: 'text.primary', fontWeight: 700 }}>
                                            관리 영역
                                        </FormLabel>
                                        <FormGroup
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                                                gap: 0.5,
                                            }}>
                                            {MANAGEMENT_PERMISSIONS.map(({ value, label }) => (
                                                <FormControlLabel
                                                    key={value}
                                                    sx={{ minHeight: 48, mx: 0, opacity: isSuperAdmin ? 0.65 : 1 }}
                                                    control={
                                                        <Checkbox
                                                            checked={isSuperAdmin || draft.permissions.includes(value)}
                                                            disabled={isSuperAdmin}
                                                            onChange={() => togglePermission(user.username, value)}
                                                        />
                                                    }
                                                    label={label}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            variant='contained'
                                            startIcon={isSaving ? <CircularProgress size={18} color='inherit' /> : <SaveOutlinedIcon />}
                                            disabled={isSaving || sameDraft(user, draft)}
                                            onClick={() => saveUser(user)}
                                            sx={{ minHeight: 44 }}>
                                            저장
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Box>
            )}

            <AppSnackbar
                message={saved ? '사용자 권한을 저장했습니다.' : ''}
                onClose={() => setSaved(false)}
            />
        </PageLayout>
    )
}
