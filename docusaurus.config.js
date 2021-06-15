module.exports = {
	title: 'Docs',
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
			title: 'Docs',
			logo: {
				alt: 'WeNet logo',
				src: 'img/logo.jpg',
			},
			items: [
				{
					doc: 'pilot',
					to: 'docs/platform/intro',
					activeBasePath: 'docs/platform',
					label: 'The Platform',
					position: 'left',
				},
				{
					doc: 'tech',
					to: 'docs/tech/conversation/models',
					activeBasePath: 'docs/tech',
					label: 'Developer',
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
					showLastUpdateAuthor: false,
					showLastUpdateTime: true,
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
