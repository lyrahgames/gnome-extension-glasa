'use strict';

const { Gio, Gtk, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const GlasaSettingsWidget =
  GObject.registerClass(class GlasaSettingsWidget extends Gtk.ScrolledWindow {
    _init() {
      super._init({
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        // max_content_height: 200,
        // min_content_height: 100,
        // max_content_width: 200,
        // min_content_width: 200,
      });
      // super.set_default_size(300, 200);

      this.settings =
        ExtensionUtils.getSettings('org.gnome.shell.extensions.glasa');

      const box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        halign: Gtk.Align.CENTER,
        spacing: 12,
        margin_top: 36,
        margin_bottom: 36,
        margin_start: 36,
        margin_end: 36,
      });
      this.set_child(box);

      box.append(new Gtk.Label({
        label: 'Top Panel Box and Location in Box:',
      }));

      const hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        halign: Gtk.Align.CENTER,
        spacing: 12,
        margin_top: 12,
        margin_bottom: 12,
        margin_start: 36,
        margin_end: 36,
      });
      box.append(hbox);

      let init_panel_box = this.settings.get_int('panel-box');
      let init_panel_box_location =
        this.settings.get_int('panel-box-location');

      let left_button = new Gtk.ToggleButton({
        label: 'Left',
      });
      if (init_panel_box == 0) left_button.set_active(true);

      let center_button = new Gtk.ToggleButton({
        label: 'Center',
      });
      center_button.set_group(left_button);
      if (init_panel_box == 1) center_button.set_active(true);

      let right_button = new Gtk.ToggleButton({
        label: 'Right',
      });
      right_button.set_group(left_button);
      if (init_panel_box == 2) right_button.set_active(true);

      hbox.append(left_button);
      hbox.append(center_button);
      hbox.append(right_button);

      left_button.connect('toggled', () => {
        this.settings.set_int('panel-box', 0);
      });

      center_button.connect('toggled', () => {
        this.settings.set_int('panel-box', 1);
      });

      right_button.connect('toggled', () => {
        this.settings.set_int('panel-box', 2);
      });

      let number_button = new Gtk.SpinButton();
      number_button.set_adjustment(new Gtk.Adjustment({
        lower: 0,
        upper: 100,
        value: init_panel_box_location,
        step_increment: 1,
        page_increment: 1,
        page_size: 0,
      }));
      hbox.append(number_button);
      number_button.connect('value-changed', () => {
        this.settings.set_int(
          'panel-box-location', number_button.get_adjustment().value);
      });
    }
  });

function init() {}

function buildPrefsWidget() {
  return new GlasaSettingsWidget();
}