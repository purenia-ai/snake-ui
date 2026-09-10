import type { Locale } from '../../libs/config/types';

const zhCN: Locale = {
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
        network: { error: '网络请求失败', canceled: '请求已取消' },
        search: { placeholder: '请输入关键字', actionText: '搜索' },
        select: { cancelText: '取消', confirmText: '确认' },
        noNetwork: {
            tips: '哎呀，网络信号丢失',
            retry: '重试',
            noConnection: '无网络连接',
            connected: '网络已连接'
        },
        readMore: { openText: '收起', closeText: '展开阅读全文' },
        link: { mpTips: '链接已复制，请在浏览器打开' },
        calendar: {
            startText: '开始',
            endText: '结束',
            toolTip: '选择日期',
            outOfRange: '日期超出范围啦~',
            year: '年',
            month: '月',
            sun: '日',
            mon: '一',
            tue: '二',
            wed: '三',
            thu: '四',
            fri: '五',
            sat: '六',
            confirmText: '确定',
            to: '至',
            holiday: '休',
            workday: '班'
        },
        countDown: {
            day: '天',
            hour: '时',
            minute: '分',
            second: '秒'
        },
        upload: {
            uploadImage: '上传图片', uploadVideo: '上传视频', uploadFile: '上传文件', uploadMedia: '上传媒体',
            retry: '重试', reUpload: '重新上传', fileNotSupported: '当前平台暂不支持文件选择',
            overSize: '文件大小超出限制', overMaxCount: '文件数量超出限制',
            noAction: '请配置上传地址或自定义上传函数', uploadFailed: '上传失败',
            modalTitle: '提示', deleteConfirm: '确认删除该文件吗？', modalCancelText: '取消', modalConfirmText: '确认',
            terminatedRemove: '已取消删除', removeSuccess: '删除成功', previewFailed: '预览失败',
            openFailed: '无法打开此文件', notAllowedExt: '不支持该文件类型：{ext}'
        }
    }
};

export default zhCN;
