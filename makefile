EXTENSION_NAME = glasa
EXTENSION_UUID = $(EXTENSION_NAME)@lyrahgames.github.io
PACK_NAME = $(EXTENSION_UUID).shell-extension.zip

.phony: install uninstall enable disable pack prefs test update-pot

install: pack
	gnome-extensions install --force $(PACK_NAME)

uninstall:
	gnome-extensions uninstall $(EXTENSION_UUID)

enable:
	gnome-extensions enable $(EXTENSION_UUID)

disable:
	gnome-extensions disable $(EXTENSION_UUID)

pack:
	gnome-extensions pack --podir=po --force

prefs:
	gnome-extensions prefs $(EXTENSION_UUID)

test: install enable
	env SHELL_DEBUG=backtrace-warnings \
		G_MESSAGES_DEBUG='GNOME Shell' \
		dbus-run-session -- gnome-shell --nested --wayland

update-pot:
	xgettext --from-code=UTF-8 --output=po/$(EXTENSION_UUID).pot *.js
