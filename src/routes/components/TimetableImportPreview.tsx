import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
    Alert,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import type { ReactNode } from 'react'

import type { TimetableImportChange, TimetableImportPreview } from '../../service/network/timetableImport.ts'

const changePresentation: Record<TimetableImportChange['type'], { label: string, color: 'success' | 'warning' | 'error', icon: ReactNode }> = {
    CREATE: { label: '추가', color: 'success', icon: <AddCircleOutlineIcon color="success" /> },
    UPDATE: { label: '변경', color: 'warning', icon: <EditOutlinedIcon color="warning" /> },
    DELETE: { label: '삭제', color: 'error', icon: <DeleteOutlineIcon color="error" /> },
}

export function TimetableImportPreviewPanel({ preview }: { preview: TimetableImportPreview }) {
    return (
        <Stack spacing={2}>
            <Alert severity={preview.errors.length > 0 ? 'error' : preview.deleteCount > 0 ? 'warning' : 'info'}>
                {preview.errors.length > 0
                    ? '오류를 수정한 뒤 다시 검증해주세요.'
                    : '아래 변경사항을 확인한 뒤 적용해주세요. 적용은 서버에서 한 번에 처리됩니다.'}
            </Alert>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1 }}>
                {[
                    ['추가', preview.createCount, 'success.main'],
                    ['변경', preview.updateCount, 'warning.main'],
                    ['삭제', preview.deleteCount, 'error.main'],
                    ['유지', preview.unchangedCount, 'text.secondary'],
                ].map(([label, count, color]) => (
                    <Paper key={String(label)} variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color, fontWeight: 700 }}>{count}</Typography>
                        <Typography variant="caption" sx={{
                            color: 'text.secondary'
                        }}>{label}</Typography>
                    </Paper>
                ))}
            </Box>
            {preview.errors.map((issue, index) => (
                <Alert key={`${issue.code}-${issue.row}-${index}`} severity="error">
                    {issue.row ? `${issue.row}행 · ` : ''}{issue.message}
                </Alert>
            ))}
            {preview.warnings.map((issue, index) => (
                <Alert key={`${issue.code}-${index}`} severity="warning">{issue.message}</Alert>
            ))}
            {preview.sampleChanges.length > 0 && (
                <Paper variant="outlined">
                    <List disablePadding>
                        {preview.sampleChanges.map((change, index) => {
                            const presentation = changePresentation[change.type]
                            return (
                                <Box key={`${change.type}-${change.identifier}-${index}`}>
                                    {index > 0 && <Divider />}
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon sx={{ minWidth: 38, mt: 0.5 }}>{presentation.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={<Stack direction="row" spacing={1} sx={{
                                                alignItems: 'center'
                                            }}><Chip size="small" color={presentation.color} label={presentation.label} /><span>{change.identifier}</span></Stack>}
                                            secondary={change.before || change.after
                                                ? `${change.before ?? '없음'} → ${change.after ?? '없음'}`
                                                : undefined}
                                        />
                                    </ListItem>
                                </Box>
                            )
                        })}
                    </List>
                </Paper>
            )}
        </Stack>
    )
}
