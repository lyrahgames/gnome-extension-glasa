const Mainloop = imports.mainloop

const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const { Clutter, Gtk, GLib, GObject, Gio, St } = imports.gi;
const Cairo = imports.cairo

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

class Extension {
  constructor() {
    this._indicator = null;
  }

  enable() {
    // log(`enabling ${Me.metadata.name}`);

    let indicatorName = `${Me.metadata.name} Indicator`;
    this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

    let size = Panel.PANEL_ICON_SIZE;
    let icon = new St.DrawingArea({ width: 3 * size, height: size });
    icon._repaint_handler = icon.connect('repaint', () => {
      let halfsize = icon.height / 2;
      let halfwidth = icon.width / 2;
      let [area_x, area_y] = icon.get_transformed_position();
      let [mouse_x, mouse_y, mask] = global.get_pointer();

      const EYE_LINE_WIDTH = 1.5;
      const RELIEF_FACTOR = 30;
      const RELIEF_FACTOR_BOUND = 0.7;
      const IRIS_MOVE = 0.66;
      const IRIS_SIZE = 0.5;
      const EYEBROW_SCALE = 1.4;

      let eye_radius = 2 * halfsize / (1 + EYEBROW_SCALE);
      let eyebrow_radius = EYEBROW_SCALE * eye_radius;
      eye_radius -= EYE_LINE_WIDTH / 2;
      eyebrow_radius -= EYE_LINE_WIDTH / 2;
      let center_y = halfsize * (EYEBROW_SCALE + 1) / 2;
      // let left_center_x = 2 * halfsize - eye_radius;
      // let right_center_x = 2 * halfsize + eye_radius;
      let left_center_x = halfwidth - eye_radius;
      let right_center_x = halfwidth + eye_radius;

      mouse_x -= area_x + 2 * halfsize;
      mouse_y -= area_y + center_y;

      let factor = Math.sqrt(mouse_x * mouse_x + mouse_y * mouse_y) /
        (RELIEF_FACTOR * eye_radius);
      if (factor > RELIEF_FACTOR_BOUND) factor = RELIEF_FACTOR_BOUND;
      let iris_move = eye_radius * IRIS_MOVE * factor;

      // Get and set up the Cairo context.
      let cr = icon.get_context();
      let theme_node = icon.get_theme_node();
      Clutter.cairo_set_source_color(cr, theme_node.get_foreground_color());

      cr.setLineWidth(EYE_LINE_WIDTH);
      cr.save();

      // Draw the left eye.
      cr.translate(left_center_x, center_y);
      cr.arc(0, 0, eye_radius, 0, 2 * Math.PI);
      cr.stroke();
      // Draw the left eyebrow.
      cr.arc(0, 0, eyebrow_radius, 5 * Math.PI / 4, 6.5 * Math.PI / 4);
      cr.stroke();
      // Draw the left iris/pupil.
      cr.rotate(Math.PI / 2 - Math.atan2(mouse_x, mouse_y));
      cr.translate(iris_move, 0);
      cr.scale(Math.cos(factor), 1);
      cr.arc(0, 0, eye_radius * IRIS_SIZE, 0, 2 * Math.PI);
      cr.fill();
      cr.restore();

      // Draw the right eye;
      cr.translate(right_center_x, center_y);
      cr.arc(0, 0, eye_radius, 0, 2 * Math.PI);
      cr.stroke();
      // Draw the right eyebrow.
      cr.arc(0, 0, eyebrow_radius, 5.5 * Math.PI / 4, 7 * Math.PI / 4);
      cr.stroke();
      // Draw the right iris/pupil.
      cr.rotate(Math.PI / 2 - Math.atan2(mouse_x, mouse_y));
      cr.translate(iris_move, 0);
      cr.scale(Math.cos(factor), 1);
      cr.arc(0, 0, eye_radius * IRIS_SIZE, 0, 2 * Math.PI);
      cr.fill();
      cr.restore();
    });
    icon._update_handler = Mainloop.timeout_add(50, () => {
      icon.queue_repaint();
      return true;
    });

    // icon.style_class = 'eye-icon';

    let hbox = new St.BoxLayout({ style_class: 'system-status-icon' });
    hbox.add_child(icon);
    // hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
    this._indicator.add_child(hbox);
    icon.queue_repaint();

    this._indicator.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this._indicator.menu.addAction(
      _('I am with you. Keep on!'),
      event => {

      });

//    Main.panel.addToStatusArea(indicatorName, this._indicator);
    Main.panel._addToPanelBox(indicatorName, this._indicator, -1, panel); 
  }

  disable() {
    // log(`disabling ${Me.metadata.name}`);
    this._indicator.destroy();
    this._indicator = null;
  }
}

function init() {
  // log(`initializing ${Me.metadata.name}`);
  return new Extension();
}
