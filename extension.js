const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter
const Cairo = imports.cairo
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const Mainloop = imports.mainloop
const PanelMenu = imports.ui.panelMenu;
const Lang = imports.lang


class Extension {
  constructor() {
    this._indicator = null;
  }

  enable() {
    log(`enabling ${Me.metadata.name}`);

    let indicatorName = `${Me.metadata.name} Indicator`;
    this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

    // let icon = new St.Icon({
    //   gicon: new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
    //   style_class: 'system-status-icon'
    // });

    let icon = new St.DrawingArea({width: 25, height: 25});
    icon._repaint_handler = icon.connect('repaint', Lang.bind(icon, function() {
      let halfsize = 12.5;
      let [area_x, area_y] = icon.get_transformed_position();
      let [mouse_x, mouse_y, mask] = global.get_pointer();
      mouse_x -= area_x + halfsize;
      mouse_y -= area_y + halfsize;

      const EYE_LINE_WIDTH = 1.5;
      const RELIEF_FACTOR = 6;
      const IRIS_MOVE = 0.66;
      const IRIS_SIZE = 0.55;
      const PUPIL_MOVE = 0.44;
      const PUPIL_SIZE = 0.15;

      let eye_rad = halfsize - EYE_LINE_WIDTH / 2;
      let factor = Math.sqrt(mouse_x * mouse_x + mouse_y * mouse_y) /
          (RELIEF_FACTOR * eye_rad);
      if (factor > 1) factor = 1;
      let iris_move = eye_rad * IRIS_MOVE * factor;
      let cr = icon.get_context();
      let theme_node = icon.get_theme_node();
      Clutter.cairo_set_source_color(cr, theme_node.get_foreground_color());

      cr.translate(halfsize, halfsize);

      cr.setLineWidth(EYE_LINE_WIDTH);
      cr.arc(0, 0, eye_rad, 0, 2 * Math.PI);
      cr.stroke();

      cr.setLineWidth(0);  // iris and pupil are filled
      cr.rotate(Math.PI / 2 - Math.atan2(mouse_x, mouse_y));
      cr.translate(iris_move, 0);
      cr.scale(Math.cos(factor), 1);

      cr.arc(0, 0, eye_rad * IRIS_SIZE, 0, 2 * Math.PI);
      cr.translate(iris_move * PUPIL_MOVE, 0.0);
      cr.newSubPath();
      cr.arc(0, 0, eye_rad * PUPIL_SIZE, 0, 2 * Math.PI);
      cr.setFillRule(Cairo.FillRule.EVEN_ODD);
      cr.fillPreserve();

      cr.save();
      cr.restore();
    }));
    icon._update_handler =
        Mainloop.timeout_add(100, Lang.bind(icon, function() {
          icon.queue_repaint();
          return true;
        }));


    this._indicator.add_child(icon);
    icon.queue_repaint();

    Main.panel.addToStatusArea(indicatorName, this._indicator);
  }

  disable() {
    log(`disabling ${Me.metadata.name}`);

    this._indicator.destroy();
    this._indicator = null;
  }
}


function init() {
  log(`initializing ${Me.metadata.name}`);

  return new Extension();
}
