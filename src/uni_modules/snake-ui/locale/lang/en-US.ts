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
        network: { error: 'Network request failed', canceled: 'Request canceled' }
    }
};

export default enUS;
