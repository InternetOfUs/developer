module.exports = {
  title: 'Developer',
  tagline: 'The tagline of my site',
  url: 'https://InternetOfUs.github.io',
  baseUrl: '/developer/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'InternetOfUs',
  projectName: 'developer', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Developer',
      logo: {
        alt: 'WeNet logo',
        src: 'img/logo.jpg',
      },
      items: [
        {
          to: 'docs/conversation/models',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/InternetOfUs/developer',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      // copyright: `Copyright © ${new Date().getFullYear()} WeNet. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
