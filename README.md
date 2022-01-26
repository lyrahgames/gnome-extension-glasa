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

Press `Alt+F2` and type `r` to restart the Gnome shell.
Afterwards enable the extension.

    make enable

You should now be able to see the eyes icon appear in the panel.
Otherwise, restart the Gnome shell again by pressing `Alt+F2` and typing `r`.

To delete the extension, disable it and delete it.

    make disable
    make clean

## Distribution of ZIP File

The following command will create a compressed ZIP file for distribution on GNOME shell extensions web page.

    make dist
