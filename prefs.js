'use strict';

const {Gio, Gtk, GObject} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Currently, this is the interface for GNOME Shell version 40 and 41.
// It will likely change for the next release of GNOME Shell version 42.
//
// There are too few settings right now.
// Hence, GtkBuilder does not seem to be appropriate.
const GlasaSettingsWidget =
    GObject.registerClass(class GlasaSettingsWidget extends Gtk.ScrolledWindow {
      _init() {
        super._init({
          hscrollbar_policy : Gtk.PolicyType.NEVER,
        });

        // Retrieve the extension's settings state.
        this.settings =
            ExtensionUtils.getSettings('org.gnome.shell.extensions.glasa');

        // Main box in window for vertical alignment.
        const box = new Gtk.Box({
          orientation : Gtk.Orientation.VERTICAL,
          halign : Gtk.Align.CENTER,
          spacing : 12,
          margin_top : 36,
          margin_bottom : 36,
          margin_start : 36,
          margin_end : 36,
        });
        this.set_child(box);

        box.append(new Gtk.Label({
          label : 'Top Panel Box and Location in Box:',
        }));

        // Horizontal box for icon position in top panel.
        const hbox = new Gtk.Box({
          orientation : Gtk.Orientation.HORIZONTAL,
          halign : Gtk.Align.CENTER,
          spacing : 12,
          margin_top : 12,
          margin_bottom : 12,
          margin_start : 36,
          margin_end : 36,
        });
        box.append(hbox);

        // Create group of toggle buttons to set the panel box.
        let left_button = new Gtk.ToggleButton({label : 'Left'});
        let center_button = new Gtk.ToggleButton({label : 'Center'});
        center_button.set_group(left_button);
        let right_button = new Gtk.ToggleButton({label : 'Right'});
        right_button.set_group(left_button);

        // Set the initial state of the toggle button group.
        const init_panel_box = this.settings.get_int('panel-box');
        if (init_panel_box == 0)
          left_button.set_active(true);
        else if (init_panel_box == 1)
          center_button.set_active(true);
        else if (init_panel_box == 2)
          right_button.set_active(true);

        // Make toggle button update settings state.
        left_button.connect('toggled',
                            () => { this.settings.set_int('panel-box', 0); });
        center_button.connect('toggled',
                              () => { this.settings.set_int('panel-box', 1); });
        right_button.connect('toggled',
                             () => { this.settings.set_int('panel-box', 2); });

        // Add the button to the GUI.
        hbox.append(left_button);
        hbox.append(center_button);
        hbox.append(right_button);

        // Inside each panel box, the order of indicators should be provided.
        // Use a spin button with the corresponding initial value.
        const init_panel_box_location =
            this.settings.get_int('panel-box-location');
        let number_button = new Gtk.SpinButton();
        number_button.set_adjustment(new Gtk.Adjustment({
          lower : 0,
          upper : 100,
          value : init_panel_box_location,
          step_increment : 1,
          page_increment : 1,
          page_size : 0,
        }));
        // Let the spin button update the settings state.
        number_button.connect('value-changed', () => {
          this.settings.set_int('panel-box-location',
                                number_button.get_adjustment().value);
        });
        // Add it to the GUI.
        hbox.append(number_button);
      }
    });

function init() {}

function buildPrefsWidget() { return new GlasaSettingsWidget(); }
