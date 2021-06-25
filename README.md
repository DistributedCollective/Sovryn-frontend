# Sovryn DApp

---

## Install & Start

Make sure you use at least version 10 of Node.js.

Install packages:

```shell
yarn
```

If you are using a Windows machine then you may receive errors when running this command, related to shell scripts in `/bin` not including the `.sh` file extension. To avoid this please run `yarn --ignore-scripts` instead, and execute the `gh-pack` script manually as needed.

Start DApp for development:

```shell
yarn start
```

Build for production:

```shell
yarn build
```

The DApp includes a private repository as a dependency, for this reason you may need to create private access token for your account here https://github.com/settings/tokens.
You will need to choose `repo` scope for the token.
Export token `export CI_USER_TOKEN='ghp_xxxxx'` and run `./bin/gh-pack` to apply it.
Note: this step is only required if yarn install fails for you because of missing access to charting-library repository.
If yarn install fails after these steps please ask for read access to the charting-library repository.

## Contributing

<a href="https://github.com/DistributedCollective/Sovryn-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/Sovryn-frontend" />
</a>

### Bug Reports

To foster active collaboration, Sovryn strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Instead, use one of the following channels:

- [Discord](https://discord.gg/J22WS6z)
- [Wiki Pages](https://wiki.sovryn.app)
- [Sovryn Forum](https://forum.sovryn.app)
- [Sovryn Blog](https://sovryn.app/blog/)

### Core Development Discussion

You may propose new features or improvements of existing DApp behavior in the Sovryn Ideas issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.

Informal discussion regarding bugs, new features, and implementation of existing features takes place in the #sorcery channel of the Sovryn Discord server.

### Which Branch?

**All** bug fixes should be sent to the latest stable (master) branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the development branch, which contains the upcoming release.

If you are unsure if your feature qualifies as a major or minor, please ask Victor Creed in the #sorcery channel of the Sovryn Discord server.

### Working With UI

All UI designs used for this repository should be available publically in [Google Drive folder as Adobe XD files](https://drive.google.com/drive/folders/1e_VljWpANJe0o4VmIkKU5Ewo56l9iMaM?usp=sharing)

## Security Vulnerabilities

If you discover a security vulnerability within DApp, please send an e-mail to Victor Creed via creed-victor@protonmail.com. All security vulnerabilities will be promptly addressed.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licence

The Sovryn DApp is open-sourced software licensed under the [MIT license](LICENSE).
