import type { DefineComponent, Plugin } from 'vue';
import type { SnakeButtonEmits, SnakeButtonProps } from './components/snake-button/types';
import type { SnakeLoadingIconProps } from './components/snake-loading-icon/types';
import type { SnakeTransitionEmits, SnakeTransitionProps } from './components/snake-transition/types';
import type { SnakeEmptyProps } from './components/snake-empty/types';
import type { SnakeIconEmits, SnakeIconProps } from './components/snake-icon/types';
import type { SnakeImageEmits, SnakeImageProps } from './components/snake-image/types';
import type { SnakeLazyImageEmits, SnakeLazyImageProps } from './components/snake-lazy-image/types';
import type { SnakeLoadmoreEmits, SnakeLoadmoreProps } from './components/snake-loadmore/types';
import type { SnakeNoticeBarEmits, SnakeNoticeBarProps } from './components/snake-notice-bar/types';
import type { SnakeOverlayEmits, SnakeOverlayProps } from './components/snake-overlay/types';
import type { SnakePopupEmits, SnakePopupProps } from './components/snake-popup/types';
import type { SnakeStickyEmits, SnakeStickyProps } from './components/snake-sticky/types';
import type { SnakeSwiperEmits, SnakeSwiperProps } from './components/snake-swiper/types';
import type { SnakeTabsEmits, SnakeTabsProps } from './components/snake-tabs/types';
import type { SnakeButtonSortEmits, SnakeButtonSortProps } from './components/snake-button-sort/types';
import type { SnakeDropMenuEmits, SnakeDropMenuProps } from './components/snake-drop-menu/types';
import type { SnakeDropMenuItemEmits, SnakeDropMenuItemProps } from './components/snake-drop-menu-item/types';
import type { SnakeIndexListEmits, SnakeIndexListProps } from './components/snake-index-list/types';
import type { SnakeIndexAnchorProps } from './components/snake-index-anchor/types';
import type { SnakeFormEmits, SnakeFormProps } from './components/snake-form/types';
import type { SnakeFormItemProps } from './components/snake-form-item/types';
import type { SnakeInputEmits, SnakeInputProps } from './components/snake-input/types';
import type { SnakeTextareaEmits, SnakeTextareaProps } from './components/snake-textarea/types';
import type { SnakeCheckboxEmits, SnakeCheckboxProps } from './components/snake-checkbox/types';
import type { SnakeCheckboxGroupEmits, SnakeCheckboxGroupProps } from './components/snake-checkbox-group/types';
import type { SnakeRadioEmits, SnakeRadioProps } from './components/snake-radio/types';
import type { SnakeRadioGroupEmits, SnakeRadioGroupProps } from './components/snake-radio-group/types';
import type { SnakeSwitchEmits, SnakeSwitchProps } from './components/snake-switch/types';
import type { SnakeSliderEmits, SnakeSliderProps } from './components/snake-slider/types';
import type { SnakeCmsEmits, SnakeCmsProps } from './components/snake-cms/types';

export * from './components/component-types';
export * from './components/snake-button/types';
export * from './components/snake-loading-icon/types';
export * from './components/snake-transition/types';
export * from './components/snake-empty/types';
export * from './components/snake-icon/types';
export * from './components/snake-image/types';
export * from './components/snake-lazy-image/types';
export * from './components/snake-loadmore/types';
export * from './components/snake-notice-bar/types';
export * from './components/snake-overlay/types';
export * from './components/snake-popup/types';
export * from './components/snake-sticky/types';
export * from './components/snake-swiper/types';
export * from './components/snake-tabs/types';
export * from './components/snake-button-sort/types';
export * from './components/snake-drop-menu/types';
export * from './components/snake-drop-menu-item/types';
export * from './components/snake-index-list/types';
export * from './components/snake-index-anchor/types';
export * from './components/snake-form/types';
export * from './components/snake-form-item/types';
export * from './components/snake-input/types';
export * from './components/snake-textarea/types';
export * from './components/snake-checkbox/types';
export * from './components/snake-checkbox-group/types';
export * from './components/snake-radio/types';
export * from './components/snake-radio-group/types';
export * from './components/snake-switch/types';
export * from './components/snake-slider/types';
export * from './components/snake-cms/types';
export * from './libs';
export * from './locale';

declare const SnakeUI: Plugin;
export default SnakeUI;

type SnakeComponent<Props = Record<string, unknown>, Emits extends object = {}> = DefineComponent<
    Props,
    {},
    {},
    {},
    {},
    {},
    {},
    { [Name in keyof Emits]: Emits[Name] extends unknown[] ? (...args: Emits[Name]) => void : never }
>;

export const SnakeActivityList: SnakeComponent;
export const SnakeAuxiliarySegmentation: SnakeComponent;
export const SnakeCms: SnakeComponent<SnakeCmsProps, SnakeCmsEmits>;
export const SnakeCommoditySearch: SnakeComponent;
export const SnakeCoupon: SnakeComponent;
export const SnakeCustomModule: SnakeComponent;
export const SnakeFilterSorts: SnakeComponent;
export const SnakeFollow: SnakeComponent;
export const SnakeGoodsList: SnakeComponent;
export const SnakeGraphicNavigation: SnakeComponent;
export const SnakeImages: SnakeComponent;
export const SnakeJumpApplet: SnakeComponent;
export const SnakeListSwitching: SnakeComponent;
export const SnakeMagicCube: SnakeComponent;
export const SnakeNotice: SnakeComponent;
export const SnakePagePopup: SnakeComponent;
export const SnakePictureAds: SnakeComponent;
export const SnakeRichText: SnakeComponent;
export const SnakeSuspension: SnakeComponent;
export const SnakeVideos: SnakeComponent;
export const SnakeButton: SnakeComponent<SnakeButtonProps, SnakeButtonEmits>;
export const SnakeLoadingIcon: SnakeComponent<SnakeLoadingIconProps>;
export const SnakeTransition: SnakeComponent<SnakeTransitionProps, SnakeTransitionEmits>;
export const SnakeEmpty: SnakeComponent<SnakeEmptyProps>;
export const SnakeIcon: SnakeComponent<SnakeIconProps, SnakeIconEmits>;
export const SnakeImage: SnakeComponent<SnakeImageProps, SnakeImageEmits>;
export const SnakeLazyImage: SnakeComponent<SnakeLazyImageProps, SnakeLazyImageEmits>;
export const SnakeLoadmore: SnakeComponent<SnakeLoadmoreProps, SnakeLoadmoreEmits>;
export const SnakeNoticeBar: SnakeComponent<SnakeNoticeBarProps, SnakeNoticeBarEmits>;
export const SnakeOverlay: SnakeComponent<SnakeOverlayProps, SnakeOverlayEmits>;
export const SnakePopup: SnakeComponent<SnakePopupProps, SnakePopupEmits>;
export const SnakeSticky: SnakeComponent<SnakeStickyProps, SnakeStickyEmits>;
export const SnakeSwiper: SnakeComponent<SnakeSwiperProps, SnakeSwiperEmits>;
export const SnakeTabs: SnakeComponent<SnakeTabsProps, SnakeTabsEmits>;
export const SnakeButtonSort: SnakeComponent<SnakeButtonSortProps, SnakeButtonSortEmits>;
export const SnakeDropMenu: SnakeComponent<SnakeDropMenuProps, SnakeDropMenuEmits>;
export const SnakeDropMenuItem: SnakeComponent<SnakeDropMenuItemProps, SnakeDropMenuItemEmits>;
export const SnakeIndexList: SnakeComponent<SnakeIndexListProps, SnakeIndexListEmits>;
export const SnakeIndexAnchor: SnakeComponent<SnakeIndexAnchorProps>;
export const SnakeForm: SnakeComponent<SnakeFormProps, SnakeFormEmits>;
export const SnakeFormItem: SnakeComponent<SnakeFormItemProps>;
export const SnakeInput: SnakeComponent<SnakeInputProps, SnakeInputEmits>;
export const SnakeTextarea: SnakeComponent<SnakeTextareaProps, SnakeTextareaEmits>;
export const SnakeCheckbox: SnakeComponent<SnakeCheckboxProps, SnakeCheckboxEmits>;
export const SnakeCheckboxGroup: SnakeComponent<SnakeCheckboxGroupProps, SnakeCheckboxGroupEmits>;
export const SnakeRadio: SnakeComponent<SnakeRadioProps, SnakeRadioEmits>;
export const SnakeRadioGroup: SnakeComponent<SnakeRadioGroupProps, SnakeRadioGroupEmits>;
export const SnakeSwitch: SnakeComponent<SnakeSwitchProps, SnakeSwitchEmits>;
export const SnakeSlider: SnakeComponent<SnakeSliderProps, SnakeSliderEmits>;
