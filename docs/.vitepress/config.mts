import { defineConfig } from 'vitepress'
import { getPosts, getPostLength } from './theme/serverUtils'

export default defineConfig({
  title: '微光北下',
  description: 'Home of 微光北下',
  themeConfig: {
    logo: '/horse.svg',
    posts: await getPosts(),
    avator: '/avator.png',
    pageSize: 5,
    postLength: await getPostLength(),
    search: {
      provider: 'local'
    },
    nav: [
      { text: '🏡Blogs', link: '/' },
      { text: '🔖Tags', link: '/tags' },
      { text: '📃Archives', link: '/archives' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/wgbx' }]
  }
})
