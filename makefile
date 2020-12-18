GNOME_EXTENSIONS_DIR = ~/.local/share/gnome-shell/extensions
EXTENSION_UUID = example@lyrahgames.github.io
EXTENSION = extension.js
METADATA = metadata.json

EXTENSION_DIR = $(GNOME_EXTENSIONS_DIR)/$(EXTENSION_UUID)

.phony: install enable disable clean

install: $(EXTENSION_DIR)/$(METADATA) $(EXTENSION_DIR)/$(EXTENSION)

$(EXTENSION_DIR):
	mkdir -p $@

$(EXTENSION_DIR)/$(EXTENSION): $(EXTENSION_DIR) $(EXTENSION)
	cp $(EXTENSION) $@

$(EXTENSION_DIR)/$(METADATA): $(EXTENSION_DIR) $(METADATA)
	cp $(METADATA) $@

enable: install
	gnome-extensions enable $(EXTENSION_UUID)

disable:
	gnome-extensions disable $(EXTENSION_UUID)

clean:
	rm -rf $(EXTENSION_DIR)