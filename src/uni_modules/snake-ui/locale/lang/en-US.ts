import type { SnakeLocale } from '../../libs/config/types';

const enUS: SnakeLocale = {
    name: 'en-US',
    label: 'English',
    messages: {
        common: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            close: 'Close',
            loading: 'Loading',
            loadMore: 'Load more',
            noMore: 'No more data',
            empty: 'No data',
            retry: 'Retry'
        },
        image: { loading: 'Loading image', error: 'Image failed to load' },
        modal: { title: 'Prompt', confirmText: 'Confirm', cancelText: 'Cancel' },
        network: { error: 'Network request failed', canceled: 'Request canceled' },
        search: { placeholder: 'Please enter keywords', actionText: 'Search' },
        select: { cancelText: 'Cancel', confirmText: 'Confirm' },
        noNetwork: {
            tips: 'Ooops, network disconnected',
            retry: 'Retry',
            noConnection: 'No network connection',
            connected: 'Network connected'
        },
        readMore: { openText: 'Collapse', closeText: 'Read More' },
        link: { mpTips: 'Link copied, please open it in browser' },
        calendar: {
            startText: 'Start',
            endText: 'End',
            toolTip: 'Select date',
            outOfRange: 'Date out of range',
            year: '/',
            month: '',
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            confirmText: 'Confirm',
            to: ' to ',
            holiday: '休',
            workday: '班'
        },
        countDown: {
            day: 'd',
            hour: 'h',
            minute: 'm',
            second: 's'
        },
        upload: {
            uploadImage: 'Upload image', uploadVideo: 'Upload video', uploadFile: 'Upload file', uploadMedia: 'Upload media',
            retry: 'Retry', reUpload: 'Uploading again', fileNotSupported: 'File selection is not supported on this platform',
            overSize: 'File size exceeds the limit', overMaxCount: 'File count exceeds the limit',
            noAction: 'Configure an upload action or uploadRequest', uploadFailed: 'Upload failed',
            modalTitle: 'Prompt', deleteConfirm: 'Delete this file?', modalCancelText: 'Cancel', modalConfirmText: 'Confirm',
            terminatedRemove: 'Removal canceled', removeSuccess: 'Removed', previewFailed: 'Preview failed',
            openFailed: 'Unable to open this file', notAllowedExt: 'Unsupported file type: {ext}'
        }
    }
};

export default enUS;
