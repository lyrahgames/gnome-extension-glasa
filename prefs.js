'use strict';

const { Adw, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

// Currently, the GUI is simple enough to not use the builder.
function fillPreferencesWindow(window) {
  const settings = ExtensionUtils.getSettings();

  window.set_size_request(600, 200);
  window.set_default_size(800, 250);

  const page = new Adw.PreferencesPage();
  window.add(page);

  const group = new Adw.PreferencesGroup({ title: 'General' });
  page.add(group);

  // Create group of toggle buttons to set the panel box.
  // Make sure to set the vertical alignment.
  // So, the buttons will not get stretched vertically.
  const positionRow = new Adw.ActionRow({
    title: 'Top Panel Location',
    subtitle: 'Box and Order',
  });
  group.add(positionRow);

  const left_button =
    new Gtk.ToggleButton({ label: 'Left', valign: Gtk.Align.CENTER });
  const center_button =
    new Gtk.ToggleButton({ label: 'Center', valign: Gtk.Align.CENTER });
  const right_button =
    new Gtk.ToggleButton({ label: 'Right', valign: Gtk.Align.CENTER });
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
  left_button.connect('toggled', () => {
    settings.set_int('panel-box', 0);
  });
  center_button.connect('toggled', () => {
    settings.set_int('panel-box', 1);
  });
  right_button.connect('toggled', () => {
    settings.set_int('panel-box', 2);
  });

  // Add the toggle buttons to the action row.
  positionRow.add_suffix(left_button);
  positionRow.add_suffix(center_button);
  positionRow.add_suffix(right_button);

  // Inside each panel box, the order of indicators should be provided.
  // Use a spin button with the corresponding initial value.
  const init_panel_box_location = settings.get_int('panel-box-location');
  const number_button = new Gtk.SpinButton({ valign: Gtk.Align.CENTER });
  number_button.set_adjustment(new Gtk.Adjustment({
    lower: -100,
    upper: 100,
    value: init_panel_box_location,
    step_increment: 1,
    page_increment: 1,
    page_size: 0,
  }));

  // Let the spin button update the settings state.
  number_button.connect('value-changed', () => {
    settings.set_int(
      'panel-box-location', number_button.get_adjustment().value);
  });

  // Add it to the GUI.
  positionRow.add_suffix(number_button);

  // Create an option for a custom message in the eye menu.
  const messageRow = new Adw.ActionRow({
    title: 'Menu Message',
    subtitle: 'Confirm with Enter'
  });

  group.add(messageRow);

  // Create a text box where the user can enter the message
  const panel_message = new Gtk.EntryBuffer({
    text: settings.get_string('panel-message')
  });
  const panel_message_box = new Gtk.Entry({
    buffer: panel_message,
    hexpand: true,
    valign:Gtk.Align.CENTER
  })
  // Make pressing Enter in the box update the message in settings
  panel_message_box.connect('activate', () => {
    settings.set_string('panel-message', panel_message.text);
  });
  // Add the box to the row
  messageRow.add_suffix(panel_message_box);
}
