# Support Editor Feature Flag Implementation

## Overview
Successfully implemented a feature flag system to conditionally hide the Support editor from the dashboard while preserving existing support data and ensuring the public read-only pages always show the full specification.

## Implementation Details

### 1. Environment Variable
- **File**: `.env.example`
- **Variable**: `NEXT_PUBLIC_FEATURE_SUPPORT_EDITOR=false`
- **Default**: `false` (Support editor hidden by default)

### 2. Feature Flag Utility
- **File**: `src/lib/featureFlags.ts`
- **Function**: `isSupportEditorEnabled()` - Returns boolean based on environment variable
- **Usage**: Import and call this function to check if Support editor should be shown

### 3. Dashboard Changes
- **File**: `src/pages/Preview.tsx`
- **Change**: Support section now conditionally rendered: `{isSupportEditorEnabled() && <Support />}`
- **Save Logic**: When feature flag is disabled, support data is excluded from the save payload

### 4. Backend Preservation Logic
- **File**: `backend/src/lib/upsert.ts`
- **Enhancement**: Modified `upsertSpec()` to preserve existing support data when not included in payload
- **Logic**: If `support` key is missing from incoming data, fetch existing spec and preserve its support data

### 5. Public Page Behavior
- **File**: `src/pages/ReadSpec.tsx`
- **Behavior**: Always shows Support section regardless of feature flag
- **Result**: Public/read-only pages always display full specification including support data

## How It Works

### When Feature Flag is DISABLED (default):
1. **Dashboard**: Support editor is hidden from preview page
2. **Save Operation**: Support data is excluded from payload sent to backend
3. **Backend**: Detects missing support data and preserves existing support from database
4. **Public Page**: Always shows full spec including preserved support data

### When Feature Flag is ENABLED:
1. **Dashboard**: Support editor is visible in preview page
2. **Save Operation**: Support data is included in payload (currently empty array as placeholder)
3. **Backend**: Updates support data as provided
4. **Public Page**: Shows full spec including updated support data

## Testing Instructions

### To Enable Support Editor:
1. Create `.env.local` file in project root
2. Add: `NEXT_PUBLIC_FEATURE_SUPPORT_EDITOR=true`
3. Restart development server
4. Support section will appear in dashboard preview

### To Disable Support Editor (default):
1. Ensure `.env.local` either doesn't exist or has `NEXT_PUBLIC_FEATURE_SUPPORT_EDITOR=false`
2. Support section will be hidden from dashboard preview
3. Existing support data will be preserved when saving

## Files Modified

### Frontend:
- `src/lib/featureFlags.ts` - New feature flag utility
- `src/pages/Preview.tsx` - Conditional Support rendering and save logic
- `.env.example` - Environment variable documentation

### Backend:
- `backend/src/lib/upsert.ts` - Enhanced to preserve support data when missing from payload

### Unchanged (by design):
- `src/pages/ReadSpec.tsx` - Public page always shows full spec
- `src/components/public/Support.tsx` - Public support component unchanged
- `src/components/Support.tsx` - Dashboard support component unchanged

## Benefits
1. **Data Preservation**: Existing support data is never lost when saving from dashboard with hidden editor
2. **Clean UI**: Dashboard can hide complex features while maintaining functionality
3. **Public Consistency**: Public pages always show complete specifications
4. **Easy Toggle**: Single environment variable controls the feature
5. **Backward Compatible**: Works with existing specifications and data structures
