export function useModal() {
    return {
        show(options: UniApp.ShowModalOptions): Promise<UniApp.ShowModalRes> {
            return new Promise((resolve, reject) => {
                uni.showModal({ ...options, success: resolve, fail: reject });
            });
        }
    };
}
