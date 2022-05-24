[GitHub](https://github.com/DistributedCollective) | [Wiki](https://wiki.sovryn.app/en/home) | [Forum](https://forum.sovryn.app/) | [Blog](https://www.sovryn.app/blog/) | [LinkedIn](https://www.linkedin.com/company/sovryn/about/) | [Twitter](https://twitter.com/SovrynBTC)

# Sovryn DApp

---

## Browsers support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /><br/>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /><br/>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Opera | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Brave |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| last 10 versions                                                                                                                                       | last 10 versions                                                                                                                                              | last 10 versions                                                                                                                                          | last 6 versions                                                                                                                                           | last 6 versions                                                                                                                                                           | last 10 versions                                                                                                                                      | last 10 versions                                                                                                                                      |

## Install & Start

### Prerequisites

- Make a fork of this repository and clone it to your machine.

- Make sure you use at least version 12 of Node.js.

  - To install Node.JS as a Windows user, download the required installation from the [Node.js](https://nodejs.org/en/download/) website.
  - To install Node.JS as a Linux or macOS user:
    - `sudo dnf module install nodejs:12`
  - To reset the older Node.JS installation so that you can upgrade to version 12:

    - `sudo dnf module reset nodejs`

    NOTE: Alternatively, You can use the NVM tool that is easy to use and allows you to switch between the installed node versions. For more information, see the [NVM](https://github.com/nvm-sh/nvm) guide.

### Procedure

1. Navigate to your cloned repository and install the `yarn` tool:

   ```shell
   yarn install
   ```

   Yarn dependecies packages will be downloaded.

2. Start DApp server:

- For development testnet:

  ```shell
  yarn start
  ```

- For development mainnet:

  ```shell
  yarn start:mainnet
  ```

- For a production build:
  ```shell
  yarn build
  ```

## Contributing

<a href="https://github.com/DistributedCollective/Sovryn-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/Sovryn-frontend" />
</a>

### Guides

Please read our docs page for step by step guides on how to add new tokens, amm pools and etc:

- [Guides & Tutorials](./docs/README.md)
- [Running on Apple with M1 chip](https://gist.github.com/LeZuse/bf838718ff2689c5fc035c5a6825a11c)

### Bug Reports

To foster active collaboration, Sovryn strongly encourages the creation of pull requests rather than just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Use one of the following channels instead:

- [Discord](https://discord.gg/J22WS6z)
- [Wiki Pages](https://wiki.sovryn.app)
- [Sovryn Forum](https://forum.sovryn.app)
- [Sovryn Blog](https://sovryn.app/blog/)

### Core Development Discussion

You may propose new features or improvements of existing DApp behavior using the _Sovryn Ideas_ issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.

Informal discussion regarding bugs, new features, and implementation of existing features takes place in the #sorcery channel of the Sovryn Discord server.

### Which Branch?

The `development` branch acts as a testnet containing the latest changes. The `master` branch is production branch for the **live.sovryn.app**. Depending on your feature you are contributing with, select the proper branch as a starting point. Most of the time, it will be the `development` branch unless you provide hotfixes or features that should be released before other features - then it can be `master`. By doing so, we merge all features to `development` and then `development` to `master` to make one big release batch.

**All** bug fixes should be sent to the latest stable `master` branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the `development` branch, which contains the upcoming release.

Ask in the #sorcery channel of the Sovryn Discord server when unsure if the feature qualifies as major or minor.

### Working With UI

All UI designs used for this repository should be available publically in [Google Drive folder as Adobe XD files](https://drive.google.com/drive/folders/1e_VljWpANJe0o4VmIkKU5Ewo56l9iMaM?usp=sharing)

### Storybook

We use Storybook to provide API style docs and examples for our UI components. Any new components should have stories added to them that include all available properties that can be passed in, and some specific examples for major common variations. For specific implementation examples, you can search the codebase for files named `index.stories.tsx`.

To test components via Storybook on your local machine:

- run `yarn install` on your working branch
- run `yarn storybook` to load the development server
- access Storybook dev server on `localhost:6006`
- if the docs fail to load and you see an error `cannot read properties of undefined (reading 'storyStore')`, the package installation is likely broken and you will need to clear `node_modules` folder and follow first two steps again
- changes can now be made to `index.stories.tsx` files and the development server will hot-reload automatically

To test components on a deployed PR link, simply append `/storybook` to the end of the deployed URL.

## Security Vulnerabilities

If you discover a security vulnerability within DApp, please submit your bug report to [Immunefi](https://immunefi.com/bounty/sovryn/) (there are bounty rewards). All security vulnerabilities will be promptly addressed.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licence

The Sovryn DApp is open-sourced software licensed under the [MIT license](LICENSE).
