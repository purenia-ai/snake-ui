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
        }
    }
};

export default enUS;
