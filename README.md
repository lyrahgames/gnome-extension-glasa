<h1 align="center">
    Gnome Extension: Glasa
</h1>
<p align="center">
    This extension puts an icon in the panel consisting of two comic-like eyes following the cursor.
    It is meant as a present and not to be confused with a fully robust Gnome extension.
    Have fun with it.
</p>
<p align="center">
    <img src="https://img.shields.io/github/languages/top/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/languages/code-size/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/repo-size/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge">
    <a href="COPYING">
        <img src="https://img.shields.io/github/license/lyrahgames/gnome-extension-glasa.svg?style=for-the-badge&color=blue">
    </a>
    <a href="https://extensions.gnome.org/extension/4780/glasa/">
        <img src="https://img.shields.io/website/https/extensions.gnome.org/extension/4780/glasa.svg?down_message=offline&label=extensions.gnome.org&style=for-the-badge&up_color=blue&up_message=online">
    </a>
</p>
<p align="center">
    <img src="docs/images/screenshot.png" align="center">
</p>

## Author

- lyrahgames (lyrahgames@mailbox.org)

## Usage

Clone the repository.

    git clone https://github.com/lyrahgames/gnome-extension-glasa.git

Change into the directory and run the makefile.

    cd gnome-extension-glasa
    make

Press `Alt+F2` and type `r` to restart the Gnome shell if you are running on X11.
In the case you are running on Wayland log out and in again.
Afterwards enable the extension.

    make enable

You should now be able to see the eyes icon appear in the panel.
Otherwise, restart the Gnome shell again by pressing `Alt+F2` and typing `r`.

You can disable the extension as follows.

    make disable

For uninstalling, run the following command.

    make uninstall

Show the preferences window for the extension.

    make prefs

## Distribution of ZIP File

The following command will create a compressed ZIP file for distribution on GNOME shell extensions web page.

    make pack

## Notes

- This repository is based on the soure code from [eye by azathoth](https://extensions.gnome.org/extension/213/eye/).
- A non-comic and more advanced alternative is given by [Eye and Mouse Extended on GitHub](https://github.com/alexeylovchikov/eye-extended-shell-extension) and [Eye and Mouse Extended on GNOME Extension Hub](https://extensions.gnome.org/extension/3139/eye-extended/).

## References

- [GJS Guide](https://gjs.guide/)
- [Port Extensions to GNOME Shell 40](https://gjs.guide/extensions/upgrading/gnome-shell-40.html)
- [Port Extensions to GNOME Shell 42](https://gjs.guide/extensions/upgrading/gnome-shell-42.html#metadata-json)
