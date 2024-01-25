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
    const settings = this.getSettings();

    window.set_size_request(600, 300);
    window.set_default_size(800, 450);

    const page = new Adw.PreferencesPage();
    window.add(page);

    const group = new Adw.PreferencesGroup({title : 'General'});
    page.add(group);

    // Create group of toggle buttons to set the panel box.
    // Make sure to set the vertical alignment.
    // So, the buttons will not get stretched vertically.
    const positionRow = new Adw.ActionRow({
      title : 'Top Panel Location',
      subtitle : 'Box and Order',
    });
    group.add(positionRow);

    const left_button =
        new Gtk.ToggleButton({label : 'Left', valign : Gtk.Align.CENTER});
    const center_button =
        new Gtk.ToggleButton({label : 'Center', valign : Gtk.Align.CENTER});
    const right_button =
        new Gtk.ToggleButton({label : 'Right', valign : Gtk.Align.CENTER});
    center_button.set_group(left_button);
    right_button.set_group(left_button);

    // Set the initial state of the toggle button group.
    const init_panel_box = settings.get_int('panel-box');
    if (init_panel_box == 0)
      left_button.set_active(true);
    else if (init_panel_box == 1)
      center_button.set_active(true);
    else if (init_panel_box == 2)
      right_button.set_active(true);

    // Make toggle buttons update the settings state.
    left_button.connect('toggled', () => { settings.set_int('panel-box', 0); });
    center_button.connect('toggled',
                          () => { settings.set_int('panel-box', 1); });
    right_button.connect('toggled',
                         () => { settings.set_int('panel-box', 2); });

    // Add the toggle buttons to the action row.
    positionRow.add_suffix(left_button);
    positionRow.add_suffix(center_button);
    positionRow.add_suffix(right_button);

    // Inside each panel box, the order of indicators should be provided.
    // Use a spin button with the corresponding initial value.
    const init_panel_box_location = settings.get_int('panel-box-location');
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
    number_button.connect('value-changed', () => {
      settings.set_int('panel-box-location',
                       number_button.get_adjustment().value);
    });

    // Add it to the GUI.
    positionRow.add_suffix(number_button);

    // Create an option for a custom message in the eye menu.
    const messageRow = new Adw.ActionRow(
        {title : 'Menu Message', subtitle : 'Confirm with Enter'});

    group.add(messageRow);

    // Create a text box where the user can enter the message
    const panel_message =
        new Gtk.EntryBuffer({text : settings.get_string('panel-message')});
    const panel_message_box = new Gtk.Entry(
        {buffer : panel_message, hexpand : true, valign : Gtk.Align.CENTER})
    // Make pressing Enter in the box update the message in settings
    panel_message_box.connect(
        'activate',
        () => { settings.set_string('panel-message', panel_message.text); });
    // Add the box to the row
    messageRow.add_suffix(panel_message_box);

    //
    //
    const render_group = new Adw.PreferencesGroup({title : 'Appearance'});
    page.add(render_group);

    //
    //
    const render_depth_row = new Adw.SpinRow({
      title : 'Virtual Eye Depth',
      subtitle : 'Smaller values enhance crossed eyes',
    });
    render_depth_row.set_adjustment(new Gtk.Adjustment({
      lower : 1,
      upper : 20,
      value : 3,
      step_increment : 1,
      page_increment : 5,
      page_size : 0,
    }));
    settings.bind('render-depth', render_depth_row, 'value',
                  Gio.SettingsBindFlags.DEFAULT);
    // render_depth_row.connect('value-changed', () => {
    //   settings.set_double('render-depth',
    //                       render_depth_row.get_adjustment().value);
    // });
    render_group.add(render_depth_row);

    //
    //
    const render_blinking_row = new Adw.SwitchRow({
      title : _('Toggle Eye Blinking'),
      subtitle : _('Switch on or off the eye blinking animation'),
      active : settings.get_boolean('render-blinking'),
    });
    // render_blinking_row.active = settings.get_boolean('render-blinking');
    settings.bind('render-blinking', render_blinking_row, 'active',
                  Gio.SettingsBindFlags.DEFAULT);
    render_group.add(render_blinking_row);
  }
}
