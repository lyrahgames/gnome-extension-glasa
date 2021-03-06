GNOME_EXTENSIONS_DIR = ~/.local/share/gnome-shell/extensions
EXTENSION_UUID = glasa@lyrahgames.github.io
EXTENSION = extension.js
METADATA = metadata.json
STYLESHEET = stylesheet.css

EXTENSION_DIR = $(GNOME_EXTENSIONS_DIR)/$(EXTENSION_UUID)

.phony: install enable disable clean

install: $(EXTENSION_DIR)/$(METADATA) $(EXTENSION_DIR)/$(EXTENSION) $(EXTENSION_DIR)/$(STYLESHEET)

$(EXTENSION_DIR):
	mkdir -p $@

$(EXTENSION_DIR)/$(EXTENSION): $(EXTENSION_DIR) $(EXTENSION)
	cp $(EXTENSION) $@

$(EXTENSION_DIR)/$(METADATA): $(EXTENSION_DIR) $(METADATA)
	cp $(METADATA) $@

$(EXTENSION_DIR)/$(STYLESHEET): $(EXTENSION_DIR) $(STYLESHEET)
	cp $(STYLESHEET) $@

enable: install
	gnome-extensions enable $(EXTENSION_UUID)

disable:
	gnome-extensions disable $(EXTENSION_UUID)

clean:
	rm -rf $(EXTENSION_DIR)