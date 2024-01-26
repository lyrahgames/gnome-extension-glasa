'use strict';

import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {
  ExtensionPreferences,
  gettext as _
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GlasaExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window.set_size_request(600, 300);
    window.set_default_size(800, 460);

    const settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title : _('General'),
      icon_name : 'dialog-information-symbolic',
    });
    window.add(page);

    page.add(this._new_appearance_group(settings));
    page.add(this._new_popup_menu_group(settings));
  }

  _new_appearance_group(settings) {
    const group = new Adw.PreferencesGroup({
      title : _('Appearance'),
      description :
          _('Configure the appearance and rendering of the indicator\'s icon'),
    });

    group.add(this._new_position_row(settings));
    group.add(this._new_depth_row(settings));
    group.add(this._new_blinking_row(settings));

    return group;
  }

  _new_popup_menu_group(settings) {
    const group = new Adw.PreferencesGroup({
      title : _('Popup Menu'),
      description : _('Configure the popup menu'),
    });

    group.add(this._new_message_row(settings));

    return group;
  }

  // Row for Positioning in Top Panel
  //
  _new_position_row(settings) {
    const row = new Adw.ActionRow({
      title : _('Top Panel Location'),
      subtitle : _('Alignment and Order'),
    });

    // Create a group of three buttons to
    // set the indicator's main alignment in the top panel.
    // Make sure to set the vertical alignment of buttons.
    // Otherwise, the buttons will get stretched vertically.
    //
    const left_button =
        new Gtk.ToggleButton({label : _('Left'), valign : Gtk.Align.CENTER});
    const center_button =
        new Gtk.ToggleButton({label : _('Center'), valign : Gtk.Align.CENTER});
    const right_button =
        new Gtk.ToggleButton({label : _('Right'), valign : Gtk.Align.CENTER});
    center_button.set_group(left_button);
    right_button.set_group(left_button);

    // Set the initial state of the toggle button group.
    //
    const init_panel_box = settings.get_int('panel-alignment');
    if (init_panel_box == 0)
      left_button.set_active(true);
    else if (init_panel_box == 1)
      center_button.set_active(true);
    else if (init_panel_box == 2)
      right_button.set_active(true);

    // Make toggle buttons update the settings state.
    //
    left_button.connect('toggled', //
                        () => { settings.set_int('panel-alignment', 0); });
    center_button.connect('toggled',
                          () => { settings.set_int('panel-alignment', 1); });
    right_button.connect('toggled',
                         () => { settings.set_int('panel-alignment', 2); });

    // Add the toggle buttons to the action row.
    //
    row.add_suffix(left_button);
    row.add_suffix(center_button);
    row.add_suffix(right_button);

    // Inside each panel box, the order of indicators should be provided.
    // Use a spin button with the corresponding initial value.
    //
    const init_panel_box_location = settings.get_int('panel-priority');
    const number_button = new Gtk.SpinButton({valign : Gtk.Align.CENTER});
    number_button.set_adjustment(new Gtk.Adjustment({
      lower : -100,
      upper : 100,
      value : init_panel_box_location,
      step_increment : 1,
      page_increment : 1,
      page_size : 0,
    }));

    // Let the spin button update the settings state.
    //
    number_button.connect('value-changed', () => {
      settings.set_int('panel-priority', number_button.get_adjustment().value);
    });

    // Add it to the GUI.
    //
    row.add_suffix(number_button);

    return row;
  }

  // Row for Custom Message in the Popup Menu
  //
  _new_message_row(settings) {
    const row = new Adw.EntryRow({
      title : _('Popup Menu Message'),
      show_apply_button : true,
      text : settings.get_string('popup-menu-message'),
    });

    row.connect('apply',
                () => { settings.set_string('popup-menu-message', row.text); });

    // Toggle to enable or disable popup menu message
    //
    const toggle = new Gtk.Switch({
      valign : Gtk.Align.CENTER,
      active : settings.get_boolean('popup-menu-show-message'),
    });
    row.add_suffix(toggle);
    settings.bind('popup-menu-show-message', toggle, 'active',
                  Gio.SettingsBindFlags.DEFAULT);

    return row;
  }

  // Row for Eye Depth
  //
  _new_depth_row(settings) {
    const row = new Adw.SpinRow({
      title : _('Virtual Eye Depth'),
      subtitle : _('Smaller values enhance the cross-eye effect'),
    });

    row.set_adjustment(new Gtk.Adjustment({
      lower : 1,
      upper : 20,
      value : settings.get_double('eye-depth'),
      step_increment : 1,
      page_increment : 1,
      page_size : 0,
    }));

    settings.bind('eye-depth', row, 'value', Gio.SettingsBindFlags.DEFAULT);

    return row;
  }

  // Row for Eye Blinking
  //
  _new_blinking_row(settings) {
    const row = new Adw.SwitchRow({
      title : _('Blinking'),
      subtitle : _('Switch on or off the eye blinking animation'),
      active : settings.get_boolean('eye-blinking'),
    });

    settings.bind('eye-blinking', row, 'active', Gio.SettingsBindFlags.DEFAULT);

    return row;
  }
}
