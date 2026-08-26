import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import ComponentOverview from '../components/ComponentOverview.vue';
import ThemeGenerate from '../components/ThemeGenerate.vue';
import HomePage from '../components/HomePage.vue';
import IconGallery from '../components/IconGallery.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('ComponentOverview', ComponentOverview);
        app.component('ThemeGenerate', ThemeGenerate);
        app.component('HomePage', HomePage);
        app.component('IconGallery', IconGallery);
    }
};
