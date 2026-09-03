import type { SnakeLocale } from '../../libs/config/types';

const zhCN: SnakeLocale = {
    name: 'zh-CN',
    label: '简体中文',
    messages: {
        common: {
            confirm: '确定',
            cancel: '取消',
            close: '关闭',
            loading: '加载中',
            loadMore: '加载更多',
            noMore: '没有更多了',
            empty: '暂无数据',
            retry: '重试'
        },
        image: { loading: '图片加载中', error: '图片加载失败' },
        modal: { title: '提示', confirmText: '确认', cancelText: '取消' },
        network: { error: '网络请求失败', canceled: '请求已取消' }
    }
};

export default zhCN;
