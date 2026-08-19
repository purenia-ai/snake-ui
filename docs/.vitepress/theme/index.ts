import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ThemeGenerate from '../components/ThemeGenerate.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ThemeGenerate', ThemeGenerate)
  },
}