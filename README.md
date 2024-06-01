<h1 align="center">
    GNOME Extension: Glasa
</h1>
<p align="center">
    This extension puts an icon in the top panel consisting of two comic-like eyes following the cursor.
    It is meant as a present and not to be confused with a fully robust GNOME extension.
    Have fun with it.
</p>
<p align="center">
    <img alt="" src="https://img.shields.io/github/languages/top/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <img alt="" src="https://img.shields.io/github/languages/code-size/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <img alt="" src="https://img.shields.io/github/repo-size/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <img alt="" src="https://img.shields.io/github/license/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge&color=blue">
    <img alt="GNOME Downloads" src="https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fextensions.gnome.org%2Fextension%2F4780%2Fglasa%2F&query=%2Fhtml%2Fbody%2Fdiv%5B2%5D%2Fdiv%2Fdiv%5B2%5D%2Fdiv%5B1%5D%2Fspan%5B3%5D&label=GNOME%20extensions&cacheSeconds=86400&style=for-the-badge">
</p>
<p align="center">
    <img alt="" src="docs/images/screenshot.png" align="center">
</p>

## Getting Started

[<img alt="EGO page" height="100" src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true">](https://extensions.gnome.org/extension/4780/glasa/)

## Manual Installation and Development Usage

Clone the repository.

    git clone https://github.com/lyrahgames/gnome-extension-glasa.git

Change into the directory and run the makefile.

    cd gnome-extension-glasa
    make

On X11, press `Alt+F2` and type `r` to restart the GNOME shell.
On Wayland, log out and in again.
Afterwards enable the extension.

    make enable

Download npm packages to enable linting and code formatting.

    npm install

You should now be able to see the eyes icon appear in the panel.
Otherwise, restart the GNOME shell again by pressing `Alt+F2` and typing `r`.

You can disable the extension as follows.

    make disable

For uninstalling, run the following command.

    make uninstall

Show the preferences window for the extension.

    make prefs

On Wayland, you can test the extension on a virtual desktop.

    make test

The following command will create a compressed ZIP file for the distribution on GNOME extensions' website.

    make pack

## Notes

- This repository started with the source code from [eye by azathoth](https://extensions.gnome.org/extension/213/eye/).
- A non-comic and more advanced alternative is given by [Eye and Mouse Extended on GitHub](https://github.com/alexeylovchikov/eye-extended-shell-extension) and [Eye and Mouse Extended on GNOME Extension Hub](https://extensions.gnome.org/extension/3139/eye-extended/).

## Contact and Contributing

If you have any questions or comments regarding `glasa`, please don't hesitate to reach out at <lyrahgames@mailbox.org>.
If you come across any bugs, encounter issues, or miss some neat features, please make use of the GitHub issue tracking page or send a pull request.

When contributing with a pull request, please make yourself familiar with [GJS][gjs] and [GNOME Shell Extensions][gnome-extensions].
Follow the [GNOME Shell Extensions Review Guidelines][gnome-extensions-review-guidelines] and also have a look at the commented source code to follow the style seen there.

## Copyright and License

The copyright for the code is held by the contributors of the code.
The revision history in the version control system is the primary source of authorship information for copyright purposes.
Please see individual source files for appropriate copyright notices.

`glasa` is free software, distributed under the terms of the GNU General
Public License as published by the Free Software Foundation,
version 3 of the License (or any later version). For more information,
see the [GNU General Public License][GPLv3] or the file [`COPYING.md`](COPYING.md).

`glasa` is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

Copying and distribution of this file, with or without modification, are permitted in any medium without royalty provided the copyright notice and this notice are preserved.
This file is offered as-is, without any warranty.

## References and Other Resources

- [GJS Guide][gjs]
- [GNOME Shell Extensions][gnome-extensions]
- [GNOME Shell Extensions Review Guidelines][gnome-extensions-review-guidelines]

[GPLv3]: https://www.gnu.org/licenses/gpl-3.0.html#license-text 'GNU General Public License v3'
[gjs]: https://gjs.guide/ 'GJS | A Guide to JavaScript for GNOME'
[gnome-extensions]: https://gjs.guide/extensions/ 'GNOME Shell Extensions'
[gnome-extensions-review-guidelines]: https://gjs.guide/extensions/review-guidelines/review-guidelines.html 'GNOME Shell Extensions Review Guidelines'
